/**
 * Rachel Reese
 * @02966382
 *
 * 2nd version
 */

/** graph data structure */
class graph { 
  constructor() { 
    this.adjDict = {}; /** all nodes in the graph */
  }

  /** adds node to the graph 
   * nodeValue is the letter
   * nodeNumber is the the index of the letter on the grid
   * adjList is the list of nodes that are adjacent to the node being added
  */
  addNode(nodeValue, nodeNumber, adjList) { 
      this.adjDict[nodeNumber] = [nodeValue, adjList];
  }
}

/** creates graph using the input grid */
function gridToGraph(grid) { 
  let gridGraph = new graph;
  let indexGrid = [];
  
  // validation; returns null if grid is empty or not square (i.e. 4x4, 2x2, etc...)
  if (!(grid.length)) {
    return null;
  }
  let rows = grid.length;
  let columns = grid[0].length;
  if ((rows != columns) || (rows == 0 || columns == 0)){ 
    return null;
  }

  // creates grid of indicies
  index = 1;
  for (row in grid) { 
    newRow = [];
    for (column in grid[0]) { 
      newRow.push(index);
      index += 1;
    }
    indexGrid.push(newRow);
  }

  // adds nodes to graph
  let currentNodeNumber = 1;
  for (let m = 0; m < rows; m++) { 
    for (let n = 0; n < columns ; n++) {
      let currentAdjList = [];
      let gridLocations =  [[m-1, n], [m+1, n], [m, n-1], [m, n+1], [m-1, n-1], [m-1, n+1], [m+1, n-1], [m+1, n+1]]; // all possible locations of adjacent nodes in a grid

      for (area in gridLocations) {
        let currentRow = gridLocations[area][0];
        let currentColumn = gridLocations[area][1];
        // adds node to list of adjacent nodes indicies if the location exists 
        try { 
          if (typeof(indexGrid[currentRow][currentColumn]) != 'undefined') {
            currentAdjList.push(indexGrid[currentRow][currentColumn]);
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

/** determines whether or not a grid contains a given word
 *  returns true if the graph contains the word
 *  branchNodes is a list of all the nodes that have a letter value matching the next letter
 *  branchPosition is the position to return to after going through the branch nodes
 *  the rootNode is the node where the first branch starts
 */
function findWord(graph, word, position, currentNode, usedNodes = [], branchNodes = [], branchposition = -1, rootNode) {
  let currentLetter = graph.adjDict[currentNode][0];
  let nextLetter = word[position + 1];
  let validNodes;

  if (currentLetter.length > 1) { // if current letter is 'St' or 'Qu'
    nextLetter = word[position+2];
    if (nextLetter == 'q' || nextLetter == 's') { // if the next letter is 'St' or 'Qu'
      nextLetter = word.slice(position+2, position+4);
    }
  }
  else if (nextLetter == 'q' || nextLetter == 's') { 
    nextLetter = word.slice(position+1, position+3);
  }
  
  // validNodes is a list of all the nodes that have a value that is the same as the next letter
  if (branchNodes.length && position == branchposition) {
    validNodes = [branchNodes.pop()]; // if the last branchNodes entry becomes validNodes; avoids repetition/ nodes getting falsely marked as used
  }
  else { 
    validNodes = Object.keys(graph.adjDict).filter(node => graph.adjDict[node][0] == nextLetter);
  }
  
  if (validNodes.length) { 
    if (validNodes.length > 1) { // if the currentNode is adjacent to more than one node with the current letter value
      if (branchposition == -1) { 
        rootNode = currentNode;
      }
      while (usedNodes.some(node => node === validNodes[0])) { // removes used nodes from valid nodes
        branchRoot = currentNode;
        validNodes = validNodes.slice(1); 
      }
      branchposition = position;
      branchNodes = validNodes;
    }

    // if the a node with the next letter value is adjacent to the current node
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
    else if (branchNodes.length) { // if there are alternate paths available
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
    else if (branchNodes.length == 0 && branchposition != -1){ // if there all of the branch nodes have been tried
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

      if (otherNodes.length) { // if alternate paths are available starting from a previous node
        position = position - (graph.adjDict[parent][0].length + graph.adjDict[grandparent][0].length);
        usedNodes.pop();
        return findWord(graph, word, position, grandparent, usedNodes, otherNodes, position, grandparent);
      }
    }
    else { 
      return false;
    }   
  }
}

/** finds all the dictionary words contained in the grid
 *  returns a list of all the solutions
 */
exports.findAllSolutions = function(grid, dictionary) { 
  let gridGraph = gridToGraph(grid);
  var solutions = [];
  if (!gridGraph) { // if grid is invalid (null), return an empty string
    return solutions;
  }
  for (word in dictionary) { 
    let currentWord = dictionary[word].toLowerCase();
    if (currentWord.length < 3) { // skips words that are invalid (too short)
      continue;
    }
    let firstLetter = currentWord[0];
    if (firstLetter == 'q' || firstLetter == 's') {
      firstLetter = currentWord.slice(0,2);
    }

    // if the any letters in the grid match the first letter of the current word
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
  solutions = new Set(solutions); // removes duplicates
  return [...solutions];
}
