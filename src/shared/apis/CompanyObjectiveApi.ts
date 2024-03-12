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
import { IObjectiveCompany } from "../models/ObjectiveCompany";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class CompanyObjectiveApi {
  private path: string = "";

  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    return this.path;
  }

  private setPath(id: string) {
    this.path = this.path = apiPathScorecardLevel(id, "companyObjectives");
  }

  async getAll(batchId: string) {
    // set path
    this.setPath(batchId);

    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.companyObjective.removeAll();

    // create the query
    // const $query = query(collection(db, path), where("uid", "==", uid));
    const $query = query(collection(db, path));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IObjectiveCompany[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IObjectiveCompany);
          });

          this.store.companyObjective.load(items);
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
      const item = { id: doc.id, ...doc.data() } as IObjectiveCompany;

      this.store.companyObjective.load([item]);
    });

    return unsubscribe;
  }

  // create objective
  async create(item: IObjectiveCompany) {
    const path = this.getPath();
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;
    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });

      this.store.companyObjective.load([item]); // create in store
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IObjectiveCompany) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.companyObjective.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete objective
  async delete(item: IObjectiveCompany) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.companyObjective.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }
}
