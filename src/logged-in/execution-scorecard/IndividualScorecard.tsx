import { useEffect, useMemo, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import ScorecardModal from "../dialogs/view-past-scorecards/ScorecardModal";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import StrategicMapObjectiveModal from "../dialogs/strategic-map-objective/StrategicMapObjectiveModal";
import useBackButton from "../../shared/hooks/useBack";
import { IReviewCycleStatus, IReviewCycleType } from "../../shared/models/ScorecardBatch";
import { QUARTER4_TAB, SCORECARD_TAB, QUARTER2_TAB } from "../../shared/interfaces/IReviewCycleTabs";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";
import IndividualScorecardQ4Cycle from "./IndividualScorecardQ4Cycle";
import IndividualScorecardQ2Cycle from "./IndividualScorecardQ2Cycle";
import IndividualScorecardDraftCycle from "./IndividualScorecardDraftCycle";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import MeasureCommentsModal from "../dialogs/measure-comments/MeasureCommentsModal";
import ReadScorecardCommentModal from "../dialogs/read-scorecard-comment/ReadScorecardCommentModal";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";

interface IStepStageProps {
  open?: boolean;
  status?: IReviewCycleStatus;
  index: number;
  title: IReviewCycleType;
  tooltip?: string;
  setReviewCycle: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
}



const StepStage = (props: IStepStageProps) => {
  const status = props.status || "pending";
  const open = props.open ? "open" : "closed";
  const className = `step--stage step--stage__${status} step--stage__${open}`;

  return (
    <ErrorBoundary>
      <button
        className={className}
        onClick={() => props.setReviewCycle(props.title)}
        title={props.tooltip || props.title}
      >
        <div className="step--stage__bubble">
          <div className="step--stage__bubble__content">
            {status === "pending" && (
              <span className="icon" style={{ fontSize: "1.2rem" }}>
                ◔
              </span>
            )}
            {status === "in-progress" && (
              <span className="icon" style={{ fontSize: "1.2rem" }}></span>
            )}
            {status === "submitted" && (
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
          <p className="label">
            STEP {props.index} {status}
          </p>
          <h6 className="title">{props.title}</h6>
        </div>
      </button>
    </ErrorBoundary>
  );
};

interface IReviewStepProps {
  reviewCycle: IReviewCycleType;
  setReviewCycle: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
  agreement: IScorecardMetadata;
}
const ReviewCycleTabs = observer((props: IReviewStepProps) => {
  const { reviewCycle, setReviewCycle, agreement } = props;
  // const { agreement } = useIndividualScorecard();
  const { agreementDraft, quarter2Review, quarter4Review } = agreement;

  const cycle: IReviewCycleType = useMemo(() => {
    // Agreement statues => Draft, Midterm and Final
    const ads = agreementDraft.status;
    const ams = quarter2Review.status;

    // Scorecard
    if (ads === "pending" || ads === "submitted") return "Scorecard";
    else if (
      ads === "approved" &&
      (ams === "pending" || ams === "in-progress" || ams === "submitted")
    )
      return "Midterm Reviews";
    else if (ams === "approved") return "Assessment";
    else return "Scorecard";
  }, [agreementDraft.status, quarter2Review.status]);

  useEffect(() => {
    setReviewCycle(cycle);
  }, [cycle, setReviewCycle]);

  return (
    <ErrorBoundary>
      <div className="step">
        <StepStage
          index={1}
          title={SCORECARD_TAB.name}
          status={agreementDraft.status}
          open={reviewCycle === SCORECARD_TAB.name}
          setReviewCycle={setReviewCycle}
          tooltip="Draft your scorecard"
        />
        <StepStage
          index={2}
          title={QUARTER2_TAB.name}
          status={quarter2Review.status}
          open={reviewCycle === QUARTER2_TAB.name}
          setReviewCycle={setReviewCycle}
          tooltip="Update your midterm progress"
        />
        <StepStage
          index={3}
          title={QUARTER4_TAB.name}
          status={quarter4Review.status}
          open={reviewCycle === QUARTER4_TAB.name}
          setReviewCycle={setReviewCycle}
          tooltip="Update your final progress"
        />
      </div>
    </ErrorBoundary>
  );
});

const IndividualScorecard = observer(() => {
  const { store } = useAppContext();
  const [cycle, setCycle] = useState<IReviewCycleType>(SCORECARD_TAB.name);
  const { agreement } = useIndividualScorecard();

  const title = store.scorecard.active ? `Individual Scorecard ${store.scorecard.active?.description}` : "Individual Scorecard";
  useTitle(title); // set page title
  useBackButton();

  return (
    <ErrorBoundary>
      <ErrorBoundary>
        <div className="scorecard-page">
          <ReviewCycleTabs
            agreement={agreement}
            reviewCycle={cycle}
            setReviewCycle={setCycle}
          />
        </div>
      </ErrorBoundary>

      <ErrorBoundary>
        {cycle === SCORECARD_TAB.name && <IndividualScorecardDraftCycle />}
        {cycle === QUARTER2_TAB.name && <IndividualScorecardQ2Cycle />}
        {cycle === QUARTER4_TAB.name && <IndividualScorecardQ4Cycle />}
      </ErrorBoundary>

      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MODAL} cssClass="uk-modal-container">
          <MeasureCommentsModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.SCORECARD_MODAL}>
          <ScorecardModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MAP_OVERVIEW_MODAL} cssClass="uk-modal-container">
          <StrategicMapObjectiveModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.READ_SCORECARD_COMMENT_MODAL}>
          <ReadScorecardCommentModal agreement={agreement} />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default IndividualScorecard;
