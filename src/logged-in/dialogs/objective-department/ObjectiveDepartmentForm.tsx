import React from "react";
import SingleSelect from "../../../shared/components/single-select/SingleSelect";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import { IObjective } from "../../../shared/models/Objective";
import ObjectiveCompany from "../../../shared/models/ObjectiveCompany";

interface IProps {
  companyObjectives: ObjectiveCompany[];
  objective: IObjective;
  setObjective: React.Dispatch<React.SetStateAction<IObjective>>;
}
const ObjectiveDepartmentForm = (props: IProps) => {
  const { companyObjectives, objective, setObjective } = props;

  const options = companyObjectives.map((objective) => ({
    value: objective.asJson.id,
    label: objective.asJson.description,
  }));

  const onParentChange = (val: string) => {
    const _ob = companyObjectives.map((co) => co.asJson);

    const found = _ob.find((o) => o.id === val);
    if (found) setObjective({ ...objective, parent: val, theme: found.theme });
  };

  return (
    <>
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
        <label className="uk-form-label" htmlFor="parent-objective-select">
          Which company strategic objective is this influencing?
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={options}
            value={objective.parent}
            onChange={onParentChange}
            required
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="objective-description">
          Contributary objective
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
            value={objective.weight || ""}
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

export default ObjectiveDepartmentForm;
