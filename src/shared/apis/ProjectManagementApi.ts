import {
    query,
    collection,
    updateDoc,
    doc,
    where,
    getDocs,
    arrayUnion, deleteDoc, onSnapshot, Unsubscribe, setDoc
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../config/firebase-config";
import { MAIL_EMAIL } from "../functions/mailMessages";
import { IPortfolio } from "../models/Portfolio";
import { IProjectLogs } from "../models/ProjectLogs";
import { IProjectRisk } from "../models/ProjectRisks";
import { IProjectTask } from "../models/ProjectTasks";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathProjectLevel } from "./AppApi";
import { IProject } from "../models/ProjectManagement";

export type Idelete = {
    path: string;
    id: string;
    type: string;
}

type ITaskActions = "status" | "comments" | "deletes" | "dependencies" | "adduser" | "removeuser" | "files" | "updates" | "creates";
type IRiskActions = "status" | "deletes" | "users" | "updates" | "creates";
type IProjectActions = "status" | "adduser" | "updates" | "creates" | "removeuser";

export default class ProjectManagementApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private projectPath() {
        return "projects";
    }

    private portfolioPath() {
        return "portfolios";
    }

    private taskPath = (projectId: string) => {
        if (!projectId) return null;
        return apiPathProjectLevel(projectId, "tasks");
    }

    private riskPath = (projectId: string) => {
        if (!projectId) return null;
        return apiPathProjectLevel(projectId, "risks");
    }

    private logsPath = (projectId: string) => {
        if (!projectId) return null;
        return apiPathProjectLevel(projectId, "logs");
    }

    // PORTFOLIOS
    async getAllPortfolios() {

        this.store.portfolio.removeAll();

        const path = this.portfolioPath();
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const portfolios: IPortfolio[] = [];
                querySnapshot.forEach((doc) => {
                    portfolios.push({ id: doc.id, ...doc.data() } as IPortfolio);
                });
                this.store.portfolio.load(portfolios);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getDepartmentPortfolios(departmentId: string) {

        this.store.portfolio.removeAll();

        const path = this.portfolioPath();
        if (!path) return;

        const $query = query(collection(db, path), where("department", "==", departmentId));

        const unsubscribe = onSnapshot($query, (querySnapshot) => {
            const portfolios: IPortfolio[] = [];
            querySnapshot.forEach((doc) => {
                portfolios.push({ id: doc.id, ...doc.data() } as IPortfolio);
            });
            this.store.portfolio.load(portfolios);
        }
        );
        return unsubscribe;
    }

    async getSectionPortfolios(sectionId: string) {

        this.store.portfolio.removeAll();

        const path = this.portfolioPath();
        if (!path) return;

        const $query = query(collection(db, path), where("section", "==", sectionId));

        const unsubscribe = onSnapshot($query, (querySnapshot) => {
            const portfolios: IPortfolio[] = [];
            querySnapshot.forEach((doc) => {
                portfolios.push({ id: doc.id, ...doc.data() } as IPortfolio);
            });
            this.store.portfolio.load(portfolios);
        }
        );
        return unsubscribe;
    }

    async createPortfolio(portfolio: IPortfolio) {
        const path = this.portfolioPath();
        if (!path) return;
        const itemRef = doc(collection(db, path))
        portfolio.id = itemRef.id;
        try {
            await setDoc(itemRef, portfolio, { merge: true, })
        } catch (error) {
        }
    }


    async updatePortfolio(portfolio: IPortfolio) {
        const path = this.portfolioPath();
        if (!path) return;
        try {
            await updateDoc(doc(db, path, portfolio.id), {
                ...portfolio,
            });
            this.store.portfolio.load([portfolio]);
        } catch (error) { }
    }

    async deletePortfolio(portfolio: IPortfolio) {
        const path = this.portfolioPath();
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, portfolio.id));
            this.store.portfolio.remove(portfolio.id);
        } catch (error) { }
    }




    // PROJECTS

    async getAllProjects() {

        this.store.projectManagement.removeAll();

        const path = this.projectPath();
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const projects: IProject[] = [];
                querySnapshot.forEach((doc) => {
                    projects.push({ id: doc.id, ...doc.data() } as IProject);
                });
                this.store.projectManagement.load(projects);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });

    }

    async getUserProjects(uid: string) {

        this.store.projectManagement.removeAll();

        const path = this.projectPath();
        if (!path) return;

        const $query = query(collection(db, path), where("usersId", "array-contains", uid));

        const unsubscribe = onSnapshot($query, (querySnapshot) => {
            const projects: IProject[] = [];
            querySnapshot.forEach((doc) => {
                projects.push({ id: doc.id, ...doc.data() } as IProject);
            });
            this.store.projectManagement.load(projects);
        }
        );

        return unsubscribe;
    }


    async getProjectsByDepartment(departmentId: string) {

        this.store.projectManagement.removeAll();

        const path = this.projectPath();
        if (!path) return;

        const $query = query(collection(db, path), where("department", "==", departmentId));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const projects: IProject[] = [];
                querySnapshot.forEach((doc) => {
                    projects.push({ id: doc.id, ...doc.data() } as IProject);
                });

                this.store.projectManagement.load(projects);
                resolve(unsubscribe);
            },
                (error) => { reject() }
            );
        });
    }


    // async getProjectsBySection(sectionId: string) {
    //     const path = this.projectPath();
    //     if (!path) return;

    //     this.store.projectManagement.removeAll();

    //     const $query = query(collection(db, path), where("section", "==", sectionId));

    //     return await new Promise<Unsubscribe>((resolve, reject) => {
    //         const unsubscribe = onSnapshot($query, (querySnapshot) => {
    //             const items: IProject[] = [];
    //             querySnapshot.forEach((doc) => {
    //                 items.push({ id: doc.id, ...doc.data() } as IProject);
    //             });

    //             this.store.projectManagement.load(items);
    //             resolve(unsubscribe);
    //         },
    //             (error) => {
    //                 reject();
    //             }
    //         );
    //     });
    // }

    async getProjectById(projectId: string) {

        const path = this.projectPath();
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, projectId), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IProject;
            this.store.projectManagement.load([item]);
        });

        return unsubscribe;
    }

    async createProject(project: IProject) {

        const path = this.projectPath();
        if (!path) return;

        const itemRef = doc(collection(db, path))
        project.id = itemRef.id;

        try {
            await setDoc(itemRef, project, { merge: true, })
        } catch (error) {
        }
    }

    async updateProject(project: IProject) {

        const path = this.projectPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, project.id), {
                ...project,
            });
            await this.projectAudit(project, "status")
            this.store.projectManagement.load([project]);
        } catch (error) { }
    }

    async deleteProject(project: IProject) {
        const path = this.projectPath();
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, project.id));
            this.store.projectManagement.remove(project.id);
        } catch (error) { }
    }

    async addProjectMember(project: IProject) {
        const path = this.projectPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, project.id), {
                ...project
            });
            await this.projectAudit(project, "adduser")
            this.store.projectManagement.load([project]);
        } catch (error) { }
    }

    async removeProjectMember(project: IProject) {
        const path = this.projectPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, project.id), {
                ...project,
            });
            await this.projectAudit(project, "removeuser")
            this.store.projectManagement.load([project]);
        } catch (error) { }
    }

    async getAllMilestones(projects: IProject[]) {
        try {
            for (let project of projects) {
                await this.getMilestones(project.id);
            }
        } catch (error) { }
    }

    async getMilestones(projectId: string) {

        const path = this.taskPath(projectId);
        if (!path) return;

        const $query = query(collection(db, path), where("type", "==", "milestone"));

        const unsubscribe = onSnapshot($query, (querySnapshot) => {
            const milestones: IProjectTask[] = [];
            querySnapshot.forEach((doc) => {
                milestones.push({ id: doc.id, ...doc.data() } as IProjectTask);
            });
            this.store.projectTask.load(milestones);
        }
        );
        return unsubscribe;
    }

    // get project tasks
    async getTasks(projectId: string) {

        this.store.projectTask.removeAll();

        const path = this.taskPath(projectId);
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const tasks: IProjectTask[] = [];
                querySnapshot.forEach((doc) => {
                    tasks.push({ id: doc.id, ...doc.data() } as IProjectTask);
                });
                this.store.projectTask.load(tasks);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async createTask(projectId: string, task: IProjectTask) {

        const path = this.taskPath(projectId);
        if (!path) return;

        const itemRef = doc(collection(db, path))
        task.id = itemRef.id;

        try {
            await setDoc(itemRef, task, { merge: true, })
            await this.taskAudit(projectId, task, "creates")
            this.store.projectTask.load([task]);
        } catch (error) {
        }
    }

    async updateMilestoneProgress(projectId: string, task: IProjectTask, value: number) {
        const path = this.taskPath(projectId);
        if (!path) return;

        const taskRef = doc(db, path, task.id);
        try {
            await updateDoc(taskRef, {
                progress: value
            });
        } catch (error) { }
    }

    async updateMilestoneStatus(projectId: string, task: IProjectTask, value: string) {
        const path = this.taskPath(projectId);
        if (!path) return;

        const taskRef = doc(db, path, task.id);
        try {
            await updateDoc(taskRef, {
                status: value
            });
        } catch (error) { }
    }
    async updateTaskStatusDnD(projectId: string, task: IProjectTask, value: string) {
        const path = this.taskPath(projectId);
        if (!path) return;

        const taskRef = doc(db, path, task.id);
        try {
            await updateDoc(taskRef, {
                status: value
            });
        } catch (error) { }
    }


    async updateTask(projectId: string, task: IProjectTask) {
        const path = this.taskPath(projectId);
        if (!path) return;

        try {
            await updateDoc(doc(db, path, task.id), {
                ...task,
            });
            await this.taskAudit(projectId, task, "updates")
            this.store.projectTask.load([task]);
        } catch (error) {
            console.log(error);

        }
    }

    async updateTaskGantt(task: IProjectTask) {

        const path = this.taskPath(task.projectId);
        if (!path) return;

        try {
            const taskRef = doc(db, path, task.id);
            await updateDoc(taskRef, {
                ...task
            });
        } catch (error) {
            console.log(error);

        }
    }

    async deleteMilestone(projectId: string, milestone: IProjectTask, tasks: IProjectTask[]) {

        const path = this.taskPath(projectId);
        if (!path) return;

        try {
            await this.taskAudit(projectId, milestone, "deletes")
            for (let task of tasks) {
                await this.deleteTask(milestone.projectId, task);
            }
            await deleteDoc(doc(collection(db, path), milestone.id));
            this.store.projectTask.remove(milestone.id);
        } catch (error) { }
    }

    async deleteTask(projectId: string, task: IProjectTask) {

        const path = this.taskPath(projectId);
        if (!path) return;

        try {
            await this.taskAudit(projectId, task, "deletes")
            await deleteDoc(doc(collection(db, path), task.id));
            this.store.projectTask.remove(task.id);
        } catch (error) { }
    }

    async addTaskMember(projectId: string, task: IProjectTask, userId: string) {
        const path = this.taskPath(projectId);
        if (!path) return;

        const taskRef = doc(db, path, task.id);
        try {
            await updateDoc(taskRef, {
                usersId: arrayUnion(userId)
            });
            await this.taskAudit(projectId, task, "adduser")
        } catch (error) { }
        this.getTasks(projectId);
    }

    async removeTaskMember(projectId: string, task: IProjectTask) {

        const path = this.taskPath(projectId);
        if (!path) return;

        try {
            await updateDoc(doc(db, path, task.id), {
                ...task,
            });
            await this.taskAudit(projectId, task, "removeuser")
        } catch (error) { }
        this.getTasks(projectId);
    }


    async taskComment(projectId: string, task: IProjectTask, comment: string) {
        const path = this.taskPath(projectId);
        if (!path) return;

        const taskRef = doc(db, path, task.id);
        try {
            await updateDoc(taskRef, {
                comments: arrayUnion(comment)
            });
            await this.taskAudit(projectId, task, "comments")
        }
        catch (error) { }
        this.getTasks(projectId);
    }


    async attachTaskFiles(projectId: string, task: IProjectTask, value: { name: string; link: string; }) {

        const path = this.taskPath(projectId);
        const me = this.store.auth.meJson;
        if (!path || !me) return;

        const taskRef = doc(db, path, task.id);

        this.store.projectStatus.setStatus("start");
        await updateDoc(taskRef, {
            files: arrayUnion(value)
        });
        await this.taskAudit(projectId, task, "files")
    }

    async uploadTaskFile(projectId: string, task: IProjectTask, file: File) {

        const filePath = `/tasksAttachment/${file.name}`;
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
                this.attachTaskFiles(projectId, task, value);
            });
        }
        );
    }


    async updateTaskAudit(projectId: string, taskId: string, field: string, value: string | any) {

        const path = this.taskPath(projectId);
        const me = this.store.auth.meJson;
        if (!path || !me) return;

        const taskRef = doc(db, path, taskId);
        if (field === "comments") {
            await updateDoc(taskRef, {
                comments: arrayUnion(value)
            });
            this.getTasks(projectId);
        } else if (field === "dependencies") {
            await updateDoc(taskRef, {
                dependencies: arrayUnion(...value)
            });
            await this.createLog(projectId, {
                id: taskId,
                uid: me.uid,
                projectId: projectId,
                displayName: me.displayName,
                actions: `Added dependencies to task ${taskId}`,
                time: new Date().toString()
            })
            this.getTasks(projectId);
        } else if (field === "users") {
            await updateDoc(taskRef, {
                usersId: arrayUnion(...value)
            });
            await this.createLog(projectId, {
                id: taskId,
                uid: me.uid,
                projectId: projectId,
                displayName: me.displayName,
                actions: `Added users to task ${taskId}`,
                time: new Date().toString()
            });
            this.getTasks(projectId);
        } else {
            this.store.projectStatus.setStatus("start");
            await updateDoc(taskRef, {
                files: arrayUnion(value)
            });
            await this.createLog(projectId, {
                id: taskId,
                uid: me.uid,
                projectId: projectId,
                displayName: me.displayName,
                actions: `Attach a file to ${taskId}`,
                time: new Date().toString()
            });
            this.getTasks(projectId);
        }

    }

    async createRisk(projectId: string, risk: IProjectRisk) {

        const path = this.riskPath(projectId);
        if (!path) return;

        const itemRef = doc(collection(db, path))
        risk.id = itemRef.id;

        try {
            await setDoc(itemRef, risk, { merge: true, })
            await this.riskAudit(projectId, risk, "creates")
            this.store.projectRisk.load([risk]);
        } catch (error) {
        }
    }


    async updateRisk(projectId: string, risk: IProjectRisk) {

        const path = this.riskPath(projectId);
        if (!path) return;
        try {
            await updateDoc(doc(db, path, risk.id), {
                ...risk,
            });
            this.store.projectRisk.load([risk]);
        } catch (error) { }
    }

    async deleteRisk(projectId: string, risk: IProjectRisk) {

        const path = this.riskPath(projectId);
        if (!path) return;
        try {
            await deleteDoc(doc(collection(db, path), risk.id));
            this.store.projectTask.remove(risk.id);
        } catch (error) { }
    }


    async getProjectLogs(projectId: string) {

        this.store.projectLogs.removeAll()

        const path = this.logsPath(projectId);
        if (!path) return;

        const unsubscribe = onSnapshot(
            query(collection(db, path)),
            (querySnapshot) => {
                const projectLogs: IProjectLogs[] = [];
                querySnapshot.forEach((doc) => {
                    projectLogs.push({ id: doc.id, ...doc.data() } as IProjectLogs);
                });
                this.store.projectLogs.load(projectLogs);
            }
        );
        return unsubscribe;
    }

    async deleteProjectLogs(projectId: string, logs: IProjectLogs[]) {

        const path = this.logsPath(projectId);
        if (!path) return;

        try {
            for (let _log of logs) {
                await this.deleteLogs(projectId, _log);
                this.store.projectLogs.removeAll();
            }
        } catch (error) {
            console.log(error);

        }
    }

    async getAllTasks(projects: IProject[], uid: string) {
        if (projects.length) {
            this.store.projectStatus.setLoading(true);
            for (let project of projects) {
                await this.getTasks(project.id);
            }
            this.store.projectStatus.setLoading(false);
        } else {
            await this.getUserProjects(uid);
        }
    }


    async getRisks(projectId: string) {

        this.store.projectRisk.removeAll();

        const path = this.riskPath(projectId);
        if (!path) return;

        const querySnapshot = await getDocs(query(collection(db, path)));
        const risks: IProjectRisk[] = [];
        querySnapshot.forEach((doc) => {
            risks.push({ id: doc.id, projectId, ...doc.data() } as IProjectRisk);
        });
        this.store.projectRisk.load(risks);
    }

    async uploadMilestoneAttachmentFile(projectId: string, file: File, to: string, message: string) {
        // Complete path
        const filePath = `completedMilestones/${projectId}/${file.name}`;
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
                    "Milestone Budget",
                    msg
                )
                window.alert("Email successfully sent")
            });
        }
        );
    }

    async updateTasksWithValues(projectId: string, taskId: string, field: string, value: string | any) {

        const path = this.taskPath(projectId);
        const me = this.store.auth.meJson;
        if (!path || !me) return;

        const taskRef = doc(collection(db, path, taskId));

        if (field === "comments") {
            await updateDoc(taskRef, {
                comments: arrayUnion(value)
            });
            this.getTasks(projectId);
        } else if (field === "dependencies") {
            await updateDoc(taskRef, {
                dependencies: arrayUnion(...value)
            });
            await this.createLog(projectId, {
                id: taskId,
                uid: me.uid,
                projectId: projectId,
                displayName: me.displayName,
                actions: `Added dependencies to task ${taskId}`,
                time: new Date().toString()
            })
            this.getTasks(projectId);
        } else if (field === "users") {
            await updateDoc(taskRef, {
                usersId: arrayUnion(...value)
            });
            await this.createLog(projectId, {
                id: taskId,
                uid: me.uid,
                projectId: projectId,
                displayName: me.displayName,
                actions: `added users to task ${taskId}`,
                time: new Date().toString()
            });
            this.getTasks(projectId);
        } else {
            this.store.projectStatus.setStatus("start");
            await updateDoc(taskRef, {
                files: arrayUnion(value)
            });
            await this.createLog(projectId, {
                id: taskId,
                uid: me.uid,
                projectId: projectId,
                displayName: me.displayName,
                actions: `attach a file to ${taskId}`,
                time: new Date().toString()
            });
            this.getTasks(projectId);
        }
    }


    async delete(dObj: Idelete) {
        const { path, id, type } = dObj;
        const projectRef = doc(db, path, id);
        await deleteDoc(projectRef);
        if (type === "project") {
            if (this.store.projectManagement.all.length) {
                this.store.projectManagement.remove(id);
            } else {
                this.getAllProjects();
            }
        }
        else if (type === "portfolio") {
            if (this.store.portfolio.all.length) {
                this.store.portfolio.remove(id);
            }
        } else if (type === "task") {
            if (this.store.projectTask.all.length) {
                this.store.projectTask.remove(id);
            }

        } else if (type === "risk") {
            if (this.store.projectRisk.all.length) {
                this.store.projectRisk.remove(id);
            }
        }
    }


    async projectAudit(project: IProject, action: IProjectActions) {

        const me = this.store.auth.meJson;
        if (!me) return;

        switch (action) {
            case "creates":
                await this.createLog(project.id, {
                    id: project.id,
                    uid: me.uid,
                    projectId: project.id,
                    displayName: me.displayName,
                    actions: `Created a project.`,
                    time: new Date().toString()
                });
                break;
            case "updates":
                await this.createLog(project.id, {
                    id: project.id,
                    uid: me.uid,
                    projectId: project.id,
                    displayName: me.displayName,
                    actions: `Updated a project.`,
                    time: new Date().toString()
                });
                break;
            case "status":
                await this.createLog(project.id, {
                    id: project.id,
                    uid: me.uid,
                    projectId: project.id,
                    displayName: me.displayName,
                    actions: `Updated a project status to ${project.status}`,
                    time: new Date().toString()
                });
                break;
            case "adduser":
                await this.createLog(project.id, {
                    id: project.id,
                    uid: me.uid,
                    projectId: project.id,
                    displayName: me.displayName,
                    actions: `Added a member to project.`,
                    time: new Date().toString()
                });
                break;
            case "removeuser":
                await this.createLog(project.id, {
                    id: project.id,
                    uid: me.uid,
                    projectId: project.id,
                    displayName: me.displayName,
                    actions: `Removed a member from the project`,
                    time: new Date().toString()
                });
                break;
            default:
                await this.createLog(project.id, {
                    id: project.id,
                    uid: me.uid,
                    projectId: project.id,
                    displayName: me.displayName,
                    actions: `Udated a project.`,
                    time: new Date().toString()
                });
                break;
        }
    }



    async taskAudit(projectId: string, task: IProjectTask, action: ITaskActions) {

        const me = this.store.auth.meJson;
        if (!me) return;

        switch (action) {
            case "comments":
                await this.createLog(projectId, {
                    id: task.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Commented to a task ${task.taskName}`,
                    time: new Date().toString()
                })
                break;
            case "dependencies":
                await this.createLog(projectId, {
                    id: task.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Added dependencies to task: ${task.taskName}`,
                    time: new Date().toString()
                })
                break;
            case "adduser":
                await this.createLog(projectId, {
                    id: task.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Added member to task: ${task.taskName}`,
                    time: new Date().toString()
                });
                break;
            case "removeuser":
                await this.createLog(projectId, {
                    id: task.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Removed a member from task: ${task.taskName}`,
                    time: new Date().toString()
                });
                break;
            case "files":
                this.store.projectStatus.setStatus("start");
                await this.createLog(projectId, {
                    id: task.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Attached a file to task: ${task.taskName}`,
                    time: new Date().toString()
                });
                break;
            case "deletes":
                await this.createLog(projectId, {
                    id: task.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Deleted a task: ${task.taskName}`,
                    time: new Date().toString()
                });
                break;
            case "status":
                await this.createLog(projectId, {
                    id: task.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Updated a task status: ${task.taskName}`,
                    time: new Date().toString()
                });
                break;
            case "creates":
                await this.createLog(projectId, {
                    id: task.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Created a task : ${task.taskName}`,
                    time: new Date().toString()
                });
                break;
            default:
                await this.createLog(projectId, {
                    id: task.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Updated a task: ${task.taskName}`,
                    time: new Date().toString()
                });
                break;
        }
    }


    async riskAudit(projectId: string, risk: IProjectRisk, action: IRiskActions) {

        const me = this.store.auth.meJson;
        if (!me) return;

        switch (action) {
            case "creates":
                await this.createLog(projectId, {
                    id: risk.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Created a risk status: ${risk.riskName}`,
                    time: new Date().toString()
                });
                break;
            case "updates":
                await this.createLog(projectId, {
                    id: risk.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Updated a risk ${risk.riskName}`,
                    time: new Date().toString()
                })
                break;
            case "deletes":
                await this.createLog(projectId, {
                    id: risk.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Deleted a risk: ${risk.riskName}`,
                    time: new Date().toString()
                });
                break;
            case "status":
                await this.createLog(projectId, {
                    id: risk.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Updated a risk status: ${risk.riskName} to ${risk.status}`,
                    time: new Date().toString()
                });
                break;
            default:
                await this.createLog(projectId, {
                    id: risk.id,
                    uid: me.uid,
                    projectId: projectId,
                    displayName: me.displayName,
                    actions: `Updated a task status: ${risk.riskName}`,
                    time: new Date().toString()
                });
                break;
        }
    }



    async logsAudit(projectId: string, log: IProjectLogs) {

        const me = this.store.auth.meJson;
        if (!me) return;
        await this.createLog(projectId, {
            id: log.id,
            uid: me.uid,
            projectId: projectId,
            displayName: me.displayName,
            actions: `Deleted all logs`,
            time: new Date().toString()
        });
    }

    async createLog(projectId: string, _log: IProjectLogs) {

        const path = this.logsPath(projectId);
        const me = this.store.auth.meJson;
        if (!path || !me) return;

        const itemRef = doc(collection(db, path))
        _log.id = itemRef.id;
        _log.uid = me.uid;

        try {
            await setDoc(itemRef, _log);
        } catch (error) { }
    }


    async deleteLogs(projectId: string, _log: IProjectLogs) {

        const path = this.logsPath(projectId);
        if (!path) return;

        try {
            await deleteDoc(doc(collection(db, path), _log.id));
        } catch (error) { }
    }
}