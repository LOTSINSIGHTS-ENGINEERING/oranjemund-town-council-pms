import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";
import useMailer from "../../shared/hooks/useMailer";
import {
  ALL_TAB,
  CUSTOMER_TAB,
  FINANCIAL_TAB,
  fullPerspectiveName,
  GROWTH_TAB,
  MAP_TAB,
  PROCESS_TAB,
} from "../../shared/interfaces/IPerspectiveTabs";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { IScorecardReview } from "../../shared/models/ScorecardReview";
import MODAL_NAMES from "../dialogs/ModalName";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import StrategicMap from "./strategic-map/EmployeeStrategicMap";
import { generateIndividualPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import {
  faPaperPlane,
  faCheck,
  faFilePdf,
  faHistory,
  faFileExcel,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { exportEmployeeExcelScorecard } from "../shared/functions/Excel";
import NoScorecardData from "../shared/components/no-scorecard-data/NoScorecardData";
import { useNavigate } from "react-router-dom";
import { dataFormat } from "../../shared/functions/Directives";
import Measure from "../../shared/models/Measure";
import Objective, { IObjective } from "../../shared/models/Objective";
import EmptyError from "../admin-settings/EmptyError";
import Rating from "../shared/components/rating/Rating";
import { rateColor } from "../shared/functions/Scorecard";
import NoMeasures from "./NoMeasures";
import Modal from "../../shared/components/Modal";
import {
  MAIL_SCORECARD_Q2_SUBMITTED_MANAGER,
  MAIL_SCORECARD_Q2_SUBMITTED_ME,
} from "../../shared/functions/mailMessages";
import MeasureUpdateMidtermActualModal from "../dialogs/measure-update-midterm-actual/MeasureUpdateMidtermActualModal";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import useVM from "../../shared/hooks/useVM";

const MoreButton = observer(() => {
  const { api, ui, store } = useAppContext();
  const { mailSupervisor, mailMe } = useMailer();
  const { agreement, loading } = useIndividualScorecard();

  const me = store.auth.meJson;
  const objectives = store.objective.allMe;
  const measures = store.measure.allMe;
  const measureAudits = store.measureAudit.allMe;
  const midtermApi = api.individualScorecardReview.quarter2;
  const scorecard = store.scorecard.active;

  const status = useMemo(
    () => agreement.quarter2Review.status,
    [agreement.quarter2Review.status]
  );

  const isDisabled = useMemo(
    () => !scorecard || scorecard.midtermReview.status !== "in-progress",
    [scorecard]
  );

  const onSubmitScorecardForMidtermReview = async () => {
    if (!me) return;
    const _objectives = objectives.map((o) => o.asJson);
    const _measures = measures.map((m) => m.asJson);
    const _measureAudits = measureAudits.map((m) => m.asJson);

    const $review = midtermApi.transform(
      me,
      _objectives,
      _measures,
      _measureAudits
    );
    const $agreement = agreement;
    $agreement.quarter2Review.status = "submitted";
    $agreement.quarter2Review.submittedOn = new Date().toDateString();
    const { SUBJECT, BODY } = MAIL_SCORECARD_Q2_SUBMITTED_MANAGER(
      me.displayName
    );
    const { MY_SUBJECT, MY_BODY } = MAIL_SCORECARD_Q2_SUBMITTED_ME(
      me.displayName
    );

    await onUpdate($agreement, $review);
    await mailSupervisor(SUBJECT, BODY);
    await mailMe(MY_SUBJECT, MY_BODY);
  };

  const onUpdate = async (
    agreement: IScorecardMetadata,
    review: IScorecardReview
  ) => {
    try {
      await midtermApi.create(review);
      await api.individualScorecardMetadata.create(agreement);
      ui.snackbar.load({
        id: Date.now(),
        message: "Submitted midterm progress for review.",
        type: "success",
      });
    } catch (error) {
      // console.log(error);
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to submit your midterm progress for review.",
        type: "danger",
      });
    }
  };

  const onViewMidtermReview = () =>
    showModalFromId(MODAL_NAMES.EXECUTION.VIEW_REVIEW_MODAL);

  if (loading)
    return (
      <ErrorBoundary>
        <LoadingEllipsis />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      {status === "in-progress" && (
        <button
          className="kit-dropdown-btn"
          onClick={onSubmitScorecardForMidtermReview}
          disabled={isDisabled}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="icon uk-margin-small-right"
          />
          Submit Midterm Progress for Review
        </button>
      )}
      {status === "submitted" && (
        <button className="kit-dropdown-btn" disabled>
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          Submitted Midterm Progress for Review
        </button>
      )}
      {status === "approved" && (
        <button className="kit-dropdown-btn" onClick={onViewMidtermReview}>
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          View Midterm Review
        </button>
      )}
    </ErrorBoundary>
  );
});

interface IMeasureTableItemProps {
  measure: Measure;
  gotoPortofolio: () => void;
  canUpdate: boolean;
  isApproved: boolean;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { store } = useAppContext();
  const { gotoPortofolio, canUpdate, isApproved } = props;
  const measure = props.measure.asJson;

  const rateCss = rateColor(
    Number(measure.midtermRating) || measure.midtermAutoRating,
    measure.isUpdated
  );

  const handleEditComments = () => {
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MODAL);
  };

  const handleUpdateProgress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_MIDTERM_ACTUAL_MODAL);
  };

  return (
    <ErrorBoundary>
      <tr className="row">
        <td>
          <div className={`status ${rateCss}`}></div>
        </td>
        <td>
          {measure.description}
          <button
            className="comments-btn btn-text uk-margin-small-left"
            onClick={handleEditComments}
            data-uk-icon="icon: comment; ratio: 1"
          ></button>
        </td>
        <td className="no-whitespace">
          {dataFormat(measure.dataType, measure.baseline, measure.dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(
            measure.dataType,
            measure.annualTarget,
            measure.dataSymbol
          )}
        </td>
        <td className="no-whitespace">
          {dataFormat(measure.dataType, measure.rating1, measure.dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(measure.dataType, measure.rating2, measure.dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(measure.dataType, measure.rating3, measure.dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(measure.dataType, measure.rating4, measure.dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(measure.dataType, measure.rating5, measure.dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(
            measure.dataType,
            measure.annualActual,
            measure.dataSymbol
          )}
        </td>
        <td className={`no-whitespace actual-value ${rateCss}`}>
          {measure.midtermAutoRating}
        </td>
        {canUpdate && (
          <td>
            <div className="controls">
              <button
                className="btn-icon"
                title="update the progress"
                onClick={handleUpdateProgress}
              >
                <span data-uk-icon="pencil"></span>
              </button>
              <button className="btn-icon" onClick={gotoPortofolio}>
                <span uk-icon="link"></span>
              </button>
            </div>
          </td>
        )}
        {isApproved && (
          <td className={`no-whitespace actual-value ${rateCss}`}>
            {measure.midtermRating || measure.midtermAutoRating || "-"}
          </td>
        )}
      </tr>
    </ErrorBoundary>
  );
};

interface IMeasureTableProps {
  measures: Measure[];
  gotoPortofolio: () => void;
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures, gotoPortofolio } = props;
  const { agreement } = useIndividualScorecard();

  const isApproved = useMemo(
    () => agreement.quarter2Review.status === "approved",
    [agreement]
  );

  const canUpdate = useMemo(
    () => agreement.quarter2Review.status === "in-progress",
    [agreement]
  );

  return (
    <ErrorBoundary>
      <div className="measure-table">
        {measures.length !== 0 && (
          <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
            <thead className="header">
              <tr>
                <th></th>
                <th className="uk-width-expand@s">Measure/KPI</th>
                <th>Baseline</th>
                <th>Annual Target</th>
                <th>Rate 1</th>
                <th>Rate 2</th>
                <th>Rate 3</th>
                <th>Rate 4</th>
                <th>Rate 5</th>
                <th>Progress</th>
                <th>Rating</th>
                {canUpdate && <th></th>}
                {isApproved && <th>Midterm Rating</th>}
              </tr>
            </thead>

            <tbody>
              {measures.map((measure) => (
                <MeasureTableItem
                  key={measure.asJson.id}
                  measure={measure}
                  gotoPortofolio={gotoPortofolio}
                  canUpdate={canUpdate}
                  isApproved={isApproved}
                />
              ))}
            </tbody>
          </table>
        )}

        {measures.length === 0 && <NoMeasures />}
      </div>
    </ErrorBoundary>
  );
});

interface IObjectiveItemProps {
  objective: Objective;
  children?: React.ReactNode;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { objective, children } = props;
  const { weight, description, perspective } = objective.asJson;
  // const { rate, isUpdated } = objective.rating;
  const { rate, isUpdated } = objective.midtermRating;

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
});

interface IStrategicListProps {
  tab: string;
}
const StrategicList = observer((props: IStrategicListProps) => {
  const { store } = useAppContext();
  const { tab } = props;
  const navigate = useNavigate();

  // Get objectives that belong to tab
  const objectives = useMemo(() => {
    if (tab === ALL_TAB.id) return store.objective.allMe;

    return store.objective.allMe.filter(
      (objective) => objective.asJson.perspective === tab
    );
  }, [store.objective.allMe, tab]);

  const handleGotoPortfolioOfEvidence = (objective: IObjective) => {
    const fyid = store.scorecard.activeId;
    if (!fyid) return;

    switch (objective.perspective) {
      case FINANCIAL_TAB.id:
        navigate(`/c/drive/financial_${objective.uid}_${fyid}`);
        break;
      case CUSTOMER_TAB.id:
        navigate(`/c/drive/customer_${objective.uid}_${fyid}`);
        break;
      case PROCESS_TAB.id:
        navigate(`/c/drive/process_${objective.uid}_${fyid}`);
        break;
      case GROWTH_TAB.id:
        navigate(`/c/drive/learning_${objective.uid}_${fyid}`);
        break;

      default:
        navigate(`/c/drive/${objective.uid}`);
        break;
    }
  };

  return (
    <ErrorBoundary>
      <div className="objective-table uk-margin">
        {objectives.map((objective) => (
          <ObjectiveItem key={objective.asJson.id} objective={objective}>
            <MeasureTable
              measures={objective.measures}
              gotoPortofolio={() =>
                handleGotoPortfolioOfEvidence(objective.asJson)
              }
            />
          </ObjectiveItem>
        ))}

        {/* Empty */}
        {!objectives.length && <EmptyError errorMessage="No objective found" />}
      </div>
    </ErrorBoundary>
  );
});

// Midterm Scorecard Content
const IndividualScorecardQ2Cycle = observer(() => {
  const { store } = useAppContext();
  const [tab, setTab] = useState(ALL_TAB.id);

  const scorecard = store.scorecard.active;
  const objectives = store.objective.allMe;
  const measures = store.measure.allMe;
  const { agreement, loading } = useIndividualScorecard();
  const { vision, mission } = useVM();

  // Export reports
  const handleExportPDF = async () => {
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
      generateIndividualPerformanceAgreementPDF(
        title,
        vision,
        mission,
        strategicObjectives,
        contributoryObjectives,
        allMeasures,
        "",
        "",
        "",
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

  const handleScorecards = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.SCORECARD_MODAL);
  };
  const handleFeedback = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.READ_SCORECARD_COMMENT_MODAL);
  };

  if (loading)
    return (
      <ErrorBoundary>
        <LoadingEllipsis />
      </ErrorBoundary>
    );

  if (loading)
    return (
      <ErrorBoundary>
        <LoadingEllipsis />
      </ErrorBoundary>
    );

  if (agreement.agreementDraft.status !== "approved")
    return (
      <ErrorBoundary>
        <NoScorecardData
          title="Individual scorecard is not approved."
          subtitle="You cannot view midterm if the individual scorecard is not yet approved."
          instruction="Please ensure that the scorecard has been uploaded, and approved."
        />
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
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <ErrorBoundary>
                          <MoreButton />
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
            <div className="uk-margin">
              {tab === MAP_TAB.id && <StrategicMap />}
              {tab !== MAP_TAB.id && <StrategicList tab={tab} />}
            </div>
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal
          modalId={MODAL_NAMES.EXECUTION.MEASURE_UPDATE_MIDTERM_ACTUAL_MODAL}
        >
          <MeasureUpdateMidtermActualModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default IndividualScorecardQ2Cycle;
