import { isEqual } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import useTitle from "../../shared/hooks/useTitle";
import { defaultBatch, IReviewCycleType, IScorecardBatch } from "../../shared/models/ScorecardBatch";
import MODAL_NAMES from "../dialogs/ModalName";
import PerformanceReviewModal from "../dialogs/performance-review/PerformanceReviewModal";
import ReviewStep from "./ReviewStep";
import StageSettings from "./StageSettings";
import { IScorecardMetadata, defaultScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import User from "../../shared/models/User";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import { ReviewTabs } from "./ReviewTabs";
import ReviewManager from "./ReviewManager";
import ReviewPeople from "./ReviewPeople";

interface ICurrentStageProps {
  openStage: IReviewCycleType;
  batch: IScorecardBatch;
  setBatch: React.Dispatch<React.SetStateAction<IScorecardBatch>>;
  unsavedChanges: boolean;
  setUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  discardChanges: () => void;
  hasAccess: boolean;
}
const CurrentStage = observer((props: ICurrentStageProps) => {
  const [loading, setLoading] = useState(false);
  const { api, store } = useAppContext();
  const [tab, setTab] = useState<"Employee" | "Exco">("Employee");

  const role = store.auth.role;
  const department = store.auth.department;

  const sortByName = (a: User, b: User) => {
    return (a.asJson.displayName || "").localeCompare(
      b.asJson.displayName || ""
    );
  };

  const employeeFilterAccess = () => {
    const users: User[] = store.user.all.filter((u) => {
      return (
        u.asJson.role === USER_ROLES.MANAGER_USER ||
        u.asJson.role === USER_ROLES.SUPERVISOR_USER ||
        u.asJson.role === USER_ROLES.EMPLOYEE_USER ||
        u.asJson.role === USER_ROLES.ADMIN_USER ||
        u.asJson.role === USER_ROLES.GUEST_USER
      );
    });

    if (role === USER_ROLES.SUPER_USER || role === USER_ROLES.MD_USER)
      return users;
    else return users.filter((u) => u.asJson.department === department);
  };

  const excoFilterAccess = (): User[] => {
    return store.user.all.filter((u) => {
      return (
        (u.asJson.role === USER_ROLES.EXECUTIVE_USER ||
          u.asJson.role === USER_ROLES.MD_USER ||
          u.asJson.role === USER_ROLES.DIRECTOR_USER ||
          u.asJson.role === USER_ROLES.SUPER_USER) &&
        !u.asJson.devUser
      );
    });
  };

  const mapTo = (user: User) => {
    const agreement = store.individualScorecardMetadata.all.find(
      (agreement) => agreement.asJson.uid === user.asJson.uid
    );
    const department = store.department.getById(user.asJson.department);
    const departmentName = department ? department.asJson.name : "Unknown";

    const supervisor = store.user.getById(user.asJson.supervisor);
    const supervisorName = supervisor
      ? supervisor.asJson.displayName
      : "Not Found";

    const jobTitle = user.asJson.jobTitle || "Not Found";

    const $agreement = agreement
      ? {
        ...defaultScorecardMetadata,
        ...agreement.asJson,
        department: user.asJson.department,
        departmentName: departmentName,
        uid: user.asJson.uid,
        displayName: user.asJson.displayName || "Unknown",
        supervisorName: supervisorName!,
        jobTitle: jobTitle!,
      }
      : {
        ...defaultScorecardMetadata,
        uid: user.asJson.uid,
        department: user.asJson.department,
        departmentName: departmentName,
        displayName: user.asJson.displayName || "Unknown",
        supervisorName: supervisorName!,
        jobTitle: jobTitle!,
      };
    return $agreement;
  };

  const employeeScorecards: IScorecardMetadata[] = employeeFilterAccess()
    .sort(sortByName)
    .map(mapTo);

  const excoScorecards: IScorecardMetadata[] = excoFilterAccess()
    .sort(sortByName)
    .map(mapTo);

  useEffect(() => {
    // load data from db
    const loadAll = async () => {
      setLoading(true); // start loading
      try {
        await api.user.getAll();
        await api.department.getAll();
        await api.individualScorecardMetadata.getAll();
      } catch (error) {
        throw new Error("Failed to load data");
      }
      setLoading(false); // stop loading
    };
    loadAll();
  }, [api.department, api.individualScorecardMetadata, api.user]);

  if (loading) return <LoadingEllipsis />;

  return (
    <div className="current-stage">
      {props.hasAccess && <StageSettings {...props} />}

      <div className="stage-content uk-card uk-card-default uk-card-body uk-card-small uk-margin">
        <div className="uk-margin">
          {(role === USER_ROLES.SUPER_USER || role === USER_ROLES.MD_USER) && (
            <ReviewTabs tab={tab} setTab={setTab} />
          )}
        </div>

        <ErrorBoundary>
          {tab === "Employee" && (
            <ReviewPeople scorecards={employeeScorecards} />
          )}
          {tab === "Exco" && <ReviewManager scorecards={excoScorecards} />}
        </ErrorBoundary>
      </div>
    </div>
  );
});

const PerformanceReviews = observer(() => {
  const { store } = useAppContext();
  const [openStage, setOpenStage] = useState<IReviewCycleType>("Scorecard");
  const [batch, setBatch] = useState<IScorecardBatch>({
    ...defaultBatch,
  });
  const role = store.auth.role;

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const firstRender = useRef(true);
  useTitle("Performance Reviews"); // set page title

  const discardChanges = () => {
    if (store.scorecard.active)
      setBatch({ ...defaultBatch, ...store.scorecard.active });
  };

  const hasAccess = useMemo(() => role === USER_ROLES.SUPER_USER, [role]);

  useEffect(() => {
    const active = store.scorecard.active;

    if (firstRender.current) {
      firstRender.current = false;
      if (active) {
        // if first render, open the stage after complete.
        (active.draftReview.status === "approved" ||
          active.draftReview.status === "cancelled") &&
          setOpenStage("Q1 Reviews");
        (active.quarter1Review.status === "approved" ||
          active.quarter1Review.status === "cancelled") &&
          setOpenStage("Midterm Reviews");
        (active.midtermReview.status === "approved" ||
          active.midtermReview.status === "cancelled") &&
          setOpenStage("Q3 Reviews");
        (active.quarter3Review.status === "approved" ||
          active.quarter3Review.status === "cancelled") &&
          setOpenStage("Assessment");

        // if first render, open the stage with status in-progress.
        active.draftReview.status === "in-progress" &&
          setOpenStage("Scorecard");
        active.quarter1Review.status === "in-progress" &&
          setOpenStage("Q1 Reviews");
        active.midtermReview.status === "in-progress" &&
          setOpenStage("Midterm Reviews");
        active.quarter3Review.status === "in-progress" &&
          setOpenStage("Q3 Reviews");
        active.finalAssessment.status === "in-progress" &&
          setOpenStage("Assessment");
      }
    }

    if (active) {
      if (isEqual(active, batch)) setUnsavedChanges(false);
      else setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [batch, store.scorecard.active]);

  useEffect(() => {
    if (store.scorecard.active)
      setBatch({ ...defaultBatch, ...store.scorecard.active });
  }, [store.scorecard.active]);

  return (
    <ErrorBoundary>
      <div className="performance-reviews-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          {hasAccess && (
            <ErrorBoundary>
              <ReviewStep
                openStage={openStage}
                setOpenStage={setOpenStage}
                batch={batch}
              />
            </ErrorBoundary>
          )}

          <ErrorBoundary>
            <CurrentStage
              openStage={openStage}
              batch={batch}
              setBatch={setBatch}
              unsavedChanges={unsavedChanges}
              setUnsavedChanges={setUnsavedChanges}
              discardChanges={discardChanges}
              hasAccess={hasAccess}
            />
          </ErrorBoundary>
        </div>
      </div>

      {hasAccess && (
        <Modal modalId={MODAL_NAMES.PERFORMANCE_REVIEW.REVIEW_MODAL}>
          <PerformanceReviewModal />
        </Modal>
      )}
    </ErrorBoundary>
  );
});

export default PerformanceReviews;
