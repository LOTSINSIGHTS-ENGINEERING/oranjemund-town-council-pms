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
import { IMeasureDepartment } from "../models/MeasureDepartment";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class DepartmentMeasureApi {
  path: string = "";

  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    return this.path;
  }

  private setPath(id: string) {
    this.path = this.path = apiPathScorecardLevel(id, "departmentMeasures");
  }

  async getAll(batchId: string, depId?: string) {
    // set path
    this.setPath(batchId);

    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    // this.store.departmentMeasure.removeAll();

    // create the query
    const $query = depId
      ? query(collection(db, path), where("department", "==", depId))
      : query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IMeasureDepartment[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeasureDepartment);
          });

          this.store.departmentMeasure.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getAllByObjectiveId(batchId: string, objectiveId: string) {
    // set path
    this.setPath(batchId);

    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    // this.store.departmentMeasure.removeAll();

    // create the query
    const $query = query(
      collection(db, path),
      where("objective", "==", objectiveId)
    );

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IMeasureDepartment[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeasureDepartment);
          });

          this.store.departmentMeasure.load(items);
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
      const item = { id: doc.id, ...doc.data() } as IMeasureDepartment;

      this.store.departmentMeasure.load([item]);
    });

    return unsubscribe;
  }

  // create measure
  async create(item: IMeasureDepartment) {
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
      this.store.departmentMeasure.load([item]);
      // update the measure audit
      this.api.departmentMeasureAudit.update(item);
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(
    item: IMeasureDepartment,
    fieldsUpdated?: (keyof IMeasureDepartment)[]
  ) {
    const path = this.getPath();
    if (!path) return;

    let measure: { [k: string]: any } = {};

    // fields updated
    if (fieldsUpdated)
      for (const val of fieldsUpdated) measure[val] = item[val];
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
        const currItem = this.store.departmentMeasure.getById(item.id);
        const newItem = currItem ? { ...currItem.asJson, ...measure } : item;
        this.updateMeasureStore(newItem); // update measure store & audit store
      }
    } catch (error) {
      // console.log(error);
    }
  }

  private updateMeasureStore(item: IMeasureDepartment) {
    this.store.departmentMeasure.load([item]); // update in store
    this.api.departmentMeasureAudit.update(item); // update the measure audit
  }

  // delete measure
  async delete(item: IMeasureDepartment) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(collection(db, path), item.id));
      // remove from store
      this.store.departmentMeasure.remove(item.id); // Remove from memory
      // delete measure audit
      this.api.departmentMeasureAudit.deleteAll(item);
    } catch (error) {
      // console.log(error);
    }
  }
}
