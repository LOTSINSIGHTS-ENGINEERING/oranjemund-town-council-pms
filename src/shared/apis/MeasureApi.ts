import {
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { Unsubscribe, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { IMeasure } from "../models/Measure";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class MeasureApi {
  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    if (!this.store.scorecard.activeId) return null;
    return apiPathScorecardLevel(this.store.scorecard.activeId, "measures");
  }

  async getDepartment(department?: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    // this.store.measure.removeAll();

    // create the query
    const $query = department
      ? query(collection(db, path), where("department", "==", department))
      : query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IMeasure[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeasure);
          });

          this.store.measure.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getAll(uid?: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    // this.store.measure.removeAll();

    // create the query
    const $query = uid
      ? query(collection(db, path), where("uid", "==", uid))
      : query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IMeasure[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeasure);
          });

          this.store.measure.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getById(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(collection(db, path), id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IMeasure;

      this.store.measure.load([item]);
    });

    return unsubscribe;
  }

  // create measure
  async create(item: IMeasure) {
    const path = this.getPath();
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.measure.load([item]);
      // update the measure audit
      this.api.measureAudit.update(item);
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IMeasure, fieldsUpdated?: (keyof IMeasure)[]) {
    const path = this.getPath();
    if (!path) return;

    let measure: { [k: string]: any } = {};

    // fields updated
    if (fieldsUpdated)
      for (const index of fieldsUpdated) measure[index] = item[index];
    else measure = { ...item };

    // update in db
    try {
      await updateDoc(doc(collection(db, path), item.id), {
        ...measure,
      });

      // store item
      if (!fieldsUpdated) {
        this.updateMeasureStore(item); // update measure store & audit store
      } else {
        const currItem = this.store.measure.getById(item.id);
        const newItem = currItem ? { ...currItem.asJson, ...measure } : item;
        this.updateMeasureStore(newItem); // update measure store & audit store
      }
    } catch (error) {
      // console.log(error);
    }
  }

  private updateMeasureStore(item: IMeasure) {
    this.store.measure.load([item]); // update in store
    this.api.measureAudit.update(item); // update the measure audit
  }

  // delete measure
  async delete(item: IMeasure) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(collection(db, path), item.id));
      // remove from store
      this.store.measure.remove(item.id); // Remove from memory
      // delete measure audit
      this.api.measureAudit.deleteAll(item);
    } catch (error) {
      console.log(error);
    }
  }
}
