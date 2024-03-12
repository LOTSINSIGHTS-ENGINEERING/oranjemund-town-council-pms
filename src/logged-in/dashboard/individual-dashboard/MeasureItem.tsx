import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import { IMeasure } from "../../../shared/models/Measure";
import MODAL_NAMES from "../../dialogs/ModalName";
import Rating from "../../shared/components/rating/Rating";

interface IProps {
  measure: IMeasure;
}
const MeasureItem = (props: IProps) => {
  const { store } = useAppContext();
  const { measure } = props;

  const handleUpdateMeasure = () => {
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_MODAL);
  };

  return (
    <li className="red-measure" onClick={handleUpdateMeasure}>
      <div className="uk-flex uk-flex-middle">
        <Rating rate={measure.autoRating} isUpdated={measure.isUpdated} />
        <div className="uk-margin-left">{measure.description}</div>
      </div>
    </li>
  );
};

export default MeasureItem;
