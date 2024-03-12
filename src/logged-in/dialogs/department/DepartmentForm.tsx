import { observer } from "mobx-react-lite";
import React from "react";
import SingleSelect from "../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../shared/functions/Context";
import { IDepartment } from "../../../shared/models/Department";

interface IProps {
  department: IDepartment;
  setDepartment: React.Dispatch<React.SetStateAction<IDepartment>>;
}
const DepartmentForm = observer((props: IProps) => {
  const { store } = useAppContext();

  const { department, setDepartment } = props;

  const buOptions = store.businessUnit.all.map((bu) => ({
    label: bu.asJson.name,
    value: bu.asJson.id,
  }));

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="department-fname">
          Name
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="department-fname"
            type="text"
            placeholder="Name e.g. ICT"
            value={department.name}
            onChange={(e) =>
              setDepartment({ ...department, name: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="department-business-unit">
          Business Unit
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={buOptions}
            name="department-business-unit"
            value={department.businessUnit}
            onChange={(value) =>
              setDepartment({ ...department, businessUnit: value })
            }
            placeholder="Select a business unit"
            required
          />
        </div>
      </div>
    </>
  );
});

export default DepartmentForm;
