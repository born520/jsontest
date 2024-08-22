// 테이블을 생성하고 병합 정보를 적용하는 함수
function createTable(values, mergeInfo) {
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';

  // 테이블 행과 셀 생성
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
    });
    table.appendChild(tr);
  });

  // 병합 정보 적용
  mergeInfo.forEach(info => {
    const { row, column, rowSpan, colSpan, text } = info;
    const tableRows = table.getElementsByTagName('tr');

    if (row >= tableRows.length) return; // 예외 처리

    const rowElement = tableRows[row];
    if (column >= rowElement.getElementsByTagName('td').length) return; // 예외 처리

    const cell = rowElement.getElementsByTagName('td')[column];
    cell.textContent = text;
    cell.rowSpan = rowSpan;
    cell.colSpan = colSpan;

    // 병합된 셀의 위치에 있는 다른 셀에서 텍스트를 지웁니다.
    for (let r = row; r < row + rowSpan; r++) {
      if (r >= tableRows.length) continue; // 예외 처리

      const rowElement = tableRows[r];
      for (let c = column; c < column + colSpan; c++) {
        if (c >= rowElement.getElementsByTagName('td').length) continue; // 예외 처리

        if (r === row && c === column) continue; // 현재 셀은 건드리지 않음
        
        rowElement.getElementsByTagName('td')[c].textContent = '';
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
