//square info
const Square = function () {
    //square data
    this.data = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    //起点为游戏区域左上角，x:纵向方向，y:横向方向
    // base point
    this.origin = {
        x: 0, y: 0
    };

    // rotate direction
    this.dir = 0;
};

//square already arrive at bottom edge
Square.prototype.canRotate = function (isValid,num = 1) {
    let d = (this.dir + num) % 4;
    const testPoint = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].length; j++) {
            testPoint[i][j] = this.rotates[d][i][j]
        }
    }
    return isValid(this.origin, testPoint)
};

Square.prototype.rotate = function (num = 1) {
    this.dir = (this.dir + num) % 4;
    for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].length; j++) {
            this.data[i][j] = this.rotates[this.dir][i][j]
        }
    }
};

//square already arrive at bottom edge
Square.prototype.canDown = function (isValid) {
    const testPoint = {};
    testPoint.x = this.origin.x + 1;
    testPoint.y = this.origin.y;
    //传入下一位置的信息
    return isValid(testPoint, this.data)
};

Square.prototype.down = function () {
    this.origin.x++;
};

//square already arrive at left edge
Square.prototype.canLeft = function (isValid) {
    const testPoint = {};
    testPoint.x = this.origin.x;
    testPoint.y = this.origin.y - 1;
    //传入下一位置的信息
    return isValid(testPoint, this.data)
};

Square.prototype.left = function () {
    this.origin.y--;
};

//square already arrive at right edge
Square.prototype.canRight = function (isValid) {
    const testPoint = {};
    testPoint.x = this.origin.x;
    testPoint.y = this.origin.y + 1;
    //传入下一位置的信息
    return isValid(testPoint, this.data)
};

Square.prototype.right = function () {
    this.origin.y++;
};