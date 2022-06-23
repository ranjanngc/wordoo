<!-- Please remove this file from your project -->
<template>
    <div class="flex flex-col h-full w-full">
        <ScoreBoard 
            :score-list="scoreList" 
            :timer-counter="counter" 
            :socket="socket"
            :current-user="currentUser">
        </ScoreBoard>
        <div v-show="kicked" class="text-5xl text-red-700 bg-yellow-300">You Have Been Kicked</div>
        <div v-show="!kicked && userWords.length === 0 && !gameCompleted" class="m-1 h-4/5" >
            <p class="absolute select-none p-2 bg-yellow-500 text-white rounded-lg text-base" :class="{'flyout': showMessage}" v-show="showMessage">{{currentMessage}}</p>
           
            <CanvasBoard 
                :socket="socket"
                :current-user="currentUser"
                @reset="reset"
                ref="canvasRef">
            </CanvasBoard>
            <input v-show="!isActive" type="text" 
                class="w-full border border-black border-solid pl-2 relative h-7"
                placeholder="guess the word" 
                v-model="text" @keypress="sendMessage" maxlength="30">

            <div class="flex flex-row" v-show="!isActive">
                <div v-for="char in hint" class="border align-middle w-10 h-10 rounded-sm text-3xl text-red-600 border-black border-1 text-center">{{char}}</div>
            </div>
        </div>
        <div v-show="userWords.length>0 && !kicked" class="flex flex-col p-5 align-middle">
            <h1 class="text-1xl text-orange-700 mb-8" v-show="currentWord">The word was - {{currentWord.toUpperCase()}}</h1>
            
            <h3 class="font-bold">Your turn now, choose a word and draw it and let your friends guess it</h3>
            <button 
                v-for="word in userWords" 
                @click="setWord(word)" 
                class="bg-cyan-400 :focus:bg-cyan-400 hover:bg-violet-600 active:bg-violet-700 m-1 pl-2 pr-2 rounded-sm h-28 w-full text-4xl">
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
import { ref, onMounted} from 'vue'
import io from 'socket.io-client'
import {NameUtility} from '../db/names'
import siteConfig from '../../site.config.json'
import { computed } from '@vue/reactivity';
import {IUserData, ISocketData} from './../socket/interfaces'
import ScoreBoard from './ScoreBoard.vue';
import CanvasBoard from './CanvasBoard.vue';


const canvasRef = ref({})
const drawing = ref(Array<any>())
const socket = io(siteConfig.socket)
const text = ref('')
const isActive = ref(false)
// messageStore.value = []
let lastMessage = ''
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
// const clockAudio = new Audio('/assets/clock.mp3')
const winAudio = new Audio('/assets/win.mp3')
const currentUser = ref<IUserData | undefined>()
const isVoted = ref(false)

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

const reset = (score:any) =>{
    currentWord.value = score.currentWord
    isActive.value=false
    userWords.value = []
    isVoted.value = false  
}

onMounted(()=>{
  
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
            
            drawing.value = data.user.draw
        }
    })

    socket.on('REFRESH_USER_LIST', (data: ISocketData) => {
        
        console.log(data)
        gameCompleted.value = data.gameOver
        roundUp.value = data.roundOver
        
        loginUsers.value = data.users

        //if(currentUser.value === undefined){

        currentUser.value = data.users.find((user:IUserData) => user.name === playerName) ?? undefined
        //}

        data.users.forEach((user:any) => {
            if(user.name === playerName && !isActive.value){
                currentUser.value = user
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