'use strict'//Enable Global strict mode 

//Setting up the global variables


/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('gameCanvas');

/**
 * @type {CanvasRenderingContext2D} 
 */
const ctx = canvas.getContext('2d');

/**
 * @constant gameContainer - Game Container Element
 * @type {HTMLBodyElement}
 */
const gameContainer = document.querySelector('.gameLayer');
/**
 * @constant outputDisplay - JS Output Container Element
 * @type {HTMLBodyElement}
 */
const outputDisplay = document.querySelector('.js-output')
/**
 * @constant highScoresTable - Creating a Order List Element on the Dom to Store the High Scores
 * @type {HTMLBodyElement}
 */
const highScoresTable = document.createElement('ol')

highScoresTable.classList.add('highScoresTable') // Applying a class to the Element

/**
 * @constant scoreDisplay - Displays the Score on the DOM
 * @type {HTMLBodyElement}
 */
const scoreDisplay = document.getElementById('score');
/**
 * @constant scoreDisplay - Displays the Score on the DOM
 * @type {HTMLBodyElement}
 */
const currentHighScoreDisplay = document.getElementById('highScore');
/**
 * @constant livesDisplay - Displays the Score on the DOM
 * @type {HTMLBodyElement}
 */
const livesDisplay = document.getElementById('lives');


// Global Functions
/**
 * @function RandomNumber - Random Number Generator 
 * @param {Number} min -Lowest Number in Range
 * @param {Number} max  - Highest Number in Range
 * @returns Random Whole Number (Integers) between the range of min - max
 */
function randomNumber(min,max){
    return Math.floor(Math.random()*Math.floor(max-min) + min)
}

/**
 * @function randomNumberDecimal - Random Decimal Generator
 * @returns Random Decimal (Floating Point) number fixed to 4 decimal places. 
 */
function randomNumberDecimal(){
    return +Math.random().toPrecision(4)
}
/**
 * @function convertRadians
 * @param {Number} degrees in decimal
 * @returns Degrees in Radians
 */
function convertRadians(degrees){
    return +(degrees / 180 * Math.PI)
}
/**
 * @function distanceBetweenPoints
 * @description
 * Takes the cartesian distance between two points A(x,y) and B(x,y) 
 * 
 * @param {Number} x1 - X - Co-ordinate of the Primary Object
 * @param {Number} y1 - Y - Co-ordinate of the Primary Object
 * @param {Number} x2 - X - Co-ordinate of the Secondary Object
 * @param {Number} y2 - Y - Co-ordinate of the Secondary Object
 * @returns Distance in Pixels
 * 
 */
function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1)** 2 + (y2 - y1)**2)
}

/**
 * @function distanceBetweenCircles
 * @param {Number} x1 - X - Co-ordinate of the Primary Object
 * @param {Number} y1 - Y - Co-ordinate of the Primary Object
 * @param {Number} r2 - R - Co-ordinate of the radius of the Primary Object 
 * @param {Number} x2 - X - Co-ordinate of the Secondary Object
 * @param {Number} y2 - Y - Co-ordinate of the Secondary Object
 * @param {Number} r2 - R - Co-ordinate of the radius of the second Object 
 * @returns 
 * Returns the distance between the center of two circles 
 */   
function distanceBetweenCircles(x1,y1,r1,x2,y2,r2){
    return Math.ceil(Math.sqrt((x2 - x1)**2 + (y2-y1)**2) - (r2+r1))
}


/**
 * @class GameModel 
 * @classdesc Game Settings and methods are defined within the scope of this class. Here we place the primitive values that would be referenced throughout the game. 
 */
class GameModel{
    constructor(){
        /**@this this.FPS - Frames per Second */
        this.FPS = Number(60)
      
        /**@this this.AsteroidArray - Array which would contain the asteroids in the asteroid field */
        this.asteroidField = []
       
        
        
        /**@this this.currentScore - Keeps track of the score */
        this.currentScore = Number(0)
        
        /**@this this.highScoresFromStorage - Obtains the HighScores from the LocalStorage API, if present would return an array of object's each containing a record of the highscores, if not the it would present null */
        this.highScoresFromStorage = (localStorage.getItem('highScores'))?[...JSON.parse(localStorage.getItem('highScores'))] : null
       
        /**@this this.previousHighScore - Takes the previous games highest score if available, else it would return 0 */
        this.previousHighScore = (this.highScoresFromStorage) ? this.highScoresFromStorage[0].score : 0 
       
        /**@this this.shipExploding - Registers a flag if the ship is exploding */
        this.shipExploding = false
        
        /**@this this.lives -**PRIVATE** Number of game lives*/
        this._lives = Number(1)

        /**@this this._playerName - **PRIVATE** stores the players name */
        this._playerName = String()

        /**
        * @this this._width - **PRIVATE** width variable that would store the size of the window width
        */
        this._width = Number();
       
        /**
         * @this this._height - **PRIVATE** Height variable that would store the height of the window
         */
        this._height= Number();
        
       
        
        //Getting the Width and Height as soon as the Window loads
        window.addEventListener('load',()=>{
            this.getCanvasDimensions()
        })
        this.getCanvasDimensions();//Just to make sure
       
        //As the window is resized we are getting the new Canvas Dimensions
        window.addEventListener('resize',()=>{
            this.getCanvasDimensions();
        })
       
    }
    //Getters

    /**
     * @this this.width - Returns the width of the canvas
     */
    get width(){
        //This sets the width to the private _width value
        return this._width
        
    }
    /**
     * @this this.height - Returns the height of the canvas
     */
    get height(){
        //This sets the height to the private _height value
        return this._height
    }
    /**
     * @this this.gameLives - returns a rounded number of the game lives. 
     */
    get gameLives(){
        return +this._lives.toFixed(0)
    }

    //Methods

    /**
     * @method checkScore 
     * @description Checks if the current score is greater than the previous score, Switching the *view.newHighScore* to true
     */
    checkScore(){
        if(this.currentScore > this.previousHighScore){
            view.newHighScore = true
        }
    }
    
    /**
     * @method addScore
     * @description Creates a record of the new high score and captures the players name as well. It then stores it to the LocalStorage and repopulates the High Score Table
     */
    addScore(){
        let name = this._playerName
        let score = this.currentScore
        let storageArray = (this.highScoresFromStorage) ? [...this.highScoresFromStorage]:[]
        
        let record = {
            name: name,
            score: score
        }
        storageArray.push(record)
        storageArray.sort(function(a,b){
            return  b.score - a.score
        })
        if(storageArray.length > 5){
            storageArray.pop()
        }
        localStorage.setItem('highScores',JSON.stringify(storageArray))
        this.populateHighScoresList(storageArray,highScoresTable)

    }

    /**
     * @method playerName
     * @description captures the playerName as the input value changes
     */
    playerName(){
       let input = document.querySelector("#input-playerName")

       return this._playerName = input.value
    }

    /**
     * @method populateHighScoresList 
     * @param {Array} scoresArray 
     * @param {HTMLOListElement} DOMList 
     * @description Maps a record of the scores as HTML List item's to the HTML Ordered List Element 
     */
    populateHighScoresList(scoresArray = [], DOMList){
        DOMList.innerHTML = scoresArray.map((record)=>{
            return `
            
            <li class="scoreEntry">
            <span class="scoreEntry-Name">${record.name} </span><span class="scoreEntry-Score">${record.score} </span>
            </li>
            
            `
        }).join('');
        //😎
    }
    /**
     * @method getCanvasDimensions
     * @description Obtains the Width and Height of the canvas respective to the viewport and the device's own pixel density. This is to provide accurate values for rendering the elements ont he canvas
     */
    getCanvasDimensions() {
        // Width is determined by the css value for the viewport width this is then respected by the device pixel ratio. This is then used to set the canvas.width value
        this._width = Math.round((Number(getComputedStyle(canvas).getPropertyValue('width').slice(0,-2))/devicePixelRatio) * devicePixelRatio);
        //Setting the canvas width 
        canvas.width = this._width
        
        // height is determined by the css value for the viewport height this is then respected by the device pixel ratio. This is then used to set the canvas.height value
        this._height = Math.round((Number(getComputedStyle(canvas).getPropertyValue('height').slice(0,-2))/devicePixelRatio) * devicePixelRatio);
        //Setting the canvas height
        canvas.height = this._height
        
    }
    /**
     * @method createNewSpaceShip
     * @description Creates a new Spaceship 🚀 object 
     */
    createNewSpaceShip(){
        if(spaceship){
            //Delete the existing spaceship from the global reference
            spaceship = null;
            
        }
        // Create a new Spaceship
        let newSpaceship = new ShipObject(
            model.width /2,
            model.height/2,
            30,
            90,
            360,
            false,
            {x:0,y:0}
        )
         //Making the New Ship immune to Being Exploded
         newSpaceship.immune = true
         //Stop the Explosion
         model.shipExploding = false
         //Make it so the ship is stationary on reload
         newSpaceship.thrusting =false
        //  Replace the Spaceship with the newly created object
        return spaceship = newSpaceship;
    }

    /**
     * @method createAsteroidField 
     * @param {Number} numberOfAsteroids 
     * @description Create the asteroid field based on the number of asteroids requested, by populating the asteroid array with objects of asteroids containing their respective geometries, position and vectors.
     */
    createAsteroidField(numberOfAsteroids){
        
        //clear the existing array
        this.asteroidField = null;
        //Create a new array
        this.asteroidField = new Array();
        //creating place holders
        let x,y,r,i

        for(let index = 0; index< numberOfAsteroids; index++){
            x = randomNumber(0,this.width)
            y = randomNumber(0,this.height)
            r = randomNumber(60, 100);
            //Registering the asteroids Index - done purely for debugging reasons
            i = index

            //Creating a buffer zone around the ship to prevent the asteroids randomly spawning on the ship - if the spaceship exists
    
            if(spaceship){
                if(distanceBetweenPoints(spaceship.x,spaceship.y,x,y) <= spaceship.r * 5 + spaceship.r){
                x = randomNumber(0,this.width) + (spaceship.x + spaceship.r + 20);
                y = randomNumber(0,this.height) + (spaceship.y + spaceship.r + 20);
                }
            }
            this.asteroidField.push(this.createNewAsteroid(x,y,r,i))
        }
        return this.asteroidField
    }
    /**
     * @method createAsteroidField
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} r 
     * @param {Number} asteroidIndex 
     * @description Creates a new asteroid object including the geometry of each asteroid, making a random polygon that varies in it apparent smoothness
     */
    createNewAsteroid(x,y,r,asteroidIndex){
        let asteroid = new AsteroidObject(x,y,r,asteroidIndex);
        //Setting the values for the asteroids polygons
        for(let offset = 0; offset < asteroid.vertices; offset++ ){
            asteroid.offsets.push(
               Math.random() * asteroid.jaggedness * 2 + 1 - asteroid.jaggedness
            )
        }
        return asteroid 
    }
    /**
     * @method destroyAsteroid
     * @param {Number} index 
     * @description Destroys the asteroid and spawns two more smaller in its place. It also adds values respective to the size of the asteroid to the current score. 
     */
    destroyAsteroid(index){
        //Getting Asteroid Properties
        let x = this.asteroidField[index].x;
        let y = this.asteroidField[index].y;
        let r = this.asteroidField[index].r;
    
        //split the larger asteroid into two when shot at
       if( r >50 && r <= 100 ){
           //Adding the size of the asteroid as the value to be added to the score
           this.currentScore += 20
           //Remove the asteroid that is shot at
           this.asteroidField.splice(index,1)
           //Create the smaller asteroid debris 
           this.asteroidField.push(this.createNewAsteroid(x,y,r/2,index + 1))
           this.asteroidField.push(this.createNewAsteroid(x,y,r/2,index + 2))
        }
        if( r >25  && r <50){
            //Adding the size as the asteroid as the value to be added to the score
            this.currentScore += 50
            //Remove the asteroid that is shot at
            this.asteroidField.splice(index,1)
            //Create the smaller asteroid debris 
            this.asteroidField.push(this.createNewAsteroid(x,y,r/2,index + 1))
            this.asteroidField.push(this.createNewAsteroid(x,y,r/2,index + 2))
            
       }
       if( r <= 25){
           //Adding the size as the asteroid as the value to be added to the score
           this.currentScore += 100
           //Remove the smallest asteroid 
           this.asteroidField.splice(index,1)
       }
       
    }
    /**
     * @method screenEdges
     * @param {Object} obj 
     * @description Handles the edges of the screen as objects pass from one end and it would cause them to appear in the opposite side of the frame relative to their entry point. 
     */
    screenEdges(obj){
        if(obj.x < 0 - obj.r){
            obj.x = this.width + obj.r
        }
        else if(obj.x > this.width + obj.r){
            obj.x = 0 - obj.r
        }
        if(obj.y < 0 - obj.r){
            obj.y = this.height + obj.r
        }
        else if(obj.y > this.height + obj.r){
            obj.y = 0 - obj.r
        }
    }
}


//creating a shared object class between asteroids and spaceship

/**
 * @class Basic Object
 * @classdesc a shared object class between ship and asteroid, 
 */
class BasicObject{
    /**
     * 
     * @param {Number} x - Position of Object on X - Axis 
     * @param {Number} y - Position of Object on Y - Axis
     * @param {Number} r - Radius of the Object
     * @param {Number} a - Angle of the Object (in deg)
     */
    constructor(x,y,r,a){
        /**
         * @this this.x -  Position of the Object on the X - Axis
         */
        this.x = Number(x);
        /**
         * @this this.y -  Position of the Object on the Y - Axis
         */
        this.y = Number(y);
        /**
         * @this this.r -  Radius of the Object
         */
        this.r = Number(r);
        /**
         * @this this.a - Angle of the Object - converted to Radians
         */
        this.a = convertRadians(a); //Converted to Radians

    }
}

/**
 * @class ShipObject @extends BasicObject
 * @classdesc 🚀 Object literal containing the values and methods that pertains to the model of the Spaceship 
 */
class ShipObject extends BasicObject{
    /**
     * @constructor
     * @param {Number} x - Position of Object on X - Axis 
     * @param {Number} y - Position of Object on Y - Axis
     * @param {Number} r - Radius of the Object
     * @param {Number} a - Angle of the Object (in deg)
     * @param {Number} rot - 360/deg of turning
     * @param {Boolean} thrusting - Flag- Registers if the ship is thrusting is active
     * @param {Object} thrust - Object contains the thrust vectors for the Ship
     */
    constructor(x,y,r,a,rot,thrusting,thrust){
        /**@extends BasicObject */
        super(x,y,r,a)
     
        /**
         * @this this.rot - spaceship can only rotate around 360deg of a circle  converted to Radians
         */
        this.rot = convertRadians(rot);//Converted it into Radians
     
        /** 
         * @this this.thrust - Provides a vector for the spaceship when travelling
         */
        this.thrust = {...thrust};

        //Ship Flags
        /**
         * @this this.thrusting - Boolean Flag! True when the spaceship trust is active
         */
        this.thrusting = Boolean(thrusting);
        
        /**@this this.immune - Immunity from Explosions Flag */
        this.immune = Boolean(false)
       
        /**@this this.laserStatus - Flag - Registers if the laser is active shooting ON or OFF  */
        this.laserStatus = Boolean(true);
        
        // Laser Properties

        /**@this this.laserArray - Array Element that would store each laser object as they are fired */
        this.laserArray = Array();
        
        /**@this this.laserDistance - Distance the Laser would travel in respects to the screen width; 0 < laserDistance < 1(width) */
        this.laserDistance = 0.5 
        
        // ShipObject's Constants

        /**
         * @this this.SHIP_SIZE 
         * @description CONSTANT: Height of the spaceship in px's - Same as the Radius
         */
        this.SHIP_SIZE = Number(r);
     
        /**
         * @this this.Friction 
         * @description CONSTANT: Adds a Friction co-efficient to the movement of the spaceship:Friction in Space (0 = no friction,x=0.5/50%, 1 = 100% friction)
         */
        this.FRICTION = Number(0.5); 
        
        /**
         * @this this.SHIP_THRUST 
         * @description CONSTANT: Acceleration of the spaceship, 2px/sec^2
         */
        this.SHIP_THRUST = Number(2); // acceleration of the spaceship, px/sec^2
     
        /**
         * @this this.TURN_DEG
         * @description CONSTANT: This is the turning angle of the ship in 360deg/sec. 
         */
        this.TURN_DEG = Number(360); // Turns in deg/sec


    }
    //Methods

    /**
     * @method draw 🎨
     * @description Contains the instructions to draw the 🚀 on the canvas
     */
    draw(){
        if(this.immune){
            //Make the Spaceship golden 
            ctx.strokeStyle = "gold";
            ctx.fillStyle = "gold"
        }else{
            //Giving it some Normal Colors
            ctx.strokeStyle = "white";
            ctx.fillStyle = "red"
        }
       //The outer Triangle
       ctx.beginPath();
       ctx.moveTo(
           //Nose of the spaceship

            this.x + 4 / 3 * this.r * Math.cos(this.a),
            this.y - 4 / 3 * this.r * Math.sin(this.a)
        );
        ctx.lineTo( // rear left
            this.x - this.r * (2 / 3 * Math.cos(this.a) + Math.sin(this.a)),
            this.y + this.r * (2 / 3 * Math.sin(this.a) - Math.cos(this.a))
        );
        ctx.lineTo( // rear right
            this.x - this.r * (2 / 3 * Math.cos(this.a) - Math.sin(this.a)),
            this.y + this.r * (2 / 3 * Math.sin(this.a) + Math.cos(this.a))
        );
    
        ctx.closePath();//Finishes of the Outer Triangle
        ctx.stroke();

        //Drawing the Cockpit -inner triangle
        ctx.beginPath();
        // ctx.fillStyle = 'red';-delete this line
        ctx.lineWidth = 2;
        ctx.moveTo( // top of the cockpit
            this.x - (1 / 5 * this.r - this.SHIP_SIZE) * Math.cos(this.a),
            this.y + (1 / 5 * this.r - this.SHIP_SIZE) * Math.sin(this.a)
        );
        ctx.lineTo( // rear left of the cockpit
            this.x - this.r * (1 / 3 * Math.cos(this.a) +  0.5 * Math.sin(this.a)),
            this.y + this.r * (1 / 3 * Math.sin(this.a) - 0.5 * Math.cos(this.a))
        );
        ctx.lineTo( // rear right of the cockpit
            this.x - this.r * (1 / 3 * Math.cos(this.a) -  0.5 * Math.sin(this.a)),
            this.y + this.r * (1 / 3 * Math.sin(this.a) + 0.5 * Math.cos(this.a))
        );
        ctx.fill();//Fill in the Shape
        ctx.closePath();//Finishes of the Triangle
        ctx.stroke();

        if(this.thrusting){
            //Add Thrust vectors 
            this.thrust.x += this.SHIP_THRUST * Math.cos(this.a) / model.FPS **1/2;
            this.thrust.y -= this.SHIP_THRUST * Math.sin(this.a) / model.FPS **1/2 ;
            //Draw thrust animation
            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.fillStyle = "red"
            ctx.lineWidth = 2;
            ctx.moveTo( // rear center behind the spaceship
                this.x - 4 / 3 * this.r * Math.cos(this.a),
                this.y + 4 / 3 * this.r * Math.sin(this.a)
            );
            ctx.lineTo( // rear left
                this.x - this.r * (2 / 3 * Math.cos(this.a) +  0.75 * Math.sin(this.a)),
                this.y + this.r * (2 / 3 * Math.sin(this.a) - 0.75 * Math.cos(this.a))
            );
            ctx.lineTo( // rear right
                this.x - this.r * (2 / 3 * Math.cos(this.a) -  0.75 * Math.sin(this.a)),
                this.y + this.r * (2 / 3 * Math.sin(this.a) + 0.75 * Math.cos(this.a))
            );
            ctx.fill();//Fill in the Shape
            ctx.closePath();//Finishes of the Triangle
            ctx.stroke();
        }
        
        //Applying Friction to slow down the spaceship when Not thrusting
        if(!this.thrusting){
            this.thrust.x -= this.FRICTION * this.thrust.x / model.FPS
            this.thrust.y -= this.FRICTION * this.thrust.y / model.FPS
            
        }
        //Laser 
        this.drawLasers()

        //Rotate spaceship
        this.a += this.rot

        //Move the spaceship
        this.x += this.thrust.x;
        this.y += this.thrust.y;

        //handle screen edges
        model.screenEdges(this)
        
    }
    /**
     * @method explodeShip 💣
     * @description Contains the instructions to draw the explosion of the ship on the canvas, It also instructs to reduce the lives counter upon impact
     */
    explodeShip(){
        //Prevent the ship from moving
       if(!this.immune){ 
           this.thrust = {
                x:0,
                y:0
            }
        }
        //Stop the ship from shooting when exploding
        this.laserStatus = false

        //Drawing the Explosion
        ctx.beginPath();
        //Outermost circle - Dark Orange
        ctx.strokeStyle = '#db4200';
        ctx.fillStyle='#db4200'
        ctx.arc(this.x,this.y, this.r +10, 0, Math.PI * 2, false);
        ctx.fill()
        ctx.stroke();
        // n-1 circle - Orange
        ctx.beginPath();
        ctx.strokeStyle = '#f26900';
        ctx.fillStyle='#f26900'
        ctx.arc(this.x,this.y, this.r + 5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke()
        // n-2 circle - Yellow
        ctx.beginPath();
        ctx.strokeStyle = '#f29d00';
        ctx.fillStyle='#f29d00'
        ctx.arc(this.x,this.y, this.r + 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
        //Reduce the Life 
        model._lives -= (1/model.FPS)
    }
    /**
     * @method drawLaser 🎨
     * @description contains the instructions to draw the laser on the canvas
     */
    drawLasers(){
        //Applying the lasers
        //Looping backwards through the laser array
        for(let laserIndex = this.laserArray.length-1 ; laserIndex >= 0; laserIndex-- ){
            //Calculate the distance travelled
            this.laserArray[laserIndex].distanceTravelled += 
                Math.sqrt(this.laserArray[laserIndex].vX**2 + this.laserArray[laserIndex].vY**2);

            if(this.laserArray[laserIndex].distanceTravelled > 
                    this.laserDistance * model.width)
                    {
                        this.laserArray.splice(laserIndex,1)
                     }
        }
        
        //Draw each laser
        this.laserArray.forEach(laser => {

            ctx.fillStyle = "red"
            ctx.beginPath();
            ctx.arc(laser.x,laser.y,this.SHIP_SIZE/8,0,Math.PI*2,false);
            ctx.fill();
            ctx.closePath();
            
            //move the laser
            laser.x += laser.vX
            laser.y += laser.vY

            //Handling the edge of screen adjustments for the laser
            //Slightly different to the model.screenEdges function
            
            if(laser.x < 0){
                laser.x = model.width
            }else if(laser.x > model.width){
                laser.x = 0
            }
            if(laser.y < 0){
                laser.y = model.height
            }else if(laser.y > model.height){
                laser.y = 0
            }
           
        })
    }
    /**
     * @method shootLasers 🌠
     * @description Provides the instruction on creating each individual laser as it is shot from the ship
     */
    shootLasers(){
        //create the laser object
        /**@constant LASER_SPEED - Speed of the Laser in px/sec*/
        const LASER_SPEED = 300
        /**@constant LASER_MAX - Maximum number of laser objects that can be created */
        const LASER_MAX = 25 
        
        if(this.laserStatus && this.laserArray.length < LASER_MAX){
            //Creating a laser object 
            this.laserArray.push({
                //Shooting from the nose of the ship;
                x:this.x + 4 / 3 * this.r * Math.cos(this.a),
                y:this.y - 4 / 3 * this.r * Math.sin(this.a),
                //Applying the velocity
                vX: LASER_SPEED * Math.cos(this.a) / model.FPS,
                vY: -LASER_SPEED * Math.sin(this.a) / model.FPS,
                distanceTravelled:0//Tracks the distance of the laser travelling
            })
           
        }
        //Last Laser fired
        if(this.laserArray.length >= LASER_MAX){
            this.laserArray.push({
                //Fire one last laser object 
                x:this.x + 4 / 3 * this.r * Math.cos(this.a),
                y:this.y - 4 / 3 * this.r * Math.sin(this.a),
                vX: LASER_SPEED * Math.cos(this.a) / model.FPS,
                vY: -LASER_SPEED * Math.sin(this.a) / model.FPS,
                distanceTravelled:0
            })
            //Resetting the array 
            this.laserArray = []
        }
    
        //Asteroid 2 Laser Collision Detection
        model.asteroidField.forEach((asteroid,asteroidIndex)=>{

            this.laserArray.forEach((laser,laserIndex)=>{
                
                if(distanceBetweenPoints(laser.x,laser.y,asteroid.x,asteroid.y) < (Math.PI/2) * asteroid.r){
                
                    //destroy asteroid
                    model.destroyAsteroid(asteroidIndex)
                    //remove the laser
                    this.laserArray.splice(laserIndex,1)
                }
            })
        })
    }
}


/**
 * @class AsteroidObject  @extends BasicObject
 * @classdesc Object literal containing the values and methods that pertains to the model for each  Asteroid object 🌚
 */
class AsteroidObject extends BasicObject {
    constructor(x,y,r,asteroidIndex){
        super(x,y,r)
        /**@this this.a - returns a random angle in radians */
        this.a = Math.random() * Math.PI * 2
        /**@this this.vX - random Velocity on the x-axis  */
        this.vX =randomNumber(5,10)/model.FPS * (randomNumberDecimal() <0.5 ? 1 : -1)
        /**@this this.vY - random Velocity on the y-axis  */
        this.vY = randomNumber(5,10)/model.FPS * (randomNumberDecimal() <0.5 ? 1 : -1)
        /**@this this.vertices - Random number of vertices for the polygon to be generated */
        this.vertices =Math.floor(randomNumber(2,8) + randomNumber(2,8)),//Each asteroid has a random number of vertices
        /**@this this.jaggedness - random determination on the amount of jaggedness on the asteroid */
        this.jaggedness = randomNumberDecimal(), // 0 = none 1 = 100
        /**@this this.offsets - Array of positions for the dimensions of the polygon */
        this.offsets = []
        /**@this this.asteroidIndex - Asteroid Index position in the Array */
        this.asteroidIndex = Number(asteroidIndex);
    }
    /**
     * @method draw 🎨
     * @description Contains the instructions to draw the 🌚 on the canvas
     */
    draw(){
        //Draw Asteroids
        ctx.strokeStyle = '#BADA55';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'transparent';
        //draw a path
        ctx.beginPath();
            ctx.moveTo(
        this.x + (this.offsets[0]  * this.r) * Math.cos(this.a),
        this.y + (this.offsets[0]  * this.r) * Math.sin(this.a)
        )
        //draw the polygon and jaggedness to each asteroid
        for(let polygon = 1; polygon < this.vertices; polygon++){
            ctx.lineTo(
                this.x + (this.offsets[polygon] * this.r) *  Math.cos(this.a + polygon * Math.PI * 2 / this.vertices),
                this.y + (this.offsets[polygon] * this.r)*  Math.sin(this.a + polygon * Math.PI * 2 / this.vertices)
                )
            }
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        
        //Handle collision Detection - only if the spaceship exists else ignore collision detection
        this.asteroid2asteroidCollision()
        if(spaceship){
            this.asteroid2shipCollision()    

        }
        
        //move asteroid
        this.x += this.vX
        this.y += this.vY
        
        //handle edge of screen
        model.screenEdges(this)

        
    }
    /**
     * @method asteroid2asteroidCollision 🌒↔🌚*🌚↔🌘
     * @description Preforms a form of soft ricochet between each asteroid if they happen to collide with each others radial distance from its center. 
     */
    asteroid2asteroidCollision(){
        let currentAsteroid = this;
        model.asteroidField.forEach((otherAsteroid)=>{
            if(currentAsteroid != otherAsteroid){
                if(distanceBetweenCircles(currentAsteroid.x,currentAsteroid.y,currentAsteroid.r,otherAsteroid.x,otherAsteroid.y,otherAsteroid.r) < currentAsteroid.r + currentAsteroid.x){
                    //Make the asteroids 'softly' ricochet off each other
                    //There has been many different attempts at getting this right, this is by far the best attempt at getting the asteroids to move off and change direction and their velocity that produces the least amount of Janking

                    currentAsteroid.vX = currentAsteroid.vX/( (model.FPS / 2))  + Math.sin(-currentAsteroid.a) 
                    otherAsteroid.vX = otherAsteroid.vX/ (model.FPS / 2)  + Math.sin(-otherAsteroid.a) 

                    currentAsteroid.vY = currentAsteroid.vY/ (model.FPS / 2)  + Math.cos(-currentAsteroid.a)  
                    otherAsteroid.vY = otherAsteroid.vY/ (model.FPS / 2)  + Math.cos(-otherAsteroid.a)

                }
            }
        })
    }
    /**
     * @method asteroid2asteroidCollision 
     * @description Registers that the 🚀 has collided with the 🌑 
     */
    asteroid2shipCollision(){
        if(distanceBetweenPoints(this.x,this.y,spaceship.x,spaceship.y) < spaceship.r + this.r && !spaceship.immune){
            // register that the ship is exploding 
            model.shipExploding = true
        }

    }
    
}

class GameView{
    constructor(){
        this.start = false
        this.game = false
        this.end = false
        this.newHighScore = false
       
       this.startRaF
       this.gameRaF    
       this.endRaF


       
    
    }
    //Methods
    startScreen(){
        this.start = true
        //Block scope
        
        model.createAsteroidField(10)
        
        // titleImg
        
        let titleImg = new Image();
        titleImg.src = './assets/graphics/asteroids-arcade-game-logo-sticker.svg'
        function getImgSize(){
            let scale = Math.min(model.width/titleImg.width, model.height/titleImg.height)*devicePixelRatio
            titleImg.width = titleImg.width/scale
            titleImg.height = titleImg.height/scale
    
        }
        document.addEventListener('resize',getImgSize)
        
        let blinkDuration = 100;
        
        
        outputDisplay.innerHTML=
        `
            <h2 class='credits'>
            created by aFuzzyBear - 2020
            </h2>
        `
        //Animation Frame
        function startAnimationLoop(){
            cancelAnimationFrame(view.startRaF)
            ctx.clearRect(0,0,model.width,model.height);
            ctx.fillStyle = 'black'
            ctx.fillRect(0,0,model.width,model.height);
    
            //Drawing each asteroid on the screen
            model.asteroidField.forEach((asteroid)=>{
                asteroid.draw()
            })
            if(model.width < 500){
    
                ctx.drawImage(titleImg,model.width/2 -titleImg.width/8,50,titleImg.width/4,titleImg.height/4)
            }else{
    
                ctx.drawImage(titleImg,model.width/2 -titleImg.width/4,50,titleImg.width/2,titleImg.height/2)
            }
    
            
          
    
            if(blinkDuration % 30 != 0){
                ctx.strokeStyle = 'gold'
                ctx.lineWidth = 1
                ctx.font = '2.5rem hyperspace'
                ctx.strokeText('1 PLAYER', model.width/2-50 ,model.height - 150)
                ctx.strokeText('ENTER TO START', model.width/2 -95 ,model.height - 100)
                
            }
            if(blinkDuration == 0){
                blinkDuration = 100
            }
            setInterval(()=>{
                blinkDuration -- 
               
            },model.FPS)
           
            window.addEventListener('keydown',controller.startGame)
    
           view.startRaF= requestAnimationFrame(startAnimationLoop)
    
        }
        // cancelAnimationFrame(view.startRaF)
        cancelAnimationFrame(view.gameRaF)
        cancelAnimationFrame(view.endRaF)
        requestAnimationFrame(startAnimationLoop)
    }
    gameScreen(){
        this.game = true
        this.start = false
        //Games Global Scope
         spaceship = new ShipObject(
             model.width /2,
             model.height/2,
             30,
             90,
             360,
             false,
             {x:0,y:0}
         );
     
         model.createAsteroidField(5)
           
         outputDisplay.classList.add('hide')
         //Game Animation Loop
         
         cancelAnimationFrame(view.startRaF)
         cancelAnimationFrame(view.gameRaF)
         cancelAnimationFrame(view.endRaF)
         requestAnimationFrame(view.gameAnimationLoop)
        
    }
    gameAnimationLoop(){
        
        ctx.clearRect(0,0,model.width,model.height)
        ctx.fillStyle = 'black'
        ctx.fillRect(0,0,model.width,model.height);

    
       if(spaceship){ 
           if(!model.shipExploding) {
            spaceship.draw()  
            
            }else{
                spaceship.explodeShip();

                //Timeout's to carry out these functions after a certain period of time.        
                setTimeout(model.createNewSpaceShip,1000)
                
                setTimeout(()=>{
                //Removing the ships immunity after 5 secs
                    spaceship.immune = false
                
                },5000)

            } 
        }

        if(model.asteroidField.length === 0) model.createAsteroidField(randomNumber(3,7))
        //Drawing each asteroid on the screen
        model.asteroidField.forEach((asteroid)=>{
            asteroid.draw()
        })

        //Display the Lives Counter on the Screen
        livesDisplay.innerText = `LIVES\n ${model.gameLives}`
        currentHighScoreDisplay.innerText = `HIGH SCORE\n ${(model.currentScore > model.previousHighScore)?'NEW HIGH SCORE': model.previousHighScore}`
        //Display the Score on the Screen
        scoreDisplay.innerText = `SCORE\n ${model.currentScore}`


        if(model.gameLives == 0){
            view.endScreen()
        }
        window.removeEventListener('keydown',controller.startGame)
    
        window.addEventListener('keydown',controller.keyDown)
        window.addEventListener('keyup',controller.keyUp)

        view.gameRaF = window.requestAnimationFrame(view.gameAnimationLoop)
    }
    endScreen(){
        this.end = true
        this.game = false
        // Making FireWorks
    
        const max_fireworks = 10
        const max_sparks =25;
    
        let fireworksArray = []
        for(let firework = 0; firework < max_fireworks; firework++){
            let firework = {
                sparks:[]
            }
            for(let index = 0; index < max_sparks; index++){
                let sparkler = {
                    vX: randomNumber(15,30)/model.FPS * (randomNumberDecimal() <0.5 ? 1 : -1),
                    vY: randomNumber(15,30)/model.FPS * (randomNumberDecimal() <0.5 ? 1 : -1),
                    weight: randomNumber(1,4), //size of the sparkles
                    color: `rgb(${randomNumber(0,255)},${randomNumber(0,255)},${randomNumber(0,255)})`
                }
                firework.sparks.push(sparkler)
                
            }
            fireworksArray.push(firework)
            resetFirework(firework)
        }
        function resetFirework(firework){
            firework.x = randomNumberDecimal()* model.width
            firework.y = model.height;
            firework.age = 0;
            firework.status = 'fly'
        }
    
        function explodeFirework(){
            ctx.clearRect(0,0, model.width,model.height);
            fireworksArray.forEach((firework,index)=>{
                if(firework.status == 'explode'){
                    
                    firework.sparks.forEach(spark =>{
                        for(let index = 0; index < 4; index++){
                            let trailAge = firework.age * index 
                            let x = firework.x + spark.vX * trailAge * randomNumberDecimal()**2
                            let y = firework.y + spark.vY * trailAge * randomNumberDecimal()**2
                            let fade = randomNumberDecimal()
                            let color = `rgb(${randomNumber(0,255)*fade},${randomNumber(0,255)*fade},${randomNumber(0,255)*fade},1)`
    
                            ctx.beginPath();
                            ctx.fillStyle = color;
                            ctx.arc(x,y,spark.weight,0,2*Math.PI)
                            // ctx.rect(x,y,spark.weight,spark.weight)
                            ctx.fill()
                        }
                    });
    
                    firework.age++
                    if(firework.age > model.FPS*1.5 && randomNumberDecimal() < 0.5){
                        resetFirework(firework)
                    }
                }
                else{
                    firework.y = firework.y - 10
                    for(let spark = 0; spark < 10; spark++){
                        ctx.beginPath()
                        ctx.fillStyle= `rgba(${index * 50}, ${spark * 17}, 0,${randomNumberDecimal()})`
                        ctx.rect(firework.x , firework.y + spark*5, 4,4)
                        ctx.fill()
                    }
                }
                if(randomNumberDecimal() < 0.01 || firework.y < randomNumber(25,150)) firework.status = 'explode'
                
            })
        }
        // End of Fireworks

        model.checkScore()
        
        outputDisplay.classList.remove('credits')
        outputDisplay.classList.remove('hide')
        
        let highScoresOutput = document.createElement('div')
        highScoresOutput.classList.add('highScoresDisplay')
        highScoresOutput.append(highScoresTable)
        
        let winnersText = document.createElement('div')
        winnersText.classList.add('newHighScore')
        winnersText.innerHTML=`
            <div class="title-wrapper">
                <h2>
                    Congratulations on Setting a New High Score
                </h2>
            </div>
            <div class="form-wrapper">
                <input type="text" name="playerName" id="input-playerName" placeholder="Enter Name" onchange="model.playerName()">
                <button type="submit" onclick="model.addScore()">Submit</button>
            </div>`
        
        let btnRestart = document.createElement('button');
        btnRestart.classList.add('btn-restart')
        btnRestart.innerText = 'Restart Game'


        if(this.newHighScore){
            outputDisplay.appendChild(highScoresOutput)
            outputDisplay.append(winnersText)
            outputDisplay.append(btnRestart)            
        }
        else{
            //Game over Text
            outputDisplay.appendChild(highScoresOutput)
            outputDisplay.append(btnRestart)            

        }

        model.populateHighScoresList((model.highScoresFromStorage) ? [...model.highScoresFromStorage]:[],highScoresTable)
        window.removeEventListener('mousedown',controller.removeDefault)
        window.removeEventListener('keydown',controller.removeDefault)
        btnRestart.addEventListener('click',()=>{
            //Reload the window to reset the game 
            controller.restart()
        })

        
        function endAnimationLoop(){
            cancelAnimationFrame(view.startRaF)
            cancelAnimationFrame(view.gameRaF)
            ctx.clearRect(0,0,model.width,model.width)
            ctx.fillRect(0,0,model.width,model.height)
            
            if(view.newHighScore){
                explodeFirework()
            }else{

                //Drawing each asteroid on the screen
                model.asteroidField.forEach((asteroid)=>{
                asteroid.draw()
                })
            }
            view.endRaF = requestAnimationFrame(endAnimationLoop)
        }
        requestAnimationFrame(endAnimationLoop)
    }
    
}   

class GameController{
    constructor(){
     
       
        

            window.addEventListener('mousedown',this.removeDefault)
            window.addEventListener('keydown',this.removeDefault)
            
     
    }
    removeDefault(event){
        // Prevent default behaviour from causing DOM default actions to override the game
        event.preventDefault()
    }
    keyDown(event){
        
        switch(event.code){
            case "ArrowUp":
                event.preventDefault()
                spaceship.thrusting = true
                break
            case "KeyW":
                //Start Ship Thrusting
                spaceship.thrusting = true
                break
            case "ArrowRight":
                event.preventDefault()
                spaceship.rot = -convertRadians(spaceship.TURN_DEG) / model.FPS
                break
            case "KeyD":
                //Rotate Ship Anti-Clockwise
                spaceship.rot = -convertRadians(spaceship.TURN_DEG) / model.FPS
                break
            case "ArrowLeft":
                event.preventDefault()
                spaceship.rot = convertRadians(spaceship.TURN_DEG) / model.FPS
                break
            case "KeyA":
                //Rotate Ship Clockwise
                spaceship.rot = convertRadians(spaceship.TURN_DEG) / model.FPS
                break
            case "Space":
                event.preventDefault()
                //shoot laser
                spaceship.shootLasers();
                break
        }

    }
   
    keyUp(event){
        switch(event.code){
            case "ArrowUp":
            case "KeyW":
                //Stop Thrusting
                spaceship.thrusting = false
                break
            case "ArrowRight":
            case "KeyD":
                //Rotate 
                spaceship.rot = 0
                break
            case "ArrowLeft":
            case "KeyA":
                //Start Thrusting
                spaceship.rot = 0
                break
        }    
    }
    startGame(event){
        switch(event.code){
            case 'Enter':
                view.gameScreen()
                break
        }
    }

    restart(){
        // Clearing the previous game data
        model = null
        
        livesDisplay.innerText = ''
        scoreDisplay.innerText = ''
        currentHighScoreDisplay.innerText = ''
        //re-instantiating the game model 
        
        model = new GameModel()
        
        
        view.startScreen()
    }
    onLoad(){
        
        model = new GameModel()
        
    
        return view.startScreen()
    }
   
    
}
//Global Scope
let spaceship,model

let view = new GameView()


let controller = new GameController()


window.addEventListener('load',controller.onLoad())
