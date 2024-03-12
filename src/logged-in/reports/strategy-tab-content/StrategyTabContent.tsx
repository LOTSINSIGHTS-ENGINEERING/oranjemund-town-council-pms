import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import Objectives from "./Objectives";
import Measures from "./Measures";

const StrategyTabContent = observer(() => {
  const { store } = useAppContext();

  return (
    <div className="strategy-tab-content">
      <div
        className="uk-grid-small uk-child-width-1-1@m uk-grid-match"
        data-uk-grid>
        <div>
          <Objectives objectives={store.companyObjective.all} />
        </div>
        <div>
          <Measures measures={store.companyMeasure.all} />
        </div>
      </div>
    </div>
  );
});

export default StrategyTabContent;
