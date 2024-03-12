import AuthStore from "./AuthStore";
import BusinessUnitStore from "./BusinessUnitStore";
import CompanyMeasureAuditStore from "./CompanyMeasureAuditStore";
import CompanyMeasureStore from "./CompanyMeasureStore";
import CompanyObjectiveStore from "./CompanyObjectiveStore";
import DepartmentMeasureAuditStore from "./DepartmentMeasureAuditStore";
import DepartmentMeasureStore from "./DepartmentMeasureStore";
import DepartmentObjectiveStore from "./DepartmentObjectiveStore";
import DepartmentStore from "./DepartmentStore";
import FolderFileStore from "./FolderFileStore";
import FolderStore from "./FolderStore";
import IndividualScorecardStore from "./IndividualScorecardStore";
import IndividualScorecardReviewStore from "./IndividualScorecardReviewStore";
import MeasureAuditStore from "./MeasureAuditStore";
import MeasureStore from "./MeasureStore";
import ObjectiveStore from "./ObjectiveStore";
import ProjectStore from "./ProjectStore";
import ReportStore from "./ReportStore";
import ScorecardStore from "./ScorecardStore";
import StrategicThemeStore from "./StrategicThemeStore";
import UploadManagerStore from "./UploadManagerStore";
import UserStore from "./UserStore";
import CompanyScorecardMetadataStore from "./CompanyScorecardMetadataStore";
import CompanyScorecardReviewStore from "./CompanyScorecardReviewStore";
import DepartmentScorecardMetadataStore from "./DepartmentScorecardMetadataStore";
import DepartmentScorecardReviewStore from "./DepartmentScorecardReviewStore";
import VissionMissionStore from "./VisionMissionStore";
import ProjectManagementStore from "./ProjectManagementStore";
import ProjectTaskStore from "./ProjectTaskStore";
import ProjectRiskStore from "./ProjectRiskStore";
import ProjectStatusStore from "./ProjectStatusStore";
import ProjectLogsStore from "./ProjectLogsStore";
import CheckInStore from "./CheckInStore";
import PortfolioStore from "./PortfolioStore";
import GeneralTaskStore from "./GeneralTaskStore";
import SubordinateObjectiveStore from "./SubordinateObjectiveStore";
import JobCardStore from "./JobCardStore";

import ClientStore from "./job-card-stores/Client";
import LabourStore from "./job-card-stores/Labour";
import MaterialStore from "./job-card-stores/Material";
import OtherExpenseStore from "./job-card-stores/OtherExpense";
import StandardStore from "./job-card-stores/Standard";
import PrecautionStore from "./job-card-stores/Precaution";
import TaskStore from "./job-card-stores/Task";
import ToolStore from "./job-card-stores/Tool";
import TeamMemberStore from "./job-card-stores/TeamMember";

export default class AppStore {
  auth = new AuthStore(this);
  user = new UserStore(this);

  scorecard = new ScorecardStore(this);
  individualScorecardMetadata = new IndividualScorecardStore(this);
  individualScorecardReview = new IndividualScorecardReviewStore(this);

  objective = new ObjectiveStore(this);
  measure = new MeasureStore(this);
  measureAudit = new MeasureAuditStore(this);
  strategicTheme = new StrategicThemeStore(this);

  subordinateObjective = new SubordinateObjectiveStore(this);

  companyObjective = new CompanyObjectiveStore(this);
  companyMeasure = new CompanyMeasureStore(this);
  companyMeasureAudit = new CompanyMeasureAuditStore(this);
  companyScorecardMetadata = new CompanyScorecardMetadataStore(this);
  companyScorecardReview = new CompanyScorecardReviewStore(this);

  departmentObjective = new DepartmentObjectiveStore(this);
  departmentMeasure = new DepartmentMeasureStore(this);
  departmentMeasureAudit = new DepartmentMeasureAuditStore(this);
  departmentScorecardMetadata = new DepartmentScorecardMetadataStore(this);
  departmentScorecardReview = new DepartmentScorecardReviewStore(this);

  department = new DepartmentStore(this);
  businessUnit = new BusinessUnitStore(this);
  visionmission = new VissionMissionStore(this);
  project = new ProjectStore(this);
  report = new ReportStore(this);
  folder = new FolderStore(this);
  folderFile = new FolderFileStore(this);
  jobcard = new JobCardStore(this)
 
  //jobCard = new JobCardStore(this);
  //jobCardMember= new JobCardMemberStore(this)
  // upload manager
  uploadManager = new UploadManagerStore(this);

  // project Management Stores
  portfolio = new PortfolioStore(this);
  projectManagement = new ProjectManagementStore(this);
  projectTask = new ProjectTaskStore(this);
  projectRisk = new ProjectRiskStore(this);
  projectStatus = new ProjectStatusStore();
  projectLogs = new ProjectLogsStore(this);
  generalTask = new GeneralTaskStore(this);

  // check in
  checkIn = new CheckInStore(this);
}
