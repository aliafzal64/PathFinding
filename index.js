const gridH = 9;
const gridW = 19;

function createTable(){
    height = gridH;
    width = gridW;
    console.log("Creating Table!");
    let matrix = {};
    var i;
    var j;
    $("#matrix").html("");
    for(i = 0; i < height; i++){
        $("#matrix").append("<tr>");
        for(j = 0; j < width; j++){
            let value = "[" + i + "," + j + "]";
            if(i == 0 && j ==0 ){
                matrix[value] = "start";
                $("#matrix").append("<td><div class=\"start\" id=\"" + i + "-" + j +"\">[" + i + "," + j + "]</div></td>");
            }else if( i == height-1 && j == width-1){
                matrix[value] = "end";
                $("#matrix").append("<td><div class=\"end\" id=\"" + i + "-" + j +"\">[" + i + "," + j + "]</div></td>");
            }else{
                matrix[value] = "0";
                $("#matrix").append("<td><div class=\"content\" id=\"" + i + "-" + j +"\">[" + i + "," + j + "]</div></td>");
            }
        }
        $("#matrix").append("</tr>");
    }
    return matrix;
}

function findPath(matrix, w,h){
    let start = {}
    let endNode = {}
    var grid = new Array(h);
    for(var i=0;i <h; i++){
        grid[i] = new Array(w);
        for(var j =0; j < w; j++){

            var cell = {
                iswall: 0,
                f: 0,
                g: 0,
                h: 0,
                parent: null,
                pos: {x:i,y:j}
            };
            let pos = "[" + i + "," + j + "]";

            if(matrix[pos] == "start"){
                start = {x:i, y:j};
                console.log(start)
            }else if(matrix[pos] == "end"){
                endNode = {x:i, y:j};
                console.log(end)
            }

            if(matrix[pos] == 1){
                cell.isWall = 1;
            }else{
                cell.isWall = 0;
            }

            grid[i][j] = cell;
        }
    }

    var openList = [];
    var closedList = [];

    var startNode = grid[start.x][start.y];
    var end = grid[endNode.x][endNode.y]
    
    openList.push(startNode);

    while(openList.length > 0){
        var lowestCost = 0;

        for(var i=0; i< openList.length; i++){
            if(openList[i].f < openList[lowestCost].f){
                lowestCost = i;
            }
        }

        var currentNode = openList[lowestCost];

        if(currentNode.pos == end.pos){
            var current = currentNode;
            var pathNodes = [];
            while(current.parent) {
                pathNodes.push(current);
                current = current.parent;
            }

            return pathNodes.reverse();
        }
        
        openList.splice(openList.indexOf(currentNode),1);
        closedList.push(currentNode);

        var neighbours = getNeighbours(grid, currentNode.pos);
        
        for(var i = 0; i < neighbours.length; i++){
            var neighbour = neighbours[i];

            if(closedList.indexOf(neighbour) != -1 || neighbour.isWall){
                continue;
            }

            var gScore = currentNode.g + 1;
            var gScoreIsBest = false;

            if(openList.indexOf(neighbour) == -1){
                gScoreIsBest = true;
                console.log(neighbour.pos)
                neighbour.h = distance(neighbour.pos, end.pos);
                openList.push(neighbour);
            }else if(gScore < neighbour.g){
                gScoreIsBest = true;
            }

            if(gScoreIsBest){
                neighbour.parent = currentNode;
                neighbour.g = gScore;
                neighbour.f = neighbour.g + neighbour.h;
            }
        }
     }

    return [];
}

function distance(pos1, pos2){
    return Math.sqrt((pos1.x -pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y));
}

function getNeighbours(grid, posNode){
    var tab = [];
    var x = posNode.x;
    var y = posNode.y;

    if(grid[x-1] && grid[x-1][y]) {
        tab.push(grid[x-1][y]);
    }
    if(grid[x+1] && grid[x+1][y]) {
        tab.push(grid[x+1][y]);
    }
    if(grid[x][y-1] && grid[x][y-1]) {
        tab.push(grid[x][y-1]);
    }
    if(grid[x][y+1] && grid[x][y+1]) {
        tab.push(grid[x][y+1]);
    }

    return tab;
}

function createGraph(matrix){
    let width = gridW;
    let height = gridH;
    let path = findPath(matrix, width, height);
    if(path[0] == undefined){
        alert("No Path Available.")
    }
    console.log(path)
    for(var x in path){
        $("#" + path[x].pos.x + "-" + path[x].pos.y).addClass("path")
    }
}

$(document).ready(function(){
    matrix = createTable();
    $("td").mouseover(function(e) {
        $(this).css("cursor", "pointer");
    });

    $("td").click(function(e) {
        var clickedCell= $(e.target).closest("td");
        clickedCell.addClass("highlight");
        console.log(clickedCell.text())
        if(clickedCell.text() == "[0,0]"){
        }else if(clickedCell.text() == "[" + (width - 1)  + "," + (height -1) + "]"){
            
        }else{
            matrix[clickedCell.text()] = "1";
        }
    });

    $("#reset").click(function(){
        matrix = createTable();
        graph = []
        $("td").mouseover(function(e) {
            $(this).css("cursor", "pointer");
        });
    
        $("td").click(function(e) {
            var clickedCell= $(e.target).closest("td");
            clickedCell.addClass("highlight");
            console.log(clickedCell.text())
            matrix[clickedCell.text()] = "1";
        });
    });

    $("#bfs").click(function(e) {
        createGraph(matrix);
    })
;
});