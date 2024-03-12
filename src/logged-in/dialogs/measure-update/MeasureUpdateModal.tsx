import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultMeasure, IMeasure } from "../../../shared/models/Measure";
import MODAL_NAMES from "../ModalName";
import MeasureUpdateForm from "./MeasureUpdateForm";

const MeasureUpdateModal = observer(() => {
  const { api, store } = useAppContext();

  const [measure, setMeasure] = useState<IMeasure>({ ...defaultMeasure });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // start loading

    // get uid from auth
    const me = store.auth.meJson; // my user account
    if (!me) return; //TODO: alert invalid uid.

    const $measure = measure;

    // update measure uid & displayName
    $measure.uid = me.uid;
    $measure.userName = me.displayName || "";

    // if selected measure, update
    const selected = store.measure.selected;

    if (selected) await update($measure);
    else await create($measure);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (measure: IMeasure) => {
    try {
      await api.measure.update(measure);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const create = async (measure: IMeasure) => {
    try {
      await api.measure.create(measure);
    } catch (error) {
      console.log("Failed to create> Error: ", error);
    }
  };

  const onCancel = () => {
    // clear selected measure & selected objective
    store.measure.clearSelected();
    store.objective.clearSelected();
    // reset form
    setMeasure({ ...defaultMeasure });
    // hide modal
    hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_MODAL);
  };

  useEffect(() => {
    // no selected measure, and no selected objective
    if (!store.measure.selected && !store.objective.selected)
      setMeasure({ ...defaultMeasure });

    // if selected measure, set form values
    if (store.measure.selected) setMeasure({ ...store.measure.selected });

    // if selected objective, set form values
    if (store.objective.selected && !store.measure.selected)
      setMeasure({
        ...defaultMeasure,
        objective: store.objective.selected.id,
      });
  }, [store.measure.selected, store.objective, store.objective.selected]);

  return (
    <div className="measure-update-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Update KPI / Measure</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <MeasureUpdateForm measure={measure} setMeasure={setMeasure} />

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

export default MeasureUpdateModal;
