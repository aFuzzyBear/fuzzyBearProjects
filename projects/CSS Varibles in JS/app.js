'use strict';

const inputs = document.querySelectorAll('.controls input');//Returns a NodeList

function handleUpdate(){
    const suffix = this.dataset.sizeunits || '';
    document.documentElement.style.setProperty(`--${this.name}`,this.value + suffix)
    
    console.log(this.name)

}

inputs.forEach ( input => input.addEventListener('change', handleUpdate ) )
inputs.forEach ( input => input.addEventListener('mousemove', handleUpdate ) )