const path = require("path");
const express = require("express");
const { createSSRApp } = require("vue");
const { renderToString } = require("@vue/server-renderer");
const manifest = require("../dist/manifest.json");
const { getWords, randomNumber} = require('./db/words.js')
var http = require('http');
const { data } = require("autoprefixer");
const { clearInterval } = require("timers");
const server = express();


server.use("/assets", express.static(path.join(__dirname, "../dist", "assets")));
// server.use("/js", express.static(path.join(__dirname, "../dist", "js")));
// server.use("/css", express.static(path.join(__dirname, "../dist", "css")));
server.use(
    "/favicon.ico",
    express.static(path.join(__dirname, "../dist", "favicon.ico"))
);

server.get("/", async (req, res) => {

    res.sendFile(path.join(__dirname, "../dist", "index.html"))
});

server.get("/random/", async (req, res) => {

    res.send(getWords())

});

console.log(`
    You can navigate to http://ranjan:${process.env.PORT ?? 4040}
`);

const GlobalTimer = setInterval(()=>{

    if(userList.default.currentWord){

        const diff = (new Date().getTime() - (userList.default.lastHintTime || userList.default.startTime))/1000
        const fullDiff = (new Date().getTime() - (userList.default.startTime))/1000

        if(diff >= 20){
            const index = randomNumber(1, userList.default.currentWord.length)
            const wordMap = [...userList.default.currentWord].map((c,i)=> i===index ? c : '')

            wordMap.forEach((c,i) => {
                if(c !== '')
                userList.default.hintWord[i]=c.toUpperCase();
            })
            userList.default.lastHintTime = new Date().getTime()
            io.emit('GAME_HINT',  { hint: userList.default.hintWord, guessTime: userList.default.totalSeconds })
        }
        else if(fullDiff >= 50){

            gameUtil.endGame()
        }
    }
}, 5000)

const gameUtil = 
{
    endGame: function(){
        userList.default.lastHintTime = null

        const userAnswered = userList.default.users.filter((user)=> user.doneForRound);

        if(userAnswered){
            if(userList.default.activeUserIndex != -1 && userList.default.users[userList.default.activeUserIndex]){
                userList.default.users[userList.default.activeUserIndex].score += userAnswered.length * 100;
            }
            //userList.default.gameScore.push({name: user.name, score: user.score})
        }
        
        userList.default.lastActiveUserIndex = userList.default.activeUserIndex
        userList.default.activeUserIndex +=1

        if(userList.default.activeUserIndex >= userList.default.users.length || !userList.default.users[userList.default.activeUserIndex]){

            userList.default.activeUserIndex = 0
        }
        
        userList.default.users.forEach((user)=>{
            user.active = false
            user.game+=1;
            user.doneForRound = false
        })

        if(userList.default.users[userList.default.activeUserIndex]){
            userList.default.users[userList.default.activeUserIndex].active = true;
        }
        else{
            userList.default.users[0].active = true;
        }
        
        io.emit('GAME_COMPLETE', {currentWord: userList.default.currentWord.toUpperCase()})
        
        io.emit('MESSAGE', {user: 'bot', message: `The word was "${userList.default.currentWord.toUpperCase()}"`, bot: true, completed: true})
        userList.default.currentWord = '';
        if(userList.default.users[userList.default.activeUserIndex]){
            io.emit('MESSAGE', {user: 'bot', message: `Player ${userList.default.users[userList.default.activeUserIndex].name} is choosing a word!`, bot: true})
        }

        //Round completed clear score history
        const gameDone = userList.default.game > 5
        if(gameDone){
            userList.default.game = 1;
            userList.default.users.forEach((user)=>{
                //user.active = false
                user.game=1;
                user.score = 0
                //user.doneForRound = false
            })
        }
        io.emit('REFRESH_USER_LIST', {users: userList.default.users, completed: true, roundUp : gameDone, game: userList.default.game})
    }
}

const serverInstate = http.createServer(server);
const io = require('socket.io')(serverInstate);
const userList = {
    default: {
        round:1,
        game:1,
        currentWord: '',
        hintWord: [],
        startTime: null,
        lastHintTime: null,
        endTime: null,
        totalSeconds: 0,
        activeUserIndex: 0,
        lastActiveUserIndex:0,
        roomName: '',
        users: [],
        gameScore: [],
        hintProvider: {},
        gameEndHandler: {}
    }
}

io.on('connection', function(socket) {

    socket.on('SEND_DRAWING', (data) => {
      io.emit('DRAWING', data)
    })

    socket.on('SEND_MESSAGE', (data) => {

        if(userList.default.currentWord && data.message.toLowerCase() === userList.default.currentWord?.toLowerCase()){
          const winUser = userList.default.users.find((item) => item.name === data.user)
          
            if(!winUser.doneForRound){

                // console.log(data, winUser)
                const gt = ((new Date().getTime())- userList.default.startTime)/1000;
                winUser.score += Math.floor(2000/gt);
                //userList.default.gameScore.push({name: winUser.name, score: winUser.score})
                winUser.doneForRound = true
                io.emit('MESSAGE', {message: `${winUser.name} guessed the word!`, user: 'bot', score: winUser.score, bot: true})

                const au = userList.default.users.filter((user) => user.doneForRound)
                io.emit('REFRESH_USER_LIST',  { users: userList.default.users, round: userList.default.game })
                if(au && au.length === userList.default.users.length-1){
                    gameUtil.endGame()
                }
               
            }
        }
        else{
           
            io.emit('MESSAGE', data)
        }
    })

    socket.on('LOG_IN', (data) => {

      userList.default.users.push({name: data.user, id: socket.id, score: 0, doneForRound: false})

      // has active user
      const activeUser = userList.default.users.find((user)=> user.active)
      if(!activeUser && userList.default.users.length > 1){
            userList.default.users[0].active = true;
            userList.activeUser = 0;

            io.emit('MESSAGE', {user: 'bot', message: `Player ${userList.default.users[0].name} is choosing a word!`, bot: true})
      }

      io.emit('REFRESH_USER_LIST',  { users: userList.default.users })
      io.emit('MESSAGE', {user: 'bot', message: `Player ${data.user} joined!`, bot: true})
    })

    socket.on('REGISTER-WORD', (data) => {
       
        userList.default.game+=1;
        userList.default.currentWord = data.word;
        userList.default.startTime = new Date().getTime()
        const wordMap = [...data.word].map(()=> '')
        userList.default.hintWord = wordMap
        const tm = new Date();
        userList.default.totalSeconds = 50 //(wordMap.length * 10) + 20
        userList.default.endTime =  tm.setSeconds(tm.getSeconds() + (userList.default.totalSeconds))
        
        userList.default.users.forEach((user)=>{
            user.game = userList.default.game
            user.round = userList.default.round
        })

        io.emit('GAME_HINT',  { hint: wordMap, guessTime: userList.default.totalSeconds })
    })

    socket.on("disconnect", (data) => {
      
        const userLeft = userList.default.users.find((item) => item.id === socket.id)
        userList.default.users = userList.default.users.filter((item) => item.id !== socket.id)
        io.emit('REFRESH_USER_LIST', {users: userList.default.users})

        if(userLeft)
        {
            io.emit('MESSAGE', {user: 'bot', message: `Player ${userLeft.name} left`, bot: true})
            if(userLeft.active){
                gameUtil.endGame()
                userList.default.activeUserIndex = -1
            }
        }
    });
    
});

serverInstate.listen(process.env.PORT ?? 4040);