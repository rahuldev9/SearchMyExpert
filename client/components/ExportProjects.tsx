"use client";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

export default function ExportApplicants({
  applicants,
}: {
  applicants: any[];
}) {
  const tableData = applicants.map((app) => ({
    Name: app.expertId?.name || "Unknown",
    Email: app.expertId?.email || "-",
    Status: app.status || "Pending",
  }));

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(new Blob([buffer]), "applicants.xlsx");
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const csv = XLSX.utils.sheet_to_csv(ws);

    saveAs(new Blob([csv]), "applicants.csv");
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    const rows = applicants.map((a) => [
      a.expertId?.name || "Unknown",
      a.expertId?.email || "-",
      a.status || "Pending",
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Status"]],
      body: rows,
    });

    doc.save("applicants.pdf");
  };

  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={exportExcel}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Excel
      </button>

      <button
        onClick={exportPDF}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        PDF
      </button>

      <button
        onClick={exportCSV}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg"
      >
        CSV
      </button>
    </div>
  );
}
