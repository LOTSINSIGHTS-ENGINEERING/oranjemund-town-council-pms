import { observer } from "mobx-react-lite";
import{ FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultObjective, IObjective } from "../../../shared/models/Objective";
import MODAL_NAMES from "../ModalName";
import ObjectiveDepartmentForm from "./ObjectiveDepartmentForm";

const ObjectiveDepartmentModal = observer(() => {
  const { api, store } = useAppContext();
  const [objective, setObjective] = useState(defaultObjective);
  const [loading, setLoading] = useState(false);
  const { departmentId } = useParams();
  const me = store.auth.meJson; //my user account

  const companyObjectives = useMemo(() => {
    if (!me) return []; //TODO: alert invalid uid.
    const objectives = store.companyObjective.all;
    return objective.perspective
      ? objectives.filter((o) => o.asJson.perspective === objective.perspective)
      : objectives;
  }, [me, objective.perspective, store.companyObjective.all]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!me || !departmentId) return; //TODO: alert invalid user or departmentId.

    setLoading(true); // start loading

    // update objective uid && userName
    const $objective = {
      ...objective,
      uid: me.uid,
      userName: me.displayName || "",
      department: departmentId,
    };

    // if selected objective, update
    const selected = store.departmentObjective.selected;

    if (selected) await update($objective);
    else await create($objective);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (objective: IObjective) => {
    try {
      await api.departmentObjective.update(objective);
    } catch (error) {
      console.log("Failed to update: ", error);
    }
  };

  const create = async (objective: IObjective) => {
    try {
      await api.departmentObjective.create(objective);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const onCancel = () => {
    // clear  selected objective
    store.departmentObjective.clearSelected();
    // reset form
    setObjective({ ...defaultObjective });
    hideModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_OBJECTIVE_MODAL);
  };

  useEffect(() => {
    // if selected objective, set form values
    if (store.departmentObjective.selected)
      setObjective({
        ...store.departmentObjective.selected,
      });

    // no selected objective
    if (!store.departmentObjective.selected)
      setObjective({ ...defaultObjective });
  }, [store.departmentObjective.selected]);

  return (
    <div className="objective-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Objective</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <ObjectiveDepartmentForm
            companyObjectives={companyObjectives}
            objective={objective}
            setObjective={setObjective}
          />

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

export default ObjectiveDepartmentModal;
