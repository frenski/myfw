var wrapText = function(context, text, x, y, maxWidth, lineHeight, maxLineNum) {
  var words = text.split(" ");
  var line = "";
  var lineNum = 0;
  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if((testWidth > maxWidth)&&(lineNum<maxLineNum)) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
      lineNum++;
    }
    else {
      line = testLine;
    }
  }
  if(lineNum<=maxLineNum-1){
    context.fillText(line, x, y);
  }
}