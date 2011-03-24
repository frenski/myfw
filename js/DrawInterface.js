// ----------------------------------------------------------------------
// a class for the Drawing Interface
// ----------------------------------------------------------------------

DrawInterface = function (canvas_id) {
  
  // --------------------------------------------------------------------
  // private
  // --------------------------------------------------------------------

  var mouseX = 0; //Mouse X position
  var mouseY = 0; //Mouse Y position
  
  //function to get the coordiantes of the mouse
  var getCoord = function(e){
    mouseX = e.clientX - this.offsetLeft;
    mouseY = e.clientY - this.offsetTop;
    //document.getElementById('thediv').innerHTML = mouseX + '' ;
  };

  // --------------------------------------------------------------------
  // public
  // --------------------------------------------------------------------

  this.can = document.getElementById(canvas_id); //Canvas element
  this.context = this.can.getContext("2d"); //Canvas context

  this.mapOffsetX = -33;
  this.mapOffsetY = +57;
  this.mapCenterX = this.can.width/2+this.mapOffsetX; //center of the map
  this.mapCenterY = this.can.height/2+this.mapOffsetY; 

  this.connectLineWith = 0.5; //the width of the connection line
  this.connectLineColor = '#b441ce';//the colour of the connection line

  //function to clear the canvas
  this.clearCanvas = function(){
    this.context.clearRect(0,0,this.can.width, this.can.height);
  };

  //function to check if the mouse is over a certain area
  this.isMouseOver = function(obj) {
    this.can.addEventListener("mousemove", getCoord, false);
    if(mouseX >= obj.x && mouseX <= (obj.x + obj.w) 
       && mouseY >= obj.y && mouseY <= (obj.y + obj.h)) {
      return true;
    }
    else return false;
  }

};