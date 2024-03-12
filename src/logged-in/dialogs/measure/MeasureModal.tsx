import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultMeasure, IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";
import { measureRating } from "../../shared/functions/Scorecard";
import MODAL_NAMES from "../ModalName";
import MeasureForm, { MeasureCommentsForm } from "./MeasureForm";

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

const MeasureModal = observer(() => {
  const { api, store } = useAppContext();
  const { id: objectiveId } = useParams();

  const [objective, setObjective] = useState<IObjective | null>(null);
  const [tab, setTab] = useState<"Metrics" | "Comments">("Metrics");
  const [measure, setMeasure] = useState<IMeasure>({ ...defaultMeasure });
  const [loading, setLoading] = useState(false);
  const [isLocked, setisLocked] = useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // get uid from auth
    const me = store.auth.meJson; // my user account
    if (!me || !objective) return; // set objective

    setLoading(true); // start loading

    // update measure uid & displayName
    const $measure: IMeasure = {
      ...measure,
      uid: me.uid,
      userName: me.displayName || "",
      autoRating: measureRating(measure),
      objective: objective.id,
      perspective: objective.perspective,
      annualActual: measure.annualActual,
    };

    // if selected measure, update
    const selected = store.measure.selected;

    if (selected) await update($measure);
    else await create($measure);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (measure: IMeasure) => {
    try {
      if (isLocked)
        await api.measure.update(measure, ["annualActual", "autoRating"]);
      else await api.measure.update(measure);
    } catch (error) {
      console.log(error);
    }
  };

  const create = async (measure: IMeasure) => {
    try {
      await api.measure.create(measure);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    // clear selected measure & selected objective
    store.measure.clearSelected();
    store.objective.clearSelected();
    setMeasure({ ...defaultMeasure }); // reset form
    setTab("Metrics"); // reset tab
    hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_MODAL);
  };

  useEffect(() => {
    const selectedMeasure = store.measure.selected;
    // no selected measure, and no selected objective
    if (!selectedMeasure && !objective) setMeasure({ ...defaultMeasure });
    // if selected measure, set form values
    else if (selectedMeasure) setMeasure({ ...selectedMeasure });
    // if selected objective, set form values
    else if (objective && !selectedMeasure)
      setMeasure({
        ...defaultMeasure,
        objective: objective.id,
      });
  }, [store.measure.selected, objective]);

  useEffect(() => {
    const getObjective = () => {
      const objective = store.objective.all.find(
        (o) => o.asJson.id === objectiveId
      );

      if (objective) {
        store.objective.select(objective.asJson);
        setObjective(objective.asJson);
      } else {
        setObjective(null);
        hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_MODAL);
      }
    };

    getObjective();
  }, [store.objective, objectiveId]);

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
            <MeasureForm measure={measure} setMeasure={setMeasure} />
          )}

          {tab === "Comments" && (
            <MeasureCommentsForm measure={measure} setMeasure={setMeasure} />
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

export default MeasureModal;
