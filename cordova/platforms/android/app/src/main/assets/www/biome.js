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
    "space",
    [20,20,20],
    function(){
    newOddPoly(250,20,0.1,8);
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
    	background(150,180,120)
    },
  ),
  new Biome(
    "pink hell",
    [255,155,132],
    function(){
    newOddPoly(160,70,0.23,14);
    enemyNo=math.floor(random(3,5))
    placeEnemies(enemyNo,quads[0].points)
    },
    function(x1,y1,x2,y2){
    	stroke(245,218,181)
    	line(x1,y1,x2,y2)
    },
    function(x,y){
    	stroke(245,218,181)
    	fill(255,221,221)
    	ellipse(x,y,20,20)
    },
    function(){
    	background(255,143,123)
    },
  ),
  new Biome(
    "car park",
    [104,76,60],
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
    	background(193,200,255)
    },
  ),
  new Biome(
    "park",
    [198,228,170],
    function(){
    newOddPoly(300,50,0.2,20);
    enemyNo=math.floor(random(5,7))
    placeEnemies(enemyNo,quads[0].points)
    },
    function(x1,y1,x2,y2){
    	stroke(205,225,109)
    	line(x1,y1,x2,y2)
    },
    function(x,y){
    	stroke(205,225,109)
    	fill(205,62,109)
    	ellipse(x,y,20,20)
    },
    function(){
    	background(205,235,176)
    },
  ),
  new Biome(
    "ship",
    [104,76,60],
    function(){
    newOddPoly(350,20,0.22,8);
    enemyNo=math.floor(random(1,3))
    placeEnemies(enemyNo,quads[0].points)
    },
    function(x1,y1,x2,y2){
    	stroke(135,89,89)
    	line(x1,y1,x2,y2)
    },
    function(x,y){
    	stroke(135,89,89)
    	fill(173,100,100)
    	rect(x-5,y-5,10,10)
    },
    function(){
    	background(193,200,255)
    },
  ),
]
