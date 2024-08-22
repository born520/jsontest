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
    const tbody = document.createElement('tbody');

    // 테이블 헤더와 데이터 행 생성
    data.values.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');

        row.forEach((cell, cellIndex) => {
            const td = document.createElement(rowIndex === 0 ? 'th' : 'td');
            td.textContent = cell;
            
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
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

// 페이지 로드 후 데이터 가져오기
document.addEventListener('DOMContentLoaded', fetchTableData);
