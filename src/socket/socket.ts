import http from 'http'
import SocketIo from 'socket.io'
import uuid from 'uuid'
import {IUserData, IGameData, IRegisterWord, IRoom} from './interfaces'
const MAX_USER_IN_ROOM: Number = 10;

const SocketRooms = new Array<IRoom>()

const InitializeSocket = (_server: http.RequestListener) => {
    const serverInstate = http.createServer(_server);
    //const io = Socket(serverInstate);
    const io = new SocketIo.Server(serverInstate)

    io.on('connection', function(Socket: any) {

        Socket.on('LOG_IN', (data: IUserData) => {

            // find room with seat available for new user or create a new room
            let room = SocketRooms.find(room => room.users.length < MAX_USER_IN_ROOM)
            
            if(room){
                
                data.room = room.name
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
                    name: uuid.v4(), 
                    game: {} as IGameData, 
                    users: [],
                    gameCount: 0,
                    roundCount: 0,
                    gameOver: false,
                    roundOver: false,activeUser:0,lastActiveUser:0
                }
                data.room = room.name
                room.users.push(data)
                SocketRooms.push(room)
            }
            
            // notify team members for new player
            io.to(room.name).emit('REFRESH_USER_LIST',  { users: room.users, room: room.name })
            io.to(room.name).emit('MESSAGE', {user: 'bot', message: `${data.name} joined!`, bot: true})
        })

        Socket.on('REGISTER-WORD', (data: IRegisterWord) => {
            
            const room = SocketRooms.find(room => room.name === data.room)

            if(room){

                room.gameCount++;
                room.game.currentWord = data.word
                room.game.startTime = new Date().getTime()
                room.game.endTime = room.game.startTime + (50*1000);
                const hintWord = [...data.word].map((c)=> c === ' ' ? '_' : '')

                io.to(room.name).emit('GAME_HINT',  { hint: hintWord, guessTime: 50, start: true  })
            }
        })

        Socket.on("disconnect", (data: IUserData) => {
      
            const room = SocketRooms.find(room => room.name === data.room)

            if(room){

                const userLeft = room.users.find((item) => item.name === data.name)

                if(userLeft){
                    room.users.splice(room.users.indexOf(userLeft), 1)
                    io.to(room.name).emit('REFRESH_USER_LIST', {users: room.users})
                    io.to(room.name).emit('MESSAGE', {user: 'bot', message: `Player ${userLeft.name} left`, bot: true})

                    if(userLeft.active){
                        // TODO
                        gameUtil.endGame(room, io)
                    }
                }
            }
        });

        Socket.on('SEND_DRAWING', (data:any) => {

            const room = SocketRooms.find(room => room.name === data.room)
            if(room){

                io.to(room.name).emit('DRAWING', data)
            }
        })

        Socket.on('SEND_MESSAGE', (data:IUserData) => {

            const room = SocketRooms.find(room => room.name === data.room)
            if(room){
                
                if(room.game.currentWord.toLocaleLowerCase() === data.message.toLocaleLowerCase()){

                    const winUser = room.users.find(user => user.name == data.name)

                    if(winUser && !winUser.won){
                        winUser.won = true
                        let score = room.game.currentWord.length * 100
                        const delay = (new Date().getTime() - room.game.startTime) /1000
                        score = Math.floor(score / delay)
                        winUser.score += score

                        io.in(room.name).emit('MESSAGE', {message: `${winUser.name} guessed the word!`, user: 'bot', score: winUser.score, bot: true, won: true})
                    }

                    // Move the game to next player if all player guessed the word
                    const activeUser = room.users.filter((user) => user.won)
                    if(activeUser && activeUser.length === room.users.length -1){
                        // TODO
                        gameUtil.endGame(room, io)
                    }
                    else
                    {
                        io.to(room.name).emit('REFRESH_USER_LIST',  { users: room.users, round: room.roundCount })
                    }
                }
                else {
                    io.to(room.name).emit('MESSAGE', data)
                }
            }
        })
    })  
}

const gameUtil = 
{
    endGame: function(room: IRoom, io: any){
        if(room){
            room.game.lastHintTime = 0
        }

        const userAnswered = room.users.filter((user)=> user.won);

        if(userAnswered){
            if(room.activeUser != -1 && room.users[room.activeUser]){
                room.users[room.activeUser].score += userAnswered.length * 100;
            }
        }
        
        room.lastActiveUser = room.activeUser
        room.activeUser +=1

        if(room.activeUser >= room.users.length || !room.users[room.activeUser]){

            room.activeUser = 0
        }
        
        room.users.forEach((user)=>{
            user.active = false
            user.won = false
        })

        if(room.users[room.activeUser]){
            room.users[room.activeUser].active = true;
        }
        else if(room.users[0]){
            room.users[0].active = true;
        }
        
        io.to(room.name).emit('GAME_COMPLETE', {currentWord: room.game.currentWord.toUpperCase()})
        
        io.to(room.name).emit('MESSAGE', {user: 'bot', message: `The word was "${room.game.currentWord.toUpperCase()}"`, bot: true, completed: true})
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
        io.to(room.name).emit('REFRESH_USER_LIST', {users: room.users, completed: true, roundUp : gameDone, game: room.game})
    }
}