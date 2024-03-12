import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export type IStatus = "Not Started" | "In Progress" | "Completed" | "Assigned" | "Closed"
export type IUrgency = "High" | "Medium" | "Low"
export type IJobCardType = "Ad-hoc"|"Sewer" | "Roads" | "Building" | "General"


  export const defaultJobCard: IJobCard = {
    id: "",
    uniqueId:"",
    jobDescription: "",
    jobcardType: "General",
    jobcardCost: 0,
    dueDate: "",
    dateIssued: "",
    urgency: "Medium",
    status: "Not Started",
    acknowledged: false,
    overallTime: 0,
    scope: "",
    objectives: "",
    expectedOutcomes: "",
  }
export interface IJobCard {
    id: string;
    uniqueId:string;
    jobDescription: string;
    jobcardType: IJobCardType;
    jobcardCost:number;
    dueDate: string;
    dateIssued: string;
    urgency: IUrgency;
    status: IStatus;
    acknowledged: boolean;
    overallTime: number;
    scope: string;
    objectives: string;
    expectedOutcomes: string;
  }
  export default class JobCardModel {
    private JobCard: IJobCard;
    status: string | number | readonly string[] | undefined;
  
    constructor(private store: AppStore, JobCard: IJobCard) {
      makeAutoObservable(this);
      this.JobCard = JobCard;
    }
  
    get asJson(): IJobCard {
      return toJS(this.JobCard);
    }
}