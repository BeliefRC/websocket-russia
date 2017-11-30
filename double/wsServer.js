/*
* 1.游戏开始时，双方同时收到start消息（local）
* */
const app = require('http').createServer();
const io = require('socket.io')(app);

const PORT = 3000;
//客户端技术，存储客户端socket
let clientCount = 0, socketMap = {};
app.listen(PORT);

const bindLister = (socket, event) => {
    socket.on(event, (data) => {
        if (socket.clientNum % 2 === 0) {
            //给上一个用户发送init消息
            if (socketMap[socket.clientNum - 1]) socketMap[socket.clientNum - 1].emit(event, data);
        } else {
            if (socketMap[socket.clientNum + 1]) socketMap[socket.clientNum + 1].emit(event, data);
        }
    });
};

io.on('connection', (socket) => {
    clientCount++;
    socket.clientNum = clientCount;
    socketMap[clientCount] = socket;

    //判断单双数匹配
    if (clientCount % 2 === 1) {
        //单数，等待
        socket.emit('waiting', 'waiting for another person');
    } else {
        if (socketMap[(clientCount - 1)]) {
            socket.emit('start');
            //双数，给上一个用户发送start消息
            socketMap[(clientCount - 1)].emit('start')
        } else {
            socket.emit('leave')
        }
    }

    //向匹配到的另一个玩家发送init消息
    bindLister(socket, 'init');
    bindLister(socket, 'next');
    bindLister(socket, 'rotate');
    bindLister(socket, 'right');
    bindLister(socket, 'down');
    bindLister(socket, 'left');
    bindLister(socket, 'fall');
    bindLister(socket, 'fixed');
    bindLister(socket, 'line');
    bindLister(socket, 'time');
    bindLister(socket, 'lose');
    bindLister(socket, 'bottomLines');
    bindLister(socket, 'addTailLines');

    socket.on('disconnect', () => {
        if (socket.clientNum % 2 === 0) {
            //给上一个用户发送init消息
            if (socketMap[socket.clientNum - 1]) socketMap[socket.clientNum - 1].emit('leave');
        } else {
            if (socketMap[socket.clientNum + 1]) socketMap[socket.clientNum + 1].emit('leave');
        }
        delete (socketMap[socket.clientNum])
    })
});

console.log(`websocket server listening on port ${PORT}`
);