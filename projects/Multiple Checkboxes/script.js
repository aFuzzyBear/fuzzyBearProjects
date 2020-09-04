'use strict';

const inputsArray = [...document.querySelectorAll('input[type="checkbox"]')];

inputsArray.forEach(checkbox => checkbox.addEventListener('click',handleCheck))

let lastChecked
function handleCheck(event){
    let inBetween = false;
    
    if (event.shiftKey && this.checked){
        //do stuff
        inputsArray.forEach(checkbox => {
            console.log(checkbox);
            if(checkbox === this || checkbox === lastChecked){
                inBetween = !inBetween //opposite of itself 😖
                console.log('checking inbetween')
            }
            if(inBetween){
                checkbox.checked = true
               
            }
        })
    }
    lastChecked = this
    // console.log(event)
    
}
