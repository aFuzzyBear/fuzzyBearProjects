const panels = document.querySelectorAll('.panel')//Gets all the individual panels in a NodeList

function toggleOpen(event){
    console.log(this.classList + 'Toggled Open')
    this.classList.toggle('open')
}

function toggleActive(e){
    console.log(e.propertyName)
    if(e.propertyName.includes('flex')){
        this.classList.toggle('open-active')
    }
}
panels.forEach(panel => panel.addEventListener('click',toggleOpen))
panels.forEach(panel => panel.addEventListener('transitionend',toggleActive))