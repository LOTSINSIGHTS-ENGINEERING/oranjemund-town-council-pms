import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultMeasureDepartment, IMeasureDepartment } from "../../../shared/models/MeasureDepartment";
import { measureRating } from "../../shared/functions/Scorecard";
import MODAL_NAMES from "../ModalName";
import MeasureDepartmentUpdateQ1ActualForm from "./MeasureDepartmentUpdateQ1ActualForm";

const MeasureDepartmentUpdateQ1ActualModal = observer(() => {
  const { api, store } = useAppContext();

  const [measure, setMeasure] = useState<IMeasureDepartment>({
    ...defaultMeasureDepartment,
  });
  const [loading, setLoading] = useState(false);
  const [isLocked, setisLocked] = useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // get uid from auth
    const me = store.auth.meJson; // my user account
    if (!me) return; //TODO: alert invalid uid.

    setLoading(true); // start loading

    const rating = measureRating(measure);

    // update measure uid & displayName
    const $measure: IMeasureDepartment = {
      ...measure,
      uid: me.uid,
      userName: me.displayName || `${me.firstName} ${me.lastName}`,
      q1AutoRating: rating,
      q2AutoRating: rating,
      q3AutoRating: rating,
      q4AutoRating: rating,
      // Reset supervisor ratings
      q1Rating: null,
      q2Rating: null,
      q3Rating: null,
      q4Rating: null,
      isUpdated: measure.annualActual == null ? false : true,
    };

    // if selected measure, update
    const selected = store.departmentMeasure.selected;
    if (selected) await update($measure);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (measure: IMeasureDepartment) => {
    try {
      if (isLocked)
        await api.departmentMeasure.update(measure, [
          "quarter1Actual",
          "quarter2Actual",
          "quarter3Actual",
          "quarter4Actual",
          "q1AutoRating",
          "q2AutoRating",
          "q3AutoRating",
          "q4AutoRating",
          "isUpdated",
        ]);
      else await api.departmentMeasure.update(measure);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const onCancel = () => {
    // clear selected measure & selected objective
    store.departmentMeasure.clearSelected();
    // reset form
    setMeasure({ ...defaultMeasureDepartment });
    // hide modal
    hideModalFromId(
      MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_UPDATE_Q1_ACTUAL_MODAL
    );
  };

  useEffect(() => {
    // no selected measure, and no selected objective
    if (!store.departmentMeasure.selected) {
      hideModalFromId(
        MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_UPDATE_Q1_ACTUAL_MODAL
      );
      return;
    }

    // if selected measure, set form values
    if (store.departmentMeasure.selected)
      setMeasure({ ...store.departmentMeasure.selected });
  }, [store.departmentMeasure.selected]);

  useEffect(() => {
    const scorecard = store.scorecard.active; // active/current scorecard
    if (scorecard) setisLocked(scorecard.locked);
  }, [store.scorecard.active]);

  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">KPI: {measure.description}</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <MeasureDepartmentUpdateQ1ActualForm
            measure={measure}
            setMeasure={setMeasure}
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

export default MeasureDepartmentUpdateQ1ActualModal;
