import {
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { getDocs, Unsubscribe, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { IFolder } from "../models/Folder";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathCompanyLevel } from "./AppApi";

export default class FolderApi {
  path: string | null = null;

  constructor(private api: AppApi, private store: AppStore) {}

  private getPath() {
    return apiPathCompanyLevel("folders");
  }

  async getAll(parentId: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    // this.store.folder.removeAll();

    // create the query
    const $query = query(
      collection(db, path),
      where("parentId", "==", parentId)
    );
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IFolder[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IFolder);
          });

          this.store.folder.load(items);
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
      const item = { id: doc.id, ...doc.data() } as IFolder;

      this.store.folder.load([item]);
    });

    return unsubscribe;
  }

  // create folder
  async create(item: IFolder) {
    const path = this.getPath();
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;

    // current folder
    const me = this.store.auth.meJson;
    item.createdBy = me ? me.uid : "";
    item.createdAt = Date.now();

    const currentFolder = this.store.folder.currentFolder;
    if (currentFolder) {
      item.parentId = currentFolder.id;
      item.path = [...currentFolder.path, item.parentId];
    }

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });

      this.store.folder.load([item]); // create in store
    } catch (error) {
      // console.log(error);
    }
  }

  // auto-create root folder
  async autoCreateFolder(item: IFolder) {
    const path = this.getPath();
    if (!path) return;

    const itemRef = doc(collection(db, path), item.id);

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });

      this.store.folder.load([item]); // create in store
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IFolder) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.folder.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete folder
  async delete(item: IFolder) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      // delete folder files
      await this.api.folderFile.deleteFolderFiles(item);

      // delete children folders.
      await this.deleteChildrenFolders(item);

      // delete the folder.
      await deleteDoc(doc(db, path, item.id));

      // remove from store
      this.store.folder.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }

  // delete all children folders
  private async deleteChildrenFolders(item: IFolder) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    const parentId = item.id;

    // create the query
    const $query = query(
      collection(db, path),
      where("parentId", "==", parentId)
    );

    const querySnapshot = await getDocs($query);
    querySnapshot.forEach((doc) => {
      const item = { id: doc.id, ...doc.data() } as IFolder;
      this.delete(item);
    });
  }

  // delete folder files.
  private async deleteFiles(item: IFolder) {}
}
