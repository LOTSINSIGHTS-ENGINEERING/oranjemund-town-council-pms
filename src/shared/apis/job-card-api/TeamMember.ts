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
import { ITeamMember } from "../../models/job-card-model/TeamMember";
  
  export default class TeamMemberApi {
    constructor(private api: AppApi, private store: AppStore) {}
  
    async getAll(jid: string) {
      const myPath = `jobcards/${jid}/TeamMember`;
  
      const $query = query(collection(db, myPath));
      // new promise
      return await new Promise<Unsubscribe>((resolve, reject) => {
        // on snapshot
        const unsubscribe = onSnapshot(
          $query,
          // onNext
          (querySnapshot) => {
            const items: ITeamMember[] = [];
            querySnapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as ITeamMember);
            });
  
            this.store.jobcard.teamMember.load(items);
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
      const myPath = `jobcards/${jid}/TeamMember`;
  
      const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
        if (!doc.exists) return;
        const item = { id: doc.id, ...doc.data() } as ITeamMember;
  
        this.store.jobcard.teamMember.load([item]);
      });
  
      return unsubscribe;
    }
  
    async create(item: ITeamMember, jid: string) {
      const myPath = `jobcards/${jid}/TeamMember`;
  
      const itemRef = doc(collection(db, myPath));
      item.id = itemRef.id;
  
      // create in db
      try {
        await setDoc(itemRef, item, {
          merge: true,
        });
        // create in store
        this.store.jobcard.teamMember.load([item]);
      } catch (error) {
        // console.log(error);
      }
    }
  
    async update(item: ITeamMember, jid: string) {
      const myPath = `jobcards/${jid}/TeamMember`;
      try {
        await updateDoc(doc(db, myPath, item.id), {
          ...item,
        });
  
        this.store.jobcard.teamMember.load([item]);
      } catch (error) {}
    }
  
    async delete(id: string, jid: string) {
      const myPath = `jobcards/${jid}/TeamMember`;
      try {
        await deleteDoc(doc(db, myPath, id));
        this.store.jobcard.teamMember.remove(id);
      } catch (error) {
        console.log(error);
      }
    }
  }
  