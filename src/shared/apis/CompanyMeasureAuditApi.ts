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
import { IMeasureAuditCompany } from "../models/MeasureAuditCompany";
import { IMeasureCompany } from "../models/MeasureCompany";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathScorecardLevel } from "./AppApi";

export default class CompanyMeasureAuditApi {
  constructor(private api: AppApi, private store: AppStore) {}

  getPath() {
    if (!this.store.scorecard.activeId) return null;
    return apiPathScorecardLevel(
      this.store.scorecard.activeId,
      "companyMeasuresAudit"
    );
  }

  async getAll() {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.companyMeasureAudit.removeAll();

    // create the query
    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IMeasureAuditCompany[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeasureAuditCompany);
          });

          this.store.companyMeasureAudit.load(items);
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
    this.store.companyMeasureAudit.removeAll();

    // create the query
    const $query = query(collection(db, path), where("objective", "==", id));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IMeasureAuditCompany[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeasureAuditCompany);
          });

          this.store.companyMeasureAudit.load(items);
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
      const item = { id: doc.id, ...doc.data() } as IMeasureAuditCompany;

      this.store.companyMeasureAudit.load([item]);
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
  async update(item: IMeasureCompany) {
    const path = this.getPath();
    if (!path) return;

    const id = `${item.id}_${this.month_year()}`;

    const measureAudit: IMeasureAuditCompany = {
      ...item,
      id: id,
      measure: item.id,
      month: this.serverMonth(),
      year: this.serverYear(),
      timestamp: serverTimestampInMillis(),
      quarter1Target: 0,
      quarter4Target: 0,
      annualTarget: 0,
    };

    // create in db
    try {
      await setDoc(doc(collection(db, path), id), measureAudit, {
        merge: true,
      });
      // create in store
      this.store.companyMeasureAudit.load([measureAudit]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete measureAudit --> remove all measuresAudit for this measure
  async deleteAll(item: IMeasureCompany) {
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path), where("measure", "==", item.id));

    // docs
    let docs: IMeasureAuditCompany[] = [];

    try {
      docs = await (
        await getDocs($query)
      ).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as IMeasureAuditCompany)
      );
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
  async delete(item: IMeasureAuditCompany) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(collection(db, path), item.id));
      // remove from store
      this.store.companyMeasureAudit.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }
}
