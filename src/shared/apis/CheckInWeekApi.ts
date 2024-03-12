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
import { ICheckInWeek } from "../models/check-in-model/CheckInWeek";
import { getDocs, where } from "firebase/firestore";

export default class CheckInWeekApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private getPath(yearId: string, monthId: string) {
    return (`checkInYears/${yearId}/months/${monthId}/weeks`);
  }

  // async getAll(yearId: string, monthId: string) {
  //   const path = this.getPath(yearId, monthId);
  //   if (!path) return;

  //   this.store.checkIn.checkInWeek.removeAll()

  //   const $query = query(collection(db, path));

  //   // new promise
  //   return await new Promise<Unsubscribe>((resolve, reject) => {
  //     // on snapshot
  //     const unsubscribe = onSnapshot($query, (querySnapshot) => {
  //       const items: ICheckInWeek[] = [];
  //       querySnapshot.forEach((doc) => {
  //         items.push({ id: doc.id, ...doc.data() } as ICheckInWeek);
  //       });

  //       this.store.checkIn.checkInWeek.load(items);
  //       resolve(unsubscribe);
  //     },
  //       // onError
  //       (error) => {
  //         reject();
  //       }
  //     );
  //   });
  // }

  async getAll(yearId: string, monthId: string, uid: string) {

    const path = this.getPath(yearId, monthId);
    if (!path) return;

    this.store.checkIn.checkInWeek.removeAll()

    const $query = query(collection(db, path), where("uid", "==", uid))

    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: ICheckInWeek[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as ICheckInWeek);
        });

        this.store.checkIn.checkInWeek.load(items);
        resolve(unsubscribe);
      }, (error) => {
        reject(error);
      }
      );
    });
  }

  async getById(yearId: string, monthId: string, id: string) {
    const path = this.getPath(yearId, monthId);
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as ICheckInWeek;

      this.store.checkIn.checkInWeek.load([item]);
    });

    return unsubscribe;
  }

  // create item
  async create(yearId: string, monthId: string, item: ICheckInWeek) {
    const path = this.getPath(yearId, monthId);
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.checkIn.checkInWeek.load([item]);
    } catch (error) {
      console.log(error);
    }
  }

  // update item
  async update(yearId: string, monthId: string, item: ICheckInWeek) {
    const path = this.getPath(yearId, monthId);
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.checkIn.checkInWeek.load([item]);
    } catch (error) {
      console.log(error);
    }
  }

  // delete task
  async delete(yearId: string, monthId: string, item: ICheckInWeek) {
    const path = this.getPath(yearId, monthId);
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.checkIn.checkInWeek.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }


  async doesMonthHasWeeks(yearId: string, monthId: string,) {

    const path = this.getPath(yearId, monthId);
    if (!path) return;

    const $query = query(collection(db, path), where("monthId", "==", monthId)
    );
    const querySnapshot = await getDocs($query);
    const weeks = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as ICheckInWeek;
    });
    return weeks.length !== 0 ? true : false;
  }
}
