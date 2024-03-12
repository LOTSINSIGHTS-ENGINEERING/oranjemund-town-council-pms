import {
  faFilePdf,
  faFileExcel,
  faCheck,
  faPaperPlane,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { ALL_TAB, fullPerspectiveName, MAP_TAB } from "../../shared/interfaces/IPerspectiveTabs";
import MODAL_NAMES from "../dialogs/ModalName";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import WeightError from "../shared/components/weight-error/WeightError";
import DepartmentStrategicMap from "./DepartmentStrategicMap";
import MeasureDepartment from "../../shared/models/MeasureDepartment";
import { dataFormat } from "../../shared/functions/Directives";
import EmptyError from "../admin-settings/EmptyError";
import NoMeasures from "./NoMeasures";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { IScorecardReview } from "../../shared/models/ScorecardReview";
import AgreementError from "../shared/components/agreement-error/AgreementError";
import { sortByPerspective } from "../shared/utils/utils";
import ObjectiveDepartment from "../../shared/models/ObjectiveDepartment";

interface IMoreButtonProps {
  agreement: IScorecardMetadata;
  isEmptyObjectiveError: boolean;
  isWeightError: boolean;
}
const MoreButton = observer((props: IMoreButtonProps) => {
  const { agreement, isEmptyObjectiveError, isWeightError } = props;
  const { api, ui, store } = useAppContext();

  const me = store.auth.meJson; // TODO: issue!
  const objectives = store.departmentObjective.all; // Not correct. Get only that belong to this department
  const measures = store.departmentMeasure.all; // Not correct. Get only that belong to this department
  const measureAudits = store.departmentMeasureAudit.all; // Not correct. Get only that belong to this department
  const reviewApi = api.departmentScorecardReview.draft;
  const scorecard = store.scorecard.active;

  const status = useMemo(
    () => agreement.agreementDraft.status || "pending",
    [agreement.agreementDraft.status]
  );

  const isDisabled = useMemo(
    () => !scorecard || scorecard.draftReview.status !== "in-progress",
    [scorecard]
  );

  const onSubmitReview = async () => {
    if (!me) return;

    const _objectives = objectives.map((o) => o.asJson);
    const _measures = measures.map((m) => m.asJson);
    const _measureAudits = measureAudits.map((m) => m.asJson);

    const $review = reviewApi.transform(
      me,
      _objectives,
      _measures,
      _measureAudits
    );

    const $agreement = agreement;
    $agreement.agreementDraft.status = "submitted";
    $agreement.agreementDraft.submittedOn = new Date().toDateString();

    await onUpdate($agreement, $review);
  };

  const onUpdate = async (
    agreement: IScorecardMetadata,
    review: IScorecardReview
  ) => {
    try {
      await reviewApi.create(review);
      await api.departmentScorecardMetadata.create(agreement);

      ui.snackbar.load({
        id: Date.now(),
        message: "Submitted department scorecard for approval.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to submit department scorecard for approval.",
        type: "danger",
      });
    }
  };

  return (
    <ErrorBoundary>
      {status === "pending" && (
        <button
          className="kit-dropdown-btn"
          onClick={onSubmitReview}
          disabled={isDisabled || isEmptyObjectiveError || isWeightError}
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
  measure: MeasureDepartment;
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
        {dataFormat(dataType, measure.quarter1Target, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.quarter2Target, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.quarter3Target, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.quarter4Target, dataSymbol)}
      </td>
    </tr>
  );
};

interface IMeasureTableProps {
  measures: MeasureDepartment[];
}
const MeasureTable = (props: IMeasureTableProps) => {
  const { measures } = props;

  return (
    <div className="measure-table">
      {measures.length !== 0 && (
        <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th className="uk-width-expand@s">Measure/KPI</th>
              <th>Baseline</th>
              <th>Annual Target</th>
              <th>Q1 Target</th>
              <th>Q2 Target</th>
              <th>Q3 Target</th>
              <th>Q4 Target</th>
            </tr>
          </thead>
          <tbody>
            {measures.map((measure) => (
              <ErrorBoundary key={measure.asJson.id}>
                <MeasureTableItem measure={measure} />
              </ErrorBoundary>
            ))}
          </tbody>
        </table>
      )}

      {measures.length === 0 && <NoMeasures />}
    </div>
  );
};

interface IObjectiveItemProps {
  isEditing: boolean;
  hasAccess: boolean;
  objective: ObjectiveDepartment;
  children?: React.ReactNode;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { hasAccess, isEditing, children, objective } = props;
  const { description, perspective, weight } = objective.asJson;

  const { api, store } = useAppContext();
  const navigate = useNavigate();

  const measuresCount = useMemo(
    () => objective.measures.length,
    [objective.measures.length]
  );

  const handleView = () => {
    navigate(`${objective.asJson.id}`);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    store.departmentObjective.select(objective.asJson);
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_OBJECTIVE_MODAL);
  };

  const handleRemove = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!window.confirm("Remove objective?")) return;
    await removeAllMeasures(); // remove all measures belonging to this objective
    await api.departmentObjective.delete(objective.asJson); // remove objective
  };

  const removeAllMeasures = async () => {
    // remove all measures belonging to objective
    for (const measure of objective.measures)
      await api.departmentMeasure.delete(measure.asJson);
  };

  return (
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

        {hasAccess && isEditing && (
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
  );
});

interface IStrategicListProps {
  isEditing: boolean;
  hasAccess: boolean;
  objectives: ObjectiveDepartment[];
}
const StrategicList = (props: IStrategicListProps) => {
  const { hasAccess, objectives, isEditing } = props;

  return (
    <div className="objective-table uk-margin">
      {objectives.map((objective) => (
        <ObjectiveItem
          key={objective.asJson.id}
          hasAccess={hasAccess}
          objective={objective}
          isEditing={isEditing}
        >
          <MeasureTable measures={objective.measures} />
        </ObjectiveItem>
      ))}

      {!objectives.length && <EmptyError errorMessage="No objective found" />}
    </div>
  );
};

interface IProps {
  agreement: IScorecardMetadata;
  objectives: ObjectiveDepartment[];
  hasAccess: boolean;
  handleExportPDF: () => Promise<void>;
  handleExportExcel: () => Promise<void>;
  handleFeedback: () => void;
}
const DepartmentScorecardDraftCycle = observer((props: IProps) => {
  const {
    agreement,
    objectives,
    hasAccess,
    handleExportExcel,
    handleExportPDF,
    handleFeedback,
  } = props;
  const { store } = useAppContext();

  const [tab, setTab] = useState(ALL_TAB.id);

  const isEditing = useMemo(
    () => agreement.agreementDraft.status === "pending",
    [agreement.agreementDraft.status]
  );

  const isEmptyObjectiveError = useMemo(
    () => objectives.some((o) => o.measures.length === 0),
    [objectives]
  );

  const totalWeight = useMemo(() => {
    // calculate weight
    return objectives.reduce((acc, curr) => acc + (curr.asJson.weight || 0), 0);
  }, [objectives]);

  const filteredObjectivesByPerspective = useMemo(() => {
    const sorted = objectives.sort(sortByPerspective);
    return tab === ALL_TAB.id
      ? sorted
      : sorted.filter((o) => o.asJson.perspective === tab);
  }, [objectives, tab]);

  const handleNewObjective = () => {
    store.departmentObjective.clearSelected(); // clear selected objective
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_OBJECTIVE_MODAL);
  };

  return (
    <ErrorBoundary>
      <div className="department-plan-view-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={<Tabs tab={tab} setTab={setTab} />}
              rightControls={
                <ErrorBoundary>
                  {hasAccess && (
                    <button
                      className="btn btn-primary uk-margin-small-right"
                      onClick={handleNewObjective}
                      disabled={!isEditing}
                    >
                      <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                      New Objective
                    </button>
                  )}

                  <div className="uk-inline">
                    <button
                      className="btn btn-primary"
                      title="Submit your draft for aproval, View past scorecards, and Export to PDF."
                    >
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      {hasAccess && (
                        <li>
                          <MoreButton
                            agreement={agreement}
                            isEmptyObjectiveError={isEmptyObjectiveError}
                            isWeightError={totalWeight !== 100}
                          />
                        </li>
                      )}
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
              {tab === MAP_TAB.id && <DepartmentStrategicMap />}
              {tab !== MAP_TAB.id && (
                <StrategicList
                  isEditing={isEditing}
                  hasAccess={hasAccess}
                  objectives={filteredObjectivesByPerspective}
                />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default DepartmentScorecardDraftCycle;
