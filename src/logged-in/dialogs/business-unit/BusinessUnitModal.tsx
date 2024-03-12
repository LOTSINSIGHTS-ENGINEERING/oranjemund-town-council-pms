import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultBusinessUnit, IBusinessUnit } from "../../../shared/models/BusinessUnit";
import MODAL_NAMES from "../ModalName";
import BusinessUnitForm from "./BusinessUnitForm";

const BusinessUnitModal = observer(() => {
  const { api, store } = useAppContext();

  const [businessUnit, setbusinessUnit] = useState<IBusinessUnit>({
    ...defaultBusinessUnit,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // start loading

    const depart = businessUnit;
    // if selected businessUnit, update
    const selected = store.businessUnit.selected;

    if (selected) await update(depart);
    else await create(depart);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (businessUnit: IBusinessUnit) => {
    try {
      await api.businessUnit.update(businessUnit);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const create = async (businessUnit: IBusinessUnit) => {
    try {
      await api.businessUnit.create(businessUnit);
    } catch (error) {
      console.log("Failed to create> Error: ", error);
    }
  };

  const onCancel = () => {
    // clear selected business unit
    store.businessUnit.clearSelected();
    // reset form
    setbusinessUnit({ ...defaultBusinessUnit });
    // hide modal
    hideModalFromId(MODAL_NAMES.ADMIN.BUSINESS_UNIT_MODAL);
  };

  // if selected businessUnit, set form values
  useEffect(() => {
    if (store.businessUnit.selected) {
      setbusinessUnit(store.businessUnit.selected);
    }
  }, [store.businessUnit.selected]);

  return (
    <div className="business-unit-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Business Unit</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <BusinessUnitForm
            businessUnit={businessUnit}
            setbusinessUnit={setbusinessUnit}
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

export default BusinessUnitModal;
