import { observer } from "mobx-react-lite";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import MixedGraph from "../../../shared/components/graph-components/MixedGraph";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import Modal from "../../../shared/components/Modal";
import SingleSelect from "../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../shared/functions/Context";
import Department from "../../../shared/models/Department";
import MeasureCompany, { IMeasureCompany } from "../../../shared/models/MeasureCompany";
import { IMeasureDepartment } from "../../../shared/models/MeasureDepartment";
import Objective, { IObjective } from "../../../shared/models/Objective";
import ObjectiveCompany from "../../../shared/models/ObjectiveCompany";
import ObjectiveDepartment from "../../../shared/models/ObjectiveDepartment";
import MeasureUpdateModal from "../../dialogs/measure-update/MeasureUpdateModal";
import MODAL_NAMES from "../../dialogs/ModalName";
import StrategicMapObjectiveModal from "../../dialogs/strategic-map-objective/StrategicMapObjectiveModal";
import Rating, { BarRating } from "../../shared/components/rating/Rating";
import { totalQ4CompanyObjectiveRating } from "../../shared/functions/Scorecard";

interface IContributoryObjectiveProps {
  objective: Objective | ObjectiveDepartment;
}
const ContributoryObjective: React.FC<IContributoryObjectiveProps> = observer(
  ({ objective }) => {
    const { api, store } = useAppContext();
    const scorecard = store.scorecard.active;
    const [loading, setLoading] = useState(false);

    const department = store.department.getById(objective.asJson.department);
    const departmentName = department ? department.asJson.name : "Unknown";

    const calculateRating = (objective: IObjective) => {
      const measures = getMeasures(objective);
      const rating = totalQ4CompanyObjectiveRating(measures);
      return rating || 1;
    };

    const getMeasures = (objective: IObjective): IMeasureDepartment[] => {
      return store.departmentMeasure.all
        .filter((measure) => measure.asJson.objective === objective.id)
        .map((measure) => measure.asJson);
    };

    const loadContributoryObjectiveMeasures = useCallback(async () => {
      if (!scorecard) return;
      setLoading(true);
      try {
        await api.departmentMeasure.getAllByObjectiveId(
          scorecard.id,
          objective.asJson.id
        );
      } catch (error) { }
      setLoading(false);
    }, [api.departmentMeasure, objective.asJson.id, scorecard]);

    useEffect(() => {
      loadContributoryObjectiveMeasures();
    }, [loadContributoryObjectiveMeasures]);

    return (
      <div>
        <div className="score uk-card uk-card-default uk-card-body uk-card-small">
          <h6 className="sub-heading">
            <span className="department-name">Department: </span>
            {departmentName}
            <hr
              style={{
                marginTop: 5,
                marginBottom: 5,
              }}
            />
            <span className="objective-name">Objective: </span>
            {objective.asJson.description}
          </h6>
          {!loading && (
            <ErrorBoundary>
              <div
                className="uk-grid-small uk-child-width-1-2 uk-grid-match uk-margin"
                data-uk-grid
                style={{ marginBottom: "30px" }}
              >
                <div>
                  <div className="rating-container">
                    <BarRating rating={calculateRating(objective.asJson)} />
                  </div>
                </div>
                <div>
                  <div className="rating-container">
                    <Rating
                      rate={calculateRating(objective.asJson)}
                      simple={true}
                    />
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          )}
          {loading && (
            <div className="rating-container uk-margin">
              <LoadingEllipsis />
            </div>
          )}
        </div>
      </div>
    );
  }
);

interface IContributoryObjectivesProps {
  departObjectives: Objective[] | ObjectiveDepartment[];
}
const ContributoryObjectives = observer(
  (props: IContributoryObjectivesProps) => {
    const { departObjectives } = props;

    return (
      <ErrorBoundary>
        <div className="uk-flex uk-flex-middle">
          <h5 className="objective-name uk-margin-remove-bottom uk-margin-right">
            Departmental Contributory Objectives
          </h5>
        </div>

        {departObjectives.length !== 0 && (
          <div
            className="uk-grid-small uk-child-width-1-3@m uk-child-width-1-4@l uk-grid-match uk-margin"
            data-uk-grid
            style={{ marginBottom: "30px" }}
          >
            {departObjectives.map((objective) => (
              <ErrorBoundary key={objective.asJson.id}>
                <ContributoryObjective objective={objective} />
              </ErrorBoundary>
            ))}
          </div>
        )}

        {departObjectives.length === 0 && (
          <div className="uk-width-1-1">
            <div className="uk-card uk-card-default uk-card-small uk-card-body">
              No contributory objectives 😔
            </div>
          </div>
        )}
      </ErrorBoundary>
    );
  }
);

interface ICompanyObjectiveProps {
  objectivesAsOptions: {
    label: string;
    value: string;
  }[];
  objectiveOption: string;

  setObjectiveOption: React.Dispatch<React.SetStateAction<string>>;
  measures: IMeasureCompany[];
  labels: string[];
}
const CompanyObjective = observer((props: ICompanyObjectiveProps) => {
  const {
    objectivesAsOptions,
    objectiveOption,
    setObjectiveOption,
    measures,
    labels,
  } = props;

  const firstRenderRef = useRef(true);

  useEffect(() => {
    // on first render, select one of the options
    if (!firstRenderRef.current || objectivesAsOptions.length === 0) return;
    setObjectiveOption(objectivesAsOptions[0].value);
    firstRenderRef.current = false;
  }, [objectivesAsOptions, setObjectiveOption]);

  return (
    <ErrorBoundary>
      <div className="uk-flex uk-flex-middle">
        <h5 className="objective-name uk-margin-remove-bottom uk-margin-right">
          Company objective:
        </h5>
        <SingleSelect
          name="search-objective"
          options={objectivesAsOptions}
          width="300px"
          value={objectiveOption}
          onChange={(opt) => setObjectiveOption(opt)}
          placeholder="Search an objective by title..."
        />
      </div>

      <div
        className={`uk-grid-small uk-child-width-1-2@m uk-margin `}
        data-uk-grid
      >
        {measures.map((measure) => (
          <div key={measure.id}>
            <div className="kpi-chart uk-card uk-card-default uk-card-small uk-card-body">
              <h5 className="measure-name uk-margin-remove-bottom uk-margin-right">
                KPI: {measure.description}
              </h5>
              <MixedGraph
                title={"Quarterly Target v Actual"}
                labels={labels}
                line={{
                  label: "Target",
                  data: [
                    measure.quarter1Target || 0,
                    measure.quarter2Target || 0,
                    measure.quarter3Target || 0,
                    measure.quarter4Target || 0,
                  ],
                }}
                bar={{
                  label: "Actual",
                  data: [
                    measure.quarter1Actual || 0,
                    measure.quarter2Actual || 0,
                    measure.quarter3Actual || 0,
                    measure.quarter4Actual || 0,
                  ],
                }}
              />
            </div>
          </div>
        ))}

        {measures.length === 0 && (
          <div className="uk-width-1-1">
            <div className="uk-card uk-card-default uk-card-small uk-card-body">
              No KPIs/measures found for this objective 😔
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
});

interface ICompanyObjectiveAnalyticsProps {
  measures: MeasureCompany[];
  objectives: ObjectiveCompany[];
  departments: Department[];
}
const CompanyObjectiveAnalytics = observer(
  (props: ICompanyObjectiveAnalyticsProps) => {
    const { store } = useAppContext();
    const [objectiveOption, setObjectiveOption] = useState("");
    const labels = ["Q1", "Q2", "Q3", "Q4"];

    const departObjectives = store.departmentObjective.all.filter(
      (objective) => objective.asJson.parent === objectiveOption
    );

    const objectivesAsOptions = props.objectives
      .map((objective) => ({
        label: objective.asJson.description,
        value: objective.asJson.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const measures = useMemo(
      () =>
        props.measures
          .filter((measure) => measure.asJson.objective === objectiveOption)
          .map((measure) => measure.asJson),
      [objectiveOption, props.measures]
    );

    return (
      <div className="company-objective-analytics uk-margin">
        <div className="uk-card uk-card-default uk-card-small uk-card-body">
          <CompanyObjective
            objectivesAsOptions={objectivesAsOptions}
            objectiveOption={objectiveOption}
            setObjectiveOption={setObjectiveOption}
            measures={measures}
            labels={labels}
          />

          <hr />

          {objectiveOption && (
            <ContributoryObjectives departObjectives={departObjectives} />
          )}
        </div>
      </div>
    );
  }
);

const CompanyDashboard = observer(() => {
  const { store } = useAppContext();

  const measures = store.companyMeasure.all;
  const objectives = store.companyObjective.all;
  const departments = store.department.all;

  return (
    <ErrorBoundary>
      <div className="company-dashboard">
        <CompanyObjectiveAnalytics
          measures={measures}
          objectives={objectives}
          departments={departments}
        />
      </div>

      {/* Modals */}
      <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_UPDATE_MODAL}>
        <MeasureUpdateModal />
      </Modal>

      <Modal
        modalId={MODAL_NAMES.EXECUTION.MAP_OVERVIEW_MODAL}
        cssClass="uk-modal-container"
      >
        <StrategicMapObjectiveModal />
      </Modal>
    </ErrorBoundary>
  );
});

export default CompanyDashboard;
