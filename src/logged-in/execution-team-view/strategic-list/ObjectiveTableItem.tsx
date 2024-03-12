import { observer } from "mobx-react-lite";
import { fullPerspectiveName } from "../../../shared/interfaces/IPerspectiveTabs";
import { IObjective } from "../../../shared/models/Objective";
import Rating from "../../shared/components/rating/Rating";

interface IProps {
  objective: IObjective;
  isUpdated: boolean;
  rating: number;
  children?: React.ReactNode;
}
const ObjectiveTableItem = observer((props: IProps) => {
  const { rating, isUpdated, objective, children } = props;

  return (
    <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
      <div className="uk-flex uk-flex-middle">
        <div className="uk-margin-right">
          <Rating rate={rating} isUpdated={isUpdated} />
        </div>
        <h3 className="objective-name uk-width-1-1">
          {objective.description}{" "}
          <span className="objective-persepctive">
            {fullPerspectiveName(objective.perspective)}
          </span>
        </h3>
      </div>

      <div className="uk-margin">{children}</div>
    </div>
  );
});

export default ObjectiveTableItem;
