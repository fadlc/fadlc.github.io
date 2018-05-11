angular.module("memoryGame", [])
.controller("mainController", function($scope, $timeout){
    $scope.model = new MemoryGame($timeout);
    
    $scope.restart = function() {
        $scope.model = new MemoryGame($timeout);    
    }
});

var MemoryGame = function($timeout) {
    this.$timeout = $timeout;
    this.board = new Array(this.boardSize);
    this.state = 'Start game';
    this.compared = false;
    this.clicked = 0;
    this.tried = 0;
    this.average = '';
    this.timeMinutes = '';
    this.initialDate= new Date();
    this.lastClicked = [];
    this.images = [];
    this.AllImg = this.boardSize * this.boardSize;
    
    for (var i = 0; i < 18; i++) {
        let att = 'images/pic' + (i + 1) + '.jpg'; 
        this.images[i] = att;
        this.images[i+18] = att;
    }
    
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    
    shuffle(this.images);
    
    var num = 0;
    for (i = 0; i < this.boardSize; i++) {
        this.board[i] = new Array(this.boardSize);
        for (var j = 0; j < this.boardSize; j++){
            this.board[i][j] = { imgClass: 'hidden', attribute: this.images[num] };
            num += 1;
        }
    }
};

MemoryGame.prototype.fill = function (i, j) {
    this.state = 'Playing...'
    if (this.board[i][j].imgClass == 'hidden') {
        this.board[i][j].imgClass = 'show';
        this.clicked += 1;
        this.lastClicked.push({ index: [i, j], attribute: this.board[i][j].attribute });
        var compared = this.compare(); 
        if (compared) {
            this.$timeout(this.clean.bind(this), 500);
        }
    }
};

MemoryGame.prototype.compare = function() {
    if (this.clicked == 2) {
        this.tried += 1;
        if (this.lastClicked[0].attribute == this.lastClicked[1].attribute) {
            this.clicked = 0;
            this.lastClicked = [];
            this.AllImg -= 2;
            if (this.AllImg == 0) {
                this.state = 'Finished!!!';
                this.average = ' --  Average: ' + this.statistic() + '%';
                this.timeMinutes = ' -- Time elapsed: ' + this.calculateMinutes() + ' minutes'; 
            }
            return false;
        }
        this.clicked = 0;
        return true;
    }
};

MemoryGame.prototype.clean = function() {
    for (var i = 0; i < this.lastClicked.length; i++) {
        var index = this.lastClicked[i].index;
        this.board[index[0]][index[1]].imgClass = 'hidden';
    }
    this.lastClicked = [];
};

MemoryGame.prototype.statistic = function() {
    var optimum = this.boardSize * 2;
    var x = this.tried - optimum;
    var y = optimum - x;
    var result = Math.floor(y / optimum) * 100;
    return result;
}

MemoryGame.prototype.calculateMinutes = function() {
    var finalDate = new Date();
    var mins = finalDate.getMinutes() - this.initialDate.getMinutes();
    return mins;
}

MemoryGame.prototype.boardSize = 6;
