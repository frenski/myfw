imagesQ={onComplete:function(){},onLoaded:function(){},current:null,qLength:0,images:[],inProcess:false,queue:[],queue_images:function(){var arg=arguments;for(var i=0;i<arg.length;i++){if(arg[i].constructor===Array){this.queue=this.queue.concat(arg[i])}else if(typeof arg[i]==='string'){this.queue.push(arg[i])}}},process_queue:function(){this.inProcess=true;this.qLength+=this.queue.length;while(this.queue.length>0){this.load_image(this.queue.shift())}this.inProcess=false},load_image:function(imageSrc){var th=this;var im=new Image;im.onload=function(){th.current=im;th.images.push(im);(th.onLoaded)();if(th.queue.length>0&&!th.inProcess){th.process_queue()}if(th.qLength==th.images.length){(th.onComplete)()}};im.src=imageSrc}}