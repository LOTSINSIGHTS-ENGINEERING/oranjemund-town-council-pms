import { observer } from "mobx-react-lite";
import BarGraph from "../../../shared/components/graph-components/BarGraph";
import { useAppContext } from "../../../shared/functions/Context";

const ExecutionTabContent = observer(() => {
  const { store } = useAppContext();

  // analytics on people per rating.
  const labels = ["Group 1", "Group 2", "Group 3", "Group 4", "Group 5"];
  // user data
  const userData = store.report.allUserPerformanceData;

  const executionRate = userData.reduce(
    (acc, user) => {
      const rate = user.asJson.rating >= 1 ? user.asJson.rating : 1;
      const rating = Math.floor(rate);
      const pos = rating - 1;

      acc[pos] = acc[pos] + 1; // increment
      return acc;
    },
    [0, 0, 0, 0, 0]
  );

  const divideGroups = executionRate.map((rates) => {
    return rates / 5;
  });

  return (
    <div className="people-tab-content">
      <div className="uk-grid-small uk-child-width-1-1@l" data-uk-grid>
        <div>
          <div
            className="uk-card uk-card-default uk-card-small uk-card-body"
            style={{ height: 500 }}
          >
            <BarGraph
              title="Execution Rate"
              ylabel="Rate"
              labels={labels}
              data={divideGroups}
              scales={{ y: { min: 0, max: 100 } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ExecutionTabContent;
