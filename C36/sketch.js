var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gamestate,readgameState, currentTime;
var bed,gar,wr;
var hungry,playing,sleeping,bathing;
var g,b,w;

function preload(){
sadDog=loadImage("Images/Dog.png");

happyDog=loadImage("Images/happy dog.png");
bed=loadImage("virtual pet images/Bed Room.png");
gar=loadImage("virtual pet images/Garden.png");
wr=loadImage("virtual pet images/Wash Room.png");

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

 
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  g=createSprite(1000,400);
  g.addImage(gar);
  b=createSprite(1000,400);
  b.addImage(bed);
  w=createSprite(1000,400);
  w.addImage(wr);
  b.scale = 1.8;
  g.scale = 1.8;
  w.scale = 1.8;

  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  if(gamestate!= "hungry"){
    feed.hide();
    addFood.hide()
    dog.addImage(happyDog)
    
  }else{
    feed.show();
    addFood.show()
    
  }

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  
// function to read gamestate
readgameState =database.ref('gameState');
readgameState.on("value",function(data){
  gamestate = data.val;
});
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
   currentTime = hour();
   if (currentTime ===(lastFed +1)){
       update ("playing");
       foodObj.garden()
       feed.hide();
       addFood.hide()
       dog.remove()
   }else if(currentTime ===(lastFed +2)){
    update ("sleeping");
    foodObj.bedroom();
    feed.hide();
    addFood.hide()
    dog.remove()

   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
     update("bathing");
     foodObj.washroom();
     feed.hide();
     addFood.hide()
     dog.remove()
   }else{
     update("hungry")
     foodObj.display();
     feed.show();
     addFood.show()
     dog.addImage(sadDog)
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
    
  })
}

function update(state){
  database.ref('/').update({
    gamestate:state
  });
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}