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
changeGamestate("menu")
//alert(1)
cornerRad=3
cornerColOn=false
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
function playerInPoly(pAr,rad,polyPAr){
  poly=[]
  for(pa=0;pa<polyPAr.length;pa++){
    poly[pa]=createVector(polyPAr[pa][0],polyPAr[pa][1])
  }
  return collideCirclePoly(pAr[0],pAr[1],rad/2,poly)
}

enemies=[]
function newEnemy(x,y){
   //alert("new enemy")
   newE={
     x:x,
     y:y,
     r:35,
     hits:3,
     totalHits:3,
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
      //ellipse(enemy.x,enemy.y,enemy.r,enemy.r)
      //image(imgs.enemies[biome],enemy.x,enemy.y,enemy.r,enemy.r)
      image(imgs.enemies[0],enemy.x,enemy.y,enemy.r,enemy.r)
      //ellipse(enemy.x,enemy.y,enemy.almostR,enemy.almostR)
      textSize(15);
			stroke(255,255,255,150+(150)*(enemy.hits/enemy.totalHits));
			if(enemy.isHit){
        fill(255,255,255,255);
      }else{
        fill(255,0,0,150+(150)*(enemy.hits/enemy.totalHits));
      }
      text(enemy.hits+"",enemy.x-5,enemy.y+enemy.r/4)

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
function inBox(x,y,x1,y1,x2,y2,buffer=0){

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
  p1x+=sin(lineAngle)*5
  p1y+=cos(lineAngle)*5
  p2x-=sin(lineAngle)*5
  p2y-=cos(lineAngle)*5

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
   imgRot:0,
   follow:false,
   shakeFactor:hogs[currentHog].shakeFactor,
  };
  shake={x:0,y:0,timer:0,totalTime:0};

  goal={
    x:0,
    y:0,
    r:70,
    active:false,
    timer:0
  }
  touching=false;
  seed=seedParam
  randomSeed(seed)
  quads=[]
  enemies=[]
  score=0
  touchNo=0



  biomes[biome].start();


}

function winCurrentRun(){
	runs.push(currentRun)
	//alert("ya win!")
	hogToUnlock=getHogToUnlock()
  totalScore=currentRun.map(lvl=>lvl.score).reduce((accumulator,a)=>accumulator+a,0).toFixed(2);

	if(hogToUnlock>-1){
		unlockedHogs.push(hogToUnlock)
    localStorage.setItem("unlockedHogs",JSON.stringify(unlockedHogs))
		popUp.text="You unlocked "+hogs[hogToUnlock].name+"!"
		popUp.img=hogs[hogToUnlock].img
		popUp.show=true
		paused=true
	//alert("You unlocked "+hogs[hogToUnlock].name+"!")
	}else{
		//alert("You've unlocked all hogs already!")
		//gamestate="menu"
		popUp.text="You've unlocked all hogs!"
		popUp.img=hogs[0].img
		popUp.show=true
		paused=true
	}
  popUp.text+="\n\nScore: "+totalScore

  highscore=localStorage.getItem("highscore")
  if(highscore==null || totalScore>highscore){
    localStorage.setItem("highscore",totalScore)
    popUp.text+=" (new best!)"
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
  //biomeTemp=biomes.length-1
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
	  while(run.length<9){
	  run.push(newLevel())
	  }
	  //alert(run)
	  return run
}

let font;
function preload(){
	font=loadFont("img/FFFFORWA.ttf");
}

function setup() {
	textFont(font);
  changeGamestate("menu")
  touching=false
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
  friction:0.999,
  shakeFactor:0.5

  },
  {
  name:"speed hog",
  ballImg:loadImage("img/hog3.png"),
  img:loadImage("img/hog4.png"),
  r:25,
  speed:0.4,
  friction:0.99,
  shakeFactor:2
  },
  {
  name:"junk hog",
  ballImg:loadImage("img/hog5.png"),
  img:loadImage("img/hog6.png"),
  r:35,
  speed:0.1,
  friction:0.9999,
  shakeFactor:8
  }


  ]


  //if no save
  if(!unlockedHogs){
    unlockedHogs=[0]
  }
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
    width:350,
    height:450,
  	draw:function(){
      push()
      noStroke()
      rectMode(CENTER)
  		fill(150,150,150,150)
    	rect(width/2,height/2,this.width,this.height)
  		fill(255,255,255)
      textSize(20)
  		text(popUp.text,width/2-this.width/2+15,height/2-this.height/2+30)
  		image(popUp.img,width/2-this.width/2+30,height/2-this.height/2+100,this.height*0.6,this.height*0.6)
      pop()
  	}
  }
  pauseButtonSize=width*0.1
  pauseBtn={
    x:10,
    y:height-10-pauseButtonSize,
    w:pauseButtonSize,
    h:pauseButtonSize,
    clickable:true,
    draw:function(){
      push()
      noStroke()
      if(paused){
        text(">",pauseBtn.x-5+pauseBtn.w/2,pauseBtn.y+10+pauseBtn.h/2)
        fill(100,0,0,150)
      }else{
        text("| |",pauseBtn.x-10+pauseBtn.w/2,pauseBtn.y+15+pauseBtn.h/2)
        fill(100,100,100,150)
      }
      rect(pauseBtn.x,pauseBtn.y,pauseBtn.w,pauseBtn.h)
      pop()

    },
    click:function(x,y){
      if(inBox(x,y,pauseBtn.x,pauseBtn.y,pauseBtn.x+pauseBtn.w,pauseBtn.y+pauseBtn.h)){
        if(pauseBtn.clickable){
          paused=!paused;
          pauseBtn.clickable=false;
          return true;
        }
      }
      return false;
    },
    testClickable:function(x,y){
      if(inBox(x,y,pauseBtn.x,pauseBtn.y,pauseBtn.x+pauseBtn.w,pauseBtn.y+pauseBtn.h)){
        if(!touching){
          pauseBtn.clickable=true;
        }
      }else{
        pauseBtn.clickable=true;
      }
    }
  }
  frameRate(30)

}

function changeGamestate(newGamestate){
  switch(newGamestate){
    case "menu":
      menuSetup()
    case "game":
      gameSetup()
  }
  gamestate=newGamestate
}


//https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
function is_touch_device() {
var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
var mq = function(query) {
  return window.matchMedia(query).matches;
}

if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
  return true;
}
// include the 'heartz' as a way to have a non matching MQ to help terminate the join
// https://git.io/vznFH
var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
return mq(query);
}



function fingerDown(x,y){
  touchStartX=x;
  touchStartY=y;
  touching=true;
  if(gamestate=="game"){
    timeMult=0.1;
  }
}


function fingerUp(x,y){
  touching=false;
  if(gamestate=="game"){
    if(popUp.show){
      popUp.show=false
      popUp.onClick()
    }else if(pauseBtn.click(touchStartX,touchStartY)){
      console.log("pause")
    }else{
      touchNo++;
      timeMult=1;
      touchXLen=x-touchStartX;
      touchYLen=y-touchStartY;
      touchAngle=atan2(touchXLen,touchYLen)+PI;
      touchHyp=math.sqrt((touchXLen*touchXLen)+(touchYLen*touchYLen));

      touchHyp=clamp(touchHyp,-ball.pixelVelLimit,ball.pixelVelLimit);

      //additive velocity
      //ball.vx=(ball.vx+(sin(touchAngle)*touchHyp*ball.speed));
      //ball.vy=(ball.vy+(cos(touchAngle)*touchHyp*ball.speed));

      //set velocity
      ball.vx=sin(touchAngle)*touchHyp*ball.speed
      ball.vy=cos(touchAngle)*touchHyp*ball.speed
    }
  }
}


if(is_touch_device()){

  //phone/tablet listeners
  document.addEventListener("touchstart",function(e){
    e.preventDefault();
   fingerDown(e.touches[0].clientX,e.touches[0].clientY);
  });

  document.addEventListener("touchend",function(e){
    fingerUp(mouseX,mouseY);
  });

}else{

  //desktop listeners
  document.addEventListener("mousedown",function(e){
    e.preventDefault();
    fingerDown(e.clientX,e.clientY);
  });

  document.addEventListener("mouseup",function(e){
    fingerUp(mouseX,mouseY);
  });
}







function draw() {
	if(gamestate=="game"){
    gameDraw();
  }else{
  	menuDraw();
  }

}
