import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import { IDepartment } from "../../shared/models/Department";
import { IScorecardMetadata, defaultScorecardMetadata } from "../../shared/models/ScorecardMetadata";

interface IDepartmentProps {
  department: IDepartment;
}
const Department = (props: IDepartmentProps) => {
  const { store } = useAppContext();
  const { department } = props;

  const scorecards: IScorecardMetadata[] = store.user.all.map((user) => {
    const agreement = store.individualScorecardMetadata.all.find(
      (agreement) => agreement.asJson.uid === user.asJson.uid
    );

    const departmentName = department ? department.name : "Unknown";

    const $agreement = agreement
      ? {
        ...defaultScorecardMetadata,
        ...agreement.asJson,
        department: department.id,
        departmentName: departmentName,
        uid: user.asJson.uid,
        displayName: user.asJson.displayName || "Unknown",
      }
      : {
        ...defaultScorecardMetadata,
        uid: user.asJson.uid,
        department: department.id,
        departmentName: departmentName,
        displayName: user.asJson.displayName || "Unknown",
      };

    return $agreement;
  });

  const approvedSum = scorecards.reduce((prev, curr) => {
    const match = curr.agreementDraft.status === "approved" ? 1 : 0;
    return prev + match;
  }, 0);

  const submittedSum = scorecards.reduce((prev, curr) => {
    const match = curr.agreementDraft.status === "submitted" ? 1 : 0;
    return prev + match;
  }, 0);

  const pendingSum = scorecards.reduce((prev, curr) => {
    const match = curr.agreementDraft.status === "pending" ? 1 : 0;
    return prev + match;
  }, 0);

  const progress = (submittedSum / scorecards.length) * 100;
  const dataAttr = progress < 80 ? "danger" : "success";

  return (
    <div className="department uk-margin">
      <h6 className="department--name">
        {department.name} (
        <span className="department--progress-bar-text">
          {progress.toFixed(1)}%
        </span>
        )
      </h6>
      <div className="department--progress">
        <div
          className="department--progress-bar"
          data-progress-status={dataAttr}
          style={{ width: progress.toFixed(1) + "%" }}
        ></div>
      </div>
    </div>
  );
};

const ProgressStats = observer(() => {
  const { store } = useAppContext();

  const departments = store.department.all.map((d) => d.asJson);
  const scorecards: IScorecardMetadata[] = store.user.all.map((user) => {
    const agreement = store.individualScorecardMetadata.all.find(
      (agreement) => agreement.asJson.uid === user.asJson.uid
    );

    const department = store.department.getById(user.asJson.department);
    const departmentName = department ? department.asJson.name : "Unknown";
    const $agreement = agreement
      ? {
        ...defaultScorecardMetadata,
        ...agreement.asJson,
        department: user.asJson.department,
        departmentName: departmentName,
        uid: user.asJson.uid,
        displayName: user.asJson.displayName || "Unknown",
      }
      : {
        ...defaultScorecardMetadata,
        uid: user.asJson.uid,
        department: user.asJson.department,
        departmentName: departmentName,
        displayName: user.asJson.displayName || "Unknown",
      };

    return $agreement;
  });

  return (
    <ErrorBoundary>
      <div className="review-stats">
        <h6 className="title">Progress Statitics (Draft)</h6>

        {departments.map((department) => (
          <ErrorBoundary key={department.id}>
            <Department department={department} />
          </ErrorBoundary>
        ))}
      </div>
    </ErrorBoundary>
  );
});

export default ProgressStats;
