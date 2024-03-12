import { useEffect, useState } from "react";
import Toolbar from "../shared/components/toolbar/Toolbar";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId from "../../shared/functions/ModalShow";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { IObjective } from "../../shared/models/Objective";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../shared/hooks/useTitle";
import MeasureDepartmentModal from "../dialogs/measure-department/MeasureDepartmentModal";
import MeasureDepartmentUpdateQ1ActualModal from "../dialogs/measure-department-update-q1-actual/MeasureDepartmentUpdateQ1ActualModal";
import useBackButton from "../../shared/hooks/useBack";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import MeasureStatusUpdateDepartmentModal from "../dialogs/measure-status-update-department/MeasureStatusUpdateDepartmentModal";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { IMeasureDepartment } from "../../shared/models/MeasureDepartment";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import { dataFormat } from "../../shared/functions/Directives";
import NoMeasures from "./NoMeasures";

interface IMeasureTableItemProps {
  measure: IMeasureDepartment;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { api, store } = useAppContext();
  const { measure } = props;
  const { departmentId } = useParams();
  const role = store.auth.role;
  const department = store.auth.department;

  const hasAccess =
    role === USER_ROLES.SUPER_USER ||
    (role === USER_ROLES.EXECUTIVE_USER && departmentId === department);

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol || "";

  const handleEditStatusUpdate = () => {
    store.departmentMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_COMMENTS_MODAL);
  };

  const handleEditMeasure = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.departmentMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_MODAL);
  };

  const handleDeleteMeasure = async () => {
    if (!window.confirm("Remove measure?")) return;
    await api.departmentMeasure.delete(measure);
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

        {hasAccess && (
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

interface IMeasuresProps {
  objective: IObjective;
}
const Measures = observer((props: IMeasuresProps) => {
  const { store } = useAppContext();
  const { objective } = props;
  const { departmentId } = useParams();

  const role = store.auth.role;
  const department = store.auth.department;
  const hasAccess =
    role === USER_ROLES.SUPER_USER ||
    (role === USER_ROLES.EXECUTIVE_USER && departmentId === department);

  // Get measures that belong to objective
  const measures = (): IMeasureDepartment[] => {
    return store.departmentMeasure.all
      .filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  };

  return (
    <ErrorBoundary>
      <div className="strategic-list">
        <div className="uk-card uk-card-default uk-card-body uk-card-small">
          <div className="measure-table">
            <ErrorBoundary>
              {measures().length !== 0 && (
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
                      {hasAccess && <th></th>}
                    </tr>
                  </thead>

                  <tbody>
                    {measures().map((measure) => (
                      <ErrorBoundary key={measure.id}>
                        <MeasureTableItem measure={measure} />
                      </ErrorBoundary>
                    ))}
                  </tbody>
                </table>
              )}
            </ErrorBoundary>

            <ErrorBoundary>
              {measures().length === 0 && <NoMeasures />}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
});

const DepartmentScorecardObjective = observer(() => {
  const { store } = useAppContext();
  const { fyid, departmentId, objectiveId } = useParams();
  const role = store.auth.role;
  const department = store.auth.department;

  const [_, setTitle] = useTitle(); // set page title
  const [objective, setObjective] = useState<IObjective | null>(null);

  const navigate = useNavigate();
  useBackButton(`/c/strategy/department/${fyid}/${departmentId}`);

  const handleNewMeasure = () => {
    store.departmentMeasure.clearSelected(); // clear selected measure
    showModalFromId(MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_MODAL);
  };

  useEffect(() => {
    const getObjective = () => {
      const objective = store.departmentObjective.all.find(
        (objective) => objective.asJson.id === objectiveId
      );

      if (objective) {
        store.departmentObjective.select(objective.asJson);
        setObjective(objective.asJson);
      } else {
        navigate("/c/strategy/department/");
      }
    };
    getObjective();
  }, [store.departmentObjective, navigate, objectiveId]);

  useEffect(() => {
    const setPageTitle = () => {
      if (!objective) return;
      setTitle(objective.description);
    };

    setPageTitle();
  }, [objective, setTitle]);

  return (
    <ErrorBoundary>
      <div className="objective-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              rightControls={
                <ErrorBoundary>
                  <button
                    className="btn btn-primary"
                    onClick={handleNewMeasure}
                    disabled={
                      !(
                        role === USER_ROLES.SUPER_USER ||
                        (role === USER_ROLES.EXECUTIVE_USER &&
                          departmentId === department)
                      )
                    }
                  >
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span> New
                    Measure
                  </button>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            {objective && <Measures objective={objective} />}
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_MODAL}>
          <MeasureDepartmentModal />
        </Modal>
        <Modal
          modalId={
            MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_UPDATE_Q1_ACTUAL_MODAL
          }
        >
          <MeasureDepartmentUpdateQ1ActualModal />
        </Modal>
        <Modal
          modalId={MODAL_NAMES.EXECUTION.DEPARTMENT_MEASURE_COMMENTS_MODAL}
        >
          <MeasureStatusUpdateDepartmentModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default DepartmentScorecardObjective;
