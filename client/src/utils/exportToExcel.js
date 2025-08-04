// src/utils/exportToExcel.js
import * as XLSX from "xlsx";

export function exportToExcel(borrowData) {
  // Format data with mapping
  const formattedData = borrowData.map((item, index) => ({
    "#": index + 1,
    "Book Title": item.book.title,
    "Author": item.book.author,
    "Category": item.book.category,
    "Borrower": item.user.name,
    "Email": item.user.email,
    "Qty": item.borrowed_quantity,
    "Status": item.status,
    "Borrow Date": item.borrow_date,
    "Return Date": item.return_date || "N/A",
    "Librarian": item.librarian.name,
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData, { origin: "A3" }); // Leave space for header metadata

  // Set column widths
  worksheet["!cols"] = [
    { wch: 5 },    // #
    { wch: 35 },   // Book Title
    { wch: 25 },   // Author
    { wch: 18 },   // Category
    { wch: 22 },   // Borrower
    { wch: 30 },   // Email
    { wch: 8 },    // Qty
    { wch: 15 },   // Status
    { wch: 15 },   // Borrow Date
    { wch: 15 },   // Return Date
    { wch: 22 },   // Librarian
  ];

  // Custom header metadata (Row 1 and 2)
  const titleCell = { r: 0, c: 0 };
  worksheet[XLSX.utils.encode_cell(titleCell)] = {
    t: "s",
    v: "Borrow Records Report",
    s: {
      font: { name: "Calibri", sz: 16, bold: true },
      fill: { fgColor: { rgb: "DDEBF7" } },
      alignment: { horizontal: "left", vertical: "center" },
    },
  };

  const dateCell = { r: 1, c: 0 };
  const currentDateTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(" at ", ", ") + " +07";
  worksheet[XLSX.utils.encode_cell(dateCell)] = {
    t: "s",
    v: `Generated on: ${currentDateTime}`,
    s: {
      font: { name: "Calibri", sz: 10 },
      alignment: { horizontal: "left", vertical: "center" },
    },
  };

  // Header row styling (Row 2)
  const header = [
    "#",
    "Book Title",
    "Author",
    "Category",
    "Borrower",
    "Email",
    "Qty",
    "Status",
    "Borrow Date",
    "Return Date",
    "Librarian",
  ];

  header.forEach((title, idx) => {
    const cellRef = XLSX.utils.encode_cell({ r: 2, c: idx });
    worksheet[cellRef] = {
      t: "s",
      v: title,
      s: {
        font: { name: "Calibri", bold: true, sz: 11 },
        fill: { fgColor: { rgb: "2C3E50" } }, // Dark blue-gray background
        fontColor: { rgb: "FFFFFF" }, // White text
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "999999" } },
          bottom: { style: "thin", color: { rgb: "999999" } },
          left: { style: "thin", color: { rgb: "999999" } },
          right: { style: "thin", color: { rgb: "999999" } },
        },
      },
    };
  });

  // Apply styling to content rows (starting from Row 3)
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let R = 3; R <= range.e.r; ++R) {
    for (let C = 0; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellRef];
      if (cell) {
        cell.s = {
          font: { name: "Calibri", sz: 10 },
          alignment: {
            vertical: "center",
            horizontal: C === 0 || C === 6 ? "center" : "left",
          },
          border: {
            top: { style: "thin", color: { rgb: "999999" } },
            bottom: { style: "thin", color: { rgb: "999999" } },
            left: { style: "thin", color: { rgb: "999999" } },
            right: { style: "thin", color: { rgb: "999999" } },
          },
          wrapText: true, // Enable text wrapping for better readability
        };
        // Highlight "Overdue" status in red
        if (C === 7 && cell.v.toLowerCase() === "overdue") {
          cell.s.fontColor = { rgb: "B00000" };
          cell.s.font.bold = true;
        }
      }
    }
  }

  // Freeze the header rows
  worksheet["!freeze"] = { xSplit: 0, ySplit: 3 }; // Freeze rows 1-3

  // Create workbook and save
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Borrow Records");
  XLSX.writeFile(workbook, `borrow_records_${new Date().toISOString().split("T")[0]}.xlsx`);
}