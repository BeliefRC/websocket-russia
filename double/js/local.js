//player info
const Local = function (socket) {
    //游戏对象，计时器，时间计数器，时间
    let game, timer = null, timeCount = 0, time = 0;

    //Time interval constant
    const INTERVAL = 200;

    //Binding keyboard events
    const bindKeyEvent = () => {
        document.onkeydown = (e) => {
            if (e.keyCode === 38) {//up
                game.rotate();
            } else if (e.keyCode === 39) {//right
                game.right()
            } else if (e.keyCode === 40) {//down
                game.down()
            } else if (e.keyCode === 37) {//left
                game.left()
            } else if (e.keyCode === 32) {//space
                game.fall()
            }
        }
    };
    //move
    const move = () => {
        countTime();
        //下落完成后固定，检查是否需要消行(加分)，检查是否游戏结束，更替方块
        if (!game.down()) {//不能下落了
            game.fixed();
            const line = game.checkClear();
            if (line) {
                game.addScore(line);
            }
            const gameOver = game.checkGameOver();
            if (gameOver) {
                game.gameOver(false);
                stop();
            } else {
                game.performNext(generateType(), generateDir());
            }
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
            if (time % 5 === 0) {
                game.addTailLines(generateBottomLine(1));
            }
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

        socket.emit('init', {type:type, dir:type});
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
    })

};