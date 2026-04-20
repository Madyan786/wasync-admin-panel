import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export to CSV
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

// Export to Excel
export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Export to PDF
export const exportToPDF = (data, filename, title = 'Report') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Create table
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => row[header]));
  
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    theme: 'striped',
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: 255,
    },
  });
  
  doc.save(`${filename}.pdf`);
};

// Format data for export
export const formatDataForExport = (data, fields) => {
  return data.map(item => {
    const formatted = {};
    fields.forEach(field => {
      formatted[field.label] = field.format ? field.format(item[field.key]) : item[field.key];
    });
    return formatted;
  });
};
