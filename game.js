
function gameSetup(){
}

function gameDraw(){
  biomeBackgroundDraw[biome]()



    push()
    if(ball.follow){translate(-ball.x+width/2,-ball.y+height/2)}
    shakeCameraUpdate();
    //translate(random(10),random(10))




    //draw stage boundaries
    polyBG=biomePolyBG[biome];

    fill(polyBG[0],polyBG[1],polyBG[2])
    beginShape()
    for(j=0;j<quads[0].points.length;j++) {
    		vert=quads[0].points[j]
    		vertex(vert[0],vert[1])
    }
    endShape(CLOSE)
    noFill()


    ball.nearestWall=null;
    ball.nearestIntersect=null;
    velRayMag=max(ball.r,sqrt(ball.vx*ball.vx+ball.vy*ball.vy));
    ball.velRay=new Ray(ball.x,ball.y,atan2(ball.vy,ball.vx),velRayMag,ball.r)
    ballVelAng=ball.velRay.dir.angleBetween(createVector(ball.x,ball.y))
    //line(ball.x,ball.y,30*ball.velRay.dir.x+ball.x,30*ball.velRay.dir.y+ball.y)

    for(i=0;i<quads.length;i++){
      quad=quads[i]
      p=quad.points
      for(j=0;j<p.length;j++){
        p1=p[j]
        if(j<p.length-1){
         p2=p[j+1]
        }else{
         p2=p[0]
        }



      strokeWeight(8)
      biomeLineDraw[biome](p1[0],p1[1],p2[0],p2[1]);
      strokeWeight(1)
      intersect=ball.velRay.cast(new Wall(p1[0],p1[1],p2[0],p2[1]))
      if(intersect){
        if(ball.nearestIntersect==null || dist(ball.x,ball.y,ball.nearestIntersect.x,ball.nearestIntersect.y)>dist(ball.x,ball.y,intersect.x,intersect.y)){
          ball.nearestWall=[p1,p2];
          ball.nearestIntersect=intersect;
        }
      }


      strokeWeight(4)
      biomeCornerDraw[biome](p1[0],p1[1]);
      noFill();
      strokeWeight(1)


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
        if(!enemy.isHit){
          enemies[el].hits--;
          score+=(enemy.hitScore*1/touchNo)*0.02*math.sqrt((ball.vx*ball.vx)+(ball.vy*ball.vy))

          enemies[el].isHit=true;
          checkGoal()

          /*
          enemyBallX=enemy.x-ball.x
          enemyBallY=enemy.y-ball.y


          //newVel=getReboundVel(ball.vx,ball.vy,ball.r/2,enemyReboundPX[0],enemyReboundPY[0],enemyReboundPX[1],enemyReboundPY[1],false)
          newVel=getReboundVel(ball.vx,ball.vy,ball.r/2,pe1[0],pe1[1],pe2[0],pe2[1],false)
          ball.vx=-newVel.x
          ball.vy=-newVel.y
          */
          pe1=[]
          pe2=[]
          pe1[0]=enemies[el].x+cos(ballVelAng)*enemies[el].r/2
          pe1[1]=enemies[el].y+sin(ballVelAng)*enemies[el].r/2
          pe2[0]=enemies[el].x-cos(ballVelAng)*enemies[el].r/2
          pe2[1]=enemies[el].y-sin(ballVelAng)*enemies[el].r/2

          intersect=ball.velRay.cast(new Wall(pe1[0],pe1[1],pe2[0],pe2[1]))
          if(intersect){
            if(ball.nearestIntersect==null || dist(ball.x,ball.y,ball.nearestIntersect.x,ball.nearestIntersect.y)>dist(ball.x,ball.y,intersect.x,intersect.y)){
              ball.nearestWall=[p1,p2];
              ball.nearestIntersect=intersect;
            }
          }
        }

      }else if(circleColl(ball.x,ball.y,ball.r/2,enemy.x,enemy.y,enemy.almostR/2)){
        nearEnemy=true;
        if(enemy.isHit){enemy.isHit=false}

      }


      }

    }


    if(ball.nearestIntersect){
      vel=getReboundVel(ball.vx,ball.vy,ball.r,ball.nearestWall[0][0],ball.nearestWall[0][1],ball.nearestWall[1][0],ball.nearestWall[1][1],false)
      ball.vx=vel.x;
      ball.vy=vel.y;
      shakeCamera(vel.x*ball.shakeFactor,vel.y*ball.shakeFactor,1);
    }


    if(nearEnemy){timeMult=0.2}
    else if(!touching){timeMult=1}



    //draw ball
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


    ball.vx=ball.vx*ball.friction
    if(abs(ball.vx)<0.25*timeMult){ball.vx=0;}

    ball.vy=ball.vy*ball.friction
    if(abs(ball.vy)<0.25*timeMult){ball.vy=0;}

    //check if new point in poly

    ballNewX=ball.x+ball.vx*timeMult
    ballNewY=ball.y+ball.vy*timeMult
    if(pointInPoly([ballNewX,ballNewY],quads[0].points)){
      ball.x=ballNewX;
      ball.y=ballNewY;
    }
  //draw goal
  if(goal.active){
    stroke(255)
  }else{
    stroke(150)

  }
  ellipse(goal.x,goal.y,goal.r,goal.r);



    if(touching){
      touchLenX=mouseX-touchStartX
      touchLenY=mouseY-touchStartY
      touchAngle=atan2(touchLenX,touchLenY)+PI
      //touchHyp=clamp(math.sqrt((touchLenX*touchLenX)+(touchLenY*touchLenY)),0,ball.pixelVelLimit)
      touchHyp=clamp(math.sqrt((touchLenX*touchLenX)+(touchLenY*touchLenY)),0,1000)

      touchLenX=sin(touchAngle)*touchHyp
      touchLenY=cos(touchAngle)*touchHyp

      percOfTopSpeed=touchHyp/ball.pixelVelLimit

      stroke(255*percOfTopSpeed,255-(255*percOfTopSpeed),0)


      stroke(255);
      text(touchAngle.toFixed(2)+"",ball.x-10,ball.y)

      //add reflection line

      rayStartX=ball.x
      rayStartY=ball.y
      rayEndX=ball.x+touchLenX
      rayEndY=ball.y+touchLenY

      enemiesHitRay=[]

      for(k=0;k<2;k++){

        for(i=0;i<enemies.length;i++){
          if(enemies[i]==undefined){break;}
          /*
          x:x,
          y:y,
          r:35,
          hits:3,
          isHit:false,
          hitScore:100,
          almostR:55,
          placementR:90
          */
          if(enemies[i].hits>0 && enemiesHitRay.indexOf(i)==-1){
            rayAngle=atan2(enemies[i].y-ball.y,enemies[i].x-ball.x)+PI/2
            pe1=[]
            pe2=[]
            pe1[0]=enemies[i].x+cos(rayAngle)*enemies[i].r/2
            pe1[1]=enemies[i].y+sin(rayAngle)*enemies[i].r/2
            pe2[0]=enemies[i].x-cos(rayAngle)*enemies[i].r/2
            pe2[1]=enemies[i].y-sin(rayAngle)*enemies[i].r/2
            line(pe1[0],pe1[1],pe2[0],pe2[1])

            reflected=getReflection(rayStartX,rayStartY,rayEndX,rayEndY,pe1[0],pe1[1],pe2[0],pe2[1])
            if(reflected!=null){
              //draw line to reflection
              line(rayStartX,rayStartY,reflected.startX,reflected.startY);
              rayStartX=reflected.startX
              rayStartY=reflected.startY
              rayEndX=reflected.endX
              rayEndY=reflected.endY
              enemiesHitRay.push(i);
              i=0;
              continue;
            }
          }


        }

        intersections=[]
        while(true){
          for(i=0;i<quads.length;i++){
            quad=quads[i]
            p=quad.points
            for(j=0;j<p.length;j++){
              p1=p[j]
              if(j<p.length-1){
               p2=p[j+1]
              }else{
               p2=p[0]
              }
              angle=atan2(p2[0]-p1[0],p2[1]-p1[1]);
              p1=[p1[0]-sin(angle)*2,p1[1]-cos(angle)*2]
              p2=[p2[0]+sin(angle)*2,p2[1]+cos(angle)*2]
              line(p1[0],p1[1],p2[0],p2[1])

              reflected=getReflection(rayStartX,rayStartY,rayEndX,rayEndY,p1[0],p1[1],p2[0],p2[1])
              if(reflected){
                intersections.push(reflected)
              }


            }
          }
          if(intersections.length>0){
            intersections.sort((a,b)=>dist(rayStartX,rayStartY,a.startX,a.startY)-dist(rayStartX,rayStartY,b.startX,b.startY))
            //draw line to reflection
            line(rayStartX,rayStartY,intersections[0].startX,intersections[0].startY);
            rayStartX=intersections[0].startX
            rayStartY=intersections[0].startY
            rayEndX=intersections[0].endX
            rayEndY=intersections[0].endY
            intersections=[]
          }else{
            break;
          }
        }
      }



      line(rayStartX,rayStartY,rayEndX,rayEndY);

    }


    drawEnemies();
    //line(polyLineTest[0][0],spolyLineTest[0][1],polyLineTest[1]
    if(goToMenu){
  	  gamestate="menu"
  	  goToMenu=false
    }else if(!paused && circleColl(ball.x,ball.y,ball.r/2,goal.x,goal.y,goal.r/2)&&goal.active){
      nextLevel()
    }



    pop()
    fill(255,255,255)
    text("Biome: "+biome+" ("+biomeNames[biome]+")",10,10)
    text("Seed: "+seed,10,30)
    text("Score: "+score.toFixed(2),10,50)
    text("lvl: "+(currentLevel+1)+"/"+run.length,10,70)
    text("Touches: "+touchNo,10,90)
    text("BallVel"+ball.vx+","+ball.vy,10,110)
    if(popUp.show){popUp.draw()}
}
