import { observer } from "mobx-react-lite";
import { FC, FormEvent, useMemo, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { IOption } from "../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../shared/functions/Context";

import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultTask, IProjectTask, IProjectTaskStatus } from "../../../shared/models/ProjectTasks";

import MODAL_NAMES from "../ModalName";
import { getUsersEmail } from "../../project-management/utils/common";
import { MAIL_EMAIL } from "../../../shared/functions/mailMessages";

interface IProps {
  projectId: string;
}
const NewTaskModal: FC<IProps> = observer(({ projectId }) => {

  const animatedComponents = makeAnimated();
  const { api, store } = useAppContext();
  const me = store.auth.meJson;

  const milestoneId = store.projectTask.selectedMID;
  const tasksOptions = store.projectTask.all.map(t => t.asJson).filter(t => t.milestoneId === milestoneId).map(task => ({ value: task.id, label: task.taskName }));

  const options: IOption[] = useMemo(() =>
    store.user.all.map((user) => {
      return {
        label: user.asJson.displayName || "",
        value: user.asJson.uid
      };
    }).filter(user => user.value !== me?.uid),
    [store.user]
  );

  const [task, setTask] = useState<IProjectTask>(defaultTask);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me) return;
    const _task: IProjectTask = {
      ...task,
      usersId: [me.uid, ...task.usersId],
      milestoneId: milestoneId,
      projectId: projectId,
    }
    await create(_task);
    setLoading(false);
    onCancel();
  };

  const create = async (task: IProjectTask) => {

    try {
      const projctName = store.projectManagement.getById(projectId)?.asJson.projectName;
      const { MY_SUBJECT, MY_BODY } = MAIL_PROJECT_TASK_ADDED(me?.displayName, task.taskName, "task", projctName);

      await api.projectManagement.createTask(projectId, task);

      const emails = getUsersEmail(task.usersId.filter(id => id !== me?.uid), store);
      await api.mail.sendMail(
        emails,
        MAIL_EMAIL,
        [me?.email!],
        MY_SUBJECT,
        MY_BODY
      );
    } catch (error) { }
  };

  const onCancel = () => {
    setTask(defaultTask)
    hideModalFromId(MODAL_NAMES.PROJECTS.CREATE_TASK);
  };

  return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical" data-uk-overflow-auto>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Task</h3>
      <div className="dialog-content uk-position-relative">
        <form onSubmit={handleSubmit}>
          <fieldset className="uk-fieldset">
            <div className="uk-margin">
              <input className="uk-input" required type="text" placeholder="Task name"
                onChange={(e) => setTask({ ...task, taskName: e.target.value })} />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="status">Status</label>
              <select id="status" className="uk-select" name="status"
                onChange={(e) => setTask({ ...task, status: e.target.value as IProjectTaskStatus })}>
                <option value={"todo"}>To Do</option>
                <option value={"in-progress"}>In Progress</option>
                <option value={"in-review"}>In Review</option>
                <option value={"done"}>Done</option>
              </select>
            </div>
            <div className="uk-margin uk-margin-right uk-width-1-1">
              <label className="uk-form-label" htmlFor="portfolio">Assign task to:</label>
              <select className="uk-select uk-form-small"
                aria-label="Select"
                onChange={(value: any) => setTask({ ...task, usersId: value.map((t: any) => t.value) })}
              >
                <option value={""}>None</option>
                {options.map((option, index) => (
                  <option key={index} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="progress">Dependencies (Tasks)</label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                onChange={(value: any) => setTask({ ...task, dependencies: value.map((t: any) => t.value) })}
                isMulti
                options={tasksOptions}
              />
            </div>

            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="start">Start Date</label>
              <input id="start"
                required
                className="uk-input"
                type="date"
                placeholder="Start Date"
                onChange={(e) => setTask({ ...task, startDate: e.target.value })} />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="end">End Date</label>
              <input id="end"
                required
                className="uk-input"
                type="date"
                placeholder="End Date"
                onChange={(e) => setTask({ ...task, endDate: e.target.value })} />
            </div>

            <div className="uk-margin">
              <textarea
                className="uk-textarea"
                rows={2}
                required
                placeholder="Description"
                onChange={(e) => setTask({ ...task, description: e.target.value })}>

              </textarea>
            </div>
          </fieldset>
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

export default NewTaskModal;
function MAIL_PROJECT_TASK_ADDED(displayName: string | null | undefined, taskName: string, arg2: string, projctName: string | undefined): { MY_SUBJECT: any; MY_BODY: any; } {
  throw new Error("Function not implemented.");
}

