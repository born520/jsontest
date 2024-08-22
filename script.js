// script.js
async function fetchData() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxeJFOU1P_Nf_oq8KZal818DXpuqET-HlONezi9KpYXHDaj0QhjsvPRK9TALujAMMQNtg/exec');
    const data = await response.json();
    
    const table = document.getElementById('data-table');
    const values = data.values;
    const mergeInfo = data.mergeInfo;

    if (values.length === 0) return;

    const numRows = values.length;
    const numCols = values[0].length;

    // Create table headers
    const headerRow = document.createElement('tr');
    for (let col = 0; col < numCols; col++) {
      const th = document.createElement('th');
      th.textContent = `Column ${col + 1}`;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Create table rows
    for (let row = 0; row < numRows; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < numCols; col++) {
        const td = document.createElement('td');
        td.textContent = values[row][col] || '';
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    // Apply cell merges
    mergeInfo.forEach(info => {
      const startRow = info.row;
      const startCol = info.column;
      const rowSpan = info.rowSpan;
      const colSpan = info.colSpan;
      const text = info.text;

      const cell = table.rows[startRow + 1].cells[startCol];
      cell.textContent = text;
      cell.rowSpan = rowSpan;
      cell.colSpan = colSpan;
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();
