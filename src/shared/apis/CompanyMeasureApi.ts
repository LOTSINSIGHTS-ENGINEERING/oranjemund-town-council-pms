import {
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { Unsubscribe } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { IMeasureCompany } from "../models/MeasureCompany";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class CompanyMeasureApi {
  private path: string = "";

  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    return this.path;
  }

  private setPath(id: string) {
    this.path = this.path = apiPathScorecardLevel(id, "companyMeasures");
  }

  async getAll(batchId: string) {
    // set path
    this.setPath(batchId);

    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.companyMeasure.removeAll();

    // create the query
    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IMeasureCompany[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeasureCompany);
          });

          this.store.companyMeasure.load(items);
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
      const item = { id: doc.id, ...doc.data() } as IMeasureCompany;

      this.store.companyMeasure.load([item]);
    });

    return unsubscribe;
  }

  // create measure
  async create(item: IMeasureCompany) {
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
      this.store.companyMeasure.load([item]);
      // update the measure audit
      this.api.companyMeasureAudit.update(item);
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(
    item: IMeasureCompany,
    fieldsUpdated?: (keyof IMeasureCompany)[]
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
        const currItem = this.store.companyMeasure.getById(item.id);
        const newItem = currItem ? { ...currItem.asJson, ...measure } : item;
        this.updateMeasureStore(newItem); // update measure store & audit store
      }
    } catch (error) {
      // console.log(error);
    }
  }

  private updateMeasureStore(item: IMeasureCompany) {
    this.store.companyMeasure.load([item]); // update in store
    this.api.companyMeasureAudit.update(item); // update the measure audit
  }

  // delete measure
  async delete(item: IMeasureCompany) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(collection(db, path), item.id));
      // remove from store
      this.store.companyMeasure.remove(item.id); // Remove from memory
      // delete measure audit
      this.api.companyMeasureAudit.deleteAll(item);
    } catch (error) {
      // console.log(error);
    }
  }
}
