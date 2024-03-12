import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { IScorecardBatch } from "../../shared/models/ScorecardBatch";
import MODAL_NAMES from "../dialogs/ModalName";

interface IProps {
  scorecardBatch: IScorecardBatch;
}
const ScorecardItem = (props: IProps) => {
  const { scorecardBatch } = props;
  const { api, store } = useAppContext();

  const activeCss = scorecardBatch.active ? "active" : "";

  const handleLock = async () => {
    const batch = scorecardBatch;
    batch.locked = !batch.locked;

    await update(batch); // update db
  };

  const handleActive = async () => {
    const batch = scorecardBatch;
    batch.active = !batch.active;

    await update(batch); // update db
  };

  const handleDeactive = async () => {
    const batch = scorecardBatch;
    batch.active = !batch.active;
    batch.locked = true;

    await update(batch); // update db
  };

  const update = async (batch: IScorecardBatch) => {
    try {
      await api.scorecard.update(batch);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const handleEdit = () => {
    store.scorecard.selected = scorecardBatch; // set selected scorecard batch
    showModalFromId(MODAL_NAMES.ADMIN.SCORECARD_BATCH_MODAL); // show modal
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove scorecard batch?")) return; // TODO: confirmation dialog
    api.scorecard.delete(scorecardBatch); // remove scorecard batch
  };

  return (
    <div
      className={`batch uk-card uk-card-default uk-card-body uk-card-small ${activeCss}`}
    >
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">Name</span>
            {scorecardBatch.description}
          </h6>
        </div>

        {scorecardBatch.active && (
          <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
            <h6 className="lock-status">
              <span className="span-label">Status</span>
              {scorecardBatch.locked ? "LOCKED" : "UNLOCKED"}
            </h6>
          </div>
        )}

        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-auto@m uk-text-center">
          <div className="controls">
            {scorecardBatch.active && scorecardBatch.locked && (
              <button
                className="btn-icon uk-margin-small-right"
                onClick={handleLock}
              >
                <span data-uk-icon="lock"></span>
              </button>
            )}

            {scorecardBatch.active && !scorecardBatch.locked && (
              <button
                className="btn-icon uk-margin-small-right"
                onClick={handleLock}
              >
                <span data-uk-icon="unlock"></span>
              </button>
            )}

            {!scorecardBatch.active && (
              <button
                className="btn-icon uk-margin-small-right"
                onClick={handleActive}
              >
                <span data-uk-icon="play"></span>
              </button>
            )}

            {scorecardBatch.active && (
              <button
                className="btn-icon uk-margin-small-right"
                onClick={handleDeactive}
              >
                <span data-uk-icon="ban"></span>
              </button>
            )}

            <button
              className="btn-icon uk-margin-small-right"
              onClick={handleEdit}
            >
              <span data-uk-icon="pencil"></span>
            </button>
            <button className="btn-icon" onClick={handleDelete}>
              <span data-uk-icon="trash"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorecardItem;
