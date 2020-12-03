const Koa = require('koa');
const koaSend = require('koa-send');
const statics = require('koa-static');
const socket = require('socket.io');

const path = require('path');
const http = require('http');

const port = 3000;
const app = new Koa();


app.use(statics(
    path.join( __dirname,  './dist')
));
app.use(async (ctx, next) => {
    if (!/\./.test(ctx.request.url)) {
        await koaSend(
            ctx,
            'index.html',
            {
                root: path.join(__dirname, './'),
                maxage: 1000 * 60 * 60 * 24 * 7,
                gzip: true,
            }
        );
    } else {
        await next();
    }
});
// 创建一个新的httpServer，设置回调和端口
// http://nodejs.cn/api/http.html#http_http_createserver_options_requestlistener
const httpServer = http.createServer(app.callback()).listen(port, ()=>{
    console.log('httpServer app started at port ...' + port);
});
const options = {
    ioOptions: {
        pingTimeout: 10000,
        pingInterval: 5000,
    }
};
// 创建了一个websocket
const httpIo = socket(httpServer, options);
const rooms = {};
const socks = {};
const readyList = {};
// 用于处理sock连接的函数
const httpConnectIoCallBack = (sock) => {
    console.log(`sockId:${sock.id}连接成功!!!`);
    sock.emit('connectionSuccess', sock.id);
    console.log('send');
    // 用户断开连接
    sock.on('userLeave', ({ userName, roomId, sockId} = user)=> {
        console.log(`userName:${userName}, roomId:${roomId}, sockId:${sockId} 断开了连接...`);
        if (roomId && rooms[roomId] && rooms[roomId].length) {
            rooms[roomId] = rooms[roomId].filter(item => item.sockId!==sockId);
	    if(readyList && readyList[roomId] && readyList[roomId].length)
	        readyList[roomId] = readyList[roomId].filter(item => item.sockId!==sockId);
            httpIo.in(roomId).emit('userLeave', rooms[roomId]);
            console.log(`userName:${userName}, roomId:${roomId}, sockId:${sockId} 离开了房间...`);
        }
    });
    // 用户加入房间
    sock.on('checkRoom', ({ userName, roomId, sockId})=> {
        rooms[roomId] = rooms[roomId] || [];
        sock.emit('checkRoomSuccess', rooms[roomId]);
        if (rooms[roomId].length > 1) return false;
        rooms[roomId].push({ userName, roomId, sockId});
        sock.join(roomId, () => {
            httpIo.in(roomId).emit('joinRoomSuccess', rooms[roomId]);
            socks[sockId] = sock;
            console.log(`userName:${userName}, roomId:${roomId}, sockId:${sockId} 成功加入房间!!!`);
        });
    });
    sock.on('checkReady', ({userName, roomId, sockId, getReady}) => {
        readyList[roomId] = readyList[roomId] || [];
	readyList[roomId].push({userName, roomId, sockId, getReady});
	//var flag = false;
	//if(readyList[roomId].length >1) flag = true;
	httpIo.in(roomId).emit('readyUpdate', readyList[roomId]);
    });
    sock.on('gridChange', ({otherCells, otherScore, roomId, sockId, otherGameState}) => {
        // should to be readyList
	if (roomId && rooms[roomId] && rooms[roomId].length) {
	    httpIo.in(roomId).emit('otherUpdate', { otherCells: otherCells, otherScore: otherScore, roomId:roomId, sockId: sockId, otherGameState: otherGameState});
	}
    });
};
// 开始监听连接
httpIo.on('connection', httpConnectIoCallBack);



