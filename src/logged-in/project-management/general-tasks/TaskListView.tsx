import moment from "moment";
import { IGeneralTask } from "../../../shared/models/GeneralTasks";
import { getInitials, timeFormart } from "../utils/common";
import { useAppContext } from "../../../shared/functions/Context";

interface IListProps {
    loading: boolean;
    tasks: IGeneralTask[];
    color: string;
    onSelectedTask: (task: IGeneralTask) => void;
    selectedTask: IGeneralTask;
}

export const TasksListView = (props: IListProps) => {

    const { store } = useAppContext();
    const me = store.auth.meJson;

    const { tasks, color, onSelectedTask } = props;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        e.dataTransfer.setData('text/plain', taskId);
    }

    return (
        <div>
            {tasks.map((task, index) => (
                <div data-uk-tooltip="Drag and Drop, Double Click for more."
                    key={index} draggable onDragStart={(e) => handleDragStart(e, task.id)}>
                    <div className="list-item" key={task.id} onDoubleClick={() => { onSelectedTask(task) }}>
                        <div className="list-item-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-square">
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                            <span>{task.taskName}</span> &nbsp;&nbsp;
                            {task.type === "milestone" && <div data-uk-tooltip="milestone" style={{ color: "black" }} className="milestone">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="orange" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-hexagon">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                </svg>
                            </div>}

                            <div className="mcount">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                &nbsp;
                                <span>{(task.comments) ? task.comments?.length : "0"}</span>
                            </div>
                        </div>

                        <div className="projectName" data-uk-tooltip={store.projectManagement.getItemById(task.projectId)?.asJson.projectName}>
                            <span style={{ color: color }}>{store.projectManagement.getItemById(task.projectId)?.asJson.projectName}</span>
                        </div>

                        <div className="list-users">
                            <div className="l-u users">
                                {task.usersId.slice(0, 6).map((userId) => {
                                    const user = store.user.getItemById(userId)?.asJson.displayName;
                                    return (
                                        <div className="user" style={{ textTransform: 'uppercase' }} key={userId} data-uk-tooltip={user}>
                                            {(user && userId !== me?.uid) ? getInitials(user) : "ME"}
                                        </div>
                                    )
                                })}
                                {task.usersId.length > 6 ? (<div className="user" style={{ textTransform: 'uppercase' }} data-uk-tooltip={task.usersId.slice(6).map((userId) => store.user.getItemById(userId)?.asJson.displayName)}>
                                    +{(task.usersId.length - 6)}
                                </div>) : null
                                }
                            </div>
                        </div>
                        <div className="list-item-dates">
                            <div style={{ fontSize: '.7rem' }}> <b>START: </b> {moment(task.startDate).calendar(null, timeFormart)}</div>
                            <div style={{ fontSize: '.7rem' }}> <b>END: </b>  {moment(task.endDate).calendar(null, timeFormart)}</div>
                        </div>
                        <div className="item-colors" style={{ backgroundColor: color }}>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}