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
import { IVisionMission } from "../models/VisionMission";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathCompanyLevel } from "./AppApi";

export default class VisionMissionAPi {
  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    return apiPathCompanyLevel("visionMission");
  }

  async getAll() {
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IVisionMission[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IVisionMission);
          });

          this.store.visionmission.load(items);
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
      const item = { id: doc.id, ...doc.data() } as IVisionMission;

      this.store.visionmission.load([item]);
    });

    return unsubscribe;
  }

  // create visionmission
  async create(item: IVisionMission) {
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
      this.store.visionmission.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IVisionMission) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.visionmission.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete visionmission
  async delete(item: IVisionMission) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.visionmission.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }
}
