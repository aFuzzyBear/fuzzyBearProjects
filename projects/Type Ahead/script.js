'use strict';

//Getting the list of cities from external source
//List of US Cities in JSON
const dataFeed = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json'

const cities = []

const getCities = fetch(dataFeed)
                  .then(blob => blob.json())
                  .then(data => cities.push(...data))

                  
function displayMatches(){
    const results=document.querySelector('.results');

    const matchesArray = findMatches(this.value,cities);
    function findMatches(wordsToMatch,array){
        return array.filter(place =>{
            //need to figure out if the city matches
            const regex = new RegExp(wordsToMatch,'gi');
            return place.city.match(regex) || place.state.match(regex);
        })
    }
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }

    const html = matchesArray
        .sort((a,b)=>{
        b.population - a.population
    })
        .map(place => {
        const regex = new RegExp(this.value,'gi');
        const cityName = place.city.replace(regex,`
        <span class="highlighter">${this.value}</span>`);
        const stateName = place.state.replace(regex,`
        <span class="highlighter">${this.value}</span>`);
        return `
        <li>
            <span class="name">${cityName}, ${stateName}</span>
            <span class ="population">${numberWithCommas(place.population)}</span>
        </li>
    `;
    })
        .join('');
    
    return results.innerHTML = html;
   
}

const searchInput=document.querySelector('#search-input');


searchInput.addEventListener('change',displayMatches)
searchInput.addEventListener('keypress',displayMatches)