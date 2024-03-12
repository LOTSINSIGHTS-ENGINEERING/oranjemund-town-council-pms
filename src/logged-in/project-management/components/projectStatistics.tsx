import { observer } from "mobx-react-lite";
import { FC, useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate } from "react-router-dom";
import Loading from "../../../shared/components/loading/Loading";
import { useAppContext } from "../../../shared/functions/Context";
import { IProject } from "../../../shared/models/ProjectManagement";
import "../styles/statistics.style.scss";
import { ProgressBarChart, ProgressHorizontalBarChart, ProgressHorizontalStackedBarChart } from "../utils/charts";
import { projectMilestonesTotal, getMembersWorkLoad, getColorsInvert, getInitials, getMilestoneTaskStatus, projectProgress, projectRiskStatistics, groupTasks, getCompletedTaskScore } from "../utils/common";

const projectStatistics: FC = observer(() => {
    const { api, store } = useAppContext();
    const me = store.auth.meJson;

    const firstRenderRef = useRef(true);

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [loading, setLoading] = useState(false);

    const [budget, setBudget] = useState({
        amountleft: 0,
        completedTaskCost: 0,
        percentage: 0,
    })

    const projects = store.projectManagement.all.map(p => p.asJson);
    const project: IProject | undefined = store.projectManagement.getItemById(projectId)?.asJson;
    const milestones = store.projectTask.all.map(task => task.asJson).filter(task => task.type === "milestone" && task.projectId === projectId);
    const tasks = store.projectTask.all.map(task => task.asJson).filter(task => task.type === "task" && task.projectId === projectId);
    const risks = store.projectRisk.all.map(risk => risk.asJson).filter((risk) => risk.projectId === projectId);
    const completedMilestones = groupTasks(milestones, "done");
    // const milestonesProgress = getCompletedTaskScore("done", completedMilestones)

    const onChangeProject = (projectId: string) => {
        setProjectId(projectId);
    }

    useEffect(() => {
        if (!firstRenderRef.current || projects.length === 0) return;
        setProjectId(projects[0].id);
        firstRenderRef.current = false;
    }, [projects, setProjectId]);

    useEffect(() => {
        if (project) {
            getMembersWorkLoad(project.usersId, tasks, store);
            const _budget = projectMilestonesTotal(completedMilestones, project.awardedAmount);
            setBudget(_budget)
        }
    }, [completedMilestones, setBudget, project, tasks, store])

    useEffect(() => {
        setLoading(true)
        const loaData = async () => {
            if (!me) return;
            await api.projectManagement.getUserProjects(me.uid)
            await api.projectManagement.getTasks(projectId);
            await api.projectManagement.getRisks(projectId);
        };
        loaData()
        setLoading(false)
    }, [api.projectManagement, projectId, me]);

    if (loading)
        return (
            <Loading />
        )

    return (
        <div className="individual-project-statistics">
            <div className="top-content">
                <span id="pname" uk-tooltip="view more" onClick={() => navigate(`/c/project/${projectId}`)}>{project?.projectName}</span>
                <button id="select-btn" type="button" onClick={() => setOpen(!open)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <div className="uk-card uk-card-body uk-card-default uk-width-large" uk-drop="mode: click">
                    {projects && projects.map((project) => (
                        <div key={project.id}
                            className="uk-drop-grid uk-child-width-1-2@m p-list"
                            onClick={() => { onChangeProject(project.id) }}>
                            {project.projectName}
                        </div>
                    ))}
                </div>
                <div className="l-u users">
                    {project && project.usersId.slice(0, 3).map((userId) => {
                        const user = store.user.getItemById(userId)?.asJson.displayName;
                        return (
                            <div className="user" style={{ textTransform: 'uppercase' }} key={userId} uk-tooltip={user}>
                                {user && (userId !== me?.uid) ? getInitials(user) : "me"}
                            </div>
                        )
                    })}
                    {project && project.usersId.length > 3 ? (<div className="user" style={{ textTransform: 'uppercase' }}
                        uk-tooltip={project.usersId.slice(3).map((userId) => store.user.getItemById(userId)?.asJson.displayName)}>
                        +{(project.usersId.length - 3)}
                    </div>) : null
                    }
                </div>
            </div>
            <div className="bottom-content">
                <div className="statistics-item">
                    <h3>Number of milestones & tasks</h3>
                    <div className="item-content">
                        <div className="inner">
                            {project && <ProgressBarChart data={getMilestoneTaskStatus(tasks, milestones)} />}
                        </div>
                    </div>
                </div>
                <div className="statistics-item">
                    <h3>Milestones progress</h3>
                    <div className="item-content">
                        {project && <ProgressHorizontalBarChart data={projectProgress(milestones)} />}
                    </div>
                </div>
                <div className="statistics-item">
                    <h3>Risks</h3>
                    <div className="item-content">
                        <div className="risk">
                            <section className="r-top">
                                <div className="inner">
                                    {project && <CircularProgressbar value={projectRiskStatistics(risks).resolvedPerce} maxValue={1} text={`${projectRiskStatistics(risks).resolvedPerce * 100} % Resolved`}
                                        styles={{
                                            text: { fontSize: '.6rem' }
                                        }}
                                    />}
                                </div>
                            </section>
                            <section className="r-bottom">
                                <section>
                                    <span style={{ fontSize: "1.2rem" }}><b>Status</b></span>
                                    {project && <ul className="uk-list">
                                        <li style={{ color: "#dc3545" }}>Potential: <b>{projectRiskStatistics(risks).level.potential}</b></li>
                                        <li style={{ color: "#faa05a" }}>Identified: <b>{projectRiskStatistics(risks).level.identified}</b></li>
                                        <li style={{ color: "#4bb543" }}>Resolved: <b>{projectRiskStatistics(risks).level.resolved}</b></li>
                                    </ul>}
                                </section>
                                <section>
                                    <span style={{ fontSize: "1.2rem" }}><b>Severity</b></span>
                                    {project && <ul className="uk-list">
                                        <li style={{ color: "#4bb543" }}>Low: <b>{projectRiskStatistics(risks).severity.low}</b></li>
                                        <li style={{ color: "#2f80ed" }}>Medium: <b>{projectRiskStatistics(risks).severity.medium}</b></li>
                                        <li style={{ color: "#dc3545" }}>High: <b>{projectRiskStatistics(risks).severity.high}</b></li>
                                    </ul>}
                                </section>
                            </section>
                        </div>
                    </div>
                </div>
                <div className="statistics-item">
                    <h3>Cost</h3>
                    <div className="item-content">
                        {project &&
                            <div className="p-budget">
                                <div className="p-budget-bar">
                                    <div style={{ width: "250px" }}>
                                        <CircularProgressbar value={100 - budget.percentage}
                                            maxValue={100}
                                            text={`${100 - budget.percentage < 1 ? (100 - budget.percentage).toFixed(1) : (100 - budget.percentage).toFixed(0)}% Used`}
                                            styles={{
                                                path: { stroke: getColorsInvert(100 - budget.percentage), },
                                                text: { fill: getColorsInvert(100 - budget.percentage), fontSize: ".8rem" },
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="p-budget-details" >
                                    <div className="budget">
                                        <span style={{ textTransform: "uppercase" }}>Budget</span> <br />
                                        <span id='budget'>{project.currency} {new Intl.NumberFormat().format(project.awardedAmount)}</span>
                                    </div>
                                    <div className="balance uk-animation-slide-bottom">
                                        <span>Spent: <b>{project.currency} {new Intl.NumberFormat().format(budget.completedTaskCost)}</b></span><br />
                                        <span>Balance: <b><span style={{ color: projectMilestonesTotal(milestones.filter(tasks => tasks.status === "done"), project.awardedAmount).amountleft < 0 ? "#ff595e" : "green" }}> {project.currency}{" "} {new Intl.NumberFormat().format(budget.amountleft)}</span></b></span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="statistics-item">
                    <h3>Members Workload</h3>
                    <div className="item-content">
                        <div className="" style={{ height: "fit-content" }}></div>
                        {project && <ProgressHorizontalStackedBarChart data={getMembersWorkLoad(project.usersId, tasks, store)} />}
                    </div>
                </div>
            </div>
        </div>
    )
})

export default projectStatistics;
