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
import {
  SCORECARD_TAB,
  QUARTER1_TAB,
  QUARTER2_TAB,
  QUARTER3_TAB,
  QUARTER4_TAB,
} from "../../shared/interfaces/IReviewCycleTabs";
import {
  IReviewCycleStatus,
  IReviewCycleType,
} from "../../shared/models/ScorecardBatch";
import DepartmentScorecardDraftCycle from "./DepartmentScorecardDraftCycle";
import useDepartmentScorecardMetadata from "../../shared/hooks/useDepartmentScorecardMetadata";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import DepartmentScorecardQ1Cycle from "./DepartmentScorecardQ1Cycle";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { exportDepartmentExcelScorecard } from "../shared/functions/Excel";
import { generateDepartmentPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import DepartmentScorecardQ2Cycle from "./DepartmentScorecardQ2Cycle";
import DepartmentScorecardQ3Cycle from "./DepartmentScorecardQ3Cycle";
import DepartmentScorecardQ4Cycle from "./DepartmentScorecardQ4Cycle";
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

const DepartmentScorecardReviewView = observer(() => {
  const { api, store } = useAppContext();
  const { fyid, departmentId } = useParams();
  const scorecard = store.scorecard.getById(`${fyid}`); // scorecard.
  const agreement = useDepartmentScorecardMetadata(`${departmentId}`);
  const { vision, mission } = useVM();

  const objectives = store.departmentObjective.all.filter(
    (dep) => dep.asJson.department === departmentId
  );

  const role = store.auth.role;
  const dep = store.auth.meJson?.department;

  const hasAccess = useMemo(() => {
    return role === USER_ROLES.SUPER_USER || role === USER_ROLES.MD_USER;
  }, [role]);

  const [title, setTitle] = useTitle(); // set page title
  const [cycle, setCycle] = useState<IReviewCycleType>(SCORECARD_TAB.name);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useBackButton("/c/strategy/department-review/");

  // Export reports
  const handleExportPDF = async () => {
    const strategicObjectives =
      store.companyObjective.all.map((o) => o.asJson) || [];
    const contributoryObjectives =
      store.departmentObjective.all
        .filter((dep) => dep.asJson.department === departmentId)
        .map((o) => o.asJson) || [];
    const measures =
      store.departmentMeasure.all
        .filter((dep) => dep.asJson.department === departmentId)
        .map((o) => o.asJson) || [];

    const department:any = store.department.all
      .filter((department) => department.asJson.id === dep)
      .map((dep) => {
        return dep.asJson.name;
      });

    try {
      generateDepartmentPerformanceAgreementPDF(
        title,
        vision,
        mission,
        strategicObjectives,
        contributoryObjectives,
        measures,
        department
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportExcel = async () => {
    if (!scorecard) return;

    const strategicObjectives =
      store.companyObjective.all.map((o) => o.asJson) || [];
    const contributoryObjectives =
      store.departmentObjective.all
        .filter((dep) => dep.asJson.department === departmentId)
        .map((o) => o.asJson) || [];
    const measures =
      store.departmentMeasure.all
        .filter((dep) => dep.asJson.department === departmentId)
        .map((o) => o.asJson) || [];
    try {
      await exportDepartmentExcelScorecard(
        title,
        strategicObjectives,
        contributoryObjectives,
        measures
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const setPageTitle = () => {
      const department = store.department.getById(`${departmentId}`);
      const scorecardName = scorecard ? scorecard.asJson.description : "";
      const departmentName = department ? department.asJson.name : "";

      if (scorecard) setTitle(`${departmentName} ${scorecardName} Scorecard`);
      else navigate("/c/strategy/strat-eval/");
    };

    setPageTitle();
  }, [departmentId, navigate, scorecard, setTitle, store.department]);

  useEffect(() => {
    // load department objectives from db
    const loadAll = async () => {
      if (!fyid || !departmentId) return;

      setLoading(true); // start loading
      try {
        await api.companyMeasure.getAll(fyid);
        await api.companyObjective.getAll(fyid);
        await api.departmentMeasure.getAll(fyid, departmentId);
        await api.departmentObjective.getAll(fyid, departmentId);
      } catch (error) {
        console.log(error);
      }
      setLoading(false); // stop loading
    };

    loadAll();
  }, [
    api.companyMeasure,
    api.companyObjective,
    api.departmentMeasure,
    api.departmentObjective,
    departmentId,
    fyid,
  ]);

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
            <DepartmentScorecardDraftCycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
          {cycle === QUARTER1_TAB.name && (
            <DepartmentScorecardQ1Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
          {cycle === QUARTER2_TAB.name && (
            <DepartmentScorecardQ2Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
          {cycle === QUARTER3_TAB.name && (
            <DepartmentScorecardQ3Cycle
              agreement={agreement}
              objectives={objectives}
              hasAccess={hasAccess}
              handleExportExcel={handleExportExcel}
              handleExportPDF={handleExportPDF}
            />
          )}
          {cycle === QUARTER4_TAB.name && (
            <DepartmentScorecardQ4Cycle
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

export default DepartmentScorecardReviewView;
