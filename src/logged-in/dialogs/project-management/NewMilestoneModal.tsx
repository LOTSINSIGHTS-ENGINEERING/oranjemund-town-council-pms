import { observer } from "mobx-react-lite";
import { FormEvent, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultTask, IProjectTask } from "../../../shared/models/ProjectTasks";
import NumberInput from "../../shared/components/number-input/NumberInput";
import MODAL_NAMES from "../ModalName";

interface Iprops {
  projectId: string;
  currency: string | undefined;
}
const NewMilestoneModal = observer((props: Iprops) => {
  const { api, store } = useAppContext();
  const { projectId, currency } = props;

  const me = store.auth.meJson;
  const tasksOptions = store.projectTask.all.map((t) => t.asJson).filter((t) => t.type === "milestone").map((task) => ({ value: task.id, label: task.taskName }));

  const [task, setTask] = useState<IProjectTask>({ ...defaultTask });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!me) return;

    setLoading(true); // start loading
    const $task: IProjectTask = {
      ...task,
      projectId: projectId,
      type: "milestone",
      usersId: [me.uid]
    };
    await create($task);
    setLoading(false); // stop loading
    onCancel();
  };

  const create = async (task: IProjectTask) => {
    try {
      await api.projectManagement.createTask(projectId, task);
    } catch (error) { }
  };

  const animatedComponents = makeAnimated();

  const onCancel = () => {
    setTask(defaultTask)
    hideModalFromId(MODAL_NAMES.PROJECTS.CREATE_MILESTONE);
  };

  return (
    <div
      className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      data-uk-overflow-auto
    >
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Milestone</h3>
      <div className="dialog-content uk-position-relative">
        <form onSubmit={handleSubmit}>
          <fieldset className="uk-fieldset">
            <div className="uk-margin">
              <input
                className="uk-input"
                required
                type="text"
                placeholder="Milestone Name"
                onChange={(e) => setTask({ ...task, taskName: e.target.value })}
              />
            </div>
            <div className="uk-flex uk-margin uk-flex-between">
              <div className="uk-margin">
                <label className="uk-form-label">
                  Budgeted Amount ({currency})
                </label>
                <NumberInput
                  placeholder={`Budgeted Amount (${currency})`}
                  value={task.budgetedAmount}
                  onChange={(value) =>
                    setTask({ ...task, budgetedAmount: Number(value) })
                  }
                />
              </div>
              <div>
                <label className="uk-form-label">
                  Actual Amount ({currency})
                </label>
                <NumberInput
                  placeholder={`Actual Amount (${currency})`}
                  value={task.actualAmount}
                  onChange={(value) =>
                    setTask({ ...task, actualAmount: Number(value) })
                  }
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="progress">
                Dependencies (Milestones)
              </label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                onChange={(value: any) =>
                  setTask({
                    ...task,
                    dependencies: value.map((t: any) => t.value),
                  })
                }
                isMulti
                options={tasksOptions}
              />
            </div>

            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="start">
                Start Date
              </label>
              <input
                id="start"
                required
                className="uk-input"
                type="date"
                placeholder="Start Date"
                onChange={(e) =>
                  setTask({ ...task, startDate: e.target.value })
                }
              />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="end">
                End Date
              </label>
              <input
                id="end"
                required
                className="uk-input"
                type="date"
                placeholder="End Date"
                onChange={(e) => setTask({ ...task, endDate: e.target.value })}
              />
            </div>
            <div className="uk-margin">
              <textarea
                className="uk-textarea"
                rows={2}
                placeholder="Description"
                required
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
              ></textarea>
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

export default NewMilestoneModal;
