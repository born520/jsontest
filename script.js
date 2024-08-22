document.addEventListener("DOMContentLoaded", function() {
  fetch('https://script.google.com/macros/s/AKfycbxeJFOU1P_Nf_oq8KZal818DXpuqET-HlONezi9KpYXHDaj0QhjsvPRK9TALujAMMQNtg/exec')
    .then(response => response.json())
    .then(data => {
      if (data && Array.isArray(data.values) && Array.isArray(data.mergeInfo)) {
        createTable(data);
      } else {
        console.error('Invalid data format:', data);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
});

function createTable(data) {
  const table = document.getElementById('data-table');
  table.innerHTML = '';

  const values = data.values;
  const mergeInfo = data.mergeInfo;

  if (!values || !mergeInfo) {
    console.error('Missing values or mergeInfo in data');
    return;
  }

  const numCols = values[0].length;
  const numRows = values.length;

  // Create table header (hidden)
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  for (let i = 0; i < numCols; i++) {
    const th = document.createElement('th');
    th.style.display = 'none'; // Hide column headers
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');

  // Initialize table with empty cells
  const cellDataMap = new Map();
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    const rowElement = document.createElement('tr');
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const cellElement = document.createElement('td');
      cellElement.dataset.row = rowIndex;
      cellElement.dataset.col = colIndex;
      cellElement.textContent = values[rowIndex][colIndex] || ''; // Set cell text from values
      rowElement.appendChild(cellElement);
      cellDataMap.set(`${rowIndex},${colIndex}`, { element: cellElement });
    }
    tbody.appendChild(rowElement);
  }
  table.appendChild(tbody);

  // Apply mergeInfo for cell merging
  mergeInfo.forEach(merge => {
    if (Array.isArray(merge) && merge.length === 5) {
      const [startRow, startCol, rowspan, colspan, text] = merge;

      // Update cellDataMap with merge information
      for (let rowOffset = 0; rowOffset < rowspan; rowOffset++) {
        for (let colOffset = 0; colOffset < colspan; colOffset++) {
          const cellKey = `${startRow + rowOffset},${startCol + colOffset}`;
          const cellData = cellDataMap.get(cellKey);
          if (cellData) {
            const cellElement = cellData.element;
            if (rowOffset === 0 && colOffset === 0) {
              // Set the text and attributes for the top-left cell of the merge
              cellElement.setAttribute('rowspan', rowspan);
              cellElement.setAttribute('colspan', colspan);
              cellElement.textContent = text;
            } else {
              // Clear the text for other cells in the merge
              cellElement.textContent = '';
            }
          }
        }
      }
    }
  });
}
