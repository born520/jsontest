document.addEventListener("DOMContentLoaded", function() {
  fetch('https://script.google.com/macros/s/AKfycbxeJFOU1P_Nf_oq8KZal818DXpuqET-HlONezi9KpYXHDaj0QhjsvPRK9TALujAMMQNtg/exec')
    .then(response => response.json())
    .then(data => {
      createTable(data);
    })
    .catch(error => console.error('Error fetching data:', error));
});

function createTable(data) {
  const table = document.getElementById('data-table');
  table.innerHTML = '';

  const headers = data.headers;
  const rows = data.cellData;
  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  let cellDataMap = {};

  rows.forEach(rowData => {
    const row = document.createElement('tr');
    const [startRow, startCol, numRows, numCols, text] = rowData;

    for (let i = 0; i < numRows; i++) {
      const rowElement = document.createElement('tr');
      for (let j = 0; j < numCols; j++) {
        const cell = document.createElement('td');
        if (i === 0 && j === 0) {
          cell.textContent = text;
          cell.setAttribute('rowspan', numRows);
          cell.setAttribute('colspan', numCols);
        }
        rowElement.appendChild(cell);
      }
      tbody.appendChild(rowElement);
    }
  });

  table.appendChild(tbody);
}
