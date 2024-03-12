import {
  groupTasks,
  projectMilestonesTotal,
} from "../../../logged-in/project-management/utils/common";
import { moneyFormat } from "../../../logged-in/project-management/utils/formats";
import { IProject } from "../../models/ProjectManagement";
import { IProjectRisk } from "../../models/ProjectRisks";
import { IProjectTask } from "../../models/ProjectTasks";
import AppStore from "../../stores/AppStore";
import {
  marginTopBottom,
  header,
  sectionHeader,
  projectMembers,
} from "../jobcard-pdf/DocDefition";

type RowSpan = {
  text: string | any;
  rowSpan?: number;
  style?: string;
};

// // risks

// type RiskRow = [
//   string | number | RowSpan,
//   string | RowSpan,
//   string | RowSpan,
//   string | number | RowSpan,
//   string | number | RowSpan,
//   string | number | RowSpan,
// ];

// const riskTableWidths: RiskRow = [
//   100,
//   "*",
//   "*",
//   100,
//   100,
//   100,
// ];

// const riskTableHeader: RiskRow = [
//   "Risk",
//   "Description",
//   "Log Date",
//   "Resolution Date",
//   "Severity",
//   "Status",
// ];

// export interface IRiskTableRowItem {
//   riskName: string;
//   description: string;
//   logDate: string;
//   resolutionDate: string;
//   severity: string;
//   status: string;
// }

// const RiskTableRowItem = (risks: IProjectRisk[]) => {
//   const tableRows: IRiskTableRowItem[] = risks.map((risk) => {

//     const row: IRiskTableRowItem = {
//       riskName: risk ? risk.riskName : "",
//       description: risk ? risk.description : "",
//       logDate: risk ? risk.logDate : "",
//       resolutionDate: risk ? risk.resolutionDate : "",
//       severity: risk ? risk.severity : "",
//       status: risk ? risk.status : "",
//     };

//     return row;
//   });
//   return tableRows
// }

// const FormatRiskTableSpan = (_rows: IRiskTableRowItem[]) => {

//   const rows: RiskRow[] = _rows.map((row, _, data) => {

//     return [
//       row.riskName,
//       row.description,
//       row.logDate,
//       row.resolutionDate,
//       row.status,
//       row.severity,
//     ];
//   });

//   return rows;
// };

// tasks

const tableWidths: Row = [100, 100, "*", ["*"], "*", 100, 100, 100];

const tableHeader: Row = [
  "Milestones",
  "Progress (%)",
  "Tasks",
  ["Responsible Person"],
  "Description",
  "Start Date",
  "End Date",
  "Status ",
];

type Row = [
  string | number | RowSpan,
  string | number | RowSpan,
  string | number | RowSpan,
  string[],
  string,
  string | number | RowSpan,
  string | number | RowSpan,
  string | number | RowSpan
];

export interface ITableRowItem {
  milestoneName: string;
  progress: string | number;
  taskName: string;
  responsible: string[];
  description: string;
  startDate: string;
  endDate: string;
  status: string | number;
}

const ConvertToTableRowItem = (
  milestones: IProjectTask[],
  tasks: IProjectTask[],
  store: AppStore
) => {
  const tableRows: ITableRowItem[] = tasks.map((_task) => {
    const milestone = milestones.find((m) => m.id === _task.milestoneId);

    let people: string[] = [];
    for (const uid of _task.usersId) {
      const person = store.user.getItemById(uid)?.asJson.displayName;
      if (person) people.push(person);
    }

    const row: ITableRowItem = {
      milestoneName: milestone ? milestone.taskName : "",
      progress: milestone ? milestone.progress : "",
      taskName: _task ? _task.taskName : "",
      responsible: people ? people : [""],
      description: _task ? _task.description : "",
      startDate: _task ? _task.startDate : "",
      endDate: _task ? _task.endDate : "",
      status: _task ? _task.status : "",
    };

    return row;
  });
  const sortByMilestoneName = (a: ITableRowItem, b: ITableRowItem) => {
    const order = ["F", "C", "I", "L"];
    const aIndex = order.indexOf(a.milestoneName.charAt(0));
    const bIndex = order.indexOf(b.milestoneName.charAt(0));
    return (
      aIndex - bIndex ||
      a.milestoneName.localeCompare(b.milestoneName) ||
      a.milestoneName.localeCompare(b.milestoneName)
    );
  };
  return tableRows.sort(sortByMilestoneName);
};

const FormatTableSpan = (_rows: ITableRowItem[]) => {
  let milestone = "";
  let fillColor = "";

  const rows: Row[] = _rows.map((row, _, data) => {
    let milestoneRowSpan = undefined;

    if (milestone !== row.milestoneName) {
      milestone = row.milestoneName;
      milestoneRowSpan = data.filter(
        (r) => r.milestoneName === milestone
      ).length;
    }

    switch (row.status) {
      case "todo":
        fillColor = "#FF0000";
        break;
      case "in-progress":
        fillColor = "#FFFF00";
        break;
      case "in-review":
        fillColor = "#FF9529";
        break;
      default:
        fillColor = "#00ff00";
        break;
    }

    return [
      {
        rowSpan: milestoneRowSpan,
        text: row.milestoneName,
        fillColor: "#dedede",
      },
      {
        rowSpan: milestoneRowSpan,
        text: row.progress,
      },
      row.taskName,
      row.responsible,
      row.description,
      row.startDate,
      row.endDate,
      {
        text: row.status,
        fillColor: fillColor,
      },
    ];
  });

  return rows;
};

export const ProjectDocumentPDF = async (
  project: IProject,
  milestones: IProjectTask[],
  tasks: IProjectTask[],
  risks: IProjectRisk[],
  store: AppStore
) => {
  let members: string[] = [];

  for (const uid of project.usersId) {
    const displayName = store.user.getItemById(uid)?.asJson.displayName;
    if (displayName) members.push(displayName);
  }

  const projectManager = store.user.getItemById(project.manager)?.asJson
    .displayName;
  const department = store.department.getItemById(project.department)?.asJson
    .name;

  // const riskRows: IRiskTableRowItem[] = RiskTableRowItem(risks);
  // const riskMappedRows = FormatRiskTableSpan(riskRows);

  const rows: ITableRowItem[] = ConvertToTableRowItem(milestones, tasks, store);
  const mappedRows = FormatTableSpan(rows);

  const body = [tableHeader, ...mappedRows];

  const done = await groupTasks(milestones, "done");
  const budget = await projectMilestonesTotal(done, project.awardedAmount);

  return {
    pageSize: "A2",
    pageOrientation: "portrait",
    content: [
      marginTopBottom(),
      sectionHeader("Project name:"),
      header(project.projectName),
      marginTopBottom(),
      sectionHeader("Project Description:"),
      header(project.description),
      marginTopBottom(),
      sectionHeader("Project Manager:"),
      header(projectManager!),
      marginTopBottom(),
      sectionHeader("Project Cost"),
      {
        style: "projectBudget",
        table: {
          body: [
            [
              "Project Budget",
              project.currency + " " + moneyFormat(project.awardedAmount),
            ],
            [
              "Amount Spent",
              project.currency + " " + moneyFormat(budget.completedTaskCost),
            ],
            [
              "Balance",
              project.currency + " " + moneyFormat(budget.amountleft),
            ],
          ],
        },
      },
      marginTopBottom(),
      sectionHeader("Project Members:"),
      projectMembers(members),
      marginTopBottom(),
      sectionHeader("Department:"),
      header(department!),
      marginTopBottom(),
      sectionHeader("Project Timeline:"),
      header(`From ${project.startDate} to ${project.endDate}`),
      marginTopBottom(),
      sectionHeader("Project Milestones and Tasks:"),
      {
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: body,
        },
      },
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 15,
        color: "black",
      },
      projectBudget: {
        bold: true,
        fontSize: 13,
      },
    },
  };
};
