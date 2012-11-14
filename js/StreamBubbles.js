// ----------------------------------------------------------------------------
// a class for the feed bubbles in the 3D view
// ----------------------------------------------------------------------------

// **** general bubble settings ****** //
var labelW = 2000;
var labelH = 900;
var labelFontSize = 150;
var labelBgMargin = 100;
var labelZPos = 900;
var labelBgColor = "#011A30"
var labelTxtColor = "white";
var labelLineH = 200;
var labelTPosX = 100;
var labelTPosY = 150;
var labelBubDist = 1500;
var labelStrWidth = 0;
var labelStrColor = "white"
var portraitW = 960;
var portraitH = 960;
var portraitStrColor = "white";
var portraitStrWidth = 30;
var labelLifeTime = 4500;

// **** the feed buble js object **** //
StreamBubble = function(){
  //the 3D bubble object
  this.bubobj = null;
  
  //the 3D label object for the story/fied
  this.pln = null;
  
  // the 3D object for the profile pic
  this.profpic = null;
  
  // The Image object for the facebook profile pic
  this.fbpic = new Image();
  this.fbpic.crossOrigin = "anonymous";
  
  // The id of the country it's coming from
  this.countryId = 0;
  
  // holds if the label is already present or not
  this.labelPresent = false;
  
  // counter variables for the animagesion
  this.bubPosStep = 0;
  this.bubRotStep = 0;
  this.bubScaleStep = 0;
  this.bubRotMax = 120;
  this.bubRotStepDeg = 0.001;
  
  this.radius_dots = 6450;
  
  // positions the object on the spot of the globe
  this.setBubPos = function(deviation){
    setSPosition(this.bubobj, this.countryId, this.radius_dots + deviation);
  }
  
  // Creates 2D canvas for the message texture and generates plane geometry with it
  this.createLabel = function(text, x, y, z, size, color, backGroundColor, backgroundMargin) {
  	if(!backgroundMargin)
  	backgroundMargin = 100;

  	var canvas = document.createElement("canvas");

  	var context = canvas.getContext("2d");
  	context.font = size + "pt Georgia";

  	var textWidth = context.measureText(text).width;

  	canvas.width = labelW + backgroundMargin;
  	canvas.height = labelH + backgroundMargin;
  	context = canvas.getContext("2d");
  	context.font = size + "pt Georgia";

  	if(backGroundColor) {
      context.beginPath();
      context.rect(0, 0, canvas.width , canvas.height);
      context.fillStyle = backGroundColor;
      context.fill();
      context.lineWidth = labelStrWidth;
      context.strokeStyle = labelStrColor;
      context.stroke();
  	}

  	context.textAlign = "left";
  	context.textBaseline = "middle";
  	context.fillStyle = color;
    wrapText(context, text, labelTPosX, labelTPosY, labelW, labelLineH,4);

  	var texture = new THREE.Texture(canvas);
  	texture.needsUpdate = true;

  	var material = new THREE.MeshBasicMaterial({
  		map : texture
  	});

  	var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
  	mesh.doubleSided = true;
  	mesh.position.x = x - canvas.width;
  	mesh.position.y = y - canvas.height;
  	mesh.position.z = z;

  	this.pln = mesh;
  	this.bubobj.add(this.pln);
    this.pln.position.x -= labelBubDist;
    this.pln.rotation.z -= (90).toRad();
    this.pln.rotation.x -= (90).toRad();
  };
  
  // Creates 2D canvas for the profile pic texture and generates plane geometry with it
  this.createPortrait = function(pic, x, y, z, backGroundColor) {

  	var canvas = document.createElement("canvas");
  	var context = canvas.getContext("2d");
  	canvas.width = portraitW;
  	canvas.height = portraitH;
  	context = canvas.getContext("2d");

    context.beginPath();
    context.rect(0, 0, canvas.width , canvas.height);
    context.fillStyle = backGroundColor;
    context.fill();
    context.lineWidth = portraitStrWidth;
    context.strokeStyle = portraitStrColor;
    context.stroke();
    context.drawImage(pic,
                      portraitStrWidth,
                      portraitStrWidth,
                      portraitW-portraitStrWidth*2,
                      portraitH-portraitStrWidth*2);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial({
      map : texture
    });

    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
    mesh.doubleSided = true;
    mesh.position.x = x - canvas.width;
    mesh.position.y = y - canvas.height;
    mesh.position.z = z;
    
    this.profpic = mesh;

    this.bubobj.add(this.profpic);
    this.profpic.position.x -=labelBubDist;
    this.profpic.rotation.z -= (90).toRad();
    this.profpic.rotation.x -= (90).toRad();
  }
  
};