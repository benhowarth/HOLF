class Ray{
  constructor(x,y,angle,limit,thickness=0){
    this.pos=createVector(x,y);
    this.dir=p5.Vector.fromAngle(angle);
    this.limit=limit;
    this.thickness=thickness;
  }
  look(x,y){
    dir.set(x-this.pos.x,y-this.pos.y);
    dir.normalize();
  }
  cast(wall){
    push()
    stroke(255,0,0)
    let pointRes=null;
    let posTemp=createVector(this.pos.x,this.pos.y)
    let dirNormal=atan2(this.dir.y,this.dir.x)+PI/2;

    //line(this.pos.x+cos(dirNormal)*this.thickness/2,this.pos.y+sin(dirNormal)*this.thickness/2,this.pos.x-cos(dirNormal)*this.thickness/2,this.pos.y-sin(dirNormal)*this.thickness/2)

    for(i=0;i<2;i++){
      if(i==0){
        posTemp.x+=cos(dirNormal)*this.thickness/2;
        posTemp.y+=sin(dirNormal)*this.thickness/2;
      }else{
        posTemp.x-=cos(dirNormal)*this.thickness/2;
        posTemp.y-=sin(dirNormal)*this.thickness/2;
      }
      //line(posTemp.x,posTemp.y,posTemp.x+this.dir.x*100,posTemp.y+this.dir.y*100);

      const x1=wall.a.x;
      const y1=wall.a.y;
      const x2=wall.b.x;
      const y2=wall.b.y;

      const x3=posTemp.x;
      const y3=posTemp.y;
      const x4=posTemp.x+this.dir.x;
      const y4=posTemp.y+this.dir.y;

      const den=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
      if(den==0){continue;}


      const t=((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den;
      const u=-((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3))/den;
      const point=createVector(x1+t*(x2-x1),y1+t*(y2-y1));
      if(t>0 && t<1 && u>0 && p5.Vector.dist(point,posTemp)<this.limit){
        if(pointRes==null || p5.Vector.dist(pointRes,this.pos)>p5.Vector.dist(point,this.pos)){
          pointRes=point;
        }
      }


    }

    pop();
    return pointRes;
  }
}

class Wall{
  constructor(ax,ay,bx,by){
    this.a=createVector(ax,ay);
    this.b=createVector(bx,by);
  }
  draw(){
    stroke(255);
    line(this.a.x,this.a.y,this.b.x,this.b.y);
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
  //round to nearest pi/2
  velAngleNew=math.floor(velAngleNew/(PI/2))*(PI/2)


  velMagNew=velMag*0.97
  if(velMagNew<4 && !pointsAreTheNormal){velAngleNew=lineNormal}


  surfaceNorm=(new Victor(p1x-p2x,p1y-p2y)).norm()
  oldVel=new Victor(cxv,cyv)

  //2.0 * dot(N, I) * N - I

  dotNI=surfaceNorm.dot(oldVel)

  dotNI2=surfaceNorm.clone().multiply(new Victor(dotNI*2,dotNI*2))

  velMagX=velMagNew
  velMagY=velMagNew
  newVel=dotNI2.clone().subtract(oldVel).normalize().multiply(new Victor(velMagX,velMagY))
  //newVel=newVel.multiply(new Victor(0.95,0.95))

  return newVel
}

function getReflection(startX,startY,endX,endY,p1x,p1y,p2x,p2y,thickness=0){
	lineIntCoords=math.intersect([p1x,p1y],[p2x,p2y],[startX,startY],[endX,endY])
  lineLenX=endX-startX
  lineLenY=endY-startY
  lineHyp=math.sqrt((lineLenX*lineLenX)+(lineLenY*lineLenY))
  lineAngle=atan2(lineLenY,lineLenX)
  reflectRay=new Ray(startX,startY,lineAngle,lineHyp,thickness)
  //console.log("ballIntCoords",ballIntCoords);
  reflectHit=reflectRay.cast(new Wall(p1x,p1y,p2x,p2y))
  if(reflectHit){
    lineIntDist=dist(reflectHit.x,reflectHit.y,startX,startY)
    lineIntDistX=reflectHit.x-startX
    lineIntDistY=reflectHit.y-startY
    lineIntAngle=atan2(lineIntDistX,lineIntDistY)-PI

    lineNewVel=getReboundVel(endX-startX,endY-startY,lineHyp,p1[0],p1[1],p2[0],p2[1],false)
    lineNewVel.x=lineNewVel.x*(1-(lineIntDist/lineHyp))
    lineNewVel.y=lineNewVel.y*(1-(lineIntDist/lineHyp))

    return {startX:reflectHit.x+(sin(lineIntAngle)*2),startY:reflectHit.y+(cos(lineIntAngle)*2),endX:reflectHit.x+lineNewVel.x,endY:reflectHit.y+lineNewVel.y};
  }else{
    return null
  }
}
