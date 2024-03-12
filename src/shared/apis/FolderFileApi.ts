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
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../config/firebase-config";
import { IFolder } from "../models/Folder";
import { IFolderFile } from "../models/FolderFile";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathCompanyLevel } from "./AppApi";

export default class FolderFileApi {
  path: string | null = null;

  constructor(private api: AppApi, private store: AppStore) { }

  private getPath() {
    return apiPathCompanyLevel("folderFiles");
  }

  async getAll(folderId: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    // this.store.folderFile.removeAll();

    // create the query
    const $query = query(
      collection(db, path),
      where("folderId", "==", folderId)
    );
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IFolderFile[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IFolderFile);
          });

          this.store.folderFile.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getDownloadURL(file: IFolderFile): Promise<string> {
    try {
      const fileRef = ref(storage, file.url);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  async getById(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IFolderFile;

      this.store.folderFile.load([item]);
    });

    return unsubscribe;
  }

  // create folderFile
  async create(item: IFolderFile) {
    const path = this.getPath();
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;
    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });

      this.store.folderFile.load([item]); // create in store
    } catch (error) {
      // console.log(error);
    }
  }

  // update item
  async update(item: IFolderFile) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.folderFile.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete folderFile
  async delete(item: IFolderFile) {
    const path = this.getPath();
    if (!path) return;

    try {
      // remove from db
      await deleteDoc(doc(db, path, item.id));

      // Delete the file
      await deleteObject(ref(storage, item.url));

      // remove from store
      this.store.folderFile.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }

  // delete folder files
  async deleteFolderFiles(folder: IFolder) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    const $query = query(
      collection(db, path),
      where("folderId", "==", folder.id)
    );

    const querySnapshot = await getDocs($query);
    querySnapshot.forEach((doc) => {
      const item = { id: doc.id, ...doc.data() } as IFolderFile;
      this.delete(item);
    });
  }
}
