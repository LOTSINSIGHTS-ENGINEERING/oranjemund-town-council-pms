import {
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
} from "@firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { getDocs, Unsubscribe } from "firebase/firestore";
import {
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import { authWorker, db, functions } from "../config/firebase-config";
import { IFolder } from "../models/Folder";
import { IUser } from "../models/User";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";

export default class UserApi {
  path: string | null = null;

  constructor(private api: AppApi, private store: AppStore) { }

  getPath() {
    return "users";
  }

  async getAll() {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    // this.store.user.removeAll();

    // create the query
    const $query = query(collection(db, path));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IUser[] = [];
          querySnapshot.forEach((doc) => {
            const user = { uid: doc.id, ...doc.data() } as IUser;

            const DEV_MODE =
              !process.env.NODE_ENV || process.env.NODE_ENV === "development";
            if (DEV_MODE) items.push(user);
            else if (!user.devUser) items.push(user);
          });

          this.store.user.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getAllSubordinates(uid?: string) {
    // Get the db path.
    const path = this.getPath();
    if (!path) return;

    // Get all immediate subordinates --> using firestore get.
    const $query = query(collection(db, path), where("supervisor", "==", uid));

    // Get the docs.
    const snapshot = await getDocs($query);

    // For each subordinate, get it's immediate subordinates.
    snapshot.forEach((doc) => {
      const user = { uid: doc.id, ...doc.data() } as IUser;
      this.store.user.load([user]);
      this.getAllSubordinates(doc.id);
    });
  }

  async getImmediateSubordinates(uid: string) {
    // get the db path
    const path = this.getPath();
    if (!path) return;

    // remove all items from store
    this.store.user.removeAll();

    // Get all immediate subordinates --> using firestore get.
    const $query = query(collection(db, path), where("supervisor", "==", uid));

    // Get the docs.
    const snapshot = await getDocs($query);

    // For each subordinate, get it's immediate subordinates.
    snapshot.forEach((doc) => {
      const user = { uid: doc.id, ...doc.data() } as IUser;
      this.store.user.load([user]);
    });
  }

  async getByUid(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { uid: doc.id, ...doc.data() } as IUser;

      this.store.user.load([item]);
    });

    return unsubscribe;
  }

  async create(user: IUser) {

    const path = this.getPath();
    if (!path) return;

    const password = "123456///tc";
    const { email } = user;
    
    const userCredential = await createUserWithEmailAndPassword(authWorker, email, password).catch((error) => {
      return null;
    });

    if (userCredential) {
      user.uid = userCredential.user.uid;
      await setDoc(doc(db, path, user.uid), user);
      this.store.user.load([user])
      sendPasswordResetEmail(authWorker, email)
      await signOut(authWorker);
    }
    return user;
  }

  // update item
  async update(item: IUser) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.uid), {
        ...item,
      });
      // update in store
      this.store.user.load([item]);
      this.createOrUpdateUserFolder(item); // create folder
    } catch (error) {
      // console.log(error);
    }
  }

  // delete user
  async delete(item: IUser) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.uid));
      // remove from store
      this.store.user.remove(item.uid); // Remove from memory
    } catch (error) {
      // console.log(error);
    }
  }

  // disable user
  async disable(item: IUser) {
    const path = this.getPath();
    if (!path) return;

    // init functions
    const functions = getFunctions();
    const disableUser = httpsCallable(functions, "disableUserAccount");

    // update in db
    try {
      await disableUser({ uid: item.uid });
      console.log("Disabled");

      // update item to disabled.
      const _item: IUser = { ...item, disabled: true };

      // update in store
      this.store.user.load([_item]);
    } catch (error) {
      console.log(error);
    }
  }

  // enable user
  async enable(item: IUser) {
    const path = this.getPath();
    if (!path) return;

    // init functions
    const enableUser = httpsCallable(functions, "enableUserAccount");

    // update in db
    try {
      await enableUser({ uid: item.uid });
      console.log("Enabled");

      // update item to disabled.
      const _item: IUser = { ...item, disabled: true };

      // update in store
      this.store.user.load([_item]);
    } catch (error) {
      console.log(error);
    }
  }

  // create/update department root folder in drive
  private async createOrUpdateUserFolder(item: IUser) {
    const userFolder: IFolder = {
      id: item.uid,
      name: item.displayName || `${item.firstName} ${item.lastName}`,
      type: "User",
      department: item.department,
      parentId: item.department,
      path: ["root", item.department],
      createdBy: "auto",
      createdAt: Date.now(),
    };

    // create in db
    try {
      await this.api.folder.autoCreateFolder(userFolder);
    } catch (error) {
      // console.log(error);
    }
  }
}
