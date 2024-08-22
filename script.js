document.addEventListener('DOMContentLoaded', () => {
    fetch('https://script.google.com/macros/s/AKfycbyf3xjZp5KL_j-aJIB1W-WfiWfakGnUUGj7ZaUrMazdBj1lfR4xVxLWZqSjZE3iso2FTA/exec')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('data-table');
            const { headers, cellData, mergeInfo } = data;

            // Create table header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Create table body
            const tbody = document.createElement('tbody');
            cellData.forEach(rowData => {
                const row = document.createElement('tr');
                rowData.forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData || '';
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            // Handle cell merges
            mergeInfo.forEach(merge => {
                const row = table.querySelector(`tbody tr:nth-child(${merge.row + 1})`);
                const cell = row.querySelector(`td:nth-child(${merge.column + 1})`);
                cell.rowSpan = merge.rowSpan;
                cell.colSpan = merge.colSpan;
                cell.textContent = merge.text || '';
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
