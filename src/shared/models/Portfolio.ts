import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultPortfolio: IPortfolio = {
    id: "",
    portfolioName: "",
    colors: [],
    icon: "",
    textColor: "black",
    department: "",
    section: ""
}

export interface IPortfolio {
    id: string;
    portfolioName: string;
    colors: string[];
    icon: string;
    textColor: 'black' | 'white';
    department: string;
    section: string;
}
export default class Portfolio {
    private portfolio: IPortfolio;

    constructor(private store: AppStore, portfolio: IPortfolio) {
        makeAutoObservable(this);
        this.portfolio = portfolio;
    }

    get asJson(): IPortfolio {
        return toJS(this.portfolio);
    }
}
