import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import Department from "../../shared/models/Department";
import DepartmentItem from "./DepartmentItem";
import EmptyError from "./EmptyError";

const DepartmentList = observer(() => {
  const { store } = useAppContext();

  const sortByName = (a: Department, b: Department) => {
    if (a.asJson.name < b.asJson.name) return -1;
    if (a.asJson.name > b.asJson.name) return 1;
    return 0;
  };

  return (
    <ErrorBoundary>
      <div className="department-list">
        <ErrorBoundary>
          {store.department.all.sort(sortByName).map((department) => (
            <div key={department.asJson.id}>
              <DepartmentItem department={department.asJson} />
            </div>
          ))}
        </ErrorBoundary>

        {/* Empty & not loading */}
        <ErrorBoundary>
          {store.department.isEmpty && (
            <EmptyError errorMessage="No departments found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default DepartmentList;
