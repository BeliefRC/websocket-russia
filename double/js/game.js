const Game = function () {
    //domElem
    let gameDiv, nextDiv, timeDiv, scoreDiv, resultDiv;

    //current square,next square
    let cur, next;

    //divs
    let nextDivs = [], gameDivs = [];

    let score = 0;

    //gameMatrix
    let gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    /**
     * initDivs
     * @param container dom游戏区域
     * @param data 数据矩阵
     * @param divs 存放divDoms的数组
     */
    const initDiv = (container, data, divs) => {
        let docFragment = document.createDocumentFragment();
        for (let i = 0; i < data.length; i++) {
            let div = [];
            for (let j = 0; j < data[0].length; j++) {
                let newNode = document.createElement('div');
                newNode.className = 'none';
                newNode.style.top = (i * 20) + 'px';
                newNode.style.left = (j * 20) + 'px';
                docFragment.appendChild(newNode);
                div.push(newNode);
            }
            divs.push(div);
        }
        container.appendChild(docFragment);
    };

    /**
     * refreshDiv
     * @param data 数据矩阵
     * @param divs 存放divDoms的数组
     */
    const refreshDiv = (data, divs) => {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                //0 普通区域，1下落完成，2正在下落
                if (data[i][j] === 0) {
                    divs[i][j].className = 'none'
                } else if (data[i][j] === 1) {
                    divs[i][j].className = 'done'
                } else if (data[i][j] === 2) {
                    divs[i][j].className = 'current'
                }
            }
        }
    };

    /**
     * is legal point?
     * 不能超出边界，不能和已有方块重合
     * @param pos
     * @param x
     * @param y
     */
    const check = (pos, x, y) => {
        //Beyond the top edge,Beyond the bottom edge,
        // Beyond the left edge,Beyond the right edge
        if (pos.x + x < 0 || pos.x + x >= gameData.length ||
            pos.y + y < 0 || pos.y + y >= gameData[0].length) {
            return false
        }
        //Already exist square
        else return gameData[pos.x + x][pos.y + y] !== 1;
    };

    /**
     * is legal data?
     * 当前位置有方块且在合法的位置
     * @param pos
     * @param data
     */
    const isValid = (pos, data) => {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                //exist point && illegal position
                if (data[i][j] !== 0 && !check(pos, i, j)) {
                    return false
                }
            }
        }
        return true
    };

    //clear data
    const clearData = () => {
        for (let i = 0; i < cur.data.length; i++) {
            for (let j = 0; j < cur.data[i].length; j++) {
                //legal point?
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0;
                }
            }
        }
    };

    //set data
    const setData = () => {
        for (let i = 0; i < cur.data.length; i++) {
            for (let j = 0; j < cur.data[i].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
                }
            }
        }
    };

    //down
    this.down = () => {
        if (cur.canDown(isValid)) {
            clearData();
            cur.down();
            setData();
            refreshDiv(gameData, gameDivs);
            //设置返回值来判断能否坠落
            return true
        }
        return false
    };

    //left
    this.left = () => {
        if (cur.canLeft(isValid)) {
            clearData();
            cur.left();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    };

    //right
    this.right = () => {
        if (cur.canRight(isValid)) {
            clearData();
            cur.right();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    };

    //rotate
    this.rotate = () => {
        if (cur.canRotate(isValid)) {
            clearData();
            cur.rotate();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    };

    //fall
    this.fall = () => {
        while (this.down()) {
        }
    };

    //方块到达底部后固定
    this.fixed = () => {
        for (let i = 0; i < cur.data.length; i++) {
            for (let j = 0; j < cur.data[i].length; j++) {
                //legal position && falling
                if (check(cur.origin, i, j) && gameData[cur.origin.x + i][cur.origin.y + j] === 2) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 1;
                }
            }
        }
        refreshDiv(gameData, gameDivs)
    };

    //use next square and make a new next square
    this.performNext = (type, dir) => {
        cur = next;
        setData();
        next = SquareFactory.prototype.make(type, dir);
        refreshDiv(gameData, gameDivs);
        refreshDiv(next.data, nextDivs);
    };

    //消行
    this.checkClear = () => {
        //消除的行数
        let line = 0;
        //最后一行开始循环
        for (let i = gameData.length - 1; i >= 0; i--) {
            let clear = true;
            for (let j = 0; j < gameData[i].length; j++) {
                //如果有空位置，不消行，跳出此行循环
                if (gameData[i][j] !== 1) {
                    clear = false;
                    break;
                }
            }
            //当前行可以被消除
            if (clear) {
                line++;
                //消除此行
                for (let m = i; m > 0; m--) {
                    for (let n = 0; n < gameData[0].length; n++) {
                        //被消除行的上一行向下移动
                        gameData[m][n] = gameData[m - 1][n];
                    }
                }
                for (let n = 0; n < gameData[0].length; n++) {
                    //填充第一行
                    gameData[0][n] = 0;
                }
                //被删除后，需要++
                i++;
            }
        }
        return line
    };


    //check is game over?
    this.checkGameOver = () => {
        let gameOver = false;
        for (let i = 0; i < gameData[0].length; i++) {
            //判断第2行方块是否固定
            if (gameData[1][i] === 1) {
                gameOver = true
            }
        }
        return gameOver
    };

    //set time
    this.setTime = (time) => {
        timeDiv.innerHTML = time;
    };


    //add score
    this.addScore = (line) => {
        let s = 0;
        switch (line) {
            case 1:
                s = 10;
                break;
            case 2:
                s = 30;
                break;
            case 3:
                s = 60;
                break;
            case 4:
                s = 100;
                break;
            default:
                break;
        }
        score += s;
        scoreDiv.innerHTML = score;
    };


    //game over info
    this.gameOver = (win) => {
        win ? resultDiv.innerHTML = '你赢了' :
            resultDiv.innerHTML = '你输了'
    };

    //底部增加行
    this.addTailLines = (lines) => {
        //所有方块向上移
        for (let i = 0; i < gameData.length - lines.length; i++) {
            gameData[i] = gameData[i + lines.length];
        }
        //底部方块替换为lines
        for (let i = 0; i < lines.length; i++) {
            gameData[gameData.length - lines.length + i] = lines[i];
        }
        //移动下落方块的位置
        cur.origin.x = cur.origin.x - lines.length;
        //最高移动到顶端
        if (cur.origin.x<0) {
            cur.origin.x = 0;
        }
        refreshDiv(gameData, gameDivs);
    };

    /**
     * init
     * 设置游戏区域
     * 生成下一个方块
     * 刷新页面视图
     * @param doms
     * @param type
     * @param dir
     */
    this.init = (doms, type, dir) => {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        timeDiv = doms.timeDiv;
        scoreDiv = doms.scoreDiv;
        resultDiv = doms.resultDiv;
        next = SquareFactory.prototype.make(type, dir);
        initDiv(gameDiv, gameData, gameDivs);
        initDiv(nextDiv, next.data, nextDivs);
        refreshDiv(next.data, nextDivs);
    };
};

