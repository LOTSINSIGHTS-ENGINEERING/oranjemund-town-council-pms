import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ICheckInMonth } from "../../../shared/models/check-in-model/CheckInMonth";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";
import { ICheckInWeekTask, IWeeklyTaskStatus, defaultWeekTask, IWeeklyTaskType } from "../../../shared/models/check-in-model/CheckInWeekTask";
import { ICheckInWeek } from "../../../shared/models/check-in-model/CheckInWeek";
import SingleSelect, { IOption } from "../../../shared/components/single-select/SingleSelect";

interface IProps {
  month: ICheckInMonth
  selectedWeek: ICheckInWeek
}

const CheckInWeekTaskModal = observer((props: IProps) => {

  const { month, selectedWeek } = props;

  const { api, store } = useAppContext();
  const me = store.auth.meJson;
  const scorecard = store.scorecard.activeId;

  const [task, setTask] = useState<ICheckInWeekTask>({ ...defaultWeekTask });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!me) { return };

    setLoading(true);
    const project = store.projectManagement.getById(task.projectId);
    const projectName = project ? project.asJson.projectName : "";

    const selected = store.checkIn.checkInWeekTask.selected;

    const $task: ICheckInWeekTask = {
      ...task,
      monthId: selectedWeek.monthId,
      weekId: selectedWeek.id,
      uid: me.uid,
      projectName: projectName,
    }

    if (selected) await update($task);
    else await create($task);

    setLoading(false);
    onCancel();
  };

  const update = async (task: ICheckInWeekTask) => {
    try {
      await api.checkIn.checkInWeekTask.update(month.yearId, month.id, task);
    } catch (error) {
      console.log(error);
    }
  };

  const create = async (task: ICheckInWeekTask) => {
    try {
      await api.checkIn.checkInWeekTask.create(month.yearId, month.id, selectedWeek.id, task);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    store.checkIn.checkInWeekTask.clearSelected();
    setTask({ ...defaultWeekTask });
    hideModalFromId(MODAL_NAMES.CHECKIN.CHECK_IN_WEEK_TASK);
  };

  useEffect(() => {
    if (store.checkIn.checkInWeekTask.selected) {
      setTask({ ...store.checkIn.checkInWeekTask.selected });
    }
    else setTask({ ...defaultWeekTask });
  }, [store.checkIn.checkInWeekTask.selected]);


  const departmentObjectiveOptions = useMemo(() => {
    const departments = store.department.all;
    const objectives = store.departmentObjective.all;

    const grouped = departments.map((department) => {
      return {
        id: department.asJson.id,
        department: department.asJson.name,
        departmentObjectives: objectives.filter((objective) => objective.asJson.department === department.asJson.id),
      };
    });
    return grouped
  }, [store.department.all, store.departmentObjective.all]);


  const categorisedOptions = () => {
    const options = departmentObjectiveOptions.map((group) => {
      const disabledOption: IOption = {
        label: group.department.toUpperCase(),
        value: group.id,
        color: "#0052CC",
        isDisabled: true,
      };
      const otherOptions: IOption[] = group.departmentObjectives.map((o) => ({
        label: o.asJson.description,
        value: o.asJson.id,
      }));

      const options = [disabledOption, ...otherOptions];
      return options;
    });

    const _: IOption[] = [];
    return _.concat(...options);
  };


  const departmentProjectOptions = useMemo(() => {
    const departments = store.department.all;
    const projects = store.projectManagement.all;

    const grouped = departments.map((department) => {
      return {
        id: department.asJson.id,
        department: department.asJson.name,
        departmentProjects: projects.filter((project) => project.asJson.department === department.asJson.id),
      };
    });
    return grouped
  }, [store.department.all, store.projectManagement.all]);


  const categorisedProjectOptions = () => {
    const options = departmentProjectOptions.map((group) => {
      const disabledOption: IOption = {
        label: group.department.toUpperCase(),
        value: group.id,
        color: "#0052CC",
        isDisabled: true,
      };
      const otherOptions: IOption[] = group.departmentProjects.map((o) => ({
        label: o.asJson.projectName,
        value: o.asJson.id,
      }));

      const options = [disabledOption, ...otherOptions];
      return options;
    });

    const _: IOption[] = [];
    return _.concat(...options);
  };

  useEffect(() => {
    const loadAll = async () => {
      if (!me) return;
      const departmentId = me.department;
      if (!scorecard || !departmentId) return;
      setLoading(true)
      try {
        if (store.departmentObjective.all.length < 5) {
          await api.departmentObjective.getAll(scorecard);
        }

        if (store.companyObjective.all.length < 5) {
          await api.companyObjective.getAll(scorecard);
        }
        if (store.projectManagement.all.length < 5) {
          await api.projectManagement.getAllProjects();
        }
        if (store.department.all.length < 2) {
          await api.department.getAll();
        }

      } catch (error) { }
      setLoading(false);
    };
    loadAll();

  }, [api.companyObjective, api.departmentObjective, store.department, api.projectManagement, me, scorecard,]);

  return (
    <div className="week-task-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      style={{ width: "800px" }}>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={onCancel}
      ></button>
      <h3 className="uk-modal-title">{store.checkIn.checkInWeekTask.selected ? task.taskName : "Weekly Check In Task"}</h3>
      <div className="dialog-content uk-position-relative">
        <form className="uk-form-stacked" onSubmit={handleSubmit} >
          <div>
            <div className="uk-width-1-1">
              <div className="uk-margin">
                <label className="uk-form-label label">Task Name</label>
                <input
                  className="uk-input uk-form-small"
                  type="text"
                  value={task.taskName}
                  name={"taskName"}
                  onChange={(e) => setTask({ ...task, taskName: e.target.value })}
                />
              </div>
            </div>
            <div className="uk-width-1-1">
              <div className="uk-margin">
                <label className="uk-form-label label">Task Description</label>
                <textarea
                  className="uk-textarea uk-form-small"
                  rows={5}
                  value={task.taskDescription}
                  name={"taskDescription"}
                  onChange={(e) => setTask({ ...task, taskDescription: e.target.value })}
                />
              </div>
            </div>
            <div className="uk-child-width-expand@s" data-uk-grid>
              <div className="uk-margin">
                <label className="uk-form-label label">Task Type</label>
                <select
                  className="uk-select uk-form-small"
                  value={task.taskType}
                  name={"taskType"}
                  onChange={(e) => setTask({ ...task, taskType: e.target.value as IWeeklyTaskType })}
                >
                  <option value={"rabbit"}>Rabbit</option>
                  <option value={"horse"}>Horse</option>
                  <option value={"elephant"}>Elephant</option>
                </select>
              </div>
              <div>
                <label className="uk-form-label label">Allocated Time (Hours)</label>
                <input
                  className="uk-input uk-form-small"
                  type="number"
                  value={task.allocatedTime}
                  name={"allocatedTime"}
                  onChange={(e) => setTask({ ...task, allocatedTime: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="uk-width-1-1">
              <div className="uk-margin">
                <label className="uk-form-label label">Task Status</label>
                <select
                  className="uk-select uk-form-small"
                  value={task.taskStatus}
                  name={"taskStatus"}
                  onChange={(e) => setTask({ ...task, taskStatus: e.target.value as IWeeklyTaskStatus })}
                >
                  <option value={"todo"}>Todo</option>
                  <option value={"done"}>Done</option>
                </select>
              </div>
            </div>
            <div className="uk-width-1-1">
              <div className="uk-margin">
                <label className="uk-form-label label">Task Milestone</label>
                <select
                  className="uk-select uk-form-small"
                  value={task.milestoneId}
                  name={"milestoneId"}
                  onChange={(e) => setTask({ ...task, milestoneId: e.target.value })}
                >
                  <option value={""} disabled>Select</option>
                  {selectedWeek.weeklyMilestones.map((mile, index) => (
                    <option key={index} value={mile.milestoneId}>{mile.milestoneName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="uk-width-1-1">
              <div className="uk-margin">
                <label className="uk-form-label label">Company Objective</label>
                <select
                  className="uk-select uk-form-small"
                  value={task.companyObjective}
                  name={"companyObjective"}
                  onChange={(e) => setTask({ ...task, companyObjective: e.target.value })}
                >
                  <option value={""} disabled>Select</option>
                  {store.companyObjective.all.map((obj, i) => (
                    <option key={i} value={obj.asJson.description}>{obj.asJson.description}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="uk-width-1-1">
              <div className="uk-margin">
                <label className="uk-form-label label">Departmental Objective</label>
                <SingleSelect
                  options={categorisedOptions()}
                  value={task.departmentObjective}
                  onChange={(value) => setTask({ ...task, departmentObjective: value })}
                  // required
                />
              </div>
            </div>
            <div className="uk-width-1-1">
              <div className="uk-margin">
                <label className="uk-form-label label">Project Name</label>
                <SingleSelect
                  options={categorisedProjectOptions()}
                  value={task.projectId}
                  onChange={(value) => setTask({ ...task, projectId: value })}
                  // required
                />
              </div>
            </div>
            <div className="uk-width-1-1">
              <div className="uk-margin">
                <label className="uk-form-label label">Task Achievement</label>
                <textarea
                  className="uk-textarea uk-form-small"
                  rows={5}
                  value={task.taskAchievement}
                  name={"taskAchievement"}
                  onChange={(e) => setTask({ ...task, taskAchievement: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CheckInWeekTaskModal;