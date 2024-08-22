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
            // 각 배열에 인덱스가 존재하는지 확인
            if (data.backgrounds[rowIndex] && data.backgrounds[rowIndex][colIndex] !== undefined &&
                data.fontColors[rowIndex] && data.fontColors[rowIndex][colIndex] !== undefined &&
                data.fontSizes[rowIndex] && data.fontSizes[rowIndex][colIndex] !== undefined &&
                data.fontWeights[rowIndex] && data.fontWeights[rowIndex][colIndex] !== undefined &&
                data.horizontalAlignments[rowIndex] && data.horizontalAlignments[rowIndex][colIndex] !== undefined &&
                data.verticalAlignments[rowIndex] && data.verticalAlignments[rowIndex][colIndex] !== undefined &&
                data.borders[rowIndex] && data.borders[rowIndex][colIndex] !== undefined) {

                if (!isMergedCell(mergedCells, rowIndex + 1, colIndex + 1)) {
                    const td = document.createElement("td");
                    td.textContent = cell;
                    applyStyles(td, {
                        background: data.backgrounds[rowIndex][colIndex],
                        fontColor: data.fontColors[rowIndex][colIndex],
                        fontSize: data.fontSizes[rowIndex][colIndex],
                        fontWeight: data.fontWeights[rowIndex][colIndex],
                        hAlign: data.horizontalAlignments[rowIndex][colIndex],
                        vAlign: data.verticalAlignments[rowIndex][colIndex],
                        border: data.borders[rowIndex][colIndex],
                    });
                    tr.appendChild(td);
                }
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
    td.style.backgroundColor = cellData.background;
    td.style.color = cellData.fontColor;
    td.style.fontSize = `${cellData.fontSize}px`;
    td.style.fontWeight = cellData.fontWeight;
    td.style.textAlign = cellData.hAlign;
    td.style.verticalAlign = cellData.vAlign;
    td.style.border = cellData.border ? "1px solid black" : "none";
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
