class Biome{
  constructor(name,polyBG,startFunc,lineDrawFunc,cornerDrawFunc,backgroundDrawFunc){
    this.name=name;
    this.polyBG=polyBG;
    this.start=startFunc;
    this.lineDraw=lineDrawFunc;
    this.cornerDraw=cornerDrawFunc;
    this.backgroundDraw=backgroundDrawFunc;
  }
}


biomes=[
  new Biome(
    "test",
    [20,20,20],
    function(){
    newOddPoly(250,0,0,8);
    enemyNo=math.floor(random(1,3))
    placeEnemies(enemyNo,quads[0].points)
    },
    function(x1,y1,x2,y2){
    	stroke(255)
    	line(x1,y1,x2,y2)
    },
    function(x,y){
    	stroke(255)
    	fill(255)
    	ellipse(x,y,cornerRad,cornerRad)
    },
    function(){
    	background(0,0,0)
    },
  ),
  new Biome(
    "house",
    [145,74,50],
    function(){
    newOddPoly(250,50,0.22,4);
    enemyNo=math.floor(random(1,3))
    placeEnemies(enemyNo,quads[0].points)
    },
    function(x1,y1,x2,y2){
    	stroke(140, 90, 30)
    	line(x1,y1,x2,y2)
    },
    function(x,y){
    	stroke(140, 90, 30)
    	fill(95,60,20)
    	rect(x-5,y-5,10,10)
    },
    function(){
    	background(70,120,80)
    },
  ),
  new Biome(
    "hell",
    [200,0,0],
    function(){
    newOddPoly(120,40,0.23,14);
    enemyNo=math.floor(random(3,5))
    placeEnemies(enemyNo,quads[0].points)
    },
    function(x1,y1,x2,y2){
    	stroke(75,0,75)
    	line(x1,y1,x2,y2)
    },
    function(x,y){
    	stroke(150,0,150)
    	fill(50,0,50)
    	ellipse(x,y,cornerRad,cornerRad)
    },
    function(){
    	background(170,0,0)
    },
  ),
  new Biome(
    "car park",
    [70,210,70],
    function(){
    newOddPoly(120,20,0.23,6);
    enemyNo=math.floor(random(2,3))
    placeEnemies(enemyNo,quads[0].points)
    },
    function(x1,y1,x2,y2){
    	stroke(75,75,75)
    	line(x1,y1,x2,y2)
    },
    function(x,y){
    	stroke(150,150,150)

    	fill(50,50,50)
    	rect(x-10,y-10,20,20)
    },
    function(){
    	background(40,180,40)
    },
  ),
  new Biome(
    "park",
    [20,240,60],
    function(){
    newOddPoly(300,50,0.2,20);
    enemyNo=math.floor(random(5,7))
    placeEnemies(enemyNo,quads[0].points)
    },
    function(x1,y1,x2,y2){
    	stroke(102,51,0)
    	line(x1,y1,x2,y2)
    },
    function(x,y){
    	stroke(102,51,0)
    	fill(153,77,0)
    	ellipse(x,y,cornerRad,cornerRad)
    },
    function(){
    	background(0,220,40)
    },
  ),
  new Biome(
    "ship",
    [120, 70, 10],
    function(){
    newOddPoly(350,20,0.22,8);
    enemyNo=math.floor(random(1,3))
    placeEnemies(enemyNo,quads[0].points)
    },
    function(x1,y1,x2,y2){
    	stroke(140, 90, 30)
    	line(x1,y1,x2,y2)
    },
    function(x,y){
    	stroke(140, 90, 30)
    	fill(95,60,20)
    	rect(x-5,y-5,10,10)
    },
    function(){
    	background(150,150,255)
    },
  ),
]
