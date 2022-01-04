var PLAY = 1;
var END = 0;
var gameState = PLAY;

var thief, police, coin_falling, coin;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;
var powerup1, powerup2, powerup3, gun1;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  thief = loadAnimation("2thief.jpg", "2thief1.jpg", "2thief2.jpg");
  police = loadAnimation ("policeman.jpg", "policeman1.jpg","policeman.jpg");
  coin = createImage ("coin-gif.gif");
  coin_falling = loadImage ("coin-falling-end.gif")

  console.log(police)
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle.png");
  obstacle2 =  loadImage("obstacle1.png");
  obstacle3 =  loadImage("obstacle2.png");
  
  gun1 = loadImage ("gun-gif.gif");
  powerup1 = loadImage ("power-ups1.png");
  powerup2 = loadImage ("power-ups2.png");
  powerup3 = loadImage ("power-ups3.png");

  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")


}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  thief1 = createSprite(100,150,20,50);
  thief1.addAnimation("running", thief);

 police1 = createSprite (35,150, 20, 50)
 police1.addAnimation("running", police )
  //thief1.addAnimation("collided", thief1);
  

  thief1.scale = 0.2;
  police1.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();

  cloudsGroup = createGroup();

  
  thief1.setCollider("rectangle",0,0,thief1.width,thief1.height);
  thief1.debug = false
  
  score = 0;
  
}

function draw() {
  
  background("white");
  //displaying score
  text("Score: "+ score, 500,50);
  
console.log(gameState+' gameState')  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -4 
    //scoring
   score = score + Math.round(frameCount/60);
    
    // if(score>0 && score%2000 === 0){
    //    checkPointSound.play() 
    // }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& thief1.y >= 100) {
      console.log("space pressed")
      thief1.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    thief1.velocityY = thief1.velocityY + 0.8
  
    //spawn the clouds
    //spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(thief1)){
        //thief1.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the thief1 animation
     thief1.changeAnimation("collided", thief1);
    
     
    
      ground.velocityX = 0;
      thief1.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    // obstaclesGroup.setLifetimeEach(-1);
    // cloudsGroup.setLifetimeEach(-1);
     
    //  obstaclesGroup.setVelocityXEach(0);
    //  cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop thief1 from falling down
  thief1.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  
 obstaclesGroup.destroyEach();  
 cloudsGroup.destroyEach();
 score = 0;
 gameState = PLAY;
 thief1.changeAnimation("running", thief1);  
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/1000);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1:
        obstacle.addImage(obstacle1);
              break;
      case 2:
       obstacle.addImage(obstacle2);
       break;
      case 3: 
      obstacle.addImage(obstacle3);
      break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
   // obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = thief1.depth;
    thief1.depth = thief1.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
