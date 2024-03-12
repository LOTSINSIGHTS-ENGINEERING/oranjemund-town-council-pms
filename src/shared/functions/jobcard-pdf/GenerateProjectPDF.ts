import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { IProject } from "../../models/ProjectManagement";
import { IProjectRisk } from "../../models/ProjectRisks";
import { IProjectTask } from "../../models/ProjectTasks";
import AppStore from "../../stores/AppStore";
import { ProjectDocumentPDF } from "../scorecard-pdf/ProjectDocumentPDF";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export const generateProjectPDF = async (
  project: IProject,
  milestones: IProjectTask[],
  tasks: IProjectTask[],
  risks: IProjectRisk[],
  store: AppStore
) => {
  const newWindow = window.open();
  pdfMake
    .createPdf(
      (await ProjectDocumentPDF(
        project,
        milestones,
        tasks,
        risks,
        store
      )) as any
    )
    .open({}, newWindow);
};
