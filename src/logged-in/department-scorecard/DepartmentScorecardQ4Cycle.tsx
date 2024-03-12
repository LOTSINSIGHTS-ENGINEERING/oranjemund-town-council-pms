import {
  faFilePdf,
  faFileExcel,
  faCheck,
  faPaperPlane,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import { dataFormat } from "../../shared/functions/Directives";
import showModalFromId from "../../shared/functions/ModalShow";
import { ALL_TAB, fullPerspectiveName, MAP_TAB } from "../../shared/interfaces/IPerspectiveTabs";
import MeasureDepartment from "../../shared/models/MeasureDepartment";
import ObjectiveDepartment from "../../shared/models/ObjectiveDepartment";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { IScorecardReview } from "../../shared/models/ScorecardReview";
import EmptyError from "../admin-settings/EmptyError";
import MeasureDepartmentUpdateQ4ActualModal from "../dialogs/measure-department-update-q4-actual/MeasureDepartmentUpdateQ4ActualModal";
import MeasureDepartmentModal from "../dialogs/measure-department/MeasureDepartmentModal";
import MeasureStatusUpdateDepartmentModal from "../dialogs/measure-status-update-department/MeasureStatusUpdateDepartmentModal";
import MODAL_NAMES from "../dialogs/ModalName";
import NoScorecardData from "../shared/components/no-scorecard-data/NoScorecardData";
import Rating from "../shared/components/rating/Rating";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import { rateColor } from "../shared/functions/Scorecard";
import { sortByPerspective } from "../shared/utils/utils";
import NoMeasures from "./NoMeasures";
import StrategicMap from "./DepartmentStrategicMap";

interface IMoreButtonProps {
  agreement: IScorecardMetadata;
}
const MoreButton = observer((props: IMoreButtonProps) => {
  const { api, ui, store } = useAppContext();
  const { agreement } = props;

  const me = store.auth.meJson; // TODO: issue!
  const objectives = store.departmentObjective.all; // Not correct. Get only that belong to this department
  const measures = store.departmentMeasure.all; // Not correct. Get only that belong to this department
  const measureAudits = store.departmentMeasureAudit.all; // Not correct. Get only that belong to this department
  const reviewApi = api.departmentScorecardReview.draft;
  const scorecard = store.scorecard.active;

  const status = useMemo(
    () => agreement.quarter4Review.status || "pending",
    [agreement.quarter4Review.status]
  );

  const isDisabled = useMemo(
    () => !scorecard || scorecard.finalAssessment.status !== "in-progress",
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
    $agreement.quarter4Review.status = "submitted";
    $agreement.quarter4Review.submittedOn = new Date().toDateString();

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
        message: "Submitted Q4 progress for review.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to submit your Q4 progress for review.",
        type: "danger",
      });
    }
  };

  return (
    <ErrorBoundary>
      {status === "in-progress" && (
        <button
          className="kit-dropdown-btn"
          onClick={onSubmitReview}
          disabled={isDisabled}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="icon uk-margin-small-right"
          />
          Submit Q4 Progress for Review
        </button>
      )}
      {status === "submitted" && (
        <button className="kit-dropdown-btn" disabled>
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          Submitted Q4 Progress for Review
        </button>
      )}
      {status === "approved" && (
        <button className="kit-dropdown-btn">
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          View Q4 Performance
        </button>
      )}
    </ErrorBoundary>
  );
});

interface IMeasureTableItemProps {
  canUpdate: boolean;
  isApproved: boolean;
  measure: MeasureDepartment;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { store } = useAppContext();
  const { canUpdate, isApproved } = props;

  const measure = props.measure.asJson;

  const rateCss = rateColor(
    Number(measure.q4Rating || measure.q4AutoRating),
    measure.isUpdated
  );

  const handleEditComments = () => {
    store.departmentMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_COMMENTS_MODAL);
  };

  const handleUpdateMeasureProgress = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    store.departmentMeasure.select(measure); // select measure
    showModalFromId(
      MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_UPDATE_Q4_ACTUAL_MODAL
    );
  };

  return (
    <tr className="row">
      <td>
        <div className={`status ${rateCss}`}></div>
      </td>
      <td>
        {measure.description}
        <button
          className="comments-btn btn-text uk-margin-small-left"
          onClick={handleEditComments}
          data-uk-icon="icon: commenting; ratio: 1"
        ></button>
      </td>

      <td className="no-whitespace">
        {dataFormat(measure.dataType, measure.baseline, measure.dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(measure.dataType, measure.annualTarget, measure.dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(
          measure.dataType,
          measure.quarter1Target,
          measure.dataSymbol
        )}
      </td>
      <td className="no-whitespace">
        {dataFormat(
          measure.dataType,
          measure.quarter2Target,
          measure.dataSymbol
        )}
      </td>
      <td className="no-whitespace">
        {dataFormat(
          measure.dataType,
          measure.quarter3Target,
          measure.dataSymbol
        )}
      </td>
      <td className="no-whitespace">
        {dataFormat(
          measure.dataType,
          measure.quarter4Target,
          measure.dataSymbol
        )}
      </td>
      <td className="no-whitespace">
        {dataFormat(
          measure.dataType,
          measure.quarter4Actual,
          measure.dataSymbol
        )}
      </td>
      <td className={`no-whitespace actual-value ${rateCss}`}>
        {measure.q4AutoRating}
      </td>
      {canUpdate && (
        <td>
          <div className="controls">
            <button
              className="btn-icon"
              onClick={handleUpdateMeasureProgress}
              title="Update progress"
            >
              <span data-uk-icon="pencil"></span>
            </button>
          </div>
        </td>
      )}
      {isApproved && (
        <td className={`no-whitespace actual-value ${rateCss}`}>
          {measure.q4Rating || measure.q4AutoRating || "-"}
        </td>
      )}
    </tr>
  );
};

interface IMeasureTableProps {
  measures: MeasureDepartment[];
  agreement: IScorecardMetadata;
  hasAccess: boolean;
}
const MeasureTable = (props: IMeasureTableProps) => {
  const { measures, agreement, hasAccess } = props;

  const isApproved = useMemo(
    () => agreement.quarter4Review.status === "approved",
    [agreement]
  );

  const canUpdate = useMemo(() => {
    const statusCondition = agreement.quarter4Review.status === "in-progress";
    return statusCondition && hasAccess;
  }, [agreement.quarter4Review.status, hasAccess]);

  return (
    <div className="measure-table">
      {measures.length !== 0 && (
        <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th></th>
              <th className="uk-width-expand@s">Measure/KPI</th>
              <th>Baseline</th>
              <th>Annual Target</th>
              <th>Q1 Target</th>
              <th>Q2 Target</th>
              <th>Q3 Target</th>
              <th>Q4 Target</th>
              <th>Progress</th>
              <th>Rating</th>
              {canUpdate && <th></th>}
              {isApproved && <th>Q4 Rating</th>}
            </tr>
          </thead>
          <tbody>
            {measures.map((measure) => (
              <MeasureTableItem
                key={measure.asJson.id}
                measure={measure}
                canUpdate={canUpdate}
                isApproved={isApproved}
              />
            ))}
          </tbody>
        </table>
      )}

      {measures.length === 0 && <NoMeasures />}
    </div>
  );
};

interface IObjectiveItemProps {
  objective: ObjectiveDepartment;
  children?: React.ReactNode;
}
const ObjectiveItem = (props: IObjectiveItemProps) => {
  const { children, objective } = props;

  const { description, perspective, weight } = objective.asJson;
  const { rate, isUpdated } = objective.q4Rating;

  return (
    <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
      <div className="uk-flex uk-flex-middle">
        <div className="uk-margin-right">
          <Rating rate={rate} isUpdated={isUpdated} />
        </div>
        <h3 className="objective-name uk-width-1-1">
          {description}
          <span className="objective-persepctive uk-margin-small-left">
            {fullPerspectiveName(perspective)}
          </span>
          <span className="objective-weight">Weight: {weight || 0}%</span>
        </h3>
      </div>

      <div className="uk-margin">{children}</div>
    </div>
  );
};

interface IStrategicListProps {
  agreement: IScorecardMetadata;
  objectives: ObjectiveDepartment[];
  hasAccess: boolean;
}
const StrategicList = observer((props: IStrategicListProps) => {
  const { agreement, objectives, hasAccess } = props;

  return (
    <div className="objective-table uk-margin">
      {objectives.map((objective) => (
        <ErrorBoundary key={objective.asJson.id}>
          <ObjectiveItem objective={objective}>
            <MeasureTable
              measures={objective.measures}
              agreement={agreement}
              hasAccess={hasAccess}
            />
          </ObjectiveItem>
        </ErrorBoundary>
      ))}

      {!objectives.length && <EmptyError errorMessage="No objective found" />}
    </div>
  );
});

interface IProps {
  agreement: IScorecardMetadata;
  objectives: ObjectiveDepartment[];
  hasAccess: boolean;
  handleExportPDF: () => Promise<void>;
  handleExportExcel: () => Promise<void>;
  handleFeedback: () => void;
}
const DepartmentScorecardQ4Cycle = observer((props: IProps) => {
  const {
    agreement,
    objectives,
    hasAccess,
    handleExportExcel,
    handleExportPDF,
    handleFeedback,
  } = props;

  const [tab, setTab] = useState(ALL_TAB.id);

  const filteredObjectivesByPerspective = useMemo(() => {
    const sorted = objectives.sort(sortByPerspective);
    return tab === ALL_TAB.id
      ? sorted
      : sorted.filter((o) => o.asJson.perspective === tab);
  }, [objectives, tab]);

  if (agreement.quarter3Review.status !== "approved")
    return (
      <ErrorBoundary>
        <NoScorecardData
          title="Department Q3 performance is not approved."
          subtitle="You cannot view Quarter 4 tab if the quarter is not yet approved."
          instruction="Please ensure that the Department Quarter 3 has been reviewed, and approved."
        />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="department-plan-view-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={<Tabs tab={tab} setTab={setTab} />}
              rightControls={
                <ErrorBoundary>
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      {hasAccess && (
                        <li>
                          <ErrorBoundary>
                            <MoreButton agreement={agreement} />
                          </ErrorBoundary>
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
            <div className="uk-margin">
              {tab === MAP_TAB.id && <StrategicMap />}
              {tab !== MAP_TAB.id && (
                <StrategicList
                  agreement={agreement}
                  objectives={filteredObjectivesByPerspective}
                  hasAccess={hasAccess}
                />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>

      <ErrorBoundary>
        {/* Modals */}
        <Modal modalId={MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_MODAL}>
          <MeasureDepartmentModal />
        </Modal>
        <Modal
          modalId={
            MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_UPDATE_Q4_ACTUAL_MODAL
          }
        >
          <MeasureDepartmentUpdateQ4ActualModal />
        </Modal>
        <Modal
          modalId={MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_COMMENTS_MODAL}
        >
          <MeasureStatusUpdateDepartmentModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default DepartmentScorecardQ4Cycle;
