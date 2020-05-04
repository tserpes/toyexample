const express = require('express');
const app = express();
var expressWs = require('express-ws')(app);

app.use(express.static('.'));

function Drawable(clientId, topLeftX, topLeftY, width, height, color, speed, direction){
	this.clientId = clientId;
	this.topLeftX = topLeftX;
	this.topLeftY = topLeftY;
	this.width = width;
	this.height = height;
	this.color = color;
	this.speed = speed;
	this.direction = direction;
};

let clients = [];
let drawables = [];

let clientCounter = 0;

const canvas = {width:600,height:300};

app.ws('/echo', function(ws, req){
	const clientId = clientCounter;
	clients.push({clientId:clientId,connection:ws});
	clientCounter++;

	const topLeftX = Math.random()*(canvas.width-30);
	const topLeftY = Math.random()*(canvas.height-30);
	const color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
	let drawable = new Drawable(clientId, topLeftX, topLeftY, 10, 10, color, 1, null);
	drawables.push(drawable);

	ws.on('message', function(msg){
		const message = JSON.parse(msg);
		switch(message.type){
			case 'userAction':
				switch(message.data){
					case 'ArrowUp':
						drawable.direction = 'up';
						break;
					case 'ArrowDown':
						drawable.direction = 'down';
						break;
					case 'ArrowRight':
						drawable.direction = 'right';
						break;
					case 'ArrowLeft':
						drawable.direction = 'left';
						break;
				}
			break;
		}
	});

	ws.on('error',function(){clear(clientId)});
	ws.on('close',function(){clear(clientId)});
});

function clear(clientId){
	clients = clients.filter(function(client){
		if (client.clientId != clientId){
			return client;
		}
	});
	drawables = drawables.filter(function(drawable){
		if (drawable.clientId != clientId){
			return drawable;
		}
	});
}

let interval = setInterval(function(){
	drawables.forEach(function(drawable){
		switch(drawable.direction){
			case 'right':
				drawable.topLeftX+=drawable.speed;
				break;
			case 'left':
				drawable.topLeftX-=drawable.speed;
				break;
			case 'up':
				drawable.topLeftY-=drawable.speed;
				break;
			case 'down':
				drawable.topLeftY+=drawable.speed;
				break;
			default:
				break;
		}
	});

	clients.forEach(function(client){
		if (client.connection.readyState == 1){
			client.connection.send(JSON.stringify({type:'model',data:drawables}));
		}
	});
},40);

app.listen(3000);