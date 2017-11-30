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
        })
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