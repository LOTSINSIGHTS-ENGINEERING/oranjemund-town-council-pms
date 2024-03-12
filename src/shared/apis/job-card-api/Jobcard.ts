import {
  CollectionReference,

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
import { IJobCard } from "../../models/job-card-model/Jobcard";

export default class JobApi {
  collectionRef: CollectionReference;
  constructor(
    private api: AppApi,
    private store: AppStore,
   
  ) {
    this.collectionRef = collection(db, "jobcards");
  }

  async getAll() {
    const q = query(this.collectionRef);
    // new promise
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: IJobCard[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id } as IJobCard);
      });

      this.store.jobcard.jobcard.load(items);
    });

    return unsubscribe;
  }

  async getById(jid: string) {
    const myPath = `jobcards/${jid}`;

    const unsubscribe = onSnapshot(doc(db, myPath, jid), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IJobCard;

      this.store.jobcard.jobcard.load([item]);
    });

    return unsubscribe;
  }

  async create(item: IJobCard) {
    const docRef = doc(this.collectionRef);
    item.id = docRef.id;
    await setDoc(docRef, item, { merge: true });
  }

  async update(item: IJobCard) {
    await setDoc(doc(this.collectionRef, item.id), item);
    return item;
  }

  async delete(jid: string) {
    const docRef = doc(this.collectionRef, jid);
    await deleteDoc(docRef);
    this.store.jobcard.jobcard.remove(jid);
  }
}
