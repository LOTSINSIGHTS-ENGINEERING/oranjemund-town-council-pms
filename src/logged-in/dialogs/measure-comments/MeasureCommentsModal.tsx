import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultMeasure, IMeasure } from "../../../shared/models/Measure";
import MODAL_NAMES from "../ModalName";

const MeasureCommentsModal = observer(() => {
  const { api, store } = useAppContext();

  const [measure, setMeasure] = useState<IMeasure>({ ...defaultMeasure });
  const [loading, setLoading] = useState(false);
  const [remainingChar, setRemainingChars] = useState(0);
  const maxCharCount = 2000;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selected = store.measure.selected; // update only existing/selected measures, if not selected, then we cannot update it.
    if (!selected) return; //TODO: alert invalid uid.

    setLoading(true); // start loading
    await update(measure);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (measure: IMeasure) => {
    try {
      await api.measure.update(measure, ["comments"]);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    // clear selected measure & selected objective
    store.measure.clearSelected();
    store.objective.clearSelected();
    setMeasure({ ...defaultMeasure }); // reset form
    hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MODAL);
  };

  useEffect(() => {
    // no selected measure, and no selected objective
    if (!store.measure.selected) setMeasure({ ...defaultMeasure });

    // if selected measure, set form values
    if (store.measure.selected)
      setMeasure({ ...defaultMeasure, ...store.measure.selected });
  }, [store.measure.selected, store.objective, store.objective.selected]);

  useEffect(() => {
    setRemainingChars(maxCharCount - measure.comments.length);

    if (maxCharCount < measure.comments.length) {
      // clip the comments to maxCharCount
      setMeasure({
        ...measure,
        comments: measure.comments.substring(0, maxCharCount),
      });
    }
  }, [measure]);

  return (
    <div className="measure-comments-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">
        {measure.description}{" "}
        <span className="comment-title">(KPI comments)</span>
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
              id="kpi-comments"
              rows={10}
              placeholder="KPI comments"
              value={measure.comments}
              onChange={(e) =>
                setMeasure({ ...measure, comments: e.target.value })
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

export default MeasureCommentsModal;
