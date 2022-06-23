<template>
<div class="flex flex-row">
    <ul class="flex flex-row text-left">
        <li 
            v-for="user in scoreList" 
            
            class="text-sm select-none m-1">
                {{user.name}}
                <span 
                v-show="user.score"
                :class="(user.won ? 'bg-green-700 text-white': 'bg-red-100 text-red-800')"
                class="align-right text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                    {{user.score}}
                </span> |
        </li>
    </ul>
    <div class="flex ml-auto">
        <div class="cursor-pointer align-middle ml-auto border rounded-md pl-2 pr-2 text-center bg-cyan-400 :focus:bg-cyan-400 hover:bg-violet-600 active:bg-violet-700"
            @click="voteKickUser" 
            v-show="!currentUser.active && !isVoted">
                    Kick {{ currentUser.name }}
        </div>
        <div class="border rounded-xl text-center w-10 h-7 mr-1 font-bold text-white bg-blue-600">{{timerCounter}}</div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
import { IUserData } from '../socket/interfaces';

const isVoted = ref(false)

const props = defineProps({
    currentUser:    { type: {} as PropType<IUserData>, default: {active: false, name: ''}},  
    socket:         { type: Object, default: null},
    scoreList: {
        type: Array<IUserData>,
        default: [] as Array<IUserData>
    },

    timerCounter:{
        type: Number,
        default: 0
    }
})

const voteKickUser = () =>{
    props.socket.emit('KICK',  props.currentUser)
    isVoted.value = true
}
</script>