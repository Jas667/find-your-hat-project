const prompt = require('prompt-sync')({sigint: true});

//provided characters for maze/game by codecademy
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';


//create a class to store game
class Field {

    //static method for generating field. Inputs decided by user. Field can then be used in game rather than having to provide an array of arrays yourself.
    static generateField(width, height, percentHoles) {
        //array of two elements to make up final array which will represent field
        let arrCharacters = ['O', '░'];
        //variable to store arrays which will make up game field. This can then be passed to methods that control game
        let newGeneratedField = [];
        //length of overall array, which will eventually be split using splice method into the desired width and height
        let lengthArray = width * height;
        //for loop to construct array. On each iteration, use filter to check % occurence of 'O' (holes in game). If lower than total % wanted, input either 'O' or fieldCharacter at random. If not, only add fieldCharacters to make up rest of maze.
        for (let i = 0; i < lengthArray; i++) {
            //if clause working out % of holes of overall maze size on each iteration
            if ((newGeneratedField.filter(x => x == 'O').length / lengthArray) * 100 < percentHoles) {
                newGeneratedField.push(arrCharacters[Math.floor(Math.random() * 2)])
            } else {
                //add fieldCharacter if maze already has desired max % of holes.
                newGeneratedField.push(arrCharacters[1]);
            }
        }
        //add hat and path position at random, making sure they don't overlap. Use variables to store positions. This will allow it to be changed if they are in the same position
        let hatPosition = Math.floor(Math.random() * newGeneratedField.length);
        let pathPosition = Math.floor(Math.random() * newGeneratedField.length);
        //check if both are the same. If not, position playing elements. If they are the same, change pathPosition.
        if (hatPosition != pathPosition) {
            newGeneratedField[hatPosition] = '^';
            newGeneratedField[pathPosition] = '*';
        } else {
            newGeneratedField[hatPosition] = '^';
            newGeneratedField[pathPosition - 3] = '*';
        }
        //use splice to split array so it matches width/height paramaters. This will allow it to be passed to methods of Field array and be used in game
        let finalField = [];
        for (let i = 0; i < newGeneratedField.length; i += width) {
            finalField.push(newGeneratedField.slice(i, i + width));
        }
        //return generated field
        return finalField;
    }
    //class constructor
    constructor(field) {
        this._field = field;
        //use these to track movements in game as though arrays make up a graph with an x and y axis
        this._xAxis = 0;
        this._yAxis = 0;
        //these will be used to replace where hat has been after move, storing position hat has moved from
        this._prevXAxis = 0;
        this._prevYAxis = 0;

    }
    get field() {
        return this._field;
    }
    //methods to make moves by adjusting axis numbers, which will be used as positions in array eg arr[x][y]
    left() {
        this._xAxis -= 1;
    }
    right() {
        this._xAxis += 1
    }
    up() {
        this._yAxis -= 1;
    }
    down() {
        this._yAxis += 1;
    }
    //prints arrays as a string to represent game board without spaces
    print() {
        for (let i = 0; i<this.field.length; i++) {
            console.log(this.field[i].toString().replaceAll(',', ''));
        }
    }
    //ask user if they want to play a game. Quit if not.
    playGame() {

        let wantToPlay;
        if (wantToPlay === 'undefined') {
            //prompt if user has input something other than Y or N
            wantToPlay = prompt('Do you want to play the hat game? Y/N');
        } else {
            //inital welcome and question if they want to play
        wantToPlay = prompt(`Hi, do you want to play the hat game? Y/N`)};
        //change to uppercase
        wantToPlay = wantToPlay.toUpperCase();
        
        //start game or exit ndepending on whether they want to play
        if (wantToPlay === 'N') {
            console.log(`Ok, bye then!`);
            process.exit();
        } else if (wantToPlay === 'Y') {
            console.log(`Ok, let's go...`);

            //find starting position and then show field to user and ask for move
            this.startingPosition(this.field);
            this.print();
            this.makeMove();
        } else {
            console.log(`Oops! You need to type Y or N.`);
            this.playGame();
        }
    }
    //method to track moves
    makeMove() {
        //ask user to make a move
        //creating space using console.log so the board is easier to see
        console.log('')
        console.log('')
        let move = prompt(`Make your move. Type 'U' to move up. 'D' to move down. 'L' to move left, and 'R' to move right.`)
        move = move.toUpperCase();
        //check input to make sure it is valid
        if (!move === 'U' || !move === 'D' || !move === 'L' || !move === 'R') {
            move = prompt(`Oops! You need to select a valid move using U/D/L/R...`)
        } else {
            this.updateBoard(move);
        }
        
    }
    updateBoard(move) {
        //variables getting overall dimensions of game array
        const numArrays = this.field.length - 1;
        const numCharactersInArray = this.field[0].length - 1;

        //Make move depending on input from user
        if (move === 'U') {
            this.up();
        } else if (move === 'D') {
            this.down();
        } else if (move === 'R') {
            this.right();
        } else {
            this.left();
        }

        // make move and update field
        //check if out of bounds. Doing this by checking x/y values. If they no longer conform to the array of arrays lengths, user has gone out of bounds.
        if (this._xAxis < 0 || this._yAxis < 0 || this._yAxis > numArrays || this._xAxis > numCharactersInArray) {
            console.log('You went out of bounds! You lose!');
            process.exit();
            //detecting if user has landed on a hold
        } else if (this.field[this._yAxis][this._xAxis] === 'O') {
            console.log('You fell in a hole. You lose!');
            process.exit();
            //detecting if user has landed on the winning tile
        } else if (this.field[this._yAxis][this._xAxis] === '^') {
            console.log('You win!');
            process.exit();
            //this updates user position and covers their previous position, showing the user moving on the board
        } else {
            this.field[this._yAxis][this._xAxis] = '*';
            this.field[this._prevYAxis][this._prevXAxis] = '░';
            this._prevYAxis = this._yAxis;
            this._prevXAxis = this._xAxis;
        }
        //console.log used to create space and make board easier to see
        console.log('')
        console.log('')
        this.print();
        this.makeMove();
    }
    //method to check starting position in case you are not starting at index [0][0]
    startingPosition(gameBoard) {
        for (let i = 0; i < gameBoard.length; i++) {
            let startPos = gameBoard[i].findIndex((x) => x === '*');

            if (startPos != -1) {
                this._xAxis = startPos;
                this._yAxis = i;
                this._prevXAxis = startPos;
                this._prevYAxis = i;
            }
        }
    }
}


// const myField = new Field([

//     ['*', '░', '░', '░', 'O', '░'],
//     ['░', 'O', '░', '░', 'O', '░'],
//     ['░', '^', '░', '░', 'O', '░'],
//   ]);


const newGameBoard = Field.generateField(5, 5, 30);

const gameTime = new Field(newGameBoard);


gameTime.playGame();


