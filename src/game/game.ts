interface IUser {
    id: string,
    name: string
    doneForRound: Boolean,
    score: number
}

interface IRoom {
    round: number,
    game: number,
    currentWord: String,
    startTime: Date,
    endTime: Date,
    totalSeconds: number,
    activeUserIndex: number,
    roomName: String,
    users: Array<IUser>
    gameScore: []
}

const game = {
    db : {
        default: {
            round:1,
            game:0,
            currentWord: '',
            startTime: null,
            endTime: null,
            totalSeconds: 0,
            activeUserIndex: 0,
            roomName: '',
            users: Array<IUser>(),
            gameScore: []
        }
    },

    isWinner: function(io: any, socketId: string, message: string){
        if(this.db.default.currentWord && message.toLowerCase() === this.db.default.currentWord?.toLowerCase()){
            const winUser = this.db.default.users.find((item) => item.id !== socketId)!
            
              if(!winUser.doneForRound){
                  const gt = ((new Date().getTime())- this.db.default.startTime!)/1000;
                  winUser.score += Math.floor(5000/gt);
                  winUser.doneForRound = true
                  
                  io.emit('MESSAGE', {message: `guessed the word!`, user: winUser.name, score: winUser.score})
                  io.emit('REFRESH_USER_LIST',  { users: this.db.default.users })
              }
          }
    }
}

export default game