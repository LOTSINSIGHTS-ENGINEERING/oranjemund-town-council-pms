import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import EmptyError from "../admin-settings/EmptyError";
import CheckInYearItem from "./CheckInYearItem";

const CheckInYearList = observer(() => {
  const { store } = useAppContext();
  const years = store.checkIn.checkInYear.all;

  return (
    <ErrorBoundary>
      <div className="years-list">
        <div className="uk-grid-small" data-uk-grid>
          {years.sort((a, b) => b.asJson.createdAt - a.asJson.createdAt).map((year) => (
            <CheckInYearItem key={year.asJson.id} year={year.asJson} />
          ))}
        </div>
        <ErrorBoundary>
          {!years.length && (
            <EmptyError errorMessage="No years found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default CheckInYearList;