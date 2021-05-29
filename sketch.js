var PLAY = 1;
var END = 0;
var gameState = PLAY;

var kid, kid_img, kid_collided;
var bg, invisibleGround;
var backgroundImg;

var plantGroup,plant, p1,p2,p3;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score=0;

var gameOver, restart,  restartImg;

function preload(){
  kid_img =  loadImage("kid.png");
  kid_collided = loadImage("kid_sad.png");
  
  backgroundImg = loadImage("backgroundbf1.png");
  
  p1 = loadImage("bush.png");
  p2 = loadImage("grass.png");
  p3 = loadImage("flower.png");
  
  obstacle1 = loadImage("cigar.png");
  obstacle2 = loadImage("BOTTLE.png");
  obstacle3 = loadImage("paperball.png");
  
  //gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("reset.png");
}

function setup() {
  createCanvas(700, 600);

  plantGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
  bg = createSprite(800,300,1,1);
  bg.addImage(backgroundImg);
  bg.x = bg.width /2;
  bg.velocityX = -(6 + 3*score/100);

  kid = createSprite(50,500,20,50);
  kid.addImage(kid_img);
  //kid.addImage(kid_collided);
  kid.scale = 0.3;

  reset = createSprite(350,180);
  reset.addImage(restartImg);
  reset.visible = false;
  reset.scale = 0.5;

  invisibleGround = createSprite(300,570,1000,10);
  invisibleGround.visible = false;


}

function draw() {
  //play
  console.log(gameState)
  background("white");
  drawSprites();
  textSize(25)
  fill (0);
  
  
  
  
  if (gameState===PLAY){
    
    text("Score: "+ score, 500,50);
    text("Read rules.js for rules!", 50,50);
    if(plantGroup.isTouching(kid)){
      score = score+1;
      plantGroup.destroyEach();
    }
    bg.velocityX = -(6 + 3*score/3);

    if(keyDown("space") && kid.y >= 500) {
      kid.velocityY = -17;
    }
    kid.velocityY = kid.velocityY + 0.8

    kid.collide(invisibleGround);
    if (bg.x < 0){
      bg.x = bg.width/2;
    }
  
    spawnPlants();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(kid)){
        gameState = END;
    }
    
  }
  else if (gameState === END) {
    text("Score: "+ score, 500,50);
    textSize(40)
    fill ("red");
    text("Game Over!!", 240,300);
    reset.visible = true;
    
    //set velcity of each game object to 0
    bg.velocityX = 0;
    kid.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    plantGroup.setVelocityXEach(0);
    
    //change the trex animation
    kid.addImage(kid_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    plantGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(reset)) {
      restart();
    }
  
  }
  
  
  
}

function spawnPlants() {
  //write code here to spawn the clouds
  if (frameCount % 180 === 0) {
    var plant = createSprite(900,400,40,10);

    plant.scale = 0.25;
    plant.velocityX = -5;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: plant.addImage(p1);
              break;
      case 2: plant.addImage(p2);
              break;
      case 3: plant.addImage(p3);
              break;
      default: break;
    }
     //assign lifetime to the variable
    plant.lifetime = 320;
    
    //adjust the depth
    plant.depth = kid.depth;
    kid.depth = kid.depth + 1;
    
    //add each cloud to the group
   plantGroup.add(plant);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(900,540,10,40);
    obstacle.debug = false;
    obstacle.velocityX = -(6 + 3*score/3);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 0.4;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.08;
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale = 0.04;
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function restart(){
  gameState = PLAY;
  reset.visible = false;
  
  obstaclesGroup.destroyEach();
  plantGroup.destroyEach();
  kid.addImage(kid_img);
  score = 0;
  
}