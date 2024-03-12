import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import Node from "./Node";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import VisionMission from "../../../shared/components/vision-mission/VisionMission";
import { Fragment } from "react";
import NodeRow from "../../shared/components/map-node-row/NodeRow";

const CompanyStrategicMap = observer(() => {
  const { store } = useAppContext();

  const getObjectivesPerPerspective = (perspective: string) => {
    return store.companyObjective.all.filter((objective) => objective.asJson.perspective === perspective).map((objective) => objective.asJson);
  };

  return (
    <div className="strategic-map uk-card uk-card-default uk-card-body uk-card-small">
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

export default CompanyStrategicMap;



{/* 
              // const themes = store.strategicTheme.all;

  // const _operational = themes.find((theme) => theme.asJson.id === THEMES.OPERATIONAL);
  // const _supply = themes.find((theme) => theme.asJson.id === THEMES.SUPPLY);
  // const _harness = themes.find((theme) => theme.asJson.id === THEMES.HARNESS);
  // const _digigtal = themes.find((theme) => theme.asJson.id === THEMES.DIGITAL);

  // const THEMES_NAMES = {
  //   OPERATIONAL: _operational?.asJson.description,
  //   SUPPLY: _supply?.asJson.description,
  //   HARNESS: _harness?.asJson.description,
  //   DIGITAL: _digigtal?.asJson.description,
  // };
    // const getByTheme = (objectives: IObjectiveCompany[], theme: string) => {
  //   return objectives.filter((objective) => objective.theme === theme);
  // };
           <thead>
            <tr className="map-header-row">
              <th></th>
              <th>{THEMES_NAMES.OPERATIONAL}</th>
              <th>{THEMES_NAMES.SUPPLY}</th>
              <th>{THEMES_NAMES.HARNESS}</th>
              <th>{THEMES_NAMES.DIGITAL}</th>
            </tr>
          </thead> <NodeRow
              perspective="Financial"
              operational={getByTheme(
                getObjectivesPerPerspective(FINANCIAL_TAB.id),
                THEMES.OPERATIONAL
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              supply={getByTheme(
                getObjectivesPerPerspective(FINANCIAL_TAB.id),
                THEMES.SUPPLY
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              harness={getByTheme(
                getObjectivesPerPerspective(FINANCIAL_TAB.id),
                THEMES.HARNESS
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              digital={getByTheme(
                getObjectivesPerPerspective(FINANCIAL_TAB.id),
                THEMES.DIGITAL
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
            />

            <NodeRow
              perspective="Customer"
              operational={getByTheme(
                getObjectivesPerPerspective(CUSTOMER_TAB.id),
                THEMES.OPERATIONAL
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              supply={getByTheme(
                getObjectivesPerPerspective(CUSTOMER_TAB.id),
                THEMES.SUPPLY
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              harness={getByTheme(
                getObjectivesPerPerspective(CUSTOMER_TAB.id),
                THEMES.HARNESS
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              digital={getByTheme(getObjectivesPerPerspective(CUSTOMER_TAB.id), THEMES.DIGITAL).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
            />

            <NodeRow
              perspective="Internal Process"
              operational={getByTheme(
                getObjectivesPerPerspective(PROCESS_TAB.id),
                THEMES.OPERATIONAL
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              supply={getByTheme(
                getObjectivesPerPerspective(PROCESS_TAB.id),
                THEMES.SUPPLY
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              harness={getByTheme(
                getObjectivesPerPerspective(PROCESS_TAB.id),
                THEMES.HARNESS
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              digital={getByTheme(
                getObjectivesPerPerspective(PROCESS_TAB.id),
                THEMES.DIGITAL
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
            />

            <NodeRow
              perspective="Learning and Growth"
              operational={getByTheme(
                getObjectivesPerPerspective(GROWTH_TAB.id),
                THEMES.OPERATIONAL
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              supply={getByTheme(
                getObjectivesPerPerspective(GROWTH_TAB.id),
                THEMES.SUPPLY
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              harness={getByTheme(
                getObjectivesPerPerspective(GROWTH_TAB.id),
                THEMES.HARNESS
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
              digital={getByTheme(
                getObjectivesPerPerspective(GROWTH_TAB.id),
                THEMES.DIGITAL
              ).map((objective) => (
                <ErrorBoundary key={objective.id}>
                  <Node objective={objective} />
                </ErrorBoundary>
              ))}
            /> */}