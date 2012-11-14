// ----------------------------------------------------------------------------
// a class for the feed stories (for both views)
// ----------------------------------------------------------------------------

// **** the feed buble js object **** //
StreamStory = function(fb_data){
  //the text of the story
  this.story = '';
  this.sid = fb_data.id;
  this.fromId = fb_data.from.id;
  this.fromName = fb_data.from.name;
  this.countryId = 0;
  this.picture = '';
  
  // checks if the friend with this story exists in the list with the countries
  this.ifFriendExists = function(cList,fList){
    var fExists = false;
    
    for(var i=0;i<cList.length;i++){
      for(var j=0;j<fList[cList[i][2]].length;j++){
        if(fList[cList[i][2]][j].uid == this.fromId){
          fExists = true;
          if(fb_data.message){
            this.story = this.fromName+": "+fb_data.message;
          }else{
            this.story = fb_data.story;
          }
          this.countryId = i;
          this.picture=fList[cList[i][2]][j].picture;
        }
      }
    }
    console.log(fExists+" for friend/page:"+this.fromName);
    return fExists;
  };
  
  // checks if the friend with this story exists in the list with the countries
  this.ifFriendExists2d = function(fList,cList){
    var fExists = false;
    
    for(var fcountry in fList){
      for(var i=0;i<fList[fcountry].length;i++){
        if(fList[fcountry][i].uid == this.fromId){
          for(var j=0; j<cList.length; j++){
            if(fcountry == cList[j].name){
              this.countryId = j;
              if(fb_data.message){
                this.story = this.fromName+": "+fb_data.message;
              }else{
                this.story = fb_data.story;
              }
              fExists = true;
            }
          }
          
        }
      }
    }
    console.log(fExists+" for friend/page:"+this.fromName);
    
    return fExists;
  }
  
  // Checks if this story exists already
  this.ifStoryExists = function(sList){
    var sExists = false;
    for(var i=0; i<sList.length; i++){
      if(sList[i].sid == this.sid) sExists = true;
    }
    console.log(sExists+" for story:"+this.sid);
    return sExists;
  }
  
};