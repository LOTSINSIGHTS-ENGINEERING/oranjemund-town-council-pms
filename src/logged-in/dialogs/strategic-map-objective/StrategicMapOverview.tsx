import { observer } from "mobx-react-lite";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { currencyFormat } from "../../../shared/functions/Directives";
import { IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";
import Rating from "../../shared/components/rating/Rating";
import { dataTypeSymbol, totalFinalIndividualObjectiveRating } from "../../shared/functions/Scorecard";
import { dateFormat } from "../../shared/utils/utils";
import StatusDirection from "./StatusDirection";

interface IProps {
  objective: IObjective;
}
const StrategicMapOverview = observer((props: IProps) => {
  const { store } = useAppContext();
  const { objective } = props;

  const [measures, setMeasures] = useState<IMeasure[]>([]);

  const formatValue = (value: any, dataType: string) => {
    if (dataType === "Date") return dateFormat(value);
    if (dataType === "Currency") return currencyFormat(value);
    return value;
  };

  const calculateRating = () => {
    const rating = totalFinalIndividualObjectiveRating(measures);
    return rating || 1;
  };

  // Get measures that belong to objective
  const getMeasures = useCallback((): IMeasure[] => {
    return store.measure.all
      .filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  }, [objective.id, store.measure]);

  useEffect(() => {
    setMeasures(getMeasures());
    return () => { };
  }, [getMeasures]);

  return (
    <div className="strategic-map-overview">
      <div className="grid">
        <div className="kpis uk-card uk-card-default uk-card-small uk-card-body uk-width-expand">
          <h6 className="sub-heading">KPIs</h6>
          <table className="kpis-table uk-table uk-table-justify uk-table-divider uk-table-hover">
            <thead>
              <tr>
                <th>KPIs</th>
                <th>Annual</th>
                <th>Actual</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((measure) => (
                <tr key={measure.id}>
                  <td className="kpi-name">{measure.description}</td>

                  {measure.dataType !== "Currency" && (
                    <Fragment>
                      <td className="kpi-target">
                        {dataTypeSymbol(measure.dataType).prefix}
                        {formatValue(measure.annualTarget, measure.dataType)}
                        {dataTypeSymbol(measure.dataType).suffix}
                      </td>
                      <td className="kpi-actual">
                        <StatusDirection rating={measure.autoRating} />
                        {dataTypeSymbol(measure.dataType).prefix}
                        {formatValue(measure.annualActual, measure.dataType)}
                        {dataTypeSymbol(measure.dataType).suffix}
                      </td>
                    </Fragment>
                  )}

                  {measure.dataType === "Currency" && (
                    <Fragment>
                      <td className="kpi-target">
                        {formatValue(measure.annualTarget, measure.dataType)}
                      </td>
                      <td className="kpi-actual">
                        <StatusDirection rating={measure.autoRating} />
                        {formatValue(measure.annualActual, measure.dataType)}
                      </td>
                    </Fragment>
                  )}
                </tr>
              ))}

              {measures.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <div className="uk-text-center">
                      <h5>No KPIs found for this objective</h5>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="score uk-card uk-card-default uk-card-body uk-card-small">
          <h6 className="sub-heading">Rating</h6>
          <div className="rating-container uk-margin">
            <Rating rate={calculateRating()} simple={false} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default StrategicMapOverview;
