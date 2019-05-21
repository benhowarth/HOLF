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
