<template>
    <div>
        <canvas
            class="border position-relative touch-none border-b-2"
            ref="canvasRef"
            @mousemove="draw"
            @mousedown="setPosition"
            @mouseup="drawFinal"
            @touchmove="draw"
            @touchstart="setPosition"
            @resize="resize"
        ></canvas>

        <div class="flex flex-row" v-show="currentUser.active">
            <div class="w-5 h-5 m-1" :style="{'background-color':strokeColor}"></div>
            <div class="bg-slate-900 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(15 23 42)'"></div>
            <div class="bg-blue-500 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(59 130 246)'"></div>
            <div class="bg-blue-800 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(30 64 175)'"></div>
            <div class="bg-green-500 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(34 197 94)'"></div>
            <div class="bg-green-700 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(21 128 61)'"></div>
            <div class="bg-red-500 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(239 68 68)'"></div>
            <div class="bg-red-800 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(153 27 27)'"></div>
            <div class="bg-yellow-500 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(234 179 8)'"></div>
            <div class="bg-orange-500 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(249 115 22)'"></div>
            <div class="bg-pink-500 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(236 72 153)'"></div>
            <div class="bg-purple-500 w-5 h-5 rounded-xl m-1 cursor-pointer" @click="strokeColor='rgb(168 85 247)'"></div>
            <div class="bg-white w-5 h-5 rounded-xl m-1 border-black border cursor-pointer" @click="strokeColor='rgb(255 255 255)'"></div>
            <div class="bg-cyan-400 w-5 h-5 rounded-xl m-1 " @click="strokeColor='rgb(34 211 238)'"></div>
            <div class="m-1" @click="resetCanvas">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px"
                        viewBox="0 0 300.003 300.003" style="enable-background:new 0 0 300.003 300.003;" xml:space="preserve">
                    <g>
                        <g>
                            <path d="M150,0C67.159,0,0.001,67.159,0.001,150c0,82.838,67.157,150.003,149.997,150.003S300.002,232.838,300.002,150
                                C300.002,67.159,232.839,0,150,0z M206.584,207.171c-5.989,5.984-15.691,5.984-21.675,0l-34.132-34.132l-35.686,35.686
                                c-5.986,5.984-15.689,5.984-21.672,0c-5.989-5.991-5.989-15.691,0-21.68l35.683-35.683L95.878,118.14
                                c-5.984-5.991-5.984-15.691,0-21.678c5.986-5.986,15.691-5.986,21.678,0l33.222,33.222l31.671-31.673
                                c5.986-5.984,15.694-5.986,21.675,0c5.989,5.991,5.989,15.697,0,21.678l-31.668,31.671l34.13,34.132
                                C212.57,191.475,212.573,201.183,206.584,207.171z"/>
                        </g>
                    </g>
                    </svg>
            </div>
            <div class="m-1" @click="fillCanvas(strokeColor)" >
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" version="1.1" id="DESIGNS" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
                    <title property="dc:title">to fill</title><desc property="dc:description">An icon for "fill" from the Stone series on to [icon]. Downloaded from http://www.toicon.com/icons/stone_fill by 127.0.0.1 on 2017-07-10. Licensed CC-BY, see http://toicon.com/license/ for details.</desc>
                    <path class="stone_een" d="M10.593,9l-3.714,3.714C6.312,13.281,6,14.034,6,14.835V28c0,1.214-1.087,2.179-2.339,1.972  C2.678,29.81,2,28.884,2,27.887V15.5C2,11.91,4.91,9,8.5,9H10.593z M28.879,15.879L21,8V5.178c0-2.088-1.523-3.956-3.601-4.158  C15.014,0.788,13,2.663,13,5v10.5c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5V5c0-1.85,1.683-3.314,3.598-2.942  C19.022,2.335,20,3.668,20,5.118V7l-0.879-0.879C17.988,4.987,16.178,4.961,15,6.022V15.5c0,0.827-0.673,1.5-1.5,1.5  S12,16.327,12,15.5V9.007l-4.414,4.414C7.208,13.799,7,14.301,7,14.835V18l9.879,9.879c1.172,1.172,3.071,1.172,4.243,0l7.757-7.757  C30.05,18.95,30.05,17.05,28.879,15.879z" style="fill: #0B1719;"/>
                    <metadata><work rdf:about=""><format>image/svg+xml</format><type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><license rdf:resource="http://creativecommons.org/licenses/by/4.0/"/><attributionname>Shannon E Thomas</attributionname><attributionurl>http://www.toicon.com/icons/stone_fill</attributionurl></work></metadata>
                </svg>
            </div>
            <input type="range" orient="vertical" min="1" max="30" step="1" class="w-20 m-1" v-model="strokeWidth">
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { PropType, onMounted, defineEmits } from 'vue';
import { IDrawing, IUserData } from './../socket/interfaces'

const emit = defineEmits(['reset'])
const strokeWidth = ref(1)
const strokeColor = ref('rgb(0 0 0)')

const canvasRef = ref({})
const pos = {x:0,y:0}
let drawData = new Array<any>()

const props = defineProps({
    currentUser:    { type: {} as PropType<IUserData>, default: {active: false}},  
    socket:         { type: Object, default: null}
})

const resize = () => {

    const ctx = (canvasRef.value as HTMLCanvasElement).getContext("2d")!;
    const data = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height )

    ctx.canvas.width = window.innerWidth - 10;
    ctx.canvas.height = window.innerHeight - 115;

    ctx.putImageData(data, 0, 0)
}

const setPosition = (e:MouseEvent|TouchEvent) => {

    if (e.type === 'mousemove' || e.type === 'mousedown'){

        const evt = e as MouseEvent
        const target = evt.target as any
        const rect = target.getBoundingClientRect()
        pos.x = evt.pageX - rect.left
        pos.y = evt.pageY - rect.top
    }
    else {

        const evt = e as TouchEvent
        const target = evt.target as any
        const rect = target.getBoundingClientRect()
        pos.x = evt.touches[0].pageX - rect.left
        pos.y = evt.touches[0].pageY - rect.top

    }
}

const draw = (e:any) => {
    
    if (!props.currentUser.active || ((e.type === 'mousemove' || e.type === 'mousedown') && (e.buttons !== 1))) {
        return;
    }

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
    drawData.push(drawingArr);

    if(drawData.length > 20) {

        const arrToSend = [...drawData]
        sendDraw(arrToSend)
        drawData = new Array<any>()
    }
}

const drawFinal = (e:any) => {

    if(drawData.length > 0) {

        const arrToSend = [...drawData]
        sendDraw(arrToSend)
        drawData = new Array<any>()
    }
}

// May be used in parent
const fillCanvas = (strokeColor: string) => {

    const ctx = (canvasRef.value as any).getContext("2d");

    ctx.beginPath();
    ctx.rect(0, 0, (canvasRef.value as any).width, (canvasRef.value as any).height);
    ctx.fillStyle = strokeColor
    ctx.fill();

    const drawing = [0,0,0,0,0,0,0,0,strokeColor] as Array<any>
    //return drawing
    sendDraw( [drawing])
}

// may be use directly from parent
const drawFromArray = (drawArray: Array<any>[]) => {
    
    //if(!drawArray  && drawArray.length<=0){return}
    
    const ctx = (canvasRef.value as HTMLCanvasElement).getContext("2d")!;
    let drawIndex = 0;
    const drawInterval = setInterval(()=>{

        const draw = drawArray[drawIndex]
        const widthOffset = ctx.canvas.width / (draw[6] )
        const heightOffset = ctx.canvas.height / (draw[7])
        ctx.beginPath();

        if(draw.length >= 9) {

            ctx.rect(0, 0, (canvasRef.value as any).width, (canvasRef.value as any).height);
            ctx.fillStyle = draw[8].toString()
            ctx.fill();
        }
        else{
            
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
    }, 10)
}

const resetCanvas = () => {
    fillCanvas('rgb(255 255 255)')
    
}


const sendDraw = async (draw:any[]) => {
    //const ctx = (canvasRef.value as any);//.getContext("2d")!;
    if( props.currentUser && props.currentUser.active){
        props.currentUser.draw = draw
        await props.socket.emit('SEND_DRAWING', {
            user: props.currentUser
        })
    }
}
onMounted(() => {
    window.addEventListener('resize', resize);
    resize()

    props.socket.on('DRAWING', (data: any) =>{

        if(data.name !== props.currentUser.name){
            
            drawFromArray(data.user.draw)
        }
    })

    props.socket.on('GAME_COMPLETE', (score: any)=>{

        resetCanvas()
        emit('reset', score); 
    })
})

</script>