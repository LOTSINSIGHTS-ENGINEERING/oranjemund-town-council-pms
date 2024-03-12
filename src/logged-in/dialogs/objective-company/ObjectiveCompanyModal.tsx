import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultObjective, IObjective } from "../../../shared/models/Objective";
import MODAL_NAMES from "../ModalName";
import ObjectiveCompanyForm from "./ObjectiveCompanyForm";

const ObjectiveCompanyModal = observer(() => {
  const { api, store } = useAppContext();
  const [objective, setObjective] = useState(defaultObjective);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const me = store.auth.meJson; //my user account
    if (!me) return; //TODO: alert invalid uid.

    setLoading(true); // start loading
    const $objective = objective;

    // update objective uid && userName
    $objective.uid = me.uid;
    $objective.userName = me.displayName || "";

    // if selected objective, update
    const selected = store.companyObjective.selected;

    if (selected) await update($objective);
    else await create($objective);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (objective: IObjective) => {
    try {
      await api.companyObjective.update(objective);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const create = async (objective: IObjective) => {
    try {
      await api.companyObjective.create(objective);
    } catch (error) {
      console.log("Failed to create> Error: ", error);
    }
  };

  const onCancel = () => {
    // clear  selected objective
    store.companyObjective.clearSelected();
    // reset form
    setObjective({ ...defaultObjective });
    hideModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL);
  };

  useEffect(() => {
    const loadThemes = async () => {
      api.strategicTheme.getAll("");
      store.strategicTheme.load();
    };
    loadThemes();
  }, [api.strategicTheme, store.strategicTheme]);

  useEffect(() => {
    // if selected objective, set form values
    if (store.companyObjective.selected) {
      setObjective({
        ...store.companyObjective.selected,
      });
    }
    // no selected objective
    if (!store.companyObjective.selected) {
      setObjective({ ...defaultObjective });
    }
  }, [store.companyObjective.selected]);

  return (
    <div className="objective-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Objective</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <ObjectiveCompanyForm
            themes={store.strategicTheme.all}
            objective={objective}
            setObjective={setObjective}
          />

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

export default ObjectiveCompanyModal;
