
        Making FireWorks
    
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
                    weight: randomNumber(1,4), //size of the sparklers
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
                requestAnimationFrame(explode)
        }
    