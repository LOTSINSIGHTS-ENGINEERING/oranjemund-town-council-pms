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
import { ICheckInYear } from "../models/check-in-model/CheckInYear";
import { where, getDocs } from "firebase/firestore";

export default class CheckInYearApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private getPath() {
    return ("checkInYears");
  }

  async getAll() {
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: ICheckInYear[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as ICheckInYear);
        });
        this.store.checkIn.checkInYear.load(items);
        resolve(unsubscribe);
      }, (error) => {
        reject();
      }
      );
    });
  }


  // Function to delete a document and all subcollections recursively
  // async deleteDocumentAndSubcollections(docRef: firebase.firestore.DocumentReference) {
  //   const subcollections = await docRef.listCollections();
  //   subcollections.forEach(async (subcollection) => {
  //     const subcollectionDocs = await subcollection.get();
  //     subcollectionDocs.forEach(async (doc) => {
  //       await this.deleteDocumentAndSubcollections(doc.ref);
  //     });
  //   });
  //   await docRef.delete();
  // }

  // Function to delete documents under the specified path
  // async deleteDocumentsAtPath(path: string) {
  //   const querySnapshot = await db.collectionGroup(path).get();
  //   querySnapshot.forEach(async (doc) => {
  //     await this.deleteDocumentAndSubcollections(doc.ref);
  //   });
  // }

  // Usage example
  // const yearId = '2023';
  // const monthId = '05';
  // const weekId = '22';
  // const path = getPath(yearId, monthId, weekId);
  // async deleteDocumentsAtPath(path).then(() => {
  //     console.log('Documents deleted successfully.');
  //   })
  //   .catch((error) => {
  //     console.error('Error deleting documents:', error);
  //   });
  // Function to get the path
  // function getPath(yearId: string, monthId: string, weekId: string): string {
  //   return `checkInYears/${yearId}/months/${monthId}/weeks/${weekId}/tasks`;
  // }

  async getActive() {
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path), where("active", "==", true));
    try {
      const docsSnap = await getDocs($query);
      if (docsSnap.empty) {
        this.store.checkIn.checkInYear.clearActive();
      } else {
        const item = {
          id: docsSnap.docs[0].id,
          ...docsSnap.docs[0].data(),
        } as ICheckInYear;
        this.store.checkIn.checkInYear.setActive(item); // set active in store
      }
    } catch (error) { }
  }

  async getById(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as ICheckInYear;

      this.store.checkIn.checkInYear.load([item]);
    });

    return unsubscribe;
  }

  // create year
  async create(item: ICheckInYear) {
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
      this.store.checkIn.checkInYear.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: ICheckInYear) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.checkIn.checkInYear.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete year
  async delete(item: ICheckInYear) {
    const path = this.getPath();
    if (!path) return;
    // remove from db

    const isNotEmpty = await this.api.checkIn.checkInMonth.doesYearHasMonths(item.id);
    if (isNotEmpty) {
      alert("This folder contains data.");
      return;
    }
    try {
      await deleteDoc(doc(db, path, item.id));
      this.store.checkIn.checkInYear.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }
}
