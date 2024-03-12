import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";
import { useParams } from "react-router-dom";
import { ICheckInWeek, IMilestone, defaultCheckInWeek, defaultMilestone } from "../../../shared/models/check-in-model/CheckInWeek";
import { MilestonesItem } from "./MilestonesItem";
import "./checkindialog.scss"

const CheckInWeekModal = observer(() => {

  const { api, store } = useAppContext();
  const { yearId = 'defaultYearId', monthId = 'defaultMonthId' } = useParams<{ yearId?: string, monthId?: string }>();
  const me = store.auth.meJson;

  const [week, setWeek] = useState<ICheckInWeek>({ ...defaultCheckInWeek });
  const [milestones, setMilestones] = useState<IMilestone[]>([defaultMilestone]);


  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!me) {
      console.log("error");
      return
    };

    setLoading(true);
    const selected = store.checkIn.checkInWeek.selected;

    const $week: ICheckInWeek = {
      ...week,
      uid: me.uid,
      monthId: monthId,
      weeklyMilestones: [...milestones],
    }

    if (selected) await update($week);
    else await create($week);

    setLoading(false);
    onCancel();
  };

  const update = async (week: ICheckInWeek) => {
    try {
      await api.checkIn.checkInWeek.update(yearId, monthId, week);
    } catch (error) { }
  };

  const create = async (week: ICheckInWeek) => {
    try {
      await api.checkIn.checkInWeek.create(yearId, monthId, week);
    } catch (error) { }
  };

  const onCancel = () => {
    store.checkIn.checkInWeek.clearSelected();
    setWeek({ ...defaultCheckInWeek });
    hideModalFromId(MODAL_NAMES.CHECKIN.CHECK_IN_WEEK);
  };

  useEffect(() => {
    if (store.checkIn.checkInWeek.selected) {
      setWeek({ ...store.checkIn.checkInWeek.selected });
      setMilestones(week.weeklyMilestones);
    }
    else setWeek({ ...defaultCheckInWeek });
  }, [store.checkIn.checkInWeek.selected, week.weeklyMilestones]);

  const handleInputChange = (e: any) => {
    const input = e.target.value;
    const regex = /^Week \d{2}$/;
    if (regex.test(input) || input === "") {
      setWeek({
        ...week,
        weekNumber: input,
      });
    }
  };


  return (
    <div className="week-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      style={{ width: "800px" }}>
      <button className="uk-modal-close-default" type="button" data-uk-close ></button>
      <h3 className="uk-modal-title">Weekly Check In</h3>
      <div className="dialog-content uk-position-relative">
        <form className="uk-form-stacked" onSubmit={handleSubmit} >
          <div className="uk-grid-small" data-uk-grid>
            {/* <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="week-number">
                Week Number
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  id="week-number"
                  type="text"
                  min={6}
                  max={6}
                  placeholder="e.g Week 01"
                  value={week.weekNumber}
                  onChange={(e) =>
                    setWeek({
                      ...week,
                      weekNumber: (e.target.value),
                    })
                  }
                />
              </div>
            </div> */}
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="week-number">
                Week Number
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  id="week-number"
                  type="text"
                  placeholder="e.g Week 01"
                  value={week.weekNumber}
                  onChange={(e) =>
                    setWeek({
                      ...week,
                      weekNumber: (e.target.value),
                    })
                  }
                  required
                  pattern="Week [0-9]{2}"
                />
                <small>Format: Week XX</small>
              </div>
            </div>

            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="week-total-hours">
                Total Hours
              </label>
              <div className="uk-form-controls">
                <input
                  id="week-total-hours"
                  className="uk-input uk-form-small"
                  type="number"
                  value={week.weeklyTotalHours}
                  onChange={(e) =>
                    setWeek({
                      ...week,
                      weeklyTotalHours: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="company-value">
                Company Value
              </label>
              <div className="uk-form-controls">
                <select
                  id="company-value"
                  className="uk-select uk-form-small"
                  value={week.companyValue}
                  onChange={(e) =>
                    setWeek({
                      ...week,
                      companyValue: e.target.value,
                    })
                  }
                >
                  <option value={""}>Select...</option>
                  <option value={"Creativity"}>Creativity</option>
                  <option value={"Simplicity"}>Simplicity</option>
                  <option value={"Care and Empathy"}>Care and Empathy</option>
                  <option value={"Quality and Excellence"}>Quality and Excellence</option>
                </select>
              </div>
            </div>
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="weekly-achievement">
                Achievements
              </label>
              <div className="uk-form-controls">
                <textarea
                  placeholder="e.g Value Generation or Business Impact"
                  id="weekly-achievement"
                  className="uk-textarea"
                  value={week.weeklyAchievement}
                  rows={5}
                  onChange={(e) =>
                    setWeek({
                      ...week,
                      weeklyAchievement: e.target.value,
                    })
                  }
                >
                </textarea>
              </div>
            </div>
            <MilestonesItem
              title="milestones"
              miles={milestones}
              setMiles={setMilestones}
            />
          </div>
          <div className="uk-width-1-1 uk-text-right  uk-margin">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}>
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CheckInWeekModal;