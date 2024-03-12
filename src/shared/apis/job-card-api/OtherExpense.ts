import {
    Unsubscribe,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import AppApi from "../AppApi";
  import AppStore from "../../stores/AppStore";
  import { db } from "../../config/firebase-config";
import { IOtherExpense } from "../../models/job-card-model/OtherExpense";
  
  export default class OtherExpenseApi {
    constructor(private api: AppApi, private store: AppStore) {}
  
    async getAll(jid: string) {
      const myPath = `jobcards/${jid}/OtherExpense`;
  
      const $query = query(collection(db, myPath));
      // new promise
      return await new Promise<Unsubscribe>((resolve, reject) => {
        // on snapshot
        const unsubscribe = onSnapshot(
          $query,
          // onNext
          (querySnapshot) => {
            const items: IOtherExpense[] = [];
            querySnapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as IOtherExpense);
            });
  
            this.store.jobcard.otherExpense.load(items);
            resolve(unsubscribe);
          },
          // onError
          (error) => {
            reject();
          }
        );
      });
    }
  
    async getById(id: string, jid: string) {
      const myPath = `jobcards/${jid}/OtherExpense`;
  
      const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
        if (!doc.exists) return;
        const item = { id: doc.id, ...doc.data() } as IOtherExpense;
  
        this.store.jobcard.otherExpense.load([item]);
      });
  
      return unsubscribe;
    }
  
    async create(item: IOtherExpense, jid: string) {
      const myPath = `jobcards/${jid}/OtherExpense`;
  
      const itemRef = doc(collection(db, myPath));
      item.id = itemRef.id;
  
      // create in db
      try {
        await setDoc(itemRef, item, {
          merge: true,
        });
        // create in store
        this.store.jobcard.otherExpense.load([item]);
      } catch (error) {
        // console.log(error);
      }
    }
  
    async update(item: IOtherExpense, jid: string) {
      const myPath = `jobcards/${jid}/OtherExpense`;
      try {
        await updateDoc(doc(db, myPath, item.id), {
          ...item,
        });
  
        this.store.jobcard.otherExpense.load([item]);
      } catch (error) {}
    }
  
    async delete(id: string, jid: string) {
      const myPath = `jobcards/${jid}/OtherExpense`;
      try {
        await deleteDoc(doc(db, myPath, id));
        this.store.jobcard.otherExpense.remove(id);
      } catch (error) {
        console.log(error);
      }
    }
  }
  