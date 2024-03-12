import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";
import { ICheckInMonth, defaultCheckInMonth } from "../../../shared/models/check-in-model/CheckInMonth";
import { dateFormat_YY_MM_DY } from "../../shared/utils/utils";
import { useParams } from "react-router-dom";

const CheckInMonthModal = observer(() => {

  const { api, store } = useAppContext();
  const { yearId = 'defaultYearId' } = useParams<{ yearId?: string }>();

  const [month, setMonth] = useState({ ...defaultCheckInMonth });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const selected = store.checkIn.checkInMonth.selected;

    const $month: ICheckInMonth = {
      ...month,
      yearId: yearId,
    }

    if (selected) await update($month);
    else await create($month);

    setLoading(false);
    onCancel();
  };

  const update = async (month: ICheckInMonth) => {
    try {
      await api.checkIn.checkInMonth.update(month);
    } catch (error) { }
  };

  const create = async (month: ICheckInMonth) => {
    try {
      await api.checkIn.checkInMonth.create(yearId, month);
    } catch (error) {
    }
  };

  const onCancel = () => {
    store.checkIn.checkInMonth.clearSelected();
    setMonth({ ...defaultCheckInMonth });
    hideModalFromId(MODAL_NAMES.CHECKIN.CHECK_IN_MONTH);
  };

  useEffect(() => {
    if (store.checkIn.checkInMonth.selected)
      setMonth({ ...store.checkIn.checkInMonth.selected });
    else setMonth({ ...defaultCheckInMonth });
  }, [store.checkIn.checkInMonth.selected]);

  return (
    <div className="month-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Month</h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          onSubmit={handleSubmit}
          data-uk-grid>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="month-job-title">
              Name of  the Month
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input uk-form-small"
                id="month-job-title"
                type="text"
                placeholder="e.g April"
                value={month.monthName}
                onChange={(e) => setMonth({ ...month, monthName: e.target.value })}
              />
            </div>
          </div>
          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="month-job-title">
              Starting Date
            </label>
            <div className="uk-form-controls">
              <input
                id="checkin-start-date"
                className="uk-input uk-form-small"
                type="date"
                value={dateFormat_YY_MM_DY(month.startingDate) || "yyyy/mm/dd"}
                onChange={(e) =>
                  setMonth({
                    ...month,
                    startingDate: new Date(e.target.value).getTime(),
                  })
                }
              />
            </div>
          </div>
          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="month-job-title">
              Ending Date
            </label>
            <div className="uk-form-controls">
              <input
                id="checkin-end-date"
                className="uk-input uk-form-small"
                type="date"
                value={dateFormat_YY_MM_DY(month.endingDate) || "yyyy/mm/dd"}
                onChange={(e) =>
                  setMonth({
                    ...month,
                    endingDate: new Date(e.target.value).getTime(),
                  })
                }
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

export default CheckInMonthModal;
