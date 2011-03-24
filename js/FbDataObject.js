// ----------------------------------------------------------------------------
// a class for the data fetched from facebook
// ----------------------------------------------------------------------------

FbDataObject = function () {
  
  // --------------------------------------------------------------------------
  // private
  // --------------------------------------------------------------------------
  
  var dxPic = 2; //Spead for pictures scale animation 
  
  //the function puts the information of the user into a JSON object
  var getMyself = function(me){
    var mySelf = {'uid' : me[0].uid,
                  'name' : me[0].name,
                  'picture' : me[0].pic_square,
                  'country' : me[0].current_location.country
                 };
    return mySelf;
  }
  
  //puts the friends and the countries in a json object
  var getFriends = function(thefriends){
    var myFriends = {};
    for(var i=0;i<thefriends.length;i++){
      //if the country doesn't exist yet, creates a new sub object
      if(myFriends[thefriends[i].current_location.country] == undefined){
        myFriends[thefriends[i].current_location.country] = [];
      }
      var curlength = myFriends[thefriends[i].current_location.country].length;
      myFriends[thefriends[i].current_location.country][curlength] = 
          {'uid' : thefriends[i].uid,
            'name' : thefriends[i].name,
            'picture' : thefriends[i].pic_square,
            'country' : thefriends[i].current_location.country
          };
    }
    
    return myFriends;
  };
  
  
  //The main function to initiate the objects and pefrom action
  // * Creates a drawing interface object for the canvas issues
  // * Finds the home land of the user and the country with the most friends
  //   in the friends country array
  // * Generates 
  var initFbObjects = function(mySelf,myFriends){
    //creates an object for the drawing interface
    var di = new DrawInterface("canv1");
    di.clearCanvas();

    //creates an array for the Dot objects
    var cntFriends = new Array();

    //creates an array for the Profile Picture objects
    var picFriends = new Array();

    //a var to keep the id of the land from which the current user is
    var myLand = -1;
    var j=0;
    //a var to keep the id of the land with the higher number of friends
    var bigLand = "";

    //finds the user home land and the country with the most friends-----------
    for(var fcountry in myFriends){
      if(mySelf.country == fcountry) myLand = j;
      if(j==0){
        bigLand = fcountry;
      }else{
        if(myFriends[fcountry].length > myFriends[bigLand].length){
          bigLand = fcountry;
        }
      }
      j++;
    }

    //creates an array of countries
    for(var fcountry in myFriends){
      cntFriends.push(new CountryDots(myFriends[fcountry].length,
                          myFriends[bigLand].length,di,fcountry));
    }

    //---adds each profile picture to the array------------------------------
    for(var j=0;j<cntFriends.length;j++){
      //creates a sub-array for the profile pictures in this country
      picFriends[j] = new Array()
      //gets the active area position in the middle
      var dotCenterX = cntFriends[j].x+Math.round(cntFriends[j].w/2);
      var dotCenterY = cntFriends[j].y+Math.round(cntFriends[j].h/2);
      var picXPos=0;
      var picYPos=0;
      var picdxRadius = 4;
      var picdxAngle = 1;
      var picRadius = 10;
      var picAngle = 0;
      for(var i=0;i<myFriends[cntFriends[j].name].length;i++){
        var picDistX = Math.round(picRadius*Math.cos(picAngle));
        var picDistY = Math.round(picRadius*Math.sin(picAngle));
        picXPos = dotCenterX + picDistX;
        picYPos = dotCenterY + picDistY;
        picRadius+=(picdxRadius-Math.round((i/myFriends[cntFriends[j].name].length)*5));
        picAngle+=picdxAngle;
        picFriends[j].push(
          new ProfPictures(myFriends[cntFriends[j].name][i].picture, 
                                         0, 0, picXPos, picYPos,di));
      }
    }

    //TODO: Find a way not to make the same loop 3 times
    
    
    //---for the animation-----------------------------------------------------
    //-------------------------------------------------------------------------
    
    setInterval(function(){
      
      //keeps if no area has been matched
      var selectNone = true; 
      //clears Canvas
      di.clearCanvas();
      
      //adds the dots and the connection lines and generates pictures----------
      for(var j=0;j<cntFriends.length;j++){
        cntFriends[j].addDot();
      }
      
      //adds a connection if we know the home land-----------------------------
      for(var j=0;j<cntFriends.length;j++){
        if((myLand>=0)&&(myLand!=j)){
          cntFriends[j].addConnectionLine(cntFriends[myLand].x,
                                          cntFriends[myLand].y,
                                          cntFriends[myLand].w,
                                          cntFriends[myLand].h);
        }
      };
      
      //Adds the images depending on the selectiion and their size-------------
      for(var j=0;j<cntFriends.length;j++){
        //if mouseovers the current area, performs an action
        if(di.isMouseOver(cntFriends[j])){ 
          selectNone = false;
          cntFriends[j].active = true;
          for(var i=0;i<picFriends[j].length;i++){
            picFriends[j][i].scalePicture(dxPic);
            picFriends[j][i].drawPicture();
          }
        }else{
          if(cntFriends[j].active == true ){
            for(var i=0;i<picFriends[j].length;i++){
              picFriends[j][i].scalePicture(-dxPic, cntFriends[j]);
              picFriends[j][i].drawPicture();
              if(picFriends[j][i].prw == 0) cntFriends[j].active = false;
            }
          }
        }
      };
      
      //changes the cursor in case of active area-------------------------------
      if(selectNone){
        document.body.style.cursor='default';
      }else{
        document.body.style.cursor='pointer';
      };
      
    }, 10);
    
  }

  // --------------------------------------------------------------------------
  // public
  // --------------------------------------------------------------------------
  
  // the main function:
  // * gets all the facebook data
  // * preloads all the images
  // * when done calls the initiate object function
  
  this.getFbData = function(){
    
    var query1 = 'SELECT name,current_location,pic_square,uid FROM user WHERE uid = me()';
    var query2 = 'SELECT name,current_location,pic_square,uid FROM user WHERE uid=me() OR uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND current_location>0 ORDER BY current_location';
    var dataMe = FB.Data.query(query1);
    var dataFriends = FB.Data.query(query2);
    
    //Executes the other functions after the data from facebook is present
    FB.Data.waitOn([dataMe, dataFriends], function(args) {
      //Gets the data for the current user as well as for his friends
      var mySelf = getMyself(dataMe.value);
      var myFriends = getFriends(dataFriends.value);
      
      //Preloads all the profile pictures
      var allProfPicLoad = new Array();  
      var imagesQueue = imagesQ;
      
      for(var fpiccountry in myFriends){
        for(i=0;i<myFriends[fpiccountry].length;i++){
          allProfPicLoad.push(myFriends[fpiccountry][i].picture);
        }
      }

      imagesQueue.queue_images(allProfPicLoad);
      imagesQueue.process_queue();
      
      //-----------------------------------------------------------------------
      //When the loading is done proceeds to create the necessary objects

      imagesQueue.onComplete = function()
      {
        //closes the loading box
        $.facebox.close();
        
        //calls the function for loading the objects
        initFbObjects(mySelf,myFriends);
      }
      
    });
    
  }

  this.logout = function(){
    alert('You have successfully logged out!');
  }

};