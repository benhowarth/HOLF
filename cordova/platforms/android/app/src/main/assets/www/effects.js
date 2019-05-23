

function shakeCameraUpdate(){
  if(shake.timer>0){
    translate(random(shake.x*sin(shake.timer)*shake.timer/shake.totalTime),random(shake.y*cos(shake.timer)*shake.timer/shake.totalTime));
    shake.timer-=0.1;
  }
}

function shakeCamera(xAmount,yAmount,totalTime){
  shake.x=xAmount;
  shake.y=yAmount;
  shake.timer=totalTime;
  shake.totalTime=totalTime;
}
