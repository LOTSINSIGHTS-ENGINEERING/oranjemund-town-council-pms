import { lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Toolbar from "../shared/components/toolbar/Toolbar";
import MODAL_NAMES from "../dialogs/ModalName";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import { observer } from "mobx-react-lite";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import showModalFromId, {
  confirmationDialog,
} from "../../shared/functions/ModalShow";
import { useNavigate, useParams } from "react-router-dom";
import { TaskGridItem } from "./TaskGridItem";
import {
  groupWeeklyTasks,
  getCompletedTaskScore,
  getProgressColors,
  getTaskType,
  weeklyUtilization,
  milestoneAnalytics,
} from "./items/items";
import {
  ICheckInWeekTask,
  IWeeklyTaskStatus,
} from "../../shared/models/check-in-model/CheckInWeekTask";
import { CircularProgressbar } from "react-circular-progressbar";
import { ICheckInWeek } from "../../shared/models/check-in-model/CheckInWeek";
import { WeekTabItem } from "./WeekTabItem";
import "react-circular-progressbar/dist/styles.css";

const Modal = lazy(() => import("../../shared/components/Modal"));
const CheckInWeekTaskModal = lazy(
  () => import("../dialogs/check-in-week-task/CheckInWeekTaskModal")
);
const CheckInWeekModal = lazy(
  () => import("../dialogs/check-in-week/CheckInWeekModal")
);

const CheckInMonthUserView = observer(() => {
  const { api, store, ui } = useAppContext();
  const me = store.auth.meJson;

  const {
    yearId = "defaultYearId",
    monthId = "defaultMonthId",
    uid = "userId",
  } = useParams<{ yearId?: string; monthId?: string; uid: string }>();

  const [title, setTitle] = useTitle();
  const [loading, setLoading] = useState(false);
  const [loadingTasks, setLoadingTask] = useState(false);
  const [weekId, setWeekId] = useState<string>("");
  const [selectedTab, setselectedTab] = useState("");

  const firstRenderRef = useRef(true);
  const navigate = useNavigate();
  useBackButton(`/c/checkin/${yearId}/${monthId}`);

  const month = store.checkIn.checkInMonth.getById(monthId);
  const selectedWeek = store.checkIn.checkInWeek.getById(weekId);

  const user = store.user.getById(uid);
  const checkInWeek = store.checkIn.checkInWeek.getByUid(uid);

  const currentWeek = useMemo(() => {
    if (!selectedWeek) return;
    const currentW =
      checkInWeek[0].asJson.id !== selectedWeek.asJson.id ? true : false;
    return currentW;
  }, [checkInWeek, selectedWeek]);

  const tasks = selectedWeek
    ? selectedWeek.tasks.map((task) => task.asJson)
    : [];
  const miles = selectedWeek ? selectedWeek.asJson.weeklyMilestones : [];

  const todo = groupWeeklyTasks(tasks, "todo");
  const review = groupWeeklyTasks(tasks, "in-review");
  const done = groupWeeklyTasks(tasks, "done");

  const elephants = getTaskType(tasks, "elephant");
  const completedElephants = groupWeeklyTasks(elephants, "done");
  const utilization = weeklyUtilization(tasks);
  const milestones = milestoneAnalytics(miles);
  const isWeekDone =
    getCompletedTaskScore(done, tasks) < 60 && checkInWeek.length !== 0;

  const isWeekIdAndOwned = useMemo(() => {
    if (!selectedWeek || !me) return;
    const checkMe = weekId === "" || selectedWeek.asJson.uid !== me.uid;
    return checkMe;
  }, [me, selectedWeek, weekId]);

  const activeTab = (tab: string) => {
    return tab === selectedTab ? "uk-active" : "";
  };

  const onClickTab = (tab: string) => {
    setselectedTab(tab);
    setWeekId(tab);
  };

  const handleNewWeek = () => {
    showModalFromId(MODAL_NAMES.CHECKIN.CHECK_IN_WEEK);
  };

  const handleNewWeekTask = () => {
    showModalFromId(MODAL_NAMES.CHECKIN.CHECK_IN_WEEK_TASK);
  };

  const onSelectedTask = (task: ICheckInWeekTask) => {
    store.checkIn.checkInWeekTask.select(task);
    showModalFromId(MODAL_NAMES.CHECKIN.CHECK_IN_WEEK_TASK);
  };

  const onEdit = (week: ICheckInWeek) => {
    store.checkIn.checkInWeek.select(week);
    showModalFromId(MODAL_NAMES.CHECKIN.CHECK_IN_WEEK);
  };

  const onDeleteWeek = async () => {
    if (selectedWeek) {
      confirmationDialog().then(
        async function () {
          selectedWeek.tasks.forEach(async (task) => {
            await api.checkIn.checkInWeekTask.delete(
              yearId,
              monthId,
              task.asJson
            );
          });
          await api.checkIn.checkInWeek.delete(
            yearId,
            monthId,
            selectedWeek.asJson
          );
          ui.snackbar.load({
            id: Date.now(),
            message: "Deleted.",
            type: "success",
          });
        },
        function () {}
      );
    }
  };

  const onDeleteTask = async (task: ICheckInWeekTask) => {
    confirmationDialog().then(
      async function () {
        await api.checkIn.checkInWeekTask.delete(yearId, monthId, task);
        ui.snackbar.load({
          id: Date.now(),
          message: "Deleted.",
          type: "success",
        });
      },
      function () {}
    );
  };

  const handleCheckboxChange = async (index: number) => {
    if (selectedWeek) {
      const $miles = [...selectedWeek.asJson.weeklyMilestones];
      $miles[index].completed = !$miles[index].completed;
      try {
        await api.checkIn.checkInWeek.update(yearId, monthId, {
          ...selectedWeek.asJson,
          weeklyMilestones: $miles,
        });
      } catch (error) {
        ui.snackbar.load({
          id: Date.now(),
          message: "An error occured.",
          type: "warning",
        });
      }
    }
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    status: IWeeklyTaskStatus
  ) => {
    const id = e.dataTransfer.getData("text/plain");
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      const updatedTasks = [...tasks];
      const task = updatedTasks[taskIndex];
      task.taskStatus = status;
      try {
        await api.checkIn.checkInWeekTask.update(yearId, monthId, task);
      } catch (error) {}
    }
  };

  const loadTask = useCallback(async () => {
    setLoadingTask(true);
    try {
      await api.checkIn.checkInWeekTask.getAll(yearId, monthId, weekId);
    } catch (error) {}
    setLoadingTask(false);
  }, [yearId, monthId, weekId, api.checkIn.checkInWeekTask]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  useEffect(() => {
    if (!firstRenderRef.current || checkInWeek.length === 0) return;
    const lastWeek = checkInWeek[0].asJson.id;
    setWeekId(lastWeek);
    firstRenderRef.current = false;
  }, [checkInWeek, setWeekId]);

  useEffect(() => {
    if (month && user) {
      setTitle(
        `Check In for ${month.asJson.monthName}, ${user.asJson.displayName}`
      );
      document.title = title;
    } else navigate(`/c/checkin/${yearId}`);
  }, [navigate, month, setTitle, user, yearId, title]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.checkIn.checkInWeek.getAll(yearId, monthId, uid);
      } catch (error) {}
      setLoading(false);
    };
    loadData();
  }, [api.checkIn.checkInWeek, monthId, uid, yearId]);

  // week 21 1685923200000
  // week 23 1687132800000
  // week 22 1686528000000

  // 1685923200000
  // 1686528000000
  // 1687132800000

  return (
    <ErrorBoundary>
      <div className="checkin-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <div className="sticky-top">
            <ErrorBoundary>
              <Toolbar
                leftControls={
                  <div className="settings-filters">
                    <ul className="kit-tabs" data-uk-tab>
                      {me &&
                        checkInWeek.map((week, index) => (
                          <WeekTabItem
                            key={index}
                            label={week.asJson.id}
                            name={week.asJson.weekNumber}
                            activeTab={activeTab}
                            onClickTab={onClickTab}
                            onEdit={onEdit}
                            onDeleteWeek={onDeleteWeek}
                            week={week.asJson}
                            me={me}
                          />
                        ))}
                    </ul>
                  </div>
                }
                rightControls={
                  <div className="uk-inline">
                    <button
                      className="btn btn-primary"
                      onClick={handleNewWeek}
                      disabled={isWeekDone}
                    >
                      <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                      New Week
                    </button>
                  </div>
                }
              />
            </ErrorBoundary>
          </div>
          {!loading && (
            <div>
              <div className="t-main">
                {selectedWeek && (
                  <div
                    className="week-item uk-margin uk-child-width-1-2@s uk-grid-match uk-grid-small"
                    data-uk-grid
                  >
                    <div>
                      <div className="week-card">
                        <h3 className="uk-text-small">Company Value</h3>
                        <p className="uk-text-small">
                          {selectedWeek.asJson.companyValue}{" "}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="week-card">
                        <h3 className="uk-text-small">Milestones</h3>
                        <div data-uk-grid>
                          <div className="uk-width-expand@m">
                            <div className="uk-card">
                              {me &&
                                selectedWeek.asJson.weeklyMilestones.map(
                                  (milestone, index) => (
                                    <div className="uk-flex" key={index}>
                                      <div>
                                        <p
                                          className="achievement uk-text-small"
                                          key={milestone.milestoneId}
                                        >
                                          {index + 1}. {milestone.milestoneName}
                                        </p>
                                      </div>
                                      <div className="uk-margin-left">
                                        <input
                                          data-uk-tooltip="Is this milestone completed?"
                                          className="uk-checkbox"
                                          type="checkbox"
                                          name="completed"
                                          checked={milestone.completed}
                                          onChange={() =>
                                            handleCheckboxChange(index)
                                          }
                                          disabled={
                                            selectedWeek.asJson.uid !== me.uid
                                          }
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                          <div className="uk-width-auto@m">
                            <div className="uk-card">
                              <div className="progress-bar">
                                <CircularProgressbar
                                  value={milestones.percentage}
                                  maxValue={100}
                                  text={`${milestones.percentage}%`}
                                  styles={{
                                    path: {
                                      stroke: getProgressColors(
                                        milestones.percentage
                                      ),
                                    },
                                    text: {
                                      fill: getProgressColors(
                                        milestones.percentage
                                      ),
                                      fontSize: "1.5rem",
                                    },
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="headings">
                  <button
                    type="button"
                    className="btn btn-primary uk-margin"
                    onClick={handleNewWeekTask}
                    disabled={isWeekIdAndOwned}
                  >
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span> New
                    Task
                  </button>
                  <div className="check-in-analytics">
                    <div className="check-in-analytics-item">
                      <div className="progress-bar">
                        <CircularProgressbar
                          value={getCompletedTaskScore(done, tasks)}
                          maxValue={100}
                          text={`${getCompletedTaskScore(done, tasks)}%`}
                          styles={{
                            text: {
                              fontSize: "1.5rem",
                              fill: getProgressColors(
                                getCompletedTaskScore(done, tasks)
                              ),
                            },
                            path: {
                              stroke: getProgressColors(
                                getCompletedTaskScore(done, tasks)
                              ),
                            },
                          }}
                        />
                      </div>
                      <div className="stat-details">
                        <span>Overall Progress</span>
                      </div>
                    </div>
                    <div className="check-in-analytics-item">
                      <div className="progress-bar">
                        <CircularProgressbar
                          value={getCompletedTaskScore(done, tasks)}
                          maxValue={100}
                          text={`${done.length}/${tasks.length}`}
                          styles={{
                            path: {
                              stroke: getProgressColors(
                                getCompletedTaskScore(done, tasks)
                              ),
                            },
                            text: {
                              fill: getProgressColors(
                                getCompletedTaskScore(done, tasks)
                              ),
                              fontSize: "1.5rem",
                            },
                          }}
                        />
                      </div>
                      <div className="stat-details">Completed Tasks</div>
                    </div>
                    <div className="check-in-analytics-item">
                      <div className="progress-bar">
                        <CircularProgressbar
                          value={getCompletedTaskScore(
                            completedElephants,
                            elephants
                          )}
                          maxValue={100}
                          text={`${completedElephants.length}/${elephants.length}`}
                          styles={{
                            path: {
                              stroke: getProgressColors(
                                getCompletedTaskScore(
                                  completedElephants,
                                  elephants
                                )
                              ),
                            },
                            text: {
                              fill: getProgressColors(
                                getCompletedTaskScore(
                                  completedElephants,
                                  elephants
                                )
                              ),
                              fontSize: "1.5rem",
                            },
                          }}
                        />
                      </div>
                      <div className="stat-details">Elephants</div>
                    </div>
                    <div className="check-in-analytics-item">
                      <div className="progress-bar">
                        <div className="progress-bar">
                          <CircularProgressbar
                            value={utilization.percentage}
                            maxValue={100}
                            text={`${utilization.completedTaskHours}/${utilization.totalHours}`}
                            styles={{
                              path: {
                                stroke: getProgressColors(
                                  utilization.percentage
                                ),
                              },
                              text: {
                                fill: getProgressColors(utilization.percentage),
                                fontSize: "1.5rem",
                              },
                            }}
                          />
                        </div>
                      </div>
                      <div className="stat-details">
                        Utilization ({"Hours"})
                      </div>
                    </div>
                  </div>

                  <div className="t-view">
                    {!loadingTasks && (
                      <div className="catergory">
                        <div
                          className="tasks"
                          onDrop={(e) => handleDrop(e, "todo")}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <h5 className="h5">To Do</h5>
                          <div className="content">
                            <TaskGridItem
                              tasks={todo}
                              color={"red"}
                              onSelectedTask={onSelectedTask}
                              onDeleteTask={onDeleteTask}
                              selectedWeek={selectedWeek}
                              currentWeek={currentWeek}
                            />
                          </div>
                        </div>
                        <div
                          className="tasks"
                          onDrop={(e) => handleDrop(e, "in-review")}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <h5 className="h5">In Review</h5>
                          <div className="content">
                            <TaskGridItem
                              tasks={review}
                              color={"yellow"}
                              onSelectedTask={onSelectedTask}
                              onDeleteTask={onDeleteTask}
                              selectedWeek={selectedWeek}
                              currentWeek={currentWeek}
                            />
                          </div>
                        </div>
                        <div
                          className="tasks"
                          onDrop={(e) => handleDrop(e, "done")}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <h5 className="h5">Done</h5>
                          <div className="content">
                            <TaskGridItem
                              tasks={done}
                              color={"green"}
                              onSelectedTask={onSelectedTask}
                              onDeleteTask={onDeleteTask}
                              selectedWeek={selectedWeek}
                              currentWeek={currentWeek}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {loadingTasks && <LoadingEllipsis />}
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading && <LoadingEllipsis />}
        </div>
      </div>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.CHECKIN.CHECK_IN_WEEK}>
          <CheckInWeekModal />
        </Modal>
        {month && selectedWeek && (
          <Modal modalId={MODAL_NAMES.CHECKIN.CHECK_IN_WEEK_TASK}>
            <CheckInWeekTaskModal
              month={month.asJson}
              selectedWeek={selectedWeek.asJson}
            />
          </Modal>
        )}
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CheckInMonthUserView;
