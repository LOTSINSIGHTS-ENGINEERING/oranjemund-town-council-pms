import { observer } from "mobx-react-lite";
import React from "react";
import { IMeasure } from "../../../shared/models/Measure";
import NumberInput, { NumberInputValue } from "../../shared/components/number-input/NumberInput";
import { dateFormat_YY_MM_DY } from "../../shared/utils/utils";
import SelectInput, { SelectInputOption } from "../../shared/components/select-input/SelectInput";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import FormFieldInfo from "../../shared/components/form-field-info/FormFieldInfo";

interface IProps {
  measure: IMeasure;
  setMeasure: React.Dispatch<React.SetStateAction<IMeasure>>;
}
export const MeasureCommentsForm = (props: IProps) => {
  const { measure, setMeasure } = props;

  return (
    <div className="uk-width-1-1">
      <label className="uk-form-label" htmlFor="kpi-comments">
        Comments
        <FormFieldInfo>
          Use comments for any needs e.g. Add more context to your measure.
        </FormFieldInfo>
      </label>
      <div className="uk-form-controls">
        <textarea
          className="uk-textarea uk-form-small"
          id="kpi-comments"
          rows={6}
          placeholder="Write your comments..."
          value={measure.comments}
          onChange={(e) => setMeasure({ ...measure, comments: e.target.value })}
        />
      </div>
    </div>
  );
};

const MeasureForm = observer((props: IProps) => {
  const { measure, setMeasure } = props;
  const dataType = measure.dataType;
  const symbols = [
    {
      dataType: "Currency",
      symbols: [
        "NAD",
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "AUD",
        "CAD",
        "CHF",
        "NZD",
        "YEN",
      ],
    },
    {
      dataType: "Time",
      symbols: [
        "Years",
        "Months",
        "Weeks",
        "Days",
        "Hours",
        "Minutes",
        "Seconds",
      ],
    },
  ];
  const dataSymbols = symbols.find((s) => s.dataType === dataType);

  const handleDataTypeChange = (value: string | number) => {
    const dataType = value.toString();

    // switch case dataType
    switch (dataType) {
      case "Date":
        setMeasure({
          ...measure,
          dataType,
          dataSymbol: "-",
          symbolPos: "prefix",
          rating1: measure.rating1 || null,
          rating2: measure.rating2 || null,
          rating3: measure.rating3 || null,
          rating4: measure.rating4 || null,
          rating5: measure.rating5 || null,
          annualTarget: measure.annualTarget || null,
        });
        break;
      case "Percentage":
        setMeasure({
          ...measure,
          dataType: dataType,
          dataSymbol: "%",
          symbolPos: "suffix",
        });
        break;
      case "Number":
        setMeasure({
          ...measure,
          dataType: dataType,
          dataSymbol: "#",
          symbolPos: "prefix",
        });
        break;
      case "Currency":
        setMeasure({
          ...measure,
          dataType: dataType,
          dataSymbol: "NAD",
          symbolPos: "prefix",
        });
        break;
      case "Time":
        setMeasure({
          ...measure,
          dataType: dataType,
          dataSymbol: "Years",
          symbolPos: "prefix",
        });
        break;
      case "Custom":
        setMeasure({
          ...measure,
          dataType: dataType,
          // dataSymbol: "",
          symbolPos: "suffix",
        });
        break;
      default:
        setMeasure({ ...measure, dataType: dataType });
        break;
    }
  };

  return (
    <ErrorBoundary>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-description">
          Measure/KPI
          <FormFieldInfo>
            A good measure should contain a unit of measure e.g. % completion of
            a project.
          </FormFieldInfo>
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
            required
          />
        </div>
      </div>

      <div className="uk-width-1-2">
        <label className="uk-form-label" htmlFor="kpi-data-type-select">
          Units of measure
          <FormFieldInfo>
            There are various units of measures to choose from (Currency,
            Percentage, Number, Date, Time and Custom)
          </FormFieldInfo>
        </label>
        <div className="uk-form-controls">
          <SelectInput
            className="uk-input uk-form-small"
            id="kpi-data-type-select"
            value={measure.dataType}
            onChange={handleDataTypeChange}
          >
            <SelectInputOption value="Currency">
              <p className="option-label">Currency</p>
              <p className="option-description">
                Select the currency. This is the currency that will be used for
                the measure. It will be used for all calculations.
              </p>
            </SelectInputOption>
            <SelectInputOption value="Percentage">
              <p className="option-label">Percentage</p>
              <p className="option-description">
                Use for ratios and percentages.
              </p>
            </SelectInputOption>
            <SelectInputOption value="Number">
              <p className="option-label">Number</p>
              <p className="option-description">
                Used for counting things e.g. no. of people, no. of service
                stations, etc.
              </p>
            </SelectInputOption>
            <SelectInputOption value="Date">
              <p className="option-label">Date</p>
              <p className="option-description">
                Use this for specific dates e.g. 19 March 2020.
              </p>
            </SelectInputOption>
            <SelectInputOption value="Time">
              <p className="option-label">Time</p>
              <p className="option-description">
                Years, Months, Weeks, Days, Hours, Minutes, Seconds
              </p>
            </SelectInputOption>
            <SelectInputOption value="Custom">
              <p className="option-label">Custom</p>
              <p className="option-description">
                Input custom symbol e.g. kg, m, etc.
              </p>
            </SelectInputOption>
          </SelectInput>
        </div>
      </div>

      {dataSymbols && (
        <ErrorBoundary>
          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="kpi-data-type-select">
              Symbol
              <FormFieldInfo align="align-center">
                Specify the symbol of the unit of measure e.g. Currency can be
                NAD (Namibian Dollars).
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <select
                className="uk-select uk-form-small"
                id="kpi-data-type-select"
                value={measure.dataSymbol}
                onChange={(e) =>
                  setMeasure({ ...measure, dataSymbol: e.target.value })
                }
              >
                {dataSymbols.symbols.map((symbol) => {
                  return (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </ErrorBoundary>
      )}

      {dataType === "Custom" && (
        <ErrorBoundary>
          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="kpi-data-type-select">
              Symbol
              <FormFieldInfo align="align-center">
                Specify the symbol of the unit of measure e.g. Currency can be
                NAD (Namibian Dollars).
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <input
                id="kpi-symbol"
                className="uk-input uk-form-small"
                placeholder="Data-type symbol"
                value={measure.dataSymbol}
                onChange={(e) =>
                  setMeasure({ ...measure, dataSymbol: e.target.value })
                }
                required
              />
            </div>
          </div>
        </ErrorBoundary>
      )}

      {dataType !== "Date" && (
        <ErrorBoundary>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="kpi-baseline">
              Baseline ({measure.dataSymbol})
              <FormFieldInfo>
                Baseline is the actual performance of the previous years.
                Baseline can also be used as a benchmark to set realistic
                targets. Note: It doesn't contribute to the rating in any way.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <NumberInput
                id="kpi-baseline"
                className="uk-input uk-form-small"
                placeholder="KPI Baseline"
                value={measure.baseline}
                onChange={(value) =>
                  setMeasure({ ...measure, baseline: NumberInputValue(value) })
                }
              />
            </div>
          </div>

          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="kpi-target">
              Annual Target ({measure.dataSymbol})
              <FormFieldInfo>
                Targets are the desired level of performance for each measure
                for the current financial year.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <NumberInput
                id="kpi-target"
                className="uk-input uk-form-small"
                placeholder="KPI Target"
                value={measure.annualTarget}
                onChange={(value) =>
                  setMeasure({
                    ...measure,
                    annualTarget: NumberInputValue(value),
                    rating3: NumberInputValue(value),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="kpi-target">
              Target Date
              <FormFieldInfo align="align-center">
                Target date is the desired date on which the annual target will
                be achieved for each measure. NB: for most measures the target
                date will be the end of the financial year.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <input
                id="kpi-target"
                className="uk-input uk-form-small"
                placeholder="KPI Target Date"
                type="date"
                value={measure.targetDate}
                onChange={(e) =>
                  setMeasure({ ...measure, targetDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="uk-width-1-5">
            <label className="uk-form-label" htmlFor="kpi-rate1">
              Rating 1 ({measure.dataSymbol})
              <FormFieldInfo>
                Rating 1 is value used by the system to compute the the rating
                automatically, when reached the performance rating of the
                measure becomes one (1) on a five-point-scale.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <NumberInput
                id="kpi-rate1"
                className="uk-input uk-form-small"
                placeholder="KPI Rating 1"
                value={measure.rating1}
                onChange={(value) =>
                  setMeasure({
                    ...measure,
                    rating1: NumberInputValue(value),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="uk-width-1-5">
            <label className="uk-form-label" htmlFor="kpi-rate2">
              Rating 2 ({measure.dataSymbol})
              <FormFieldInfo>
                Rating 2 is value used by the system to compute the the rating
                automatically, when reached the performance rating of the
                measure becomes two (2) on a five-point-scale.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <NumberInput
                id="kpi-rate2"
                className="uk-input uk-form-small"
                placeholder="KPI Rating 2"
                value={measure.rating2}
                onChange={(value) =>
                  setMeasure({
                    ...measure,
                    rating2: NumberInputValue(value),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="uk-width-1-5">
            <label className="uk-form-label" htmlFor="kpi-rate3">
              Rating 3 ({measure.dataSymbol})
              <FormFieldInfo>
                Rating 3 is value used by the system to compute the the rating
                automatically, when reached the performance rating of the
                measure becomes three (3) on a five-point-scale.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <NumberInput
                id="kpi-rate3"
                className="uk-input uk-form-small"
                placeholder="KPI Rating 3"
                value={measure.rating3}
                onChange={(value) =>
                  setMeasure({
                    ...measure,
                    rating3: NumberInputValue(value),
                  })
                }
                required
                disabled
              />
            </div>
          </div>

          <div className="uk-width-1-5">
            <label className="uk-form-label" htmlFor="kpi-rate4">
              Rating 4 ({measure.dataSymbol})
              <FormFieldInfo>
                Rating 4 is value used by the system to compute the the rating
                automatically, when reached the performance rating of the
                measure becomes four (4) on a five-point-scale.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <NumberInput
                id="kpi-rate4"
                className="uk-input uk-form-small"
                placeholder="KPI Rating 4"
                value={measure.rating4}
                onChange={(value) =>
                  setMeasure({
                    ...measure,
                    rating4: NumberInputValue(value),
                  })
                }
              />
            </div>
          </div>

          <div className="uk-width-1-5">
            <label className="uk-form-label" htmlFor="kpi-rate5">
              Rating 5 ({measure.dataSymbol})
              <FormFieldInfo>
                Rating 5 is value used by the system to compute the the rating
                automatically, when reached the performance rating of the
                measure becomes five (5) on a five-point-scale.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <NumberInput
                id="kpi-rate5"
                className="uk-input uk-form-small"
                placeholder="KPI Rating 5"
                value={measure.rating5}
                onChange={(value) =>
                  setMeasure({
                    ...measure,
                    rating5: NumberInputValue(value),
                  })
                }
              />
            </div>
          </div>
        </ErrorBoundary>
      )}
      {dataType === "Date" && (
        <ErrorBoundary>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="kpi-baseline">
              Baseline
              <FormFieldInfo>
                Baseline is the actual performance of the previous years.
                Baseline can also be used as a benchmark to set realistic
                targets. Note: It doesn't contribute to the rating in any way.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <input
                id="kpi-baseline"
                className="uk-input uk-form-small"
                placeholder="KPI Baseline"
                type="date"
                value={dateFormat_YY_MM_DY(measure.baseline) || "yyyy/mm/dd"}
                onChange={(e) =>
                  setMeasure({
                    ...measure,
                    baseline: new Date(e.target.value).getTime(),
                  })
                }
              />
            </div>
          </div>

          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="kpi-target">
              Annual Target
              <FormFieldInfo>
                Targets are the desired level of performance for each measure
                for the current financial year.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <input
                id="kpi-target"
                className="uk-input uk-form-small"
                placeholder="KPI Annual Target"
                type="date"
                value={dateFormat_YY_MM_DY(measure.annualTarget)}
                onChange={(e) =>
                  setMeasure({
                    ...measure,
                    annualTarget: new Date(e.target.value).getTime(),
                    rating3: new Date(e.target.value).getTime(),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="kpi-target">
              Target Date
              <FormFieldInfo align="align-center">
                Target date is the desired date on which the annual target will
                be achieved for each measure. NB: for most measures the target
                date will be the end of the financial year.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <input
                id="kpi-target"
                className="uk-input uk-form-small"
                placeholder="KPI Target Date"
                type="date"
                value={measure.targetDate}
                onChange={(e) =>
                  setMeasure({ ...measure, targetDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="uk-width-1-3">
            <label className="uk-form-label" htmlFor="kpi-rate1">
              Rating 1
              <FormFieldInfo>
                Rating 1 is value used by the system to compute the the rating
                automatically, when reached the performance rating of the
                measure becomes one (1) on a five-point-scale.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <input
                id="kpi-rate1"
                className="uk-input uk-form-small"
                placeholder="KPI Rating 1"
                type="date"
                value={dateFormat_YY_MM_DY(measure.rating1)}
                onChange={(e) =>
                  setMeasure({
                    ...measure,
                    rating1: new Date(e.target.value).getTime(),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="uk-width-1-3">
            <label className="uk-form-label" htmlFor="kpi-rate2">
              Rating 2
              <FormFieldInfo>
                Rating 2 is value used by the system to compute the the rating
                automatically, when reached the performance rating of the
                measure becomes two (2) on a five-point-scale.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <input
                id="kpi-rate2"
                className="uk-input uk-form-small"
                placeholder="KPI Rating 2"
                type="date"
                value={dateFormat_YY_MM_DY(measure.rating2)}
                onChange={(e) =>
                  setMeasure({
                    ...measure,
                    rating2: new Date(e.target.value).getTime(),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="uk-width-1-3">
            <label className="uk-form-label" htmlFor="kpi-rate3">
              Rating 3
              <FormFieldInfo align="align-center">
                Rating 5 is value used by the system to compute the the rating
                automatically, when reached the performance rating of the
                measure becomes five (5) on a five-point-scale.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <input
                id="kpi-rate3"
                className="uk-input uk-form-small"
                placeholder="KPI Rating 3"
                type="date"
                value={dateFormat_YY_MM_DY(measure.rating3)}
                onChange={(e) =>
                  setMeasure({
                    ...measure,
                    rating3: new Date(e.target.value).getTime(),
                  })
                }
                required
                disabled
              />
            </div>
          </div>

          <div className="uk-width-1-3">
            <label className="uk-form-label" htmlFor="kpi-rate4">
              Rating 4
              <FormFieldInfo>
                Rating 4 is value used by the system to compute the the rating
                automatically, when reached the performance rating of the
                measure becomes four (4) on a five-point-scale.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <input
                id="kpi-rate4"
                className="uk-input uk-form-small"
                placeholder="KPI Rating 4"
                type="date"
                value={dateFormat_YY_MM_DY(measure.rating4)}
                onChange={(e) =>
                  setMeasure({
                    ...measure,
                    rating4: new Date(e.target.value).getTime(),
                  })
                }
              />
            </div>
          </div>

          <div className="uk-width-1-3">
            <label className="uk-form-label" htmlFor="kpi-rate5">
              Rating 5
              <FormFieldInfo>
                Rating 5 is value used by the system to compute the the rating
                automatically, when reached the performance rating of the
                measure becomes five (5) on a five-point-scale.
              </FormFieldInfo>
            </label>
            <div className="uk-form-controls">
              <input
                id="kpi-rate5"
                className="uk-input uk-form-small"
                placeholder="KPI Rating 5"
                type="date"
                value={dateFormat_YY_MM_DY(measure.rating5)}
                onChange={(e) =>
                  setMeasure({
                    ...measure,
                    rating5: new Date(e.target.value).getTime(),
                  })
                }
              />
            </div>
          </div>
        </ErrorBoundary>
      )}

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-activities">
          Key activities
          <FormFieldInfo>
            These are the tasks or activities that are planned in order to
            achieve the desired performance specified above.
          </FormFieldInfo>
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="kpi-activities"
            rows={2}
            placeholder="Write activities here."
            value={measure.activities}
            onChange={(e) =>
              setMeasure({ ...measure, activities: e.target.value })
            }
            required
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-ource-evidence">
          Source of evidence
          <FormFieldInfo>
            Source of evidence is the resource/file that contains exactly what
            is being measured. A good source of evidence should indicate the
            date clearly when the task was achieved and the level of performance
            that is being measured.
          </FormFieldInfo>
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="kpi-source-evidence"
            rows={2}
            placeholder="Source of evidence"
            value={measure.sourceOfEvidence}
            onChange={(e) =>
              setMeasure({ ...measure, sourceOfEvidence: e.target.value })
            }
            required
          />
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default MeasureForm;
