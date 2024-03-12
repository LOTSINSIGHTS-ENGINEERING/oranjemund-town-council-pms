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
import { IPrecaution } from "../../models/job-card-model/PrecautionAndStandard";
  
  export default class PrecautionApi {
    constructor(private api: AppApi, private store: AppStore) {}
  
    async getAll(jid: string) {
      const myPath = `jobcards/${jid}/Precaution`;
  
      const $query = query(collection(db, myPath));
      // new promise
      return await new Promise<Unsubscribe>((resolve, reject) => {
        // on snapshot
        const unsubscribe = onSnapshot(
          $query,
          // onNext
          (querySnapshot) => {
            const items: IPrecaution[] = [];
            querySnapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as IPrecaution);
            });
  
            this.store.jobcard.precaution.load(items);
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
      const myPath = `jobcards/${jid}/Precaution`;
  
      const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
        if (!doc.exists) return;
        const item = { id: doc.id, ...doc.data() } as IPrecaution;
  
        this.store.jobcard.precaution.load([item]);
      });
  
      return unsubscribe;
    }
  
    async create(item: IPrecaution, jid: string) {
      const myPath = `jobcards/${jid}/Precaution`;
  
      const itemRef = doc(collection(db, myPath));
      item.id = itemRef.id;
  
      // create in db
      try {
        await setDoc(itemRef, item, {
          merge: true,
        });
        // create in store
        this.store.jobcard.precaution.load([item]);
      } catch (error) {
        // console.log(error);
      }
    }
  
    async update(item: IPrecaution, jid: string) {
      const myPath = `jobcards/${jid}/Precaution`;
      try {
        await updateDoc(doc(db, myPath, item.id), {
          ...item,
        });
  
        this.store.jobcard.precaution.load([item]);
      } catch (error) {}
    }
  
    async delete(id: string, jid: string) {
      const myPath = `jobcards/${jid}/Precaution`;
      try {
        await deleteDoc(doc(db, myPath, id));
        this.store.jobcard.precaution.remove(id);
      } catch (error) {
        console.log(error);
      }
    }
  }
  