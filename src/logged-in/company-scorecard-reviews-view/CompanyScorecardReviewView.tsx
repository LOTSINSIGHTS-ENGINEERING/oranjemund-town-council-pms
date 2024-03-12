import { useEffect, useMemo, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import ObjectiveDepartmentModal from "../dialogs/objective-department/ObjectiveDepartmentModal";
import useBackButton from "../../shared/hooks/useBack";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { SCORECARD_TAB, QUARTER1_TAB, QUARTER2_TAB, QUARTER3_TAB, QUARTER4_TAB } from "../../shared/interfaces/IReviewCycleTabs";
import { IReviewCycleStatus, IReviewCycleType } from "../../shared/models/ScorecardBatch";
import CompanyScorecardDraftCycle from "./CompanyScorecardDraftCycle";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import CompanyScorecardQ1Cycle from "./CompanyScorecardQ1Cycle";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { exportCompanyExcelScorecard } from "../shared/functions/Excel";
import { generateCompanyPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import CompanyScorecardQ2Cycle from "./CompanyScorecardQ2Cycle";
import CompanyScorecardQ3Cycle from "./CompanyScorecardQ3Cycle";
import CompanyScorecardQ4Cycle from "./CompanyScorecardQ4Cycle";
import useCompanyScorecardMetadata from "../../shared/hooks/useCompanyScorecardMetadata";
import useVM from "../../shared/hooks/useVM";

interface IStepStageProps {
  open?: boolean;
  status?: IReviewCycleStatus;
  index: number;
  title: IReviewCycleType;
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
            {(status === "reverted" || status === "cancelled") && (
              <span className="icon" style={{ fontSize: "1.2rem" }}>
                ×
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
  agreement: IScorecardMetadata;
  reviewCycle: IReviewCycleType;
  setReviewCycle: React.Dispatch<React.SetStateAction<IReviewCycleType>>;
}
const ReviewCycleTabs = observer((props: IReviewStepProps) => {
  const { agreement, reviewCycle, setReviewCycle } = props;

  const {
    agreementDraft,
    quarter1Review,
    quarter2Review,
    quarter3Review,
    quarter4Review,
  } = agreement;

  const cycle: IReviewCycleType = useMemo(() => {
    // Agreement statues => Draft, Q1 Review, Q2 Review, Q3 Review and Q4 Review
    const ads = agreementDraft.status;
    const q1r = quarter1Review.status;
    const q2r = quarter2Review.status;
    const q3r = quarter3Review.status;

    // Scorecard
    if (ads === "pending" || ads === "submitted") return "Scorecard";
    else if (
      ads === "approved" &&
      (q1r === "pending" || q1r === "in-progress" || q1r === "submitted")
    )
      return "Q1 Reviews";
    else if (
      q1r === "approved" &&
      (q2r === "pending" || q2r === "in-progress" || q2r === "submitted")
    )
      return "Midterm Reviews";
    else if (
      q2r === "approved" &&
      (q3r === "pending" || q3r === "in-progress" || q3r === "submitted")
    )
      return "Q3 Reviews";
    else if (q3r === "approved") return "Assessment";
    else return "Scorecard";
  }, [
    agreementDraft.status,
    quarter1Review.status,
    quarter2Review.status,
    quarter3Review.status,
  ]);

  useEffect(() => {
    setReviewCycle(cycle);
  }, [cycle, setReviewCycle]);

  return (
    <div className="step">
      <StepStage
        index={1}
        title={SCORECARD_TAB.name}
        status={agreementDraft.status}
        open={reviewCycle === SCORECARD_TAB.name}
        setReviewCycle={setReviewCycle}
      />
      <StepStage
        index={2}
        title={QUARTER1_TAB.name}
        status={quarter1Review.status}
        open={reviewCycle === QUARTER1_TAB.name}
        setReviewCycle={setReviewCycle}
      />
      <StepStage
        index={3}
        title={QUARTER2_TAB.name}
        status={quarter2Review.status}
        open={reviewCycle === QUARTER2_TAB.name}
        setReviewCycle={setReviewCycle}
      />
      <StepStage
        index={4}
        title={QUARTER3_TAB.name}
        status={quarter3Review.status}
        open={reviewCycle === QUARTER3_TAB.name}
        setReviewCycle={setReviewCycle}
      />
      <StepStage
        index={5}
        title={QUARTER4_TAB.name}
        status={quarter4Review.status}
        open={reviewCycle === QUARTER4_TAB.name}
        setReviewCycle={setReviewCycle}
      />
    </div>
  );
});

const CompanyScorecardReviewView = observer(() => {
  const { api, store, ui } = useAppContext();
  const { fyid } = useParams();
  const scorecard = store.scorecard.getById(`${fyid}`); // scorecard.
  const agreement = useCompanyScorecardMetadata(`${fyid}`);
  const { vision, mission } = useVM();

  const objectives = store.companyObjective.all;

  const role = store.auth.role;

  // USER_ROLES.DIRECTOR_USER
  const hasAccess = useMemo(
    () => role === USER_ROLES.SUPER_USER || role === USER_ROLES.DIRECTOR_USER,
    [role]
  );

  const [_, setTitle] = useTitle(); // set page title
  const [cycle, setCycle] = useState<IReviewCycleType>(SCORECARD_TAB.name);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useBackButton("/c/strategy/company-review/");

  // Export reports
  const handleExportPDF = async () => {
    if (!scorecard) return;
    const title = `Company Scorecard ${scorecard.asJson.description}`;
    const strategicObjectives =
      store.companyObjective.all.map((o) => o.asJson) || [];
    const measures = store.companyMeasure.all.map((o) => o.asJson) || [];

    try {
      generateCompanyPerformanceAgreementPDF(
        title,
        vision,
        mission,
        strategicObjectives,
        measures
      );
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export company scorecard in PDF format.",
        type: "danger",
      });
    }
  };
  const handleExportExcel = async () => {
    if (!scorecard) return;
    const title = `Company Scorecard ${scorecard.asJson.description}`;
    const strategicObjectives =
      store.companyObjective.all.map((o) => o.asJson) || [];
    const measures = store.companyMeasure.all.map((o) => o.asJson) || [];
    try {
      await exportCompanyExcelScorecard(title, strategicObjectives, measures);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export company scorecard in Excel format.",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    const setPageTitle = () => {
      if (scorecard)
        setTitle(`Company Scorecard ${scorecard.asJson.description}`);
      else navigate("/c/strategy/company-review/");
    };

    setPageTitle();
  }, [navigate, scorecard, setTitle]);

  useEffect(() => {
    // load company objectives from db
    const loadAll = async () => {
      if (!fyid) return;
      setLoading(true); // start loading
      try {
        await api.companyMeasure.getAll(fyid);
        await api.companyObjective.getAll(fyid);
      } catch (error) {
        ui.snackbar.load({
          id: Date.now(),
          message: "Error! Failed to load the company objectives.",
          type: "danger",
        });
      }
      setLoading(false); // stop loading
    };

    loadAll();
  }, [api.companyMeasure, api.companyObjective, fyid, ui.snackbar]);

  if (!scorecard) return <></>;

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

      {/* Loading */}
      <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>

      {!loading && (
        <ErrorBoundary>
          {cycle === SCORECARD_TAB.name && (
            <CompanyScorecardDraftCycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
          {cycle === QUARTER1_TAB.name && (
            <CompanyScorecardQ1Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
          {cycle === QUARTER2_TAB.name && (
            <CompanyScorecardQ2Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
          {cycle === QUARTER3_TAB.name && (
            <CompanyScorecardQ3Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
          {cycle === QUARTER4_TAB.name && (
            <CompanyScorecardQ4Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
        </ErrorBoundary>
      )}

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.DEPARTMENT_OBJECTIVE_MODAL}>
          <ObjectiveDepartmentModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecardReviewView;
