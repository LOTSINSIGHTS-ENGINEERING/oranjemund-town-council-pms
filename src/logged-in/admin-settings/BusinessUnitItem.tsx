import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { IBusinessUnit } from "../../shared/models/BusinessUnit";
import MODAL_NAMES from "../dialogs/ModalName";

interface IProps {
  businessUnit: IBusinessUnit;
}
const BusinessUnitItem = (props: IProps) => {
  const { businessUnit } = props;
  const { api, store } = useAppContext();

  const handleEdit = () => {
    // set selected business unit
    store.businessUnit.selected = businessUnit;
    // show modal
    showModalFromId(MODAL_NAMES.ADMIN.BUSINESS_UNIT_MODAL);
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove business unit?")) return; // TODO: confirmation dialog
    // remove business unit
    api.businessUnit.delete(businessUnit);
  };

  return (
    <div className="business-unit uk-card uk-card-default uk-card-body uk-card-small">
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">Name</span>
            {businessUnit.name}
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

export default BusinessUnitItem;
