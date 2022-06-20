<!-- Please remove this file from your project -->
<template>
    <div class="flex flex-col h-full w-full">
        <div class="flex flex-row">
            <ul class="flex flex-row text-left">
                <li 
                    v-for="user in loginUsers" 
                    :class="(user.doneForRound ? 'bg-green-700 text-white': 'text-orange-600 ')"
                    class="text-sm select-none m-1">
                        {{user.name}}
                        <span class="align-right bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">{{user.score}}</span>
                </li>
            </ul>
            <div class="ml-auto border rounded-xl text-center w-10 h-7 mr-1 font-bold text-white bg-blue-600">{{counter}}</div>
        </div>
        <div v-show="userWords.length === 0 && !gameCompleted" class="m-1 h-4/5">
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
            <div class="flex flex-row border rounded-lg p-5" v-show="isActive">
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

            <div class="flex flex-row" v-show="!isActive">
                <div v-for="char in hint" class="border align-middle w-10 h-10 rounded-sm text-3xl text-red-600 border-orange-500 border-1 text-center">{{char}}</div>
            </div>
        </div>
        <div v-show="userWords.length>0" class="flex flex-col p-5 align-middle">
            <h3 class="font-bold">Choose a word</h3>
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
                
                <div v-show="!roundUp" v-for="user in loginUsers" class="text-orange-600 mr-1 text-base">
                    {{user.name + ':' + user.score}}
                </div>
                <p v-if="loginUsers.find(u => u.active)">{{(loginUsers.filter(u=> u.active))[0].name}} is choosing a word!</p>
            </div>
        </div>

        
        <!-- CHAT CONTAINER
        <div class="border invisible">
            <div 
                ref="chatdiv"
                class="min-w-fit flex flex-col text-left overflow-auto relative max-w-sm mx-auto scroll-smooth pb-10">
                <ul>
                    <li 
                        v-for="(item, index) in messageStore"
                        :class="(item.user === 'bot' ? 'text-green-500': 'even:bg-slate-300 odd:bg-slate-200')"
                        class=" mb-1 text-sm text-ellipsis select-none pl-1">
                            <span 
                                
                                class="text-orange-600 mr-1">{{item.user + ':'}}</span>
                            {{item.message}}
                    </li>
                </ul>
            </div>
            
        </div>
        -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, nextTick } from 'vue'
import io from 'socket.io-client'
import {NameUtility} from '../db/names'
import siteConfig from '../../site.config.json'
//import drum from './../assets/instrument_strum.ogg'
// import * as bullseye from '@/assets/bullseye.svg?url'
let strokeColor = ref('rgb(15 23 42)')
const strokeWidth = ref(1)
const pos = {x:0,y:0}
const canvasRef = ref({})
const chatdiv = ref({})
//const socket = io('gmm.herokuapp.com')
const socket = io(siteConfig.socket)
const text = ref('')
let messageStore = ref(Array<IMessage>())
const message = ref('')
const isActive = ref(false)
messageStore.value = []
let lastMessage = ''
const drawData = {data: new Array<any>()}
const currentWord = ref('')
interface IMessage{
    user: string,
    message: string,
    won: Boolean
}
interface ILoginUser {
    name: string,
    active: Boolean,
    score:Number,
    doneForRound: Boolean,
}

const hint = ref(Array<string>())
const playerName = NameUtility.random();
const loginUsers = ref(Array<ILoginUser>())
loginUsers.value = []
const userWords = ref([])
userWords.value = []
const gameCompleted = ref(false)
const roundUp = ref(false)
const currentMessage = ref('')
const showMessage = ref(false)
const counter = ref(0)
let intervalHandler:any
const setPosition = (e:MouseEvent|TouchEvent) => {
    // console.log(e.target)
    if(e.type === 'mousemove' || e.type === 'mousedown'){

        const evt = e as MouseEvent
        const target = evt.target as any
        const rect = target.getBoundingClientRect()
        //const canvas = (canvasRef.value as HTMLCanvasElement).getBoundingClientRect()
        pos.x = evt.pageX - rect.left
        pos.y = evt.pageY - rect.top
    }
    else{
        const evt = e as TouchEvent
        const target = evt.target as any
        const rect = target.getBoundingClientRect()
        //const canvas = (canvasRef.value as HTMLCanvasElement).getBoundingClientRect()
        pos.x = evt.touches[0].pageX - rect.left
        pos.y = evt.touches[0].pageY - rect.top
        // console.log(pos)
    }
}

const resize = () => {

      const ctx = (canvasRef.value as HTMLCanvasElement).getContext("2d")!;
      const data = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height )
      ctx.canvas.width = window.innerWidth - 10;
      ctx.canvas.height = window.innerHeight - 115;
      // ctx.canvas.setAttribute('style', 'transform: translate(100px, 100px)')
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
        ctx.beginPath();
        //console.log(draw)
        if(draw.length >= 7){
            ctx.rect(0, 0, (canvasRef.value as any).width, (canvasRef.value as any).height);
            ctx.fillStyle = draw[6].toString()
            ctx.fill();
        }else{
            
            ctx.lineCap = "round";
            
            ctx.moveTo(draw[0], draw[1]);
            ctx.lineTo(draw[2], draw[3]);
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
    
    drawData.data.push(drawingArr);
    // console.log(drawData)
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
        const drawing = [0,0,0,0,0,0,strokeColor.value] as Array<any>
        const drawingArr = new Array<any>()
        drawingArr.push(drawing)
        //drawing.fl = strokeColor.value
        sendDraw(drawingArr)
    //})
}

const sendDraw = async (draw:number[]) => {
    const ctx = (canvasRef.value as any);//.getContext("2d")!;
    await socket.emit('SEND_DRAWING', {
        user: playerName,
        draw: draw
    })

}

const sendMessage = (e:KeyboardEvent) =>{

    if(e.key === "Enter" && text.value.trim() !== '' && lastMessage!== text.value.trim()){
        socket.emit('SEND_MESSAGE', {
            user: playerName,
            message: text.value.trim()
        })
        lastMessage = text.value.trim()
        text.value = ''
    }
}

const getWord = () =>{

    fetch('/random')
    .then(response => response.json())
    .then((words)=>{
        userWords.value =words
        //console.log('getword', userWords.value)
    });
}

const setWord = (word:string) => {

    socket.emit('REGISTER-WORD', {
        user: playerName,
        word: word
    })
    userWords.value = []
}
const showChatMessage = (data: IMessage) =>{
    currentMessage.value = `${data.user}: ${data.message}`
    showMessage.value = true

    window.setTimeout(()=>{
        currentMessage.value = ''
        showMessage.value=false;
    },4000)
}
onMounted(()=>{
    window.addEventListener('resize', resize)
    socket.on('MESSAGE', (data: IMessage) =>{

        const pElem = document.createElement("p")
        pElem.classList.add(...["absolute", "select-none", "p-2", "text-black", "rounded-lg", "text-base", "text-bold"])
        
        pElem.classList.add(...(data.message.indexOf('guessed')) > -1 ? ['bg-green-500', 'flyout-guessed'] : ['bg-yellow-500','flyout'])

        pElem.innerText = data.user + ': '+data.message
        document.body.appendChild(pElem)
        window.setTimeout(()=>{
            document.body.removeChild(pElem)
        },5000)

        if(data.won){
            const audio = new Audio('/assets/win.mp3')
            audio.play();
        }

        if(data.message.indexOf('joined!') != -1 || data.message.indexOf('left') != -1){
            const audio = new Audio('/assets/info.mp3')
            audio.play();
        }
    })

    socket.on('DRAWING', (data: any) =>{

        if(data.user !== playerName){
            
            drawFromArray(data.draw)
        }
    })

    socket.on('REFRESH_USER_LIST', (data:any) => {
        
        gameCompleted.value = data.completed
        roundUp.value = data.roundUp
        
        loginUsers.value = data.users
        console.log(data)
        data.users.forEach((user:any) => {
            if(user.name === playerName && !isActive.value){
                isActive.value = user.active

                if(isActive.value){
                    getWord()
                }
            }
        });
    })

    socket.on('disconnect', (data:any) => {
        socket.emit('LOG_OUT', {
            user: playerName
        })
    })

    socket.on('GAME_HINT', (data: any) => {
        gameCompleted.value = false
        hint.value = data.hint
        console.log(data)
        if(data.start){
            clearInterval(intervalHandler)
            counter.value = data.guessTime
            intervalHandler = setInterval(()=>{
                counter.value -=1

                if(counter.value === 10){
                    const audio = new Audio('/assets/clock.mp3')
                    audio.play()
                }

                if(counter.value<= 0){
                    counter.value = 0;
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
    })

    socket.emit('LOG_IN', {
        user: playerName
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