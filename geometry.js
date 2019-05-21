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
    let pointRes=null;
    for(i=0;i<2;i++){

      let posTemp=createVector(this.pos.x,this.pos.y)
      let dirNormal=atan2(this.dir.x,this.dir.y);
      if(i==0){
        posTemp.x+=cos(dirNormal)*this.thickness/2;
        posTemp.y+=sin(dirNormal)*this.thickness/2;
      }else{
        posTemp.x-=cos(dirNormal)*this.thickness/2;
        posTemp.y-=sin(dirNormal)*this.thickness/2;
      }

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


  surfaceNorm=(new Victor(p2x-p1x,p2y-p1y)).norm()
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

function getReflection(startX,startY,endX,endY,p1x,p1y,p2x,p2y){
  lineIntCoords=math.intersect([p1x,p1y],[p2x,p2y],[startX,startY],[endX,endY])
  lineLenX=endX-startX
  lineLenY=endY-startY
  lineHyp=math.sqrt((lineLenX*lineLenX)+(lineLenY*lineLenY))
  lineAngle=atan2(lineLenX,lineLenY)+PI
  //console.log("ballIntCoords",ballIntCoords);
  if(lineIntCoords!=null){
    lineIntDist=dist(lineIntCoords[0],lineIntCoords[1],startX,startY)
    lineIntDistX=lineIntCoords[0]-startX
    lineIntDistY=lineIntCoords[1]-startY
    lineIntAngle=atan2(lineIntCoords[0]-startX,lineIntCoords[1]-startY)+PI
  }
  //if intersect with current line
  //if coords dist from ball less than velhyp and (nearer to ball than current coords or no coords set) and angles are within PI of eachother (so no reflections drawn on a line that touchline is pointing away from)
  if(lineIntCoords!=null && lineIntDist<lineHyp && inBox(lineIntCoords[0],lineIntCoords[1],p1x,p1y,p2x,p2y,5) && (lineAngle>lineIntAngle-PI/2 && lineAngle<lineIntAngle+PI/2)){
    //get reflected vector
    lineNewVel=getReboundVel(endX-startX,endY-startY,lineHyp,p1[0],p1[1],p2[0],p2[1],false)
    lineNewVel.x=lineNewVel.x*(1-(lineIntDist/lineHyp))
    lineNewVel.y=lineNewVel.y*(1-(lineIntDist/lineHyp))
    return {startX:lineIntCoords[0]+(sin(lineIntAngle)*2),startY:lineIntCoords[1]+(cos(lineIntAngle)*2),endX:lineIntCoords[0]+lineNewVel.x,endY:lineIntCoords[1]+lineNewVel.y};
  }else{
    return null
  }
}
