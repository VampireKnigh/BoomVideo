var videoShow,copyCanvas;
var canvas = document.getElementById('videoShow'),
	sourceVideo = document.getElementById('sourceVideo'),
	copy = document.getElementById('videoCopy'),

	WIDTH = document.documentElement.clientWidth||document.body.clientWidth,
	HEIGHT = document.documentElement.clientHeight||document.body.clientHeight,
	COPY_WIDTH = 640,
	COPY_HEIGHT = 360;
//方块属性
var TILE_WIDTH = 32,
	TILE_HEIGHT = 24,
	TILE_CENTER_WIDTH=16,
	TILE_CENTER_HEIGHT=12;
//SOURCErECT表示画的长方形，而PAINTRECT则表示画布的大小
var SOURCERECT = {x:0,y:0,width:0,height:0},
	PAINTRECT={x:0,y:0,width:WIDTH,height:HEIGHT};
var RAD = Math.PI/180;

var tiles=[];
var first = true;
var offsetX=0,offsetY=0;
WIDTH *=0.98;
HEIGHT*=0.98;
window.onload = function(){

	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	copy.width = COPY_WIDTH;
	copy.height = COPY_HEIGHT;

	if(canvas.getContext('2d')){
		videoShow=canvas.getContext('2d');	
		copyCanvas = copy.getContext('2d');
	}else{
		alert("浏览器不兼容canvas");
		return ;
	}

	setInterval("processFrame()", 33);
	canvas.addEventListener('mousedown',dropBomb,false);
	canvas.addEventListener('touchstart',dropBomb,false);
}

function processFrame(){
	if(!isNaN(sourceVideo.duration)){
		if(SOURCERECT.width==0){
			SOURCERECT = {x:0,y:0,width:sourceVideo.videoWidth,height:sourceVideo.videoHeight};
			createTiles();
		}
	}
	copyCanvas.drawImage(sourceVideo,0,0);
	videoShow.clearRect(PAINTRECT.x, PAINTRECT.y,PAINTRECT.width,PAINTRECT.height);
	for(var i=0;i<tiles.length;i++){
		var tile=tiles[i];
		if(tile.force>0.0001){
			tile.moveX *=tile.force;
			tile.moveY *=tile.force;
			tile.moveRotation *=tile.force;
			tile.currentX +=tile.moveX;
			tile.currentY +=tile.moveY;
			tile.rotation +=tile.moveRotation;
			tile.rotation %=360;
			tile.force*=0.9//每渲染一帧都减弱力量；
			if(tile.currentX <= 0 || tile.currentX >= PAINTRECT.width){
				tile.moveX *= -1;
				//超出边界左右
			}
			if(tile.currentY <= 0 || tile.currentY >= PAINTRECT.height){
				tile.moveY *= -1;
				//超出上下边界
			}
		}else if(tile.rotation != 0||tile.currentX != tile.originX || tile.currentY != tile.originY)//判断没有回来到原来的位置和角度
		{
			var diffx=(tile.originX-tile.currentX)*0.2;
			var diffy=(tile.originY-tile.currentY)*0.2;
			var diffRot=(0-tile.rotation)*0.2;
			if(Math.abs(diffx)<0.5)//Math.abs计算绝对值的数值表达式(距离的0.2倍小于0.5为最后一步，接下来回到原位)
			{
				tile.currentX = tile.originX;
			}else{//距离的0.2超过0.5，那么加上距离的0.2再次渲染
				tile.currentX += diffx;
			}
			if(Math.abs(diffy)<0.5)//Math.abs计算绝对值的数值表达式
			{
				tile.currentY = tile.originY;
			}else{
				tile.currentY += diffy;
			}
			if(Math.abs(diffRot) < 0.5){
				tile.rotation = 0;
			}else{
				tile.rotation += diffRot;
			}
		}else{
			tile.force=0;
		}
		videoShow.save();//save() 方法把当前状态的一份拷贝压入到一个保存图像状态的栈中。
		videoShow.translate(tile.currentX,tile.currentY);
		videoShow.rotate(tile.rotation*RAD);
		videoShow.drawImage(copy,tile.videoX,tile.videoY,TILE_WIDTH,TILE_HEIGHT,-TILE_CENTER_WIDTH, -TILE_CENTER_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
		videoShow.restore();
	}
}

function createTiles(){
	offsetX = TILE_CENTER_WIDTH+(PAINTRECT.width-SOURCERECT.width)/2;
    offsetY = TILE_CENTER_HEIGHT+(PAINTRECT.height-SOURCERECT.height)/2;
    var y=0;
    while(y<SOURCERECT.height){
    	var x=0;
    	while(x<SOURCERECT.width){
    		var tile = new Tile();
    		tile.videoX=x;
			tile.videoY=y;
			tile.originX=offsetX+x;
			tile.originY=offsetY+y;
			tile.currentX=tile.originX;
			tile.currentY=tile.originY;
			tiles.push(tile);
			x+=TILE_WIDTH;
    	}
    	y+=TILE_HEIGHT;
    }
}
function Tile(){
	this.originX=0;
	this.originY=0;
	this.currentX=0;
	this.currentY=0;
	this.rotation=0;
	this.force=0;
	this.moveX=0;
	this.moveY=0;
	this.moveRotation=0;
	this.videoX=0;
	this.videoY=0;
}
function dropBomb(evt){
	var posx = 0,
		posy = 0;
	var e = evt||event;
	posx = e.pageX;
	posy = e.pageY;
	var canvasX=posx-this.offsetLeft;
	var canvasY=posy-this.offsetTop;
	explode(canvasX,canvasY);
}
function explode(x,y){
	for(var i=0;i<tiles.length;i++){
		var tile=tiles[i];
		var xdiff = tile.currentX-x,
			ydiff = tile.currentY-y;
		var dist = Math.sqrt(xdiff*xdiff+ydiff*ydiff);
		var randRange = 220+(Math.random()*30);
		var range = randRange-dist;
		var force = 3*(range/randRange);
		console.log(force);
		if(force > tile.force){
			tile.force = force;
			tile.moveX = xdiff/dist;
			tile.moveY = ydiff/dist;
			tile.moveRotation = 1-Math.random();
		}
		console.log(tile.force);
	}

	processFrame();
}