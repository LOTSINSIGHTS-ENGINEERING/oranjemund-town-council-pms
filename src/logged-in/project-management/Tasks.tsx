import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../../shared/components/error-boundary/ErrorBoundary';
import { LoadingEllipsis } from '../../shared/components/loading/Loading';
import Modal from '../../shared/components/Modal';
import { useAppContext } from '../../shared/functions/Context';
import showModalFromId from '../../shared/functions/ModalShow';
import useBackButton from '../../shared/hooks/useBack';
import useTitle from '../../shared/hooks/useTitle';
import MODAL_NAMES from '../dialogs/ModalName';
import GanttChartAction from './components/ganttViewActions';
import { ganttChartTasks } from './data/itemsTypes';
import { getDefaultView, groupGeneralTasks } from './utils/common';
import { TasksGridView } from './general-tasks/TasksGridView';
import { IGeneralTask, IGeneralTaskStatus, defaultGeneralTask } from '../../shared/models/GeneralTasks';
import { TasksListView } from './general-tasks/TaskListView';
import Toolbar from '../shared/components/toolbar/Toolbar';

import { IProjectTask } from '../../shared/models/ProjectTasks';
import "./styles/tasks.style.scss";
import "gantt-task-react/dist/index.css";

const Tasks = observer(() => {
    useTitle("Tasks");
    useBackButton("/c/projects");
    const { api, store, ui } = useAppContext();

    const [view, setView] = React.useState<ViewMode>(getDefaultView());

    const [selectedTask, setSelectedTask] = useState<IGeneralTask>({ ...defaultGeneralTask });

    const [activeTab, setActiveTab] = useState(`${localStorage.getItem('view-style') || "grid"}`);
    const [isChecked, setIsChecked] = useState(localStorage.getItem("active-list") === "true" ? true : false);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    let columnWidth = 65;
    if (view === ViewMode.Year) {
        columnWidth = 350;
    } else if (view === ViewMode.Month) {
        columnWidth = 300;
    } else if (view === ViewMode.Week) {
        columnWidth = 250;
    }

    const me = store.auth.meJson;

    const tasks: Task[] | IGeneralTask[] = store.generalTask.all.map((task) => task.asJson);

    const todo = groupGeneralTasks(tasks, "todo");
    const inProgress = groupGeneralTasks(tasks, "in-progress");
    const inReview = groupGeneralTasks(tasks, "in-review");
    const done = groupGeneralTasks(tasks, "done");
    const ganttTasks = ganttChartTasks(tasks, store);

    const quickTaskUpdate = (_task: IGeneralTask) => {
        setSelectedTask(_task)
    };

    const onSelectedTask = (task: IGeneralTask) => {
        store.generalTask.select(task)
        showModalFromId(MODAL_NAMES.GENERAL_TASKS.VIEW_GENERAL_TASKS);
    }

    const handleUpdateTask = async () => {

        try {
            setLoading(true);
            await api.generalTask.updateTask(selectedTask);
            setLoading(false);
        } catch (error) {
            ui.snackbar.load({
                id: Date.now(),
                message: "Error! Failed to update.",
                type: "danger",
            });
        }
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: IGeneralTaskStatus) => {
        const id = e.dataTransfer.getData('text/plain');
        const taskIndex = tasks.findIndex((task) => task.id === id);

        if (taskIndex !== -1) {
            const updatedTasks = [...tasks];
            const task = updatedTasks[taskIndex];
            task.status = status;
            await api.generalTask.updateTask(task);
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

    const onDeleteTask = async (task: Task | any) => {
        if (!window.confirm(`Are you sure you want to delete ${task.name}`))
            await api.projectManagement.delete({ path: `projects/${task.projectId}/tasks`, id: task.id, type: "task" })
    }

    const onDoubleClick = (task: Task | any) => {
        if (task.type === "task") onSelectedTask(task);
    }

    const onClick = (task: Task | any) => { }

    const onTaskSelect = (task: Task) => { }

    const onSelectView = (view: string) => {
        setActiveTab(view);
        localStorage.setItem('view-style', view);
    }

    const handleExpanderClick = (task: Task) => { };

    const handleDeleteTask = async (task: IGeneralTask) => {
        if (!window.confirm(`Are you sure you want to delete ${task.taskName}`)) return;
        setLoading(true);
        await api.generalTask.deleteTask(task)
        setLoading(false);
    }

    const handleNewTask = () => {
        store.generalTask.clearSelected()
        showModalFromId(MODAL_NAMES.GENERAL_TASKS.CREATE_GENERAL_TASK);
    }

    useEffect(() => {
        if (!me) return;

        setLoadingData(true)
        const loadData = async () => {
            await api.generalTask.getUserTasks(me.uid);
        }
        loadData();
        setLoadingData(false)
    }, [api.generalTask, me]);


    if (loadingData) return (
        <div style={{ width: "100%", height: "50vh", display: "grid", placeItems: "center" }}>
            <LoadingEllipsis />
        </div>
    )

    return (
        <ErrorBoundary>
            <div className="uk-section uk-section-small">
                <div className="uk-container uk-container-xlarge">
                    <ErrorBoundary>
                        <Toolbar
                            leftControls={
                                <ErrorBoundary>
                                    <div className="tasks-actions">
                                        <div className="tasks-buttons">
                                            <div className="t-view uk-flex">
                                                <div className="t-icon-item" data-uk-tooltip="List View" style={{ borderRight: ".5px solid #80808034", backgroundColor: activeTab === "list" ? "#8080802d" : "transparent" }} onClick={() => { onSelectView("list") }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list">
                                                        <line x1="8" y1="6" x2="21" y2="6"></line>
                                                        <line x1="8" y1="12" x2="21" y2="12"></line>
                                                        <line x1="8" y1="18" x2="21" y2="18"></line>
                                                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                                    </svg>
                                                </div>
                                                <div className="t-icon-item" data-uk-tooltip="Grid View" style={{ borderRight: ".5px solid #80808034", backgroundColor: activeTab === "grid" ? "#8080802d" : "transparent" }} onClick={() => { onSelectView("grid") }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid">
                                                        <rect x="3" y="3" width="7" height="7"></rect>
                                                        <rect x="14" y="3" width="7" height="7"></rect>
                                                        <rect x="14" y="14" width="7" height="7"></rect>
                                                        <rect x="3" y="14" width="7" height="7"></rect>
                                                    </svg>
                                                </div>
                                                <div className="t-icon-item" data-uk-tooltip="Timeline" style={{ backgroundColor: activeTab === "timeline" ? "#8080802d" : "transparent" }} onClick={() => { onSelectView("timeline") }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ErrorBoundary>
                            }
                            rightControls={
                                <ErrorBoundary>
                                    <button
                                        className="btn btn-primary uk-margin-small-right"
                                        onClick={handleNewTask}
                                        title="Add a new task."
                                    ><span data-uk-icon="icon: plus-circle; ratio:.8"></span> New
                                        Task
                                    </button>
                                </ErrorBoundary>
                            }
                        />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <div className="users-tasks">
                            <div className="tasks-content">

                                {activeTab === "list" && <div className="catergory-list">
                                    <h3>Tasks</h3>
                                    <div className="todo">
                                        <h4><b>Todo</b></h4>
                                        <div className="task-list"
                                            onDrop={(e) => handleDrop(e, 'todo')}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <TasksListView
                                                tasks={todo}
                                                color={"red"}
                                                onSelectedTask={onSelectedTask}
                                                selectedTask={selectedTask}
                                                loading={loading}
                                            />
                                        </div>
                                    </div>
                                    <div className="in-progress">
                                        <h4><b>In Progress</b></h4>
                                        <div className="task-list"
                                            onDrop={(e) => handleDrop(e, 'in-progress')}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <TasksListView
                                                tasks={inProgress}
                                                color={"orange"}
                                                onSelectedTask={onSelectedTask}
                                                selectedTask={selectedTask}
                                                loading={loading}
                                            />
                                        </div>
                                    </div>
                                    <div className="in-review">
                                        <h4><b>In Review</b></h4>
                                        <div className="task-list"
                                            onDrop={(e) => handleDrop(e, 'in-review')}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <TasksListView
                                                tasks={inReview}
                                                color={"purple"}
                                                onSelectedTask={onSelectedTask}
                                                selectedTask={selectedTask}
                                                loading={loading}
                                            />
                                        </div>
                                    </div>
                                    <div className="done">
                                        <h4><b>Done</b></h4>
                                        <div className="task-list"
                                            onDrop={(e) => handleDrop(e, 'done')}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <TasksListView
                                                tasks={done}
                                                color={"green"}
                                                onSelectedTask={onSelectedTask}
                                                selectedTask={selectedTask}
                                                loading={loading}
                                            />
                                        </div>
                                    </div>
                                </div>
                                }
                                {activeTab === "grid" && <div className="catergory-grid">
                                    <div className="tasks">
                                        <h5 className="h5">To Do</h5>
                                        <div className="content"
                                            onDrop={(e) => handleDrop(e, 'todo')}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <TasksGridView loading={loading}
                                                tasks={todo} color={"red"}
                                                onSelectedTask={onSelectedTask}
                                                handleUpdateTask={handleUpdateTask}
                                                selectedTask={selectedTask}
                                                setSelectedTask={setSelectedTask}
                                                quickTaskUpdate={quickTaskUpdate}
                                                handleDeleteTask={handleDeleteTask} />
                                        </div>
                                    </div>
                                    <div className="tasks">
                                        <h5 className="h5">In Progress</h5>
                                        <div className="content"
                                            onDrop={(e) => handleDrop(e, 'in-progress')}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <TasksGridView loading={loading}
                                                tasks={inProgress}
                                                color={"orange"}
                                                onSelectedTask={onSelectedTask}
                                                handleUpdateTask={handleUpdateTask}
                                                selectedTask={selectedTask}
                                                setSelectedTask={setSelectedTask}
                                                quickTaskUpdate={quickTaskUpdate}
                                                handleDeleteTask={handleDeleteTask} />
                                        </div>
                                    </div>
                                    <div className="tasks">
                                        <h5 className="h5">In Review</h5>
                                        <div className="content"
                                            onDrop={(e) => handleDrop(e, 'in-review')}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <TasksGridView
                                                loading={loading}
                                                tasks={inReview} color={"purple"}
                                                onSelectedTask={onSelectedTask}
                                                handleUpdateTask={handleUpdateTask}
                                                selectedTask={selectedTask}
                                                setSelectedTask={setSelectedTask}
                                                quickTaskUpdate={quickTaskUpdate}
                                                handleDeleteTask={handleDeleteTask} />
                                        </div>
                                    </div>
                                    <div className="tasks">
                                        <h5 className="h5">Done</h5>
                                        <div className="content"
                                            onDrop={(e) => handleDrop(e, 'done')}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <TasksGridView
                                                loading={loading}
                                                tasks={done} color={"green"}
                                                onSelectedTask={onSelectedTask}
                                                handleUpdateTask={handleUpdateTask}
                                                selectedTask={selectedTask}
                                                setSelectedTask={setSelectedTask}
                                                quickTaskUpdate={quickTaskUpdate}
                                                handleDeleteTask={handleDeleteTask} />
                                        </div>
                                    </div>
                                </div>
                                }
                                {activeTab === "timeline" && <div className="catergory-milestone">
                                    <GanttChartAction onViewListChange={setIsChecked} onViewModeChange={viewMode => setView(viewMode)} isChecked={isChecked} />
                                    <br />
                                    {ganttTasks.length &&
                                        <Gantt
                                            tasks={ganttTasks}
                                            viewMode={view}
                                            onDateChange={onChangeTask}
                                            onDelete={onDeleteTask}
                                            // onProgressChange={onProgressChange}
                                            onDoubleClick={onDoubleClick}
                                            onClick={onClick}
                                            onSelect={onTaskSelect}
                                            onExpanderClick={handleExpanderClick}
                                            listCellWidth={isChecked ? "155px" : ""}
                                            // ganttHeight={300}
                                            columnWidth={columnWidth}
                                        />
                                    }
                                </div>
                                }
                            </div>
                        </div>
                        <ErrorBoundary>
                            <Modal modalId={MODAL_NAMES.GENERAL_TASKS.CREATE_GENERAL_TASK}>
                                {/* <GeneralTaskModal /> */}
                            </Modal>
                            <Modal modalId={MODAL_NAMES.GENERAL_TASKS.VIEW_GENERAL_TASKS}>
                                {/* <ViewGeneralTaskModal /> */}
                            </Modal>
                        </ErrorBoundary>
                    </ErrorBoundary>
                </div>
            </div>
        </ErrorBoundary>
    )
});

export default Tasks;