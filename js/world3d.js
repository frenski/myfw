//countries variable
fCountries = new Array();

//*** Animation parameters *//
// bubble posts variables
fBubble = [];
fStream = []
var streamTimer = 0;
var streamTimerMax = 360;
var earthRotSpeed = 0.0005;


// Initiation of the data from facebook and making it into arrays
function initData(myData,frData){
  
  function notInArray(cname){
    var ret = true;
    for(var c=0;c<fCountries.length;c++){
      if(fCountries[c][2]==cname) ret = false;
    }
    return ret;
  }
  
  selCountry = -1;
  
  //for the scrolling
  var frScrollRow = 12;
  var frScrollHeight = Math.round(0.9*HEIGHT);
  var frScrollPerPage = Math.round(frScrollHeight/frScrollRow);
  
  // Adds my country to the array
  fCountries.push(new Array(country[myData.country].lat,
                            country[myData.country].lng,
                            myData.country));
                            
  // Adds the existing countries to the array
  for(somecountry in frData){
    if(notInArray(somecountry)&&country[somecountry].lat!=undefined){
      fCountries.push(new Array(country[somecountry].lat,
                                country[somecountry].lng,
                                somecountry));
    }
  }
  
  // makes the left-hand div with the countries and friend names
  for(var i=0;i<fCountries.length;i++){
    $('#countrynames').append(
      '<a href="'+i+'" class="country_links">'+fCountries[i][2]+'</a><br/>');
  }
  
  // Adding live action to on mouse over to the country names
  $('.country_links').live('mouseenter', function(){
    selCountry = $(this).attr('href');
    for(var i=0;i<myFriends[fCountries[selCountry][2]].length;i++){
      $('#friendnames_scroll').append(
        myFriends[fCountries[selCountry][2]][i].name+'<br/>');
    }
    if(myFriends[fCountries[selCountry][2]].length>frScrollPerPage){
      var scroll_top = myFriends[fCountries[selCountry][2]].length * frScrollRow - frScrollHeight + 150;
      var speed = scroll_top*20;
      $('#friendnames_scroll').animate({top:'-'+scroll_top+'px'},speed);
    }
    $('#friendnames').show();
    return false;
  });
  
  $('.country_links').live('click', function(){
    return false;
  });
  
  // clears the div on mouseout
  $('#countrynames').mouseout(function(){
    selCountry = -1;
    $('#friendnames_scroll').stop(true,true);
    $('#friendnames_scroll').animate({top:'0px'},10);
    $('#friendnames_scroll').html('');
    $('#friendnames').hide();
  });
  
  if ( !Detector.webgl ) {
    Detector.addGetWebGLMessage();
    return;
  }
  
  init();
  animate();
}

// Converts numeric degrees to radians
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

//function to find the position of the country on the sphere based on lat,lon
function findDotPosition(lt,ln,r){
  var x = r * Math.cos(lt) * Math.sin(ln);
  var y = r * Math.sin(lt)
  var z = r * Math.cos(lt) * Math.cos(ln);
  return Array(Math.round(x), Math.round(y), Math.round(z));
}

//function to find the midpoint between 2 points
function findMidpoint(lt1,lt2,ln1,ln2){
  var dLt = (lt2-lt1);
  var dLn = (ln2-ln1);
  var Bx = Math.cos(lt2) * Math.cos(dLn);
  var By = Math.cos(lt2) * Math.sin(dLn);
  var lt3 = Math.atan2(Math.sin(lt1)+Math.sin(lt2),
                      Math.sqrt( (Math.cos(lt1)+Bx)*(Math.cos(lt1)+Bx) + By*By) );
  var ln3 = ln1 + Math.atan2(By, Math.cos(lt1) + Bx);  
  return Array(lt3,ln3);
}

//function to find the vertices of a line between two country points
function getLineVertices(c1,c2,r_dots,r_lines){
  
  var lat = new Array();
  var lon = new Array();
  
  var midp_num = 4;
  var midp_count = Math.pow(2,midp_count);
  
  lat[0] = (c1[0]).toRad();
  lon[0] = (c1[1]).toRad();
  var dcoor1 = findDotPosition(lat[0],lon[0],r_dots);
  
  lat[1] = (c2[0]).toRad();
  lon[1] = (c2[1]).toRad();
  var dcoor2 = findDotPosition(lat[1],lon[1],r_dots);

  var linePoints = new Array();
  
  linePoints[0] = dcoor1;
  linePoints[1] = dcoor2;
  
  lat[Math.pow(2,midp_num+1)] = lat[1];
  lon[Math.pow(2,midp_num+1)] = lon[1];
  linePoints[Math.pow(2,midp_num+1)] = linePoints[1];
  
  linePoints[1] = undefined;
  
  for (i=midp_num;i>-1;i--){
    var step = Math.pow(2,i);
    for (j=0;j<linePoints.length;j+=step){
      if(linePoints[j] == undefined){
        lat[j] = findMidpoint(lat[j-step],lat[j+step],lon[j-step],lon[j+step])[0];
        lon[j] = findMidpoint(lat[j-step],lat[j+step],lon[j-step],lon[j+step])[1];
        linePoints[j] = findDotPosition(lat[j],lon[j],r_lines);
      }
    }
  }
  
  return linePoints;
}

// function to position element on a specific point of the sphere 
// (with changeable radius)
var setSPosition = function(obj, cId, r){
  var coords = findDotPosition((fCountries[cId][0]).toRad(),
                                (fCountries[cId][1]).toRad(),
                                r);
  obj.position.x = coords[0];
  obj.position.y = coords[1];
  obj.position.z = coords[2];
}


// We initialize everything here
function init() {
  var $container = $('#container');
  
  //setting the environment
  renderer = new THREE.WebGLRenderer({ antialias: true});
  camera = new THREE.PerspectiveCamera(20,WIDTH/HEIGHT,50,1e7);
  scene = new THREE.Scene();

  camera.position.z = 42000;
  camera.position.y = 10000;
  camera.position.x = 5000;
  
  renderer.setSize(WIDTH, HEIGHT);
  
  scene.add(camera);
  
  $container.append(renderer.domElement);
  
  // Camera controls
  controls = new THREE.TrackballControls( camera, renderer.domElement );

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.2;

  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.3;

  controls.minDistance = radius * 1.1;
  controls.maxDistance = radius * 100;
  

  //setting the Material of the Earth
  var planetTexture = THREE.ImageUtils.loadTexture( "textures/earth_m.jpg" );
  var normalTexture     = THREE.ImageUtils.loadTexture( "textures/earth_n.jpg" );
  var specularTexture   = THREE.ImageUtils.loadTexture( "textures/earth_s.jpg" );
  
  // Shaders from Mr.doob:
  // http://mrdoob.github.com/three.js/examples/webgl_trackballcamera_earth.html

	var shader = THREE.ShaderUtils.lib[ "normal" ],
	uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	uniforms[ "tNormal" ].texture = normalTexture;
	uniforms[ "uNormalScale" ].value = 0.7;

	uniforms[ "tDiffuse" ].texture = planetTexture;
	uniforms[ "tSpecular" ].texture = specularTexture;

	uniforms[ "enableAO" ].value = false;
	uniforms[ "enableDiffuse" ].value = true;
	uniforms[ "enableSpecular" ].value = true;

	uniforms[ "uDiffuseColor" ].value.setHex( 0xffffff );
	uniforms[ "uSpecularColor" ].value.setHex( 0xaaaaaa );
	uniforms[ "uAmbientColor" ].value.setHex( 0x000000 );

	uniforms[ "uShininess" ].value = 20;

	var sphereMaterial = new THREE.MeshShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: uniforms,
		lights: true
	});

  
  //setting the material for the dots
  var dotMaterial = new THREE.MeshPhongMaterial( {ambient: 0x000000,
                                                  color: 0xff66aa,
                                                  specular: 0x555555,
                                                  shininess: 20,
                                                  opacity:0.1,
                                                  transparency:true } );
  
  var radius = 6371, segments = 90, rings = 60;
  var radius_dot = 100, segments_dot = 10, rings_dot = 10;
  var radius_lines = 6500;
  var radius_dots = 6450;

  //Add the earth object
  var earth_mesh = new THREE.SphereGeometry(radius, segments, rings);
  earth_mesh.computeTangents();
  
  earth = new THREE.Mesh(earth_mesh, sphereMaterial);
  scene.add(earth);
  earth.rotation.y = -fCountries[0][1].toRad();

  //Add the connection lines
  linematerial = new THREE.LineBasicMaterial( { 
      color: 0xaeebff, 
      opacity: 0.6, 
      linewidth: 1, 
      blending: THREE.AdditiveBlending } );
  
  for(var l = 1; l < fCountries.length; l++) {
    geometry = new THREE.Geometry();
    var lPoints = getLineVertices( fCountries[0], 
                                   fCountries[l], 
                                   radius_dots, 
                                   radius_lines);
    for(var i=0;i<lPoints.length;i++){
      geometry.vertices.push( new THREE.Vertex( 
                                new THREE.Vector3( 
                                  lPoints[i][0], 
                                  lPoints[i][1], 
                                  lPoints[i][2]) ) 
                                );
    }
    line = new THREE.Line( geometry, linematerial );
    earth.add( line );
}
  
  
  // Particles for the country dots
  particlesCD = new THREE.Geometry(),
      pMaterial = new THREE.ParticleBasicMaterial({
              color: 0xFFFFFF,
              size: 1200,
              map: THREE.ImageUtils.loadTexture(
                  "textures/ball2.png"
              ),
              blending: THREE.AdditiveBlending,
              transparent: true
          });

  for(var p = 0; p < fCountries.length; p++) {
      var coords = findDotPosition((fCountries[p][0]).toRad(),
                                    (fCountries[p][1]).toRad(),
                                    radius_dots);
      var pX = coords[0],
          pY = coords[1],
          pZ = coords[2],
          particle = new THREE.Vertex(
              new THREE.Vector3(pX, pY, pZ)
          );
      particlesCD.vertices.push(particle);
  }

  var particleSystem = new THREE.ParticleSystem(particlesCD,
                                                pMaterial);
  particleSystem.sortParticles = true;
  earth.add(particleSystem);
  
  
  // Create particle for the selected country
  particlesSC = new THREE.Geometry();
  particlesSC.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 0, 0)));
  spMaterial = new THREE.ParticleBasicMaterial({
          color: 0xFFFFFF,
          size: 1800,
          map: THREE.ImageUtils.loadTexture(
              "textures/ball3.png"
          ),
          blending: THREE.AdditiveBlending,
          transparent: true
      });
  var particleSelected = new THREE.ParticleSystem(particlesSC,
                                              spMaterial);
  particleSelected.sortParticles = true;
  earth.add(particleSelected);
  
  
  // Create particle for glow
  var particles = new THREE.Geometry();
  particles.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 0, 0)));
  gpMaterial = new THREE.ParticleBasicMaterial({
          color: 0xFFFFFF,
          size: 150000,
          map: THREE.ImageUtils.loadTexture(
              "textures/nova.png"
          ),
          blending: THREE.AdditiveBlending,
      });
  var particleGlow = new THREE.ParticleSystem(particles,
                                              gpMaterial);
  particleGlow.sortParticles = true;
  scene.add(particleGlow);
  
  
  //Adding lights
  var directLight = new THREE.DirectionalLight(0xFFFFFF);
  directLight.position.set(-1, 0, 1);
  directLight.position.normalize();
  scene.add(directLight);
  
  var directLight1 = new THREE.DirectionalLight(0x777777);
  directLight1.position.normalize();
  scene.add(directLight1);
  
  var directLight2 = new THREE.DirectionalLight(0x555555);
  directLight2.position.set(1, 0, -1);
  directLight2.position.normalize();
  scene.add(directLight2);
  
  // After everything is loaded we close the facebox
  $.facebox.close();
}

// A function for loading the bubbles if new post is coming
var loadBubble = function(bId,cId,blText,pic){
 
  var loader = new THREE.ColladaLoader();
  loader.convertUpAxis = true;
  
   // Loading the bubble
  loader.load('models/sbubble_round2.dae', function (collada) {
      fBubble[bId] = new StreamBubble();
      fBubble[bId].bubobj = collada.scene;
      fBubble[bId].bubobj.useQuaternion = false;
      fBubble[bId].countryId = cId;
      fBubble[bId].bubobj.children[0].material = new THREE.MeshPhongMaterial(
                                                      {color: 0xff13af, 
                                                       specular: 0xffffff, 
                                                       shininess: 30, 
                                                       opacity:0.7,
                                                       transparent: true
                                                       });
      earth.add(fBubble[bId].bubobj);
      fBubble[bId].bubobj.rotation.set(0,
                                  (90+fCountries[fBubble[bId].countryId][1]).toRad(),
                                  (90).toRad()
                                  );
      fBubble[bId].setBubPos(0);
      fBubble[bId].createLabel(blText, 
                               labelW+50, 
                               labelH+400, 
                               labelZPos+portraitW/2, 
                               labelFontSize, 
                               labelTxtColor, 
                               labelBgColor, 
                               labelBgMargin);

      fBubble[bId].labelPresent = true;
      fBubble[bId].fbpic.src = pic;
      fBubble[bId].fbpic.onload = function(){
      fBubble[bId].createPortrait(fBubble[bId].fbpic, 
                                              portraitW-30, 
                                              portraitH+300, 
                                              labelZPos-1500+portraitW/2,
                                              labelBgColor);
      }
  });
}
  
// A function for calling the requestAnimationFrame
function animate() {
  requestAnimationFrame(animate);
  render();
}

// Rendering function for every frame - what changes how and when!
function render() {
  
  if(selCountry>-1){
    particlesSC.vertices[0].position.x = particlesCD.vertices[selCountry].position.x;
    particlesSC.vertices[0].position.y = particlesCD.vertices[selCountry].position.y;
    particlesSC.vertices[0].position.z = particlesCD.vertices[selCountry].position.z;
  }else{
    particlesSC.vertices[0].position.x = 0;
    particlesSC.vertices[0].position.y = 0;
    particlesSC.vertices[0].position.z = 0;
  }
  
  // Adding the bubbles and the streams to the array
  if(streamTimer == streamTimerMax){
    var timeHash = new Date().getTime() / 1000;
    FB.api('/me/home?tm='+timeHash, { limit: 1 }, function(response) {
      // console.log(response.data[0]);
      var nStreamStory = new StreamStory(response.data[0]);
      if(!nStreamStory.ifStoryExists(fStream)){
        fStream.push(nStreamStory);
        if(nStreamStory.ifFriendExists(fCountries, myFriends)){
          loadBubble(fBubble.length, nStreamStory.countryId, nStreamStory.story, nStreamStory.picture);
        }
      }
    });
    streamTimer = 0;
  }
  streamTimer++;
  
  // Animating the bubbles
  for(var i=0;i<fBubble.length;i++){
  
    // If the following bubble is loaded, we make it move
    if(fBubble[i]&&(fBubble[i].labelPresent&&fBubble[i].bubobj)){
      // First we enlarge the scale
      if(fBubble[i].bubScaleStep<=50){
        var bubScaleRat = 0.02*fBubble[i].bubScaleStep;
        fBubble[i].bubobj.scale.set(bubScaleRat,bubScaleRat,bubScaleRat);
        fBubble[i].bubScaleStep++;
      }
      // Then we make it move up and shake a bit
      if(fBubble[i].bubPosStep<labelLifeTime){
        // Moves the bubble 
        var posCoef = 25*fBubble[i].bubPosStep;
        if(fBubble[i].bubPosStep>50) posCoef = 1250 + 3*(fBubble[i].bubPosStep-25);
        fBubble[i].setBubPos(posCoef);
        fBubble[i].bubPosStep++;
        // Makes the bubble rock a bit
        if(fBubble[i].bubRotStep<fBubble[i].bubRotMax){
          fBubble[i].bubobj.rotation.x += fBubble[i].bubRotStepDeg*2;
          fBubble[i].bubobj.rotation.y += fBubble[i].bubRotStepDeg/2;
          fBubble[i].bubRotStep ++;
        }else{
          if(fBubble[i].bubRotMax==120) fBubble[i].bubRotMax = 240;
          fBubble[i].bubRotStep = 0;
          fBubble[i].bubRotStepDeg = fBubble[i].bubRotStepDeg*(-1);
        }
      }else if(fBubble[i].bubPosStep==labelLifeTime){
        // removes the bubble if it stays for too long
        fBubble[i].labelPresent = false;
        earth.remove(fBubble[i].bubobj);
        fBubble[i].bubobj = null;
        fBubble[i].pln = null;
        fBubble[i].profpic = null;
      }
    }
  
  }
  // 
  
  // Make the earth rotate
  earth.rotation.y -= earthRotSpeed;
  
  // update the controls, the camera and the renderer
  camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
}