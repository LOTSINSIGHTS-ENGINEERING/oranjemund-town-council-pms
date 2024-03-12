import { Dispatch, Fragment, SetStateAction } from "react";
import { observer } from "mobx-react-lite";
import { dataTypeSymbol } from "../../shared/functions/Scorecard";
import { IMeasureDepartment } from "../../../shared/models/MeasureDepartment";
import NumberInput, {NumberInputValue} from "../../shared/components/number-input/NumberInput";

interface IProps {
  measure: IMeasureDepartment;
  setMeasure: Dispatch<SetStateAction<IMeasureDepartment>>;
}
const MeasureDepartmentUpdateQ2ActualForm = observer((props: IProps) => {
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

  const onChange = (val: string | number) => {
    const value = NumberInputValue(val);

    setMeasure({
      ...measure,
      quarter2Actual: value,
      quarter3Actual: value,
      quarter4Actual: value,
      annualActual: value,
    });
  };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _value = value ? new Date(e.target.value).getTime() : null;

    setMeasure({
      ...measure,
      quarter2Actual: _value,
      quarter3Actual: _value,
      quarter4Actual: _value,
      annualActual: _value,
    });
  };

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-description">
          Measure/KPI
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="kpi-description"
            rows={2}
            placeholder="KPI description"
            value={measure.description}
            onChange={(e) =>
              setMeasure({ ...measure, description: e.target.value })
            }
            required
            disabled
          />
        </div>
      </div>

      {dataType !== "Date" && (
        <div className="uk-width-1-1">
          <label className="uk-form-label" htmlFor="kpi-actual">
            Progress Update ({dataTypeSymbol(dataType).symbol})
          </label>
          <div className="uk-form-controls">
            <NumberInput
              id="kpi-actual"
              className="uk-input uk-form-small"
              placeholder="KPI actual"
              value={measure.quarter1Actual}
              onChange={onChange}
            />
          </div>
        </div>
      )}

      {dataType === "Date" && (
        <div className="uk-width-1-1">
          <label className="uk-form-label" htmlFor="kpi-actual">
            Progress Update ({dataTypeSymbol(dataType).symbol})
          </label>
          <div className="uk-form-controls">
            <input
              className="uk-input uk-form-small"
              id="kpi-actual"
              type="date"
              placeholder="KPI Actual"
              value={dateFormat(measure.annualActual || "")} //Date.now() //string added to prevent current date
              onChange={onDateChange}
            />
          </div>
        </div>
      )}

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-status-update">
          Status Update
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="kpi-status-update"
            rows={3}
            placeholder="KPI Status Update"
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

export default MeasureDepartmentUpdateQ2ActualForm;
