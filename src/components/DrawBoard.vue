<!-- Please remove this file from your project -->
<template>
    <div class="flex flex-col h-full w-full">
        <div class="flex flex-row">
            <ul class="flex flex-row text-left">
                <li 
                    v-for="user in scoreList" 
                    
                    class="text-sm select-none m-1">
                        {{user.name}}
                        <span 
                        :class="(doneForRound ? 'bg-green-700 text-white': 'bg-red-100 text-red-800')"
                        class="align-right text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                            {{user.score}}
                        </span>
                </li>
            </ul>
            <div class="ml-auto border rounded-xl text-center w-10 h-7 mr-1 font-bold text-white bg-blue-600">{{counter}}</div>
        </div>
        <div v-show="kicked" class="text-5xl text-red-700 bg-yellow-300">You Have Been Kicked</div>
        <div v-show="!kicked && userWords.length === 0 && !gameCompleted" class="m-1 h-4/5" >
            <p class="absolute select-none p-2 bg-yellow-500 text-white rounded-lg text-base" :class="{'flyout': showMessage}" v-show="showMessage">{{currentMessage}}</p>
            <canvas
                class="border position-relative touch-none border-b-2"
                ref="canvasRef"
                id="canvasRef"
                @mousemove="draw"
                @mousedown="setPosition"
                @mouseup="drawFinal"
                @touchmove="draw"
                @touchstart="setPosition"
                @resize="resize"
            ></canvas>
            <div class="" v-show="isActive">
                <div class="flex flex-row ">
                    <div class="w-5 h-5 m-1" :style="{'background-color':strokeColor}"></div>
                    <div class="bg-slate-900 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(15 23 42)'"></div>
                    <div class="bg-blue-500 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(59 130 246)'"></div>
                    <div class="bg-blue-800 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(30 64 175)'"></div>
                    <div class="bg-green-500 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(34 197 94)'"></div>
                    <div class="bg-green-700 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(21 128 61)'"></div>
                    <div class="bg-red-500 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(239 68 68)'"></div>
                    <div class="bg-red-800 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(153 27 27)'"></div>
                    <div class="bg-yellow-500 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(234 179 8)'"></div>
                    <div class="bg-orange-500 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(249 115 22)'"></div>
                    <div class="bg-pink-500 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(236 72 153)'"></div>
                    <div class="bg-purple-500 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(168 85 247)'"></div>
                    <div class="bg-white w-5 h-5 rounded-xl m-1 border-black border" @click="strokeColor='rgb(255 255 255)'"></div>
                    <div class="bg-cyan-400 w-5 h-5 rounded-xl m-1" @click="strokeColor='rgb(34 211 238)'"></div>
                    <div class="bg-gray-400 m-1"  @click="clearCanvas">Rst</div>
                    <div class="bg-gray-400 m-1"  @click="fillCanvas">Fll</div>
                    <input type="range" orient="vertical" min="1" max="30" step="1" class="w-20 m-1" v-model="strokeWidth">
                </div>
            </div>

                <input v-show="!isActive" type="text" 
                    class="w-full border border-black border-solid pl-2 relative h-7"
                    placeholder="guess the word" 
                    v-model="text" @keypress="sendMessage" maxlength="30">
                <button 
                    @click="voteKickUser" 
                    class="text-center p-1 absolute top-10 flex text-base bg-orange-400 hover:bg-orange-600 border rounded-lg" 
                    v-show="activeUser!=='' && !isVoted && !isActive">
                        Kick {{ activeUser }}
                </button>

            <div class="flex flex-row" v-show="!isActive">
                <div v-for="char in hint" class="border align-middle w-10 h-10 rounded-sm text-3xl text-red-600 border-orange-500 border-1 text-center">{{char}}</div>
            </div>
        </div>
        <div v-show="userWords.length>0 && !kicked" class="flex flex-col p-5 align-middle">
            <h1 class="text-1xl text-orange-700 mb-8" v-show="currentWord">The word was - {{currentWord.toUpperCase()}}</h1>
            
            <h3 class="font-bold">Your turn now, choose a word and draw it and let your friends guess it</h3>
            <button 
                v-for="word in userWords" 
                @click="setWord(word)" 
                class="bg-cyan-400 :focus:bg-cyan-400 hover:bg-violet-600 active:bg-violet-700 m-1 pl-2 pr-2 rounded-sm h-40 w-full text-4xl">
                {{word}}
            </button>
        </div>

        <div v-show="userWords.length==0 && gameCompleted" class="align-middle h-1/2">

            <div class="flex flex-col px-6 py-4 shadow-lg animate-bounce mt-10 text-center">
                <h1 class="text-3xl">The word was</h1>
                <h1 class="text-5xl text-orange-700 mb-8">{{currentWord.toUpperCase()}}</h1>
                <div class="font-bold text-xl mb-2">{{roundUp ? 'Round UP': 'Score'}}</div>
                
                <div v-show="!roundUp" v-for="(user, index) in scoreList" class="text-orange-600 mr-1 text-base">
                    {{user.name + ':  ' + user.score}}
                </div>
                <p v-if="loginUsers.find(u => u.active)">{{(loginUsers.filter(u=> u.active))[0].name}} is choosing a word!</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, nextTick, resolveComponent } from 'vue'
import io from 'socket.io-client'
import {NameUtility} from '../db/names'
import siteConfig from '../../site.config.json'
//import siteConfig from '../../site.config.json'
import { computed } from '@vue/reactivity';
import {IUserData, ISocketData} from './../socket/interfaces'


let strokeColor = ref('rgb(15 23 42)')
const strokeWidth = ref(1)
const pos = {x:0,y:0}
const canvasRef = ref({})
const chatdiv = ref({})
const socket = io(siteConfig.socket)
const text = ref('')
// let messageStore = ref(Array<IMessage>())
const message = ref('')
const isActive = ref(false)
// messageStore.value = []
let lastMessage = ''
const drawData = {data: new Array<any>()}
const currentWord = ref('')
const hint = ref(Array<string>())
const playerName = NameUtility.random();
const loginUsers = ref(Array<IUserData>())
loginUsers.value = []
const userWords = ref([])
userWords.value = []
const gameCompleted = ref(false)
const doneForRound = ref(false)
const roundUp = ref(false)
const currentMessage = ref('')
const showMessage = ref(false)
const counter = ref(0)
let intervalHandler:any
let kickHandler:any
const kicked = ref(false)
const clockAudio = new Audio('/assets/clock.mp3')
const winAudio = new Audio('/assets/win.mp3')
const currentUser = ref<IUserData | undefined>()
const isVoted = ref(false)
const setPosition = (e:MouseEvent|TouchEvent) => {

    if(e.type === 'mousemove' || e.type === 'mousedown'){

        const evt = e as MouseEvent
        const target = evt.target as any
        const rect = target.getBoundingClientRect()
        pos.x = evt.pageX - rect.left
        pos.y = evt.pageY - rect.top
    }
    else{
        const evt = e as TouchEvent
        const target = evt.target as any
        const rect = target.getBoundingClientRect()
        pos.x = evt.touches[0].pageX - rect.left
        pos.y = evt.touches[0].pageY - rect.top

    }
}

const resize = () => {

    const ctx = (canvasRef.value as HTMLCanvasElement).getContext("2d")!;
    const data = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height )
    ctx.canvas.width = window.innerWidth - 10;
    ctx.canvas.height = window.innerHeight - 115;

    ctx.putImageData(data, 0, 0)
}

interface IDrawing{
    x: number,
    y: number,
    mx: number,
    my: number,
    ss: string,
    lw: number,
    fl: string
}
const drawFromObject= (draw:IDrawing) =>{
    const ctx = (canvasRef.value as HTMLCanvasElement).getContext("2d")!;
    ctx.beginPath();

    if(draw.fl){
        ctx.rect(0, 0, (canvasRef.value as any).width, (canvasRef.value as any).height);
        ctx.fillStyle = strokeColor.value
        ctx.fill();
    }else{
        ctx.lineWidth = draw.lw
        ctx.lineCap = "round";
        ctx.strokeStyle = draw.ss;
        ctx.moveTo(draw.x, draw.y);
        ctx.lineTo(draw.mx, draw.my);
        ctx.stroke();
    }
}

const drawFromArray = (drawArray: Array<any>[]) => {
    
    const ctx = (canvasRef.value as HTMLCanvasElement).getContext("2d")!;
    let drawIndex = 0;
    const drawInterval = setInterval(()=>{

        const draw = drawArray[drawIndex]
        const widthOffset = ctx.canvas.width / (draw[6] )
        const heightOffset = ctx.canvas.height / (draw[7])
        ctx.beginPath();

        if(draw.length >= 9){
            ctx.rect(0, 0, (canvasRef.value as any).width, (canvasRef.value as any).height);
            ctx.fillStyle = draw[8].toString()
            ctx.fill();
        }else{
            
            ctx.lineCap = "round";
            
            ctx.moveTo(draw[0] * widthOffset, draw[1] * heightOffset);
            ctx.lineTo(draw[2] * widthOffset, draw[3] * heightOffset);
            ctx.strokeStyle = draw[4] as any;
            ctx.lineWidth = draw[5]
            ctx.stroke();
        }
        drawIndex++

        if(drawIndex == drawArray.length){
            clearInterval(drawInterval)
        }
    },10)
    drawArray.forEach((draw: number[]) => {
       
    })

}

const draw = (e:any) => {

    
    if (!isActive.value || ((e.type === 'mousemove' || e.type === 'mousedown') && (e.buttons !== 1))) {
        return;
    }
    //e.preventDefault();

    
    const ctx = (canvasRef.value as HTMLCanvasElement).getContext("2d")!;
    ctx.beginPath();
    ctx.lineWidth = strokeWidth.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = strokeColor.value;
    ctx.moveTo(pos.x, pos.y);
    const drawingArr = new Array<any>()
    const drawing = {} as IDrawing;
    
    drawing.x = pos.x
    drawing.y= pos.y
    drawingArr.push(pos.x) // 0
    drawingArr.push(pos.y) // 1

    setPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    drawing.mx = pos.x
    drawing.my= pos.y

    drawingArr.push(pos.x) // 2
    drawingArr.push(pos.y) // 3

    drawingArr.push(strokeColor.value) // 4
    drawingArr.push(strokeWidth.value) // 5

    drawing.ss = strokeColor.value
    drawing.lw = strokeWidth.value
    
    drawingArr.push(ctx.canvas.width) // 6
    drawingArr.push(ctx.canvas.height) // 7
    drawData.data.push(drawingArr);

    if(drawData.data.length > 20){
        const arrToSend = [...drawData.data]
        nextTick(()=>{
            sendDraw(arrToSend)
        })
        drawData.data = new Array<any>()
    }
}

const drawFinal = (e:any) =>{
    if(drawData.data.length > 0){
        const arrToSend = [...drawData.data]
        nextTick(()=>{
            sendDraw(arrToSend)
        })
        drawData.data = new Array<any>()
    }
}

const clearCanvas = () => {

    const prevSV = strokeColor.value

    strokeColor.value = "rgb(255 255 255)"
    fillCanvas()
    strokeColor.value = prevSV
}

const fillCanvas = () => {

    const ctx = (canvasRef.value as any).getContext("2d");
    ctx.beginPath();
    ctx.rect(0, 0, (canvasRef.value as any).width, (canvasRef.value as any).height);
    ctx.fillStyle = strokeColor.value
    ctx.fill();
    //nextTick(()=>{
        const drawing = [0,0,0,0,0,0,0,0,strokeColor.value] as Array<any>
        const drawingArr = new Array<any>()
        drawingArr.push(drawing)
        //drawing.fl = strokeColor.value
        sendDraw(drawingArr)
    //})
}

const sendDraw = async (draw:number[]) => {
    const ctx = (canvasRef.value as any);//.getContext("2d")!;
    if( currentUser.value){
        currentUser.value.draw = draw
        await socket.emit('SEND_DRAWING', {
            user: currentUser.value
        })
    }
}

const sendMessage = (e:KeyboardEvent) =>{

    if(e.key === "Enter" && text.value.trim() !== '' && lastMessage!== text.value.trim()){
        if(currentUser.value != null){
            currentUser.value.message = text.value.trim()
            socket.emit('SEND_MESSAGE', currentUser.value)
            lastMessage = text.value.trim()
            text.value = ''
        }
    }
}

const getWord = () =>{

    fetch('/random')
    .then(response => response.json())
    .then((words)=>{
        console.log(words)
        userWords.value = words
    });
}

const setWord = (word:string) => {
    clearInterval(kickHandler)

    if(currentUser.value){

        currentUser.value.word = word
        socket.emit('REGISTER-WORD',  currentUser.value)
        userWords.value = []
    }
}
const showChatMessage = (data: IUserData) =>{
    currentMessage.value = `${data.name}: ${data.message}`
    showMessage.value = true

    window.setTimeout(()=>{
        currentMessage.value = ''
        showMessage.value=false;
    },4000)
}

const sortByScore = ( a:IUserData, b:IUserData ) => {
    if ( a.score > b.score ){
        return -1;
    }
    if ( a.score < b.score ){
        return 1;
    }
    return 0;
}

const activeUser = computed(()=>{
    let activeUser = ''
    if(loginUsers){
        activeUser = loginUsers.value.find(user=> user.active)?.name ?? ''
    }

    return activeUser;
})

const scoreList = computed(() =>{

    return loginUsers.value.sort(sortByScore) 
})

const voteKickUser = () =>{
    socket.emit('KICK',  currentUser.value)
    isVoted.value = true
}

onMounted(()=>{

    window.addEventListener('resize', resize)
    socket.on('MESSAGE', (data: IUserData) =>{

        const pElem = document.createElement("p")
        pElem.classList.add(...["absolute", "select-none", "p-2", "text-black", "rounded-lg", "text-base", "text-bold"])
        
        pElem.classList.add(...(data.message.indexOf('guessed') || !data.name) > -1 ? ['bg-green-500', 'flyout-guessed'] : ['bg-yellow-500','flyout'])

        pElem.innerText = data.name ? data.name + ': '+data.message : data.message
        document.body.appendChild(pElem)
        window.setTimeout(()=>{
            document.body.removeChild(pElem)
        },5000)

        if(data.won){
            const audio = new Audio('/assets/win.mp3')
            audio.play();
        }

        if(data.message.indexOf('joined!') != -1 || data.message.indexOf('left') != -1){
           winAudio.play()
        }
    })

    socket.on('DRAWING', (data: any) =>{

        if(data.name !== currentUser.value?.name){
            
            drawFromArray(data.user.draw)
        }
    })

    socket.on('REFRESH_USER_LIST', (data: ISocketData) => {
        
        console.log(data)
        gameCompleted.value = data.gameOver
        roundUp.value = data.roundOver
        
        loginUsers.value = data.users

        if(currentUser.value === undefined){

            currentUser.value = data.users.find((user:IUserData) => user.name === playerName) ?? undefined
        }

        data.users.forEach((user:any) => {
            if(user.name === playerName && !isActive.value){
                isActive.value = user.active

                if(isActive.value){
                    getWord()
                }
            }
        });

        doneForRound.value = (data.users.find((u:IUserData)=> u.won && u.name === playerName) != null)

        if(doneForRound){
            clearInterval(intervalHandler)
        }
    })

    socket.on('disconnect', (data:any) => {
        socket.emit('LOG_OUT', currentUser.value)
    })

    socket.on('GAME_HINT', (data: any) => {
        gameCompleted.value = false
        hint.value = data.hint

        if(data.start){
            clearInterval(intervalHandler)
            counter.value = data.guessTime
            intervalHandler = setInterval(()=>{
                counter.value -=1

                if(counter.value === 0 || doneForRound.value){
                     clearInterval(intervalHandler)
                }
            }, 1000)
        }
    })

    socket.on('GAME_COMPLETE', (score)=>{
        currentWord.value = score.currentWord
        isActive.value=false
        userWords.value = []
        nextTick(()=> clearCanvas())
        isVoted.value = false  
    })

    socket.on('KICK', (data) => {
        if(data.name === currentUser.value?.name){
            socket.disconnect()
            kicked.value = true
        }
    })

    socket.emit('LOG_IN', {
        name: playerName
    })
    
    document.body.addEventListener("touchstart", (e) => {
        if (e.target == canvasRef.value) {
            e.preventDefault();
        }
    })
    document.body.addEventListener("touchmove", (e) => {
        if (e.target == canvasRef.value) {
            e.preventDefault();
        }
    })

    // set canvas size
    resize()
})
</script>
<style>
@keyframes flyout-animation {
  0%   {left:60px; top:30px;}
  25%  {background-color:yellow; color: black; left:60px; top:100px;}
  50%  {background-color:orange; color: black; left:60px; top:200px;}
  100%  {background-color:transparent; color: transparent; left:60px; top:300px;}
}

@keyframes flyout-guessed-animation {
  0%   {top:0px;left:60px}
  25%  {background-color:rgb(0, 136, 255); color: black; top:0px;left:60px}
  50%  {background-color:rgb(242, 0, 255); color: black; top:0px;left:60px}
  100%  {background-color:transparent; color: transparent; top:0px;left:60px}
}

.flyout{
    animation-name: flyout-animation;
    animation-duration: 5s;
    animation-iteration-count: 1;
}

.flyout-guessed{
    animation-name: flyout-guessed-animation;
    animation-duration: 4s;
    animation-iteration-count: 1;
}
</style>