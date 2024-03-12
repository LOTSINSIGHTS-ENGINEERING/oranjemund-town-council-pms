import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import StrategicTheme from "../../shared/models/StrategicTheme";
import EmptyError from "./EmptyError";
import StrategicThemeItem from "./StrategicThemeItem";

const StrategicThemeList = observer(() => {
  const { store } = useAppContext();

  const sortByName = (a: StrategicTheme, b: StrategicTheme) => {
    if (a.asJson.description < b.asJson.description) return -1;
    if (a.asJson.description > b.asJson.description) return 1;
    return 0;
  };

  return (
    <ErrorBoundary>
      <div className="department-list">
        <ErrorBoundary>
          {store.strategicTheme.all.sort(sortByName).map((theme) => (
            <div key={theme.asJson.id}>
              <StrategicThemeItem theme={theme.asJson} />
            </div>
          ))}
        </ErrorBoundary>

        {/* Empty & not loading */}
        <ErrorBoundary>
          {store.strategicTheme.isEmpty && (
            <EmptyError errorMessage="No themes found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default StrategicThemeList;
