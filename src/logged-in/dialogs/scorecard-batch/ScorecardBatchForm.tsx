import React from "react";
import { IScorecardBatch } from "../../../shared/models/ScorecardBatch";

interface IProps {
  batch: IScorecardBatch;
  setBatch: React.Dispatch<React.SetStateAction<IScorecardBatch>>;
}
const ScorecardBatchForm = (props: IProps) => {
  const { batch, setBatch } = props;

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="business-unit-fname">
          Name
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="business-unit-fname"
            type="text"
            placeholder="Name e.g. '2020-2021'"
            value={batch.description}
            onChange={(e) =>
              setBatch({ ...batch, description: e.target.value })
            }
          />
        </div>
      </div>
    </>
  );
};

export default ScorecardBatchForm;
