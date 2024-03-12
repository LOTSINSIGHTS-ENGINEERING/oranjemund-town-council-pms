import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { MAIL_ASSESSMENT_REJECTED_ME, MAIL_EMAIL } from "../../../shared/functions/mailMessages";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IScorecardMetadata, defaultScorecardMetadata } from "../../../shared/models/ScorecardMetadata";
import MODAL_NAMES from "../ModalName";

const EmployeeScorecardQ4RejectionModal = observer(() => {
  const { api, store, ui } = useAppContext();
  const [comments, setComments] = useState<string>("");
  const [discussion, setDiscussion] = useState(false);
  const [agreement, setAgreement] = useState<IScorecardMetadata>(
    defaultScorecardMetadata
  );
  const [loading, setLoading] = useState(false);
  const me = store.auth.meJson;
  const user = store.user.selected;

  const onUpdate = async (agreement: IScorecardMetadata) => {
    try {
      await api.individualScorecardMetadata.update(agreement);

      ui.snackbar.load({
        id: Date.now(),
        message: "Reverted Scorecard to Employee.",
        type: "success",
      });
      // email
      // push notification
    } catch (error) {
      console.log(error);

      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to revert the Scorecard.",
        type: "danger",
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // get uid from auth
    // const me = store.auth.meJson; // my user account
    // if (!me) return; //TODO: alert invalid uid.

    if (!user || !me) {
      ui.snackbar.load({
        id: Date.now(),
        type: "danger",
        message: "User not found, email not sent.",
        timeoutInMs: 10000,
      });
      return;
    }

    const { MY_SUBJECT, MY_BODY } = MAIL_ASSESSMENT_REJECTED_ME(
      user.displayName,
      me.displayName
    );

    setLoading(true); // start loading
    const $agreement: IScorecardMetadata = { ...agreement };
    $agreement.quarter4Review.comments = comments;
    $agreement.quarter4Review.status = "in-progress";
    await onUpdate($agreement);
    await api.mail.scorecardMail(user.email!, MAIL_EMAIL, MY_SUBJECT, MY_BODY);

    setLoading(false); // stop loading
    onCancel();
  };

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.EXECUTION.SCORECARD_Q4_REJECTION_MODAL);
    setComments("");
    setDiscussion(false);
  };

  const updateFormOnMount = useCallback(() => {
    if (store.individualScorecardMetadata.selected)
      setAgreement({
        ...store.individualScorecardMetadata.selected,
      });
    if (!store.individualScorecardMetadata.selected)
      setAgreement({ ...defaultScorecardMetadata });
  }, [store.individualScorecardMetadata.selected]);

  useEffect(() => {
    updateFormOnMount();
    return () => { };
  }, [updateFormOnMount]);

  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Revert Assessment</h3>

      <div className="dialog-content uk-position-relative">
        {/* <div
          className="uk-alert-danger uk-padding-small uk-margin"
          data-uk-alert
        >
          <p>The assessment will be reverted for ammendments</p>
        </div> */}

        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="kpi-comments">
              Reasons / Comments for reverting the assessment review.
            </label>
            <div className="uk-form-controls">
              <textarea
                className="uk-textarea uk-form-small"
                id="kpi-comments"
                rows={3}
                placeholder="Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="uk-width-1-1">
            <div className="uk-form-controls ">
              <label className="uk-form-label">
                <input
                  className="uk-checkbox uk-margin-small-right"
                  type="checkbox"
                  placeholder="Discussion"
                  checked={discussion}
                  onChange={(e) => setDiscussion(e.target.checked)}
                  required
                />
                Confirm that you had a discussion with the employee!
                <div className="field-info uk-margin-small-left">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="icon"
                    fontSize="xs"
                  />
                  <p className="description">
                    Objective weight is used to prioritize certain objectives
                    over the others.
                  </p>
                </div>
              </label>
            </div>
          </div>

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
              Revert {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default EmployeeScorecardQ4RejectionModal;

// await api.mail.sendMailCC(
//   [user.email!],
//   [me.email!],
//   MAIL_EMAIL,
//   MY_SUBJECT,
//   MY_BODY
// );
