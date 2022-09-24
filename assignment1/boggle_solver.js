/**
 * Rachel Reese
 * @02966382
 */

class graph { 
    constructor() { 
      this.adjDict = {};
    }
    addNode(nodeValue, nodeNumber, adjList) { 
        this.adjDict[nodeNumber] = [nodeValue, adjList];
    }
}

function gridToGraph(grid) { 
    let gridGraph = new graph;
    let numbersGrid = []
    rows = grid.length;
    columns = grid[0].length;

    if (rows == 0 || columns == 0) { 
      return "empty";
    }
    counter = 1;
    for (row in grid) { 
        newRow = [];
        for (column in grid[0]) { 
            newRow.push(counter);
            counter += 1;
        }
        numbersGrid.push(newRow);

    }

    if (rows != columns) { 
        return;
    }
    let currentNodeNumber = 1;
    for (let m = 0; m < rows; m++) { 
        for (let n = 0; n < columns ; n++) {
            let currentAdjList = [];
            var gridLocations =  [[m-1, n], [m+1, n], [m, n-1], [m, n+1], [m-1, n-1], [m-1, n+1], [m+1, n-1], [m+1, n+1]];
            for (area in gridLocations) { 
                try { 
                    if (typeof(numbersGrid[gridLocations[area][0]][gridLocations[area][1]]) != 'undefined') { 
                        currentAdjList.push(numbersGrid[gridLocations[area][0]][gridLocations[area][1]]);
                    }
          
                } catch { 
                  continue;
                }
            }
            gridGraph.addNode(grid[m][n].toLowerCase(), currentNodeNumber, currentAdjList);
            currentNodeNumber++;
        }
    }
    return gridGraph;
}

function findWord(graph, word, position, currentNode, usedNodes = [], branchNodes = [], branchposition = -1, rootNode) {
    let currentLetter = graph.adjDict[currentNode][0];
    let nextLetter = word[position + 1];
    let validNodes;
    if (currentLetter.length > 1) { 
        nextLetter = word[position+2];
    }
    if (nextLetter == 'q' || nextLetter == 's') { 
        nextLetter = word.slice(position+1, position+3);
    }
    
    if (branchNodes.length && position == branchposition) {
        validNodes = [branchNodes.pop()];
    }
    else { 
        validNodes = Object.keys(graph.adjDict).filter(node => graph.adjDict[node][0] == nextLetter);
    }

    if (validNodes.length) { 
      console.log(currentLetter + "   " + nextLetter);
      console.log(validNodes);
      console.log(graph.adjDict[currentNode][1]);
        if (validNodes.length > 1) { 
            if (branchposition == -1) { 
              rootNode = currentNode;
            }
            if (usedNodes.some(node => node === validNodes[0]))
            branchRoot = currentNode;
            branchNodes = validNodes.slice(1);
            branchposition = position;

        }

        if (graph.adjDict[currentNode][1].some(number => number == validNodes[0]) && !(usedNodes.some(node => node === validNodes[0])) || branchNodes[0] == validNodes[0]) {
            if (position == word.length - 2) { 
              return word;
            }
            if (nextLetter.length > 1 && position == word.length - 3) { 
                return word;
            }
            else { 
                if (currentLetter.length > 1) { 
                    position += 1;
                }
                usedNodes.push(currentNode);
                return findWord(graph, word, position + 1, validNodes[0], usedNodes, branchNodes, branchposition, rootNode);
            }
        }
        else if (branchNodes.length) {  
            last = usedNodes.pop();
            usedNodes = usedNodes.slice(0, branchposition + 1); 
            usedNodes.push(last);
            return findWord(graph, word, branchposition, currentNode, usedNodes, branchNodes, branchposition, rootNode);
        }
        else if (branchNodes.length == 0 && branchposition != -1){
          usedNodes = [currentNode];
          return findWord(graph, word, position - 1, rootNode, [currentNode], branchNodes, position, rootNode);
        }
        else { 
            return "not in grid";
        }
    }
    else {
        return "not in grid";
    }

}

exports.findAllSolutions = function(grid, dictionary) { 
  let gridGraph = gridToGraph(grid);
  var solutions = [];
  if (gridGraph == "empty") { 
    return solutions;
  }
  for (word in dictionary) { 
    let currentWord = dictionary[word].toLowerCase();
    if (currentWord.length < 3) { 
      continue;
    }
    let firstLetter = currentWord[0];
    if (firstLetter == 'q' || firstLetter == 's') {
      firstLetter = currentWord.slice(0,2);
    }

    let validNodes = Object.keys(gridGraph.adjDict).filter(node => gridGraph.adjDict[node][0] == firstLetter);

    if (validNodes.length) {
      var addWord; 
      if (validNodes.length > 1) { 
        for (node in validNodes) { 
          addWord = findWord(gridGraph, currentWord, 0, validNodes[node]);
          if (addWord != "not in grid") {
            solutions.push(currentWord);
          }
        }
      }
      else { 
        addWord = findWord(gridGraph, currentWord, 0, validNodes[0]);
        if (addWord != "not in grid") {
          solutions.push(currentWord);
        }
      }
    }
    else { 
      continue;
    }
  }
  thing = new Set(solutions);
  finalSolutions = [...thing];
  return finalSolutions;
}

var grid = [ [ 'V', 'E', 'R', 'Y' ],
      [ 'A', 'B', 'D', 'D' ],
      [ 'D', 'E', 'D', 'E' ],
      [ 'D', 'E', 'D', 'E' ] ];
var dictionary = ['bee'];

let grid2 = [["A", "Qu"], ["C", "St"]];
let dict = ["stac"];
solutions = exports.findAllSolutions(grid2, dict);
console.log(solutions);