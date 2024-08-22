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
    const backgrounds = data.backgrounds[rowIndex] || [];
    const fontColors = data.fontColors[rowIndex] || [];
    const fontSizes = data.fontSizes[rowIndex] || [];
    const fontWeights = data.fontWeights[rowIndex] || [];
    const horizontalAlignments = data.horizontalAlignments[rowIndex] || [];
    const verticalAlignments = data.verticalAlignments[rowIndex] || [];
    const borders = data.borders[rowIndex] || [];

    const background = backgrounds[colIndex] || null;
    const fontColor = fontColors[colIndex] || null;
    const fontSize = fontSizes[colIndex] || null;
    const fontWeight = fontWeights[colIndex] || null;
    const hAlign = horizontalAlignments[colIndex] || null;
    const vAlign = verticalAlignments[colIndex] || null;
    const border = borders[colIndex] || null;

    if (background) td.style.backgroundColor = background;
    if (fontColor) td.style.color = fontColor;
    if (fontSize) td.style.fontSize = `${fontSize}px`;
    if (fontWeight) td.style.fontWeight = fontWeight;
    if (hAlign) td.style.textAlign = hAlign;
    if (vAlign) td.style.verticalAlign = vAlign;
    if (border) td.style.border = "1px solid black";
}

function mergeCells(table, row, col, numRows, numCols) {
    const cell = table.rows[row].cells[col];
    if (!cell) {
        console.error(`No cell found at row ${row}, column ${col} to merge.`);
        return;
    }
    cell.rowSpan = numRows;
    cell.colSpan = numCols;

    for (let i = row; i < row + numRows; i++) {
        for (let j = col; j < col + numCols; j++) {
            if (i === row && j === col) continue;
            if (table.rows[i] && table.rows[i].cells[j - col]) {
                table.rows[i].deleteCell(j - col);
            }
        }
    }
}

fetchData();
