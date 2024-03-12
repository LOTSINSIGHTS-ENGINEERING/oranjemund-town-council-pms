import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { rateColor } from "../../shared/functions/Scorecard";

interface IProps {
  rating: number;
}
const StatusDirection = (props: IProps) => {
  const { rating } = props;
  const rateCss = rateColor(rating, true);

  const direction = () => {
    if (rating < 2) return "down";
    else if (rating >= 3) return "up";
    else return "steady";
  };

  return (
    <ErrorBoundary>
      <span className={`icon ${rateCss}`}>
        {direction() === "up" && <span data-uk-icon="icon: arrow-up"></span>}
        {direction() === "down" && (
          <span data-uk-icon="icon: arrow-down"></span>
        )}
        {direction() === "steady" && (
          <span data-uk-icon="icon: arrow-right"></span>
        )}
      </span>
    </ErrorBoundary>
  );
};

export default StatusDirection;
