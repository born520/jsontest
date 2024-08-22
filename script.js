async function fetchData() {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxSc8spe2uAcZBcOKPq94E58C1HYJRMMc1y3S7-iZnvBxeWSQ05GaSWKspuWb9BuwC8eQ/exec");
    const data = await response.json();
    renderTable(data);
}

function renderTable(data) {
    const tableContainer = document.getElementById("table-container");
    const table = document.createElement("table");
    const tableData = data.tableData;
    const mergedCells = data.mergedCells;

    // 1. 모든 셀 렌더링
    tableData.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        row.forEach((cell, colIndex) => {
            const td = document.createElement("td");
            td.textContent = cell;
            applyStyles(td, data, rowIndex, colIndex);
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    // 2. 병합된 셀 찾아내기
    mergedCells.forEach(merge => {
        mergeCells(table, merge.row - 1, merge.column - 1, merge.numRows, merge.numColumns);
    });

    tableContainer.appendChild(table);
}

function applyStyles(td, data, rowIndex, colIndex) {
    const background = data.backgrounds[rowIndex][colIndex];
    const fontColor = data.fontColors[rowIndex][colIndex];
    const fontSize = data.fontSizes[rowIndex][colIndex];
    const fontWeight = data.fontWeights[rowIndex][colIndex];
    const hAlign = data.horizontalAlignments[rowIndex][colIndex];
    const v
