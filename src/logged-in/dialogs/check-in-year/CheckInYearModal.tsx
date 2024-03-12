import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";
import { ICheckInYear, defaultCheckInYear } from "../../../shared/models/check-in-model/CheckInYear";


const CheckInYearModal = observer(() => {
  const { api, store } = useAppContext();

  const [year, setYear] = useState({ ...defaultCheckInYear });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const selected = store.checkIn.checkInYear.selected;
    if (selected) await update(year);
    else await create(year);
    setLoading(false);
    onCancel();
  };

  const update = async (year: ICheckInYear) => {
    try {
      await api.checkIn.checkInYear.update(year);
    } catch (error) { }
  };

  const create = async (year: ICheckInYear) => {
    try {
      await api.checkIn.checkInYear.create(year);
    } catch (error) { }
  };

  const onCancel = () => {
    store.checkIn.checkInYear.clearSelected();
    setYear({ ...defaultCheckInYear });
    hideModalFromId(MODAL_NAMES.CHECKIN.CHECK_IN_YEAR);
  };

  useEffect(() => {
    if (store.checkIn.checkInYear.selected)
      setYear({ ...store.checkIn.checkInYear.selected });
    else setYear({ ...defaultCheckInYear });
  }, [store.checkIn.checkInYear.selected]);

  return (
    <div className="year-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Year</h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          onSubmit={handleSubmit}
          data-uk-grid
        >
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="year-job-title">
              Year
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input uk-form-small"
                id="year-job-title"
                type="text"
                placeholder="e.g 2023"
                value={year.yearName}
                onChange={(e) => setYear({ ...year, yearName: e.target.value })}
              />
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
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CheckInYearModal;
