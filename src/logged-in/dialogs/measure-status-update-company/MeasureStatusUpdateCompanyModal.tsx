import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IMeasureCompany, defaultMeasureCompany } from "../../../shared/models/MeasureCompany";
import MODAL_NAMES from "../ModalName";

const MeasureStatusUpdateCompanyModal = observer(() => {
  const { api, store } = useAppContext();

  const [measure, setMeasure] = useState<IMeasureCompany>({
    ...defaultMeasureCompany,
  });
  const [loading, setLoading] = useState(false);
  const [remainingChar, setRemainingChars] = useState(0);
  const maxCharCount = 2000;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selected = store.companyMeasure.selected; // update only existing/selected measures, if not selected, then we cannot update it.
    if (!selected) return; //TODO: alert invalid uid.

    setLoading(true); // start loading
    await update(measure);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (measure: IMeasureCompany) => {
    try {
      await api.companyMeasure.update(measure, ["statusUpdate"]);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    // clear selected measure & selected objective
    store.companyMeasure.clearSelected();
    store.companyObjective.clearSelected();
    setMeasure({ ...defaultMeasureCompany }); // reset form
    hideModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_STATUS_UPDATE_MODAL);
  };

  useEffect(() => {
    // no selected measure, and no selected objective
    if (!store.companyMeasure.selected)
      setMeasure({ ...defaultMeasureCompany });

    // if selected measure, set form values
    if (store.companyMeasure.selected)
      setMeasure({
        ...defaultMeasureCompany,
        ...store.companyMeasure.selected,
      });
  }, [store.companyMeasure.selected, store.companyObjective.selected]);

  useEffect(() => {
    setRemainingChars(maxCharCount - measure.statusUpdate.length);

    if (maxCharCount < measure.statusUpdate.length) {
      // clip the statusUpdate to maxCharCount
      setMeasure({
        ...defaultMeasureCompany,
        ...measure,
        statusUpdate: measure.statusUpdate.substring(0, maxCharCount),
      });
    }
  }, [measure]);

  return (
    <div className="measure-status-update-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">
        <span className="comment-title">Status Update: </span>
        {measure.description}
      </h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <div className="uk-width-1-1">
            <textarea
              className={
                "uk-textarea uk-form-small " +
                (remainingChar < 50 && "characters-limit-hit")
              }
              id="kpi-status-update"
              rows={10}
              placeholder="KPI Status Update"
              value={measure.statusUpdate}
              onChange={(e) =>
                setMeasure({ ...measure, statusUpdate: e.target.value })
              }
            />
            {remainingChar < 100 && (
              <p className="characters-left">
                {remainingChar} characters left. You're approaching the maximum
                of {maxCharCount} characters.
              </p>
            )}
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
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default MeasureStatusUpdateCompanyModal;
