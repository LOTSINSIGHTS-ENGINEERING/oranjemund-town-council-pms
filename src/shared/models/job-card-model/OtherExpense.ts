
import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultOtherExpense: IOtherExpense = {
    id: "",
    description: "",
    cost: 0,
  };
  export interface IOtherExpense {
    id: string;
    description: string;
    cost: number;
  };
  
export default class OtherExpense {
    private expense: IOtherExpense;

    constructor(private store: AppStore, expense: IOtherExpense) {
        makeAutoObservable(this);
        this.expense = expense;
    }

    get asJson(): IOtherExpense {
        return toJS(this.expense);
    }
}