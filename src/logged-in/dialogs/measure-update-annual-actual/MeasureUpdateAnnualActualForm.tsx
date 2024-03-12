import { Dispatch, SetStateAction } from "react";
import { observer } from "mobx-react-lite";
import { dataTypeSymbol } from "../../shared/functions/Scorecard";
import { IMeasure } from "../../../shared/models/Measure";
import NumberInput, { NumberInputValue} from "../../shared/components/number-input/NumberInput";

interface IProps {
  measure: IMeasure;
  setMeasure: Dispatch<SetStateAction<IMeasure>>;
}
const MeasureUpdateAnnualActualForm = observer((props: IProps) => {
  const { measure, setMeasure } = props;
  const dataType = measure.dataType;

  const dateFormat = (dateMillis: number | string) => {
    const date = new Date(dateMillis);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    // append 0 if month or day is less than 10
    const mn = `${month < 10 ? `0${month}` : month}`;
    const dy = `${day < 10 ? `0${day}` : day}`;

    return `${year}-${mn}-${dy}`;
  };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMeasure({
      ...measure,
      annualActual: value ? new Date(e.target.value).getTime() : null,
    });
  };

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-description">
          Measure/KPI
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="kpi-description"
            placeholder="KPI description"
            value={measure.description}
            onChange={(e) =>
              setMeasure({ ...measure, description: e.target.value })
            }
            // required
            disabled
          />
        </div>
      </div>

      {dataType !== "Date" && (
        <div className="uk-width-1-1">
          <label className="uk-form-label" htmlFor="kpi-actual">
            Progress update ({dataTypeSymbol(dataType).symbol})
          </label>
          <div className="uk-form-controls">
            <NumberInput
              id="kpi-actual"
              className="uk-input uk-form-small"
              placeholder="KPI actual"
              value={measure.annualActual}
              onChange={(value) =>
                setMeasure({
                  ...measure,
                  annualActual: NumberInputValue(value),
                })
              }
            />
          </div>
        </div>
      )}

      {dataType === "Date" && (
        <div className="uk-width-1-1">
          <label className="uk-form-label" htmlFor="kpi-annual-actual">
            Progress Update ({dataTypeSymbol(dataType).symbol})
          </label>
          <div className="uk-form-controls">
            <input
              id="kpi-annual-actual"
              className="uk-input uk-form-small"
              type="date"
              value={dateFormat(measure.annualActual || "")} //Date.now() //string added to prevent current date
              onChange={onDateChange}
            />
          </div>
        </div>
      )}

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-comments">
          Comments
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="kpi-comments"
            rows={3}
            placeholder="KPI comments"
            value={measure.comments}
            onChange={(e) =>
              setMeasure({ ...measure, comments: e.target.value })
            }
          />
        </div>
      </div>
    </>
  );
});

export default MeasureUpdateAnnualActualForm;
