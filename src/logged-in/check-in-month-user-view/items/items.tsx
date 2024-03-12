import { IMilestone } from "../../../shared/models/check-in-model/CheckInWeek";
import { IWeeklyTaskStatus, IWeeklyTaskType } from "../../../shared/models/check-in-model/CheckInWeekTask";
import { ICheckInWeekTask } from "../../../shared/models/check-in-model/CheckInWeekTask";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


export const groupWeeklyTasks = (checkInWeek: ICheckInWeekTask[], value: IWeeklyTaskStatus) => {
    return checkInWeek.filter((task) => {
        if (task.taskStatus === value) {
            return task;
        }
    });
};

export const getTaskType = (checkInWeek: ICheckInWeekTask[], value: IWeeklyTaskType) => {
    return checkInWeek.filter((task) => {
        if (task.taskType === value) {
            return task;
        }
    });
};

export function getProgressColors(progress: number) {
    if (progress >= 80)
        return "#4bb543"
    else if (progress >= 60)
        return "purple"
    else if (progress >= 40)
        return "#FFCC00"
    else if (progress >= 20)
        return "#FF0000"
    else
        return "#dc3545"
}

export function getCompletedTaskScore(done: ICheckInWeekTask[], all: ICheckInWeekTask[]) {
    const devided = (done.length / all.length);
    return Math.round((devided) * 100) || 0;
}

export function weeklyUtilization(tasks: ICheckInWeekTask[]) {
    const totalHours = tasks.reduce((acc, curr) => {
        return acc + (curr.allocatedTime || 0);
    }, 0);

    const completedTaskHours = tasks.filter((task) => task.taskStatus === "done").reduce((acc, curr) => {
        return acc + (curr.allocatedTime || 0);
    }, 0);

    const percentage = Math.round((completedTaskHours / totalHours) * 100) || 0;

    return { completedTaskHours, totalHours, percentage };
}

export function milestoneAnalytics(miles: IMilestone[]) {
    const total = miles.length;
    const completed = miles.filter((m) => m.completed).length;
    const percentage = Math.round((completed / total) * 100) || 0;
    return { total, completed, percentage};

}


interface IData {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        }[];
    }
}

export const PieChart = (props: IData) => {

    const { data } = props;

    return <Pie data={data} />;
}
