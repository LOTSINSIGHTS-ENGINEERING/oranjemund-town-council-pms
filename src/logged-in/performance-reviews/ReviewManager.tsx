import { useAppContext } from "../../shared/functions/Context";
import EmptyError from "../admin-settings/EmptyError";
import showModalFromId from "../../shared/functions/ModalShow";
import MODAL_NAMES from "../dialogs/ModalName";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { exportPerformanceOverview } from "../shared/functions/Excel";

interface IReviewPeopleProps {
  scorecards: IScorecardMetadata[];
}
const ReviewManager = observer((props: IReviewPeopleProps) => {
  const { scorecards } = props;
  const { store } = useAppContext();

  const statusClassName = (status: string) => `status status__${status}`;

  const onExportExcel = async () => {
    await exportPerformanceOverview(scorecards);
  };

  const onView = (view: any) => {
    showModalFromId(MODAL_NAMES.PERFORMANCE_REVIEW.REVIEW_MODAL);
    store.individualScorecardMetadata.select(view);
  };

  return (
    <ErrorBoundary>
      <div className="review-staff">
        <div className="review-staff--toolbar uk-margin">
          <h6 className="title">Scorecard Reviews</h6>
          <span>
            <button
              className="btn btn-primary uk-margin-left"
              onClick={onExportExcel}
            >
              Export Report
            </button>
          </span>
        </div>
        <table className="people-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th>#</th>
              <th className="uk-width-expand@s">Name</th>
              <th>Department</th>
              <th>Scorecard</th>
              <th>Midterm</th>
              <th>Assessment</th>
            </tr>
          </thead>
          <tbody>
            {scorecards.map((scorecard, index) => (
              <tr
                className="row"
                key={scorecard.uid}
                onClick={() => onView(scorecard)}
              >
                <td>{index + 1}</td>
                <td>{scorecard.displayName}</td>
                <td>{scorecard.departmentName}</td>
                <td>
                  <div className={statusClassName(scorecard.agreementDraft.status)} >
                    {scorecard.agreementDraft.status}
                  </div>
                </td>
                <td>
                  <div
                    className={statusClassName(scorecard.quarter2Review.status)}
                  >
                    {scorecard.quarter2Review.status}
                  </div>
                </td>
                <td>
                  <div
                    className={statusClassName(scorecard.quarter4Review.status)}
                  >
                    {scorecard.quarter4Review.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!store.user.all.length && <EmptyError errorMessage="No users found" />}
      </div>
    </ErrorBoundary>
  );
});

export default ReviewManager;
