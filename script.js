document.addEventListener("DOMContentLoaded", function() {
    // JSON 데이터 가져오기
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

    // 데이터 테이블 렌더링
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
        const cell = table.rows[merge.row - 1].cells[merge.column - 1];
        cell.rowSpan = merge.numRows;
        cell.colSpan = merge.numColumns;
        cell.classList.add('merged-cell');
        
        // 병합된 셀 내의 병합된 부분은 숨기기
        for (let r = merge.row; r < merge.row + merge.numRows; r++) {
            for (let c = merge.column; c < merge.column + merge.numColumns; c++) {
                if (r === merge.row && c === merge.column) continue;
                table.rows[r - 1].deleteCell(c - merge.column);
            }
        }
    });

    tableContainer.appendChild(table);
}
