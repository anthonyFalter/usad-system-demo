// src/components/tables/paginated-table.js
(() => {
  window.USAD_TABLES = window.USAD_TABLES || {};

  /**
   * Generates a reusable paginated data table component markup.
   * @param {Object} options
   * @param {string} options.id - Unique container ID or data attribute
   * @param {Array<{key: string, label: string, sortable?: boolean, align?: string}>} options.columns
   * @param {Array<Object>} options.data - All dataset items
   * @param {number} options.currentPage - Current active 1-indexed page
   * @param {number} options.pageSize - Rows per page
   * @param {string} options.searchQuery - Current search string
   * @param {Function} options.renderRow - Callback (item, index) => string (HTML for <tr>)
   * @param {string} options.emptyMessage - Text when data is empty
   * @param {string} options.ariaLabel - Table accessible label
   */
  function renderPaginatedTable({
    id = "generic-table",
    columns = [],
    data = [],
    currentPage = 1,
    pageSize = 8,
    renderRow,
    emptyMessage = "No matching records found.",
    ariaLabel = "Data Table"
  }) {
    const totalRecords = data.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalRecords);
    const pageRows = data.slice(startIndex, endIndex);

    const theadHtml = columns.map(col => `
      <th scope="col" style="${col.align ? `text-align: ${col.align};` : ''}">${col.label}</th>
    `).join('');

    let tbodyHtml = '';
    if (pageRows.length === 0) {
      tbodyHtml = `<tr><td colspan="${columns.length}" class="table-empty-cell">${emptyMessage}</td></tr>`;
    } else {
      tbodyHtml = pageRows.map((row, idx) => renderRow(row, startIndex + idx)).join('');
    }

    return `
      <div class="usad-paginated-table-container" data-table-id="${id}">
        <div class="table-responsive-wrapper">
          <table class="usad-data-table" aria-label="${ariaLabel}">
            <thead>
              <tr>${theadHtml}</tr>
            </thead>
            <tbody id="${id}-tbody">
              ${tbodyHtml}
            </tbody>
          </table>
        </div>
        <div class="usad-table-pagination" role="navigation" aria-label="Pagination Navigation">
          <div class="usad-pagination-info">
            Showing <strong>${totalRecords === 0 ? 0 : startIndex + 1}</strong> to <strong>${endIndex}</strong> of <strong>${totalRecords}</strong> entries
          </div>
          <div class="usad-pagination-controls">
            <button type="button" class="usad-page-btn" data-table-action="prev-page" data-target-table="${id}" ${safePage <= 1 ? "disabled" : ""} aria-label="Previous Page">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              <span>Prev</span>
            </button>
            <span class="usad-page-indicator">Page <strong>${safePage}</strong> of <strong>${totalPages}</strong></span>
            <button type="button" class="usad-page-btn" data-table-action="next-page" data-target-table="${id}" ${safePage >= totalPages ? "disabled" : ""} aria-label="Next Page">
              <span>Next</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Helper to export table dataset to CSV
   */
  function exportToCsv(filename, headers, rows) {
    const csvRows = [];
    csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(","));
    
    rows.forEach(row => {
      csvRows.push(row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Helper to trigger formatted printable PDF view
   */
  function exportToPdf(title, subtitle, tableElementId) {
    const tableEl = document.getElementById(tableElementId) || document.querySelector(`[data-table-id="${tableElementId}"]`);
    if (!tableEl) return;

    const printWin = window.open("", "_blank", "width=900,height=650");
    if (!printWin) {
      window.print();
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 24px; color: #1e293b; }
          .header { border-bottom: 2px solid #2FD9A8; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .meta { font-size: 11px; color: #64748b; text-align: right; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
          th { background: #f8fafc; color: #475569; font-weight: 600; text-align: left; padding: 8px 10px; border-bottom: 1px solid #cbd5e1; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
          tr:nth-child(even) { background: #f8fafc; }
          .brand { font-weight: 800; color: #059669; }
          @media print {
            @page { margin: 1.5cm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">SARAZA TRD TRANSPORT SERVICES CORP. · USAD SYSTEM</div>
            <h1 class="title">${title}</h1>
            <div class="subtitle">${subtitle || ''}</div>
          </div>
          <div class="meta">
            <div>Generated: ${new Date().toLocaleString()}</div>
            <div>Official Audit & Operations Report</div>
          </div>
        </div>
        ${tableEl.querySelector("table") ? tableEl.querySelector("table").outerHTML : tableEl.outerHTML}
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
  }

  window.USAD_TABLES.renderPaginatedTable = renderPaginatedTable;
  window.USAD_TABLES.exportToCsv = exportToCsv;
  window.USAD_TABLES.exportToPdf = exportToPdf;
})();

