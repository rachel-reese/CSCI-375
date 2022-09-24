/**
 * Given a Boggle board and a dictionary, returns a list of available words in
 * the dictionary present inside of the Boggle board.
 * @param {string[][]} grid - The Boggle game board.
 * @param {string[]} dictionary - The list of available words.
 * @returns {string[]} solutions - Possible solutions to the Boggle board.
 */
// Rachel Reese

class graph { 
    adjDict = {};

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
            let gridLocations =  [[m-1, n], [m+1, n], [m, n-1], [m, n+1], [m-1, n-1], [m-1, n+1], [m+1, n-1], [m+1, n+1]];
            for (location in gridLocations) { 
                try { 
                    if (typeof(numbersGrid[gridLocations[location][0]][gridLocations[location][1]]) != 'undefined') { 
                        currentAdjList.push(numbersGrid[gridLocations[location][0]][gridLocations[location][1]]);
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

function findWord(graph, word, position, currentNode, usedNodes = [], branchNodes = [], branchposition = 0) {
    let currentLetter = graph.adjDict[currentNode][0];
    let nextLetter = word[position + 1];
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
    console.log(currentLetter);
    console.log(nextLetter);
    console.log(validNodes);
    if (validNodes.length) { 
        if (validNodes.length > 1) { 
            rootNode = currentNode;
            branchNodes = validNodes.slice(1);
            branchposition = position;
        }
        console.log(graph.adjDict[currentNode][1]);
        if (graph.adjDict[currentNode][1].some(number => number == validNodes[0]) && !(usedNodes.some(node => node === validNodes[0]))) {
            if (position == word.length - 2) { 
                return true;
            }
            if (nextLetter.length > 1 && position == word.length - 3) { 
                return true;
            }
            else { 
                if (currentLetter.length > 1) { 
                    position += 1;
                }
                usedNodes.push(currentNode);
                return findWord(graph, word, position + 1, validNodes[0], usedNodes, branchNodes, branchposition);
            }
        }
        else if (branchNodes.length) {            
            usedNodes = usedNodes.slice(0, branchposition); 
            console.log("changing");
            return findWord(graph, word, branchposition, currentNode, usedNodes, branchNodes, branchposition);
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }

}

exports.findAllSolutions = function(grid, dictionary) { 
    let gridGraph = gridToGraph(grid);
    solutions = [];
    if (gridGraph == "empty") { 
        return solutions;
    }

    for (word in dictionary) { 
        word = dictionary[word].toLowerCase();
        if (word.length < 3) { 
            continue;
        }
        firstLetter = word[0];
        if (firstLetter == 'q' || firstLetter == 's') { 
            firstLetter = word.slice(0, 2);
        }
        let validNodes = Object.keys(gridGraph.adjDict).filter(node => gridGraph.adjDict[node][0] == firstLetter);
        if (validNodes.length) { 
            if (validNodes.length > 1) { 
                for (node in validNodes) {
                    if (findWord(gridGraph, word, 0, validNodes[node])) { 
                        solutions.push(word);
                    }
                }
            }
            else { 
                if (findWord(gridGraph, word, 0, validNodes[0])) { 
                    solutions.push(word);
                }            
            }
        }
        else {
            continue;
        }
    }

    return solutions;
}

var grid = [['T', 'W', 'Y', 'R'],
                ['E', 'N', 'P', 'H'],
                ['G', 'Z', 'Qu', 'R'],
                ['St', 'N', 'T', 'A']];

var dictionary = ['art', 'ego', 'gent', 'get', 'net', 'new', 'newt', 'prat',
'pry', 'qua', 'quart', 'quartz', 'rat', 'tar', 'tarp',
'ten', 'went', 'wet', 'arty', 'egg', 'not', 'quar'];

thing = [['A','Qu'],['C','St']];
thing2 = ['aqu', 'stac', "DCA", 'XY'];

console.log(exports.findAllSolutions(grid, ['prat']));