import { faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import showModalFromId from "../../shared/functions/ModalShow";
import { ALL_TAB, fullPerspectiveName } from "../../shared/interfaces/IPerspectiveTabs";
import MODAL_NAMES from "../dialogs/ModalName";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import WeightError from "../shared/components/weight-error/WeightError";
import MeasureDepartment from "../../shared/models/MeasureDepartment";
import { dataFormat } from "../../shared/functions/Directives";
import EmptyError from "../admin-settings/EmptyError";
import NoMeasures from "./NoMeasures";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import AgreementError from "../shared/components/agreement-error/AgreementError";
import { sortByPerspective } from "../shared/utils/utils";
import ObjectiveDepartment from "../../shared/models/ObjectiveDepartment";
import DepartmentScorecardDraftApprovalModal from "../dialogs/department-scorecard-draft-approval/DepartmentScorecardDraftApprovalModal";
import DepartmentScorecardDraftRejectionModal from "../dialogs/department-scorecard-draft-rejection/DepartmentScorecardDraftRejectionModal";
import Modal from "../../shared/components/Modal";
import NoScorecardData from "../shared/components/no-scorecard-data/NoScorecardData";

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
  objective: ObjectiveDepartment;
  children?: React.ReactNode;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { objective, children } = props;
  const { description, perspective, weight } = objective.asJson;

  return (
    <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
      <div className="uk-flex uk-flex-middle">
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
});

interface IStrategicListProps {
  objectives: ObjectiveDepartment[];
}
const StrategicList = (props: IStrategicListProps) => {
  const { objectives } = props;

  return (
    <div className="objective-table uk-margin">
      {objectives.map((objective) => (
        <ObjectiveItem key={objective.asJson.id} objective={objective}>
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
}
const DepartmentScorecardDraftCycle = observer((props: IProps) => {
  const {
    agreement,
    objectives,
    hasAccess,
    handleExportExcel,
    handleExportPDF,
  } = props;

  const [tab, setTab] = useState(ALL_TAB.id);

  const isActive = useMemo(
    () => agreement.agreementDraft.status === "submitted",
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

  const handleApproval = () =>
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_DRAFT_APPROVAL_MODAL);

  const handleRejection = () =>
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_DRAFT_REJECTION_MODAL);

  if (
    agreement.agreementDraft.status === "pending" ||
    agreement.agreementDraft.status === "in-progress"
  )
    return (
      <ErrorBoundary>
        <NoScorecardData
          title="Department scorecard is not submitted."
          subtitle="You cannot view Draft tab if the department scorecard is not yet submitted."
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
                    <button
                      className="btn btn-primary"
                      title="Submit your draft for aproval, View past scorecards, and Export to PDF."
                    >
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
                                  Approve Final Performance Scorecard
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
                                  Revert Performance Scorecard for Changes
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
            {isEmptyObjectiveError && <AgreementError />}
            {objectives.length !== 0 && (
              <WeightError weightError={totalWeight} />
            )}
          </ErrorBoundary>

          <ErrorBoundary>
            <div className="uk-margin">
              <StrategicList objectives={filteredObjectivesByPerspective} />
            </div>
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.DEPARTMENT_DRAFT_APPROVAL_MODAL}>
          <DepartmentScorecardDraftApprovalModal agreement={agreement} />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.DEPARTMENT_DRAFT_REJECTION_MODAL}>
          <DepartmentScorecardDraftRejectionModal agreement={agreement} />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default DepartmentScorecardDraftCycle;
