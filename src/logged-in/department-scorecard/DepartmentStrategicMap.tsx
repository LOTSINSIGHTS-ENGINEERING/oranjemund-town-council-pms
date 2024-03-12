import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import Node from "./Node";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../shared/interfaces/IPerspectiveTabs";
import VisionMission from "../../shared/components/vision-mission/VisionMission";
import { Fragment } from "react";
import NodeRow from "../shared/components/map-node-row/NodeRow";

const DepartmentStrategicMap = observer(() => {
  const { store } = useAppContext();

  const getObjectivesPerPerspective = (perspective: string) => {
    return store.departmentObjective.all.filter((objective) => objective.asJson.perspective === perspective).map((objective) => objective.asJson);
  };



  return (
    <div className="strategic-map uk-card uk-card-default uk-card-body uk-card-small uk-margin">
      <div className="map">
        <VisionMission />

        <table className="objectives">
          <tbody>
            <NodeRow perspective="Financial">
              {getObjectivesPerPerspective(FINANCIAL_TAB.id).map(
                (objective) => (
                  <Fragment key={objective.id}>
                    <Node objective={objective} />
                  </Fragment>
                )
              )}
            </NodeRow>
            <NodeRow perspective="Customer">
              {getObjectivesPerPerspective(CUSTOMER_TAB.id).map((objective) => (
                <Fragment key={objective.id}>
                  <Node objective={objective} />
                </Fragment>
              ))}
            </NodeRow>
            <NodeRow perspective="Internal Process">
              {getObjectivesPerPerspective(PROCESS_TAB.id).map((objective) => (
                <Fragment key={objective.id}>
                  <Node objective={objective} />
                </Fragment>
              ))}
            </NodeRow>
            <NodeRow perspective="Learning and Growth">
              {getObjectivesPerPerspective(GROWTH_TAB.id).map((objective) => (
                <Fragment key={objective.id}>
                  <Node objective={objective} />
                </Fragment>
              ))}
            </NodeRow>
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default DepartmentStrategicMap;
