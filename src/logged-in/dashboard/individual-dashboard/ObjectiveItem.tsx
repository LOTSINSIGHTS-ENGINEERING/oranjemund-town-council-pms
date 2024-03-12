import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import Objective from "../../../shared/models/Objective";
import MODAL_NAMES from "../../dialogs/ModalName";
import Rating from "../../shared/components/rating/Rating";

interface IProps {
  objective: Objective;
}
const ObjectiveItem = (props: IProps) => {
  const { store } = useAppContext();
  const { objective } = props;
  const { rate, isUpdated } = objective.rating;
  const handleObjective = () => {
    store.objective.select(objective.asJson);
    showModalFromId(MODAL_NAMES.EXECUTION.MAP_OVERVIEW_MODAL);
  };

  return (
    <li className="objective" onClick={handleObjective}>
      <div className="uk-flex uk-flex-middle">
        <Rating rate={rate} isUpdated={isUpdated} />
        <div className="uk-margin-left">{objective.asJson.description}</div>
      </div>
    </li>
  );
};

export default ObjectiveItem;
