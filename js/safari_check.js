// Checks if it's Safari! first -----------------------------------
var userAgent = navigator.userAgent.toLowerCase(); 
$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase()); 
// Is this a version of Chrome?
if($.browser.chrome){
  userAgent = userAgent.substring(userAgent.indexOf('chrome/') +7);
  userAgent = userAgent.substring(0,userAgent.indexOf('.'));
  $.browser.version = userAgent;
  // If it is chrome then jQuery thinks it's safari so we have to tell it it isn't
  $.browser.safari = false;
}
// Is this a version of Safari?
if($.browser.safari){
  userAgent = userAgent.substring(userAgent.indexOf('safari/') +7);
  userAgent = userAgent.substring(0,userAgent.indexOf('.'));
  $.browser.version = userAgent;
}
// ---------------------------------------------------------------