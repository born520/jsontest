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

    // Remove existing table rows if any
    table.innerHTML = '';

    // Create table headers (hidden)
    const headerRow = document.createElement('tr');
    for (let col = 0; col < numCols; col++) {
      const th = document.createElement('th');
      th.className = 'hidden';  // Hide the column headers
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Create table rows
    const rows = [];
    for (let row = 0; row < numRows; row++) {
      const tr = document.createElement('tr');
      const cells = [];
      for (let col = 0; col < numCols; col++) {
        const td = document.createElement('td');
        cells.push(td);
        tr.appendChild(td);
      }
      rows.push(cells);
      table.appendChild(tr);
    }

    // Apply cell values and styles
    const cellStyles = {};
    mergeInfo.forEach(info => {
      const { row, column, rowSpan, colSpan, text, fontColor, backgroundColor, fontSize, fontWeight } = info;

      for (let r = row; r < row + rowSpan; r++) {
        for (let c = column; c < column + colSpan; c++) {
          if (!cellStyles[`${r}-${c}`]) {
            cellStyles[`${r}-${c}`] = {
              text,
              fontColor,
              backgroundColor,
              fontSize,
              fontWeight,
              rowSpan,
              colSpan,
            };
          }
        }
      }
    });

    // Apply styles and values
    const appliedCells = new Set(); // Track cells where content has been applied
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const cell = rows[r][c];
        const key = `${r}-${c}`;
        const style = cellStyles[key];

        if (style) {
          // Only apply content and styles if not already applied
          if (!appliedCells.has(key)) {
            cell.textContent = style.text;
            cell.style.color = style.fontColor || '';
            cell.style.backgroundColor = style.backgroundColor || '';
            cell.style.fontSize = style.fontSize || '';
            cell.style.fontWeight = style.fontWeight || '';

            cell.rowSpan = style.rowSpan || 1;
            cell.colSpan = style.colSpan || 1;

            appliedCells.add(key); // Mark cell as processed
          } else {
            cell.textContent = ''; // Clear duplicate cells
          }
        } else {
          // Clear any cell that is not in the styles
          cell.textContent = '';
          cell.style.color = '';
          cell.style.backgroundColor = '';
          cell.style.fontSize = '';
          cell.style.fontWeight = '';
          cell.rowSpan = 1;
          cell.colSpan = 1;
        }
      }
    }

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();
