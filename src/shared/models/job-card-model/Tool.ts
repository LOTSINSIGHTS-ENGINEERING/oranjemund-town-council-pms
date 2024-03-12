import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultTool: ITool = {
  id: "",
  name: "",
  quantity: 0,
  unitCost: 0,
};
export interface ITool {
  id: string;
  name: string;
  unitCost: number;
  quantity: number;
}

export default class Tool {
  private tool: ITool;

  constructor(private store: AppStore, tool: ITool) {
    makeAutoObservable(this);
    this.tool = tool;
  }

  get asJson(): ITool {
    return toJS(this.tool);
  }
}
