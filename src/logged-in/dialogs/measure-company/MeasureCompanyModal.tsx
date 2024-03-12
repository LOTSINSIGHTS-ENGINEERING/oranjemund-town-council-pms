import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultMeasureCompany, IMeasureCompany } from "../../../shared/models/MeasureCompany";
import { IObjective } from "../../../shared/models/Objective";
import { measureRating } from "../../shared/functions/Scorecard";
import MODAL_NAMES from "../ModalName";
import MeasureCompanyForm, { MeasureCompanyCommentsForm } from "./MeasureCompanyForm";

interface ITabsProps {
  tab: "Metrics" | "Comments";
  setTab: React.Dispatch<React.SetStateAction<"Metrics" | "Comments">>;
}
const Tabs = (props: ITabsProps) => {
  const activeClass = (tab: "Metrics" | "Comments") => {
    if (props.tab === tab) return "uk-active";
    return "";
  };

  return (
    <div className="uk-margin-small-bottom">
      <ul className="kit-tabs" data-uk-tab>
        <li
          className={activeClass("Metrics")}
          onClick={() => props.setTab("Metrics")}
        >
          <a href="void(0)">Metrics</a>
        </li>
        <li
          className={activeClass("Comments")}
          onClick={() => props.setTab("Comments")}
        >
          <a href="void(0)">Comments</a>
        </li>
      </ul>
    </div>
  );
};

const MeasureCompanyModal = observer(() => {
  const { api, store } = useAppContext();
  const { objectiveId } = useParams();

  const [objective, setObjective] = useState<IObjective | null>(null);
  const [tab, setTab] = useState<"Metrics" | "Comments">("Metrics");
  const [measure, setMeasure] = useState<IMeasureCompany>({
    ...defaultMeasureCompany,
  });
  const [loading, setLoading] = useState(false);
  const [isLocked, setisLocked] = useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // get uid from auth
    const me = store.auth.meJson; // my user account
    if (!me || !objective) return; //TODO: alert invalid uid.  // set objective

    setLoading(true); // start loading

    const rating = measureRating(measure);

    // update measure uid & displayName
    const $measure: IMeasureCompany = {
      ...measure,
      uid: me.uid,
      userName: me.displayName || "",
      q1AutoRating: rating,
      q2AutoRating: rating,
      q3AutoRating: rating,
      q4AutoRating: rating,
      objective: objective.id,
      annualActual: measure.annualActual,
    };

    // if selected measure, update
    const selected = store.companyMeasure.selected;

    if (selected) await update($measure);
    else await create($measure);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (measure: IMeasureCompany) => {
    try {
      if (isLocked)
        await api.companyMeasure.update(measure, [
          "annualActual",
          "q1AutoRating",
          "q2AutoRating",
          "q3AutoRating",
          "q4AutoRating",
        ]);
      else await api.companyMeasure.update(measure);
    } catch (error) {
      console.log(error);
    }
  };

  const create = async (measure: IMeasureCompany) => {
    try {
      await api.companyMeasure.create(measure);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    // clear selected measure & selected objective
    store.companyMeasure.clearSelected();
    store.companyObjective.clearSelected();
    // reset form
    setMeasure({ ...defaultMeasureCompany });
    setTab("Metrics");

    // hide modal
    hideModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_MODAL);
  };

  useEffect(() => {
    const selectedMeasure = store.companyMeasure.selected;
    // no selected measure, and no selected objective
    if (!selectedMeasure && !objective)
      setMeasure({ ...defaultMeasureCompany });
    // if selected measure, set form values
    else if (selectedMeasure) setMeasure({ ...selectedMeasure });
    // if selected objective, set form values
    else if (objective && !selectedMeasure)
      setMeasure({
        ...defaultMeasureCompany,
        objective: objective.id,
      });
  }, [objective, store.companyMeasure.selected]);

  // Get measures
  useEffect(() => {
    const getObjective = () => {
      const objective = store.companyObjective.all.find(
        (objective) => objective.asJson.id === objectiveId
      );

      if (objective) {
        store.companyObjective.select(objective.asJson);
        setObjective(objective.asJson);
      } else {
        setObjective(null);
        hideModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_MODAL);
      }
    };

    getObjective();
  }, [store.companyObjective, objectiveId]);

  // Active(Current) scorecard
  useEffect(() => {
    const scorecard = store.scorecard.active;
    if (scorecard) setisLocked(scorecard.locked);
  }, [store.scorecard.active]);

  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Measure/KPI</h3>

      <div className="dialog-content uk-position-relative">
        <Tabs tab={tab} setTab={setTab} />

        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          {tab === "Metrics" && (
            <MeasureCompanyForm measure={measure} setMeasure={setMeasure} />
          )}

          {tab === "Comments" && (
            <MeasureCompanyCommentsForm
              measure={measure}
              setMeasure={setMeasure}
            />
          )}

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

export default MeasureCompanyModal;
