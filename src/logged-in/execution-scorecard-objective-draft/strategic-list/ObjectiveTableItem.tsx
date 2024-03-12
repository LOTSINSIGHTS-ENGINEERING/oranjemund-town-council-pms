import { observer } from "mobx-react-lite";
import Dropdown from "../../../shared/components/dropdown/Dropdown";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import { fullPerspectiveName } from "../../../shared/interfaces/IPerspectiveTabs";
import { IObjective } from "../../../shared/models/Objective";
import MODAL_NAMES from "../../dialogs/ModalName";
import Rating from "../../shared/components/rating/Rating";

interface IProps {
  objective: IObjective;
  rating: number;
  children?: React.ReactNode;
}
const ObjectiveTableItem = observer((props: IProps) => {
  const { rating, objective, children } = props;
  const { api, store } = useAppContext();

  const handleEdit = () => {
    store.objective.select(objective);
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL);
  };

  const handleRemove = async () => {
    if (!window.confirm("Remove objective?")) return;
    await removeAllMeasures();
    await api.objective.delete(objective);
  };

  const removeAllMeasures = async () => {
    for (const measure of store.measure.all) {
      if (measure.asJson.objective === objective.id) {
        await api.measure.delete(measure.asJson);
      }
    }
  };

  return (
    <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
      <div className="uk-flex uk-flex-middle">
        <div className="uk-margin-right">
          <Rating rate={rating} />
        </div>
        <h3 className="objective-name uk-width-1-1">
          {objective.description}{" "}
          <span className="objective-persepctive">
            {fullPerspectiveName(objective.perspective)}
          </span>
        </h3>

        <>
          <button className="btn-icon">
            <span uk-icon="icon: more-vertical; ratio: .8"></span>
          </button>
          <Dropdown pos="bottom-right">
            <li>
              <button onClick={handleEdit}>
                <span
                  className="uk-margin-small-right"
                  data-uk-icon="pencil"
                ></span>
                Edit Objective
              </button>
            </li>
            <li>
              <button onClick={handleRemove}>
                <span
                  className="uk-margin-small-right"
                  data-uk-icon="trash"
                ></span>
                Remove Objective
              </button>
            </li>
          </Dropdown>
        </>
      </div>

      <div className="uk-margin">{children}</div>
    </div>
  );
});

export default ObjectiveTableItem;
