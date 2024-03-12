import React from "react";
import { IStrategicTheme } from "../../../shared/models/StrategicTheme";

interface IProps {
  theme: IStrategicTheme;
  setTheme: React.Dispatch<React.SetStateAction<IStrategicTheme>>;
}
const StrategicThemeForm = (props: IProps) => {
  const { theme, setTheme } = props;

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="strategic-theme">
          Description
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="strategic-theme"
            type="text"
            placeholder="Company Strategic Goal"
            value={theme.description}
            onChange={(e) =>
              setTheme({ ...theme, description: e.target.value })
            }
          />
        </div>
      </div>
    </>
  );
};

export default StrategicThemeForm;
