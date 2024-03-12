import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultVM, IVisionMission } from "../../../shared/models/VisionMission";
import MODAL_NAMES from "../ModalName";
import VMForm from "./VMForm";

const VMModal = observer(() => {
  const { api, store } = useAppContext();

  const [vm, setVm] = useState<IVisionMission>({
    ...defaultVM,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const $vm = vm;
    const selected = store.visionmission.selected;

    if (selected) await update($vm);
    else await create($vm);
    setLoading(false);

    onCancel();
  };

  const update = async (vm: IVisionMission) => {
    try {
      await api.visionmission.update(vm);
    } catch (error) { }
  };

  const create = async (vm: IVisionMission) => {
    try {
      await api.visionmission.create(vm);
    } catch (error) { }
  };

  const onCancel = () => {
    store.visionmission.clearSelected();
    setVm({ ...defaultVM });
    hideModalFromId(MODAL_NAMES.ADMIN.VM_MODAL);
  };

  useEffect(() => {
    if (store.visionmission.selected) {
      setVm(store.visionmission.selected);
    }
  }, [store.visionmission.selected]);

  return (
    <div className="business-unit-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Vision & Mission</h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <VMForm vm={vm} setVm={setVm} />
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

export default VMModal;
