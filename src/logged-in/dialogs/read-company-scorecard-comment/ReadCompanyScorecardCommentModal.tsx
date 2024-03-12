import { observer } from "mobx-react-lite";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IScorecardMetadata } from "../../../shared/models/ScorecardMetadata";
import MODAL_NAMES from "../ModalName";

interface IProps {
  agreement: IScorecardMetadata;
}
const ReadCompanyScorecardCommentModal = observer((props: IProps) => {
  const { agreement } = props;

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.EXECUTION.READ_COMPANY_SCORECARD_COMMENT_MODAL);
  };

  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-3-4">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Scorecard Comments</h3>
      <div className="dialog-content uk-position-relative">
        <form className="uk-form-stacked uk-grid-small" data-uk-grid>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="kpi-comments">
              Draft Comments
            </label>
            <div className="uk-form-controls">
              <textarea
                className="uk-textarea uk-form-small"
                id="kpi-comments"
                rows={6}
                placeholder="comments..."
                value={agreement.agreementDraft.comments}
                readOnly
              />
            </div>
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="kpi-comments">
                Q1 Comments
              </label>
              <textarea
                className="uk-textarea uk-form-small"
                id="kpi-comments"
                rows={6}
                placeholder="comments..."
                value={agreement.quarter1Review.comments}
                readOnly
              />
            </div>
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="kpi-comments">
                Midterm Comments
              </label>
              <textarea
                className="uk-textarea uk-form-small"
                id="kpi-comments"
                rows={6}
                placeholder="comments..."
                value={agreement.quarter2Review.comments}
                readOnly
              />
            </div>
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="kpi-comments">
                Q3 Comments
              </label>
              <textarea
                className="uk-textarea uk-form-small"
                id="kpi-comments"
                rows={6}
                placeholder="comments..."
                value={agreement.quarter3Review.comments}
                readOnly
              />
            </div>
            <div className="uk-form-controls">
              <label className="uk-form-label" htmlFor="kpi-comments">
                Assessment Comments
              </label>
              <textarea
                className="uk-textarea uk-form-small"
                id="kpi-comments"
                rows={6}
                placeholder="comments..."
                value={agreement.quarter4Review.comments}
                readOnly
              />
            </div>
          </div>
          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ReadCompanyScorecardCommentModal;
