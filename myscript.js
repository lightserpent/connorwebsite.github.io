//hewwo Mr.Mein
var xBlocks = [];                                           //human user's block placement in array, sorted with array.sort
var xBlocksUnsorted = [];                                   //human user's block placement in array, not sorted
var oBlocks = [];                                           //block place in array of computer
var turn = ["computer"];                                    //array which only values of "computer" or "player", used to check whose turn it is
var movehistory = document.getElementById("movehistory");   //gets handle to html element that shows move history
var personturn = document.getElementById("personturn");     //gets handle to html element below gameboard that shows whos turn it is
var stratOne = 0;                                           //number that shows which part of the computer's stategy it is on, goes up by one everytime a part of the strategy is completed
var boardusage = 0;                                         //variable used to show how many blocks have been taken by an X or an O
var unusedBlocks = ["[1,1]", "[1,2]", "[1,3]", "[2,1]", "[2,2]", "[2,3]", "[3,1]", "[3,2]", "[3,3]"]; //array of all possible blocks
var countdown = document.getElementById("countdown");       //gets handle to <p> tag that has 3-2-1 countdown at gamestart in it
var counting = 0;                                           //variable that does the countdown for the 3-2-1 countdown at start
var stopThenWin = 0; //one varible used to see if a certain way of winning is possible, used in computerStratOne
function startGame() {                                                  //function that starts first phase of computer movement function (which is computerStratOne();)
    computerStratOne(1);
    document.getElementById("startscreen").style.display = "none";
    countdown.style.display = "inline";                                 //next two lines make startscreen with questions disappear, and make countdown start
    countdown.innerText = 3;            //initial value of countdown
    counting = setInterval(changeCounter, 1000); //makes countdown start
}
function changeCounter() { //function that simply counts down from a number
    if (countdown.innerText <= 1) { //if statement that starts game when countdown reaches zero
        countdown.innerText = "Start!";
        clearInterval(counting); //stops countdown
        countdown.style.display = "none"; //makes countdown disappear
        document.getElementById("game").style.display = "inline"; //makes game appear
        return;
    }
    countdown.innerText -= 1;

}

function caution(row, col) {
    var notice = document.getElementById("caution");
    notice.innerText = "Are you sure about placing an X on Row " + row + " and Col " + col + "?";
    return;
}
function stopCaution() {
    var notice = document.getElementById("caution");
    notice.innerText = "You can't place an X there!";
    return;
}

function placeXSymbol(row, col) { //function called when user clicks on a box to place an X
    if (row > 3 || col > 3) { //if statement that stops function from placing a nonreal block
        return;
    }
    var turnNumber = ((xBlocks.length + oBlocks.length) + 1); //number of the move being done, used in move history window
    var whoseturn = turn[turn.length - 1];
    if (whoseturn === "player") { //checks to make sure it is the player's turn
        document.getElementById("blockimage-" + row + "/" + col).src = "images/x.png"; //places image of x symbol
        boardusage += 1; //adds one to array that records amount of blocks placed
        document.getElementById("block-" + row + "/" + col).onclick = ""; //makes it so a block cant be placed in the same square  multiple times
        document.getElementById("block-" + row + "/" + col).onmouseover = "stopCaution()";
        xBlocks.push("[" + String(row) + "," + String(col) + "]"); //adds block placed to x block array
        xBlocksUnsorted.push("[" + String(row) + "," + String(col) + "]"); //same as above but different array
        unusedBlocks.splice(unusedBlocks.indexOf("[" + String(row) + "," + String(col + "]")), 1); //changes array of unusedBlocks to show that the block is now being used
        xBlocks.sort(); //sorts array for easier understanding
        movehistory.innerText += "Move " + turnNumber + ":" + " Human Placed X at Row " + row + ", Col " + col + "\n"; //connects to html element to show user what move was done
        turn.push("computer"); //gives turn to computer
        personturn.innerText = "It is now the Computer's turn."; //connects to html element that shows whose turn it is
        if (stratOne > 0) { //starts computer's turn/strategy
            computerStratOne(1); //there is a one for a parameter to start the function, not very necesary but easy to use
            stratOne++; //increases computers strategy move by one meaning going to next step in strat
        }
    }
}
function placeOSymbol(row, col) { //function works basically same as placeXSymbol but for computer's moves instead
    if (row > 3 || col > 3) {
        return;
    }
    var whoseturn = turn[turn.length - 1];
    var turnNumber = ((xBlocks.length + oBlocks.length) + 1);
    if (whoseturn === "computer") {
        if (xBlocks.includes("[" + String(row) + "," + String(col) + "]") === false && oBlocks.includes("[" + String(row) + "," + String(col) + "]") === false) {
            document.getElementById("blockimage-" + row + "/" + col).src = "images/o.png";
            personturn.innerText = "It is now, your turn.";
            document.getElementById("block-" + row + "/" + col).onclick = "";
            document.getElementById("block-" +row+"/"+col).onmouseover = "stopCaution()";
            oBlocks.push(String("[" + row + "," + col + "]"));
            unusedBlocks.splice(unusedBlocks.indexOf("[" + String(row) + "," + String(col) + "]"), 1);
            oBlocks.sort();
            movehistory.innerText += "Move " + turnNumber + ":" + " Robot Placed O at Row " + row + ", Col " + col + "\n";
            boardusage += 1;
            turn.push("player");
        }
    }
}

//before restart(), board is filled with a while loop and randomPlaceOSymbol(),so the user doesn't see how the game ended, so they can not improve, 
//if you want to see how the game ended, delete all the while loops that occur before each "setTimeout(restart,100)" function. they occur before every restart(), instead of being inside the restart() because that seems to call the alert before the while loop of randomPlaceOSymbol
function restart() { //function called when outcome of game is computer win, or player loss/draw, or somehow player win
    var restart = confirm("The outcome of the game is irreversible, the computer is bored, Try Again?"); //makes alert, if player confirms, it will refresh the page
    if (restart === true) {
        location.reload();
    }
    return;
}

function randomPlaceOSymbol() { //mostly unused, but self-explanatory function that will randomly place a O symbol, its not in use but it was useful when making the game
    turn.push("computer");
    var x = Math.floor(Math.random() * (unusedBlocks.length));
    var row = unusedBlocks[x].substring(1, 2);
    var col = unusedBlocks[x].substring(3, 4);
    placeOSymbol(row, col);
    var i = 0;
    while (i < unusedBlocks.length) {
        if (unusedBlocks[i] === String("[" + row + "," + col + "]")) {
            xBlocks.splice(i, 1);
            return;
        }
        i++;
    }
    turn.push("player");
    return;
}

function computerTurn() { //another tool during development, used to make computer do its next move
    turn.push("computer");
    personturn.innerText = "It is now the Computer's turn";
    computerStratOne(1);
}

function computerStratOne(n) { //main computer strategy function, not all of these if statements will be used, but they are stop every condition, my original way of doing it with like 8 "check[]Then[]" functions are at the bottom
    var whoseturn = turn[turn.length - 1];
    if (boardusage === 8) {
        randomPlaceOSymbol();
    }
    if (n === 1 && stratOne === 0) { //first move of computer strat, always done
        turn.push("computer");
        placeOSymbol(1, 3); //computer always places O in top right of board
        turn.push("player");
        stratOne++;
        return;
    }
    if (xBlocks.length > 0 || oBlocks.length > 0) { //second move of computer and onward
        if (stratOne === 1 && whoseturn === "computer") {
            if (xBlocks.includes("[3,1]") === true) { //computer will always place second block on bottom left unless user has done that
                placeOSymbol(3, 3); //if user placed block on bottom left, computer will go bottom right
                return;
            }
            placeOSymbol(3, 1);
            return;
        }
        if (stratOne === 2 && whoseturn === "computer") { //one of the following possibilities will always work
            checkRowThenFixColumn();
            if (oBlocks.includes("[3,1]") === true && xBlocks.includes("[2,2]") === false) { //if the computer has blocks in the top right and bottom left corners, computer will win with middle block if user does not have one there
                personturn.innerText = "Game Over!";
                while (boardusage < 9) {
                    randomPlaceOSymbol();
                }
                setTimeout(restart, 100); //caling function to start new game
                return;
            }
            if (oBlocks.includes("[3,3]") === true && xBlocks.includes("[2,3]") === false) { //if the computer had to place a block in the bottom right as its second move, it will win by fill column on far right if player doesnt have one there
                personturn.innerText = "Game Over!";
                while (boardusage < 9) {
                    randomPlaceOSymbol();
                }
                setTimeout(restart, 100);
                return;
            }
            if (xBlocks.includes("[3,1]") === true || xBlocks.includes("[3,3]") === true) {//if computer did get to place block in bottom left corner, it will do the following
                placeOSymbol(1, 1); //it will either place a block in the top left making the player not able to win
                if (oBlocks.includes("[3,3]") === true || oBlocks.includes("[1,1]") === true) { //if statement to make sure computer can now win successfully
                    personturn.innerText = "Game Over!";
                    while (boardusage < 9) {
                        randomPlaceOSymbol();
                    }
                    setTimeout(restart, 100);
                    return;
                }
                return;
            }
            if (xBlocks.includes("[2,1]") === true || xBlocks.includes("[2,3]") === true) {
                if (xBlocks.includes("[2,1]") === true) {
                    placeOSymbol(2, 3);
                    stopThenWin++;
                    while (boardusage < 9) {
                        randomPlaceOSymbol();
                    }
                    setTimeout(restart, 100);
                    return;
                }
                if (xBlocks.includes("[2,3]") === true) {
                    placeOSymbol(2, 1);
                    stopThenWin++;
                    return;
                }

            }
            placeOSymbol(3, 3); //if everyother possibility fails, it will place block in bottom right

            return;
        }
        if (stratOne === 3 && whoseturn === "computer") { //third part of the strat
            if (oBlocks.includes(1, 1) === false) {
                if (xBlocks.includes(2, 2) === true && xBlocks.includes(3, 3) === true) { //stops player if they are about to win on left right diagonal
                    placeOSymbol(1, 1);
                    return;
                }

            }
            checkColThenWin(); //checks columns to see if player will win, doesn't seem to work in everys scenarion but works here 
            if (stopThenWin > 0) {
                placeOSymbol(1, 1);
                while (boardusage < 9) {
                    randomPlaceOSymbol();
                }
                setTimeout(restart, 100);
            }
            if (oBlocks.includes("[3,3]") === true || oBlocks.includes("[1,1]") === true) { //at this point in the computer strat, it should win if either of these are true
                personturn.innerText = "Game Over!";
                while (boardusage < 9) {
                    randomPlaceOSymbol();
                }
                setTimeout(restart, 100);
                return;
                placeOSymbol(1, 1);
            }
            placeOSymbol(3, 3);
            while (boardusage < 9) {
                randomPlaceOSymbol();
            }
            setTimeout(restart, 100);
        }
        if (stratOne === 4 && whoseturn === "computer") { //strat four of the computer
            if (stopThenWin > 0) {
                placeOSymbol(1, 1); //connected to the win sceario that increased stopThenWin by one
                return;
            }
            if (oBlocks.includes(1, 1) === false) { //stops
                if (xBlocks.includes(2, 2) === true && xBlocks.includes(3, 3) === true) {
                    placeOSymbol(1, 1);
                    return;
                }

            }
            return;
        }

    }
    if (stratOne === 5 && whoseturn === "computer") {
        randomPlaceOSymbol(); //fills up board if somehow the game gets to here
    }
    return;
}





//everything after this point is not all used. I am still including it because I spent a lot of effort on the "check[]ThenFix[]" functions and the "check[]ThenWin" functions
//the "check[]ThenFix[] functions were used to check if the player is about to win and the computer would stop them, If I had time, I would have added these in and allowed the human to start the game
//the "check[]ThenWin[]" functions are the older way the computer checked to see if it could win, however they had some problems where
//while they all worked independently, if I had to call multiple of them at once, they would not place nice
//I also discovered  array.includes() and it basically negated the 6+ hours I spent on just these functions
// while they seem to be simple functions, the mental thought into figuring the block checking process ROW BY ROW, COL BY COL, was annoying and took sooooooooooooo long
//these are all nice to have and fiddle with, so I want to keep them here but most don't do anything for the project right now

//you dont have to read through our anything (i wouldn't) i just want u to see all the effort I put in :D
//I do I do use one or two of them though, most of them are developer tools
//this was fun tho k bai :DDDDDDd

//function computerAutoActions() { 
//    if (oBlocks.length > 1) {
//        checkLeftRightDiagonalThenWin();
//        checkRightLeftDiagonalThenWin();
//        checkColThenWin();
//        checkRowThenWin();
//
//    }
//    if (xBlocks.length > 1) {
//        checkRowThenFixLeftRightDiagonal();
//        checkRowThenFixRightLeftDiagonal();
//        checkRowThenFixColumn();          
//        checkRowThenFixRow();
//    }
//}
//
//function computerWinActions() {
//    checkLeftRightDiagonalThenWin();
//    checkRightLeftDiagonalThenWin();
//    checkRowThenWin();
//    checkColThenWin();
//}
//
function computerStopActions() { //just used to call all the functions that stop a player from winning
    checkRowThenFixLeftRightDiagonal();
    checkRowThenFixRightLeftDiagonal();
    checkRowThenFixColumn();
    checkRowThenFixRow();
}
//
function checkRowThenFixColumn() { //checks if player can win in a column
    var whoseturn = turn[turn.length - 1];
    if (whoseturn === "computer") {
        var i = 0;
        var winLine = 0;
        var columnCheck = 1;
        var rowCheck = 1;
        var collevel = 1;
        var rowlevel = 0;
        while (i < xBlocks.length) {
            while (columnCheck < 4) {
                while (rowCheck < 4) {
                    if (xBlocks[i] === "[" + String(rowCheck) + "," + String(columnCheck) + "]") {
                        winLine += 1;
                        rowlevel += rowCheck;
                        rowCheck = 1;
                        i++;
                        if (winLine > 1 && i > 1) {
                            var x = 6 - rowlevel;
                            var y = 6 - collevel;
                            placeOSymbol(x, collevel);
                            turn.push("player");
                            return;
                        }
                    }
                    rowCheck++;
                }
                collevel += 1;
                winLine = 0;
                rowCheck = 1;
                columnCheck++;
            }
            i++;
        }
    }
    return;
}
//function checkRowThenFixRow() {
//    var whoseturn = turn[turn.length - 1];
//    if (whoseturn === "computer") {
//        var i = 0;
//        var winLine = 0;
//        var columnCheck = 1;
//        var rowCheck = 1;
//        var collevel = 0;
//        var rowlevel = 1;
//        while (i < xBlocks.length) {
//            while (rowCheck < 4) {
//                while (columnCheck < 4) {
//                    if (xBlocks[i] === "[" + String(rowCheck) + "," + String(columnCheck) + "]") {
//                        winLine += 1;
//                        collevel += columnCheck;
//                        columnCheck = 1;
//                        i++;
//                        if (winLine > 1 && i > 1) {
//                            var x = 6 - collevel;
//                            placeOSymbol(rowlevel, x);
//                            turn.push("player");
//                            return;
//                        }
//                    }
//                    columnCheck++;
//                }
//                rowlevel += 1;
//                winLine = 1;
//                columnCheck = 1;
//                rowCheck++;
//            }
//            i++;
//        }
//    }
//    return;
//}
function checkRowThenFixLeftRightDiagonal() { //checks if a player can win from top left to bottom right
    var whoseturn = turn[turn.length - 1];
    if (whoseturn === "computer") {
        var i = 0;
        var leftRightDiagonalPos = 1;
        var winLeftRightDiagonal = 0;
        var leftRightDiagonalLevel = 0;
        while (i < xBlocks.length) {
            while (leftRightDiagonalPos < 4) {
                if (xBlocks[i] === "[" + String(leftRightDiagonalPos) + "," + String(leftRightDiagonalPos) + "]") {
                    leftRightDiagonalLevel += leftRightDiagonalPos;
                    winLeftRightDiagonal += 1;
                    i++;
                    if (winLeftRightDiagonal > 1 && i > 1) {
                        var x = 6 - leftRightDiagonalLevel;
                        placeOSymbol(x, x);
                        turn.push("player");
                        return;
                    }
                }
                leftRightDiagonalPos++;
            }
            i++;
        }
    }
}
//
//function checkRowThenFixRightLeftDiagonal() {
//    var whoseturn = turn[turn.length - 1];
//    if (whoseturn === "computer") {
//        var rightLeftDiagonalRow = 1;
//        var rightLeftDiagonalCol = 3;
//        var winRightLeftDiagonal = 0;
//        var rightLeftDiagonalLevelRow = 0;
//        var rightLeftDiagonalLevelCol = 0;
//        var i = 0;
//        while (i < xBlocks.length) {
//            while (rightLeftDiagonalRow < 4 && rightLeftDiagonalCol > 0) {
//                if (xBlocks[i] === "[" + String(rightLeftDiagonalRow) + "," + String(rightLeftDiagonalCol) + "]") {
//                    rightLeftDiagonalLevelRow += rightLeftDiagonalRow;
//                    rightLeftDiagonalLevelCol += rightLeftDiagonalCol;
//                    rightLeftDiagonalRow = 1;
//                    rightLeftDiagonalCol = 3;
//                    winRightLeftDiagonal++;
//                    i++;
//                    if (winRightLeftDiagonal > 1 && i > 1) {
//                        var correctRow = 6 - rightLeftDiagonalLevelRow;
//                        var correctCol = 6 - rightLeftDiagonalLevelCol;
//                        placeOSymbol(correctRow, correctCol);
//                        turn.push("player");
//                        return;
//                    }
//                }
//                rightLeftDiagonalRow++;
//                ;
//                rightLeftDiagonalCol -= 1;
//            }
//            i++;
//        }
//    }
//}
//
function checkColThenWin() { //computer checks if it can win in a column
    var whoseturn = turn[turn.length - 1];
    if (whoseturn === "computer") {
        var i = 0;
        var winLine = 0;
        var columnCheck = 1;
        var rowCheck = 1;
        var collevel = 1;
        var rowlevel = 0;
        console.log("about to enter while loop");
        while (i < oBlocks.length) {
            while (columnCheck < 4) {
                while (rowCheck < 4) {
                    if (oBlocks[i] === "[" + String(rowCheck) + "," + String(columnCheck) + "]") {
                        winLine += 1;
                        rowlevel += rowCheck;
                        console.log("collevel is now " + collevel + "when col check is " + columnCheck);
                        rowCheck = 1;
                        i++;
                        if (winLine > 1 && i > 1) {
                            console.log("entered win statement for getting col win");
                            var x = 6 - rowlevel;
                            console.log(rowlevel + "," + x);
                            placeOSymbol(x, collevel);
//                          setTimeout(restart, 500);
                            return;
                        }
                    }
                    rowCheck++;
                }
                collevel += 1;
                winLine = 1;
                rowCheck = 1;
                columnCheck++;
            }
            i++;
        }
    }
    return;
}
//
//function checkRowThenWin() {
//    var whoseturn = turn[turn.length - 1];
//    if (whoseturn === "computer") {
//        var i = 0;
//        var winLine = 0;
//        var columnCheck = 1;
//        var rowCheck = 1;
//        var collevel = 0;
//        var rowlevel = 1;
//        console.log("about to enter while loop");
//        while (i < oBlocks.length) {
//            while (rowCheck < 4) {
//                while (columnCheck < 4) {
//                    if (oBlocks[i] === "[" + String(rowCheck) + "," + String(columnCheck) + "]") { 
//                        winLine += 1;
//                        collevel += columnCheck;
//                        console.log("collevel is now " + collevel + "when col check is " + columnCheck);
//                        columnCheck = 1;
//                        i++;
//                        if (winLine > 1 && i > 1) {
//                            console.log("entered win statement for getting col win");
//                            var x = 6 - collevel;
//                            console.log(rowlevel + "," + x);
//                            placeOSymbol(rowlevel, x);
////                          setTimeout(restart, 500);
//                            return;
//                        }
//                    }
//                    columnCheck++;
//                }
//                rowlevel += 1;
//                winLine = 1;
//                columnCheck = 1;
//                rowCheck++;
//            }
//            i++;
//        }
//    }
//    return;
//}
//
//function checkLeftRightDiagonalThenWin() {
//    var whoseturn = turn[turn.length - 1];
//    if (whoseturn === "computer") {
//        var i = 0;
//        var leftRightDiagonalPos = 1;
//        var winLeftRightDiagonal = 0;
//        var leftRightDiagonalLevel = 0;
//        while (i < oBlocks.length) {
//            while (leftRightDiagonalPos < 4) {
//                if (oBlocks[i] === "[" + String(leftRightDiagonalPos) + "," + String(leftRightDiagonalPos) + "]") {
//                    leftRightDiagonalLevel += leftRightDiagonalPos;
//                    winLeftRightDiagonal += 1;
//                    i++;
//                    if (winLeftRightDiagonal > 1 && i > 1) {
////                        var x = 6 - leftRightDiagonalLevel;
////                        placeOSymbol(x, x);
//                        setTimeout(restart, 500);
//                        return;
//                    }
//                }
//                leftRightDiagonalPos++;
//            }
//            i++;
//        }
//    }
//}
//
//function checkRightLeftDiagonalThenWin() {
//    var whoseturn = turn[turn.length - 1];
//    if (whoseturn === "computer") {
//        var rightLeftDiagonalRow = 1;
//        var rightLeftDiagonalCol = 3;
//        var winRightLeftDiagonal = 0;
//        var rightLeftDiagonalLevelRow = 0;
//        var rightLeftDiagonalLevelCol = 0;
//        var i = 0;
//        while (i < oBlocks.length) {
//            while (rightLeftDiagonalRow < 4 && rightLeftDiagonalCol > 0) {
//                if (oBlocks[i] === "[" + String(rightLeftDiagonalRow) + "," + String(rightLeftDiagonalCol) + "]") {
//                    rightLeftDiagonalLevelRow += rightLeftDiagonalRow;
//                    rightLeftDiagonalLevelCol += rightLeftDiagonalCol;
//                    rightLeftDiagonalRow = 1;
//                    rightLeftDiagonalCol = 3;
//                    winRightLeftDiagonal++;
//                    i++;
//                    if (winRightLeftDiagonal > 1 && i > 1) {
//                        var correctRow = 6 - rightLeftDiagonalLevelRow;
//                        var correctCol = 6 - rightLeftDiagonalLevelCol;
//                        placeOSymbol(correctRow, correctCol);
////                      setTimeout(restart, 500);
//                        return;
//                    }
//                }
//                rightLeftDiagonalRow++;
//                rightLeftDiagonalCol -= 1;
//            }
//            i++;
//        }
//    }
//}


    