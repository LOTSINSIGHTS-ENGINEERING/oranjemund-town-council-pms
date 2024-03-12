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
import { ITool } from "../../models/job-card-model/Tool";
  
  export default class ToolApi {
    constructor(private api: AppApi, private store: AppStore) {}
  
    async getAll(jid: string) {
      const myPath = `jobcards/${jid}/Tool`;
  
      const $query = query(collection(db, myPath));
      // new promise
      return await new Promise<Unsubscribe>((resolve, reject) => {
        // on snapshot
        const unsubscribe = onSnapshot(
          $query,
          // onNext
          (querySnapshot) => {
            const items: ITool[] = [];
            querySnapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as ITool);
            });
  
            this.store.jobcard.tool.load(items);
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
      const myPath = `jobcards/${jid}/Tool`;
  
      const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
        if (!doc.exists) return;
        const item = { id: doc.id, ...doc.data() } as ITool;
  
        this.store.jobcard.tool.load([item]);
      });
  
      return unsubscribe;
    }
  
    async create(item: ITool, jid: string) {
      const myPath = `jobcards/${jid}/Tool`;
  
      const itemRef = doc(collection(db, myPath));
      item.id = itemRef.id;
  
      // create in db
      try {
        await setDoc(itemRef, item, {
          merge: true,
        });
        // create in store
        this.store.jobcard.tool.load([item]);
      } catch (error) {
        // console.log(error);
      }
    }
  
    async update(item: ITool, jid: string) {
      const myPath = `jobcards/${jid}/Tool`;
      try {
        await updateDoc(doc(db, myPath, item.id), {
          ...item,
        });
  
        this.store.jobcard.tool.load([item]);
      } catch (error) {}
    }
  
    async delete(id: string, jid: string) {
      const myPath = `jobcards/${jid}/Tool`;
      try {
        await deleteDoc(doc(db, myPath, id));
        this.store.jobcard.tool.remove(id);
      } catch (error) {
        console.log(error);
      }
    }
  }
  