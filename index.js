/**
 * The map function takes the line number and the line content.
 * It returns a list of cells with additional data which is needed to correctly place the cell in the reduce function.
 * Each item on the list has a key, the cell's line position, which will be used by the shuffle/sort algorithm to group cells of the same pivot CSV line.
 * 
 * @param {*} key   the line number in the CSV
 * @param {*} value the content of the line in the CSV
 */
function map(key, value) {
  let resultList = [];

  // List of the line's cells (cells are separated by ',' character in CSV format)
  let cells = value.split(',');

  // For each cell, we add a new object to the returned list
  // The key is the position in the line which will be its new line number.
  // The value is an object with:
  //    - position, the future line position of the cell which is currently its line number
  //    - cell: the cell text
  cells.forEach(
    (cell, index) => resultList.push({
      key: index,
      value: { 
        position: key,
        cell: cell
      }
    })
  );

  return resultList;
}

/**
 * The reduce function takes the line number in the pivot CSV and a list of the words of the line and their positionning.
 * The function then composes the CSV line and returns it.
 * 
 * @param {*} key the line number in the CSV
 * @param {*} values contains the words of the line and their positionning
 */
function reduce(key, values){

  // Stores the nb of cells in the line (cells are ',' separated in CSV file)
  let nbCells = 0;

  // Stores the cells. We will use this list to generate the csv line later.
  let cells = [];

  // The CSV line that will be generated within this function
  let line = '';

  values.forEach(
    value => {
      // Updates the cells counter
      if( value.position > nbCells)
        nbCells++;

      // Stores the cell in the temporary list at the index of the cell position.
      cells[value.position] = value.cell;
    }
  );

  // Creates the csv line
  cells.forEach(
    cell => line = line.concat(cell, ',')
  );

  // Remove the last character of the line if there is at least one cell
  if( line != '')
    line = line.slice(0, -1);

  // The returned value is an object with a key (the line number in the csv) and the value (the csv line)
  return {
    key: key,
    value: line
  };
}




// First step: input reader. The input reader split the csv file by line
const csv = [
  { key: 0, value: 'Name,Time,Score' },
  { key: 1, value: 'Dan,68,20' },
  { key: 2, value: 'Suse,42,40' },
  { key: 3, value: 'Tracy,50,38' }
];

// Second step: the mapper function is called
const mapResults = csv.map(
  line => map(line.key, line.value)
);

console.dir(mapResults);

// Third step: shuffle and sort. The elements are grouped by keys. This is handled by the Framework.
// The elements generated by the Framework looks like this:
let resultsToReduce = [
  {
    key: 0, 
    list: [
      { position: 0, cell: 'Name' },
      { position: 3, cell: 'Tracy' },
      { position: 2, cell: 'Suse' },
      { position: 1, cell: 'Dan' }
    ]
  },
  {
    key: 1, 
    list: [
      { position: 0, cell: 'Time' },
      { position: 1, cell: '68' },
      { position: 2, cell: '42' },
      { position: 3, cell: '50' }
    ]
  },
  {
    key: 2, 
    list: [
      { position: 0, cell: 'Score' },
      { position: 1, cell: '20' },
      { position: 2, cell: '40' },
      { position: 3, cell: '38' }
    ]
  }
];

// Fourth step: the reducer function is called.
const reduceResults = resultsToReduce.map(
  element => reduce(element.key, element.list)
);

console.dir(reduceResults);