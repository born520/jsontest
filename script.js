async function fetchData() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxeJFOU1P_Nf_oq8KZal818DXpuqET-HlONezi9KpYXHDaj0QhjsvPRK9TALujAMMQNtg/exec');
    const data = await response.json();
    const { values, mergeInfo } = data;

    const table = document.getElementById('data-table');

    if (!values.length) return; // No data

    const numRows = values.length;
    const numCols = values[0].length;

    // Create table structure
    const cells = [];
    for (let r = 0; r < numRows; r++) {
      const tr = document.createElement('tr');
      cells[r] = [];
      for (let c = 0; c < numCols; c++) {
        const td = document.createElement('td');
        td.classList.add('empty'); // Initially mark as empty
        tr.appendChild(td);
        cells[r][c] = td;
      }
      table.appendChild(tr);
    }

    // Apply merge and styling information
    mergeInfo.forEach(({ row, column, rowSpan, colSpan, text, fontColor, backgroundColor, fontSize, fontWeight }) => {
      // Adjust to zero-based index
      const startRow = row;
      const startCol = column;

      for (let r = startRow; r < startRow + rowSpan; r++) {
        for (let c = startCol; c < startCol + colSpan; c++) {
          const cell = cells[r][c];

          // Set cell text only in the first cell of the merge
          if (r === startRow && c === startCol) {
            cell.textContent = text;
            cell.style.color = fontColor || '';
            cell.style.backgroundColor = backgroundColor || '';
            cell.style.fontSize = fontSize || '';
            cell.style.fontWeight = fontWeight || '';
            cell.rowSpan = rowSpan;
            cell.colSpan = colSpan;
            cell.classList.remove('empty');
          } else {
            // Empty text for merged cells
            cell.textContent = '';
            cell.classList.add('empty');
          }
        }
      }
    });

    // Fill in any text values not covered by mergeInfo
    values.forEach((row, r) => {
      row.forEach((value, c) => {
        if (cells[r][c].textContent === '') {
          cells[r][c].textContent = value;
          cells[r][c].classList.remove('empty');
        }
      });
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();
