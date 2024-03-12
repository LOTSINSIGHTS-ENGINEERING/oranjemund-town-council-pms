import { faFilePdf, faFileExcel, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import { dataFormat } from "../../shared/functions/Directives";
import showModalFromId from "../../shared/functions/ModalShow";
import { ALL_TAB, fullPerspectiveName } from "../../shared/interfaces/IPerspectiveTabs";
import MeasureDepartment, { IMeasureDepartment } from "../../shared/models/MeasureDepartment";
import ObjectiveDepartment from "../../shared/models/ObjectiveDepartment";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import EmptyError from "../admin-settings/EmptyError";
import DepartmentScorecardQ1ApprovalModal from "../dialogs/department-scorecard-q1-approval/DepartmentScorecardQ1ApprovalModal";
import DepartmentScorecardQ1RejectionModal from "../dialogs/department-scorecard-q1-rejection/DepartmentScorecardQ1RejectionModal";
import MODAL_NAMES from "../dialogs/ModalName";
import NoScorecardData from "../shared/components/no-scorecard-data/NoScorecardData";
import NumberInput, { NumberInputValue } from "../shared/components/number-input/NumberInput";
import Rating from "../shared/components/rating/Rating";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import { rateColor } from "../shared/functions/Scorecard";
import { sortByPerspective } from "../shared/utils/utils";
import NoMeasures from "./NoMeasures";

interface IMeasureTableItemProps {
  measure: MeasureDepartment;
  canUpdate: boolean;
  isApproved: boolean;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { api, store } = useAppContext();
  const { canUpdate, isApproved } = props;
  const measure = props.measure.asJson;

  const [newQ1Rating, setNewQ1Rating] = useState<number | null>(() => measure.q1Rating);
  const [unsavedChanges, setunSavedChanges] = useState(false);

  const rateCss = rateColor(Number(measure.q1Rating || measure.q1AutoRating), measure.isUpdated);

  const handleEditComments = () => {
    store.departmentMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_COMMENTS_MODAL);
  };

  const onRate = (value: string | number) => {
    let _rating = NumberInputValue(value);
    if (_rating && _rating > 5) _rating = 5;
    if (_rating && _rating < 1) _rating = 1;

    setNewQ1Rating(_rating);

    if (measure.q1Rating === value) setunSavedChanges(false);
    else setunSavedChanges(true);
  };

  const handleUpdate = async () => {
    const isUpdated = newQ1Rating || measure.quarter1Actual ? true : false;

    try {
      const $measure: IMeasureDepartment = {
        ...measure,
        q1Rating: newQ1Rating,
        isUpdated,
      };
      await api.departmentMeasure.update($measure, ["q1Rating", "isUpdated"]);
      setunSavedChanges(false);
    } catch (error) {
      console.log(error);
    }
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
        {dataFormat(measure.dataType, measure.annualActual, measure.dataSymbol)}
      </td>

      <td className={`no-whitespace actual-value ${rateCss}`}>
        {measure.q1AutoRating}
      </td>

      {canUpdate && (
        <>
          <td className={`actual-value ${rateCss}`}>
            <NumberInput
              id="kpi-final-rating"
              className="auto-save uk-input uk-form-small"
              placeholder="-"
              value={newQ1Rating}
              onChange={onRate}
              min={1}
              max={5}
            />
          </td>
          <td>
            <div className="controls">
              {unsavedChanges && (
                <button
                  className="btn-icon"
                  onClick={handleUpdate}
                  title="Save changes"
                >
                  {/* <span data-uk-icon="push"></span> */}
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    size="1x"
                    className="icon"
                  />
                </button>
              )}
            </div>
          </td>
        </>
      )}

      {isApproved && (
        <td className={`no-whitespace actual-value ${rateCss}`}>
          {measure.q1Rating || measure.q1AutoRating || "-"}
        </td>
      )}
    </tr>
  );
};

interface IMeasureTableProps {
  measures: MeasureDepartment[];
  agreement: IScorecardMetadata;
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures, agreement } = props;
  const canUpdate = useMemo(
    () => agreement.quarter1Review.status === "submitted",
    [agreement.quarter1Review.status]
  );
  const isApproved = useMemo(
    () => agreement.quarter1Review.status === "approved",
    [agreement.quarter1Review.status]
  );

  // console.log("Can Update: ", canUpdate);

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
              <th>Progress</th>
              <th>Rating</th>
              {canUpdate && (
                <>
                  <th>Q1 Rating</th>
                  <th></th>
                </>
              )}
              {isApproved && <th>Q1 Rating</th>}
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
});

interface IObjectiveItemProps {
  objective: ObjectiveDepartment;
  children?: React.ReactNode;
}
const ObjectiveItem = (props: IObjectiveItemProps) => {
  const { children, objective } = props;

  const { description, perspective, weight } = objective.asJson;
  const { rate, isUpdated } = objective.q1Rating;

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
}
const StrategicList = (props: IStrategicListProps) => {
  const { agreement, objectives } = props;

  return (
    <div className="objective-table uk-margin">
      {objectives.map((objective) => (
        <ErrorBoundary key={objective.asJson.id}>
          <ObjectiveItem objective={objective}>
            <MeasureTable measures={objective.measures} agreement={agreement} />
          </ObjectiveItem>
        </ErrorBoundary>
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
}
const DepartmentScorecardQ1Cycle = observer((props: IProps) => {
  const {
    agreement,
    objectives,
    hasAccess,
    handleExportExcel,
    handleExportPDF,
  } = props;

  const [tab, setTab] = useState(ALL_TAB.id);

  const isActive = useMemo(
    () => agreement.quarter1Review.status === "submitted",
    [agreement.quarter1Review.status]
  );

  const filteredObjectivesByPerspective = useMemo(() => {
    const sorted = objectives.sort(sortByPerspective);
    return tab === ALL_TAB.id
      ? sorted
      : sorted.filter((o) => o.asJson.perspective === tab);
  }, [objectives, tab]);

  const handleApproval = () =>
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_Q1_APPROVAL_MODAL);

  const handleRejection = () =>
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_Q1_REJECTION_MODAL);


  if (
    agreement.quarter1Review.status === "pending" ||
    agreement.quarter1Review.status === "in-progress"
  )
    return (
      <ErrorBoundary>
        <NoScorecardData
          title="Department scorecard is not submitted."
          subtitle="You cannot view Quarter 1 tab if the department scorecard is not yet submitted."
          instruction="Please ensure that the Department Scorecard has been uploaded, and submitted."
        />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="department-plan-view-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={<Tabs tab={tab} setTab={setTab} noMap />}
              rightControls={
                <ErrorBoundary>
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      {hasAccess && (
                        <>
                          {isActive && (
                            <>
                              <li>
                                <button
                                  className="kit-dropdown-btn"
                                  onClick={handleApproval}
                                  disabled={!hasAccess}
                                >
                                  <span
                                    className="icon"
                                    data-uk-icon="icon: check; ratio:.8"
                                  ></span>
                                  Approve Quarter 1 Reviews
                                </button>
                              </li>
                              <li>
                                <button
                                  className="kit-dropdown-btn"
                                  onClick={handleRejection}
                                  disabled={!hasAccess}
                                >
                                  <span
                                    className="icon"
                                    data-uk-icon="icon: close; ratio:.8"
                                  ></span>
                                  Revert Quarter 1 Reviews for Changes
                                </button>
                              </li>
                            </>
                          )}
                        </>
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
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <div className="uk-margin">
              <StrategicList
                agreement={agreement}
                objectives={filteredObjectivesByPerspective}
              />
            </div>
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.DEPARTMENT_Q1_APPROVAL_MODAL}>
          <DepartmentScorecardQ1ApprovalModal agreement={agreement} />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.DEPARTMENT_Q1_REJECTION_MODAL}>
          <DepartmentScorecardQ1RejectionModal agreement={agreement} />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default DepartmentScorecardQ1Cycle;
