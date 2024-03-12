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
import { IScorecardMetadata } from "../models/ScorecardMetadata";

import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class IndividualScorecardApi {
  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    if (!this.store.scorecard.activeId) return null;
    return apiPathScorecardLevel(
      this.store.scorecard.activeId,
      "scorecardMetadata"
    );
  }

  async getByUid(id: string, notFound?: () => void) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) {
        if (notFound) notFound();
        return;
      }
      const item = { uid: doc.id, ...doc.data() } as IScorecardMetadata;

      this.store.individualScorecardMetadata.load([item]);
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
          const items: IScorecardMetadata[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ uid: doc.id, ...doc.data() } as IScorecardMetadata);
          });

          this.store.individualScorecardMetadata.load(items);
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
  async create(item: IScorecardMetadata) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await setDoc(doc(db, path, item.uid), item, {
        merge: true,
      });
      // update in store
      this.store.individualScorecardMetadata.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IScorecardMetadata) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.uid), {
        ...item,
      });
      // update in store
      this.store.individualScorecardMetadata.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete scorecard batch
  async delete(item: IScorecardMetadata) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.uid));
      // remove from store
      this.store.individualScorecardMetadata.remove(item.uid); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }
}
