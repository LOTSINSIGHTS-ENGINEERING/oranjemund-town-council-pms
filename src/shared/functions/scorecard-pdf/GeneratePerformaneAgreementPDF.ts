import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { IMeasure } from "../../models/Measure";
import { IMeasureCompany } from "../../models/MeasureCompany";
import { IMeasureDepartment } from "../../models/MeasureDepartment";
import { IObjective } from "../../models/Objective";
import { CompanyPerformanceAgreementDocument } from "./CompanyPerformanceAgreementDocument ";
import { DepartmentPerformanceAgreementDocument } from "./DepartmentPerformanceAgreementDocument";
import { IndividualPerformanceAgreementDocument } from "./IndividualPerformanceAgreementDocument";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export const generateCompanyPerformanceAgreementPDF = async (
  title: string,
  vision: string,
  mission: string,
  strategicObjectives: IObjective[],
  measures: IMeasureCompany[]
) => {
  const newWindow = window.open();
  pdfMake.createPdf(
      (await CompanyPerformanceAgreementDocument(
        title,
        vision,
        mission,
        strategicObjectives,
        measures
      )) as any
    )
    .open({}, newWindow);
};

export const generateDepartmentPerformanceAgreementPDF = async (
  title: string,
  vision: string,
  mission: string,
  strategicObjectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasureDepartment[],
  department:string
) => {
  const newWindow = window.open();
  pdfMake
    .createPdf(
      (await DepartmentPerformanceAgreementDocument(
        title,
        vision,
        mission,
        strategicObjectives,
        contributoryObjectives,
        measures,
        department
      )) as any
    )
    .open({}, newWindow);
};

export const generateIndividualPerformanceAgreementPDF = async (
  title: string,
  vision: string,
  mission: string,
  strategicObjectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasure[],
  username: string,
  jobTilte:string,
  supervisor:string
) => {
  const newWindow = window.open();
  pdfMake
    .createPdf(
      (await IndividualPerformanceAgreementDocument(
        title,
        vision,
        mission,
        strategicObjectives,
        contributoryObjectives,
        measures,
        username, 
        jobTilte,
        supervisor
      )) as any
    )
    .open({}, newWindow);
};
