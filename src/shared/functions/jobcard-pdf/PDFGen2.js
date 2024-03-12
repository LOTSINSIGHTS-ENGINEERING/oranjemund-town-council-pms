import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";

export function downloadPDFWithPDFMake() {
  var tableHeaderText = [
    ...document.querySelectorAll("#styledTable thead tr th"),
  ].map((thElement) => ({ text: thElement.textContent, style: "tableHeader" }));

  var tableRowCells = [
    ...document.querySelectorAll("#styledTable tbody tr td"),
  ].map((tdElement) => ({ text: tdElement.textContent, style: "tableData" }));
  var tableDataAsRows = tableRowCells.reduce((rows, cellData, index) => {
    if (index % 4 === 0) {
      rows.push([]);
    }

    rows[rows.length - 1].push(cellData);
    return rows;
  }, []);

  var docDefinition = {
    header: { text: "MLB World Series Winners", alignment: "center" },
    footer: function (currentPage, pageCount) {
      return {
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: "center",
      };
    },
    content: [
      {
        style: "tableExample",
        table: {
          headerRows: 1,
          body: [tableHeaderText, ...tableDataAsRows],
        },
        layout: {
          fillColor: function (rowIndex) {
            if (rowIndex === 0) {
              return "#0f4871";
            }
            return rowIndex % 2 === 0 ? "#f2f2f2" : null;
          },
        },
      },
    ],
    styles: {
      tableExample: {
        margin: [0, 20, 0, 80],
      },
      tableHeader: {
        margin: 12,
        color: "white",
      },
      tableData: {
        margin: 12,
      },
    },
  };
  pdfMake.createPdf(docDefinition).download("MLB World Series Winners");
}
