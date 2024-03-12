import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import VisionMission, { IVisionMission } from "../models/VisionMission";

export default class VissionMissionStore extends Store<
  IVisionMission,
  VisionMission
> {
  items = new Map<string, VisionMission>();

  constructor(store: AppStore) {
    super(store);

    this.store = store;
  }
  load(items: IVisionMission[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new VisionMission(this.store, item))
      );
    });
  }
}
