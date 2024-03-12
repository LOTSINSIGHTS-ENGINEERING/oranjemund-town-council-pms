import {
  faFilePdf,
  faFileExcel,
  faFloppyDisk,
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
import { ALL_TAB, fullPerspectiveName, } from "../../shared/interfaces/IPerspectiveTabs";
import MeasureCompany, { IMeasureCompany } from "../../shared/models/MeasureCompany";
import ObjectiveCompany from "../../shared/models/ObjectiveCompany";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import EmptyError from "../admin-settings/EmptyError";
import CompanyScorecardQ2ApprovalModal from "../dialogs/company-scorecard-q2-approval/CompanyScorecardQ2ApprovalModal";
import CompanyScorecardQ2RejectionModal from "../dialogs/company-scorecard-q2-rejection/CompanyScorecardQ2RejectionModal";
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
  measure: MeasureCompany;
  canUpdate: boolean;
  isApproved: boolean;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { api } = useAppContext();
  const { canUpdate, isApproved } = props;
  const measure = props.measure.asJson;

  const [newQ2Rating, setNewQ2Rating] = useState<number | null>(
    () => measure.q2Rating
  );
  const [unsavedChanges, setunSavedChanges] = useState(false);

  const rateCss = rateColor(
    Number(measure.q2Rating) || measure.q2AutoRating,
    measure.isUpdated
  );

  const onRate = (value: string | number) => {
    let _rating = NumberInputValue(value);
    if (_rating && _rating > 5) _rating = 5;
    if (_rating && _rating < 1) _rating = 1;

    setNewQ2Rating(_rating);

    if (measure.q2Rating === value) setunSavedChanges(false);
    else setunSavedChanges(true);
  };

  const handleUpdate = async () => {
    const isUpdated = newQ2Rating || measure.quarter2Actual ? true : false;

    try {
      const $measure: IMeasureCompany = {
        ...measure,
        q2Rating: newQ2Rating,
        isUpdated,
      };
      await api.departmentMeasure.update($measure, ["q2Rating", "isUpdated"]);
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
      <td>{measure.description}</td>

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
        {measure.q2AutoRating}
      </td>

      {canUpdate && (
        <>
          <td className={`actual-value ${rateCss}`}>
            <NumberInput
              id="kpi-final-rating"
              className="auto-save uk-input uk-form-small"
              placeholder="-"
              value={newQ2Rating}
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
          {measure.q2Rating || measure.q2AutoRating || "-"}
        </td>
      )}
    </tr>
  );
};

interface IMeasureTableProps {
  measures: MeasureCompany[];
  agreement: IScorecardMetadata;
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures, agreement } = props;

  const canUpdate = useMemo(
    () => agreement.quarter2Review.status === "submitted",
    [agreement.quarter2Review.status]
  );
  const isApproved = useMemo(
    () => agreement.quarter2Review.status === "approved",
    [agreement.quarter2Review.status]
  );

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
                  <th>Q2 Rating</th>
                  <th></th>
                </>
              )}
              {isApproved && <th>Q2 Rating</th>}
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
  objective: ObjectiveCompany;
  children?: React.ReactNode;
}
const ObjectiveItem = (props: IObjectiveItemProps) => {
  const { children, objective } = props;

  const { description, perspective, weight } = objective.asJson;
  const { rate, isUpdated } = objective.q3Rating;

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
  objectives: ObjectiveCompany[];
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
  objectives: ObjectiveCompany[];
  hasAccess: boolean;
  handleExportPDF: () => Promise<void>;
  handleExportExcel: () => Promise<void>;
}
const CompanyScorecardQ2Cycle = observer((props: IProps) => {
  const {
    agreement,
    objectives,
    hasAccess,
    handleExportExcel,
    handleExportPDF,
  } = props;

  const [tab, setTab] = useState(ALL_TAB.id);

  const isActive = useMemo(
    () => agreement.quarter2Review.status === "submitted",
    [agreement.quarter2Review.status]
  );

  const filteredObjectivesByPerspective = useMemo(() => {
    const sorted = objectives.sort(sortByPerspective);
    return tab === ALL_TAB.id
      ? sorted
      : sorted.filter((o) => o.asJson.perspective === tab);
  }, [objectives, tab]);

  const handleApproval = () =>
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_Q2_APPROVAL_MODAL);

  const handleRejection = () =>
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_Q2_REJECTION_MODAL);


  if (
    agreement.quarter2Review.status === "pending" ||
    agreement.quarter2Review.status === "in-progress"
  )
    return (
      <ErrorBoundary>
        <NoScorecardData
          title="Company Q1 performance is not submitted."
          subtitle="You cannot view Quarter 2 tab if the quarter is not yet submitted."
          instruction="Please ensure that the company Quarter 1 has been reviewed, and submitted."
        />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="company-plan-view-page uk-section uk-section-small">
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
                                  Approve Quarter 2 Reviews
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
                                  Revert Quarter 2 Reviews for Changes
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
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_Q2_APPROVAL_MODAL}>
          <CompanyScorecardQ2ApprovalModal agreement={agreement} />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_Q2_REJECTION_MODAL}>
          <CompanyScorecardQ2RejectionModal agreement={agreement} />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecardQ2Cycle;
