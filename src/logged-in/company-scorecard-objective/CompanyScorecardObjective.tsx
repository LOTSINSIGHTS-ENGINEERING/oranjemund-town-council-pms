import { useEffect, useMemo } from "react";
import Toolbar from "../shared/components/toolbar/Toolbar";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId from "../../shared/functions/ModalShow";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../shared/hooks/useTitle";
import MeasureCompanyModal from "../dialogs/measure-company/MeasureCompanyModal";
import useBackButton from "../../shared/hooks/useBack";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import MeasureStatusUpdateCompanyModal from "../dialogs/measure-status-update-company/MeasureStatusUpdateCompanyModal";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import { dataFormat } from "../../shared/functions/Directives";
import MeasureCompany from "../../shared/models/MeasureCompany";
import NoMeasures from "../department-scorecard-objective/NoMeasures";
import useCompanyScorecardMetadata from "../../shared/hooks/useCompanyScorecardMetadata";

interface IMeasureTableItemProps {
  measure: MeasureCompany;
  canUpdate: boolean;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { api, store } = useAppContext();
  const { canUpdate } = props;
  const measure = props.measure.asJson;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol || "";

  const handleEditStatusUpdate = () => {
    store.companyMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_STATUS_UPDATE_MODAL);
  };

  const handleEditMeasure = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.companyMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_MODAL);
  };

  const handleDeleteMeasure = () => {
    if (!window.confirm("Remove measure?")) return;
    api.companyMeasure.delete(measure);
  };

  return (
    <ErrorBoundary>
      <tr className="row">
        <td>
          {measure.description}
          <button
            className="comments-btn btn-text uk-margin-small-left"
            onClick={handleEditStatusUpdate}
            data-uk-icon="icon: commenting; ratio: 1"
          ></button>
        </td>

        <td className="no-whitespace">
          {dataFormat(dataType, measure.baseline, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.annualTarget, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.quarter1Target, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.quarter2Target, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.quarter3Target, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.quarter4Target, dataSymbol)}
        </td>

        {canUpdate && (
          <td>
            <div className="controls">
              <button className="btn-icon">
                <span uk-icon="more"></span>
              </button>
              <Dropdown>
                <li>
                  <button
                    className="kit-dropdown-btn"
                    onClick={handleEditMeasure}
                  >
                    <span uk-icon="pencil"></span> Edit Measure
                  </button>
                </li>
                <li>
                  <button
                    className="kit-dropdown-btn"
                    onClick={handleDeleteMeasure}
                  >
                    <span uk-icon="trash"></span> Delete Measure
                  </button>
                </li>
              </Dropdown>
            </div>
          </td>
        )}
      </tr>
    </ErrorBoundary>
  );
};

interface IMeasureTableProps {
  measures: MeasureCompany[];
  canUpdate: boolean;
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures, canUpdate } = props;

  return (
    <div className="strategic-list">
      <div className="uk-card uk-card-default uk-card-body uk-card-small">
        <div className="measure-table">
          {measures.length !== 0 && (
            <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
              <thead className="header">
                <tr>
                  <th className="uk-width-expand@s">Measure/KPI</th>
                  <th>Baseline</th>
                  <th>Annual Target</th>
                  <th>Q1 Target</th>
                  <th>Q2 Target</th>
                  <th>Q3 Target</th>
                  <th>Q4 Target</th>
                  {canUpdate && <th></th>}
                </tr>
              </thead>
              <tbody>
                {measures.map((measure) => (
                  <ErrorBoundary key={measure.asJson.id}>
                    <MeasureTableItem measure={measure} canUpdate={canUpdate} />
                  </ErrorBoundary>
                ))}
              </tbody>
            </table>
          )}

          {measures.length === 0 && <NoMeasures />}
        </div>
      </div>
    </div>
  );
});

const CompanyScorecardObjective = observer(() => {
  const { store } = useAppContext();
  const { fyid, objectiveId = "" } = useParams();
  const agreement = useCompanyScorecardMetadata(`${fyid}`);

  const role = store.auth.role;

  const canUpdate = useMemo(() => {
    const statusCondition =
      agreement.agreementDraft.status === "in-progress" ||
      agreement.agreementDraft.status === "pending";
    const roleCondition =
      role === USER_ROLES.SUPER_USER || role === USER_ROLES.MD_USER;

    return statusCondition && roleCondition;
  }, [agreement.agreementDraft.status, role]);

  const [_, setTitle] = useTitle(); // set page title
  const navigate = useNavigate();
  useBackButton("/c/strategy/company/" + fyid);

  const handleNewMeasure = () => {
    store.companyMeasure.clearSelected(); // clear selected measure
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_MODAL);
  };

  const objective = useMemo(() => {
    const o = store.companyObjective.getById(objectiveId);

    if (o) store.companyObjective.select(o.asJson);

    return o;
  }, [objectiveId, store.companyObjective]);

  useEffect(() => {
    const setPageTitle = () => {
      if (!objective) {
        navigate("/c/strategy/company/");
        return;
      }
      setTitle(objective.asJson.description);
    };

    setPageTitle();
  }, [navigate, objective, setTitle]);

  return (
    <ErrorBoundary>
      <div className="objective-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              rightControls={
                <ErrorBoundary>
                  {canUpdate && (
                    <button
                      className="btn btn-primary"
                      onClick={handleNewMeasure}
                    >
                      <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                      New Measure
                    </button>
                  )}
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            {objective && (
              <MeasureTable
                measures={objective.measures}
                canUpdate={canUpdate}
              />
            )}
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_MEASURE_MODAL}>
          <MeasureCompanyModal />
        </Modal>
        <Modal
          modalId={MODAL_NAMES.EXECUTION.COMPANY_MEASURE_STATUS_UPDATE_MODAL}
        >
          <MeasureStatusUpdateCompanyModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecardObjective;
