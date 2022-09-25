/**
* Rachel Reese
* @02966382
*/
const boggle_solver = require('/home/codio/workspace/Boggle_Testing/boggle_solver.js');

function lowercaseStringArray(stringArray) {
  for (let i = 0; i < stringArray.length; i++)
    stringArray[i] = stringArray[i].toLowerCase();
}

describe('Boggle Solver tests suite:', () => {
  describe('Normal input', () => {
    test('7x7 grid', () => {
      let grid = [['D', 'W', 'O', 'P', 'T', 'F', 'O'],
                  ['G', 'C', 'R', 'E', 'A', 'St', 'E'],
                  ['H', 'U', 'F', 'E', 'L', 'M', 'R'],
                  ['L', 'G', 'Y', 'K', 'O', 'I', 'N'],
                  ['M', 'V', 'B', 'C', 'H', 'Qu', 'E'],
                  ['N', 'X', 'D', 'N', 'J', 'K', 'T'],
                  ['O', 'R', 'A', 'W', 'L', 'I', 'N']];
      let dictionary = ['rope', 'wire', 'real', 'quiet', 'draw', 'lock',
                        'coin', 'hug', 'clock', 'right'];

      let expected = ['rope', 'real', 'quiet', 'draw', 'lock',
                        'coin', 'hug'];
      let solutions = boggle_solver.findAllSolutions(grid, dictionary);
      lowercaseStringArray(solutions);
      lowercaseStringArray(expected);
      expect(solutions.sort()).toEqual(expected.sort());
    });

  test('6x6 grid', () => {
      let grid = [['D', 'W', 'O', 'P', 'T', 'F'],
                  ['G', 'C', 'R', 'E', 'A', 'St'],
                  ['H', 'U', 'F', 'E', 'L', 'M'],
                  ['L', 'G', 'Y', 'K', 'O', 'I'],
                  ['M', 'V', 'B', 'C', 'H', 'Qu'],
                  ['N', 'X', 'D', 'N', 'J', 'K']];
      let dictionary = ['wore', 'teal', 'cop', 'fate', 'lock',
                        'cure', 'hug', 'thin', 'loud', 'light'];

      let expected = ['wore', 'teal', 'cop', 'fate', 'lock',
                        'cure', 'hug'];
      let solutions = boggle_solver.findAllSolutions(grid, dictionary);
      lowercaseStringArray(solutions);
      lowercaseStringArray(expected);
      expect(solutions.sort()).toEqual(expected.sort());
    }); 
  });

  
  describe('Problem contraints', () => {
    // Cases such as Qu
    test('Word appears twice in grid', () => { 
      let grid = [['C', 'A', 'T'],
                  ['E', 'R', 'A'],
                  ['K', 'C', 'M'],];
      let dictionary = ['cat', 'era', 'mark', 'market'];

      let expected = ['cat', 'era', 'mark'];
      let solutions = boggle_solver.findAllSolutions(grid, dictionary);
      lowercaseStringArray(solutions);
      lowercaseStringArray(expected);
      expect(solutions.sort()).toEqual(expected.sort());
    });
 
    test('Qu and St in the middle of words', () => { 
      let grid = [['R', 'A', 'P'],
                  ['M', 'Qu', 'St'],
                  ['R', 'O', 'A']];
      let dictionary = ['map', 'roam', 'pasta', 'aqua'];

      let expected = ['map', 'pasta', 'aqua'];
      let solutions = boggle_solver.findAllSolutions(grid, dictionary);
      lowercaseStringArray(solutions);
      lowercaseStringArray(expected);
      expect(solutions.sort()).toEqual(expected.sort());
    });
  });

  
  describe('Input edge cases', () => {

    // Example Test using Jess
    test('Dictionary is empty', () => {
      // (Edge case) Since there are no possible solutiona, it should return an
      // empty list.
      let grid = [['A', 'B', 'C', 'D'],
                    ['E', 'F', 'G', 'H'],
                    ['I', 'J', 'K', 'L'],
                    ['M', 'N', 'O', 'P']];
      let dictionary = [];
      let expected = [];

      let solutions = boggle_solver.findAllSolutions(grid, dictionary);

      // Lowercasing for case-insensitive string array matching.
      lowercaseStringArray(solutions);
      lowercaseStringArray(expected);
      expect(solutions.sort()).toEqual(expected.sort());
    });

    test('2x3 grid', () => { 
      let grid = [['P', 'A', 'T'], 
                  ['O', 'A', 'R']];
      let dictionary = ['oar', 'pat', 'to'];
      let expected = [];

      let solutions = boggle_solver.findAllSolutions(grid, dictionary);
      lowercaseStringArray(solutions);
      lowercaseStringArray(expected);
      expect(solutions.sort()).toEqual(expected.sort());
    });

    test('Non string in grid', () => { 
      let grid = [[1, 'A', 'T'], 
                  ['O', 7, 'R']];
      let dictionary = ['at', 'to'];
      let expected = [];

      let solutions = boggle_solver.findAllSolutions(grid, dictionary);
      lowercaseStringArray(solutions);
      lowercaseStringArray(expected);
      expect(solutions.sort()).toEqual(expected.sort());
    });
  });
});
