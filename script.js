//fix wrong angle in getreboundvel
//fix corner angles
//fix sticking and spinning when velocity too low
//find out how ball can still get out (use point in poly?)
//add scoring
//add more biomes
/*
  garden (small, simple, squareish)
  road (big, bisected by road with cars)
  park (big, jagged, with dogs or something?)
  boss where you save the hog (?)
*/
//add more hogs
//add menu screen
//add imgs for edges/pretty up edges

//alert(2)
gamestate="menu"
//alert(1)
cornerRad=10
cornerColOn=true
quads=[]
function newQuad(pointAr){
  nQuad={}
nQuad.points=[]
  for(q=0;q<pointAr.length;q++){
    nQuad.points.push([pointAr[q][0],pointAr[q][1]]);
  }
  //console.log(nQuad)
  quads.push(nQuad)
//console.log(quads.length);
}
function newRect(x,y,w,h){
  newQuad([[x,y],[x+w,y],[x+w,y+h],[x,y+h]]);
}

function newOddPoly(rad,radGive,giveRatio,steps){
  cx=width/2
  cy=height/2
  //rad=120
  //radGive=50
  //radGive=20
  //radGive=0
  //steps=14
  interval=2*PI/steps
  give=interval*giveRatio
  //give=0
  pAr=[]
  for(p=0;p<steps;p++){
    polyAngle=(interval*p)+random(-give,give);
    polyRadX=rad+random(-radGive,radGive);
    polyRadY=rad+random(-radGive,radGive*2.5);
    polyX=cx+sin(polyAngle)*polyRadX
    polyY=cy+cos(polyAngle)*polyRadY
    pAr.push([polyX,polyY]);
  }

  newQuad(pAr);
  
}

function areaTri(p1Ar,p2Ar,p3Ar){
   triA=dist(p1Ar[0],p1Ar[1],p2Ar[0],p2Ar[1])
triB=dist(p2Ar[0],p2Ar[1],p3Ar[0],p3Ar[1])
triC=dist(p3Ar[0],p3Ar[1],p1Ar[0],p1Ar[1])
triP=(triA+triB+triC)/2
   
   return math.sqrt(triP*(triP-triA)*(triP-triB)*(triP-triC))
}



function pointInPoly(pAr,polyPAr){

  linesThatIntersect=0
  for(pj=0;pj<polyPAr.length;pj++){
    
    if(pj==polyPAr.length-1){
      pj2=0
    }else{
      pj2=pj+1
    }
    //console.log(pj,pj2)

   lp1=polyPAr[pj]
   lp2=polyPAr[pj2]

    polyLineIntersect=math.intersect([0,pAr[1]],[pAr[0],pAr[1]],[lp1[0],lp1[1]],[lp2[0],lp2[1]])
polyLineTest=[[0,pAr[1]],[pAr[0],pAr[1]],[lp1[0],lp1[1]],[lp2[0],lp2[1]]]
   //console.log(polyLineIntersect)

   if(polyLineIntersect!=null && polyLineIntersect[0]<pAr[0]&&inBox(polyLineIntersect[0],polyLineIntersect[1],lp1[0],lp1[1],lp2[0],lp2[1],0)){
      linesThatIntersect++;
      //console.log("intersect",pj,pj2)
   }else{
      //console.log("not intersect",pj,pj2)
   }

  //end for lines
  }

  if(linesThatIntersect%2!=0){
    return true
  }else{
    return false
  }

}

function circleInPoly(pAr,rad,polyPAr){
   pArs=[
   [pAr[0]-rad/2,pAr[1]],
   [pAr[0]+rad/2,pAr[1]],
   [pAr[0],pAr[1]-rad/2],
   [pAr[0],pAr[1]+rad/2]
   ]
   for(pa=0;pa<pArs.length;pa++){
     if(!pointInPoly(pArs[pa],polyPAr)){return false}
   }
   return true;
}

enemies=[]
function newEnemy(x,y){
   //alert("new enemy")
   newE={
     x:x,
     y:y,
     r:35,
     hits:3,
     isHit:false,
     hitScore:100,
     almostR:55,
     placementR:90
   }
   enemies.push(newE)
}
function placeEnemies(num,polyAr){
   
   while(enemies.length<num){
     
     x=math.floor(random(0,width))
     y=math.floor(random(0,height))

     
     //alert("try "+x+","+y)
if(circleInPoly([x,y],45,polyAr)){
       enemyWrong=false
if(!circleColl(x,y,30/2,width/2,height/2,60/2)){
for(en=0;en<enemies.length;en++){
   enemy=enemies[en]
   if(circleColl(x,y,30/2,enemy.x,enemy.y,enemy.placementR/2)){
       enemyWrong=true
         }
       }
       if(!enemyWrong){newEnemy(x,y)}


     //end if
     }
   //end if
   }
    //end while
   }
   

   //place goal
   goalPlaced=false
   while(!goalPlaced){
     goal.x=math.floor(random(0,width))
     goal.y=math.floor(random(0,height))
     if(circleInPoly([goal.x,goal.y],50,polyAr)){
       goalPlaced=true

     }
   }
//end func
}

function drawEnemies(){
  for(en=0;en<enemies.length;en++){
     enemy=enemies[en]
     if(enemy.hits>0){
ellipse(enemy.x,enemy.y,enemy.r,enemy.r)
//image(imgs.enemies[biome],enemy.x,enemy.y,enemy.r,enemy.r)
image(imgs.enemies[0],enemy.x,enemy.y,enemy.r,enemy.r)
     ellipse(enemy.x,enemy.y,enemy.almostR,enemy.almostR)

text(enemy.hits+"",enemy.x,enemy.y)

    }
  }

}


function checkGoal(){
  gotEnemies=false
  for(q=0;q<enemies.length;q++){
    if(enemies[q].hits>0){gotEnemies=true}
  }

  if(!gotEnemies){goal.active=true}
}

function getNormal(dy,dx){
  nA=atan2(dx,dy)
  return nA+PI/2
}

function clamp(x,min,max){
  xReturn=x
  if(x<min){xReturn=min}
  else if(x>max){xReturn=max}
  return xReturn
}

function between(a,b,c,buffer){
  return ((a>b-buffer && a<c+buffer)||(a>c-buffer && a<b+buffer));
}


//point in box defined by top left and bottom right
function inBox(x,y,x1,y1,x2,y2,buffer){
  
  if(between(x,x1,x2,buffer)&&between(y,y1,y2,buffer)){
  return true
 }else{
  return false
 }
}

function circleColl(cx1,cy1,cr1,cx2,cy2,cr2){

  return(dist(cx1,cy1,cx2,cy2)<cr1+cr2)

}

function circleLineColl(cx,cy,cr,p1x,p1y,p2x,p2y){
  cr=cr+5
  //cr=cr/2
  //get line angle
  lineAngle=atan2(p2y-p1y,p2x-p1x);
  //get line normal
  lineNormal=getNormal(p2y-p1y,p2x-p1x)

  //get points of line with length r
  cRayEndX=cx+sin(lineNormal)*-cr/2
  cRayEndY=cy+cos(lineNormal)*-cr/2
  //if line intersects with line then collide else no
  cRayIntersect=math.intersect([p1x,p1y],[p2x,p2y],[cx,cy],[cRayEndX,cRayEndY])
p1xNew=p1x
p1yNew=p1y
p2xNew=p2x
p2yNew=p2y
/*p1xNew=p1x-sin(lineAngle)*cr
p1yNew=p1y-cos(lineAngle)*cr
p2xNew=p2x+sin(lineAngle)*cr
p2yNew=p2y+cos(lineAngle)*cr
*/
  if(cRayIntersect!=null && dist(cRayIntersect[0],cRayIntersect[1],cx,cy)<cr/2 && inBox(cx,cy,p1xNew,p1yNew,p2xNew,p2yNew,5)){
   //console.log("hit",lineAngle,lineNormal);
    return true;
  }else{
    return false;
  }

}


function getReboundVel(cxv,cyv,cr,p1x,p1y,p2x,p2y,pointsAreTheNormal){

   
  //get line angle
  lineAngle=atan2(p2y-p1y,p2x-p1x);
  //get line normal
  lineNormal=getNormal(p2y-p1y,p2x-p1x)
if(pointsAreTheNormal){lineNormal=lineAngle}

  velAngle=atan2(cxv,cyv)
  velMag=math.sqrt((cxv*cxv)+(cyv*cyv))


  velAngleNew=lineNormal-(atan2(cxv,cyv)-lineNormal)+PI
  /*if(atan2(cyv,cxv)>lineNormal){

    velAngleNew=lineNormal-(atan2(cyv,cxv)-lineNormal)
  }*/
  
//velAngleNew=lineNormal-(velAngle-lineNormal)


  velMagNew=velMag*0.97
  if(velMagNew<4 && !pointsAreTheNormal){velAngleNew=lineNormal}



  /*return {x:sin(velAngleNew)*velMagNew,
y:cos(velAngleNew)*velMagNew}*/
  surfaceNorm=(new Victor(p2x-p1x,p2y-p1y)).norm()
  oldVel=new Victor(cxv,cyv)
  //alert(surfaceNorm)
  //alert(oldVel)
  //I - 2.0 * dot(N, I) * N.
  
  dotNI=surfaceNorm.dot(oldVel)
  //alert("dni"+dotNI)
  
   dotNI2=surfaceNorm.clone().multiply(new Victor(dotNI*2,dotNI*2))
  
  newVel=oldVel.clone().subtract(dotNI2)
  newVel=newVel.multiply(new Victor(-0.95,-0.95))
  //alert(newVel)
  //alert("end")
  return newVel
}

biomeNames=[
"big jagged",
"small",
"park"
]


biomes=[
function(){
newOddPoly(120,40,0.23,14);
enemyNo=math.floor(random(3,5))
placeEnemies(enemyNo,quads[0].points)
},
function(){
newOddPoly(120,20,0.23,6);
enemyNo=math.floor(random(2,3))
placeEnemies(enemyNo,quads[0].points)
},
function(){
newOddPoly(300,50,0.2,20);
enemyNo=math.floor(random(5,7))
placeEnemies(enemyNo,quads[0].points)
}
]

biomeLineDraw=[
function(x1,y1,x2,y2){
	stroke(75,0,75)
	line(x1,y1,x2,y2)
},
function(x1,y1,x2,y2){
	stroke(75,75,75)
	line(x1,y1,x2,y2)
},
function(x1,y1,x2,y2){
	stroke(102,51,0)
	line(x1,y1,x2,y2)
}
]
biomeCornerDraw=[
function(x,y){
	stroke(150,0,150)
	
	fill(50,0,50)
	ellipse(x,y,cornerRad,cornerRad)
},
function(x,y){
	stroke(150,150,150)
	
	fill(50,50,50)
	rect(x-10,y-10,20,20)
},
function(x,y){
	stroke(102,51,0)
	fill(153,77,0)
	ellipse(x,y,cornerRad,cornerRad)
}
]

biomePolyDraw=[
function(polyAr){
	
},
function(polyAr){
	
},
function(polyAr){
	
}
]

biomePolyBG=[
[200,0,0],
[70,210,70],
[20,240,60]
]

biomeBackgroundDraw=[
function(){
	background(170,0,0)
},
function(){
	background(40,180,40)
},
function(){
	background(0,220,40)
}
]

//newOddPoly(rad,radGive,giveRatio,steps)

function showLevel(biome,seedParam){
	  background(0);
  stroke(255);
  timeMult=1;
  hogImg=hogs[currentHog].img
  hogballImg=hogs[currentHog].ballImg
  ball={
   x:width/2,
   y:height/2,
   r:hogs[currentHog].r,
   vx:0,
   vy:0,
   friction:hogs[currentHog].friction,
   speed:hogs[currentHog].speed,
   pixelVelLimit:80,
   imgRot:0
  };
  
  goal={
    x:0,
    y:0,
    r:70,
    active:false
  }
  touching=false;
  seed=seedParam
  randomSeed(seed)
  quads=[]
  enemies=[]
  score=0
  touchNo=0
  
  
  
  biomes[biome]();
  
  
}
function getHogToUnlock(){
	  hog=-1
	  hogsToPick=[]
	  for(k=0;k<hogs.length;k++){
	  	 //alert("hog"+k)
	  		if(!unlockedHogs.includes(k)){
	  			hogsToPick.push(k)
	  		}
	  }
	  if(hogsToPick.length>0){
	  		  hog=hogsToPick[Math.floor(Math.random()*hogsToPick.length)]
	  }
	  return hog
}
function winCurrentRun(){
	runs.push(currentRun)
	//alert("ya win!")
	hogToUnlock=getHogToUnlock()
	if(hogToUnlock>-1){
		unlockedHogs.push(hogToUnlock)
		popUp.text="You unlocked "+hogs[hogToUnlock].name+"!"
		popUp.img=hogs[hogToUnlock].img
		popUp.show=true
		paused=true
	//alert("You unlocked "+hogs[hogToUnlock].name+"!")
	}else{
		alert("You've unlocked all hogs already!")
		gamestate="menu"
	}
}

function nextLevel(){
	console.log(currentLevel)
	currentRun[currentLevel].score=score
	currentRun[currentLevel].touchNo=touchNo
	currentLevel+=1
	if(currentLevel<run.length-1){
biome=currentRun[currentLevel].biome
seed=	currentRun[currentLevel].seed
showLevel(biome,seed)
}else{
	winCurrentRun()
	
}
}

function newLevel(){
	biomeTemp=math.floor(random(biomes.length))
  
  seedTemp=math.random(10000)
  
  
  return {
  	biome:biomeTemp,
  	seed:seedTemp,
  	score:null,
  	touchNo:null
  	}
}
function newRun(){
	  run=[]
	  while(run.length<10){
	  run.push(newLevel())
	  }
	  //alert(run)
	  return run
}



function setup() {
	  gamestate="menu"
	  touching=false
	  //alert(0)
  //createCanvas(300, 450);
  ratio = window.devicePixelRatio || 1;
  w = screen.width * ratio;
  h = screen.height * ratio;
  w=window.innerWidth;
  h=window.innerHeight;
  createCanvas(w,h)
  noSmooth()
  
  imgs={
  	   enemies:[
  	   loadImage("img/enemy0.png"),
  	   loadImage("img/enemy1.png")
  	   ]
  }
  
hogs=[
{
	name:"hog",
	ballImg:loadImage("img/hog1.png"),
	img:loadImage("img/hog2.png"),
	r:30,
	speed:0.2,
	friction:0.999

},
{
	name:"speed hog",
	ballImg:loadImage("img/hog3.png"),
	img:loadImage("img/hog4.png"),
	r:25,
	speed:0.4,
	friction:0.99
},
{
	name:"junk hog",
	ballImg:loadImage("img/hog5.png"),
	img:loadImage("img/hog6.png"),
	r:25,
	speed:0.1,
	friction:0.9999
}


]


  //if no save
  unlockedHogs=[0]
  runs=[]
  
  
  currentHog=0
  paused=false
  goToMenu=false
  popUp={
  	text:"text",
  	img:null,
  	show:false,
  	onClick:function(){
  		popUp.show=false
		paused=false
  		goToMenu=true
  	},
  	draw:function(){
		fill(150,150,150)
  		rect(10,10,width-20,height-20)
		fill(255,255,255)
		text(popUp.text,10,10)
		image(hogballImg,width/2,height/2,width/3,width/3)
		
  	}
  }
  
  //nextLevel()
  

  
 //clear()
 //loop()
}




document.addEventListener("touchstart",function(e){
  e.preventDefault();
 if(gamestate=="game"){
 	 touchStartX=e.touches[0].clientX;
touchStartY=e.touches[0].clientY;
touching=true;
timeMult=0.2;
}else{
	touchStartX=e.touches[0].clientX;
 touchStartY=e.touches[0].clientY;
 touching=true;
 //alert(touchStartX+","+touchStartY)
}


});

document.addEventListener("touchend",function(e){
  touching=false;
  if(gamestate=="game"){
  	if(popUp.show){
  		popUp.show=false
  		popUp.onClick()
  	}
  	else{
  touchNo++;
  timeMult=1;
  touchXLen=mouseX-touchStartX;
  touchYLen=mouseY-touchStartY;
  touchAngle=atan2(touchXLen,touchYLen)+PI;
  touchHyp=math.sqrt((touchXLen*touchXLen)+(touchYLen*touchYLen));

touchHyp=clamp(touchHyp,-ball.pixelVelLimit,ball.pixelVelLimit);
  
ball.vx=(ball.vx+(sin(touchAngle)*touchHyp*ball.speed));
ball.vy=(ball.vy+(cos(touchAngle)*touchHyp*ball.speed));
//console.log(touchAngle)
}
}

});


function draw() {
	if(gamestate=="game"){
  /*if(ball.x<0){ball.x=0}
  else if(ball.x>width){ball.x=width}

 if(ball.y<0){ball.y=0}
 else if(ball.y>height){ball.y=height}*/
 biomeBackgroundDraw[biome]()
 
  


  translate(-ball.x+width/2,-ball.y+height/2)
  
  
  

  polyBG=biomePolyBG[biome];

  fill(polyBG[0],polyBG[1],polyBG[2])
  beginShape()
  for(j=0;j<quads[0].points.length;j++) {
  		vert=quads[0].points[j]
  		vertex(vert[0],vert[1])
  }
  endShape(CLOSE)
  noFill()
  var scribble = new Scribble();
  //background(0);
  
  ball.colliding=false
  ball.nearestLineCoords=[]
  ball.nearestIntersect=[]

for(i=0;i<quads.length;i++){
//if(false){
quad=quads[i]
p=quad.points
for(j=0;j<p.length;j++){
p1=p[j]
if(j<p.length-1){
 p2=p[j+1]
}else{
 p2=p[0]
}

//get ball vel line (timeMult included)
testRayAngle=atan2(ball.vx,ball.vy);
testVelHyp=math.sqrt((ball.vx*ball.vx)+(ball.vy*ball.vy))*timeMult
testRayX=sin(testRayAngle)*testVelHyp
testRayY=cos(testRayAngle)*testVelHyp
ballIntCoords=math.intersect([p1[0],p1[1]],[p2[0],p2[1]],[ball.x,ball.y],[testRayX,testRayY])
//console.log("ballIntCoords",ballIntCoords);
  ballIntDist=dist(ballIntCoords[0],ballIntCoords[1],ball.x,ball.y)
//if intersect with current line
//if coords dist from ball less than velhyp and (nearer to ball than current coords or no coords set)
if(ballIntCoords!=null && ballIntDist<testVelHyp && (ball.nearestLineCoords.length==0|| dist(ball.x,ball.y,ball.nearestIntersect[0],ball.nearestIntersect[1])>ballIntDist) && inBox(ballIntCoords[0],ballIntCoords[1],p1[0],p1[1],p2[0],p2[1],5)){
//set ball nearestLineCoords to new coords
  ball.nearestIntersect=[ballIntCoords[0],ballIntCoords[1]]
  ball.nearestLineCoords=[[p1[0],p1[1]],[p2[0],p2[1]]]


}


//if ball stuck
if(circleLineColl(ball.x,ball.y,ball.r/5,p1[0],p1[1],p2[0],p2[1])){
  //ball.x=ball.x+sin(lineNormal)*ball.r/2
//ball.y=ball.y+cos(lineNormal)*ball.r/2
newVel=getReboundVel(ball.vx,ball.vy,ball.r,p1[0],p1[1],p2[0],p2[1],false)
ball.vx=newVel.x;
ball.vy=newVel.y;

}
else if(circleLineColl(ball.x,ball.y,ball.r,p1[0],p1[1],p2[0],p2[1])){
  ball.colliding=true
  stroke(255,0,0);
  newVel=getReboundVel(ball.vx,ball.vy,ball.r,p1[0],p1[1],p2[0],p2[1],false)
ball.vx=newVel.x;
ball.vy=newVel.y;

//break;

}else{stroke(255);}
//scribble.scribbleLine(p1[0],p1[1],p2[0],p2[1]);
strokeWeight(8)
biomeLineDraw[biome](p1[0],p1[1],p2[0],p2[1]);
strokeWeight(1)
//stroke(255);
//scribble.scribbleLine(ball.x,ball.y,cRayEndX,cRayEndY);
midLineX=p1[0]+(p2[0]-p1[0])/2
midLineY=p1[1]+(p2[1]-p1[1])/2
//scribble.scribbleLine(midLineX,midLineY,midLineX+sin(lineNormal)*10,midLineY+cos(lineNormal)*10);
//text(lineAngle.toFixed(2)+"("+lineNormal.toFixed(2)+")",midLineX,midLineY);
//text(j+"-"+(j+1),midLineX,midLineY);
//text(lineNormal.toFixed(2)+"",midLineX,midLineY);


//corner coll
if(cornerColOn){
if(circleColl(ball.x,ball.y,ball.r/2,p1[0],p1[1],cornerRad/2)){
  stroke(255,0,0);
   //newVel=getReboundVel(ball.vx,ball.vy,ball.r,p1[0],p1[1],p2[0],p2[1],false)
   newVelMag=math.sqrt((ball.vx*ball.vx)+(ball.vy*ball.vy))
   newVelAngle=atan2((width/2)-p1[0],(height/2)-p1[1])
   newVel={x:sin(newVelAngle)*newVelMag,y:cos(newVelAngle)*newVelMag}
ball.vx=newVel.x;
ball.vy=newVel.y;
}else{stroke(255);}
//scribble.scribbleEllipse(p1[0],p1[1],cornerRad,cornerRad);
strokeWeight(4)
biomeCornerDraw[biome](p1[0],p1[1]);
noFill();
strokeWeight(1)
}


//end for point
}

//end for quad
}

  


//enemies
nearEnemy=false
for(el=0;el<enemies.length;el++){

  enemy=enemies[el]
  if(enemy.hits>0){
if(circleColl(ball.x,ball.y,ball.r/2,enemy.x,enemy.y,enemy.r/2)){
   if(enemy.isHit==false){
     enemies[el].hits--;
     score+=(enemy.hitScore*1/touchNo)*0.02*math.sqrt((ball.vx*ball.vx)+(ball.vy*ball.vy))

     enemies[el].isHit=true;
     checkGoal()


     enemyBallX=enemy.x-ball.x
     enemyBallY=enemy.y-ball.y
     /*
enemyBallAngle=atan2(enemyBallX,enemyBallY)+PI

//enemyBallAngle=enemyBallAngle-(atan2(ball.vx,ball.vy)-enemyBallAngle)

//enemyBallAngle=enemyBallAngle+atan2(ball.vx,ball.vy)
    enemyBallMag=math.sqrt((enemyBallX*enemyBallX)+(enemyBallY*enemyBallY))*0.6
     ball.vx=sin(enemyBallAngle)*enemyBallMag
     ball.vy=cos(enemyBallAngle)*enemyBallMag
*/
//newVel=getReboundVel(ball.vx,ball.vy,ball.r,ball.x,ball.y,enemy.x,enemy.y,true)
enemyReboundPX=[ball.x,enemy.x]
/*if(ball.x>enemy.x){
	enemyReboundPX=[enemy.x,ball.x]
}*/
enemyReboundPY=[ball.y,enemy.y]
/*if(ball.y<enemy.y){
	enemyReboundPY=[enemy.y,ball.y]
}*/
newVel=getReboundVel(ball.vx,ball.vy,ball.r/2,enemyReboundPX[0],enemyReboundPY[0],enemyReboundPX[1],enemyReboundPY[1],false)
ball.vx=-newVel.x
ball.vy=-newVel.y
   }
}else if(circleColl(ball.x,ball.y,ball.r/2,enemy.x,enemy.y,enemy.almostR/2)){

  nearEnemy=true;
  if(enemy.isHit){enemy.isHit=false}

}


}

}



if(nearEnemy){ timeMult=0.3}
else if(!touching){timeMult=1}

//draw ball
//scribble.scribbleEllipse(ball.x,ball.y,ball.r,ball.r);
imageMode(CENTER)
ballSpeed=math.sqrt((ball.vx*ball.vx)+(ball.vy*ball.vy))
if(ballSpeed>0){
	push()
	translate(ball.x,ball.y)
	ball.imgRot+=0.05*ballSpeed
rotate(ball.imgRot)
image(hogballImg,0,0,ball.r,ball.r)
pop()

}else{
	image(hogImg,ball.x,ball.y,ball.r,ball.r)
}

ballVelAngle=atan2(ball.vx,ball.vy);

scribble.scribbleLine(ball.x,ball.y,ball.x+(sin(ballVelAngle)*10),ball.y+(cos(ballVelAngle)*10))

  //if ball not colliding
  if(!ball.colliding && ball.nearestLineCoords.length>0){
   console.log(ball);
    //set ball coords to intersect coords (-small buffer?)
      ballXDiff=ball.nearestIntersect[0]-ball.x
      ballYDiff=ball.nearestIntersect[1]-ball.y

ballDiffAngle=atan2(ballXDiff,ballYDiff)

  if(!paused){
ball.x=ball.nearestIntersect[0]-sin(ballDiffAngle)*ball.r*0.6
  
ball.y=ball.nearestIntersect[1]-cos(ballDiffAngle)*ball.r*0.6
  }
    //get rebound vel
    newVel=getReboundVel(ball.vx,ball.vy,ball.r,ball.nearestLineCoords[0][0],ball.nearestLineCoords[0][1],ball.nearestLineCoords[1][0],ball.nearestLineCoords[1][1],false)
//set ball vx/vy
//console.log(ball)
//newVel={x:2,y:2}
ball.vx=-newVel.x;
ball.vy=-newVel.y;
//console.log(ball.nearestLineCoords)

ballVelAngle=atan2(ball.vx,ball.vy);
stroke(0,255,0);
scribble.scribbleLine(ball.x,ball.y,ball.x+(sin(ballVelAngle)*10),ball.y+(cos(ballVelAngle)*10))
console.log(ball);
console.log(quads);
scribble.scribbleLine(ball.nearestLineCoords[0][0],ball.nearestLineCoords[0][1],ball.nearestLineCoords[1][0],ball.nearestLineCoords[1][1])
scribble.scribbleEllipse(ball.nearestIntersect[0],ball.nearestIntersect[1],10,10);
stroke(255,255,0);
scribble.scribbleLine(0,0,testRayX,testRayY);


//noLoop();
    
 
   }
  ball.vx=ball.vx*ball.friction
  if(abs(ball.vx)<0.25){ball.vx=0;}
  
  ball.vy=ball.vy*ball.friction
  if(abs(ball.vy)<0.25){ball.vy=0;}
  
  //check if new point in poly
  
  ballNewX=ball.x+ball.vx*timeMult
  ballNewY=ball.y+ball.vy*timeMult
  if(pointInPoly([ballNewX,ballNewY],quads[0].points)){
	  
	  if(!paused){
			ball.x=ballNewX
			ball.y=ballNewY
	  }
  }else{
  	 ball.vx=-ball.vx
  	 ball.vy=-ball.vy
  }

stroke(255);
//draw goal
if(goal.active){
  stroke(255)
}else{
  stroke(150)

}
scribble.scribbleEllipse(goal.x,goal.y,goal.r,goal.r);
stroke(255);




  if(touching){
    touchLenX=mouseX-touchStartX
    touchLenY=mouseY-touchStartY
    touchAngle=atan2(touchLenX,touchLenY)+PI
    touchHyp=clamp(math.sqrt((touchLenX*touchLenX)+(touchLenY*touchLenY)),0,ball.pixelVelLimit)
    
    touchLenX=sin(touchAngle)*touchHyp
   touchLenY=cos(touchAngle)*touchHyp

   percOfTopSpeed=touchHyp/ball.pixelVelLimit

  stroke(255*percOfTopSpeed,255-(255*percOfTopSpeed),0)

    scribble.scribbleLine(ball.x,ball.y,ball.x+touchLenX,ball.y+touchLenY);
stroke(255);
text(touchAngle.toFixed(2)+"",ball.x-10,ball.y)


  }


  drawEnemies();
  //line(polyLineTest[0][0],spolyLineTest[0][1],polyLineTest[1]
  if(goToMenu){
	gamestate="menu"
	goToMenu=false	
}else if(!paused && circleColl(ball.x,ball.y,ball.r/2,goal.x,goal.y,goal.r/2)&&goal.active){
  nextLevel()
}


translate(ball.x-width/2,ball.y-height/2)
fill(255,255,255)
text("Biome: "+biome+" ("+biomeNames[biome]+")",10,10)
text("Seed: "+seed,10,30)
text("Score: "+score.toFixed(2),10,50)
text("lvl: "+(currentLevel+1)+"/"+run.length,10,70)
text("Touches: "+touchNo,10,90)
text("BallVel"+ball.vx+","+ball.vy,10,110)
if(popUp.show){popUp.draw()}

}else{
	background(70,0,0)
	bufferNo=unlockedHogs.length+2
	curX=width/bufferNo
	//alert(unlockedHogs)
	for(var i=0;i<unlockedHogs.length;i++){
		el=unlockedHogs[i]
		
		rect(curX-50,-50+height/2,100, 100)
		image(hogs[el].img,curX,height/2,30,30)
		if(touching && inBox(touchStartX,touchStartY,curX,height/2,curX+10,10+height/2,50)){
			currentHog=el
			touching=false
			currentRun=newRun()
  currentLevel=0
  currentLevel=9
  biome=currentRun[currentLevel].biome
seed=	currentRun[currentLevel].seed

showLevel(biome,seed)
			gamestate="game"
			
		}
		
		
		
		 curX=curX+(width/bufferNo)+30
		 }

}

}