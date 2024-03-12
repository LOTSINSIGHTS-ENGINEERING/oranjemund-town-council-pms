import { observer } from "mobx-react-lite";
import BarGraph from "../../../shared/components/graph-components/BarGraph";
import PieChart from "../../../shared/components/graph-components/PieChart";
import { useAppContext } from "../../../shared/functions/Context";
import TopPerformers from "./TopPerformers";
import WorstPerformers from "./WorstPerformers";

const PeopleTabContent = observer(() => {
  const { store } = useAppContext();

  // analytics on people per rating.
  const labels = ["Rating 1", "Rating 2", "Rating 3", "Rating 4", "Rating 5"];
  // user data
  const userData = store.report.allUserPerformanceData;
  // group rating
  const groupRating = userData.reduce(
    (acc, user) => {
      const rate = user.asJson.rating >= 1 ? user.asJson.rating : 1;
      const rating = Math.floor(rate);
      const pos = rating - 1;

      acc[pos] = acc[pos] + 1; // increment
      return acc;
    },
    [0, 0, 0, 0, 0]
  );
  // top performers
  const topPerformers = userData.filter((user) => user.asJson.rating >= 3);
  // worst performers
  const worstPerformers = userData.filter((user) => user.asJson.rating < 3);

  return (
    <div className="people-tab-content">
      <div className="uk-grid-small uk-child-width-1-2@l" data-uk-grid>
        <div>
          <div
            className="uk-card uk-card-default uk-card-small uk-card-body"
            style={{ height: 500 }}
          >
            <BarGraph
              title="Rating"
              ylabel="People"
              labels={labels}
              data={groupRating}
              scales={{ y: { min: 0, max: 100 } }}
            />
          </div>
        </div>
        <div>
          <div
            className="uk-card uk-card-default uk-card-small uk-card-body"
            style={{ height: 500 }}
          >
            <PieChart
              title="Rating"
              ylabel="People"
              labels={labels}
              data={groupRating}
            />
          </div>
        </div>
      </div>
      <div className="uk-grid-small uk-child-width-1-2@l" data-uk-grid>
        <div>
          <TopPerformers
            data={topPerformers}
            departments={store.department.all}
          />
        </div>
        <div>
          <WorstPerformers
            data={worstPerformers}
            departments={store.department.all}
          />
        </div>
      </div>
    </div>
  );
});

export default PeopleTabContent;
