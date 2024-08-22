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

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const numCols = values[0].length; // Assuming the first row has the number of columns
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

  values.forEach((row, rowIndex) => {
    const rowElement = document.createElement('tr');
    row.forEach((cell, colIndex) => {
      const cellKey = `${rowIndex},${colIndex}`;
      let cellElement;

      if (cellDataMap.has(cellKey)) {
        cellElement = cellDataMap.get(cellKey);
      } else {
        cellElement = document.createElement('td');
        cellElement.textContent = cell;
        cellDataMap.set(cellKey, cellElement);
      }

      rowElement.appendChild(cellElement);
    });
    tbody.appendChild(rowElement);
  });

  table.appendChild(tbody);

  // Apply mergeInfo for cell merging
  if (Array.isArray(mergeInfo)) {
    mergeInfo.forEach(merge => {
      if (Array.isArray(merge) && merge.length === 4) {
        const [startRow, startCol, numRows, numCols] = merge;
        const startCellKey = `${startRow},${startCol}`;
        const cellToMerge = cellDataMap.get(startCellKey);

        if (cellToMerge) {
          cellToMerge.setAttribute('rowspan', numRows);
          cellToMerge.setAttribute('colspan', numCols);
        }
      }
    });
  } else {
    console.error('mergeInfo is not an array or has incorrect format');
  }
}
