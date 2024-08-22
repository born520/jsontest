document.addEventListener("DOMContentLoaded", function() {
  fetch('https://script.google.com/macros/s/AKfycbxeJFOU1P_Nf_oq8KZal818DXpuqET-HlONezi9KpYXHDaj0QhjsvPRK9TALujAMMQNtg/exec')
    .then(response => response.json())
    .then(data => {
      // 데이터 구조를 확인하여 데이터 처리
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

  const numCols = values[0].length; // Assuming the first row has the number of columns

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  for (let i = 0; i < numCols; i++) {
    const th = document.createElement('th');
    th.textContent = `Column ${i + 1}`;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  const cellDataMap = new Map(); // To track cell merges
  const numRows = values.length;

  // Initialize table with empty cells
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    const rowElement = document.createElement('tr');
    const rowValues = values[rowIndex];
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const cellElement = document.createElement('td');
      cellElement.dataset.row = rowIndex;
      cellElement.dataset.col = colIndex;
      cellElement.textContent = rowValues[colIndex] || ''; // Set cell text
      rowElement.appendChild(cellElement);
      cellDataMap.set(`${rowIndex},${colIndex}`, { element: cellElement, text: rowValues[colIndex] });
    }
    tbody.appendChild(rowElement);
  }
  table.appendChild(tbody);

  // Apply mergeInfo for cell merging
  mergeInfo.forEach(merge => {
    if (Array.isArray(merge) && merge.length === 5) {
      const [startRow, startCol, rowspan, colspan, text] = merge;
      const startCellKey = `${startRow},${startCol}`;
      const cellToMerge = cellDataMap.get(startCellKey);

      if (cellToMerge) {
        const cellElement = cellToMerge.element;
        cellElement.setAttribute('rowspan', rowspan);
        cellElement.setAttribute('colspan', colspan);
        cellElement.textContent = text;

        // Clear text in other cells that are part of this merge
        for (let rowOffset = 0; rowOffset < rowspan; rowOffset++) {
          for (let colOffset = 0; colOffset < colspan; colOffset++) {
            if (rowOffset === 0 && colOffset === 0) continue;
            const mergeCellKey = `${startRow + rowOffset},${startCol + colOffset}`;
            const mergeCell = cellDataMap.get(mergeCellKey);
            if (mergeCell) {
              mergeCell.element.textContent = '';
            }
          }
        }
      }
    }
  });
}
