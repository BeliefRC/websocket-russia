const app = require('http').createServer();
const io = require('socket.io')(app);

const PORT = 3000;
//客户端技术，存储客户端socket
let clientCount = 0, socketMap = {};
app.listen(PORT);

io.on('connection', (socket) => {
    clientCount++;
    socket.clientNum = clientCount;
    socketMap[clientCount] = socket;

    //判断单双数匹配
    if (clientCount % 2 === 1) {
        //单数，等待
        socket.emit('waiting', 'waiting for another person');
    } else {
        socket.emit('start');
        //双数，给上一个用户发送start消息
        socketMap[(clientCount - 1)].emit('start')
    }

    //向匹配到的另一个玩家发送init消息
    socket.on('init', (data) => {
        if (socket.clientNum % 2 === 0) {
            //给上一个用户发送init消息
            socketMap[socket.clientNum - 1].emit('init', data);
        } else {
            socketMap[socket.clientNum + 1].emit('init', data);
        }
    });

    socket.on('next', (data) => {
        if (socket.clientNum % 2 === 0) {
            //给上一个用户发送init消息
            socketMap[socket.clientNum - 1].emit('next', data);
        } else {
            socketMap[socket.clientNum + 1].emit('next', data);
        }
    });

    socket.on('disconnect', () => {

    })
});

console.log(`websocket server listening on port ${PORT}`
);