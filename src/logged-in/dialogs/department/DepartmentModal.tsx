import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultDepartment, IDepartment } from "../../../shared/models/Department";
import MODAL_NAMES from "../ModalName";
import DepartmentForm from "./DepartmentForm";

const DepartmentModal = observer(() => {
  const { api, store } = useAppContext();

  const [department, setDepartment] = useState<IDepartment>({
    ...defaultDepartment,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // start loading

    const depart = department;
    // if selected department, update
    const selected = store.department.selected;

    if (selected) await update(depart);
    else await create(depart);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (department: IDepartment) => {
    try {
      await api.department.update(department);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const create = async (department: IDepartment) => {
    try {
      await api.department.create(department);
    } catch (error) {
      console.log("Failed to create> Error: ", error);
    }
  };

  const onCancel = () => {
    // clear selected department
    store.department.clearSelected();
    // reset form
    setDepartment({ ...defaultDepartment });
    // hide modal
    hideModalFromId(MODAL_NAMES.ADMIN.DEPARTMENT_MODAL);
  };

  // if selected department, set form values
  useEffect(() => {
    if (store.department.selected) {
      setDepartment(store.department.selected);
    }
  }, [store.department.selected]);

  return (
    <div className="department-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Department</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          onSubmit={handleSubmit}
          data-uk-grid
        >
          <DepartmentForm
            department={department}
            setDepartment={setDepartment}
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

export default DepartmentModal;
