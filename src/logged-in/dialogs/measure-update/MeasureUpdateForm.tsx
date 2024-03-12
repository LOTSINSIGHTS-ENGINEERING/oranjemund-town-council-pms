import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React from "react";
import { IMeasure } from "../../../shared/models/Measure";
import NumberInput, { NumberInputValue } from "../../shared/components/number-input/NumberInput";
import { measureRating } from "../../shared/functions/Scorecard";

interface IProps {
  measure: IMeasure;
  setMeasure: React.Dispatch<React.SetStateAction<IMeasure>>;
}
const MeasureUpdateForm = observer((props: IProps) => {
  const { measure, setMeasure } = props;

  const handleActualChange = (value: string | number) => {
    const actual = NumberInputValue(value);
    const $measure: IMeasure = { ...measure, annualActual: actual };
    const rating = measureRating(measure);

    // update rating
    $measure.autoRating = rating;
    setMeasure($measure);
  };

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-description">
          KPI
          <div className="field-info uk-margin-small-left">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="icon"
              fontSize="xs"
            />
            <p className="description">
              Objective weight is used to prioritize certain objectives over the
              others.
            </p>
          </div>
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="kpi-description"
            rows={2}
            placeholder="KPI description"
            defaultValue={measure.description}
            required
            disabled
          />
        </div>
      </div>

      <div className="uk-width-2-3">
        <label className="uk-form-label" htmlFor="kpi-actual">
          Actual
          <div className="field-info uk-margin-small-left">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="icon"
              fontSize="xs"
            />
            <p className="description">
              Objective weight is used to prioritize certain objectives over the
              others.
            </p>
          </div>
        </label>
        <div className="uk-form-controls">
          <NumberInput
            id="kpi-actual"
            className="uk-input uk-form-small"
            placeholder="KPI actual"
            value={measure.annualActual}
            onChange={handleActualChange}
          />
        </div>
      </div>

      <div className="uk-width-1-3">
        <label className="uk-form-label" htmlFor="kpi-rating">
          Rating out of 5
          <div className="field-info uk-margin-small-left">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="icon"
              fontSize="xs"
            />
            <p className="description">
              Objective weight is used to prioritize certain objectives over the
              others.
            </p>
          </div>
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="kpi-rating"
            type="number"
            placeholder="KPI rating"
            min={1}
            max={5}
            step={0.1}
            value={`${Number(measure.autoRating) || 0}`}
            onChange={(e) =>
              setMeasure({ ...measure, autoRating: e.target.valueAsNumber })
            }
            disabled
          />
        </div>
      </div>
    </>
  );
});

export default MeasureUpdateForm;
