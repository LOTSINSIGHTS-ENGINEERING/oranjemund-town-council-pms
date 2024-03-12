import csv from "./file-icons/csv (2).png"
import _doc from "./file-icons/doc_4725970.png"
import docx from "./file-icons/docx_8361174.png"
import odp from "./file-icons/odp_10451906.png"
import odt from "./file-icons/odt_1975685.png"
import ods from "./file-icons/ods_9848919.png"
import pdf from "./file-icons/pdf_9496432.png"
import pptx from "./file-icons/pptx_10452012.png"
import ppt from "./file-icons/ppt_4726016.png"
import xls from "./file-icons/xls-file_9681350.png"
import _xlsx from "./file-icons/xlsx_8361467.png"
import d from "./file-icons/documentation_10517465.png"

export const getIconForExtension = (extension: string): string => {
    switch (extension.toLowerCase()) {
        case 'pdf':
            return pdf;
        case 'doc':
            return _doc;
        case 'docx':
            return docx;
        case 'xls':
            return xls;
        case 'xlsx':
            return _xlsx;
        case 'ppt':
            return ppt;
        case 'pptx':
            return pptx;
        case 'odt':
            return odt;
        case 'ods':
            return ods;
        case 'odp':
            return odp;
        case 'csv':
            return csv;
        default:
            return d;
    }
};
