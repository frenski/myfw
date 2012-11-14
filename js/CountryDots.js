// ----------------------------------------------------------------------------
// a class for the country dots
// ----------------------------------------------------------------------------

CountryDots = function (csize,bsize,di,cname) {
  var can = di.can;
  var mapcX = di.mapCenterX;
  var mapcY = di.mapCenterY;
  
  this.context = di.context;
  this.x = dotCenterPosition(cname)[0];
  this.y = dotCenterPosition(cname)[1];
  this.w = Math.round((csize/bsize)*5)+5;
  this.h = this.w;
  this.connectLineWith = 0.8;
  this.connectLineColor = '#53b3ff';
  this.name = cname;
  this.active = false;

  //function to calculate country dot on the map
  function dotCenterPosition(cname){
    var lat = country[cname].lat;
    var lng = country[cname].lng;
  
    //calculates the coordinates on the current map
    var xRatio = can.width/360;
    var yRatio = 900/360;

    var xCoord = Math.round(mapcX+xRatio*lng);
    lat = lat * Math.PI / 180;
    
    // do the Mercator projection to translate the coordinates
    var yCoord = Math.log(Math.tan((lat/2) + (Math.PI/4)));  
    var yCoord = Math.round(mapcY - (can.width * yCoord / (2 * Math.PI)));

    return new Array(xCoord,yCoord);
  };

  //function which visualizes the dot for the country
  this.addDot = function(){
    var x = this.x+this.w/2;
    var y = this.y+this.h/2;
    var r = this.w;
    var grad = this.context.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0.1, '#53b3ff');
    grad.addColorStop(0.6, '#1082de');
    grad.addColorStop(0.9, 'rgba(41,41,41,0)');
    this.context.fillStyle = grad;
    this.context.fillRect(x-r,y-r,r*2,r*2);
  };

  //function to add connection lines between the countries dots
  this.addConnectionLine = function(sx,sy,sw,sh){
    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = this.connectLineColor;
    this.context.lineWidth = this.connectLineWith;
    this.context.moveTo(sx+sw/2,sy+sh/2);
    var curve_x = this.x+this.w/2;
    var curve_y = this.y+this.h/2;
    //calculates the curve
    var canchor_x = (this.x + sx)/2 - Math.round((this.y - sy)*0.1);
    var canchor_y = (this.y + sy)/2 + Math.round((this.x - sx)*0.1);
    this.context.quadraticCurveTo(canchor_x,canchor_y,curve_x,curve_y);
    this.context.stroke();
    this.context.restore();
  };
};
