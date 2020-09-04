'use strict';


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const dpi = window.devicePixelRatio;
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

ctx.strokeStyle = '#BADA55';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 10


let hue  =0


//Drawing Flag
let isDrawing = false;
let direction = true;

let lastX = 0;
let lastY = 0;

let draw=function(event){
    if(!isDrawing){
        return //stops the function when the mouse is not clicked down
    }
    ctx.beginPath();
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    //Start Draw From
    ctx.moveTo(lastX,lastY);
    //End Draw at
    ctx.lineTo(event.offsetX,event.offsetY);
    ctx.stroke();
    [lastX, lastY] =[event.offsetX,event.offsetY];
    
    ++hue;
    if(hue>360) hue = 0;
    
    direction ? ++ctx.lineWidth : --ctx.lineWidth;
    if(ctx.lineWidth >= 100 || ctx.lineWidth <= 1){ direction = !direction}
    
}

canvas.addEventListener('mousedown',()=>{
    isDrawing=true;
    [lastX, lastY] =[event.offsetX,event.offsetY]

})


canvas.addEventListener('mousemove',draw)
canvas.addEventListener('mouseup',()=>(isDrawing=false))
canvas.addEventListener('mouseout',()=>(isDrawing=false))