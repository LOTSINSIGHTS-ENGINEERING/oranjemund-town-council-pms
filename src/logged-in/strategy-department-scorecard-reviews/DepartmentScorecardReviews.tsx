import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomCloseAccordion } from "../../shared/components/accordion/Accordion";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import useTitle from "../../shared/hooks/useTitle";
import Department from "../../shared/models/Department";
import ScorecardBatch, { IScorecardBatch } from "../../shared/models/ScorecardBatch";
import EmptyError from "../admin-settings/EmptyError";

interface IDepartmentScorecardProps {
  scorecardId: string;
  departmentId: string;
  name: string;
  isLocked: boolean;
}
const DepartmentScorecard = (props: IDepartmentScorecardProps) => {
  const { scorecardId, departmentId, name, isLocked } = props;
  const navigate = useNavigate();

  const onUpdate = () => {
    navigate(`${scorecardId}/${departmentId}`);
  };

  return (
    <ErrorBoundary>
      <div className="department-scorecard uk-card uk-card-default uk-card-body uk-card-small">
        <h6 className="name">
          <span className="span-label">Name</span>
          {name} Scorecard
        </h6>
        <div className="controls">
          <button
            disabled={isLocked}
            className="btn btn-primary"
            onClick={onUpdate}
          >
            View <span uk-icon="arrow-right"></span>
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

interface IFYPlanProps {
  scorecardBatch: IScorecardBatch;
  departments: Department[];
}
const FYPlan = observer((props: IFYPlanProps) => {
  const { store } = useAppContext();

  const { scorecardBatch, departments } = props;
  const { description, locked } = scorecardBatch;

  // role + department id
  const department = store.auth.department;
  const role = store.auth.role;

  const fyPlanCssClass = locked ? "FY-plan FY-plan__locked uk-card uk-card-default uk-card-body uk-card-small" : "FY-plan uk-card uk-card-default uk-card-body uk-card-small";

  const filterAccess = useMemo(() => {
    if (role !== USER_ROLES.EMPLOYEE_USER || role !== USER_ROLES.GUEST_USER)
      return departments;
    else if (role === USER_ROLES.EMPLOYEE_USER || role === USER_ROLES.GUEST_USER)
      return departments.filter((dep) => dep.asJson.id === department);
    else return [];
  }, [department, departments, role]);

  return (
    <ErrorBoundary>
      <CustomCloseAccordion
        title={
          <h3 className="custom-title">
            {description}{" "}
            {locked && (
              <>
                <span className="lock-icon" data-uk-icon="icon: lock"></span>
              </>
            )}
          </h3>
        }
      >
        <div className={fyPlanCssClass}>
          {filterAccess.map((department) => (
            <div key={department.asJson.id}>
              <DepartmentScorecard
                scorecardId={scorecardBatch.id}
                departmentId={department.asJson.id}
                name={department.asJson.name}
                isLocked={locked}
              />
            </div>
          ))}
        </div>
      </CustomCloseAccordion>
    </ErrorBoundary>
  );
});

const DepartmentScorecardReviews = observer(() => {
  const { api, store } = useAppContext();

  const [loading, setLoading] = useState(false);
  useTitle("Evalution of strategic scorecards");
  useBackButton();

  const sort = (a: Department, b: Department) => {
    return a.asJson.name.localeCompare(b.asJson.name);
  };

  const sortFY = (a: ScorecardBatch, b: ScorecardBatch) => {
    return b.asJson.description.localeCompare(a.asJson.description);
  };

  useEffect(() => {
    // load data from db
    const loadAll = async () => {
      setLoading(true); // start loading
      try {
        await api.scorecard.getAll();
        await api.department.getAll();
      } catch (error) {
        console.log(error);
      }
      setLoading(false); // stop loading
    };

    loadAll();
  }, [api.department, api.scorecard]);

  return (
    <ErrorBoundary>
      <div className="departmental-scorecard-plan-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          {!loading &&
            store.scorecard.all.sort(sortFY).map((batch) => (
              <div key={batch.asJson.id} className="uk-margin">
                <FYPlan
                  scorecardBatch={batch.asJson}
                  departments={store.department.all.sort(sort)}
                />
              </div>
            ))}

          {/* Empty & not loading */}
          {!store.scorecard.all.length && !loading && (
            <EmptyError errorMessage="No scorecards found" />
          )}

          {/* Loading */}
          {loading && <LoadingEllipsis />}
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default DepartmentScorecardReviews;
