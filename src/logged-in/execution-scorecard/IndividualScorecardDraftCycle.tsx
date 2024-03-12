import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";
import useMailer from "../../shared/hooks/useMailer";
import {
  fullPerspectiveName,
  ALL_TAB,
  MAP_TAB,
} from "../../shared/interfaces/IPerspectiveTabs";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { IScorecardReview } from "../../shared/models/ScorecardReview";
import Measure from "../../shared/models/Measure";
import Objective from "../../shared/models/Objective";
import EmptyError from "../admin-settings/EmptyError";
import MODAL_NAMES from "../dialogs/ModalName";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import WeightError from "../shared/components/weight-error/WeightError";
import NoMeasures from "./NoMeasures";
import EmployeeStrategicMap from "./strategic-map/EmployeeStrategicMap";
import { dataFormat } from "../../shared/functions/Directives";
import { generateIndividualPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { exportEmployeeExcelScorecard } from "../shared/functions/Excel";
import {
  faFilePdf,
  faFileExcel,
  faCheck,
  faPaperPlane,
  faHistory,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MAIL_SCORECARD_DRAFT_SUBMITTED_MANAGER,
  MAIL_SCORECARD_DRAFT_SUBMITTED_ME,
} from "../../shared/functions/mailMessages";
import AgreementError from "../shared/components/agreement-error/AgreementError";
import Modal from "../../shared/components/Modal";
import MeasureModal from "../dialogs/measure/MeasureModal";
import ObjectiveModal from "../dialogs/objective/ObjectiveModal";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import useVM from "../../shared/hooks/useVM";

interface IMoreButtonProps {
  agreement: IScorecardMetadata;
  isEmptyObjectiveError: boolean;
  isWeightError: boolean;
}
const MoreButton = observer((props: IMoreButtonProps) => {
  const { agreement, isEmptyObjectiveError, isWeightError } = props;
  const { api, ui, store } = useAppContext();
  const { mailSupervisor, mailMe } = useMailer();

  const me = store.auth.meJson;
  const objectives = store.objective.allMe;
  const measures = store.measure.allMe;
  const measureAudits = store.measureAudit.allMe;
  const scorecard = store.scorecard.active;
  const draftApi = api.individualScorecardReview.draft;

  const status = useMemo(
    () => agreement.agreementDraft.status || "pending",
    [agreement.agreementDraft.status]
  );

  const isDisabled = useMemo(
    () => !scorecard || scorecard.draftReview.status !== "in-progress",
    [scorecard]
  );

  const onUpdate = async (
    agreement: IScorecardMetadata,
    review: IScorecardReview
  ) => {
    try {
      await draftApi.create(review);
      await api.individualScorecardMetadata.create(agreement);
      ui.snackbar.load({
        id: Date.now(),
        message: "Submitted your performance scorecard for approval.",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      ui.snackbar.load({
        id: Date.now(),
        message:
          "Error! Failed to submit your performance scorecard for approval.",
        type: "danger",
      });
    }
  };

  const onSubmitScorecardDraftForApproval = async () => {
    if (!me) return;
    const _objectives = objectives.map((o) => o.asJson);
    const _measures = measures.map((m) => m.asJson);
    const _measureAudits = measureAudits.map((m) => m.asJson);

    const { MY_SUBJECT, MY_BODY } = MAIL_SCORECARD_DRAFT_SUBMITTED_ME(
      me.displayName
    );
    const { SUBJECT, BODY } = MAIL_SCORECARD_DRAFT_SUBMITTED_MANAGER(
      me.displayName
    );
    const $review = draftApi.transform(
      me,
      _objectives,
      _measures,
      _measureAudits
    );
    const $agreement = agreement;
    $agreement.agreementDraft.status = "submitted";
    $agreement.agreementDraft.submittedOn = new Date().toDateString();

    await onUpdate($agreement, $review);
    await mailSupervisor(SUBJECT, BODY);
    await mailMe(MY_SUBJECT, MY_BODY);
  };

  return (
    <ErrorBoundary>
      {status === "pending" && (
        <button
          className="kit-dropdown-btn"
          onClick={onSubmitScorecardDraftForApproval}
          disabled={isDisabled || isEmptyObjectiveError || isWeightError}
          title={
            isEmptyObjectiveError
              ? "The weights of all the objectives didn't add up to 100%."
              : ""
          }
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="icon uk-margin-small-right"
          />
          Submit Scorecard for Approval
        </button>
      )}
      {status === "submitted" && (
        <button className="kit-dropdown-btn" disabled>
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          Scorecard Submitted for Approval
        </button>
      )}
      {status === "approved" && (
        <button className="kit-dropdown-btn" disabled>
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          Scorecard Approved
        </button>
      )}
    </ErrorBoundary>
  );
});

interface IMeasureTableItemProps {
  measure: Measure;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const measure = props.measure.asJson;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol || "";

  return (
    <tr className="row">
      <td>{measure.description}</td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.baseline, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.annualTarget, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating1, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating2, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating3, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating4, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating5, dataSymbol)}
      </td>
    </tr>
  );
};
interface IMeasureTableProps {
  measures: Measure[];
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures } = props;
  const [isEmpty, setisEmpty] = useState(false);

  useEffect(() => {
    setisEmpty(measures.length === 0 ? true : false);
  }, [measures]);

  return (
    <ErrorBoundary>
      <div className="measure-table">
        {!isEmpty && (
          <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
            <thead className="header">
              <tr>
                <th className="uk-width-expand@s">Measure/KPI</th>
                <th>Baseline</th>
                <th>Annual Target</th>
                <th>Rate 1</th>
                <th>Rate 2</th>
                <th>Rate 3</th>
                <th>Rate 4</th>
                <th>Rate 5</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((measure) => (
                <ErrorBoundary key={measure.asJson.id}>
                  <MeasureTableItem measure={measure} />
                  {console.log(measure.asJson.id)}
                </ErrorBoundary>
              ))}
            </tbody>
          </table>
        )}
        {isEmpty && <NoMeasures />}
      </div>
    </ErrorBoundary>
  );
});

// Draft Scorecard Content
interface IObjectiveItemProps {
  objective: Objective;
  children?: React.ReactNode;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { api, store } = useAppContext();
  const { objective, children } = props;
  const { perspective, description, weight } = objective.asJson;

  const { agreement } = useIndividualScorecard();
  const navigate = useNavigate();

  const measuresCount = useMemo(
    () => objective.measures.length,
    [objective.measures.length]
  );

  const isEditing = useMemo(
    () => agreement.agreementDraft.status === "pending",
    [agreement.agreementDraft.status]
  );

  const handleView = () => navigate(objective.asJson.id);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    store.objective.select(objective.asJson);
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL); // show objective modal
  };

  const handleRemove = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!window.confirm("Remove objective?")) return;
    // remove all measures belonging to this objective
    await removeAllMeasures();
    // remove objective
    await api.objective.delete(objective.asJson);
  };

  const removeAllMeasures = async () => {
    // remove all measures belonging to objective
    for (const measure of objective.measures) {
      await api.measure.delete(measure.asJson);
    }
  };

  return (
    <ErrorBoundary>
      <div
        className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin"
        onClick={handleView}
      >
        <div className="uk-flex uk-flex-middle">
          <h3 className="objective-name uk-width-1-1">
            {description}
            <span className="objective-persepctive uk-margin-small-left">
              {fullPerspectiveName(perspective)}
            </span>
            <span className="objective-weight">Weight: {weight || 0}%</span>
          </h3>

          {isEditing && (
            <ErrorBoundary>
              <button className="btn-icon">
                <span uk-icon="icon: more-vertical; ratio: .8"></span>
              </button>

              <Dropdown pos="bottom-right">
                <li>
                  <button className="kit-dropdown-btn" onClick={handleView}>
                    <span
                      className="uk-margin-small-right"
                      data-uk-icon="list"
                    ></span>
                    {measuresCount ? "View Measures" : "Add Measures"}
                  </button>
                </li>
                <li>
                  <button className="kit-dropdown-btn" onClick={handleEdit}>
                    <span
                      className="uk-margin-small-right"
                      data-uk-icon="pencil"
                    ></span>
                    Edit Objective
                  </button>
                </li>
                <li>
                  <button className="kit-dropdown-btn" onClick={handleRemove}>
                    <span
                      className="uk-margin-small-right"
                      data-uk-icon="trash"
                    ></span>
                    Remove Objective
                  </button>
                </li>
              </Dropdown>
            </ErrorBoundary>
          )}
        </div>

        <div className="uk-margin">{children}</div>
      </div>
    </ErrorBoundary>
  );
});

interface IPerformanceAgreementDraftObjectivesProps {
  objectives: Objective[];
}
const StrategicList = observer(
  (props: IPerformanceAgreementDraftObjectivesProps) => {
    const { objectives } = props;

    return (
      <div className="objective-table uk-margin">
        {objectives.map((objective) => (
          <ObjectiveItem key={objective.asJson.id} objective={objective}>
            <MeasureTable measures={objective.measures} />
          </ObjectiveItem>
        ))}

        {/* Empty */}
        {!objectives.length && <EmptyError errorMessage="No objective found" />}
      </div>
    );
  }
);

const IndividualScorecardDraftCycle = observer(() => {
  const { store } = useAppContext();
  const [tab, setTab] = useState(ALL_TAB.id);
  const { agreement, loading } = useIndividualScorecard();
  const { vision, mission } = useVM();

  const scorecard = store.scorecard.active;
  const objectives = store.objective.allMe;
  const measures = store.measure.allMe;
  const allUsers = store.user.all;

  const totalWeight = useMemo(
    () => objectives.reduce((acc, curr) => acc + (curr.asJson.weight || 0), 0),
    [objectives]
  );

  const isEmptyObjectiveError = useMemo(
    () => objectives.some((o) => o.measures.length === 0),
    [objectives]
  );

  const isEditing = useMemo(
    () => agreement.agreementDraft.status === "pending",
    [agreement.agreementDraft.status]
  );

  // Export reports
  const handleExportPDF = async () => {
    const me = store.auth.me;

    if (!me || !scorecard) return;
    const title = `${scorecard.description}`;
    const name = `${me.asJson.displayName}`;
    const jobTitle = `${me.asJson.jobTitle}`;
    const supervisor =
      allUsers.find((u) => u.asJson.uid === me.asJson.supervisor)?.asJson
        .displayName || "No supervisor";

    const strategicObjectives =
      [
        ...store.departmentObjective.all.map((o) => o.asJson),
        ...store.companyObjective.all.map((o) => o.asJson),
      ] || [];
    const contributoryObjectives = objectives.map((o) => o.asJson) || [];
    const allMeasures = measures.map((o) => o.asJson) || [];

    try {
      generateIndividualPerformanceAgreementPDF(
        title,
        vision,
        mission,
        strategicObjectives,
        contributoryObjectives,
        allMeasures,
        name,
        jobTitle,
        supervisor
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportExcel = async () => {
    const me = store.auth.me;
    if (!me || !scorecard) return;

    const title = `${me.asJson.displayName} ${scorecard.description} Scorecard`;

    const strategicObjectives =
      [
        ...store.departmentObjective.all.map((o) => o.asJson),
        ...store.companyObjective.all.map((o) => o.asJson),
      ] || [];
    const contributoryObjectives = objectives.map((o) => o.asJson) || [];
    const allMeasures = measures.map((o) => o.asJson) || [];

    try {
      await exportEmployeeExcelScorecard(
        title,
        strategicObjectives,
        contributoryObjectives,
        allMeasures
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewObjective = () => {
    store.objective.setPerspective(tab); // set the selected tab in the store.
    store.objective.clearSelected(); // clear selected objective
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL);
  };

  const handleScorecards = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.SCORECARD_MODAL);
  };

  const handleFeedback = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.READ_SCORECARD_COMMENT_MODAL);
  };

  const filteredObjectivesByPerspective = useMemo(() => {
    const sorted = objectives;
    return tab === ALL_TAB.id
      ? sorted
      : sorted.filter((o) => o.asJson.perspective === tab);
  }, [objectives, tab]);

  if (loading)
    return (
      <ErrorBoundary>
        <LoadingEllipsis />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="scorecard-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={
                <ErrorBoundary>
                  <Tabs tab={tab} setTab={setTab} />
                </ErrorBoundary>
              }
              rightControls={
                <ErrorBoundary>
                  {isEditing && (
                    <>
                      <button
                        className="btn btn-primary uk-margin-small-right"
                        onClick={handleNewObjective}
                        title="Add a new objective to your scorecard"
                      >
                        <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                        New Objective
                      </button>
                    </>
                  )}
                  <div className="uk-inline">
                    <button
                      className="btn btn-primary"
                      title="Submit your draft for aproval, View past scorecards, and Export to PDF."
                    >
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <ErrorBoundary>
                          <MoreButton
                            agreement={agreement}
                            isEmptyObjectiveError={isEmptyObjectiveError}
                            isWeightError={totalWeight !== 100}
                          />
                        </ErrorBoundary>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleScorecards}
                          title="View the scorecards for the previous financial years."
                        >
                          <FontAwesomeIcon
                            icon={faHistory}
                            size="sm"
                            className="icon uk-margin-small-right"
                          />
                          View Past Scorecards
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportPDF}
                          title="Export your scorecard as PDF."
                        >
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export PDF
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportExcel}
                          title="Export your scorecard as EXCEL."
                        >
                          <FontAwesomeIcon
                            icon={faFileExcel}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export Excel
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleFeedback}
                          title="Read Comments"
                        >
                          <FontAwesomeIcon
                            icon={faCommentDots}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Feedback
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            {isEmptyObjectiveError && <AgreementError />}
            {objectives.length !== 0 && (
              <WeightError weightError={totalWeight} />
            )}
          </ErrorBoundary>

          <ErrorBoundary>
            <div className="uk-margin">
              {tab === MAP_TAB.id && <EmployeeStrategicMap />}
              {tab !== MAP_TAB.id && (
                <StrategicList objectives={filteredObjectivesByPerspective} />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      {isEditing && (
        <ErrorBoundary>
          <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_MODAL}>
            <MeasureModal />
          </Modal>
          <Modal modalId={MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL}>
            <ObjectiveModal />
          </Modal>
        </ErrorBoundary>
      )}
    </ErrorBoundary>
  );
});

export default IndividualScorecardDraftCycle;
