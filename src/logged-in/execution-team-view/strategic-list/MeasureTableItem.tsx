import { Fragment } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { currencyFormat } from "../../../shared/functions/Directives";
import showModalFromId from "../../../shared/functions/ModalShow";
import { IMeasure } from "../../../shared/models/Measure";
import MODAL_NAMES from "../../dialogs/ModalName";
import { dataTypeSymbol, rateColor } from "../../shared/functions/Scorecard";
import { dateFormat } from "../../shared/utils/utils";

interface IProps {
  measure: IMeasure;
}
const MeasureTableItem = (props: IProps) => {
  const { store } = useAppContext();
  const { measure } = props;

  const dataType = measure.dataType;
  const suffix = dataTypeSymbol(dataType).suffix;
  const prefix = dataTypeSymbol(dataType).prefix;
  const rateCss = rateColor(measure.autoRating, measure.isUpdated);

  const rateCssSupervisor = rateColor(
    measure.finalRating || 0,
    measure.isUpdated
  );

  const handleUpdateMeasure = () => {
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_MODAL);
  };

  return (
    <tr className="row" onClick={handleUpdateMeasure}>
      <td>
        <div className={`status ${rateCss}`}></div>
      </td>
      <td>{measure.description}</td>

      {dataType !== "Date" && dataType !== "Currency" && (
        <Fragment>
          <td>
            {prefix}
            {measure.baseline}
            {suffix}
          </td>
          <td>
            {prefix}
            {measure.annualTarget}
            {suffix}
          </td>
          <td className={`actual-value ${rateCss}`}>{measure.annualActual}</td>
        </Fragment>
      )}

      {dataType === "Currency" && (
        <Fragment>
          <td className="no-whitespace">{currencyFormat(measure.baseline)}</td>
          <td className="no-whitespace">
            {currencyFormat(measure.annualTarget)}
          </td>
          <td className={`no-whitespace actual-value ${rateCss}`}>
            {currencyFormat(measure.finalRating)}
          </td>
        </Fragment>
      )}
      {dataType === "Date" && (
        <Fragment>
          <td>{dateFormat(measure.baseline)}</td>
          <td>{dateFormat(measure.annualTarget)}</td>
          <td className={`actual-value ${rateCss}`}>
            {dateFormat(measure.annualActual)}
          </td>
          <td className={`actual-value ${rateCss}`}>
            {dateFormat(measure.annualActual)}
          </td>
        </Fragment>
      )}
      <td className={`actual-value ${rateCss}`}>{measure.autoRating}</td>
        <td className={`actual-value ${rateCssSupervisor}`}>
        {measure.finalRating}
      </td>
    </tr>
  );
};

export default MeasureTableItem;
