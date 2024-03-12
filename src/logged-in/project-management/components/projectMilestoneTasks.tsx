import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../../shared/components/Modal";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import { IProject } from "../../../shared/models/ProjectManagement";
import { defaultTask, IProjectTask, IProjectTaskStatus } from "../../../shared/models/ProjectTasks";
import MODAL_NAMES from "../../dialogs/ModalName";
import AttachmentModal from "../../dialogs/project-management/AttachmentModal";
import NewTaskModal from "../../dialogs/project-management/NewTaskModal";
import NumberInput from "../../shared/components/number-input/NumberInput";
import { getCompletedTaskScore, getProgressColors, groupTasks } from "../utils/common";
import { moneyFormat } from "../utils/formats";
import { MilestineTaskGridView } from "./items/MilestoneTaskGridView";
import { MilestoneTaskListView } from "./items/MilestoneTaskListView";
// import "primeicons/primeicons.css";
// import "primereact/resources/primereact.min.css"; //core css
// import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
// import "../styles/projects.style.scss";

type Props = {
    milestone: IProjectTask;
    project: IProject;
    activeTab: "list" | "grid";
    milestoneId: string;
};

const ProjectMilestoneTasks: FC<Props> = observer(({ project, milestone, activeTab, milestoneId }) => {
    const { api, store } = useAppContext();
    const [loading, setLoading] = useState(false);

    const me = store.auth.meJson;
    const tasks = store.projectTask.all.map((task) => task.asJson).filter((task) => task.milestoneId === milestoneId);

    const [selectedMilestone, setSelectedMilestone] = useState("");
    const [selectedTask, setSelectedTask] = useState<IProjectTask>({ ...defaultTask });

    const todo = groupTasks(tasks, "todo");
    const inProgress = groupTasks(tasks, "in-progress");
    const inReview = groupTasks(tasks, "in-review");
    const done = groupTasks(tasks, "done");

    const progress = Math.round((done.length / tasks.length) * 100)

    const quickTaskUpdate = (_task: IProjectTask) => {
        store.projectTask.select(_task)
        if (store.projectTask.selected)
            setSelectedTask(store.projectTask.selected)
        else setSelectedTask(defaultTask)
    };

    const initiatePayment = (_task: IProjectTask) => {
        setSelectedMilestone(_task.taskName);
        showModalFromId(MODAL_NAMES.PROJECTS.ATTACH_MILESTONE_BILL);
    };

    const handleUpdateTask = async () => {

        if (!selectedTask) console.log("task not selected");

        try {
            setLoading(true);
            await api.projectManagement.updateTask(selectedTask.projectId, selectedTask);
            setLoading(false);
        } catch (error) {
        }
    }

    const updateTask = async () => {
        try {
            setLoading(true);
            await api.projectManagement.updateTask(selectedTask.projectId, selectedTask);
            setLoading(false);
        } catch (error) { }
    };

    const handleNewTask = () => {
        store.projectTask.selectMID(milestoneId);
        showModalFromId(MODAL_NAMES.PROJECTS.CREATE_TASK);
    };

    const deleteMilestone = async (milestone: IProjectTask) => {
        if (!window.confirm(`Are you sure you want to delete, this will delete all the tasks liked to this milestone`)) return;
        setLoading(true);
        try {
            await api.projectManagement.deleteMilestone(milestone.projectId, milestone, tasks);
        } catch (error) { }
        setLoading(false);
    };

    const handleDeleteTask = async (task: IProjectTask) => {
        if (!window.confirm(`Are you sure you want to delete`)) return;
        setLoading(true);
        await api.projectManagement.deleteTask(task.projectId, task);
        setLoading(false);
    };

    const onSelectedTask = (task: IProjectTask) => {
        store.projectTask.select(task)
        showModalFromId(MODAL_NAMES.PROJECTS.VIEW_TASK);
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: IProjectTaskStatus) => {
        const id = e.dataTransfer.getData('text/plain');
        const taskIndex = tasks.findIndex((task) => task.id === id);

        if (taskIndex !== -1) {
            const updatedTasks = [...tasks];
            const task = updatedTasks[taskIndex];
            task.status = status;
            await api.projectManagement.updateTask(task.projectId, task);
        }
    }

    useEffect(() => {
        const updateMilestone = async () => {
            if (done.length === tasks.length && tasks.length !== 0) {
                await api.projectManagement.updateMilestoneStatus(milestone.projectId, milestone, "done");
                // console.log("runned 1");

            } else {
                await api.projectManagement.updateMilestoneStatus(milestone.projectId, milestone, "todo")
                // console.log("runned 2");
            }
            await api.projectManagement.updateMilestoneProgress(milestone.projectId, milestone, progress)
            // console.log("runned 3");
        };
        updateMilestone();
    }, [api.projectManagement, done, milestone, progress, tasks.length]);


    return (
        <>
            <div className="milstone-actions">
                <div className="actions-btn">
                    <button
                        className="milestone-btn"
                        data-uk-tooltip="Create new task"
                        onClick={handleNewTask} >
                        <p>New Task</p>
                    </button>
                    {milestone.status === "done" &&
                        <button className="milestone-btn" type="button" data-uk-tooltip="This milestine is completed, Send budget to finance?"
                            onClick={() => initiatePayment(milestone)}>Send Budget
                        </button>
                    }
                    <button className="milestone-btn" type="button" data-uk-tooltip="Update milestone details"
                        onClick={() => quickTaskUpdate(milestone)}>Edit Milestone
                    </button>
                    <div data-uk-dropdown="mode: click">
                        <div className="drop-input">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={selectedTask ? selectedTask.taskName : milestone.taskName}
                                onChange={(e) => setSelectedTask({ ...selectedTask, taskName: e.target.value })}
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="description">Description</label> <br />
                            <div className="drop-input">
                                <textarea
                                    className="uk-textarea"
                                    value={selectedTask ? selectedTask.description : milestone.description}
                                    rows={2}
                                    onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <br />
                        <div className="uk-flex uk-flex-between">
                            <div>
                                <label htmlFor="description">Budgeted Amount</label> <br />
                                <div className="drop-input">
                                    <NumberInput
                                        value={selectedTask ? selectedTask.budgetedAmount : milestone.budgetedAmount}
                                        onChange={(value) => setSelectedTask({ ...selectedTask, budgetedAmount: Number(value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description">Actual Amount</label> <br />
                                <div className="drop-input">
                                    <NumberInput
                                        value={selectedTask ? selectedTask.actualAmount : milestone.actualAmount}
                                        onChange={(value) => setSelectedTask({ ...selectedTask, actualAmount: Number(value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="uk-flex uk-flex-between">
                            <div>
                                <label htmlFor="description">Start Date</label> <br />
                                <div className="drop-input">
                                    <input
                                        className="uk-input"
                                        type="date"
                                        name="startdate"
                                        id="startdate"
                                        value={selectedTask ? selectedTask.startDate : milestone.startDate}
                                        onChange={(e) => setSelectedTask({ ...selectedTask, startDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="enddate">End Date</label> <br />
                                <div className="drop-input">
                                    <input
                                        className="uk-input"
                                        type="date"
                                        name="enddate"
                                        id="enddate"
                                        value={selectedTask ? selectedTask.endDate : milestone.endDate}
                                        onChange={(e) => setSelectedTask({ ...selectedTask, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <br />
                        <br />
                        <br />
                        <div>{me && milestone.usersId[0] === me.uid &&
                            <div className="uk-flex uk-flex-between">
                                <div>
                                    <button className="delete-project-button" type="button"
                                        onClick={() => deleteMilestone(milestone)} >
                                        <span>Delete</span>
                                    </button>
                                </div>
                                <div>
                                    <button className="save-project-button" onClick={updateTask}
                                        type="button">
                                        <span>Save</span>
                                    </button>
                                </div>
                            </div>} {loading && (
                                <div style={{
                                    position: "absolute",
                                    top: "0",
                                    left: "0",
                                    width: "100%",
                                    height: "100%",
                                    display: "grid",
                                    placeItems: "center",
                                    backgroundColor: "#00000015",
                                }}>
                                    <div data-uk-spinner="ratio: 2"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="actions-spinners">
                    <div className="milestone-progress">
                        <div className="milestone-amount">
                            <h5 className="uk-text-bold">({project.currency || ""}) {moneyFormat(milestone.actualAmount)}</h5>
                        </div>
                        <div className="milestone-amount">
                            <p>Actual Amount</p>
                        </div>
                    </div>
                    <div className="milestone-progress">
                        <div className="milestone-amount">
                            <h5 className="uk-text-bold">({project.currency || ""}) {moneyFormat(milestone.budgetedAmount)}</h5>
                        </div>
                        <div className="milestone-amount">
                            <p>Budgeted Amount</p>
                        </div>
                    </div>
                    <div className="milestone-progress">
                        <div className="milestone-progress-status">
                            <CircularProgressbar
                                value={getCompletedTaskScore(done, tasks)}
                                maxValue={100}
                                text={`${getCompletedTaskScore(done, tasks)}%`}
                                styles={{
                                    text: {
                                        fontSize: "1.9rem",
                                        fill: getProgressColors(getCompletedTaskScore(done, tasks)),
                                    },
                                    path: { stroke: getProgressColors(getCompletedTaskScore(done, tasks)) },
                                }}
                            />
                        </div>
                        <p>Milestone Progress</p>
                    </div>

                    <div className="milestone-progress">
                        <div className="milestone-progress-status">
                            <CircularProgressbar
                                value={getCompletedTaskScore(done, tasks)}
                                maxValue={100}
                                text={`${done.length || 0}/${tasks?.length || 0}`}
                                styles={{
                                    text: { fontSize: "1.9rem", fill: getProgressColors(getCompletedTaskScore(done, tasks)) },
                                    path: { stroke: getProgressColors(getCompletedTaskScore(done, tasks)) },
                                }}
                            />
                        </div>
                        <p>Task Completed</p>
                    </div>
                </div>
            </div>

            {milestone.description && (
                <section className="description" style={{ marginLeft: "1rem" }}>
                    <h5>
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
                            className="feather feather-align-left"
                        >
                            <line x1="17" y1="10" x2="3" y2="10"></line>
                            <line x1="21" y1="6" x2="3" y2="6"></line>
                            <line x1="21" y1="14" x2="3" y2="14"></line>
                            <line x1="17" y1="18" x2="3" y2="18"></line>
                        </svg>
                        &nbsp; Description
                    </h5>
                    <p>{milestone.description}</p>
                    <hr className="data-uk-divider"></hr>
                </section>
            )}
            {activeTab === "grid" && (
                <div className="catergory">
                    <div className="tasks">
                        <h5 className="h5">To Do</h5>
                        <div className="content"
                            onDrop={(e) => handleDrop(e, 'todo')}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <MilestineTaskGridView
                                loading={loading}
                                tasks={todo} color={"red"}
                                onSelectedTask={onSelectedTask}
                                handleUpdateTask={handleUpdateTask}
                                selectedTask={selectedTask}
                                setSelectedTask={setSelectedTask}
                                quickTaskUpdate={quickTaskUpdate}
                                handleDeleteTask={handleDeleteTask}

                            />
                        </div>
                    </div>
                    <div className="tasks">
                        <h5 className="h5">In Progress</h5>
                        <div className="content"
                            onDrop={(e) => handleDrop(e, 'in-progress')}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <MilestineTaskGridView
                                loading={loading}
                                tasks={inProgress} color={"orange"}
                                onSelectedTask={onSelectedTask}
                                handleUpdateTask={handleUpdateTask}
                                selectedTask={selectedTask}
                                setSelectedTask={setSelectedTask}
                                quickTaskUpdate={quickTaskUpdate}
                                handleDeleteTask={handleDeleteTask}

                            />
                        </div>
                    </div>
                    <div className="tasks">
                        <h5 className="h5">In Review</h5>
                        <div className="content"
                            onDrop={(e) => handleDrop(e, 'in-review')}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <MilestineTaskGridView
                                loading={loading}
                                tasks={inReview} color={"purple"}
                                onSelectedTask={onSelectedTask}
                                handleUpdateTask={handleUpdateTask}
                                selectedTask={selectedTask}
                                setSelectedTask={setSelectedTask}
                                quickTaskUpdate={quickTaskUpdate}
                                handleDeleteTask={handleDeleteTask}
                            />
                        </div>
                    </div>
                    <div className="tasks">
                        <h5 className="h5">Done</h5>
                        <div className="content"
                            onDrop={(e) => handleDrop(e, 'done')}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <MilestineTaskGridView
                                loading={loading}
                                tasks={done} color={"green"}
                                onSelectedTask={onSelectedTask}
                                handleUpdateTask={handleUpdateTask}
                                selectedTask={selectedTask}
                                setSelectedTask={setSelectedTask}
                                quickTaskUpdate={quickTaskUpdate}
                                handleDeleteTask={handleDeleteTask}
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "list" && (
                <div className="catergory-list">
                    <h3>Tasks</h3>
                    <div className="todo">
                        <h4>
                            <b>Todo</b>
                        </h4>
                        <div className="task-list"
                            onDrop={(e) => handleDrop(e, 'todo')}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <MilestoneTaskListView
                                tasks={todo}
                                color={"red"}
                                onSelectedTask={onSelectedTask}
                                selectedTask={selectedTask}
                                loading={loading}
                            />
                        </div>
                    </div>
                    <div className="in-progress">
                        <h4>
                            <b>In Progress</b>
                        </h4>
                        <div className="task-list"
                            onDrop={(e) => handleDrop(e, 'in-progress')}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <MilestoneTaskListView
                                tasks={inProgress}
                                color={"orange"}
                                onSelectedTask={onSelectedTask}
                                selectedTask={selectedTask}
                                loading={loading}
                            />
                        </div>
                    </div>
                    <div className="in-review">
                        <h4>
                            <b>In Review</b>
                        </h4>
                        <div className="task-list"
                            onDrop={(e) => handleDrop(e, 'in-review')}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <MilestoneTaskListView
                                tasks={inReview}
                                color={"purple"}
                                onSelectedTask={onSelectedTask}
                                selectedTask={selectedTask}
                                loading={loading}
                            />
                        </div>
                    </div>
                    <div className="done">
                        <h4>
                            <b>Done</b>
                        </h4>
                        <div className="task-list"
                            onDrop={(e) => handleDrop(e, 'done')}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <MilestoneTaskListView
                                tasks={done}
                                color={"green"}
                                onSelectedTask={onSelectedTask}
                                selectedTask={selectedTask}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            )}
            <ErrorBoundary>
                <Modal modalId={MODAL_NAMES.PROJECTS.CREATE_TASK}>
                    <NewTaskModal projectId={project.id} />
                </Modal>
                <Modal modalId={MODAL_NAMES.PROJECTS.ATTACH_MILESTONE_BILL}>
                    <AttachmentModal project={project.projectName} projectId={project.id} milestone={selectedMilestone} />
                </Modal>
            </ErrorBoundary>
        </>
    );
}
);

export default ProjectMilestoneTasks;