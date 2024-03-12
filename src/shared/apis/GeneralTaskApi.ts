import {
    query,
    collection,
    updateDoc,
    doc,
    where,
    arrayUnion, deleteDoc, onSnapshot, Unsubscribe, setDoc} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../config/firebase-config";
import { MAIL_EMAIL } from "../functions/mailMessages";
import { IGeneralTask } from "../models/GeneralTasks";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";

export default class GeneralTaskApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private gerenalTaskPath() {
        return "generalTasks";
    }

    async createTask(task: IGeneralTask) {

        const path = this.gerenalTaskPath();
        if (!path) return;

        const itemRef = doc(collection(db, path))
        task.id = itemRef.id;
        try {
            await setDoc(itemRef, task, { merge: true, })
        } catch (error) {
        }
    }

    async updateTask(task: IGeneralTask) {

        const path = this.gerenalTaskPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, task.id), {
                ...task,
            });
            this.store.generalTask.load([task]);
        } catch (error) {
            console.log(error);

        }
    }

    async deleteTask(task: IGeneralTask) {

        const path = this.gerenalTaskPath();
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, task.id));
            this.store.generalTask.remove(task.id);
        } catch (error) { }
    }

    async getAllTasks() {

        this.store.generalTask.removeAll();

        const path = this.gerenalTaskPath();
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const generalTasks: IGeneralTask[] = [];
                querySnapshot.forEach((doc) => {
                    generalTasks.push({ id: doc.id, ...doc.data() } as IGeneralTask);
                });
                this.store.generalTask.load(generalTasks);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });

    }

    async getUserTasks(uid: string) {

        this.store.generalTask.removeAll();

        const path = this.gerenalTaskPath();
        if (!path) return;

        const $query = query(collection(db, path), where("uid", "==", uid));

        const unsubscribe = onSnapshot($query, (querySnapshot) => {
            const generalTasks: IGeneralTask[] = [];
            querySnapshot.forEach((doc) => {
                generalTasks.push({ id: doc.id, ...doc.data() } as IGeneralTask);
            });
            this.store.generalTask.load(generalTasks);
        }
        );

        return unsubscribe;
    }

    async getTasksByUid(uid: string) {

        this.store.generalTask.removeAll();

        const path = this.gerenalTaskPath();
        if (!path) return;

        const $query = query(collection(db, path), where("usersId", "array-contains", uid));

        const unsubscribe = onSnapshot($query, (querySnapshot) => {
            const generalTasks: IGeneralTask[] = [];
            querySnapshot.forEach((doc) => {
                generalTasks.push({ id: doc.id, ...doc.data() } as IGeneralTask);
            });
            this.store.generalTask.load(generalTasks);
        }
        );

        return unsubscribe;
    }



    async addTaskMember(task: IGeneralTask, userId: string) {

        const path = this.gerenalTaskPath();
        if (!path) return;

        const taskRef = doc(db, path, task.id);
        try {
            await updateDoc(taskRef, {
                usersId: arrayUnion(userId)
            });
        } catch (error) { }
    }

    async removeTaskMember(task: IGeneralTask) {

        const path = this.gerenalTaskPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, task.id), {
                ...task,
            });
        } catch (error) { }
    }


    async taskComment(task: IGeneralTask, comment: string) {

        const path = this.gerenalTaskPath();
        if (!path) return;

        const taskRef = doc(db, path, task.id);
        try {
            await updateDoc(taskRef, {
                comments: arrayUnion(comment)
            });
        }
        catch (error) { }
    }


    async attachTaskFiles(task: IGeneralTask, value: { name: string; link: string; }) {

        const path = this.gerenalTaskPath();
        if (!path) return;

        const taskRef = doc(db, path, task.id);

        this.store.projectStatus.setStatus("start");
        await updateDoc(taskRef, {
            files: arrayUnion(value)
        });
        // this.store.projectStatus.setStatus("stop");
    }

    async uploadTaskFile(task: IGeneralTask, file: File) {

        const filePath = `generalTasks/${file.name}`;
        const uploadTask = uploadBytesResumable(ref(storage, filePath), file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.store.projectStatus.setStatus(`${Math.round(progress)}`);
            switch (snapshot.state) {
                case 'paused':
                    break;
                case 'running':
                    break;
            }
        }, (error) => { }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                const value = { name: file.name, link: downloadURL }
                this.attachTaskFiles(task, value);
            });
        }
        );
    }

    async deleteFile(task: IGeneralTask) {

        const path = this.gerenalTaskPath();
        if (!path) return;

        const [file] = task.files;

        try {
            await deleteObject(ref(storage, file.link));
            await updateDoc(doc(db, path, task.id), {
                ...task,
            });
        } catch (error) { }
    }

    async deleteTaskAndFile(item: IGeneralTask) {

        const path = this.gerenalTaskPath();
        if (!path) return;

        const [ link] = item.files;

        try {
            // Delete the file
            await deleteObject(ref(storage, link.link));
            // remove from db
            await deleteDoc(doc(db, path, item.id));
            // remove from store
        } catch (error) { }
    }


    async uploadMilestoneAttachmentFile(file: File, to: string, message: string) {

        const filePath = `generalTasks/${file.name}`;
        const uploadTask = uploadBytesResumable(ref(storage, filePath), file)

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.store.projectStatus.setProgress(Math.round(progress));
        }, (error) => { }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                const msg = message.concat(`</br><a href="${downloadURL}" download>${file.name}</a>`);
                await this.api.mail.sendMail(
                    [to],
                    MAIL_EMAIL,
                    [],
                    "General Task Completed",
                    msg
                )
                window.alert("Email successfully sent")
            });
        }
        );
    }
}



