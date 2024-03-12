import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import CheckInWeek from "../../shared/models/check-in-model/CheckInWeek";
import { ICheckInWeekTask } from "../../shared/models/check-in-model/CheckInWeekTask";
import icons from "../shared/utils/icons";

interface IGridProps {
    tasks: ICheckInWeekTask[]
    onSelectedTask: (task: ICheckInWeekTask) => void;
    onDeleteTask: (task: ICheckInWeekTask) => void;
    selectedWeek: CheckInWeek | undefined;
    color: string;
    currentWeek: boolean | undefined;
}

export const TaskGridItem = observer((props: IGridProps) => {

    const { store } = useAppContext()
    const me = store.auth.meJson
    const { tasks, onSelectedTask, onDeleteTask, color, selectedWeek, currentWeek } = props;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        e.dataTransfer.setData('text/plain', taskId);
    }

    return (
        <div>
            {me && tasks.map((task, index) => (
                <div key={index} className="item" data-uk-tooltip="Drag and Drop" draggable={me.uid === task.uid} onDragStart={(e) => handleDragStart(e, task.id)}>
                    <div className="item-inside">
                        <div className="item-top">
                            <span style={{ backgroundColor: color }}></span>
                            <span style={{ backgroundColor: color }}></span>
                        </div>
                        <div className="item-title">
                            <span>{task.taskName}</span>
                        </div>
                        <p className="item-description">{task.taskDescription}</p>
                        {task.milestoneId && selectedWeek && (
                            <img data-uk-tooltip={selectedWeek.asJson.weeklyMilestones.find((mile) => mile.milestoneId === task.milestoneId)?.milestoneName}
                                src={icons.milestone} alt="Milestone" width="24" height="24" data-uk-svg />

                        )}
                        <div className="item-project uk-margin-top">
                            <span className="uk-text-small">Project :{task.projectName}</span>
                        </div>
                        <div className="cont">
                            <div>
                                {task.taskType === "elephant" && (
                                    <div data-uk-tooltip="Elephant" className="elephant">
                                        <img src={icons.elephant} alt="Elephant" width="40" height="40" data-uk-svg />
                                    </div>
                                )}
                                {task.taskType === "horse" && (
                                    <div data-uk-tooltip="Horse" className="elephant">
                                        <img src={icons.horse} alt="Horse" width="50" height="50" data-uk-svg />
                                    </div>
                                )}
                                {task.taskType === "rabbit" && (
                                    <div data-uk-tooltip="Horse" className="elephant">
                                        <img src={icons.rabbit} alt="Rabbit" width="50" height="50" data-uk-svg />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="item-title">
                                    <small>{task.allocatedTime} Hours</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    {me && task.uid === me.uid &&
                        <div className="uk-inline card-actions">
                            <button disabled={currentWeek} onClick={() => { onSelectedTask(task) }} type="button" className="edit-action-button" data-uk-tooltip="Edit">
                                <img src={icons.circularpen} alt="Delete" data-uk-svg />
                            </button>
                            <button disabled={currentWeek} onClick={() => { onDeleteTask(task) }} type="button" className="delete-action-button" data-uk-tooltip="Delete">
                                <img src={icons.deleteicon} alt="Delete" data-uk-svg />
                            </button>
                        </div>
                    }
                </div>
            ))}
        </div>
    )
});

