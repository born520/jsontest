// JSON 데이터를 기반으로 테이블을 생성하고 병합하는 함수
function createTable(values, mergeInfo) {
  // 테이블과 테이블 헤더 생성
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';

  const numRows = values.length;
  const numCols = values[0].length;

  // 행과 셀을 생성
  const cells = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => null));
  
  values.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    row.forEach((cell, colIndex) => {
      const td = document.createElement('td');
      td.textContent = cell;
      td.style.border = '1px solid black';
      td.style.padding = '8px';
      td.dataset.rowIndex = rowIndex;
      td.dataset.colIndex = colIndex;
      tr.appendChild(td);
      cells[rowIndex][colIndex] = td;
    });
    table.appendChild(tr);
  });

  // 병합 정보 적용
  mergeInfo.forEach(info => {
    const { row, column, rowSpan, colSpan, text } = info;
    const cell = cells[row][column];

    // 셀의 텍스트와 병합 범위를 설정
    cell.textContent = text;
    cell.rowSpan = rowSpan;
    cell.colSpan = colSpan;

    // 병합된 셀 외의 영역에 있는 셀을 비웁니다.
    for (let r = row; r < row + rowSpan; r++) {
      for (let c = column; c < column + colSpan; c++) {
        if (r === row && c === column) continue; // 병합 시작 셀은 건드리지 않음
        if (r >= numRows || c >= numCols) continue; // 범위 초과 예외 처리
        cells[r][c].textContent = '';
      }
    }
  });

  document.body.appendChild(table);
}

// JSON 데이터 요청 및 처리
fetch('https://script.google.com/macros/s/AKfycbxeJFOU1P_Nf_oq8KZal818DXpuqET-HlONezi9KpYXHDaj0QhjsvPRK9TALujAMMQNtg/exec')
  .then(response => response.json())
  .then(data => {
    const { values, mergeInfo } = data;

    // 콘솔에서 데이터를 확인합니다.
    console.log('Values:', values);
    console.log('Merge Info:', mergeInfo);
    
    createTable(values, mergeInfo);
  })
  .catch(error => console.error('Error fetching data:', error));
