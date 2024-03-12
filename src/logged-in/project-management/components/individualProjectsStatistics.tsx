import { FC, useEffect, useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import { observer } from "mobx-react-lite";
import { CircularProgressbar } from "react-circular-progressbar";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../shared/functions/Context";
import { ganttChartProjects } from "../data/itemsTypes";
import { ProjectBudgetChart } from "../utils/charts";
import { getDefaultView, getProgressColors, projectProjectStatistics, projectsMilestonesTotal, projectTotalBudget } from "../utils/common";
import GanttChartAction from "./ganttViewActions";
import { moneyFormat } from "../utils/formats";
import Loading from "../../../shared/components/loading/Loading";
import "gantt-task-react/dist/index.css";
import "../styles/statistics.style.scss";

const IndividualProjectStatistics: FC = observer(() => {
    const { api, store } = useAppContext();
    const me = store.auth.meJson;
    const [view, setView] = useState<ViewMode>(getDefaultView());
    const [isChecked, setIsChecked] = useState(localStorage.getItem("active-list") === "true" ? true : false);
    const [loading, setLoading] = useState(false);

    // const projects = store.projectManagement.all.map((project) => project.asJson).filter((project) => {
    //     const check_user = project.usersId.find(id => id === me?.uid);
    //     if (check_user) return project;
    // });

    const projects = store.projectManagement.all.map((project) => project.asJson);
    const milestones = store.projectTask.all.map(task => task.asJson);

    const { status, completionRate } = projectProjectStatistics(projects);
    const projectBudget = projectTotalBudget(projects);
    const milestoneBudget = projectsMilestonesTotal(milestones);
    const projectTimeline = ganttChartProjects(projects);
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

            if (!me) return;

            await api.projectManagement.getUserProjects(me.uid);
            await api.projectManagement.getAllMilestones(projects);
        };
        loaData()
        setLoading(false)
    }, [api.projectManagement, me, projects]);


    if (loading)
        return (
            <Loading />
        )

    return (
        <ErrorBoundary>
            <div className="dep-content">
                <div className="basic-statistics">
                    <div className="s-item">
                        <div className="content">
                            <span>Projects Budget</span><br />
                            <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#84cbe9" }}>NAD {moneyFormat(projectBudget)}</span>
                        </div>
                        <div className="content">
                            <span data-uk-tooltip="This is a sum of the completed milestones">Spent</span><br />
                            <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#e7a637" }} data-uk-tooltip="This is a sum of the completed milestones"
                            >NAD {moneyFormat(milestoneBudget)}</span>
                        </div>
                        <div className="content">
                            <span>Remaining</span><br />
                            <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: remainingAmount < projectBudget ? "#84cbe9" : "#ff595e" }}>NAD {moneyFormat(remainingAmount)}</span>
                        </div>
                    </div>
                    <div className="s-item">
                        <div className="content">
                            <span style={{ fontSize: "2rem", fontWeight: "bold" }}>{Math.round(completionRate * 100)}%</span><br />
                            <span>Projects Progress</span>
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
                        {projectTimeline.length > 0 &&
                            <Gantt
                                tasks={projectTimeline}
                                viewMode={view}
                                listCellWidth={isChecked ? "155px" : ""}
                                ganttHeight={300}
                                columnWidth={columnWidth}
                            />
                        }
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
})

export default IndividualProjectStatistics;