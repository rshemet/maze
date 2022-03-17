mazeWidth = 100;
mazeHeight = mazeWidth;
tableSize = '80vh'
sleepPeriod = 20 / mazeHeight

startCellConfig = {
    'x': randCellCoord(mazeHeight / 2), 
    'y': randCellCoord(mazeWidth / 2)
}
finishCellConfig = {
    'x': randCellCoord(mazeHeight / 2) + Math.floor(mazeHeight / 2),
    'y': randCellCoord(mazeHeight / 2) + Math.floor(mazeHeight / 2),
}

var cells = {}
var solution = []
pathBuilt = false

cellSize = Math.floor(80 / mazeHeight).toString() + '%'

colors = {
    'visited': "#ffffff",
    'start': '#ffb300',
    'finish': "#059c20",
    'solution': '#a2d5f5',
    'default': '#bfbfbf',
    'current': '#7904c7', // unused atm
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function randCellCoord(limit) {
    return (Math.floor(Math.random() * (limit - 1)) + 1);
}

function displayCurrentCell(cell, i){
    div = document.getElementById('active-cell-label')
    div.innerHTML = cell.x + '_' + cell.y + ' move ' + i
}

class Cell {
    constructor(x, y, element){
        this.x = x;
        this.y = y;
        this.element = element;
        this.styleCell()
        this.isVisited = false
    }

    styleCell(){
        this.element.style.height = cellSize;
        this.element.style.width = cellSize;
        this.element.setAttribute("id", "cell_" + rowIndex + "_" + colIndex);
    }

    removeBorder(border){
        this.element.style["border-"+border] = "none";
    }

    set cellColor(color){
        this.element.style.backgroundColor = color
    }

    set cellType(type){
        this.element.setAttribute("type", type);
    }

    get cellType(){
        return this.element.getAttribute("type");
    }

    adjacentCell(position){
        switch(position){
            case 'down':
                return cells[this.x + '_' + (this.y + 1)]
            case 'up':
                return cells[this.x + '_' + (this.y - 1)]
            case 'left':
                return cells[(this.x - 1) + '_' + this.y]
            case 'right':
                return cells[(this.x + 1) + '_' + this.y]
        }
    }

    visit(previousCell) {
        this.isVisited = true;
        if(this.cellType !== 'finish' && this.cellType !== 'start'){
            this.cellColor = colors.visited;
        }
        if(previousCell.x === this.x && previousCell.y + 1=== this.y){
            var thisBorder = 'top';
            var previousBorder = 'bottom';
        }else if(previousCell.y === this.y && previousCell.x + 1=== this.x){
            var thisBorder = 'left';
            var previousBorder = 'right';
        }else if(previousCell.x === this.x && previousCell.y - 1=== this.y){
            var thisBorder = 'bottom';
            var previousBorder = 'top';
        }else if(previousCell.y === this.y && previousCell.x - 1=== this.x){
            var thisBorder = 'right';
            var previousBorder = 'left';
        }
        this.removeBorder(thisBorder)
        previousCell.removeBorder(previousBorder)
    }
}

function highlightSolution(path){
    for(i=0; i<path.length; i++){
        cell = path[i]
        if(cell.cellType !== 'start' && cell.cellType !== 'finish'){cell.cellColor = colors.solution}
    }
}

function buildGrid(){
    var container = document.getElementById('maze_container')
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    table.setAttribute("cellspacing", 0)
    table.style.height = tableSize
    table.style.width = tableSize

    for (colIndex = 1; colIndex <= mazeWidth; colIndex++) {
        var row = document.createElement("tr");
            for (rowIndex = 1; rowIndex <= mazeHeight; rowIndex++) {
            var col = document.createElement("td");
            // col.innerHTML = rowIndex + '_' + colIndex;
            col.style = "font-size: 10px;"
            // !! Here we define the new cell class instance
            cell = new Cell(rowIndex, colIndex, col)
            cells[rowIndex + '_' + colIndex] = cell
            if (rowIndex == startCellConfig.x && colIndex == startCellConfig.y ) {
                // start cell
                cell.cellColor = colors.start
                cell.cellType = 'start'
                cell.isVisited = true
            } else if (rowIndex == finishCellConfig.x && colIndex == finishCellConfig.y) {
                // finish cell
                cell.cellColor = colors.finish
                cell.cellType = 'finish'
            } else {
                // all others
                col.style.backgroundColor = colors.default;
            }
            row.appendChild(col);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    container.appendChild(table);
}

async function generateMaze() {
    let x = startCellConfig.x
    let y = startCellConfig.y
    let j = 0
    let fuse = 0
    let fuseLimit = Math.pow(mazeHeight, 3)

    var path = []
    var allMoves = ['right', 'down', 'up', 'left']
    var currentCell = cells[x + '_' + y]

    // while (currentCell.cellType !== 'finish'){
    while (j < ((mazeWidth * mazeHeight) - 1)) {
        if(fuse>fuseLimit){break;}
        await sleep(sleepPeriod)
        var availableMoves = []
        for (i = 0; i < allMoves.length; i++){
            let tempMove = allMoves[i]
            adjacentCell = currentCell.adjacentCell(tempMove)
            if(adjacentCell){ // does cell exist?
                if (!adjacentCell.isVisited){
                    availableMoves.push(tempMove)
                }
            }
        }
        if(availableMoves.length === 0 || currentCell.cellType === 'finish'){
            path.splice(path.length - 1, 1)
            currentCell = path[path.length - 1]
            previousCell = path[path.length - 2]
            // console.log('Dead end at ', x, '-', y, ': current and previous now at ', currentCell, previousCell)
            x = currentCell.x
            y = currentCell.y
            displayCurrentCell(currentCell, j)
            continue
        }
        var move = choose(availableMoves)
        var previousCell = cells[x + '_' + y]
        switch(move){
            case 'right':
                x++;
                break;
            case 'down':
                y++;
                break;
            case 'left':
                x--;
                break;
            case 'up':
                y--;
                break;
        }
        currentCell = cells[x + '_' + y]
        displayCurrentCell(cells[x + '_' + y], j)
        currentCell.visit(previousCell=previousCell)
        if(currentCell.cellType === 'finish'){pathBuilt=true, solution=path.slice()}
        path.push(currentCell)
        j++
        fuse ++
    }
    pathBuilt = true
}

document.getElementById('show-solution').addEventListener('click', function(e){
    if(pathBuilt){highlightSolution(solution)}
})

document.addEventListener("DOMContentLoaded", function(event) { 
    console.log('loaded!')
    console.log('start', startCellConfig)
    console.log('finish', finishCellConfig)
    buildGrid()
    generateMaze()
});