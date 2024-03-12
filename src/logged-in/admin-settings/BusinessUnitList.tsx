import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import BusinessUnit from "../../shared/models/BusinessUnit";
import BusinessUnitItem from "./BusinessUnitItem";
import EmptyError from "./EmptyError";

const BusinessUnitList = observer(() => {
  const { store } = useAppContext();

  const sortByName = (a: BusinessUnit, b: BusinessUnit) => {
    if (a.asJson.name < b.asJson.name) return -1;
    if (a.asJson.name > b.asJson.name) return 1;
    return 0;
  };

  return (
    <ErrorBoundary>
      <div className="business-unit-list">
        <ErrorBoundary>
          {store.businessUnit.all.sort(sortByName).map((bu) => (
            <div key={bu.asJson.id}>
              <BusinessUnitItem businessUnit={bu.asJson} />
            </div>
          ))}
        </ErrorBoundary>

        {/* Empty & not loading */}
        <ErrorBoundary>
          {!store.businessUnit.all.length && (
            <EmptyError errorMessage="No business units found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default BusinessUnitList;
