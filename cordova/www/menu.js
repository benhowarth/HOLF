let menuHighscore;
let unlockedHogs;
function menuSetup(){
  //console.log("setup!")
  menuHighscore=localStorage.getItem("highscore")
  if(menuHighscore==null){menuHighscore=0;}


  unlockedHogs=localStorage.getItem("unlockedHogs")
  if(unlockedHogs!=null){
    unlockedHogs=JSON.parse(unlockedHogs);
  }else{
    unlockedHogs=[0];
  }

}

function menuDraw(){
  background(140,70,70)
  bufferNo=unlockedHogs.length+2
  curX=width/bufferNo
  //alert(unlockedHogs)
  for(var i=0;i<unlockedHogs.length;i++){
    el=unlockedHogs[i]
    noStroke()
    fill(110,50,50)
    rect(curX-50,-50+height/2,100, 100)
    image(hogs[el].img,curX,height/2,30,30)
    if(touching && inBox(touchStartX,touchStartY,curX,height/2,curX+10,10+height/2,50)){
      currentHog=el
      touching=false
      currentRun=newRun()
      currentLevel=0
      //currentLevel=9
      biome=currentRun[currentLevel].biome
      seed=	currentRun[currentLevel].seed

      showLevel(biome,seed)
      changeGamestate("game")
    }
     curX=curX+(width/bufferNo)+30
  }
  fill(255)
  textSize(30)
  text("Best: "+menuHighscore,10,40)
  text(unlockedHogs.length+"/"+hogs.length+" Hogs",10,height-40)

}
