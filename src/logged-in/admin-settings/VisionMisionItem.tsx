import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { IVisionMission } from "../../shared/models/VisionMission";
import MODAL_NAMES from "../dialogs/ModalName";

interface IProps {
  vm: IVisionMission;
}
const VisionMisionItem = (props: IProps) => {
  const { vm } = props;
  const { api, store } = useAppContext();

  const handleEdit = () => {
    store.visionmission.select(vm); // set selected department
    showModalFromId(MODAL_NAMES.ADMIN.VM_MODAL); // show modal
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete?")) return; // TODO: confirmation dialog
    api.visionmission.delete(vm); // remove department
  };

  return (
    <div className="department uk-card uk-card-default uk-card-body uk-card-small">
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">Vision</span>
            {vm.vision}
            <br />
            <span className="span-label">Mission</span>
            {vm.mission}
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

export default VisionMisionItem;
