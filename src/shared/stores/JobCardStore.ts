import AppStore from "./AppStore";
import ClientStore from "./job-card-stores/Client";
import JobStore from "./job-card-stores/Jobcard";
import LabourStore from "./job-card-stores/Labour";
import MaterialStore from "./job-card-stores/Material";
import OtherExpenseStore from "./job-card-stores/OtherExpense";
import PrecautionStore from "./job-card-stores/Precaution";
import StandardStore from "./job-card-stores/Standard";
import TaskStore from "./job-card-stores/Task";
import TeamMemberStore from "./job-card-stores/TeamMember";
import ToolStore from "./job-card-stores/Tool";


  export default class JobCardStore {
    client: ClientStore;
    jobcard: JobStore;
    material: MaterialStore;
    otherExpense: OtherExpenseStore;
    precaution: PrecautionStore;
    standard: StandardStore;
    task: TaskStore;
    tool:ToolStore;
    teamMember:TeamMemberStore;
    labour:LabourStore;
  
    constructor(store: AppStore) {
      //Job Card
      this.client = new ClientStore(store);
      this.jobcard = new JobStore(store);
      this.material = new MaterialStore(store);
      this.otherExpense = new OtherExpenseStore(store);
      this.precaution = new PrecautionStore(store);
      this.standard = new StandardStore(store);
      this.task = new TaskStore(store);
      this.tool = new ToolStore(store);
      this.teamMember = new TeamMemberStore(store);
      this.labour = new LabourStore(store);
    }
  }
  
