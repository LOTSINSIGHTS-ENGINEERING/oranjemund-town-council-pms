const backgroundColor = "#F2F2F2";
const tableBordersNone = [false, false, false, false];

// Fonts
const h1FontSize = 14;
const h3FontSize = 10;
const bodyFontSize = 10;

export const projectMembers = (displayName: string[]) => {
  const docDef = {
    text: `${displayName + " ,"}`,
    style: "subheader",
    fontSize: h1FontSize,
  };
  return docDef;
};

export const header = (title: string) => {
  const docDef = {
    text: title,
    style: "subheader",
    fontSize: h1FontSize,
  };
  return docDef;
};

export const sectionHeader = (title: string, content?: string) => {
  const docDef = {
    style: "sectionHeader",
    table: {
      widths: ["*", "auto"],
      body: [
        [
          {
            text: title,
            margin: [5, 0],
            padding: [0, 0],
          },
          {
            text: content ? content : "",
            noWrap: true,
            margin: [0, 0, 5, 0],
            padding: [0, 0],
          },
        ],
      ],
    },
    layout: "noBorders",
  };
  return docDef;
};

export const subSectionHeader = (title: string, content?: string) => {
  const docDef = {
    style: "subSectionHeader",
    table: {
      widths: ["*", "auto"],
      body: [
        [
          {
            text: title,
            margin: [5, 2],
            fontSize: bodyFontSize,
          },
          {
            text: content ? content : "",
            margin: [5, 2],
            noWrap: true,
            fontSize: bodyFontSize,
          },
        ],
      ],
    },
    layout: "noBorders",
  };
  return docDef;
};

export const boldText = (content: string) => {
  const docDef = {
    text: content,
    bold: true,
    fontSize: h3FontSize,
    margin: [0, 5, 0, 0],
  };
  return docDef;
};

export const bodyText = (content: string) => {
  const docDef = {
    text: content,
    fontSize: 10,
    margin: [0, 5, 0, 0],
  };
  return docDef;
};
export const signatureHeader = () => {
  const docDef = {
    style: "signature",
    text: "Approved By:",
    fontSize: bodyFontSize,
    bold: true,
  };
  return docDef;
};
export const signatureTable = (supervivor?: string) => {
  const docDef = {
    style: "signatureTable",
    table: {
      widths: ["auto", "*", "auto", "*"],
      body: [
        [
          {
            border: tableBordersNone,
            text: "Print name:",
            bold: true,
            fontSize: bodyFontSize,
          },
          {
            border: [false, false, false, true],
            text: supervivor ? supervivor : "",
            bold: true,
            fontSize: bodyFontSize,
            noWrap: true,
          },
          {
            border: tableBordersNone,
            text: "Signature:",
            bold: true,
            fontSize: bodyFontSize,
          },
          {
            border: [false, false, false, true],
            text: "",
            bold: true,
            fontSize: bodyFontSize,
            noWrap: true,
          },
        ],
      ],
    },
  };
  return docDef;
};

export const departmentSignatureTable = () => {
  const docDef = {
    style: "signatureTable",
    table: {
      widths: ["*", "*", "*"],
      body: [
        [
          {
            border: [false, false, false, false],
            text: "CEO :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            margin: [0, 30],
          },
          {
            border: [false, false, false, false],
            text: "Signature :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            noWrap: true,
            margin: [0, 30],
          },
          {
            border: [false, false, false, false],
            text: "Date :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            margin: [0, 30],
          },
        ],

        [
          {
            border: [false, false, false, false],
            text: "Manager :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
          },
          {
            border: [false, false, false, false],
            text: "Signature :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            noWrap: true,
          },
          {
            border: [false, false, false, false],
            text: "Date :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
          },
        ],
      ],
    },
  };
  return docDef;
};

export const individualSignatureTable = () => {
  const docDef = {
    style: "signatureTable",
    table: {
      widths: ["*", "*", "*"],
      body: [
        [
          {
            border: [false, false, false, false],
            text: "Supervisor:..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            margin: [0, 30],
          },
          {
            border: [false, false, false, false],
            text: "Signature :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            noWrap: true,
            margin: [0, 30],
          },
          {
            border: [false, false, false, false],
            text: "Date :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            margin: [0, 30],
          },
        ],

        [
          {
            border: [false, false, false, false],
            text: "Employee :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
          },
          {
            border: [false, false, false, false],
            text: "Signature :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            noWrap: true,
          },
          {
            border: [false, false, false, false],
            text: "Date :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
          },
        ],
      ],
    },
  };
  return docDef;
};
export const companySignatureTable = () => {
  const docDef = {
    style: "signatureTable",
    table: {
      widths: ["*", "*", "*"],
      body: [
        [
          {
            border: [false, false, false, false],
            text: "Chairperson of management committee/mayor :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            margin: [0, 30],
          },
          {
            border: [false, false, false, false],
            text: "Signature :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            noWrap: true,
            margin: [0, 30],
          },
          {
            border: [false, false, false, false],
            text: "Date :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            margin: [0, 30],
          },
        ],

        [
          {
            border: [false, false, false, false],
            text: "CEO :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
          },
          {
            border: [false, false, false, false],
            text: "Signature :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
            noWrap: true,
          },
          {
            border: [false, false, false, false],
            text: "Date :..........................................................................................",
            bold: true,
            fontSize: bodyFontSize,
          },
        ],
      ],
    },
  };
  return docDef;
};

export const marginTopBottom = () => {
  const docRef = {
    text: "",
    margin: [0, 10],
  };
  return docRef;
};

const brandLogo = async () => {
  return {
    style: "brandLogo",
    image: await getBase64ImageFromURL(
      `${process.env.PUBLIC_URL}/unicomms.png`
    ),
    fit: [76, 76],
  };
};

const ScorecardDocDefinition = async (
  scorecardName: string,
  objectiveDocRef: any
) => {
  return {
    // layout
    pageMargins: [40, 40, 40, 60], // [left, top, right, bottom]

    footer: {
      columns: [
        {
          image: await getBase64ImageFromURL(
            `${process.env.PUBLIC_URL}/unicomms.png`
          ),
          width: 100,
          height: 60,
        },
      ],
    },

    content: [
      // Logo
      await brandLogo(),

      // Header
      marginTopBottom(),
      header(`Performance Report | ${scorecardName}`), // Username, Scorecard year
      sectionHeader("Introduction"),
      bodyText(
        `This document highlights the performance of ${scorecardName}` // Username, Scorecard year
      ),
      sectionHeader("Objectives", ""), // Objectives overall
      bodyText("This section is for evaluating accomplishments of goals. "),
      bodyText(
        "The weights for the goals in this section must add up to 100, and there must be a rating for each goal before the form is sent for signatures"
      ),

      // Objectives
      ...objectiveDocRef,

      // Signatures
      signatureHeader(),
      signatureTable(""), // Supervisor
    ],

    styles: {
      brandLogo: {
        alignment: "right",
      },
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 15, 0, 5],
      },
      sectionHeader: {
        fontSize: 12,
        margin: [0, 15, 0, 5],
        border: [false, false, false, false],
        bold: true,
        fillColor: backgroundColor,
      },
      subSectionHeader: {
        fontSize: 12,
        margin: 0,
        border: [false, false, false, false],
        bold: true,
        fillColor: backgroundColor,
      },
      signature: {
        margin: [0, 30, 0, 5],
      },
      signatureTable: {
        margin: [0, 5, 0, 5],
      },
    },
    defaultStyle: {
      // alignment: 'justify'
    },
  };
};

export default ScorecardDocDefinition;

const getBase64ImageFromURL = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = url;
  });
};
