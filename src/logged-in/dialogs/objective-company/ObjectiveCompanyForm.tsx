import React from "react";
import SingleSelect from "../../../shared/components/single-select/SingleSelect";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import { IObjective } from "../../../shared/models/Objective";
import StrategicTheme from "../../../shared/models/StrategicTheme";

interface IProps {
  themes: StrategicTheme[];
  objective: IObjective;
  setObjective: React.Dispatch<React.SetStateAction<IObjective>>;
}
const ObjectiveCompanyForm = (props: IProps) => {
  const { objective, setObjective, themes } = props;

  const options = themes.map((theme) => ({
    value: theme.asJson.id,
    label: theme.asJson.description,
  }));

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="parent-objective-select">
          Strategic theme?
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={options}
            value={objective.theme}
            onChange={(val) => setObjective({ ...objective, theme: val })}
            required
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="objective-perspective">
          Perspective
        </label>
        <div className="uk-form-controls">
          <select
            className="uk-select uk-form-small"
            id="objective-perspective"
            value={objective.perspective}
            onChange={(e) =>
              setObjective({ ...objective, perspective: e.target.value })
            }
            required
          >
            <option value={FINANCIAL_TAB.id}>Financial</option>
            <option value={CUSTOMER_TAB.id}>Customer</option>
            <option value={PROCESS_TAB.id}>Internal Processes</option>
            <option value={GROWTH_TAB.id}>Learning &#38; Growth</option>
          </select>
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="objective-description">
          Objective
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="objective-description"
            rows={2}
            placeholder="Objective description"
            value={objective.description}
            onChange={(e) =>
              setObjective({ ...objective, description: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="objective-weight">
          Weight (%)
        </label>
        <div className="uk-form-controls">
          <input
            id="objective-weight"
            className="uk-input uk-form-small"
            type="number"
            min={0}
            max={100}
            placeholder="Objective weight (%)"
            value={objective.weight || 0}
            onChange={(e) =>
              setObjective({
                ...objective,
                weight: Number(e.target.value || 0),
              })
            }
            required
          />
          {/* <NumberFormat
            id="kpi-weight"
            className="uk-input uk-form-small"
            placeholder="Objective weight (%)"
            thousandsGroupStyle="thousand"
            displayType="input"
            decimalSeparator="."
            type="text"
            value={objective.weight}
            onValueChange={(val) =>
              setObjective({ ...objective, weight: val.floatValue || 0 })
            }
            thousandSeparator
            allowNegative
            required
            min={0}
            max={100}
          /> */}
        </div>
      </div>
    </>
  );
};

export default ObjectiveCompanyForm;
