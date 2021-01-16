//Service Worker for the Asteroids Game

// Create a Cache to save the Files for the Install Event

const CACHE_NAME = 'Asteroids-Game-cache-v1';
let urlsToCache = [
    // Relative Url Paths for our cache files.
    "./Asteroids.html",
    "./asteroidsGame.js",
    "./asteroidsStylesheet.css",
    "./assets/fonts/hyperspace/Hyperspace.otf",
    "./assets/fonts/Trispace/Trispace-VariableFont_wdth,wght.ttf",
    "./assets/graphics/asteroids-arcade-game-logo-sticker.svg"
]

// PWA Install Event

self.addEventListener('install',(event)=>{
    // Perform install steps 
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache){
            console.log('Opened Cache')
            return cache.addAll(urlsToCache)
        })
        .catch(error=>{
            console.log('Error Trying to install files to cache: ',error)
        })
    )
})

// Fetching Files to cache

self.addEventListener('fetch',(event)=>{
    event.respondWith(
        caches.match(event.request)
        .then(response =>{
            if(response){
                return response
            }

            return fetch(event.request)
                   .then(response=>{
                    //    Check if we received a valid response
                    if(!response || response.status !== 200 || response.type !== 'basic'){
                       return response
                    }

                    let responseToCache = response.clone()

                    caches.open(CACHE_NAME)
                        .then(cache =>{
                            cache.put(event.request, responseToCache)
                        }).catch(error=>console.log('Error Trying to cache response ',error))
                    return response
                   }).catch(error=>console.log('Error Trying to receive response for fetch event ', error))
        })
        .catch(error=>{
            console.log('Error trying to fetch the files ', error);
        })
    )
})