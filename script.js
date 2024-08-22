document.addEventListener("DOMContentLoaded", function() {
    fetch("https://script.google.com/macros/s/AKfycbxSc8spe2uAcZBcOKPq94E58C1HYJRMMc1y3S7-iZnvBxeWSQ05GaSWKspuWb9BuwC8eQ/exec") // 여기에 실제 웹앱 URL을 입력합니다.
        .then(response => response.json())
        .then(data => {
            renderTable(data); // 테이블 렌더링 함수 호출
        })
        .catch(error => console.error('Error:', error));
});

function renderTable(data) {
    const tableContainer = document.getElementById('table-container');
    const table = document.createElement('table');

    data.tableData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, colIndex) => {
            const td = document.createElement('td');
            td.textContent = cell.value;

            // 스타일 적용
            td.style.backgroundColor = cell.background;
            td.style.color = cell.fontColor;
            td.style.fontSize = `${cell.fontSize}px`;
            td.style.fontWeight = cell.fontWeight;
            td.style.textAlign = cell.horizontalAlignment;
            td.style.verticalAlign = cell.verticalAlignment;

            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    // 병합된 셀 적용
    data.mergedCells.forEach(merge => {
        const baseCell = table.rows[merge.row - 1].cells[merge.column - 1];
        baseCell.rowSpan = merge.numRows;
        baseCell.colSpan = merge.numColumns;
        baseCell.classList.add('merged-cell');

        // 병합된 셀 내의 병합된 부분은 숨기기
        for (let r = 0; r < merge.numRows; r++) {
            for (let c = 0; c < merge.numColumns; c++) {
                if (r === 0 && c === 0) continue;
                const targetRow = table.rows[merge.row - 1 + r];
                if (targetRow) {
                    const targetCell = targetRow.cells[merge.column - 1];
                    if (targetCell) {
                        targetRow.deleteCell(merge.column - 1);
                    }
                }
            }
        }
    });

    tableContainer.appendChild(table);
}
