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
  if (!(grid.length)) { 
    return null;
  }
  rows = grid.length;
  columns = grid[0].length;

  if (rows == 0 || columns == 0) { 
    return null;
  }
  if (rows != columns) { 
    return null;
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
      if (nextLetter == 'q' || nextLetter == 's') { 
        nextLetter = word.slice(position+2, position+4);
    }
  }
  else if (nextLetter == 'q' || nextLetter == 's') { 
      nextLetter = word.slice(position+1, position+3);
  }
  
  if (branchNodes.length && position == branchposition) {
      validNodes = [branchNodes.pop()];
  }
  else { 
      validNodes = Object.keys(graph.adjDict).filter(node => graph.adjDict[node][0] == nextLetter);
  }
  if (validNodes.length) { 
      if (validNodes.length > 1) { 
          if (branchposition == -1) { 
            rootNode = currentNode;
          }
          while (usedNodes.some(node => node === validNodes[0])) {
            branchRoot = currentNode;
            validNodes = validNodes.slice(1);
          }
          branchposition = position;
          branchNodes = validNodes;
      }
      if (graph.adjDict[currentNode][1].some(number => number == validNodes[0]) && !(usedNodes.some(node => node === validNodes[0]))) {
          if (position == word.length - 2) { 
            return true;
          }
          if ((nextLetter.length > 1 || currentLetter.length > 1) && position == word.length - 3) { 
              return true;
          }
          else { 
              if (currentLetter.length > 1) { 
                  position += 1;
              }
              if (!usedNodes.includes(currentNode)) { 
                usedNodes.push(currentNode);
              }
              return findWord(graph, word, position + 1, validNodes[0], usedNodes, branchNodes, branchposition, rootNode);
          }
      }
      else if (branchNodes.length) {
          usedNodes = usedNodes.slice(0, branchposition + 1); 
          if (!usedNodes.includes(currentNode)) { 
            usedNodes.push(currentNode);
          }
          if (graph.adjDict[branchNodes[0]][0] == graph.adjDict[validNodes[0]][0]){
            return findWord(graph, word, branchposition, currentNode, usedNodes, branchNodes, branchposition, rootNode);
          }
          else if (branchNodes.length == 1) { 
            return findWord(graph, word, branchposition, rootNode, usedNodes, branchNodes, branchposition, rootNode);
          }
          else { 
            return false;
          }
      }
      else if (branchNodes.length == 0 && branchposition != -1){
        let otherNodes = Object.keys(graph.adjDict).filter(node => graph.adjDict[node][0] == currentLetter);
        usedNodes.push(currentNode);
        otherNodes = otherNodes.filter(node => !(usedNodes.includes(node)));
        if (otherNodes.length > 1) { 
          return findWord(graph, word, position, otherNodes[0], usedNodes, branchNodes, position, rootNode);
        }
        return false;
      }
      else { 
          return false;
      }
  }
  else {
    if (usedNodes.length > 2) { 
      let parent = usedNodes[usedNodes.length - 1]
      let grandparent = usedNodes[usedNodes.length - 2]
      let otherNodes = Object.keys(graph.adjDict).filter(node => graph.adjDict[node][0] == graph.adjDict[parent][0]);
      otherNodes = otherNodes.filter(node => !(usedNodes.includes(node)));

      if (otherNodes.length) {
        position = position - (graph.adjDict[parent][0].length + graph.adjDict[grandparent][0].length);
        usedNodes.pop();
        return findWord(graph, word, position, grandparent, usedNodes, otherNodes, position, grandparent);
      }
    }
    else
    return false;
  }
}

exports.findAllSolutions = function(grid, dictionary) { 
  let gridGraph = gridToGraph(grid);
  var solutions = [];
  if (!gridGraph) { 
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
      if (validNodes.length > 1) { 
        for (node in validNodes) { 
          if (findWord(gridGraph, currentWord, 0, validNodes[node])) {
            solutions.push(currentWord);
            break;
          }
        }
      }
      else { 
        if (findWord(gridGraph, currentWord, 0, validNodes[0])) {
          solutions.push(currentWord);
        }
      }
    }
    else { 
      continue;
    }
  }
  solutions = new Set(solutions);
  return [...solutions];
}

var grid = [['T', 'W', 'Y', 'R'],
                ['E', 'N', 'P', 'H'],
                ['G', 'Z', 'Qu', 'R'],
                ['St', 'N', 'T', 'A']];

var dictionary = ['art', 'ego', 'gent', 'get', 'net', 'new', 'newt', 'prat',
'pry', 'qua', 'quart', 'quartz', 'rat', 'tar', 'tarp',
'ten', 'went', 'wet', 'arty', 'egg', 'not', 'quar'];

console.log(exports.findAllSolutions(grid, dictionary ));
