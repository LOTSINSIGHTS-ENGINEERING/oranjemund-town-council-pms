
import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultLabour: ILabour = {
    id: "",
    description: "",
    cost: 0,
  };
  export interface ILabour {
    id: string;
    description: string;
    cost: number;
  };
  
export default class Labour {
    private labour: ILabour;

    constructor(private store: AppStore, labour: ILabour) {
        makeAutoObservable(this);
        this.labour = labour;
    }

    get asJson(): ILabour {
        return toJS(this.labour);
    }
}