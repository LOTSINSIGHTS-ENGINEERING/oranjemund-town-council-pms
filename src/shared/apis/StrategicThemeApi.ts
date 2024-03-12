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
import { IStrategicTheme } from "../models/StrategicTheme";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class StrategicThemeApi {
  constructor(private api: AppApi, private store: AppStore) {}

  private getPath(scorecard?: string) {
    if (!this.store.scorecard.activeId) return null;

    if (scorecard) return apiPathScorecardLevel(scorecard, "strategicThemes");
    return apiPathScorecardLevel(
      this.store.scorecard.activeId,
      "strategicThemes"
    );
  }

  async getAll(scorecard: string) {
    // get the db path
    const path = this.getPath(scorecard);
    if (!path) return;

    // create the query
    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IStrategicTheme[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IStrategicTheme);
          });

          this.store.strategicTheme.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getById(id: string, scorecard: string) {
    const path = this.getPath(scorecard);
    if (!path) return;

    const unsubscribe = onSnapshot(doc(collection(db, path), id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IStrategicTheme;
      this.store.strategicTheme.load([item]);
    });

    return unsubscribe;
  }

  // create strategicTheme
  async create(item: IStrategicTheme) {
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
      this.store.strategicTheme.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(
    item: IStrategicTheme,
    fieldsUpdated?: (keyof IStrategicTheme)[]
  ) {
    const path = this.getPath();
    if (!path) return;

    let strategicTheme: { [k: string]: any } = {};

    // fields updated
    if (fieldsUpdated)
      for (const val of fieldsUpdated) strategicTheme[val] = item[val];
    else strategicTheme = { ...item };

    // update in db
    try {
      await updateDoc(doc(collection(db, path), item.id), {
        ...strategicTheme,
      });

      // store item
      if (!fieldsUpdated) {
        this.updateStrategicThemeStore(item); // update strategicTheme store & audit store
      } else {
        const currItem = this.store.strategicTheme.getById(item.id);
        const newItem = currItem
          ? { ...currItem.asJson, ...strategicTheme }
          : item;
        this.updateStrategicThemeStore(newItem); // update strategicTheme store & audit store
      }
    } catch (error) {
      // console.log(error);
    }
  }

  private updateStrategicThemeStore(item: IStrategicTheme) {
    this.store.strategicTheme.load([item]); // update in store
  }

  // delete strategicTheme
  async delete(item: IStrategicTheme) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(collection(db, path), item.id));
      // remove from store
      this.store.strategicTheme.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }
}
