import React from "react";
import { IVisionMission } from "../../../shared/models/VisionMission";

interface IProps {
  vm: IVisionMission;
  setVm: React.Dispatch<React.SetStateAction<IVisionMission>>;
}
const VMForm = (props: IProps) => {
  const { vm, setVm } = props;

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="business-unit-fname">
          Vision
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="business-unit-fname"
            type="text"
            placeholder="Vision"
            value={vm.vision}
            onChange={(e) => setVm({ ...vm, vision: e.target.value })}
            required
          />
          <label className="uk-form-label" htmlFor="business-unit-fname">
            Mission
          </label>
          <input
            className="uk-input uk-form-small"
            id="business-unit-fname"
            type="text"
            placeholder="Mission"
            value={vm.mission}
            onChange={(e) => setVm({ ...vm, mission: e.target.value })}
            required
          />
        </div>
      </div>
    </>
  );
};

export default VMForm;
