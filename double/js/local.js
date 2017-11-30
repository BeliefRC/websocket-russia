//player info
const Local = function (socket) {
    //游戏对象，计时器，时间计数器，时间
    let game, timer = null, timeCount = 0, time = 0;

    //Time interval constant
    const INTERVAL = 2000;

    //Binding keyboard events
    const bindKeyEvent = () => {
        document.onkeydown = (e) => {
            if (e.keyCode === 38) {//up
                game.rotate();
                socket.emit('rotate');
            } else if (e.keyCode === 39) {//right
                game.right();
                socket.emit('right');
            } else if (e.keyCode === 40) {//down
                game.down();
                socket.emit('down');
            } else if (e.keyCode === 37) {//left
                game.left();
                socket.emit('left');
            } else if (e.keyCode === 32) {//space
                game.fall();
                socket.emit('fall');
            }
        }
    };
    //move
    const move = () => {
        countTime();
        //下落完成后固定，检查是否需要消行(加分)，检查是否游戏结束，更替方块
        if (!game.down()) {//不能下落了
            game.fixed();
            socket.emit('fixed');
            const line = game.checkClear();
            //消行加分
            if (line) {
                game.addScore(line);
                socket.emit('line', line);
                if (line > 1) {
                    let bottomLines = generateBottomLine(line);
                    socket.emit('bottomLines', bottomLines);
                }
            }
            const gameOver = game.checkGameOver();
            if (gameOver) {
                game.gameOver(false);
                socket.emit('lose');
                document.getElementById('remote_game_over').innerHTML = '你赢了';
                stop();
            } else {
                let type = generateType(), dir = generateDir();
                game.performNext(type, dir);
                socket.emit('next', {type: type, dir: dir});

            }
        } else {
            socket.emit('down');
        }
    };

    //随机生成干扰行
    const generateBottomLine = lineNum => {
        let lines = [];
        for (let i = 0; i < lineNum; i++) {
            let line = [];
            for (let j = 0; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2) - 1)
            }
            lines.push(line)
        }
        return lines
    };

    //计时函数
    const countTime = () => {
        timeCount++;
        if (timeCount === 5) {
            timeCount = 0;
            time++;
            game.setTime(time);
            socket.emit('time', time)
        }
    };

    //随机生成一个方块种类
    const generateType = () => {
        return Math.ceil(Math.random() * 7) - 1
    };
    //随机生成一个方块方向
    const generateDir = () => {
        return Math.ceil(Math.random() * 4) - 1
    };

    //end game
    const stop = () => {
        //清除定时器
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        document.onkeydown = null;
    };

    //start game
    const start = () => {
        const doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            timeDiv: document.getElementById('local_time'),
            scoreDiv: document.getElementById('local_score'),
            resultDiv: document.getElementById('local_game_over'),
        };
        game = new Game();
        //初始化游戏并设置游戏数据
        let type = generateType(), dir = generateDir();
        game.init(doms, type, dir);

        socket.emit('init', {type: type, dir: dir});
        bindKeyEvent();
        let type1 = generateType(), dir1 = generateDir();

        socket.emit('next', {type: type1, dir: dir1});
        game.performNext(type1, dir1);
        timer = setInterval(move, INTERVAL)
    };
    //接受start消息，开始游戏
    socket.on('start', () => {
        document.getElementById('waiting').innerHTML = '';
        start();
    });
    socket.on('lose', () => {
        game.gameOver(true);
        stop();
    });
    socket.on('leave', () => {
        document.getElementById('local_game_over').innerHTML = '对方玩家掉线';
        document.getElementById('remote_game_over').innerHTML = '已掉线';
        stop();
    });
    socket.on('bottomLines', (data) => {
        game.addTailLines(data);
        socket.emit('addTailLines', data);
    });

};