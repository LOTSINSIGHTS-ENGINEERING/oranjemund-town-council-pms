import { observer } from "mobx-react-lite";
import React, { Fragment, useCallback, useMemo, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import MeasureItem from "./MeasureItem";
import Rating, { BarRating } from "../../shared/components/rating/Rating";
import { totalQ4DepartmentObjectiveRating } from "../../shared/functions/Scorecard";
import { useNavigate } from "react-router-dom";
import { IMeasureDepartment } from "../../../shared/models/MeasureDepartment";
import ObjectiveItem from "./ObjectiveItem";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import ObjectiveDepartment, { IObjectiveDepartment, } from "../../../shared/models/ObjectiveDepartment";

const MetricsAnalytics = observer(() => {
  const { store } = useAppContext();

  const objectives = store.departmentObjective.allMeDepartment;
  const measures = store.departmentMeasure.allMeDepartment;

  const redMeasures = measures.filter((measure) => measure.asJson.q4AutoRating <= 2);

  const get_measures = useCallback((objective: ObjectiveDepartment): IMeasureDepartment[] => {
    return measures.filter((measure) => measure.asJson.objective === objective.asJson.id).map((measure) => measure.asJson);
  }, [measures]);

  const _total_scorecard_midterm_rate = useMemo(() => {
    var _sum: number = 0;
    const final_rating: number[] = [];

    for (const objective of objectives) {
      const weight = objective.asJson.weight ? objective.asJson.weight / 100 : 0;

      const _measures = get_measures(objective).map((measure) => ({
        rating: measure.q2Rating!,
      }));
      let _avg_rates = _measures.reduce((acc, curr) => {
        return acc + curr.rating;
      }, 0) / _measures.length;

      _avg_rates = (weight * Math.round(_avg_rates * 10)) / 10;

      final_rating.push(_avg_rates);
      _sum = final_rating.reduce((acc, value) => {
        return acc + value;
      }, 0);
    }

    return _sum;
  }, [objectives, get_measures]);

  const _total_scorecard_final_rate = useMemo(() => {
    var _sum: number = 0;
    const _rating: number[] = [];

    for (const objective of objectives) {
      const weight = objective.asJson.weight ? objective.asJson.weight / 100 : 0;

      const _measures = get_measures(objective).map((measure) => ({
        rating: measure.q4Rating!,
      }));

      // console.log(_measures);

      let _avg_rates =
        _measures.reduce((acc, curr) => {
          return acc + curr.rating;
        }, 0) / _measures.length;

      _avg_rates = (weight * Math.round(_avg_rates * 10)) / 10;

      _rating.push(_avg_rates);
      _sum = _rating.reduce((acc, value) => {
        return acc + value;
      }, 0);
    }
    // console.log(_rating);

    return _sum;
  }, [objectives, get_measures]);

  const midtermCss = _total_scorecard_midterm_rate <= 2 ? "warning" : "primary";
  const finalCss = _total_scorecard_final_rate <= 2 ? "warning" : "success";

  return (
    <div
      className="uk-grid-small uk-grid-match uk-child-width-1-5@s uk-child-width-1-5@m uk-margin"
      data-uk-grid
      style={{ marginBottom: "30px" }}
    >
      <div>
        <div className="info-card info-card--primary  uk-card uk-card-default uk-card-small">
          <div className="icon" data-tooltip="View all measures">
            <span>✓</span>
          </div>

          <div className="info-body uk-card-body">
            <p className="value">{measures.length}</p>
            <p className="label">All KPIs</p>
          </div>
        </div>
      </div>
      <div>
        <div className="info-card info-card--danger  uk-card uk-card-default uk-card-small">
          <div
            className="icon"
            data-tooltip="A red measures dashboard focuses on poorly performing metrics"
          >
            <span>❗</span>
          </div>
          <div className="info-body uk-card-body">
            <p className="value">{redMeasures.length}</p>
            <p className="label">Red KPIs</p>
          </div>
        </div>
      </div>
      <div>
        <div className="info-card info-card--success  uk-card uk-card-default uk-card-small">
          <div className="icon" data-tooltip="View all objectives in corecard">
            <span>✓</span>
          </div>
          <div className="info-body uk-card-body">
            <p className="value">{objectives.length}</p>
            <p className="label">Objectives</p>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`info-card info-card--${midtermCss}  uk-card uk-card-default uk-card-small`}
        >
          <div
            className="icon"
            data-tooltip="Average midterm score of scorecard"
          >
            {midtermCss === "primary" ? <span>✓</span> : <span>❗</span>}
          </div>
          <div className="info-body uk-card-body">
            <p className="value">{_total_scorecard_midterm_rate.toFixed(2)}</p>
            <p className="label">Midterm</p>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`info-card info-card--${finalCss}  uk-card uk-card-default uk-card-small`}
        >
          <div className="icon" data-tooltip="Average final score of scorecard">
            {finalCss === "success" ? <span>✓</span> : <span>❗</span>}
          </div>
          <div className="info-body uk-card-body">
            <p className="value">{_total_scorecard_final_rate.toFixed(2)}</p>
            <p className="label">Assessment</p>
          </div>
        </div>
      </div>
    </div>
  );
});

interface INoDataProps {
  message: string;
  children?: React.ReactNode;
}
const NoData = (props: INoDataProps) => {
  return (
    <div className="uk-margin-top uk-text-center">
      <div className="uk-card uk-card-body">
        <p className="uk-text-center">
          {props.message}
          {props.children && <br />}
          {props.children && <br />}
          {props.children}
        </p>
      </div>
    </div>
  );
};

const ObjectivesAnalytics = () => {
  const [viewType, setViewType] = useState<"table" | "grid">("grid");

  return (
    <div
      className="uk-grid-small uk-child-width-1-3@m uk-margin uk-grid-match"
      data-uk-grid
      style={{ marginBottom: "30px" }}
    >
      <div className="uk-width-1-1">
        <div className="objectives-card uk-card uk-card-default uk-card-body uk-card-small">
          <div className="objective-analytics-toolbar">
            <h5 className="title uk-margin">Objectives ✓</h5>

            <div
              className="controls"
              style={{
                display: "flex",
              }}
            >
              <button
                className={
                  "list-btn btn-icon uk-margin-small-right " +
                  (viewType === "grid" ? "active" : "")
                }
                onClick={() => setViewType("grid")}
              >
                <span data-uk-icon="icon: grid"></span>
              </button>

              <button
                className={
                  "list-btn btn-icon " + (viewType === "table" ? "active" : "")
                }
                onClick={() => setViewType("table")}
              >
                <span data-uk-icon="icon: table"></span>
              </button>
            </div>
          </div>

          {viewType === "table" && <ObjectivesTable />}
          {viewType === "grid" && <ObjectivesGrid />}
        </div>
      </div>
    </div>
  );
};

const ObjectivesTable = observer(() => {
  const { store } = useAppContext();
  const objectives = store.departmentObjective.allMeDepartment;
  const navigate = useNavigate();

  return (
    <ul className="uk-list uk-list-striped uk-margin">
      {objectives.map((objective) => (
        <Fragment key={objective.asJson.id}>
          <ObjectiveItem objective={objective} />
        </Fragment>
      ))}

      {objectives.length === 0 && (
        <NoData message="No data to display. Please add a new objective.">
          <button
            className="btn btn-primary uk-button-small"
            onClick={() => navigate("/c/scorecards/my")}
          >
            Add a new objective
          </button>
        </NoData>
      )}
    </ul>
  );
});

const ObjectivesGrid = observer(() => {
  const { store } = useAppContext();
  const objectives = store.departmentObjective.allMeDepartment;

  // calculate rating
  const calculateRating = (objective: IObjectiveDepartment) => {
    const measures = getMeasures(objective);
    const rating = totalQ4DepartmentObjectiveRating(measures);
    return rating || 1;
  };

  const getMeasures = (
    objective: IObjectiveDepartment
  ): IMeasureDepartment[] => {
    return store.departmentMeasure.allMeDepartment
      .filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  };

  return (
    <div
      className="uk-grid-small uk-child-width-1-3@m uk-child-width-1-4@l uk-grid-match"
      data-uk-grid
      style={{ marginBottom: "30px" }}
    >
      {objectives.map((objective) => (
        <div key={objective.asJson.id}>
          <div className="score uk-card uk-card-default uk-card-body uk-card-small">
            <h5 className="sub-heading">
              <span className="objective-name">Objective: </span>
              {objective.asJson.description}
            </h5>
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
                      rate={objective.q4Rating.rate}
                      isUpdated={objective.q4Rating.isUpdated}
                      simple={true}
                    />
                    {/* <Rating
                      rate={calculateRating(objective.asJson)}
                      simple={true}
                    /> */}
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </div>
      ))}
    </div>
  );
});

const MeasuresAnalytics = observer(() => {
  const { store } = useAppContext();

  const redMeasures = store.departmentMeasure.allMeDepartment.filter(
    (measure) => measure.asJson.q4AutoRating < 2
  );
  const greenMeasures = store.departmentMeasure.allMeDepartment.filter(
    (measure) => measure.asJson.q4AutoRating >= 3
  );

  const amberMeasures = store.departmentMeasure.allMeDepartment.filter(
    (measure) =>
      measure.asJson.q4AutoRating < 3 && measure.asJson.q4AutoRating >= 2
  );

  return (
    <div
      className="uk-grid-small uk-child-width-1-3@m uk-margin uk-grid-match"
      data-uk-grid
      style={{ marginBottom: "30px" }}
    >
      <div>
        <div className="red-measures-card uk-card uk-card-default uk-card-body uk-card-small">
          <h5 className="title uk-margin">Green KPIs/Measures 🙂</h5>
          <ul className="uk-list uk-list-striped uk-margin">
            {greenMeasures.map((measure) => (
              <ErrorBoundary key={measure.asJson.id}>
                <MeasureItem measure={measure.asJson} />
              </ErrorBoundary>
            ))}
            {greenMeasures.length === 0 && (
              <NoData message="No data to display. " />
            )}
          </ul>
        </div>
      </div>

      <div>
        <div className="red-measures-card uk-card uk-card-default uk-card-body uk-card-small">
          <h5 className="title uk-margin">Amber KPIs/Measures 😐</h5>
          <ul className="uk-list uk-list-striped uk-margin">
            {amberMeasures.map((measure) => (
              <ErrorBoundary key={measure.asJson.id}>
                <MeasureItem measure={measure.asJson} />
              </ErrorBoundary>
            ))}

            {amberMeasures.length === 0 && (
              <NoData message="No data to display. " />
            )}
          </ul>
        </div>
      </div>

      <div>
        <div className="red-measures-card uk-card uk-card-default uk-card-body uk-card-small">
          <h5 className="title uk-margin">All Red KPIs/Measures 😔</h5>
          <ul className="uk-list uk-list-striped uk-margin">
            {redMeasures.map((measure) => (
              <ErrorBoundary key={measure.asJson.id}>
                <MeasureItem measure={measure.asJson} />
              </ErrorBoundary>
            ))}
            {redMeasures.length === 0 && (
              <NoData message="No red measures 🙂." />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
});

const DeparmentDashboard = () => {
  return (
    <>
      <div className="department-dashboard">
        {/* Info cards */}
        <MetricsAnalytics />
        <ObjectivesAnalytics />
        <MeasuresAnalytics />
      </div>
    </>
  );
};

export default DeparmentDashboard;
