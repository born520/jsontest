async function fetchData() {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbyNWfIP7djqCOwtvpklzzDY1f45qqTCK3AEk1DWkI9FOeyzpxzNxnO1t6nJlUy0ZAoc0w/exec");
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderTable(data) {
    const tableContainer = document.getElementById('table-container');
    const table = document.createElement('table');

    data.values.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, colIndex) => {
            const td = document.createElement('td');
            td.innerText = cell;

            // Apply styles
            td.style.backgroundColor = data.backgrounds[rowIndex][colIndex];
            td.style.color = data.fontColors[rowIndex][colIndex];
            td.style.fontSize = data.fontSizes[rowIndex][colIndex] + 'px';
            td.style.fontWeight = data.fontWeights[rowIndex][colIndex];
            td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex];
            td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex];

            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    // Apply merged cells
    data.mergeInfo.forEach(merge => {
        const cell = table.rows[merge.row].cells[merge.column];
        cell.rowSpan = merge.rowSpan;
        cell.colSpan = merge.colSpan;

        // Remove cells that have been merged
        for (let i = 0; i < merge.rowSpan; i++) {
            for (let j = 0; j < merge.colSpan; j++) {
                if (i === 0 && j === 0) continue;
                table.rows[merge.row + i].deleteCell(merge.column);
            }
        }
    });

    tableContainer.appendChild(table);
}

// Fetch and render data on page load
fetchData();
