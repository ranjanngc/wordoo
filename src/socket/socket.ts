import http from 'http'
import SocketIo from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import {IUserData, IGameData, IRegisterWord, IRoom} from './interfaces'
import { randomNumber } from '../db/words'
import { Socket } from 'socket.io-client'
const MAX_USER_IN_ROOM: number = 5;

const SocketRooms = new Array<IRoom>()
let io:any;
const InitializeSocket = (_server: http.RequestListener) => {
    const serverInstate = http.createServer(_server);
    io = new SocketIo.Server(serverInstate)

    io.on('connection', function(Socket: any) {

        Socket.on('LOG_IN', (data: IUserData) => {

            // find room with seat available for new user or create a new room
            let room = SocketRooms.find(room => room.users.length < MAX_USER_IN_ROOM)
            
            if(room){
                
                data.room = room.name
                data.socketId = Socket.id
                room.users.push(data)
                // set an active user if not yet
                if(room.users.find(user => user.active)){

                    room.users[0].active = true;
                    io.to(room.name).emit('MESSAGE', {user: 'bot', message: `${room.users[0].name} is choosing a word!`, bot: true})
                }
            }
            else {
                // new room
                room = {

                    name: uuidv4().substring(0,6), 
                    
                    game: {} as IGameData, 
                    users: [],
                    gameCount: 0,
                    roundCount: 0,
                    gameOver: false,
                    roundOver: false,activeUser:0,lastActiveUser:0
                }

                data.socketId = Socket.id
                data.room = room.name
                room.users.push(data)
                SocketRooms.push(room)
            }
            
            Socket.join(room.name)
            // notify team members for new player
            io.to(room.name).emit('REFRESH_USER_LIST',  { users: room.users })
            io.to(room.name).emit('MESSAGE', {user: 'bot', message: `${data.name} joined!`, bot: true})
        })

        Socket.on('REGISTER-WORD', (data: IUserData) => {
            
            const room = SocketRooms.find(room => room.name === data.room)

            if(room){

                room.gameCount++;
                room.game.currentWord = data.word
                room.game.startTime = new Date().getTime()
                room.game.endTime = room.game.startTime + (50*1000);
                room.game.hintWord = [...data.word].map((c)=> c === ' ' ? '_' : '')

                io.to(room.name).emit('GAME_HINT',  { hint: room.game.hintWord, guessTime: 50, start: true  })
            }
        })

        Socket.on("disconnect", (data: IUserData) => {
            
            const room = SocketRooms.find(room => room.users.find(user => user.socketId === Socket.id))

            if(room){

                const userLeft = room.users.find((item) => item.socketId === Socket.id)

                if(userLeft){

                    room.users.splice(room.users.indexOf(userLeft), 1)
                    
                    io.to(room.name).emit('REFRESH_USER_LIST', {users: room.users})
                    io.to(room.name).emit('MESSAGE', {user: 'bot', message: `Player ${userLeft.name} left`, bot: true})

                    if(userLeft.active){
                        // TODO
                        gameUtil.endGame(room, io)
                    }
                }

                Socket.leave(room.name)
            }
        });

        Socket.on('SEND_DRAWING', (data:any) => {
            
            const room = SocketRooms.find(r => r.name === data.user.room)
            if(room){

                io.to(room.name).emit('DRAWING', data)
            }
        })

        Socket.on('SEND_MESSAGE', (data:IUserData) => {
            
            const room = SocketRooms.find(room => room.name === data.room)
            if(room){
                let messageData = {} as IUserData

                if(room.game.currentWord.toLocaleLowerCase() === data.message.toLocaleLowerCase()){

                    const winUser = room.users.find(user => user.name == data.name)
                    if(winUser && !winUser.won){
                        winUser.won = true
                        let score = room.game.currentWord.length * 100
                        const delay = (new Date().getTime() - room.game.startTime) /1000
                        score = Math.floor(score / delay)
                        winUser.score = winUser.score || 0
                        winUser.score += score
                        console.log(delay, winUser.score)
                        messageData.name = data.name
                        messageData.message = `${winUser.name} guessed the word!`
                        messageData.won= true;
                        io.in(room.name).emit('MESSAGE', messageData)
                    }

                    // Move the game to next player if all player guessed the word
                    const activeUser = room.users.filter((user) => user.won)
                    
                    if(activeUser && activeUser.length === room.users.length -1){
                        // TODO
                        gameUtil.endGame(room, io)
                    }
                    else
                    {
                        io.to(room.name).emit('REFRESH_USER_LIST',  { users: room.users, roundOver: room.roundOver,  gameOver: room.gameOver, room: room.name })
                    }
                }
                else {
                    messageData.message = data.message
                    messageData.name = data.name
                    io.to(room.name).emit('MESSAGE', data)
                }
            }
        })

        Socket.on('KICK', (data: IUserData) =>{
            const room = SocketRooms.find(r => r.name === data.room);
            if (room) {
                room.game.kickVote = room.game.kickVote ?? []
                const kickUser = room.users[room.activeUser]
                //const kickUser = room.users.find(user => user.name === data.user.message)

                if(kickUser && room.game.kickVote.indexOf(data.name) === -1){

                    room.game.kickVote.push(data.name)
                    io.to(room.name).emit('MESSAGE', { user: 'bot', message: `Player ${data.name} voted to kick ${kickUser.name}`, bot: true });
                }

                if(room.game.kickVote.length >= Math.ceil(room.users.length/2)){
                    io.to(room.name).emit('KICK', kickUser)
                }
            }
        })
    }) 
    
    serverInstate.listen(process.env.PORT ?? 4040);

    console.log('listening on http://ranjan:4040')
}

const gameUtil = 
{
    endGame: function(room: IRoom, io: any){

        if(room){

            room.game.lastHintTime = 0
        }

        const userAnswered = room.users.filter((user)=> user.won);

        if(userAnswered){

            if(room.activeUser >= 0 && room.users[room.activeUser]){

                room.users[room.activeUser].score += userAnswered.length * 100;
            }
        }
        
        room.lastActiveUser = room.activeUser
        room.activeUser +=1

        if(room.activeUser >= room.users.length || !room.users[room.activeUser]){

            room.activeUser = 0
        }
        
        room.users.forEach((user)=> {

            user.active = false
            user.won = false
        })

        if(room.users[room.activeUser]){

            room.users[room.activeUser].active = true;
        }
        else if(room.users[0]){

            room.users[0].active = true;
        }
        
        if(room.game.currentWord){

            io.to(room.name).emit('GAME_COMPLETE', {currentWord: room.game.currentWord.toUpperCase()})
        
            io.to(room.name).emit('MESSAGE', {user: 'bot', message: `The word was "${room.game.currentWord.toUpperCase()}"`, bot: true, completed: true})
        }
        room.game.currentWord = '';
        if(room.users[room.activeUser]){

            io.to(room.name).emit('MESSAGE', {user: 'bot', message: `Player ${room.users[room.activeUser].name} is choosing a word!`, bot: true})
        }

        //Round completed clear score history
        const gameDone = room.gameCount > 10
        if(gameDone){

            room.gameCount = 1;
            room.users.forEach((user)=>{
                user.score = 0
            })
        }

        io.to(room.name).emit('REFRESH_USER_LIST', {users: room.users, completed: true, gameOver : room.gameOver, roundOver: room.roundOver})
    }
}

const GlobalTimer = setInterval(()=>{

    SocketRooms.forEach(room => {

        if(room.game.currentWord){

            const diff = (new Date().getTime() - (room.game.lastHintTime || room.game.startTime))/1000
            const fullDiff = (new Date().getTime() - (room.game.startTime))/1000

            if(diff >= 20){

                const index = randomNumber(1, room.game.currentWord.length)
                const wordMap = [...room.game.currentWord].map((c,i)=> i===index ? c : '')
    
                wordMap.forEach((c,i) => {

                    if(c !== '')
                    room.game.hintWord[i]=c.toUpperCase();
                })

                room.game.lastHintTime = new Date().getTime()
                io.to(room.name).emit('GAME_HINT',  { hint: room.game.hintWord, guessTime: room.game.totalSeconds })
            }
            else if(fullDiff >= 50){
    
                gameUtil.endGame(room, io)
            }
        }

        const activeUser = room.users.find(user => user.active);
        if(!activeUser){

            gameUtil.endGame(room, io)
        }
    });
}, 5000)

const SocketUtil = {
    Initialize: InitializeSocket
}
export {  SocketUtil }