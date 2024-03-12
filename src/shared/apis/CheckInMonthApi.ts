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
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { ICheckInMonth } from "../models/check-in-model/CheckInMonth";
import { where, getDocs } from "firebase/firestore";

export default class CheckInMonthApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private getPath(yearId: string) {
    if (!yearId) return;
    return (`checkInYears/${yearId}/months`);
  }

  async getAll(yearId: string) {
    const path = this.getPath(yearId);
    if (!path) return;

    this.store.checkIn.checkInMonth.removeAll()

    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: ICheckInMonth[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as ICheckInMonth);
        });

        this.store.checkIn.checkInMonth.load(items);
        resolve(unsubscribe);
      },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getById(yearId: string, id: string) {
    const path = this.getPath(yearId);
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as ICheckInMonth;

      this.store.checkIn.checkInMonth.load([item]);
    });

    return unsubscribe;
  }

  // create month
  async create(yearId: string, item: ICheckInMonth) {
    const path = this.getPath(yearId);
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.checkIn.checkInMonth.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: ICheckInMonth) {
    const path = this.getPath(item.yearId);
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.checkIn.checkInMonth.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete month
  async delete(item: ICheckInMonth) {
    const path = this.getPath(item.yearId);
    if (!path) return;
    // remove from db

    const isNotEmpty = await this.api.checkIn.checkInWeek.doesMonthHasWeeks(item.yearId, item.id);
    if (isNotEmpty) {
      alert("This folder contains data.");
      return;
    }
    try {
      await deleteDoc(doc(db, path, item.id));
      this.store.checkIn.checkInMonth.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }

  // prevent deletig year with data under it
  async doesYearHasMonths(yearId: string) {

    const path = this.getPath(yearId);
    if (!path) return;

    const $query = query(collection(db, path), where("yearId", "==", yearId)
    );
    const querySnapshot = await getDocs($query);
    const months = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as ICheckInMonth;
    });
    return months.length !== 0 ? true : false;
  }
}
