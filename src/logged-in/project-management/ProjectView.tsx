import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import useTitle from "../../shared/hooks/useTitle";
import MODAL_NAMES from "../dialogs/ModalName";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import useBackButton from "../../shared/hooks/useBack";
import { defaultRisk, IProjectRisk, IRiskStatus } from "../../shared/models/ProjectRisks";
import AddUserModal from "../dialogs/project-management/AddUsersModal";
import FilesModal from "../dialogs/project-management/FilesModal";
import NewRiskModal from "../dialogs/project-management/NewRiskModal";
import ViewTaskModal from "../dialogs/project-management/ViewTaskModal";
import GanttChartAction from "./components/ganttViewActions";
import { ganttProjectTasks } from "./data/itemsTypes";
import {
    projectMilestonesTotal, getColorsInvert, getCompletedTaskScore, getDefaultView,
    getInitials, getMilestoneColors, getProgressClass, getProgressColors, getRemainingTime, groupRisks, groupTasks,
} from "./utils/common";
import NewMilestoneModal from "../dialogs/project-management/NewMilestoneModal";
import ProjectMilestoneTasks from "./components/projectMilestoneTasks";
import "./styles/projects.style.scss";
import ViewRiskModal from "../dialogs/project-management/ViewRiskModal";
import { defaultProject, IProject, IProjectStatus } from "../../shared/models/ProjectManagement";
import Loading from "../../shared/components/loading/Loading";
import { IProjectTask } from "../../shared/models/ProjectTasks";
import { ProjectGridRiskItem } from "./components/items/ProjectRiskGridItem";
import { IProjectLogs } from "../../shared/models/ProjectLogs";
import { MAIL_EMAIL, MAIL_PROJECT_TASK_REMOVED } from "../../shared/functions/mailMessages";
import { generateProjectPDF } from "../../shared/functions/scorecard-pdf/GenerateProjectPDF";

const ProjectView = observer(() => {
    const { api, store } = useAppContext();
    const firstRenderRef = useRef(true);

    const [project, setProject] = useState<IProject>({ ...defaultProject });

    const [loadingData, setLoadingData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deletingLog, setDeletingLog] = useState(false);

    const me = store.auth.meJson;
    const navigate = useNavigate();

    useBackButton("/c/projects");
    useTitle(project.projectName);

    const department = useMemo(() => store.department.all.find((d) => d.asJson.id === project.department), [project.department, store.department]);
    const tasks = store.projectTask.all.map((task) => task.asJson).filter((task) => task.projectId === project.id && task.type === "task");
    const milestones = store.projectTask.all.map((task) => task.asJson).filter((task) => task.type === "milestone" && task.projectId === project.id);
    const risks = store.projectRisk.all.map((risk) => risk.asJson).filter((risk) => risk.projectId === project.id);
    const logs = store.projectLogs.all.map((p) => p.asJson);

    // const sortByTime = (a: IProjectLogs, b: IProjectLogs) => {
    //     return (b.time).localeCompare(a.time);
    // };

    const done = groupTasks(milestones, "done");
    const budget = projectMilestonesTotal(done, project.awardedAmount);

    const [selectedRisk, setRisk] = useState<IProjectRisk>({ ...defaultRisk });
    const [status, setStatus] = useState("");

    const [isChecked, setIsChecked] = useState(localStorage.getItem("active-list") === "true" ? true : false);
    const [activeTab, setActiveTab] = useState(localStorage.getItem("view-style") || "grid");

    const [visible, setVisible] = useState(false);
    const [view, setView] = React.useState<ViewMode>(getDefaultView());

    const potential = groupRisks(risks, "potential");
    const identified = groupRisks(risks, "identified");
    const resolved = groupRisks(risks, "resolved");

    const ganttTasks: Task[] = ganttProjectTasks(tasks, store);
    const { timeRemaining, text } = getRemainingTime(project.status as IProjectStatus, project.startDate, project.endDate);

    const updateStatus = async (e: ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value)
        try {
            setLoading(true);
            await api.projectManagement.updateProject({ ...project, status: e.target.value as IProjectStatus });

        } catch (error) { }
        setLoading(false);
    }

    const onRemoveMember = async (userId: string, index: number) => {
        setLoading(true);

        const user = store.user.all.find((u) => u.asJson.uid === userId);
        const { MY_SUBJECT, MY_BODY } = MAIL_PROJECT_TASK_REMOVED(me?.displayName, project.projectName, "project");

        const newUsersId = project.usersId.filter((_, i) => i !== index);

        const _project: IProject = {
            ...project,
            usersId: newUsersId
        }

        try {
            await api.projectManagement.removeProjectMember(_project);
            await api.mail.sendMail([user!.asJson.email!], MAIL_EMAIL, [me?.email!], MY_SUBJECT, MY_BODY);

        } catch (error) { }

        setLoading(false);

    };

    const exportPDF = async () => {
        try {
            setLoading(true);
            await generateProjectPDF(project, milestones, tasks, risks, store);
            setLoading(false);
        } catch (error) { }
    };
    const loadProjectLog = async () => {

        if (firstRenderRef.current) {
            setLoadingData(true)
            await api.projectManagement.getProjectLogs(project.id);
            firstRenderRef.current = false;
            setLoadingData(false)
            setVisible(true)
        } else {
            setVisible(true)
        }
    };

    // const deleteProjectLog = async () => {
    //     if (!window.confirm(`Are you sure you want to delete all actions`)) return;
    //     setDeletingLog(true)
    //     try {
    //         await api.projectManagement.deleteProjectLogs(project.id, logs);
    //     } catch (error) { }
    //     setDeletingLog(false)
    // };

    // risk functions
    const handleUpdateRisk = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoading(true);
            await api.projectManagement.updateRisk(selectedRisk.projectId, selectedRisk);
            setLoading(false);
        } catch (error) { }
    };

    const handleDeleteRisk = async (risk: IProjectRisk) => {
        setLoading(true);
        await api.projectManagement.deleteRisk(project.id, risk);
        setLoading(false);

    };

    const quickRiskUpdate = (_risk: IProjectRisk) => {
        store.projectRisk.select(_risk)
        if (store.projectRisk.selected)
            setRisk(store.projectRisk.selected)
        else setRisk(defaultRisk)
    };

    const onSelectedRisk = (risk: IProjectRisk) => {
        setRisk(risk);
        showModalFromId(MODAL_NAMES.PROJECTS.VIEW_RISK);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: IRiskStatus) => {
        const id = e.dataTransfer.getData('text/plain');
        const riskIndex = risks.findIndex((risk) => risk.id === id);

        if (riskIndex !== -1) {
            const updatedRisks = [...risks];
            const risk = updatedRisks[riskIndex];
            if (status === "resolved") {
                risk.status = status;
                risk.resolutionDate = new Date().toLocaleString()
                await api.projectManagement.updateRisk(risk.projectId, risk);
            }
            else {
                risk.status = status;
                await api.projectManagement.updateRisk(risk.projectId, risk);
            }
        }
    }

    //gannt task functions
    const onChangeTask = async (task: Task) => {

        const definedTask = store.projectTask.getItemById(task.id);

        if (!definedTask) return;

        const _task: IProjectTask = {
            ...definedTask.asJson,
            startDate: task.start.toString(),
            endDate: task.end.toString(),
        }
        try {
            await api.projectManagement.updateTask(_task.projectId, _task)

        } catch (error) { }
    };

    const onDeleteTask = async (task: any) => {
        if (!window.confirm(`Are you sure you want to delete ${task.name}`)) return;
        await api.projectManagement.deleteTask(task.projectId, task);
    };



    const onSelectView = (view: string) => {
        setActiveTab(view);
        localStorage.setItem("view-style", view);
    };



    const onClick = (task: Task) => { };

    const onTaskSelect = (task: Task) => { };

    const handleExpanderClick = (task: Task) => { };

    const handleNewMilestone = () => {
        showModalFromId(MODAL_NAMES.PROJECTS.CREATE_MILESTONE);
    };

    const handleViewTask = () => {
        showModalFromId(MODAL_NAMES.PROJECTS.PROJECT_FILES);
    };

    const handleNewRisk = () => {
        showModalFromId(MODAL_NAMES.PROJECTS.CREATE_RISK);
    };

    // for Gannt Chart
    let columnWidth = 65;
    if (view === ViewMode.Year) {
        columnWidth = 350;
    } else if (view === ViewMode.Month) {
        columnWidth = 300;
    } else if (view === ViewMode.Week) {
        columnWidth = 250;
    }

    useEffect(() => {
        const getProject = async () => {
            if (store.projectManagement.selected) {
                setProject(store.projectManagement.selected);

                setLoadingData(true);

                try {
                    await api.projectManagement.getTasks(project.id);
                    await api.projectManagement.getRisks(project.id);

                    if (store.user.all.length < 2) {
                        await api.user.getAll();
                    }
                    setLoadingData(false);
                } catch (error) {
                    setLoadingData(false);
                }
            } else {
                navigate("/c/projects");
            }
        };

        getProject();
    }, [store.projectManagement.selected, api.user, api.projectManagement, project, navigate]);


    if (loadingData || deletingLog)
        return (
            <Loading />
        )

    return (
        <ErrorBoundary>
            <div>
                <div className="bottomChild">
                    <div className="project-info-container">
                        <div className="project-top">
                            <div className="owner">
                                <span>Project Manager: </span>
                                <div className="member">
                                    <div className="icon">
                                        {project.manager !== me?.uid ? (
                                            getInitials(`${store.user.getItemById(project.usersId[0])?.asJson.displayName}`
                                            )
                                        ) : (
                                            <span data-uk-icon="user"></span>
                                        )}
                                    </div>
                                    <span>
                                        {project.manager !== me?.uid ? store.user.getItemById(project.manager)?.asJson.displayName : "You"}
                                    </span>
                                </div>
                            </div>
                            <div className="files" data-uk-tooltip="Project Attachments" onClick={handleViewTask}   >
                                <div className="file">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M4 1.5C2.89543 1.5 2 2.39543 2 3.5V4.5C2 4.55666 2.00236 4.61278 2.00698 4.66825C0.838141 5.07811 0 6.19118 0 7.5V19.5C0 21.1569 1.34315 22.5 3 22.5H21C22.6569 22.5 24 21.1569 24 19.5V7.5C24 5.84315 22.6569 4.5 21 4.5H11.874C11.4299 2.77477 9.86384 1.5 8 1.5H4ZM9.73244 4.5C9.38663 3.9022 8.74028 3.5 8 3.5H4V4.5H9.73244ZM3 6.5C2.44772 6.5 2 6.94772 2 7.5V19.5C2 20.0523 2.44772 20.5 3 20.5H21C21.5523 20.5 22 20.0523 22 19.5V7.5C22 6.94772 21.5523 6.5 21 6.5H3Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div
                                className={`progress ${getProgressClass(getCompletedTaskScore(done, milestones))}`}
                            >
                                <span className={`prog`}>
                                    {getCompletedTaskScore(done, milestones)} %
                                </span>
                            </div>

                            <div className="projectStatus">
                                <select
                                    value={status ? status : project.status}
                                    id="status"
                                    className="uk-select"
                                    name="status"
                                    onChange={(value) => updateStatus(value)}

                                >
                                    <option value={"active"}>Active</option>
                                    <option value={"on-hold"}>On-Hold</option>
                                    <option value={"at-risk"}>At-Risk</option>
                                    <option value={"completed"}>Completed</option>
                                </select>
                                <div className="adduser"
                                    onClick={() => { showModalFromId(MODAL_NAMES.PROJECTS.ADD_USER) }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-user-plus"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="8.5" cy="7" r="4"></circle>
                                        <line x1="20" y1="8" x2="20" y2="14"></line>
                                        <line x1="23" y1="11" x2="17" y2="11"></line>
                                    </svg>
                                </div>
                                {loading && <div data-uk-spinner="ratio: .5"></div>}
                            </div>

                            <div className="project-btn">
                                <button onClick={handleNewMilestone}>
                                    <span>New Milestone </span>
                                </button>
                            </div>

                            <div className="project-btn">
                                <button onClick={handleNewRisk}>
                                    <span>New Risk </span>
                                </button>
                            </div>
                            <div className="project-btn">
                                <button onClick={exportPDF}>
                                    <span>Export PDF </span>
                                </button>
                            </div>
                            <div className="project-btn">
                                <button type="button" onClick={loadProjectLog}>
                                    <span>Audit Trail</span>
                                </button>
                            </div>
                        </div>

                        <div className="project-info-title">
                            <h2 style={{ fontWeight: "bold" }}>{project.projectName}</h2>
                        </div>
                        <div className="project-info-content">
                            <div className="info">
                                <div className="info">
                                    <h5 className="heading3">
                                        <svg
                                            width="20"
                                            height="20"
                                            strokeWidth="1.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            stroke="currentColor"
                                        >
                                            <path
                                                d="M8 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-4M8 7V3.6a.6.6 0 01.6-.6h6.8a.6.6 0 01.6.6V7M8 7h8"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            ></path>
                                        </svg>
                                        &nbsp;&nbsp;
                                        <b>Department</b>
                                    </h5>
                                    <p>{department?.asJson.name}</p>
                                </div>
                                <div className="info">
                                    <h5 className="heading3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-align-left"
                                        >
                                            <line x1="17" y1="10" x2="3" y2="10"></line>
                                            <line x1="21" y1="6" x2="3" y2="6"></line>
                                            <line x1="21" y1="14" x2="3" y2="14"></line>
                                            <line x1="17" y1="18" x2="3" y2="18"></line>
                                        </svg>
                                        &nbsp;&nbsp;
                                        <b>Description</b>
                                    </h5>
                                    <p>{project.description}</p>
                                </div>
                                <div className="info">
                                    <h5 className="heading3">
                                        <svg
                                            width="20"
                                            height="20"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M7 12h11M7 12l-2-2H1l2 2-2 2h4l2-2zm11 0l-2-2m2 2l-2 2M17.5 22c3.038 0 5.5-4.477 5.5-10S20.538 2 17.5 2 12 6.477 12 12s2.462 10 5.5 10z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></path>
                                        </svg>
                                        &nbsp;&nbsp;
                                        <b className="uk-text-success">Business Objectives</b>
                                    </h5>
                                    <p>{project.objectives} </p>
                                </div>
                            </div>

                            <div className="info">
                                <div className="info">
                                    <h5 className="heading3">
                                        <svg
                                            width="20"
                                            height="20"
                                            strokeWidth="1.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            stroke="curentColor"
                                        >
                                            <path
                                                d="M1 16V4h18"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></path>
                                            <path
                                                d="M16 8h6.4a.6.6 0 01.6.6v10.8a.6.6 0 01-.6.6H16m0-12v12m0-12h-4m4 12h-4m0 0H5.6a.6.6 0 01-.6-.6V8.6a.6.6 0 01.6-.6H12m0 12V8"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></path>
                                        </svg>
                                        &nbsp;&nbsp;
                                        <b>Cost</b>
                                    </h5>

                                    <div className="budget-item">
                                        <div className="progress-bar">
                                            <CircularProgressbar
                                                value={100 - budget.percentage}
                                                maxValue={100}
                                                text={`${100 - budget.percentage < 1 ? (100 - budget.percentage).toFixed(1) : (100 - budget.percentage).toFixed(0)}% Used`}
                                                styles={{
                                                    path: { stroke: getColorsInvert(100 - budget.percentage), },
                                                    text: { fill: getColorsInvert(100 - budget.percentage), fontSize: ".8rem" },
                                                }}
                                            />
                                        </div>
                                        <div className="stat-details">
                                            <span>
                                                <b>Project Budget</b>
                                            </span>
                                            <span id="budget">
                                                {project.currency}
                                                {new Intl.NumberFormat().format(project.awardedAmount)}
                                            </span>
                                            <span>
                                                Spent : {" "}
                                                <span style={{ color: "#f72585" }}>
                                                    <b>{project.currency}{" "}
                                                        {new Intl.NumberFormat().format(budget.completedTaskCost)}
                                                    </b>
                                                </span>
                                            </span>
                                            <span>
                                                Balance :
                                                <b><span style={{ color: budget.amountleft < 0 ? "#dc3545" : "#4bb543", }}  >
                                                    {project.currency}{" "} {new Intl.NumberFormat().format(budget.amountleft)}
                                                </span>
                                                </b>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="info">
                                    <h5 className="heading3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-users"
                                        >
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                        &nbsp;&nbsp;
                                        <b>Members</b>
                                    </h5>
                                    <div className="members">
                                        {me && project.usersId.map((userId, index) => {
                                            const user = store.user.getItemById(userId)?.asJson.displayName;
                                            return (
                                                <div className="member" key={userId} >
                                                    <div className="icon">
                                                        {user && userId !== me.uid ? getInitials(user) : "ME"}
                                                    </div>
                                                    <span> {userId !== me.uid ? user : "ME"} </span>
                                                    {project.manager === me.uid && userId !== me.uid && (
                                                        <div className="delete" data-uk-tooltip="Remove Member"
                                                            onClick={() => onRemoveMember(userId, index)}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="14"
                                                                height="14"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="feather feather-trash"
                                                            >
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="project-statistics">
                        <div className="statistics-item">
                            <div className="progress-bar">
                                <CircularProgressbar
                                    value={getCompletedTaskScore(done, milestones)}
                                    maxValue={100}
                                    text={`${getCompletedTaskScore(done, milestones)}%`}
                                    styles={{ text: { fontSize: "1.5rem" } }}
                                />
                            </div>
                            <div className="stat-details">
                                <span>Overall Progress</span>
                            </div>
                        </div>
                        <div className="statistics-item">
                            <div className="progress-bar">
                                <CircularProgressbar
                                    value={getCompletedTaskScore(done, milestones)}
                                    maxValue={100}
                                    text={`${done.length}/${milestones.length}`}
                                    styles={{
                                        path: { stroke: getProgressColors(getCompletedTaskScore(done, milestones)), },
                                        text: { fill: getProgressColors(getCompletedTaskScore(done, milestones)), fontSize: "1.2rem", },
                                    }}
                                />
                            </div>
                            <div className="stat-details">
                                <span>Milestone Completed</span>
                            </div>
                        </div>
                        <div className="statistics-item">
                            <div className="progress-bar">
                                <CircularProgressbar
                                    value={Math.abs(1 - timeRemaining)}
                                    maxValue={1}
                                    text={`${text}`}
                                    styles={{
                                        path: { stroke: timeRemaining >= 0 || (timeRemaining < 0 && project.status === "completed") ? "#4bb543" : "#dc3545" },
                                        text: {
                                            fill: timeRemaining >= 0 || (timeRemaining < 0 && project.status === "completed") ? "#4bb543" : "#dc3545",
                                            fontSize: ".4rem",
                                            whiteSpace: "break-spaces",
                                            textTransform: "capitalize",
                                            display: "flex",
                                        },
                                    }}
                                />
                            </div>
                            <div className="date">
                                <span style={{
                                    color: timeRemaining >= 0 || (timeRemaining < 0 && project.status === "completed") ? "green" : "red",
                                    fontSize: "1rem",
                                }}
                                >
                                    {moment(project.startDate).format("D MMM YY")} -  {moment(project.endDate).format("D MMM YY")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="t-main">
                        <div className="headings">
                            <div className="t-title"></div>
                            <div className="t-view">
                                <div className="t-icon-item" data-uk-tooltip="List View"
                                    style={{
                                        borderRight: ".5px solid #80808034",
                                        backgroundColor: activeTab === "list" ? "#8080802d" : "transparent",
                                    }}
                                    onClick={() => { onSelectView("list"); }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-list"
                                    >
                                        <line x1="8" y1="6" x2="21" y2="6"></line>
                                        <line x1="8" y1="12" x2="21" y2="12"></line>
                                        <line x1="8" y1="18" x2="21" y2="18"></line>
                                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                    </svg>
                                </div>
                                <div className="t-icon-item" data-uk-tooltip="Grid View"
                                    style={{
                                        borderRight: ".5px solid #80808034",
                                        backgroundColor: activeTab === "grid" ? "#8080802d" : "transparent"
                                    }}
                                    onClick={() => { onSelectView("grid"); }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-grid"
                                    >
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                </div>
                                <div className="t-icon-item" data-uk-tooltip="Timeline"
                                    style={{
                                        backgroundColor: activeTab === "timeline" ? "#8080802d" : "transparent",
                                    }}
                                    onClick={() => { onSelectView("timeline") }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-calendar"
                                    >
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {(activeTab === "grid" || activeTab === "list") && (
                            <div className="milestone">
                                <h3 className="t-title">Milestones</h3>
                                <ul data-uk-accordion="multiple: true">
                                    {milestones.map((item) => (
                                        <li className="uk-close milestone-list" key={item.id} >
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <div className="m-status" style={{ backgroundColor: getMilestoneColors(item.status) }}>
                                                {item.status}
                                            </div>
                                            <a className="uk-accordion-title">
                                                <div className="milestone-title">
                                                    <span className="m-name">{item.taskName}</span>
                                                    <span className="uk-badge badge" style={{ backgroundColor: getMilestoneColors(item.status) }} >
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </a>
                                            <div className="uk-accordion-content">
                                                <ProjectMilestoneTasks
                                                    activeTab={activeTab}
                                                    milestone={item}
                                                    project={project}
                                                    milestoneId={item.id}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === "timeline" && (
                            <div className="catergory-milestone">
                                <GanttChartAction
                                    onViewListChange={setIsChecked}
                                    onViewModeChange={(viewMode) => setView(viewMode)}
                                    isChecked={isChecked}
                                />
                                <br />
                                {ganttTasks.length && (
                                    <Gantt
                                        tasks={ganttTasks}
                                        viewMode={view}
                                        onDateChange={onChangeTask}
                                        onDelete={onDeleteTask}
                                        onClick={onClick}
                                        onSelect={onTaskSelect}
                                        onExpanderClick={handleExpanderClick}
                                        listCellWidth={isChecked ? "155px" : ""}
                                        columnWidth={columnWidth}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    {/* Risks  "potential" | "identified" | "resolved" */}
                    <div className="t-main">
                        <ul data-uk-accordion="multiple: true">
                            <li className="uk-open">
                                <a className="uk-accordion-title">
                                    <h3 className="t-title">Risks</h3>
                                </a>
                                <div className="uk-accordion-content">
                                    <button className="risk-btn" onClick={handleNewRisk}>
                                        <span>New Risk </span>
                                    </button>
                                    <div className="catergory">
                                        <div className="tasks">
                                            <h5 className="h5">Potential</h5>
                                            <div className="content"
                                                onDrop={(e) => handleDrop(e, 'potential')}
                                                onDragOver={(e) => e.preventDefault()}
                                            >
                                                <ProjectGridRiskItem
                                                    loading={loading}
                                                    risks={potential}
                                                    color={"red"}
                                                    onSelectedRisk={onSelectedRisk}
                                                    handleUpdateRisk={handleUpdateRisk}
                                                    selectedRisk={selectedRisk}
                                                    setSelectedRisk={setRisk}
                                                    quickRiskUpdate={quickRiskUpdate}
                                                    handleDeleteRisk={handleDeleteRisk}
                                                />
                                            </div>
                                        </div>
                                        <div className="tasks">
                                            <h5 className="h5">Identified</h5>
                                            <div className="content"
                                                onDrop={(e) => handleDrop(e, 'identified')}
                                                onDragOver={(e) => e.preventDefault()}
                                            >
                                                <ProjectGridRiskItem
                                                    loading={loading}
                                                    risks={identified}
                                                    color={"orange"}
                                                    onSelectedRisk={onSelectedRisk}
                                                    handleUpdateRisk={handleUpdateRisk}
                                                    selectedRisk={selectedRisk}
                                                    setSelectedRisk={setRisk}
                                                    quickRiskUpdate={quickRiskUpdate}
                                                    handleDeleteRisk={handleDeleteRisk}
                                                />
                                            </div>
                                        </div>
                                        <div className="tasks">
                                            <h5 className="h5">Resolved</h5>
                                            <div className="content"
                                                onDrop={(e) => handleDrop(e, 'resolved')}
                                                onDragOver={(e) => e.preventDefault()}>
                                                <ProjectGridRiskItem
                                                    loading={loading}
                                                    risks={resolved}
                                                    color={"green"}
                                                    onSelectedRisk={onSelectedRisk}
                                                    handleUpdateRisk={handleUpdateRisk}
                                                    selectedRisk={selectedRisk}
                                                    setSelectedRisk={setRisk}
                                                    quickRiskUpdate={quickRiskUpdate}
                                                    handleDeleteRisk={handleDeleteRisk}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <ErrorBoundary>
                {/* <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} >
                    <h3>Logs</h3>
                    {logs.length !== 0 &&
                        <button className="uk-button uk-button-small uk-margin-bottom"
                            style={{ textTransform: "none", borderRadius: "3px" }}
                            onClick={deleteProjectLog}>
                            <span>Delete All</span>
                        </button>
                    }
                    <div className="log-list">
                        {logs.sort(sortByTime).map((item) => (
                            <div className="log" key={item.id}>
                                <h6>{item.uid && store.user.getItemById(item.uid)?.asJson.displayName} </h6>
                                <p>{item.actions}</p>
                                <span style={{ fontSize: ".8rem" }}>
                                    {moment(item.time).calendar()}
                                </span>
                            </div>
                        ))}
                    </div>
                </Sidebar> */}
                <Modal modalId={MODAL_NAMES.PROJECTS.CREATE_MILESTONE}>
                    <NewMilestoneModal projectId={project.id} currency={project.currency} />
                </Modal>
                <Modal modalId={MODAL_NAMES.PROJECTS.CREATE_RISK}>
                    <NewRiskModal projectId={project.id} />
                </Modal>
                <Modal modalId={MODAL_NAMES.PROJECTS.ADD_USER}>
                    <AddUserModal projectId={project.id} />
                </Modal>
                <Modal modalId={MODAL_NAMES.PROJECTS.VIEW_TASK}>
                    <ViewTaskModal />
                </Modal>
                <Modal modalId={MODAL_NAMES.PROJECTS.VIEW_RISK}>
                    <ViewRiskModal projectId={project.id} riskId={selectedRisk.id} />
                </Modal>
                <Modal modalId={MODAL_NAMES.PROJECTS.PROJECT_FILES}>
                    <FilesModal tasks={tasks} />
                </Modal>
            </ErrorBoundary>
        </ErrorBoundary>
    );
});

export default ProjectView;