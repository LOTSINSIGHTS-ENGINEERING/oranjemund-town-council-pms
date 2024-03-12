import { FC } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { IProject } from "../../../shared/models/ProjectManagement";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export interface IBarChartProps {
    data: {
        milestones: any;
        tasks: any;
    }
}


export const ProgressBarChart: FC<IBarChartProps> = ({ data }) => {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                type: 'linear' as const, // magic
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const labels = ['Todo', 'In Progress', "In Review", "Done"];

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Milestones',
                data: data.milestones,
                backgroundColor: '#6ca97e',
            },
            {
                label: 'Tasks',
                data: data.tasks,
                backgroundColor: '#84cbe9',
            },
        ],
    };

    return (
        <div className="bar-graph" style={{ height: "calc(100% - 20px)" }}>
            <Bar options={options} data={data1} />
        </div>
    );
}


interface IBarChartHorizontalProps {
    data: {
        labels: string[];
        values: number[];
    }
}
export const ProgressHorizontalBarChart: FC<IBarChartHorizontalProps> = ({ data }) => {
    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    const labels = data.labels;

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Milestones',
                data: data.values,
                backgroundColor: '#9b59b6',
            }
        ],
    };

    return (
        <div className="bar-graph" style={{ height: "calc(100% - 20px)" }}>
            <Bar options={options} data={data1} />
        </div>
    );
}

interface IBarChartHorizontalStakedProps {
    data: {
        labels: string[];
        values: {
            completed: number[],
            remaining: number[],
            overdue: number[],
        };
    }
}
export const ProgressHorizontalStackedBarChart: FC<IBarChartHorizontalStakedProps> = ({ data }) => {
    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 12
                    }
                }
            },
        },
        scales: {
            x: {
                stacked: true,
                type: 'linear' as const,
                max: 15,
                min: 0,
                stepSize: 1,
                precision: 0
            },
            y: {
                stacked: true,
                stepSize: 1
            }
        }
    };

    const labels = data.labels;

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Completed',
                data: data.values.completed,
                backgroundColor: "#4bb543",
                barPercentage: 0.4,
            },
            {
                label: 'Remaining',
                data: data.values.remaining,
                backgroundColor: "#e7a637",
                barPercentage: 0.4
            },
            {
                label: 'Overdue',
                data: data.values.overdue,
                backgroundColor: "#dc3545",
                barPercentage: 0.4
            },
        ],
    };

    return (
        <div className="bar-graph" style={{ height: "calc(100% - 20px)" }}>
            <Bar options={options} data={data1} />
        </div>
    );
}

type ProjectProps = {
    projects: IProject[];
}
export const ProjectBudgetChart: FC<ProjectProps> = ({ projects }) => {

    const options = {
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    const labels = projects.map(p => p.projectName);

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Projects Budget',
                data: projects.map(p => p.awardedAmount),
                backgroundColor: '#84cbe9',
                barPercentage: 0.2

            }
        ],
    };
    return (
        <Bar options={options} data={data1} />
    );
}

type StatusProps = {
    status: { active: number, onHold: number, atRisk: number, completed: number };
}
export const ProjectStatusChart: FC<StatusProps> = ({ status }) => {

    const options = {
        cutout: "70%"
    };

    const labels = ["Active", "On Hold", "At Risk", "Completed"];

    const data = {
        labels,
        datasets: [
            {
                label: 'Project Status',
                data: [status.active, status.onHold, status.atRisk, status.completed],
                backgroundColor: [
                    '#2f80ed',
                    '#e7a637',
                    '#dc3545',
                    '#4bb543'
                ],
            }
        ],
    };
    return (
        <Doughnut options={options} data={data} />
    );
}

export const projectCChart: FC<ProjectProps> = ({ projects }) => {

    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2.5,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Project progress',
            },
        },
    };

    const labels = projects.map(p => p.projectName);

    const data1 = {
        labels,
        datasets: [
            {
                label: 'Milestones',
                data: projects.map(p => p.awardedAmount),
                backgroundColor: '#03045e',
            }
        ],
    };
    return (
        <div className="bar-graph" style={{ height: "calc(100% - 20px)" }}>
            <Bar options={options} data={data1} />
        </div>
    );
}



export const DepartmentTimeChart: FC<any> = ({ data }) => {

    const options: any = {
        scales: {
            x: {
                type: 'time',
                time: {
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                }
            }
        }
    }

    const data1 = {
        datasets: [{
            data: [{
                x: '2021-11-06 23:39:30',
                y: 50
            }, {
                x: '2021-11-07 01:00:28',
                y: 60
            }, {
                x: '2021-11-07 09:00:28',
                y: 20
            }]
        }],
    }

    return (
        <div className="bar-graph" style={{ height: "calc(100% - 20px)" }}>
            <Line options={options} data={data1} />
        </div>
    );
}



