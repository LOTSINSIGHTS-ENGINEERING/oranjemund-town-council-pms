import { Task } from "gantt-task-react";
import { IProject } from "../../../shared/models/ProjectManagement";
import { IProjectTask } from "../../../shared/models/ProjectTasks";
import AppStore from "../../../shared/stores/AppStore";

export const ItemTypes = {
    TASK: 'task'
}

export function ganttChartProjects(projects: IProject[]): Task | any {
    return projects.map((project) => {
        const { startDate, endDate, projectName, id, ...all } = project;
        return {
            start: new Date(startDate),
            end: new Date(endDate),
            type: "project",
            // hideChildren: true,
            id,
            name: projectName,
            project: projectName,
            ...all
        }
    });
}

export function ganttChartTasks(tasks: IProjectTask[], store: AppStore): Task | any {
    const projects = store.projectManagement.all.map((p) => p.asJson).map((project) => {
        const { startDate, endDate, projectName, id, ...all } = project;
        return {
            start: new Date(startDate),
            end: new Date(endDate),
            type: "project",
            hideChildren: false,
            id,
            name: projectName,
            project: projectName,
            ...all
        }
    });

    const task: any = tasks.map(task => {
        const { taskName, startDate, endDate, projectId, type, status, dependencies, ...all } = task;
        const project = store.projectManagement.getItemById(projectId)?.asJson.projectName;
        const dep = (task.type === "milestone") ? store.projectTask.getDependenciesById(task.id) : "";
        const color = status === "todo" ? "red" : status === "in-progress" ? "orange" : status === "in-review" ? "purple" : status === "done" ? "green" : "gray";
        return {
            start: new Date(startDate),
            end: new Date(endDate),
            name: taskName,
            projectId,
            project,
            type: type ?? "task",
            dependencies: (dependencies?.length) ? [...dependencies, dep] : [dep],
            ...all,
            status,
            styles: { backgroundColor: type !== "milestone" ? color : "orange", progressColor: '#0000001f', progressSelectedColor: '#ff9e0d' }
        }
    })

    return projects.concat(task).sort((a: any, b: any) => {
        const projectA = a.project?.toUpperCase();
        const projectB = b.project?.toUpperCase();
        if (projectA < projectB) {
            return -1;
        }
        if (projectA > projectB) {
            return 1;
        }
        return 0;
    })
}

export function ganttProjectTasks(tasks: IProjectTask[], store: AppStore): Task | any {
    const task = tasks.map(task => {
        const { taskName, startDate, endDate, projectId, type, status, dependencies, ...all } = task;
        const project = store.projectManagement.getItemById(projectId)?.asJson.projectName;
        const dep = (task.type === "milestone") ? store.projectTask.getDependenciesById(task.id) : "";
        const color = status === "todo" ? "red" : status === "in-progress" ? "orange" : status === "in-review" ? "purple" : status === "done" ? "green" : "gray";
        return {
            start: new Date(`${startDate}`),
            end: new Date(`${endDate}`),
            name: taskName,
            projectId,
            project,
            type: type ?? "task",
            dependencies: (dependencies?.length) ? [...dependencies, dep] : [dep],
            ...all,
            status,
            styles: { backgroundColor: type !== "milestone" ? color : "orange", progressColor: '#0000001f', progressSelectedColor: '#ff9e0d' }
        }
    })
    return task;
}