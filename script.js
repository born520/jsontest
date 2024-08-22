document.addEventListener("DOMContentLoaded", function() {
  fetch('https://script.google.com/macros/s/AKfycbxeJFOU1P_Nf_oq8KZal818DXpuqET-HlONezi9KpYXHDaj0QhjsvPRK9TALujAMMQNtg/exec')
    .then(response => response.json())
    .then(data => {
      // 데이터가 제대로 로드되었는지 확인
      if (data && Array.isArray(data.headers) && Array.isArray(data.cellData)) {
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

  const headers = data.headers;
  const rows = data.cellData;

  if (!headers || !rows) {
    console.error('Missing headers or rows in data');
    return;
  }

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  const cellDataMap = new Map(); // To track cell merges

  rows.forEach(rowData => {
    const [startRow, startCol, numRows, numCols, text] = rowData;
    for (let i = 0; i < numRows; i++) {
      const rowElement = document.createElement('tr');
      for (let j = 0; j < numCols; j++) {
        const cell = document.createElement('td');
        const currentRow = startRow + i;
        const currentCol = startCol + j;

        if (i === 0 && j === 0) {
          cell.textContent = text;
          cell.setAttribute('rowspan', numRows);
          cell.setAttribute('colspan', numCols);
        } else {
          cell.textContent = ''; // Empty cells
        }

        // Track cell merges
        if (!cellDataMap.has(`${currentRow},${currentCol}`)) {
          cellDataMap.set(`${currentRow},${currentCol}`, cell);
          rowElement.appendChild(cell);
        }
      }
      tbody.appendChild(rowElement);
    }
  });

  table.appendChild(tbody);
}
