import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import Loading from "../../../shared/components/loading/Loading";
import { useAppContext } from "../../../shared/functions/Context";
import { ganttChartProjects } from "../data/itemsTypes";
import { ProjectBudgetChart } from "../utils/charts";
import { getDefaultView, getProgressColors, projectsMilestonesTotal, projectProjectStatistics, projectTotalBudget } from "../utils/common";
import Filter from "../utils/filter";
import { moneyFormat } from "../utils/formats";
import GanttChartAction from "./ganttViewActions";
import "gantt-task-react/dist/index.css";
import "../styles/statistics.style.scss";
// import { Doughnut } from "react-chartjs-2";



// type StatusProps = {
//     status: {
//         active: number, onHold: number, atRisk: number, completed: number
//     };
// }
// const ProjectStatusChart = (props: StatusProps) => {

//     const { status } = props;

//     const options = { cutout: "70%" };

//     const labels = ["Active", "On Hold", "At Risk", "Completed"];

//     const data = {
//         labels,
//         datasets: [
//             {
//                 label: 'Project Status',
//                 data: [status.active, status.onHold, status.atRisk, status.completed],
//                 backgroundColor: ['#2f80ed', '#e7a637', '#dc3545', '#4bb543'],
//             }
//         ],
//     };
//     return (
//         <Doughnut options={options} data={data} />
//     );
// }

const CompanyProjectStatistics = observer(() => {
    const { api, store } = useAppContext();
    const department = store.department.all.map((d) => ({ id: d.asJson.id, name: d.asJson.name }));
    const [selectedValue, setSelectedValue] = useState("all");
    const [view, setView] = useState<ViewMode>(getDefaultView());
    const [isChecked, setIsChecked] = useState(localStorage.getItem("active-list") === "true" ? true : false);
    const [loading, setLoading] = useState(false);

    const projects = store.projectManagement.all.map((p) => p.asJson).filter(project => {
        if (selectedValue === "all") return project;
        else if (project.department === selectedValue) return project;
    });

    const milestones = store.projectTask.all.map(task => task.asJson);
    const { status, completionRate } = projectProjectStatistics(projects);
    const projectTimeline: Task[] = ganttChartProjects(projects);
    const projectBudget = projectTotalBudget(projects);
    const milestoneBudget = projectsMilestonesTotal(milestones);
    const remainingAmount = projectBudget - milestoneBudget;

    let columnWidth = 65;
    if (view === ViewMode.Year) {
        columnWidth = 350;
    } else if (view === ViewMode.Month) {
        columnWidth = 300;
    } else if (view === ViewMode.Week) {
        columnWidth = 250;
    }

    useEffect(() => {
        setLoading(true)
        const loaData = async () => {

            await api.projectManagement.getAllProjects();
            await api.projectManagement.getAllMilestones(projects);

            if (store.department.all.length < 1) {
                await api.department.getAll();
            }
        };
        loaData()
        setLoading(false)
    }, [api.projectManagement, api.department]);

    if (loading)
        return (
            <Loading />
        )

    return (
        <ErrorBoundary>
            <div className="gantt-actions">
                <button className="btn btn-primary" type="button">
                    <span>Filter&nbsp;&nbsp;</span>
                    <FontAwesomeIcon icon={faFilter} className="icon uk-margin-small-right" />
                </button>
                <div uk-drop="mode: click">
                    <Filter list={[...department, { name: "All Departments", id: "all" }]} selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
                </div>
            </div>
            <div className="dep-content">
                <div className="basic-statistics">
                    <div className="s-item">
                        <div className="content">
                            <span>Projects Budget</span><br />
                            <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#84cbe9" }}>NAD {moneyFormat(projectBudget)}</span>
                        </div>
                        <div className="content">
                            <span data-uk-tooltip="This is a sum of the completed milestones">Spent</span><br />
                            <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#e7a637" }} data-uk-tooltip="This is a sum of the completed milestones"
                            >NAD {moneyFormat(milestoneBudget)}</span>
                        </div>
                        <div className="content">
                            <span>Remaining</span><br />
                            <span style={{ fontSize: "1rem", fontWeight: "bold", color: remainingAmount <= projectBudget ? "#84cbe9" : "#ff595e" }}>NAD {moneyFormat(remainingAmount)}</span>
                        </div>
                    </div>
                    <div className="s-item">
                        <div className="content">
                            <span style={{ fontSize: "2rem", fontWeight: "bold" }}>{Math.round(completionRate * 100)}%</span><br />
                            <span>Company Projects Progress</span>
                        </div>
                    </div>
                    <div className="s-item">
                        <div className="progress-bar">
                            <CircularProgressbar value={completionRate} maxValue={1} text={`${status.completed}/${projects.length}`}
                                styles={{
                                    path: { stroke: getProgressColors(completionRate * 100) },
                                    text: { fill: getProgressColors(completionRate * 100), fontSize: '1.5rem', }
                                }}
                            />
                        </div>
                        <div className="content">
                            <span>Completed Projects</span>
                        </div>
                    </div>
                </div>
                <div className="graphs">
                    <div className="left">
                        <h4 style={{ textAlign: "center", fontWeight: "600" }}>Projects Budget</h4>
                        <ProjectBudgetChart projects={projects} />
                    </div>
               {/* <div className="right">
                        <h4 style={{ textAlign: "center", fontWeight: "600" }}>Projects Status</h4>
                        <ProjectStatusChart status={status} />
                    </div> */}
                </div> 
                <div className="projects-timeline">
                    <h4 style={{ fontWeight: "600" }}>Projects Timeline</h4>
                    <GanttChartAction onViewListChange={setIsChecked} onViewModeChange={viewMode => setView(viewMode)} isChecked={isChecked} />
                    <br />
                    <div className="gannt-chart">
                        {!!projectTimeline.length &&
                            <Gantt
                                tasks={projectTimeline}
                                viewMode={view}
                                listCellWidth={isChecked ? "155px" : ""}
                                // ganttHeight={300}
                                columnWidth={columnWidth}
                            />
                        }
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
})

export default CompanyProjectStatistics;