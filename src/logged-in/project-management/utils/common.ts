import { ViewMode } from "gantt-task-react";
import moment from "moment";
import { IGeneralTask } from "../../../shared/models/GeneralTasks";
import { IProject } from "../../../shared/models/ProjectManagement";
import { IProjectRisk } from "../../../shared/models/ProjectRisks";
import { IProjectTask } from "../../../shared/models/ProjectTasks";
import AppStore from "../../../shared/stores/AppStore";

export function getInitials(text: string) {
    if (!text) return "?";
    try {
        const name = text.trim();
        if (name.includes("Mr.") || name.includes("Ms.") || name.includes("Mrs.") || name.includes("Dr.") || name.includes("Prof.")) {
            let check = name.split(" ")[1][0];
            let check1 = name.split(" ")[2][0];
            return (!!check || !!check1) ? `${check}${check1}` : `${name[0]}${name[1]}`
        } else {
            let check = name.split(" ")[0][0];
            let check1 = name.split(" ")[1][0];
            return (!!check || !!check1) ? `${check}${check1}` : `${name[0]}${name[1]}`
        }
    } catch (error) {
        return "!"
    }
}

export function groupRisks(risks: IProjectRisk[], value: string) {
    return risks.filter((risk) => {
        if (risk.status === value) {
            return risk;
        }
    });
};

export function groupTasks(tasks: IProjectTask[], value: string) {
    return tasks.filter((task) => {
        if (task.status === value) {
            return task;
        }
    });
};

export function groupGeneralTasks(tasks: IGeneralTask[], value: string) {
    return tasks.filter((task) => {
        if (task.status === value) {
            return task;
        }
    });
};

export const timeFormart = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: '[Next] dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'll'
}

export function getDefaultView(): ViewMode {
    try {
        const view = localStorage.getItem('selected-gantt-view');
        if (view?.toString() === "hour") return ViewMode.Hour;
        else if (view?.toString() === "qday") return ViewMode.QuarterDay;
        else if (view?.toString() === "hday") return ViewMode.HalfDay;
        else if (view?.toString() === "day") return ViewMode.Day;
        else if (view?.toString() === "week") return ViewMode.Week;
        else if (view?.toString() === "month") return ViewMode.Month;
        else if (view?.toString() === "year") return ViewMode.Year;
        else return ViewMode.Day;
    } catch (error) {
        return ViewMode.Month;
    }
}

export function projectMilestonesTotal(tasks: IProjectTask[], totalBudget: number) {

    const data = tasks.filter((task) => task.type === "milestone");

    const completedTaskCost = data.reduce((acc, curr) => {
        return acc + curr.actualAmount || 0;
    }, 0) || 0;
    const amountleft = (totalBudget - completedTaskCost);
    const percentage = ((amountleft / totalBudget) * 100) || 100;
    return { amountleft, completedTaskCost, percentage };
}


export function projectsMilestonesTotal(tasks: IProjectTask[]) {
    const data = tasks.filter((task) => task.type === "milestone" && task.status === "done");
    const totalBudget = data.reduce((acc, crr) => {
        return acc + crr.actualAmount || 0;
    }, 0) || 0;

    return totalBudget;
}

export function getMilestoneColors(status: string): string {
    switch (status) {
        case "todo":
            return "#dc3545"
        case "in-progress":
            return "#e7a637"
        case "in-review":
            return "purple"
        case "done":
            return "#4bb543"
        default:
            return "";
    }
}

// get Task Progress color
export function getProgressColors(progress: number) {
    if (progress >= 80)
        return "#4bb543"
    else if (progress >= 60)
        return "purple"
    else if (progress >= 40)
        return "#e7a637"
    else if (progress >= 20)
        return "#ffd60a"
    else
        return "#dc3545"
}

// get percentage of the task completed
export function getCompletedTaskScore(done: IProjectTask[], all: IProjectTask[]) {
    const devided = (done.length / all.length);
    return Math.round((devided) * 100) || 0;
}

// Number of days left in percentatage
export function getRemainingTime(status: string, start: string, end: string) {
    let timeRemaining: number = 0;
    let text: string = "";
    const checkCurrent = (new Date().getTime() >= new Date(start).getTime());
    const checkEnding = (new Date().getTime() > new Date(end).getTime());
    if (!!end && !!checkCurrent) {
        const remainingDays = (new Date(end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
        const projectDays = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
        timeRemaining = (remainingDays / projectDays);
    }
    if (checkCurrent === false) text = `starting ${moment(start).fromNow()}`;
    if (checkEnding && status !== "completed") text = `overdue ${moment(start).fromNow()}`;
    else if (checkEnding) text = `completed ${moment(end).fromNow()}`
    else text = `ending ${moment(end).fromNow()}`

    return { timeRemaining, text };
}

export function getTaskProgress(tasks: IProjectTask[] | any) {
    let todo = 0;
    let inProgress = 0;
    let inReview = 0;
    let done = 0;

    for (let task of tasks) {
        if (task?.status === "todo") {
            todo++;
        }
        if (task?.status === "in-progress") {
            inProgress++;
        }
        if (task?.status === "in-review") {
            inReview++;
        }
        if (task?.status === "done") {
            done++;
        }
    }
    return { todo, inProgress, inReview, done };
}

export function getMilestoneTaskStatus(tasks: IProjectTask[], milestones: IProjectTask[]) {
    const taskProgress = getTaskProgress(tasks);
    const milestoneProgress = getTaskProgress(milestones);

    return {
        milestones: [milestoneProgress.todo, milestoneProgress.inProgress, milestoneProgress.inReview, milestoneProgress.done],
        tasks: [taskProgress.todo, taskProgress.inProgress, taskProgress.inReview, taskProgress.done],
    }
}


export function getColorsInvert(progress: number) {
    if (progress > 100)
        return "#ff595e"
    if (progress >= 80)
        return "#588157"
    else if (progress >= 60)
        return "#7209b7"
    else if (progress >= 40)
        return "#f77f00"
    else if (progress >= 20)
        return "yellow"
    else
        return "#ff595e"
}

export const getProgressClass = (progress: number) => {
    if (progress > 80) {
        return "p80"
    } else if (progress > 60) {
        return "p60"
    } else if (progress > 50) {
        return "p50";
    } else if (progress > 20) {
        return "p40";
    } else {
        return "p20";
    }
}

export function projectRiskStatistics(risks: IProjectRisk[]) {

    const level = {
        potential: 0,
        identified: 0,
        resolved: 0,
    }
    const severity = {
        low: 0,
        medium: 0,
        high: 0,
    }

    for (let risk of risks) {
        switch (risk.status) {
            case "potential":
                level.potential++;
                break;
            case "identified":
                level.identified++;
                break;
            case "resolved":
                level.resolved++;
                break;
        }
    }
    for (let risk of risks) {
        switch (risk.severity) {
            case "low":
                severity.low++;
                break;
            case "medium":
                severity.medium++;
                break;
            case "high":
                severity.high++;
                break;
        }
    }

    return { level, severity, resolvedPerce: (level.resolved / risks.length) || 0 }
}

export function projectProjectStatistics(projects: IProject[]) {

    const status = {
        active: 0,
        onHold: 0,
        atRisk: 0,
        completed: 0,
    }

    for (let project of projects) {
        switch (project.status) {
            case "active":
                status.active++;
                break;
            case "on-hold":
                status.onHold++;
                break;
            case "at-risk":
                status.atRisk++;
                break;
            case "completed":
                status.completed++;
                break;
        }
    }

    return { status, completionRate: (status.completed / projects.length) || 0 }
}

export function projectTotalBudget(projects: IProject[]) {
    const totalBudget = projects.reduce((acc, crr) => {
        // return acc + parseFloat(crr.awardedAmount);
        return acc + crr.awardedAmount;
    }, 0);

    return totalBudget;
}


export function projectProgress(milestones: IProjectTask[]) {
    // const milestones = tasks.filter(task => task.type === "milestone");
    return { labels: milestones.map(task => task.taskName), values: milestones.map(task => task.progress) }
}


export function getUsersEmail(users: string[], store: AppStore): string[] {
    const usersEmails: string[] = users.map(user => {
        return store.user.getItemById(user)?.asJson.email || "";
    });
    return usersEmails;
}

export function getMembersWorkLoad(users: string[], tasks: IProjectTask[], store: AppStore | any) {
    const usersData = users.map(user => {
        let count = 0;
        let completed = 0;
        let remaining = 0;
        let overdue = 0;
        for (let task of tasks) {
            const found = task.usersId.find(task => task === user);
            if (found) {
                count++;
                if (task.status === "done") {
                    completed++;
                } else if (new Date(task.endDate) < new Date()) {
                    overdue++;
                } else {
                    remaining++;
                }
            }
        }
        const userData = store.user.getItemById(user)?.asJson;

        return { username: userData?.displayName, workload: count, completed, remaining, overdue }
    });

    const data = {
        labels: usersData.map(user => user.username),
        values: {
            completed: usersData.map(user => user.completed),
            remaining: usersData.map(user => user.remaining),
            overdue: usersData.map(user => user.overdue),
        }
    }
    return data;
}

export function departmentProjectStatus(projects: IProject[]) {
    return { labels: projects }
}

export const currency = [
    "NAD",
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "NZD",
    "YEN",
]