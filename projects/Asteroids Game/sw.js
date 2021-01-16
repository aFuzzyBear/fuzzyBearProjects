//Service Worker for the Asteroids Game

// Create a Cache to save the Files for the Install Event

const CACHE_NAME = 'Asteroids-Game-cache-v1';
let urlsToCache = [
    // Relative Url Paths for our cache files.
    "./Asteroids.html",
    "./asteroidsGame.js",
    "./asteroidsStylesheet.css"
]

// PWA Install Event

self.addEventListener('install',(event)=>{
    // Perform install steps 
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache)=>{
            console.log('Opened Cache')
            return cache.addAll(urlsToCache)
        })
    )
})

// Fetching Files to cache

self.addEventListener('fetch',(event)=>{
    event.respondWith(
        caches.match(event.request)
        .then((response)=>{
            // Cache Hit - return response
            if(response){
                return response
            }
            return fetch(event.request)
        })
    )
})