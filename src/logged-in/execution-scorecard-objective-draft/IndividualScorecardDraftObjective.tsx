import { useEffect, useMemo, useState } from "react";
import Toolbar from "../shared/components/toolbar/Toolbar";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId from "../../shared/functions/ModalShow";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import StrategicList from "./strategic-list/StrategicList";
import { IObjective } from "../../shared/models/Objective";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../shared/hooks/useTitle";
import WeightError from "../shared/components/weight-error/WeightError";
import useBackButton from "../../shared/hooks/useBack";
import React from "react";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";

// Lazy load modals
const MeasureModal = React.lazy(
  () => import("../dialogs/measure/MeasureModal")
);
const MeasureCommentsModal = React.lazy(
  () => import("../dialogs/measure-comments/MeasureCommentsModal")
);

const IndividualScorecardDraftObjective = observer(() => {
  const { store } = useAppContext();
  const { id: objectiveId } = useParams();

  const [_, setTitle] = useTitle(); // set page title
  const [objective, setObjective] = useState<IObjective | null>(null);

  const navigate = useNavigate();
  const { agreement, loading } = useIndividualScorecard();
  useBackButton("/c/scorecards/my/");

  const objectives = store.objective.allMe;

  const totalWeight = useMemo(
    () => objectives.reduce((acc, curr) => acc + (curr.asJson.weight || 0), 0),
    [objectives]
  );

  const enableEditing = () => {
    const isEditing =
      agreement.agreementDraft.status === "pending" ||
      agreement.agreementDraft.status === "in-progress" ||
      agreement.agreementDraft.status === "reverted";

    return !isEditing;
  };

  const handleNewMeasure = () => {
    store.objective.clearSelected(); // clear selected objective
    store.measure.clearSelected(); // clear selected measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_MODAL);
  };

  useEffect(() => {
    // Get objectives
    const getObjective = () => {
      const objective = objectives.find((o) => o.asJson.id === objectiveId);
      objective
        ? setObjective(objective.asJson)
        : navigate("/c/scorecards/my/");
    };

    getObjective();
  }, [objectives, navigate, objectiveId]);

  useEffect(() => {
    const setPageTitle = () => {
      objective
        ? setTitle(`Individual Scorecard | ${objective.description}`)
        : setTitle("Individual Scorecard");
    };
    setPageTitle();
  }, [objective, setTitle]);

  if (loading)
    return (
      <ErrorBoundary>
        <LoadingEllipsis />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="objective-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              rightControls={
                <ErrorBoundary>
                  <button
                    className="btn btn-primary"
                    onClick={handleNewMeasure}
                    disabled={enableEditing()}
                  >
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span> New
                    Measure
                  </button>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            {!store.objective.isEmpty && (
              <WeightError weightError={totalWeight} />
            )}
          </ErrorBoundary>

          <ErrorBoundary>
            {objective && <StrategicList objective={objective} />}
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_MODAL}>
          <MeasureModal />
        </Modal>

        <Modal
          modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MODAL}
          cssClass="uk-modal-container"
        >
          <MeasureCommentsModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default IndividualScorecardDraftObjective;
