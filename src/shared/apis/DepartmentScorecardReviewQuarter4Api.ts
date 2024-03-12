import {
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  Unsubscribe,
} from "@firebase/firestore";
import { db } from "../config/firebase-config";
import { defaultReview, IScorecardReview } from "../models/ScorecardReview";
import { IMeasure } from "../models/Measure";
import { IMeasureAudit } from "../models/MeasureAudit";
import { IMeasureAuditCompany } from "../models/MeasureAuditCompany";
import { IMeasureAuditDepartment } from "../models/MeasureAuditDepartment";
import { IMeasureCompany } from "../models/MeasureCompany";
import { IMeasureDepartment } from "../models/MeasureDepartment";
import { IObjective } from "../models/Objective";
import { IUser } from "../models/User";

import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class DepartmentScorecardReviewQuarter4Api {
  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    if (!this.store.scorecard.activeId) return null;
    return apiPathScorecardLevel(
      this.store.scorecard.activeId,
      "scorecardQuarter4Reviews"
    );
  }

  async getByUid(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { uid: doc.id, ...doc.data() } as IScorecardReview;
      this.store.departmentScorecardReview.quarter4.load([item]);
    });

    return unsubscribe;
  }

  async getAll() {
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IScorecardReview[] = [];
          querySnapshot.forEach((doc) => {
            items.push({
              uid: doc.id,
              ...doc.data(),
            } as IScorecardReview);
          });

          this.store.departmentScorecardReview.quarter4.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  // create scorecardBatch
  async create(item: IScorecardReview) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await setDoc(doc(db, path, item.uid), item, {
        merge: true,
      });
      // update in store
      this.store.departmentScorecardReview.quarter4.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IScorecardReview) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.uid), {
        ...item,
      });
      // update in store
      this.store.departmentScorecardReview.quarter4.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete scorecard batch
  async delete(item: IScorecardReview) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.uid));
      // remove from store
      this.store.departmentScorecardReview.quarter4.remove(item.uid); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }

  transform = (
    user: IUser,
    objectives: IObjective[],
    measures: IMeasure[] | IMeasureDepartment[] | IMeasureCompany[],
    measureAudits:
      | IMeasureAudit[]
      | IMeasureAuditDepartment[]
      | IMeasureAuditCompany[]
  ): IScorecardReview => {
    const review: IScorecardReview = {
      ...defaultReview,
      uid: user.uid,
      displayName: user.displayName,
      objectives,
      measures,
      measureAudits,
    };

    return review;
  };
}
