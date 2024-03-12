
import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultMaterial: IMaterial = {
    id: "",
    quantity: 0,
     name: "",
    unitCost: 0,
  };
  export interface IMaterial {
    id: string;
    name: string;
    unitCost: number;
    quantity: number;
  };
  
export default class Material {
    private material: IMaterial;

    constructor(private store: AppStore, material: IMaterial) {
        makeAutoObservable(this);
        this.material = material;
    }

    get asJson(): IMaterial {
        return toJS(this.material);
    }
}