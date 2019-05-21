function menuSetup(){

}

function menuDraw(){
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
      //currentLevel=9
      biome=currentRun[currentLevel].biome
      seed=	currentRun[currentLevel].seed

      showLevel(biome,seed)
      gamestate="game"
    }
     curX=curX+(width/bufferNo)+30
  }

}
