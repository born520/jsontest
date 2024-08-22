async function fetchData() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxeJFOU1P_Nf_oq8KZal818DXpuqET-HlONezi9KpYXHDaj0QhjsvPRK9TALujAMMQNtg/exec');
    const data = await response.json();
    const { values, mergeInfo } = data;

    const table = document.getElementById('data-table');

    if (!values.length) return; // No data

    // Create table rows and cells
    const numRows = values.length;
    const numCols = values[0].length;
    const cells = [];

    // Create table structure
    for (let r = 0; r < numRows; r++) {
      const tr = document.createElement('tr');
      cells[r] = [];
      for (let c = 0; c < numCols; c++) {
        const td = document.createElement('td');
        tr.appendChild(td);
        cells[r][c] = td;
      }
      table.appendChild(tr);
    }

    // Populate cell values
    values.forEach((row, r) => {
      row.forEach((value, c) => {
        cells[r][c].textContent = value;
      });
    });

    // Apply merge and styling information
    mergeInfo.forEach(({ row, column, rowSpan, colSpan, text, fontColor, backgroundColor, fontSize, fontWeight }) => {
      for (let r = row; r < row + rowSpan; r++) {
        for (let c = column; c < column + colSpan; c++) {
          const cell = cells[r][c];
          if (r === row && c === column) {
            cell.textContent = text;
          } else {
            cell.textContent = '';
          }
          cell.style.color = fontColor || '';
          cell.style.backgroundColor = backgroundColor || '';
          cell.style.fontSize = fontSize || '';
          cell.style.fontWeight = fontWeight || '';
          cell.rowSpan = r === row ? rowSpan : 1;
          cell.colSpan = c === column ? colSpan : 1;
          cell.classList.add('merged'); // For proper alignment
        }
      }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();
