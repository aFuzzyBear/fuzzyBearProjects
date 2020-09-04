//Global Strict Mode - Enable
'use strict';

function playSound(e){
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const text = document.querySelector(`div.drum-pieces[data-key="${e.keyCode}"]>p.text`);
    const kbd = document.querySelector(`div.drum-pieces[data-key="${e.keyCode}"]>kbd.key`);
   
    if(!audio) return;
    audio.currentTime = 0 //rewind to the start
    audio.play();//Plays the audio
    //Applies the style transformation
    kbd.classList.add('active-key')
    text.classList.add('active-text')

}

const playSoundsEvent = document.addEventListener('keydown', playSound)
const removeSoundsEvent = document.addEventListener('keyup',removeTransition)

function removeTransition(e){
    //Removing the Style transformation
    const text = document.querySelector(`div.drum-pieces[data-key="${e.keyCode}"]>p.text`);
    const kbd = document.querySelector(`div.drum-pieces[data-key="${e.keyCode}"]>kbd.key`);

    kbd.classList.remove('active-key');
    text.classList.remove('active-text')

}
