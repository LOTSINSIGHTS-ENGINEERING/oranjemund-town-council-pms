import { IMeasureDepartment } from "../../../shared/models/MeasureDepartment";
import Rating from "../../shared/components/rating/Rating";

interface IProps {
  measure: IMeasureDepartment;
}
const MeasureItem = (props: IProps) => {
  const { measure } = props;

  return (
    <li className="red-measure">
      <div className="uk-flex uk-flex-middle">
        <Rating rate={measure.q4AutoRating} isUpdated={measure.isUpdated} />
        <div className="uk-margin-left">{measure.description}</div>
      </div>
    </li>
  );
};

export default MeasureItem;
