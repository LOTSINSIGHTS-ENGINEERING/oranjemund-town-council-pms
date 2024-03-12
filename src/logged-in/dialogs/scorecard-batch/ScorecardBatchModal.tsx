import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultBatch, IScorecardBatch } from "../../../shared/models/ScorecardBatch";
import MODAL_NAMES from "../ModalName";
import ScorecardBatchForm from "./ScorecardBatchForm";

const ScorecardBatchModal = observer(() => {
  const { api, store } = useAppContext();

  const [batch, setBatch] = useState<IScorecardBatch>({ ...defaultBatch });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // start loading

    const depart = batch;
    // if selected scorecardBatch, update
    const selected = store.scorecard.selected;

    if (selected) await update(depart);
    else await create(depart);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (batch: IScorecardBatch) => {
    try {
      await api.scorecard.update(batch);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const create = async (batch: IScorecardBatch) => {
    try {
      await api.scorecard.create(batch);
    } catch (error) {
      console.log("Failed to create> Error: ", error);
    }
  };

  const onCancel = () => {
    // clear selected scorecardBatch
    store.scorecard.clearSelected();
    // reset form
    setBatch({ ...defaultBatch });
    hideModalFromId(MODAL_NAMES.ADMIN.SCORECARD_BATCH_MODAL);
  };

  // if selected scorecardBatch, set form values
  useEffect(() => {
    if (store.scorecard.selected) {
      setBatch({ ...defaultBatch, ...store.scorecard.selected });
    }
  }, [store.scorecard.selected]);

  return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Scorecard</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <ScorecardBatchForm batch={batch} setBatch={setBatch} />

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

export default ScorecardBatchModal;
