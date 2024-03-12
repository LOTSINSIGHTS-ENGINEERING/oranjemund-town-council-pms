import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import VisionMisionItem from "./VisionMisionItem";
import EmptyError from "./EmptyError";

const VisionMisionList = observer(() => {
  const { store } = useAppContext();

  return (
    <ErrorBoundary>
      <div className="department-list">
        <ErrorBoundary>
          {store.visionmission.all.map((vm) => (
            <div key={vm.asJson.id}>
              <VisionMisionItem vm={vm.asJson} />
            </div>
          ))}
        </ErrorBoundary>
        <ErrorBoundary>
          {store.visionmission.isEmpty && (
            <EmptyError errorMessage="No data found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default VisionMisionList;
