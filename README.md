#Find Your Hat - Codecademy Project in Back-End Engineering Course

##Description

This project is part of the Codecademy Back-End Engineering career path. It involves using Javascript and Node in order to create a maze game that can be run with node. 

The project helped me understand the process of building, which involved a lot of problem solving, Googling, and debugging! 

###How to Use

Find Your Hat is built to run on Node. It takes in a 2d array, which it used to play the game. There is also a static method, generateField(width, height, percentHoles), which will generate a field for you. This takes in the width of the board you want, the height, and the max percentage of holes you want on the board (if you land on a hole, you lose).

- Create a new instance of the static method generateField. Example: * *const newGameBoard = Field.generateField(5, 5, 30);* *
- Create a new instance of the class Field, passing in the variable storing the field you generated. Example: * *const gameTime = new Field(newGameBoard);* *
- Run the playGame method. Example: * * gameTime.playGame(); * *