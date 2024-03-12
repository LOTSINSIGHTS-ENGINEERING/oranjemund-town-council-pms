import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { IStrategicTheme } from "../../shared/models/StrategicTheme";
import MODAL_NAMES from "../dialogs/ModalName";

interface IProps {
  theme: IStrategicTheme;
}
const StrategicThemeItem = observer((props: IProps) => {
  const { theme } = props;
  const { api, store } = useAppContext();

  const handleEdit = () => {
    store.strategicTheme.selected = theme;
    showModalFromId(MODAL_NAMES.ADMIN.STRATEGIC_THEME_MODAL);
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove strategic theme?")) return;
    api.strategicTheme.delete(theme);
  };

  return (
    <div className="business-unit uk-card uk-card-default uk-card-body uk-card-small">
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">Name</span>
            {theme.description}
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
});

export default StrategicThemeItem;
