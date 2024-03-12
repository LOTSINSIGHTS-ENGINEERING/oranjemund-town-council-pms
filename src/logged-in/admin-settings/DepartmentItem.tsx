import React from "react";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { IDepartment } from "../../shared/models/Department";
import MODAL_NAMES from "../dialogs/ModalName";

interface IProps {
  department: IDepartment;
}
const DepartmentItem = (props: IProps) => {
  const { department } = props;
  const { api, store } = useAppContext();

  const handleEdit = () => {
    store.department.select(department); // set selected department
    showModalFromId(MODAL_NAMES.ADMIN.DEPARTMENT_MODAL); // show modal
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove department?")) return; // TODO: confirmation dialog
    api.department.delete(department); // remove department
  };

  return (
    <div className="department uk-card uk-card-default uk-card-body uk-card-small">
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">Name</span>
            {department.name}
          </h6>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-auto@m uk-text-center">
          <div className="controls">
            <button
              className="btn-icon uk-margin-small-right"
              onClick={handleEdit}
            >
              <span uk-icon="pencil"></span>
            </button>
            <button className="btn-icon" onClick={handleDelete}>
              <span uk-icon="trash"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentItem;
