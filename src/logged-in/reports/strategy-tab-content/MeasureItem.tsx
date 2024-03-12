import { IMeasureCompany } from "../../../shared/models/MeasureCompany";
import Rating from "../../shared/components/rating/Rating";

interface IProps {
  measure: IMeasureCompany;
}
const MeasureItem = (props: IProps) => {
  const { measure } = props;

  return (
    <li className="red-measure">
      <div className="uk-flex uk-flex-middle">
        <Rating
          rate={measure.q4AutoRating || 1}
          isUpdated={measure.isUpdated}
        />
        <div className="uk-margin-left">{measure.description}</div>
      </div>
    </li>
  );
};

export default MeasureItem;
