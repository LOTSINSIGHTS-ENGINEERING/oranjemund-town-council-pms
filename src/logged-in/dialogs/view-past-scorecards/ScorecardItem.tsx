import { observer } from "mobx-react-lite";
import { IScorecardBatch } from "../../../shared/models/ScorecardBatch";

interface IScorecardItemProps {
  activeScorecard: IScorecardBatch | null;
  scorecard: IScorecardBatch;
  onSelect: (scorecard: IScorecardBatch) => void;
}
const ScorecardItem = observer((props: IScorecardItemProps) => {
  const { activeScorecard, scorecard, onSelect } = props;
  const { active, description } = scorecard;

  const activeCss = activeScorecard && activeScorecard.id === scorecard.id ? "active" : "";
  const currentCss = active ? "current" : "";

  const toggleActive = () => {
    onSelect(scorecard);
  };

  return (
    <div
      className={`scorecard-item uk-card uk-card-default uk-card-small uk-card-body uk-margin ${activeCss} ${currentCss}`}
      onClick={toggleActive}
    >
      {active && <p>Current Scorecard</p>}
      <h6 className="description">{description}</h6>
      <span className="icon" data-uk-icon="check"></span>
    </div>
  );
});

export default ScorecardItem;
