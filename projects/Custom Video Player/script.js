// Get elements

const player = document.querySelector('.player');
const video = player.querySelector('.video-viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress-fill');

const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player-slider');

const checkbox = document.querySelector("body > div > div > input[type=checkbox]");

// Build functions
function curtains(){
    if(checkbox.checked == false){
        onPlay();
    }else{
        onPause();
    }
}



function onPause(){
    const icon = '\u275A \u275A';
    toggle.textContent=icon;
    video.pause();
    console.log('video paused')
}
function onPlay(){
    const icon='\u25BA';
    toggle.textContent=icon;
    video.play();
    handleProgress();
    console.log('video playing')
}

function skip(){
    //how much to skip by
    const skipValue = +this.dataset.skip
    video.currentTime += skipValue;
    console.log(skipValue)
}
function slider(){
    video[this.name] = this.value
    console.log(this.name)
    console.log(this.value)
}
function mouseSet(){
    console.log(`${this.name} is set at ${this.value}`)
}
function handleProgress(){
    const percent = (video.currentTime / video.duration) *100;
    progressBar.style.flexBasis= `${percent}`;
}

function togglePlay(){
    if(video.paused){
        onPlay();
    }else{
        onPause();
    }
}



        
// hook up the event listeners
video.addEventListener('click',togglePlay,false);
toggle.addEventListener('click',togglePlay,false);
skipButtons.forEach(button => button.addEventListener('click',skip,false))

ranges.forEach(range => {
    range.addEventListener('change',slider,false)
    range.addEventListener('mousemove',slider,false)
    range.addEventListener('mouseup',mouseSet,false)
})
checkbox.addEventListener('click',curtains,false)