import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";
import {
  fullPerspectiveName,
  ALL_TAB,
} from "../../shared/interfaces/IPerspectiveTabs";
import Measure from "../../shared/models/Measure";
import Objective from "../../shared/models/Objective";
import EmptyError from "../admin-settings/EmptyError";
import MODAL_NAMES from "../dialogs/ModalName";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import NoMeasures from "./strategic-list/NoMeasures";
import NoPerformanceData from "./NoPerformanceData";
import { dataFormat } from "../../shared/functions/Directives";
import { generateIndividualPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { exportEmployeeExcelScorecard } from "../shared/functions/Excel";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../shared/components/Modal";
import EmployeeScorecardDraftApprovalModal from "../dialogs/employee-scorecard-draft-approval/EmployeeScorecardDraftApprovalModal";
import EmployeeScorecardDraftRejectionModal from "../dialogs/employee-scorecard-draft-rejection/EmployeeScorecardDraftRejectionModal";
import { IUser } from "../../shared/models/User";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { IScorecardBatch } from "../../shared/models/ScorecardBatch";
import useVM from "../../shared/hooks/useVM";

interface IMeasureTableItemProps {
  measure: Measure;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const measure = props.measure.asJson;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol;

  return (
    <tr className="row">
      <td className="kit-sticky-column no-whitespace">{measure.description}</td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.baseline, dataSymbol)}
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
      <td className="no-whitespace">
        {dataFormat(dataType, measure.annualTarget, dataSymbol)}
      </td>
    </tr>
  );
};
interface IPerformanceAgreementDraftProps {
  measures: Measure[];
}
const MeasureTable = observer((props: IPerformanceAgreementDraftProps) => {
  const { measures } = props;

  return (
    <div className="measure-table">
      {measures.length !== 0 && (
        <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th className="uk-width-expand@s kit-sticky-column no-whitespace">
                Measure/KPI
              </th>
              <th>Baseline</th>
              <th>Rate 1</th>
              <th>Rate 2</th>
              <th>Rate 3</th>
              <th>Rate 4</th>
              <th>Rate 5</th>
              <th>Annual Target</th>
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
});

interface IObjectiveItemProps {
  objective: Objective;
  children?: React.ReactNode;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { objective, children } = props;
  const { perspective, description, weight } = objective.asJson;

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
});

interface IStrategicListProps {
  tab: string;
  user: IUser;
}
const StrategicList = observer((props: IStrategicListProps) => {
  const { store } = useAppContext();
  const { tab, user } = props;

  const objectives = useMemo(() => {
    const _objectives = store.objective.getByUid(user.uid);

    return tab === ALL_TAB.id
      ? _objectives
      : _objectives.filter((o) => o.asJson.perspective === tab);
  }, [store.objective, tab, user]);

  return (
    <ErrorBoundary>
      <div className="objective-table uk-margin">
        <ErrorBoundary>
          {objectives.map((objective) => (
            <ObjectiveItem key={objective.asJson.id} objective={objective}>
              <MeasureTable measures={objective.measures} />
            </ObjectiveItem>
          ))}
        </ErrorBoundary>

        {/* Empty */}
        <ErrorBoundary>
          {objectives.length === 0 && (
            <EmptyError errorMessage="No objective found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

const EmployeeReviewDraftCycle = observer(() => {
  const { api, store } = useAppContext();
  const { uid } = useParams();
  const [tab, setTab] = useState(ALL_TAB.id);

  const { agreement, loading } = useIndividualScorecard(uid);
  const { vision, mission } = useVM();

  const user = store.user.selected;
  const scorecard = store.scorecard.active;
  const allUsers = store.user.all;

  const isDisabled = useMemo(
    () => !(agreement.agreementDraft.status === "submitted"),
    [agreement.agreementDraft.status]
  );

  const loadCompanyAndDepartmnBeforeExport = async (
    scorecard: IScorecardBatch,
    user: IUser
  ) => {
    try {
      // Only get when exporting and drafting.
      await api.companyMeasure.getAll(scorecard.id);
      await api.companyObjective.getAll(scorecard.id);

      // Get all on-load.
      await api.departmentMeasure.getAll(scorecard.id, user.department);
      await api.departmentObjective.getAll(scorecard.id, user.department);
    } catch (error) {
      console.log(error);
    }
  };

  // Export reports
  const handleExportPDF = async () => {
    if (!scorecard || !user) return;
    await loadCompanyAndDepartmnBeforeExport(scorecard, user);

    const title = `${user.displayName} ${scorecard.description}`;
    const objectives = store.objective.getByUid(user.uid);
    const measures = store.measure.getByUid(user.uid);
    const username = user.displayName;
    const position = user.jobTitle;
    const supervisor = allUsers.find((u) => u.asJson.uid === user.supervisor)
      .asJson.displayName;

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
        username,
        position,
        supervisor
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportExcel = async () => {
    if (!scorecard || !user) return;
    await loadCompanyAndDepartmnBeforeExport(scorecard, user);

    const title = `${user.displayName} ${scorecard.description} Scorecard`;
    const objectives = store.objective.getByUid(user.uid);
    const measures = store.measure.getByUid(user.uid);

    const strategicObjectives =
      [
        ...store.departmentObjective.all.map((o) => o.asJson),
        ...store.companyObjective.all.map((o) => o.asJson),
      ] || [];
    const contributoryObjectives = objectives.map((o) => o.asJson) || [];
    const allmeasures = measures.map((o) => o.asJson) || [];

    try {
      await exportEmployeeExcelScorecard(
        title,
        strategicObjectives,
        contributoryObjectives,
        allmeasures
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproval = () => {
    store.individualScorecardMetadata.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.SCORECARD_DRAFT_APPROVAL_MODAL);
  };
  const handleRejection = () => {
    store.individualScorecardMetadata.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.SCORECARD_DRAFT_REJECTION_MODAL);
  };

  if (loading)
    return (
      <ErrorBoundary>
        <LoadingEllipsis />
      </ErrorBoundary>
    );

  if (
    agreement.agreementDraft.status === "pending" ||
    agreement.agreementDraft.status === "in-progress"
  )
    return (
      <ErrorBoundary>
        <NoPerformanceData title="Performance scorecard not submitted." />
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
                  <Tabs tab={tab} setTab={setTab} noMap />
                </ErrorBoundary>
              }
              rightControls={
                <ErrorBoundary>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    onClick={handleExportPDF}
                    title="Export scorecard as PDF."
                  >
                    <span data-uk-icon="icon: file-pdf; ratio:.8"></span> Export
                    PDF
                  </button>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    onClick={handleExportExcel}
                    title="Export scorecard as EXCEL."
                  >
                    <FontAwesomeIcon
                      icon={faFileExcel}
                      size="lg"
                      className="icon uk-margin-small-right"
                    />
                    Export Excel
                  </button>
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleApproval}
                          disabled={isDisabled}
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
                          disabled={isDisabled}
                        >
                          <span
                            className="icon"
                            data-uk-icon="icon: close; ratio:.8"
                          ></span>
                          Revert Performance Scorecard for Changes
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            {user && <StrategicList tab={tab} user={user} />}
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.SCORECARD_DRAFT_APPROVAL_MODAL}>
          <EmployeeScorecardDraftApprovalModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.SCORECARD_DRAFT_REJECTION_MODAL}>
          <EmployeeScorecardDraftRejectionModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default EmployeeReviewDraftCycle;
