import {
    query,
    collection,
    onSnapshot,
    setDoc,
    updateDoc,
    deleteDoc,
    doc,
  } from "@firebase/firestore";
  import { Unsubscribe, where } from "firebase/firestore";
  import { db } from "../config/firebase-config";
  import AppStore from "../stores/AppStore";
  import AppApi, { apiPathScorecardLevel } from "./AppApi";
import { IObjectiveSubordinate } from "../models/ObjectiveSurbordinate";
  
  export default class SubordinateObjectiveApi {
    path: string | null = null;
  
    constructor(private api: AppApi, private store: AppStore) {}
  
    private getPath() {
      if (!this.store.scorecard.activeId) return null;
      return apiPathScorecardLevel(this.store.scorecard.activeId, "subordinateIbjectives");
    }
  
    async getDepartment(department?: string) {
      // get the db path
      const path = this.getPath();
      if (!path) return;
  
      // remove all items from store
      // this.store.objective.removeAll();
  
      // create the query
      const $query = department
        ? query(collection(db, path), where("department", "==", department))
        : query(collection(db, path));
      // new promise
      return await new Promise<Unsubscribe>((resolve, reject) => {
        // on snapshot
        const unsubscribe = onSnapshot(
          $query,
          // onNext
          (querySnapshot) => {
            const items: IObjectiveSubordinate[] = [];
            querySnapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as IObjectiveSubordinate);
            });
  
            this.store.objective.load(items);
            resolve(unsubscribe);
          },
          // onError
          (error) => {
            reject();
          }
        );
      });
    }
  
    async getAll(uid?: string) {
      // get the db path
      const path = this.getPath();
      if (!path) return;
  
      // remove all items from store
      // this.store.objective.removeAll();
  
      // create the query
      const $query = uid
        ? query(collection(db, path), where("uid", "==", uid))
        : query(collection(db, path));
      // new promise
      return await new Promise<Unsubscribe>((resolve, reject) => {
        // on snapshot
        const unsubscribe = onSnapshot(
          $query,
          // onNext
          (querySnapshot) => {
            const items: IObjectiveSubordinate[] = [];
            querySnapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as IObjectiveSubordinate);
            });
  
            this.store.objective.load(items);
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
  
      const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
        if (!doc.exists) return;
        const item = { id: doc.id, ...doc.data() } as IObjectiveSubordinate;
  
        this.store.objective.load([item]);
      });
  
      return unsubscribe;
    }
  
    // create objective
    async create(item: IObjectiveSubordinate) {
      const path = this.getPath();
      if (!path) return;
  
      const itemRef = doc(collection(db, path));
      item.id = itemRef.id;
      // create in db
      try {
        await setDoc(itemRef, item, {
          merge: true,
        });
  
        this.store.objective.load([item]); // create in store
      } catch (error) {
        // console.log(error);
      }
    }
  
    // update item
    async update(item: IObjectiveSubordinate) {
      const path = this.getPath();
      if (!path) return;
  
      // update in db
      try {
        await updateDoc(doc(db, path, item.id), {
          ...item,
        });
        // update in store
        this.store.objective.load([item]);
      } catch (error) {
        // console.log(error);
      }
    }
  
    // delete objective
    async delete(item: IObjectiveSubordinate) {
      const path = this.getPath();
      if (!path) return;
  
      // remove from db
      try {
        await deleteDoc(doc(db, path, item.id));
        // remove from store
        this.store.objective.remove(item.id); // Remove from memory
      } catch (error) {
        // console.log(error);
      }
    }
  }
  