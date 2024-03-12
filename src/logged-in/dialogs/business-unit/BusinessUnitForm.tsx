import React from "react";
import { IBusinessUnit } from "../../../shared/models/BusinessUnit";

interface IProps {
  businessUnit: IBusinessUnit;
  setbusinessUnit: React.Dispatch<React.SetStateAction<IBusinessUnit>>;
}
const BusinessUnitForm = (props: IProps) => {
  const { businessUnit, setbusinessUnit } = props;

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
            placeholder="Name"
            value={businessUnit.name}
            onChange={(e) =>
              setbusinessUnit({ ...businessUnit, name: e.target.value })
            }
            required
          />
        </div>
      </div>
    </>
  );
};

export default BusinessUnitForm;
