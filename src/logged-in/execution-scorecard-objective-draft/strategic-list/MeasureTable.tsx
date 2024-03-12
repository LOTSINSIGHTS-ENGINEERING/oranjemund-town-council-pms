import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { IMeasure } from "../../../shared/models/Measure";
import MeasureTableItem from "./MeasureTableItem";
import NoMeasures from "./NoMeasures";

interface IProps {
  measures: IMeasure[];
}
const MeasureTable = observer((props: IProps) => {
  const { measures } = props;
  const [isEmpty, setisEmpty] = useState(false);

  useEffect(() => {
    setisEmpty(measures.length === 0 ? true : false);
  }, [measures]);

  return (
    <ErrorBoundary>
      <div className="measure-table">
        {!isEmpty && (
          <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
            <thead className="header">
              <tr>
                <th className="uk-width-expand@s">Measure/KPI</th>
                <th>Baseline</th>
                <th>Annual Target</th>
                <th>Rate 1</th>
                <th>Rate 2</th>
                <th>Rate 3</th>
                <th>Rate 4</th>
                <th>Rate 5</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {measures.map((measure) => (
                <ErrorBoundary key={measure.id}>
                  <MeasureTableItem measure={measure} />
                </ErrorBoundary>
              ))}
            </tbody>
          </table>
        )}

        {isEmpty && <NoMeasures />}
      </div>
    </ErrorBoundary>
  );
});

export default MeasureTable;
