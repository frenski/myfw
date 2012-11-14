// ----------------------------------------------------------------------------
// a class for the profile picutres
// ----------------------------------------------------------------------------

StreamBubble = function (prw,prh,prx,pry,di,story) {
  
  var picMaxScale = 100;
  var picMinScale = 0;
  
  this.context = di.context;
  this.prw=prw;
  this.prh=prh;
  this.prx=prx;
  this.pry=pry;
  this.pic = new Image();
  this.pic.src = 'images/sbubble.png';
  this.story = story;
  
  this.lifeTime = 0;
  this.maxLifeTime = 7000;
  this.scaleTime = picMaxScale;

  this.drawBubble = function(){
    this.context.save();
    this.context.drawImage(this.pic,this.prx,this.pry,this.prw,this.prh);
    if((this.lifeTime>this.scaleTime)&&(this.lifeTime<(this.maxLifeTime-this.scaleTime))){
      this.context.fillStyle = "white";
      this.context.font =  "8pt Helvetica";
      wrapText(this.context, 
             this.story, 
             this.prx+this.prw/9,
             this.pry+this.prh/5, 
             this.prw-this.prw/6,
             this.prh/6,
             4);
      this.context.restore();
    }
  }

//function for calculation the scale of the profile picture
  this.scaleBubble = function(dx,dy){
      this.prw += dx;
      this.prh += dy;
      this.prx -= dx/2;
      this.pry -= dx/2;
  };

};