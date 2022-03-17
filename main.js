mazeWidth = 15;
mazeHeight = 15;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createBlankMaze() {
    let mazeContainer = document.getElementById("maze_container")
    var rowIndex, colIndex;
    var table = document.createElement("table");
    table.setAttribute("cellspacing", 0)
    var tbody = document.createElement("tbody");
    for (rowIndex = 1; rowIndex <= mazeHeight; rowIndex++) {
        var row = document.createElement("tr");
        for (colIndex = 1; colIndex <= mazeWidth; colIndex++) {
            var col = document.createElement("td");
            if (rowIndex == 1 && colIndex == 1 ) {
                col.style.backgroundColor = "rgb(244,0,0)";
                col.setAttribute("type", "start");
            } else if (rowIndex == mazeHeight && colIndex == mazeWidth) {
                col.style.backgroundColor = "rgb(0,244,0)";
                col.setAttribute("type", "finish");
            } else {
                col.style.backgroundColor = "rgb(255,255,255)";
            }
            col.setAttribute("id", "cell_" + rowIndex + "_" + colIndex);
            row.appendChild(col);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    mazeContainer.appendChild(table);
}

async function naivePath() {
    var currentCell = document.getElementById("cell_1_1");
    var rowIndex = 1;
    var colIndex = 1;
    var lastCells = [];
    var loopFuse = 0;
    var maxLoops = 10000;

    var validExits = ["right", "bottom", "left", "top"];
    var remainingExits = {
        "right": mazeWidth - 1, 
        "bottom": mazeHeight - 1, 
        "left": 0, 
        "top": 0
    };
    for (loop = 0; loop < (mazeWidth * mazeHeight - 2); loop++) {
        loopFuse++;
        await sleep(100)

        if (loopFuse >= maxLoops) {break;}
        var nextExits = [];
        for (i = 0; i < validExits.length; i++) {
            switch(validExits[i]) {
                case "right":
                    nextPossibleCell = document.getElementById("cell_" + rowIndex + "_" + (colIndex + 1));
                    break;
                case "left":
                    nextPossibleCell = document.getElementById("cell_" + rowIndex + "_" + (colIndex - 1));
                    break;
                case "bottom":
                    nextPossibleCell = document.getElementById("cell_" + (rowIndex + 1) + "_" + colIndex);
                    break;
                case "top":
                    nextPossibleCell = document.getElementById("cell_" + (rowIndex - 1) + "_" + colIndex);
                    break;
            } // switch
            if (nextPossibleCell != null && nextPossibleCell.style.backgroundColor != "rgb(240, 0, 0)") {      
                for (t = 0; t < remainingExits[validExits[i]]; t++) {
                    nextExits.push(validExits[i]);
                }
            } // if
        }
        if (nextExits.length == 0) {
            lastCells.splice(lastCells.length - 1, 1);
            rowIndex = lastCells[lastCells.length - 1][0];
            colIndex = lastCells[lastCells.length - 1][1];   
            currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);
           continue;
        }          
        exitIndex = Math.floor(Math.random() * nextExits.length);
        exit = nextExits[exitIndex];
        currentCell.style["border-"+exit] = "none";
        switch(exit) {
            case "right":
              colIndex = colIndex + 1; 
              remainingExits.left++;
              remainingExits.right--;
              break;
            case "bottom":
              rowIndex = rowIndex + 1;
              remainingExits.top++;
              remainingExits.bottom--;
              break;
            case "left":
              colIndex = colIndex - 1;
              remainingExits.left--;
              remainingExits.right++;
              break;
            case "top":
             rowIndex = rowIndex - 1;
             remainingExits.top--;
             remainingExits.bottom++;
             break;
        }
        if (rowIndex == mazeHeight && colIndex == mazeWidth) {
            break;
        }
        currentCell.style.backgroundColor = "#f00000";
        currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);
        currentCell.style.backgroundColor = "#808080";
        switch(exit) {
            case "right":
              currentCell.style["border-left"] = "none";
              break;
            case "bottom":
              currentCell.style["border-top"] = "none";
              break;
            case "left":
                currentCell.style["border-right"] = "none";
                break;
            case "top":
                currentCell.style["border-bottom"] = "none";
                break;
          }
        lastCells.push([rowIndex, colIndex]);
    }
};

document.addEventListener("DOMContentLoaded", function(event) { 
    createBlankMaze();
    naivePath();
});