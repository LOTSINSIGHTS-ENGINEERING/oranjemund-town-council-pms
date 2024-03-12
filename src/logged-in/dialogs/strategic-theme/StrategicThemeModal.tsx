import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";

import {
  IStrategicTheme,
  defaultStrategicTheme,
} from "../../../shared/models/StrategicTheme";
import MODAL_NAMES from "../ModalName";
import StrategicThemeForm from "./StrategicThemeForm";

const StrategicThemeModal = observer(() => {
  const { api, store } = useAppContext();
  const scorecard = store.scorecard.active;

  const [theme, setTheme] = useState<IStrategicTheme>({
    ...defaultStrategicTheme,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // start loading

    theme.scorecard = scorecard ? scorecard?.id : "";
    const theTheme = theme;

    const selected = store.strategicTheme.selected;

    if (selected) await update(theTheme);
    else {
      await create(theTheme);
    }

    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (theme: IStrategicTheme) => {
    try {
      await api.strategicTheme.update(theme);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const create = async (theme: IStrategicTheme) => {
    try {
      await api.strategicTheme.create(theme);
    } catch (error) {
      console.log("Failed to create> Error: ", error);
    }
  };

  const onCancel = () => {
    // clear selected strategicThemeBatch
    store.strategicTheme.clearSelected();
    // reset form
    setTheme({ ...defaultStrategicTheme });
    hideModalFromId(MODAL_NAMES.ADMIN.STRATEGIC_THEME_MODAL);
  };

  // if selected strategicThemeBatch, set form values
  useEffect(() => {
    if (store.strategicTheme.selected) {
      setTheme({ ...defaultStrategicTheme, ...store.strategicTheme.selected });
    }
  }, [store.strategicTheme.selected]);

  return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Strategic Goal</h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <StrategicThemeForm theme={theme} setTheme={setTheme} />

          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default StrategicThemeModal;
