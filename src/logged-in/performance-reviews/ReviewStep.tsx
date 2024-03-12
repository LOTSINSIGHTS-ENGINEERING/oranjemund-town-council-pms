import React from "react";
import { IReviewCycleType, IScorecardBatch} from "../../shared/models/ScorecardBatch";
import StepStage from "./StepStage";

interface IReviewStepProps {
  openStage: IReviewCycleType;
  setOpenStage: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
  batch: IScorecardBatch;
}
const ReviewStep = (props: IReviewStepProps) => {
  const { openStage, setOpenStage, batch } = props;
  const {
    draftReview,
    quarter1Review,
    midtermReview,
    quarter3Review,
    finalAssessment,
  } = batch;

  const isOpen = (stage: string) => openStage === stage;

  return (
    <div className="step uk-card uk-card-default uk-card-body uk-card-small uk-margin">
      <StepStage
        index={1}
        title={"Scorecard"}
        open={isOpen("Scorecard")}
        status={draftReview.status}
        onClick={() => setOpenStage("Scorecard")}
      />
      <StepStage
        index={2}
        title={"Q1 Reviews"}
        open={isOpen("Q1 Reviews")}
        status={quarter1Review.status}
        onClick={() => setOpenStage("Q1 Reviews")}
      />
      <StepStage
        index={3}
        title={"Midterm Reviews (Q2)"}
        open={isOpen("Midterm Reviews")}
        status={midtermReview.status}
        onClick={() => setOpenStage("Midterm Reviews")}
      />
      <StepStage
        index={4}
        title={"Q3 Reviews"}
        open={isOpen("Q3 Reviews")}
        status={quarter3Review.status}
        onClick={() => setOpenStage("Q3 Reviews")}
      />
      <StepStage
        index={5}
        title={"Assessment (Q4)"}
        open={isOpen("Assessment")}
        status={finalAssessment.status}
        onClick={() => setOpenStage("Assessment")}
      />
    </div>
  );
};

export default ReviewStep;
