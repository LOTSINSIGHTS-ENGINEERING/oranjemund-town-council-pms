import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";
import MeasureUpdateMidtermActualForm from "./MeasureUpdateMidtermActualForm";
import { IMeasure, defaultMeasure } from "../../../shared/models/Measure";
import { measureRating } from "../../shared/functions/Scorecard";

const MeasureUpdateMidtermActualModal = observer(() => {
  const { api, store } = useAppContext();

  const [measure, setMeasure] = useState<IMeasure>({
    ...defaultMeasure,
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
    const $measure: IMeasure = {
      ...measure,
      uid: me.uid,
      userName: me.displayName || `${me.firstName} ${me.lastName}`,
      midtermAutoRating: rating,
      autoRating: rating,
      midtermRating: null, // Reset supervisor's midterm rating.
      finalRating: null, // Reset supervisor's final rating.
      isUpdated: measure.annualActual == null ? false : true,
    };

    // if selected measure, update
    const selected = store.measure.selected;
    if (selected) await update($measure);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (measure: IMeasure) => {
    try {
      if (isLocked) {
        await api.measure.update(measure, [
          "annualActual",
          "midtermActual",
          "finalRating",
          "midtermRating",
          "autoRating",
          "midtermAutoRating",
          "isUpdated",
        ]);
      } else {
        await api.measure.update(measure);
      }
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const onCancel = () => {
    // clear selected measure & selected objective
    store.measure.clearSelected();
    // reset form
    setMeasure({ ...defaultMeasure });
    // hide modal
    hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_MIDTERM_ACTUAL_MODAL);
  };

  useEffect(() => {
    // no selected measure, and no selected objective
    if (!store.measure.selected) {
      hideModalFromId(
        MODAL_NAMES.EXECUTION.MEASURE_UPDATE_MIDTERM_ACTUAL_MODAL
      );
      return;
    }

    // if selected measure, set form values
    if (store.measure.selected) setMeasure({ ...store.measure.selected });
  }, [store.measure.selected]);

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
          <MeasureUpdateMidtermActualForm
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

export default MeasureUpdateMidtermActualModal;
