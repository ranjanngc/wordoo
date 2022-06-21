export interface IUserData {
    name: string,
    active: boolean,
    score: number,
    room: string,
    message: string,
    won: boolean,
    draw: Array<any>,
    word: string,
    socketId: string
}

export interface IGameData {

    currentWord: string,
    hintWord: string[],
    startTime: number,
    lastHintTime: number,
    endTime: number,
    totalSeconds: number,
    
    hintProvider: {},
    gameEndHandler: {}
}

export interface IRoom {

    name: string,
    game: IGameData,
    users: Array<IUserData>,
    gameCount: number,
    roundCount: number,
    gameOver: boolean,
    roundOver: boolean,
    activeUser: number,
    lastActiveUser:number,
}

export interface IRegisterWord {
    word: string,
    user: string,
    room: string
}

export interface ISocketData {
    users: Array<IUserData>,
    roundOver: boolean,
    gameOver: boolean,
}

// export default IUserData
// export { IUserData, IGameData, IRegisterWord, IRoom, IGameData}