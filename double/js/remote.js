const Remote = function (socket) {
    //game obj
    let game;

    //Binding  events
    const bindEvents = () => {
        socket.on('init', (data) => {
            start(data.type, data.dir);
        });
        socket.on('next', (data) => {
            game.performNext(data.type, data.dir);
        });
        socket.on('rotate', () => {
            game.rotate();
        });
        socket.on('right', () => {
            game.right();
        });
        socket.on('down', () => {
            game.down();
        });
        socket.on('left', () => {
            game.left();
        });
        socket.on('fall', () => {
            game.fall();
        });
        socket.on('fixed', () => {
            game.fixed();
        });
        socket.on('line', (data) => {
            game.checkClear();
            game.addScore(data)
        });
        socket.on('time', (data) => {
            game.checkClear();
            game.setTime(data)
        });
        socket.on('lose', () => {
            game.gameOver(false);
        });
        socket.on('addTailLines', (data) => {
            game.addTailLines(data);
        });
    };

    //start game
    const start = (type, dir) => {
        const doms = {
            gameDiv: document.getElementById('remote_game'),
            nextDiv: document.getElementById('remote_next'),
            timeDiv: document.getElementById('remote_time'),
            scoreDiv: document.getElementById('remote_score'),
            resultDiv: document.getElementById('remote_game_over'),
        };
        game = new Game();
        //初始化游戏并设置游戏数据
        game.init(doms, type, dir);
    };

    bindEvents();
};