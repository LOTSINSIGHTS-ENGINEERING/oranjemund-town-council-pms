import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import { dataFormat } from "../../shared/functions/Directives";
import showModalFromId from "../../shared/functions/ModalShow";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";
import { ALL_TAB, fullPerspectiveName } from "../../shared/interfaces/IPerspectiveTabs";
import Measure from "../../shared/models/Measure";
import Objective from "../../shared/models/Objective";
import { IUser } from "../../shared/models/User";
import EmptyError from "../admin-settings/EmptyError";
import EmployeeScorecardQ2ApprovalModal from "../dialogs/employee-scorecard-q2-approval/EmployeeScorecardQ2ApprovalModal";
import EmployeeScorecardQ2RejectionModal from "../dialogs/employee-scorecard-q2-rejection/EmployeeScorecardQ2RejectionModal";
import MODAL_NAMES from "../dialogs/ModalName";
import NumberInput, { NumberInputValue } from "../shared/components/number-input/NumberInput";
import Rating from "../shared/components/rating/Rating";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import { rateColor } from "../shared/functions/Scorecard";
import NoPerformanceData from "./NoPerformanceData";
import NoMeasures from "./strategic-list/NoMeasures";

// Midterm Scorecard Content
interface IMeasureTableItemProps {
  measure: Measure;
  canUpdate: boolean;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { api } = useAppContext();
  const { canUpdate } = props;
  const measure = props.measure.asJson;

  const [newMidtermRating, setNewMidtermRating] = useState<number | null>(
    () => measure.midtermRating
  );
  const [unsavedChanges, setunSavedChanges] = useState(false);

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol;

  const rateCss = rateColor(
    Number(measure.midtermRating) || measure.midtermAutoRating,
    measure.isUpdated
  );

  const onRate = (value: string | number) => {
    let _rating = NumberInputValue(value);
    if (_rating && _rating > 5) _rating = 5;
    if (_rating && _rating < 1) _rating = 1;

    setNewMidtermRating(_rating);

    if (measure.midtermRating === value) setunSavedChanges(false);
    else setunSavedChanges(true);
  };

  const handleUpdate = async () => {
    const isUpdated = newMidtermRating || measure.midtermActual ? true : false;

    try {
      const $measure = {
        ...measure,
        midtermRating: newMidtermRating,
        isUpdated,
      };
      await api.measure.update($measure, ["midtermRating", "isUpdated"]);
      setunSavedChanges(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ErrorBoundary>
      <tr className="row">
        <td>
          <div className={`status ${rateCss}`}></div>
        </td>
        <td className="kit-sticky-column no-whitespace">
          {measure.description}
        </td>
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
        <td className="no-whitespace">
          {dataFormat(dataType, measure.midtermActual, dataSymbol)}
        </td>
        <td className={`no-whitespace actual-value ${rateCss}`}>
          {measure.midtermAutoRating} 
        </td>

        {canUpdate ? (
          <>
            <td className={`actual-value ${rateCss}`}>
              <NumberInput
                id="kpi-final-rating"
                className="auto-save uk-input uk-form-small"
                placeholder="-"
                value={newMidtermRating}
                onChange={onRate}
                min={1}
                max={5}
              />
            </td>
            <td>
              <div className="controls">
                {unsavedChanges && (
                  <button className="btn-icon" onClick={handleUpdate}>
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
        ) : (
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
  canUpdate: boolean;
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures, canUpdate } = props;

  return (
    <ErrorBoundary>
      <div className="measure-table">
        {measures.length !== 0 && (
          <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
            <thead className="header">
              <tr>
                <th></th>
                <th className="uk-width-expand@s kit-sticky-column no-whitespace">
                  KPI
                </th>
                <th>Baseline</th>
                <th>Rate 1</th>
                <th>Rate 2</th>
                <th>Rate 3</th>
                <th>Rate 4</th>
                <th>Rate 5</th>
                <th>Annual Target</th>
                <th>Progress Update</th>
                <th>Rating</th>
                <th>Midterm Rating</th>
                {canUpdate && <th></th>}
              </tr>
            </thead>
            <tbody>
              {measures.map((measure) => (
                <MeasureTableItem
                  key={measure.asJson.id}
                  measure={measure}
                  canUpdate={canUpdate}
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

interface IObjectivesListProps {
  tab: string;
  user: IUser;
  canUpdate: boolean;
}
const ObjectivesList = observer((props: IObjectivesListProps) => {
  const { store } = useAppContext();
  const { tab, user, canUpdate } = props;

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
              <MeasureTable
                measures={objective.measures}
                canUpdate={canUpdate}
              />
            </ObjectiveItem>
          ))}
        </ErrorBoundary>

        {/* Empty */}
        <ErrorBoundary>
          {!objectives.length && (
            <EmptyError errorMessage="No objective found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

// Midterm Scorecard Content
const EmployeeReviewQ2Cycle = observer(() => {
  const { store, ui } = useAppContext();
  const { uid } = useParams();
  const [tab, setTab] = useState(ALL_TAB.id);
  const { agreement, loading } = useIndividualScorecard(uid);

  const user = store.user.selected;
  const allUsers = store.user.all;

  const isDisabled = useMemo(
    () => !(agreement.quarter2Review.status === "submitted"),
    [agreement.quarter2Review.status]
  );

  const incompleteReviewError = useMemo(
    () =>
      user &&
      (store.measure.getByUid(user.uid) as Measure[]).some(
        (m) => m.asJson.midtermRating === null
      ),
    [store.measure, user]
  );

  const canUpdate = useMemo(
    () => agreement.quarter2Review.status === "submitted",
    [agreement]
  );

  const handleApproval = () => {
    if (incompleteReviewError) {
      ui.snackbar.load({
        id: Date.now(),
        type: "danger",
        message: "In complete review. Some measures are not rated.",
        timeoutInMs: 10000,
      });
      return;
    }
    store.individualScorecardMetadata.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.SCORECARD_Q2_APPROVAL_MODAL);
  };

  const handleRejection = () => {
    store.individualScorecardMetadata.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.SCORECARD_Q2_REJECTION_MODAL);
  };

  if (loading)
    return (
      <ErrorBoundary>
        <LoadingEllipsis />
      </ErrorBoundary>
    );

  if (
    agreement.quarter2Review.status === "pending" ||
    agreement.quarter2Review.status === "in-progress"
  )
    return (
      <ErrorBoundary>
        <NoPerformanceData title="Midterm progress not submitted." />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="scorecard-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={<Tabs tab={tab} setTab={setTab} noMap />}
              rightControls={
                <ErrorBoundary>
                  {/* <button className="btn btn-primary uk-margin-small-right">
                    <span data-uk-icon="icon: file-pdf; ratio:.8"></span> Export
                    PDF
                  </button> */}

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
                          Approve Midterm Reviews
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
                          Revert Midterm Reviews for Changes
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            {user && (
              <ObjectivesList tab={tab} user={user} canUpdate={canUpdate} />
            )}
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.SCORECARD_Q2_APPROVAL_MODAL}>
          <EmployeeScorecardQ2ApprovalModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.SCORECARD_Q2_REJECTION_MODAL}>
          <EmployeeScorecardQ2RejectionModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default EmployeeReviewQ2Cycle;
