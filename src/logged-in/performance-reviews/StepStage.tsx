import { IReviewCycleStatus } from "../../shared/models/ScorecardBatch";

interface IStepStageProps {
  open?: boolean;
  status?: IReviewCycleStatus;
  index: number;
  title: string;
  onClick?: () => void;
}
const StepStage = (props: IStepStageProps) => {
  const status = props.status || "pending";
  const open = props.open ? "open" : "closed";
  const className = `step--stage step--stage__${status} step--stage__${open}`;

  const handleClick = () => {
    if (props.onClick) props.onClick();
  };

  return (
    <button className={className} onClick={handleClick}>
      <div className="step--stage__bubble">
        <div className="step--stage__bubble__content">
          {status === "cancelled" && (
            <span className="icon" style={{ fontSize: "1.2rem" }}>
              ×
            </span>
          )}
          {(status === "pending" || status === "in-progress") && (
            <span className="icon" style={{ fontSize: "1.2rem" }}>
              ◔
            </span>
          )}
          {status === "approved" && (
            <span className="icon" data-uk-icon="check"></span>
          )}
        </div>
      </div>

      <div className="step--stage__content">
        <p className="label">STEP {props.index}</p>
        <h6 className="title">{props.title}</h6>
        <div className="status">
          {status === "cancelled" && "Cancelled"}
          {status === "pending" && "Pending"}
          {status === "in-progress" && "In Progress"}
          {status === "completed" && "Completed"}
        </div>
      </div>
    </button>
  );
};

export default StepStage;
