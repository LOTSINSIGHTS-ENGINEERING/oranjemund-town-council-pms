import { useEffect, useState } from "react";
import Dropdown from "../../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import { useAppContext } from "../../../shared/functions/Context";
import { dataFormat } from "../../../shared/functions/Directives";
import showModalFromId from "../../../shared/functions/ModalShow";
import useIndividualScorecard from "../../../shared/hooks/useIndividualScorecard";
import { defaultMeasure, IMeasure } from "../../../shared/models/Measure";
import MODAL_NAMES from "../../dialogs/ModalName";
import { measureRating } from "../../shared/functions/Scorecard";

interface IProps {
  measure: IMeasure;
}
const MeasureTableItem = (props: IProps) => {
  const { api, store } = useAppContext();
  const { measure } = props;

  const [currentMeasure, setCurrentMeasure] = useState<IMeasure>({
    ...defaultMeasure,
  });
  const [unsavedChanges, setunSavedChanges] = useState(false);
  const { agreement, loading } = useIndividualScorecard();

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol;

  const enableEditing = () => {
    const isEditing =
      agreement.agreementDraft.status === "pending" ||
      agreement.agreementDraft.status === "in-progress" ||
      agreement.agreementDraft.status === "reverted";

    return !isEditing;
  };

  const handleEditComments = () => {
    store.measure.select(currentMeasure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MODAL);
  };

  const handleEditMeasure = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.measure.select(currentMeasure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_MODAL);
  };

  const handleDeleteMeasure = () => {
    if (!window.confirm("Remove measure?")) return;
    api.measure.delete(currentMeasure);
  };

  const handleUpdate = async () => {
    try {
      await api.measure.update(currentMeasure, ["annualActual", "autoRating"]);
      setunSavedChanges(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const $measure = currentMeasure;
    const rating = measureRating(currentMeasure);

    $measure.autoRating = rating;
    setCurrentMeasure($measure);
  }, [currentMeasure]);

  // update current measure
  useEffect(() => {
    setCurrentMeasure({ ...measure });
  }, [measure]);

  if (loading)
    return (
      <ErrorBoundary>
        <LoadingEllipsis />
      </ErrorBoundary>
    );

  return (
    <tr className="row">
      <td>
        {currentMeasure.description}

        <button
          className="comments-btn btn-text uk-margin-small-left"
          onClick={handleEditComments}
          data-uk-icon="icon: comment; ratio: 1"
        ></button>
      </td>

      <td className="no-whitespace">
        {dataFormat(dataType, measure.baseline, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.annualTarget, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating1, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating2, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating3, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating4, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating5, dataSymbol)}
      </td>

      <td>
        <div className="controls">
          {unsavedChanges && (
            <button
              className="btn-icon uk-margin-small-right"
              onClick={handleUpdate}
            >
              <span uk-icon="push"></span>
            </button>
          )}

          <button className="btn-icon" disabled={enableEditing()}>
            <span uk-icon="more"></span>
          </button>

          <Dropdown>
            <li>
              <button
                className="kit-dropdown-btn"
                onClick={handleEditMeasure}
                disabled={enableEditing()}
              >
                <span uk-icon="pencil"></span> Edit Measure
              </button>
            </li>
            <li>
              <button
                className="kit-dropdown-btn"
                onClick={handleDeleteMeasure}
                disabled={enableEditing()}
              >
                <span uk-icon="trash"></span> Delete Measure
              </button>
            </li>
          </Dropdown>
        </div>
      </td>
    </tr>
  );
};

export default MeasureTableItem;
