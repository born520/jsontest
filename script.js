// Google Apps Script 웹 앱 URL
const apiUrl = 'https://script.google.com/macros/s/AKfycbzy56rgQQq25s-qfBBtPDKJBxqn4vJyNO6roat92sOP43u8ukmreGvLSobDCCs8r5oXfw/exec';

// 데이터를 가져와서 테이블을 생성하는 함수
async function fetchTableData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        createTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// 데이터를 기반으로 테이블을 생성하는 함수
function createTable(data) {
    const container = document.getElementById('table-container');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const numRows = data.values.length;
    const numCols = data.values[0].length;

    // 테이블 헤더 생성
    const theadTr = document.createElement('tr');
    for (let cellIndex = 0; cellIndex < numCols; cellIndex++) {
        const th = document.createElement('th');
        th.textContent = data.values[0][cellIndex] || ''; // 첫 번째 행은 헤더로 간주
        if (data.backgrounds[0][cellIndex]) {
            th.style.backgroundColor = data.backgrounds[0][cellIndex];
        }
        if (data.fontColors[0][cellIndex]) {
            th.style.color = data.fontColors[0][cellIndex];
        }
        if (data.fontSizes[0][cellIndex]) {
            th.style.fontSize = `${data.fontSizes[0][cellIndex]}px`;
        }
        if (data.fontWeights[0][cellIndex]) {
            th.style.fontWeight = data.fontWeights[0][cellIndex];
        }
        if (data.horizontalAlignments[0][cellIndex]) {
            th.style.textAlign = data.horizontalAlignments[0][cellIndex];
        }
        if (data.verticalAlignments[0][cellIndex]) {
            th.style.verticalAlign = data.verticalAlignments[0][cellIndex];
        }
        theadTr.appendChild(th);
    }
    thead.appendChild(theadTr);

    // 테이블 본문 생성
    for (let rowIndex = 1; rowIndex < numRows; rowIndex++) {
        const tr = document.createElement('tr');
        for (let cellIndex = 0; cellIndex < numCols; cellIndex++) {
            const cellValue = data.values[rowIndex][cellIndex];
            const td = document.createElement('td');
            td.textContent = cellValue;

            // 스타일 적용
            if (data.backgrounds[rowIndex] && data.backgrounds[rowIndex][cellIndex]) {
                td.style.backgroundColor = data.backgrounds[rowIndex][cellIndex];
            }
            if (data.fontColors[rowIndex] && data.fontColors[rowIndex][cellIndex]) {
                td.style.color = data.fontColors[rowIndex][cellIndex];
            }
            if (data.fontSizes[rowIndex] && data.fontSizes[rowIndex][cellIndex]) {
                td.style.fontSize = `${data.fontSizes[rowIndex][cellIndex]}px`;
            }
            if (data.fontWeights[rowIndex] && data.fontWeights[rowIndex][cellIndex]) {
                td.style.fontWeight = data.fontWeights[rowIndex][cellIndex];
            }
            if (data.horizontalAlignments[rowIndex] && data.horizontalAlignments[rowIndex][cellIndex]) {
                td.style.textAlign = data.horizontalAlignments[rowIndex][cellIndex];
            }
            if (data.verticalAlignments[rowIndex] && data.verticalAlignments[rowIndex][cellIndex]) {
                td.style.verticalAlign = data.verticalAlignments[rowIndex][cellIndex];
            }

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    // 셀 병합 적용
    applyCellMerge(data.mergeInfo, table);
}

// 셀 병합을 적용하는 함수
function applyCellMerge(mergeInfo, table) {
    mergeInfo.forEach(({ row, column, rowSpan, colSpan }) => {
        const cell = table.querySelector(`tbody tr:nth-child(${row + 1}) td:nth-child(${column + 1})`);
        if (cell) {
            cell.rowSpan = rowSpan;
            cell.colSpan = colSpan;
        }
    });
}

// 페이지 로드 후 데이터 가져오기
document.addEventListener('DOMContentLoaded', fetchTableData);
