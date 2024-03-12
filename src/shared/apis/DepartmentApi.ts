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
import { IDepartment } from "../models/Department";
import { IFolder } from "../models/Folder";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathCompanyLevel } from "./AppApi";

export default class DepartmentApi {
  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    return apiPathCompanyLevel("departments");
  }

  async getAll() {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.department.removeAll();

    // create the query
    const $query = query(collection(db, path)); // query

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IDepartment[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IDepartment);
          });

          this.store.department.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getById(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IDepartment;

      this.store.department.load([item]);
    });

    return unsubscribe;
  }

  // create department
  async create(item: IDepartment) {
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
      this.store.department.load([item]);
      this.createOrUpdateDepartmentFolder(item); // create folder
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IDepartment) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.department.load([item]);
      this.createOrUpdateDepartmentFolder(item); // create folder
    } catch (error) {
      // console.log(error);
    }
  }

  // delete department
  async delete(item: IDepartment) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.department.remove(item.id); // Remove from memory
      // await this.api.folder.delete(item.id); // delete root folder
    } catch (error) {
      // console.log(error);
    }
  }

  // create/update department root folder in drive
  private async createOrUpdateDepartmentFolder(item: IDepartment) {
    const folder: IFolder = {
      id: item.id,
      name: item.name,
      type: "Root",
      department: item.id,
      parentId: "root",
      path: ["root"],
      createdBy: "auto",
      createdAt: Date.now(),
    };
    // create in db
    try {
      await this.api.folder.autoCreateFolder(folder);
    } catch (error) {
      // console.log(error);
    }
  }
}
