// ----------------------------------------------------------------------------
// a class for the profile picutres
// ----------------------------------------------------------------------------

ProfPictures = function (src,prw,prh,prx,pry,di) {
  
  var picMaxScale = 20;
  var picMinScale = 0;
  
  this.context = di.context;
  this.prw=prw;
  this.prh=prh;
  this.prx=prx;
  this.pry=pry;
  this.pic = new Image();
  this.pic.src = src;
  this.frameColor = "#000";
  this.frameWidth = 2;
  this.shadowX = 0;
  this.shadowY = 0;
  this.shadowBlur = 5;
  this.shadowColor = "rgba(0,0,0,0.5)";

  this.drawPicture = function(){
    //document.getElementById('thediv').innerHTML += this.pic.src+"; "+this.prx+"; "+this.pry+"; "+this.prw+"; "+ this.prh+"; "+  "<br/>";
    this.context.save();
    this.context.drawImage(this.pic,this.prx,this.pry,this.prw,this.prh);
    this.context.strokeStyle = this.frameColor;
    this.context.lineWidth = this.frameWidth;
    this.context.shadowOffsetX = this.shadowX;
    this.context.shadowOffsetY = this.shadowY;
    this.context.shadowBlur = this.shadowBlur;
    this.context.shadowColor = this.shadowColor;
    this.context.strokeRect(this.prx,this.pry,this.prw,this.prh);
    this.context.restore();
  }

//function for calculation the scale of the profile picture
  this.scalePicture = function(dx){
    if(((dx>0)&&(this.prw<picMaxScale))||((dx<0)&&(this.prw>picMinScale))){
      this.prw += dx;
      this.prh += dx;
      this.prx -= dx/2;
      this.pry -= dx/2;
    }
  };

};