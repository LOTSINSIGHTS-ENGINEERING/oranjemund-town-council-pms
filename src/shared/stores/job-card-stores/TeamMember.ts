import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "./../AppStore";
import Store from "./../Store";
import TeamMember, { ITeamMember } from "../../models/job-card-model/TeamMember";

export default class TeamMemberStore extends Store<
ITeamMember,
TeamMember
> {
  items = new Map<string, TeamMember>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ITeamMember[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new TeamMember(this.store, item))
      );
    });
  }
}

