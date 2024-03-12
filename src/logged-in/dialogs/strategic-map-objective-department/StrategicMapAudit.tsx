import { observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";
import LineGraph from "../../../shared/components/graph-components/LineGraph";
import { useAppContext } from "../../../shared/functions/Context";
import { mapMonthToAbbreviation } from "../../../shared/functions/TimestampToDate";
import { IObjective } from "../../../shared/models/Objective";
import { totalQ4CompanyObjectiveRating } from "../../shared/functions/Scorecard";

interface IProps {
  objective: IObjective;
}
const StrategicMapAudit = observer((props: IProps) => {
  const { objective } = props;
  const { api, store } = useAppContext();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // map the data to the graph | each mea
  const data = months.map((month) => {
    // get the audit for the month
    const measuresAudit = store.departmentMeasureAudit.all
      .filter((m) => mapMonthToAbbreviation(m.asJson.month) === month)
      .map((m) => m.asJson);

    const rating = totalQ4CompanyObjectiveRating(measuresAudit) || null;
    return rating;
  });

  // get measures audit data for this objective
  const loadMeasuresAuditData = useCallback(async () => {
    try {
      await api.departmentMeasureAudit.getByObjective(objective.id);
    } catch (error) {
      console.log("Error: ", error);
    }
  }, [api.departmentMeasureAudit, objective.id]);

  useEffect(() => {
    loadMeasuresAuditData();
    return () => {};
  }, [loadMeasuresAuditData]);

  return (
    <div className="strategic-map-audit">
      <div
        className="update-history-chart uk-card uk-card-default uk-card-body uk-card-small"
        style={{ height: 400 }}
      >
        <h6 className="sub-heading">Objective History</h6>
        <LineGraph title="Chart" ylabel="Rating" labels={months} data={data} />
      </div>
    </div>
  );
});

export default StrategicMapAudit;
