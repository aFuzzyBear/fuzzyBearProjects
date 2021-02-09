'use strict';

const secondHand = document.getElementById('secondHand');
const minuteHand = document.getElementById('minHand');
const hourHand = document.getElementById('hourHand');

function clock(){
    const time = new Date().toLocaleTimeString();

    let secs = time.getSeconds();
    let secDeg= ((secs/60 ) * 360) + 90;
    secondHand.style.transform = `rotate(${secDeg}deg)`;

    let mins = time.getMinutes();
    let minsDeg = ((mins / 60) * 360) + ((secs/60)*6)  + 90;
    minuteHand.style.transform = `rotate(${minsDeg}deg)`;

    let hour = time.getHours();
    let hourDeg = ((hour / 12) * 360)+ ((mins/60)*30)  + 90;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
}

setInterval(clock, 1000);


// function setDate() {
//     const now = new Date();

//     const seconds = now.getSeconds();
//     const secondsDegrees = ((seconds / 60) * 360) + 90;
//     secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

//     const mins = now.getMinutes();
//     const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
//     minuteHand.style.transform = `rotate(${minsDegrees}deg)`;

//     const hour = now.getHours();
//     const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
//     hourHand.style.transform = `rotate(${hourDegrees}deg)`;
//   }
//   setInterval(setDate, 1000);

//   setDate();