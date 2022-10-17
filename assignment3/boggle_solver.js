/**
 * @description graph data structure
 * @class
 */
class Graph {
  /**
   * @description creates graph data structure
   * @constructor
   */
  constructor() {
    this.adjDict = {}; // all nodes in the graph
  }
  /**
   * @description adds node to the graph
   * @param {string} nodeValue - the letter
   * @param {int} nodeNumber - the index of the letter on the grid
   * @param {int[]} adjList - list of nodes that are
   *                          adjacent to the node being added
   * @return {void}
   */
  addNode(nodeValue, nodeNumber, adjList) {
    this.adjDict[nodeNumber] = [nodeValue, adjList];
  }
}

/**
 * @description creates graph using the input grid
 * @param {string[]} grid - boggle game board
 * @return {Graph}
 */
function gridToGraph(grid) {
  const gridGraph = new Graph;
  const indexGrid = [];
  // validation; returns null if grid is
  // empty or not square (i.e. 4x4, 2x2, etc...)
  if (!(grid.length)) {
    return null;
  }
  const rows = grid.length;
  const columns = grid[0].length;
  if ((rows != columns) || (rows == 0 || columns == 0)) {
    return null;
  } else {
    // creates grid of indicies
    index = 1;
    for (let i = 0; i < grid.length; i++) {
      newRow = [];
      for (let j = 0; j < grid[0].length; j++) {
        newRow.push(index);
        index += 1;
      }
      indexGrid.push(newRow);
    }

    // adds nodes to graph
    let currentNodeNumber = 1;
    for (let m = 0; m < rows; m++) {
      for (let n = 0; n < columns; n++) {
        const currentAdjList = [];
        const gridLocations = [
          [m - 1, n],
          [m + 1, n],
          [m, n - 1],
          [m, n + 1],
          [m - 1, n - 1],
          [m - 1, n + 1],
          [m + 1, n - 1],
          [m + 1, n + 1],
        ]; // all possible locations of adjacent nodes in a grid
        for (let i = 0; i < gridLocations.length; i++) {
          const currentRow = gridLocations[i][0];
          const currentColumn = gridLocations[i][1];
          // adds node to list of adjacent nodes indicies if the location exists
          try {
            if (typeof(indexGrid[currentRow][currentColumn]) !=
                            'undefined') {
              currentAdjList.push(indexGrid[currentRow][
                  currentColumn
              ]);
            }
          } catch {
            continue;
          }
        }
        gridGraph.addNode(grid[m][n].toLowerCase(),
            currentNodeNumber, currentAdjList);
        currentNodeNumber++;
      }
    }
    return gridGraph;
  }
}

/**
 * @description determines whether or not a grid contains a given word
 *  @param {graph} graph - graph of the current boggle grid
 *  @param {string} word - current word being searched for
 *  @param {int} position - current index within the word
 *  @param {int} currentNode - index of the current node
 *  @param {int[]} usedNodes - list of nodes that have been used
 *  @param {int[]} branchNodes - list of nodes that could potentially
 *                               be used in the current path
 *  @param {int} branchposition - index to return to if
 *                                the current path is incorrect
 *  @param {int} rootNode - node where the first branch starts
 *  @return {boolean}
 */
function findWord(graph, word, position, currentNode, usedNodes = [],
    branchNodes = [], branchposition = -1, rootNode) {
  const currentLetter = graph.adjDict[currentNode][0];
  let nextLetter = word[position + 1];
  let validNodes;
  if (currentLetter.length > 1) { // if current letter is 'St' or 'Qu'
    nextLetter = word[position + 2];
    if (nextLetter == 'q' || nextLetter ==
            's') { // if the next letter is 'St' or 'Qu'
      nextLetter = word.slice(position + 2, position + 4);
    }
  } else if (nextLetter == 'q' || nextLetter == 's') {
    nextLetter = word.slice(position + 1, position + 3);
  }
  // validNodes is a list of all the nodes
  // that have a value that is the same as the next letter
  if (branchNodes.length && position == branchposition) {
    validNodes = [branchNodes.pop()];
  } else {
    validNodes = Object.keys(graph.adjDict).filter((node) => graph.adjDict[
        node][0] == nextLetter);
  }
  if (validNodes.length) {
    if (validNodes.length > 1) {
      // if the currentNode is adjacent to more
      // than one node with the current letter value
      if (branchposition == -1) {
        rootNode = currentNode;
      }
      while (usedNodes.some((node) => node === validNodes[
          0])) { // removes used nodes from valid nodes
        branchRoot = currentNode;
        validNodes = validNodes.slice(1);
      }
      branchposition = position;
      branchNodes = validNodes;
    }
    // if the a node with the next letter value is adjacent to the current node
    if (graph.adjDict[currentNode][1].some((number) => number == validNodes[
        0]) && !(usedNodes.some((node) => node === validNodes[0]))) {
      if (position == word.length - 2) {
        return true;
      }
      if ((nextLetter.length > 1 || currentLetter.length > 1) &&
                position == word.length - 3) {
        return true;
      } else {
        if (currentLetter.length > 1) {
          position += 1;
        }
        if (!usedNodes.includes(currentNode)) {
          usedNodes.push(currentNode);
        }
        return findWord(graph, word, position + 1, validNodes[0],
            usedNodes, branchNodes, branchposition, rootNode);
      }
    } else if (branchNodes
        .length) { // if there are alternate paths available
      usedNodes = usedNodes.slice(0, branchposition + 1);
      if (!usedNodes.includes(currentNode)) {
        usedNodes.push(currentNode);
      }
      if (graph.adjDict[branchNodes[0]][0] == graph.adjDict[validNodes[0]][0]) {
        return findWord(graph, word, branchposition, currentNode,
            usedNodes, branchNodes, branchposition, rootNode);
      } else if (branchNodes.length == 1) {
        return findWord(graph, word, branchposition, rootNode,
            usedNodes, branchNodes, branchposition, rootNode);
      } else {
        return false;
      }
    } else if (branchNodes.length == 0 && branchposition != -
    1) { // if there all of the branch nodes have been tried
      let otherNodes = Object.keys(graph.adjDict).filter((node) => graph
          .adjDict[node][0] == currentLetter);
      usedNodes.push(currentNode);
      otherNodes = otherNodes.filter((node) => !(usedNodes.includes(
          node)));
      if (otherNodes.length > 1) {
        return findWord(graph, word, position, otherNodes[0], usedNodes,
            branchNodes, position, rootNode);
      }
      return false;
    } else {
      return false;
    }
  } else {
    if (usedNodes.length > 2) {
      const parent = usedNodes[usedNodes.length - 1];
      const grandparent = usedNodes[usedNodes.length - 2];
      let otherNodes = Object.keys(graph.adjDict).filter((node) => graph
          .adjDict[node][0] == graph.adjDict[parent][0]);
      otherNodes = otherNodes.filter((node) => !(usedNodes.includes(node)));
      if (otherNodes.length) {
        // if alternate paths are available starting from a previous node
        position = position - (graph.adjDict[parent][0].length + graph
            .adjDict[grandparent][0].length);
        usedNodes.pop();
        return findWord(graph, word, position, grandparent, usedNodes,
            otherNodes, position, grandparent);
      }
    } else {
      return false;
    }
  }
}

/**
 * @description finds all the dictionary words
 *              contained in the grid and returns them
 * @param {string[]} grid - the boggle game board
 * @param {string[]} dictionary - dictionary of potential boggle solutions
 * @return {string[]}
 */
exports.findAllSolutions = function(grid, dictionary) {
  const gridGraph = gridToGraph(grid);
  let solutions = [];
  if (!gridGraph) { // if grid is invalid (null), return an empty string
    return solutions;
  } else {
    for (let i = 0; i < dictionary.length; i++) {
      const currentWord = dictionary[i].toLowerCase();
      if (currentWord.length <
                3) { // skips words that are invalid (too short)
        continue;
      }
      let firstLetter = currentWord[0];
      if (firstLetter == 'q' || firstLetter == 's') {
        firstLetter = currentWord.slice(0, 2);
      }
      // if the any letters in the grid match the first
      // letter of the current word
      const validNodes = Object.keys(gridGraph.adjDict).filter((
          node) => gridGraph.adjDict[node][0] == firstLetter);
      if (validNodes.length) {
        if (validNodes.length > 1) {
          for (let j = 0; j < validNodes.length; j++) {
            if (findWord(gridGraph, currentWord, 0, validNodes[
                j])) {
              solutions.push(currentWord);
              break;
            }
          }
        } else {
          if (findWord(gridGraph, currentWord, 0, validNodes[
              0])) {
            solutions.push(currentWord);
          }
        }
      } else {
        continue;
      }
    }
    solutions = new Set(solutions); // removes duplicates
    return [...solutions];
  }
};


const grid = [
  ['T', 'W', 'Y', 'R'],
  ['E', 'N', 'P', 'H'],
  ['G', 'Z', 'Qu', 'R'],
  ['St', 'N', 'T', 'A'],
];
const dictionary = ['art', 'ego', 'gent', 'get', 'net', 'new', 'newt', 'prat',
  'pry', 'qua', 'quart', 'quartz', 'rat', 'tar', 'tarp', 'ten', 'went',
  'wet', 'arty', 'egg', 'not', 'quar',
];
console.log(exports.findAllSolutions(grid, dictionary));
