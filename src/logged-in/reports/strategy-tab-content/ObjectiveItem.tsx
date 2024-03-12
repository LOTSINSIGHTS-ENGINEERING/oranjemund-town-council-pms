import { useAppContext } from "../../../shared/functions/Context";
import { IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";
import Rating from "../../shared/components/rating/Rating";
import { totalFinalIndividualObjectiveRating } from "../../shared/functions/Scorecard";

interface IProps {
  objective: IObjective;
}
const ObjectiveItem = (props: IProps) => {
  const { store } = useAppContext();

  const { objective } = props;

  // calculate rating
  const calculateRating = () => {
    const measures = getMeasures(objective);
    const measuresUpdated =
      measures.filter((measure) => measure.isUpdated).length > 0;
    const rating = totalFinalIndividualObjectiveRating(measures);
    return {
      rate: rating || 1,
      isUpdated: measuresUpdated,
    };
  };

  const getMeasures = (objective: IObjective): IMeasure[] => {
    return store.measure.all
      .filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  };

  return (
    <li className="objective">
      <div className="uk-flex uk-flex-middle">
        <Rating
          rate={calculateRating().rate}
          isUpdated={calculateRating().isUpdated}
        />
        <div className="uk-margin-left">{objective.description}</div>
      </div>
    </li>
  );
};

export default ObjectiveItem;
