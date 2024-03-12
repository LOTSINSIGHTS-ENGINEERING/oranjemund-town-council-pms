import moment from "moment";
import { IProjectTask, IProjectTaskStatus, IProjectTasktype } from "../../../../shared/models/ProjectTasks";
import { timeFormart, getInitials } from "../../utils/common";
import React from "react";
import { useAppContext } from "../../../../shared/functions/Context";

interface IGridProps {
    loading: boolean;
    tasks: IProjectTask[];
    color: string;
    onSelectedTask: (task: IProjectTask) => void;
    handleUpdateTask: (task: IProjectTask) => void;
    selectedTask: IProjectTask;
    setSelectedTask: React.Dispatch<React.SetStateAction<IProjectTask>>;
    quickTaskUpdate: (task: IProjectTask) => void
    handleDeleteTask: (task: IProjectTask) => void;
}

export const MilestineTaskGridView = (props: IGridProps) => {

    const { store } = useAppContext();
    const me = store.auth.meJson;

    const { tasks, loading, color, onSelectedTask, handleUpdateTask,
        selectedTask, setSelectedTask, quickTaskUpdate, handleDeleteTask } = props;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        e.dataTransfer.setData('text/plain', taskId);
    }

    return (
        <div>
            {tasks.map((task, index) => (
                <div className="item" data-uk-tooltip="Drag and Drop, Double Click for more." key={index} draggable onDragStart={(e) => handleDragStart(e, task.id)}>
                    <div className="item-inside" onDoubleClick={() => { onSelectedTask(task) }}>
                        <div className="item-top">
                            <span style={{ backgroundColor: color }}></span>
                            <span style={{ backgroundColor: color }}></span>
                        </div>
                        <div className="item-title" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-check-square"
                            >
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                            <span>{task.taskName}</span>
                        </div>
                        <div style={{ fontSize: "10px", marginTop: "1rem", marginBottom: ".4rem", }} >
                            {moment(task.startDate).calendar(null, timeFormart)} - {moment(task.endDate).calendar(null, timeFormart)}
                        </div>
                        <div className="cont">
                            <div className="l-u users">
                                {task.usersId.slice(0, 3).map((userId, index) => {
                                    const user = store.user.getItemById(userId)?.asJson.displayName;
                                    return (
                                        <div className="user" style={{ textTransform: "uppercase" }} key={index}
                                            data-uk-tooltip={user} >
                                            {user && userId !== me?.uid ? getInitials(user) : "me"}
                                        </div>
                                    );
                                })}
                                {task.usersId.length > 3 ? (
                                    <div
                                        className="user"
                                        style={{ textTransform: "uppercase" }}
                                        data-uk-tooltip={task.usersId.slice(3).map((userId) => store.user.getItemById(userId)?.asJson.displayName)}
                                    >
                                        +{task.usersId.length - 3}
                                    </div>
                                ) : null}
                            </div>
                            {task.type === "milestone" && (
                                <div data-uk-tooltip="Milestone"
                                    style={{ color: "black" }}
                                    className="milestone"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="orange"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-hexagon"
                                    >
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    </svg>
                                </div>
                            )}
                            <div className="mcount">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-message-square"
                                >
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                &nbsp;
                                <span>{task.comments ? task.comments?.length : "0"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="uk-inline card-actions">
                        <button className="edit-action-button" data-uk-tooltip="Edit task" onClick={() => quickTaskUpdate(task)}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" className="feather feather-edit"
                            >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <div data-uk-dropdown="mode: click">
                            <div>
                                <div className="drop-input">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Task name"
                                        value={selectedTask ? selectedTask.taskName : task.taskName}
                                        onChange={(e) => setSelectedTask({ ...selectedTask, taskName: e.target.value })}
                                    />
                                </div>
                                <div className="item-status">
                                    <label htmlFor="task-status">Status</label>
                                    <select
                                        id="task-status"
                                        className="uk-select"
                                        name="status"
                                        value={selectedTask ? selectedTask.status : task.status}
                                        onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value as IProjectTaskStatus })}>
                                        <option value={"todo"}>To Do</option>
                                        <option value={"in-progress"}>In Progress</option>
                                        <option value={"in-review"}>In Review</option>
                                        <option value={"done"}>Done</option>
                                    </select>
                                </div>
                                <div className="item-status">
                                    <label htmlFor="type">Type</label>
                                    <select
                                        id="type"
                                        className="uk-select"
                                        name="type"
                                        value={selectedTask ? selectedTask.type : task.type}
                                        onChange={(e) => setSelectedTask({ ...selectedTask, type: e.target.value as IProjectTasktype })}>
                                        <option value={"task"}>Task</option>
                                        <option value={"milestone"}>Milestone</option>
                                    </select>
                                </div>
                                <br />
                                <div className="">
                                    <label htmlFor="description">Description</label> <br />
                                    <div className="drop-input">
                                        <textarea
                                            className="uk-textarea"
                                            value={selectedTask ? selectedTask.description : task.description}
                                            rows={2}
                                            placeholder="description"
                                            onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <hr className="uk-divider" />
                            <div>
                                {me && task.usersId[0] === me.uid &&
                                    <div className="uk-flex uk-flex-between">
                                        <div>
                                            <button className="delete-project-button"
                                                onClick={() => handleDeleteTask(task)}>
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button className="save-project-button" onClick={() => handleUpdateTask(task)}
                                                type="button">
                                                <span>Save</span>
                                            </button>
                                        </div>
                                    </div>
                                }
                                {loading && (
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
                </div>
            ))}
        </div>
    )
};