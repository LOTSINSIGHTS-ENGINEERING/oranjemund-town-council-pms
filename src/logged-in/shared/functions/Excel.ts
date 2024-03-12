import { IMeasure } from "../../../shared/models/Measure";
import { IMeasureCompany } from "../../../shared/models/MeasureCompany";
import { IMeasureDepartment } from "../../../shared/models/MeasureDepartment";
import { IObjective } from "../../../shared/models/Objective";
import { IScorecardMetadata } from "../../../shared/models/ScorecardMetadata";
import { exportCompanyScorecardExcel } from "./ExcelCompany";
import { exportDepartmentScorecardExcel } from "./ExcelDepartment";
import { exportEmployeeScorecardExcel } from "./ExcelEmployee";
import { exportPerformanceStatusOverview } from "./ExcelPerformanceOverview";

export const exportCompanyExcelScorecard = async (
  title: string,
  objectives: IObjective[],
  measures: IMeasureCompany[]
) => {
  await exportCompanyScorecardExcel(title, objectives, measures);
};

export const exportDepartmentExcelScorecard = async (
  title: string,
  objectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasureDepartment[]
) => {
  await exportDepartmentScorecardExcel(
    title,
    objectives,
    contributoryObjectives,
    measures
  );
};

export const exportEmployeeExcelScorecard = async (
  title: string,
  objectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasure[]
) => {
  await exportEmployeeScorecardExcel(
    title,
    objectives,
    contributoryObjectives,
    measures
  );
};

// export the performance overview report
export const exportPerformanceOverview = async (
  scorecards: IScorecardMetadata[]
) => {
  await exportPerformanceStatusOverview("Performance Overview", scorecards);
};
