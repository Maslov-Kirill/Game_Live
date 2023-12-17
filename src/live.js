let rows = 30;
let cols = 30;
let grid = createEmptyGrid();
let intervalId;
let updateSpeed = 100;

function createEmptyGrid() {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
}

function initGrid() {
  const gridContainer = document.getElementById("grid");
  gridContainer.innerHTML = "";

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.className = "grid-item";
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.onclick = toggleCell;
      gridContainer.appendChild(cell);
    }
  }
}

function changeGridSize() {
  const newRows = parseInt(document.getElementById("rowsInput").value);
  const newCols = parseInt(document.getElementById("colsInput").value);

  if (newRows >= 1 && newCols >= 1) {
    rows = newRows;
    cols = newCols;
    grid = createEmptyGrid();
    initGrid();

    document.getElementById("grid").style.setProperty("--rows", rows);
    document.getElementById("grid").style.setProperty("--cols", cols);
  } else {
    alert("Please enter valid values for rows and columns (minimum 1).");
  }
}

function randomInit() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const randomValue = Math.random() < 0.5;
      grid[i][j] = randomValue;
      const cell = document.querySelector(
        `.grid-item[data-row="${i}"][data-col="${j}"]`
      );
      cell.style.backgroundColor = grid[i][j] ? "black" : "white";
    }
  }
}

function toggleCell() {
  const row = parseInt(this.dataset.row);
  const col = parseInt(this.dataset.col);
  grid[row][col] = !grid[row][col];
  this.style.backgroundColor = grid[row][col] ? "black" : "white";
}

function changeSpeed(value) {
  updateSpeed = parseInt(value);
  document.getElementById("speedValue").innerText = `${value} ms`;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = setInterval(updateGrid, updateSpeed);
  }
}

function startGame() {
  intervalId = setInterval(updateGrid, updateSpeed);
}

function stopGame() {
  clearInterval(intervalId);
}

function clearGrid() {
  stopGame();
  grid = createEmptyGrid();
  initGrid();
}

function updateGrid() {
  const newGrid = createEmptyGrid();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const neighbors = countNeighbors(i, j);

      if (grid[i][j]) {
        newGrid[i][j] = neighbors === 2 || neighbors === 3;
      } else {
        newGrid[i][j] = neighbors === 3;
      }

      const cell = document.querySelector(
        `.grid-item[data-row="${i}"][data-col="${j}"]`
      );
      cell.style.backgroundColor = newGrid[i][j] ? "black" : "white";
    }
  }

  grid = newGrid;
}

function countNeighbors(row, col) {
  let count = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;

      let newRow = row + i;
      let newCol = col + j;

      if (newRow === -1) newRow = rows - 1;
      if (newRow === rows) newRow = 0;
      if (newCol === -1) newCol = cols - 1;
      if (newCol === cols) newCol = 0;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        count += grid[newRow][newCol] ? 1 : 0;
      }
    }
  }

  return count;
}
initGrid();
