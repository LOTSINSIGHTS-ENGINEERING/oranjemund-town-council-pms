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
import { IBusinessUnit } from "../models/BusinessUnit";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathCompanyLevel } from "./AppApi";

export default class BusinessUnitApi {
  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    return apiPathCompanyLevel("businessUnits");
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
          const items: IBusinessUnit[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IBusinessUnit);
          });

          this.store.businessUnit.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getById(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IBusinessUnit;

      this.store.businessUnit.load([item]);
    });

    return unsubscribe;
  }

  // create businessUnit
  async create(item: IBusinessUnit) {
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
      this.store.businessUnit.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IBusinessUnit) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.businessUnit.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete businessUnit
  async delete(item: IBusinessUnit) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.businessUnit.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }
}
