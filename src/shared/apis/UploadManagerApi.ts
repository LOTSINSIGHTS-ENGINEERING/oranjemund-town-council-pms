import { updateDoc, deleteDoc, doc } from "@firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../config/firebase-config";
import { IDepartment } from "../models/Department";
import { IUploadTask } from "../models/UploadTask";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";

export default class UploadManagerApi {
  constructor(private api: AppApi, private store: AppStore) {}

  // Upload file
  async uploadFileToStorage(file: File, path: string) {
    // Complete path
    const filePath = `${path}/${file.name}`;
    // Upload to storage
    const uploadTask = uploadBytesResumable(ref(storage, filePath), file);

    // upload task id
    const uploadTaskId = `${Date.now().toString()}${Math.random() * 100}`;

    // Upload task
    const _uploadTask: IUploadTask = {
      id: uploadTaskId,
      fileName: file.name,
      fileExtension: file.name.split(".").pop() || "",
      task: uploadTask,
    };

    this.store.uploadManager.load([_uploadTask]);

    return uploadTaskId;
  }

  // update document
  async updateDocument(item: IDepartment, path: string) {
    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.department.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  // delete file
  async deleteFileFromStorage(item: IDepartment, path: string) {
    // remove from db
    try {
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.department.remove(item.id); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }
}
