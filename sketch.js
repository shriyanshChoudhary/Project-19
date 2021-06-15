var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bird,cloud,meteor,storm,invis1,invis2;
var backgroun,sun;
var stormsGroup,meteorsGroup,cloudsGroup;
var gameover,restart;

var score = 0;

function preload() {
  
  moved = loadAnimation("1.png","2.png","3.png","4.png");
  loss = loadAnimation("lost.png");
  bg = loadImage("bg.jpg");
  sunImage = loadImage("sun.png");
  
  stormCloud = loadImage("stormc.png");
  metor = loadImage("flame.png");
  cloudImage = loadImage("cloud.png");
  
  gameend = loadImage("gm.png");
  reset = loadImage("reset.png");
}

function setup() {
  createCanvas( displayWidth, displayHeight);
  
  backgroun = createSprite(width/2,height/2.10,10);
  backgroun.addImage(bg);
  
  sun = createSprite(width/4,100,10,10);
  sun.addImage(sunImage);
  sun.scale = 0.3;
  
  bird = createSprite(70,30,20,20);
  bird.addAnimation("moving",moved);
  bird.addAnimation("stopped",loss);
  
  invis1 = createSprite(40,1,100,2);
  invis1.visible = false; 
  
  invis2 = createSprite(width/2,height-1,width,2);
  invis2.visible = false;
  
  cloud1 = createSprite(70,height-10,10,10);
  cloud1.addImage(cloudImage);
  cloud1.scale = 0.2;
  cloud1.velocityX = -6;
  
  cloud2 = createSprite(310,380,10,10);
  cloud2.addImage(cloudImage);
  cloud2.scale = 0.2;
  cloud2.velocityX = -6;
  
  gameover = createSprite(width/2,height/2,10,10);
  gameover.addImage(gameend);
  gameover.scale = 0.5;
  
  restart = createSprite(width/2,height/2+45,10,10);
  restart.addImage(reset);
  restart.scale = 0.12;
  
  stormsGroup = createGroup();
  cloudsGroup = createGroup();
  meteorsGroup = createGroup();
}

function draw() {
  background("lightblue");
  
  if(cloud1.x <-250 || cloud2.x <-250){
    cloud1.destroy();
    cloud2.destroy();
  }
  
  if(gameState === PLAY){
    
    bird.velocityY = bird.velocityY + 0.2;
    
    if(touches.length>0 || keyDown("space")){
      bird.velocityY = -5;
      touches = [];
      
    }
    
    gameover.visible = false;
    restart.visible = false;
    
    score = score + Math.round(frameRate() / 60);
    
    spawnClouds();
    spawnStorms();
    spawnMeteors();
    
    if(stormsGroup.isTouching(bird) ||
       meteorsGroup.isTouching(bird) ||
       bird.isTouching(invis2)) {
      gameState = END;
      
    }
    
  }
  
  if(gameState === END){
    
    bird.changeAnimation("stopped",loss);
    bird.velocityY = 0;
    stormsGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    meteorsGroup.setVelocityXEach(0);
    meteorsGroup.setVelocityYEach(0);
    
    gameover.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart) || touches.length > 0){
      resett();
    }
  }
  
  createEdgeSprites();
  bird.bounceOff(invis1);
  
  drawSprites();
  textSize(17);
  stroke("black");
  text("Score : "+score,width-120,30);
}

function resett() {
  gameState = PLAY;
  score = 0;
  
  bird.changeAnimation("moving",moved);
  bird.y=30;
  stormsGroup.destroyEach();
  meteorsGroup.destroyEach();
}

function spawnStorms() {
  
if(frameCount % 60 === 0){
  storm = createSprite(width+20,160,10,10);
  storm.addImage(stormCloud);
  storm.scale = 0.3;
  storm.setCollider("rectangle",0,-70,360,250);
  
  storm.y = Math.round(random(0,height));
  
  storm.depth = cloud.depth;
  cloud.depth = cloud.depth + 1;
  
  storm.velocityX = -(6 + (Math.round(score/100)));
  storm.lifetime = -1;
  stormsGroup.add(storm);
}  
}

function spawnClouds(){
  
  if(frameCount % 30 === 0) {
    cloud = createSprite(width + 70,380,10,10)
    cloud.addImage(cloudImage);
    cloud.scale = 0.2; 
    cloud.y = Math.round(random(height-30,height));
    
    cloud.lifetime = -1;
    cloud.velocityX = -(6 + (Math.round(score/100)));
    cloudsGroup.add(cloud);
  }
}

function spawnMeteors() {
if(frameCount % 230 === 0){
  meteor = createSprite(450,-30,10,10);
  meteor.addImage(metor);
  meteor.scale = 0.3;
  
  meteor.x = Math.round(random(width-140,width+100));
  
  meteor.depth = cloud.depth;
  cloud.depth = cloud.depth+1;
  
  meteor.velocityX = -(8 + (Math.round(score/100)));
  meteor.velocityY = (9 + (Math.round(score/100)));
  meteor.lifetime = -1;
  meteorsGroup.add(meteor);
}  
}