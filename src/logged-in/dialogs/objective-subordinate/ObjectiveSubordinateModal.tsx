import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import MODAL_NAMES from "../ModalName";
import { IObjectiveSubordinate, defaultObjectiveSubordinate } from "../../../shared/models/ObjectiveSurbordinate";
import ObjectiveSubordinateForm from "./ObjectiveSubordinateForm";

const ObjectiveModal = observer(() => {
  const { api, store } = useAppContext();
  const [objective, setObjective] = useState(defaultObjectiveSubordinate);
  const [loading, setLoading] = useState(false);

  const me = store.auth.meJson; //my user account
  const scorecard = store.scorecard.activeId; //active scorecard id

  const departmentObjectives = useMemo(() => {
    if (!me) return []; //TODO: alert invalid uid.
    const department = me.department;
    const objectives = store.departmentObjective.all.filter((d) => d.asJson.department === department).map((o) => o.asJson);
    return objective.perspective ? objectives.filter((o) => o.perspective === objective.perspective) : objectives;
  }, [me, objective.perspective, store.departmentObjective.all]);

  const companyObjectives = useMemo(() => {
    if (!me) return []; //TODO: alert invalid uid.
    const objectives = store.companyObjective.all.map((o) => o.asJson);
    return objective.perspective ? objectives.filter((o) => o.perspective === objective.perspective) : objectives;
  }, [me, objective.perspective, store.companyObjective.all]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!me) return; //TODO: alert invalid uid.

    setLoading(true); // start loading

    // update objective uid && userName
    const $objective: IObjectiveSubordinate = {
      ...objective,
      uid: me.uid,
      userName: me.displayName || "",
    };

    if (store.objective.selected) await update($objective);
    else await create($objective);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (objective: IObjectiveSubordinate) => {
    try {
      await api.objective.update(objective);
    } catch (error) {
      console.log(error);
    }
  };

  const create = async (objective: IObjectiveSubordinate) => {
    try {
      await api.objective.create(objective);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    // store.objective.clearSelected(); // clear  selected objective
    setObjective({ ...defaultObjectiveSubordinate }); // reset form
    hideModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL);
  };

  useEffect(() => {
    // load department objectives from db
    const loadAll = async () => {
      if (!me) return; //TODO: alert invalid uid.

      const departmentId = me.department;
      if (!scorecard || !departmentId) return;

      setLoading(true); // start loading
      try {
        await api.departmentMeasure.getAll(scorecard);
        await api.departmentObjective.getAll(scorecard, departmentId);
        await api.companyObjective.getAll(scorecard);
      } catch (error) {
        console.log(error);
      }
      setLoading(false); // stop loading
    };

    loadAll();
  }, [
    api.companyObjective,
    api.departmentMeasure,
    api.departmentObjective,
    me,
    scorecard,
  ]);

  useEffect(() => {
    const updateFormOnMount = () => {
      // if selected objective, set form values
      if (store.subordinateObjective.selected)
        setObjective({
          ...store.subordinateObjective.selected,
        });

      // no selected objective
      if (!store.objective.selected) {
        const pespective = store.objective.perspective;

        switch (pespective) {
          case FINANCIAL_TAB.id:
            setObjective({
              ...defaultObjectiveSubordinate,
              perspective: FINANCIAL_TAB.id,
            });
            break;
          case CUSTOMER_TAB.id:
            setObjective({ ...defaultObjectiveSubordinate, perspective: CUSTOMER_TAB.id });
            break;
          case PROCESS_TAB.id:
            setObjective({ ...defaultObjectiveSubordinate, perspective: PROCESS_TAB.id });
            break;
          case GROWTH_TAB.id:
            setObjective({ ...defaultObjectiveSubordinate, perspective: GROWTH_TAB.id });
            break;
          default:
            setObjective({
              ...defaultObjectiveSubordinate,
              perspective: FINANCIAL_TAB.id,
            });
            break;
        }
      }
    };

    updateFormOnMount();
  }, [store.objective.perspective, store.objective.selected, store.subordinateObjective.selected]);

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
          {/* <ObjectiveSubordinateForm
            // departmentalObjectives={departmentObjectives}
            // companyObjectives={companyObjectives}
            objective={objective}
            setObjective={setObjective}
          /> */}

          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
              disabled={loading}
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

export default ObjectiveModal;
