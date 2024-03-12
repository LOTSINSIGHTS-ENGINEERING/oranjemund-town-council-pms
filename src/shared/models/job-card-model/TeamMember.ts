
import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export interface ITeamMember {
    id: string; // Assuming the user id is a string
    name: string;
  }

  
export const defaultTeamMember: ITeamMember ={
    id: "",// Assuming the user id is a string
    name:"",
  }

  export default class TeamMember {
    private teamMember: ITeamMember;

    constructor(private store: AppStore, teamMember: ITeamMember) {
        makeAutoObservable(this);
        this.teamMember = teamMember;
    }

    get asJson(): ITeamMember {
        return toJS(this.teamMember);
    }
}