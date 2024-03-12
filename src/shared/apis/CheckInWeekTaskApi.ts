import { query, collection, onSnapshot, setDoc, updateDoc, deleteDoc, doc } from "@firebase/firestore";
import { db } from "../config/firebase-config";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { ICheckInWeekTask } from "../models/check-in-model/CheckInWeekTask";
import { Unsubscribe } from "firebase/firestore";

export default class CheckInWeekTaskApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private getPath(yearId: string, monthId: string, weekId: string) {
    return (`checkInYears/${yearId}/months/${monthId}/weeks/${weekId}/tasks`);
  }

  async getAll(yearId: string, monthId: string, weekId: string) {
    const path = this.getPath(yearId, monthId, weekId);
    if (!path) return;

    // this.store.checkIn.checkInWeekTask.removeAll()
    const $query = query(collection(db, path))
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: ICheckInWeekTask[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as ICheckInWeekTask);
        });
        this.store.checkIn.checkInWeekTask.load(items);
        resolve(unsubscribe);
      }, (error) => {
        reject(error);
      }
      );
    });
  }

  // async getAll(yearId: string, monthId: string, uid: string, weeks: ICheckInWeek[]) {
  //   try {
  //     for (let week of weeks) {
  //       const path = this.getPath(yearId, monthId, week.id);
  //       if (!path) return;

  //       // this.store.checkIn.checkInWeekTask.removeAll()

  //       const $query = query(collection(db, path), where("uid", "==", uid))

  //       return await new Promise<Unsubscribe>((resolve, reject) => {
  //         // on snapshot
  //         const unsubscribe = onSnapshot($query, (querySnapshot) => {
  //           const items: ICheckInWeekTask[] = [];
  //           querySnapshot.forEach((doc) => {
  //             items.push({ id: doc.id, ...doc.data() } as ICheckInWeekTask);
  //           });

  //           this.store.checkIn.checkInWeekTask.load(items);
  //           resolve(unsubscribe);
  //         }, (error) => {
  //           reject(error);
  //         }
  //         );
  //       });
  //     }
  //   } catch (error) { }
  // }

  // async getAll(yearId: string, monthId: string, weeks: CheckInWeek[]) {
  //   try {
  //     const promises = weeks.map(async (week) => {
  //       const path = this.getPath(yearId, monthId, week.asJson.id);
  //       if (!path) return [];

  //       // const $query = query(collection(db, path), where("uid", "==", uid)); //not neccessary because the weeks are already filterd
  //       const $query = query(collection(db, path));
  //       const querySnapshot = await getDocs($query);
  //       const items: ICheckInWeekTask[] = querySnapshot.docs.map((doc) => ({
  //         id: doc.id, ...doc.data(),
  //       } as ICheckInWeekTask));
  //       this.store.checkIn.checkInWeekTask.load(items);
  //       console.log(items);

  //       return items;
  //     });

  //     const results = await Promise.all(promises);
  //     return results.flat();
  //   } catch (error) {
  //     console.error(error);
  //     throw error; // or handle the error in an appropriate way
  //   }
  // }


  async getById(yearId: string, monthId: string, weekId: string, id: string) {
    const path = this.getPath(yearId, monthId, weekId);
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as ICheckInWeekTask;

      this.store.checkIn.checkInWeekTask.load([item]);
    });

    return unsubscribe;
  }

  // create item
  async create(yearId: string, monthId: string, weekId: string, item: ICheckInWeekTask) {
    const path = this.getPath(yearId, monthId, weekId);
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;

    try {
      await setDoc(itemRef, item, { merge: true });
      this.store.checkIn.checkInWeekTask.load([item]);
    } catch (error) {
      console.log(error);
    }
  }

  // update item
  async update(yearId: string, monthId: string, item: ICheckInWeekTask) {
    const path = this.getPath(yearId, monthId, item.weekId);
    if (!path) return;
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      this.store.checkIn.checkInWeekTask.load([item]);
    } catch (error) { }
  }

  // delete task
  async delete(yearId: string, monthId: string, item: ICheckInWeekTask) {
    const path = this.getPath(yearId, monthId, item.weekId);
    if (!path) return;
    try {
      await deleteDoc(doc(db, path, item.id));
      this.store.checkIn.checkInWeekTask.remove(item.id);
    } catch (error) {
    }
  }
}
