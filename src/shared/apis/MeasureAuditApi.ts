import {
  query,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
  where,
  getDocs,
} from "@firebase/firestore";
import { Unsubscribe } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { serverTimestampInMillis } from "../functions/TimestampToDate";
import { IMeasure } from "../models/Measure";
import { IMeasureAudit } from "../models/MeasureAudit";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class MeasureAuditApi {
  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    if (!this.store.scorecard.activeId) return null;
    return apiPathScorecardLevel(
      this.store.scorecard.activeId,
      "measuresAudit"
    );
  }

  async getAll() {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.measureAudit.removeAll();

    // create the query
    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IMeasureAudit[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeasureAudit);
          });

          this.store.measureAudit.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getByObjective(id: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.measureAudit.removeAll();

    // create the query
    const $query = query(collection(db, path), where("objective", "==", id));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IMeasureAudit[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeasureAudit);
          });

          this.store.measureAudit.load(items);
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

    const unsubscribe = onSnapshot(doc(collection(db, path), id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IMeasureAudit;

      this.store.measureAudit.load([item]);
    });

    return unsubscribe;
  }

  private month_year = () => {
    const month = this.serverMonth();
    const year = this.serverYear();
    return `${month}_${year}`;
  };

  private serverMonth() {
    const timestampMillis = serverTimestampInMillis();
    const date = new Date(timestampMillis);
    const month = date.getMonth() + 1;
    return month;
  }

  private serverYear() {
    const timestampMillis = serverTimestampInMillis();
    const date = new Date(timestampMillis);
    const year = date.getFullYear();
    return year;
  }
  // update measureAudit
  async update(item: IMeasure) {
    const path = this.getPath();
    if (!path) return;

    const id = `${item.id}_${this.month_year()}`;

    const measureAudit: IMeasureAudit = {
      ...item,
      id: id,
      measure: item.id,
      month: this.serverMonth(),
      year: this.serverYear(),
      timestamp: serverTimestampInMillis(),
    };

    // create in db
    try {
      await setDoc(doc(collection(db, path), id), measureAudit, {
        merge: true,
      });
      // create in store
      this.store.measureAudit.load([measureAudit]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete measureAudit --> remove all measuresAudit for this measure
  async deleteAll(item: IMeasure) {
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path), where("measure", "==", item.id));

    // docs
    let docs: IMeasureAudit[] = [];

    try {
      docs = await (
        await getDocs($query)
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() } as IMeasureAudit));
    } catch (error) {}

    // remove from db
    for await (const doc of docs) {
      try {
        await this.delete(doc);
      } catch (error) {
        // console.log(error);
      }
    }
  }
  async delete(item: IMeasureAudit) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(collection(db, path), item.id));
      // remove from store
      this.store.measureAudit.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }
}
