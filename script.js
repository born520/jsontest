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

    tableData.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        row.forEach((cell, colIndex) => {
            // 각 배열과 해당 인덱스가 유효한지 확인
            const background = data.backgrounds && data.backgrounds[rowIndex] && data.backgrounds[rowIndex][colIndex];
            const fontColor = data.fontColors && data.fontColors[rowIndex] && data.fontColors[rowIndex][colIndex];
            const fontSize = data.fontSizes && data.fontSizes[rowIndex] && data.fontSizes[rowIndex][colIndex];
            const fontWeight = data.fontWeights && data.fontWeights[rowIndex] && data.fontWeights[rowIndex][colIndex];
            const hAlign = data.horizontalAlignments && data.horizontalAlignments[rowIndex] && data.horizontalAlignments[rowIndex][colIndex];
            const vAlign = data.verticalAlignments && data.verticalAlignments[rowIndex] && data.verticalAlignments[rowIndex][colIndex];
            const border = data.borders && data.borders[rowIndex] && data.borders[rowIndex][colIndex];

            if (!isMergedCell(mergedCells, rowIndex + 1, colIndex + 1)) {
                const td = document.createElement("td");
                td.textContent = cell;
                applyStyles(td, {
                    background,
                    fontColor,
                    fontSize,
                    fontWeight,
                    hAlign,
                    vAlign,
                    border,
                });
                tr.appendChild(td);
            }
        });
        table.appendChild(tr);
    });

    mergedCells.forEach(merge => {
        mergeCells(table, merge.row - 1, merge.column - 1, merge.numRows, merge.numColumns);
    });

    tableContainer.appendChild(table);
}

function applyStyles(td, cellData) {
    if (cellData.background) td.style.backgroundColor = cellData.background;
    if (cellData.fontColor) td.style.color = cellData.fontColor;
    if (cellData.fontSize) td.style.fontSize = `${cellData.fontSize}px`;
    if (cellData.fontWeight) td.style.fontWeight = cellData.fontWeight;
    if (cellData.hAlign) td.style.textAlign = cellData.hAlign;
    if (cellData.vAlign) td.style.verticalAlign = cellData.vAlign;
    if (cellData.border) td.style.border = "1px solid black";
}

function isMergedCell(mergedCells, row, col) {
    return mergedCells.some(merge => {
        return (
            row >= merge.row &&
            row < merge.row + merge.numRows &&
            col >= merge.column &&
            col < merge.column + merge.numColumns
        );
    });
}

function mergeCells(table, row, col, numRows, numCols) {
    const cell = table.rows[row].cells[col];
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
