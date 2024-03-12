import { observer } from "mobx-react-lite";
import { Fragment, useCallback, useEffect, useState } from "react";
import Loading from "../../shared/components/loading/Loading";
import { useAppContext } from "../../shared/functions/Context";
import { IScorecardBatch } from "../../shared/models/ScorecardBatch";
import { IStrategicTheme } from "../../shared/models/StrategicTheme";

interface IThemePropsProps {
  theme: IStrategicTheme;
}
const StrategyTheme = (props: IThemePropsProps) => {
  const { theme } = props;
  const { description } = theme;

  return (
    <div className="theme uk-card uk-card-body uk-card-small">
      <h6 className="name">
        <span className="span-label">Theme</span>
        {description}
      </h6>
    </div>
  );
};

interface IProps {
  scorecardBatch: IScorecardBatch;
}
const FYPlan = observer((props: IProps) => {
  const { api, store } = useAppContext();

  const { scorecardBatch } = props;
  const { id, description, locked } = scorecardBatch;
  const fyPlanCssClass = locked ? "FY-plan FY-plan__locked uk-card uk-card-default uk-card-body uk-card-small" : "FY-plan uk-card uk-card-default uk-card-body uk-card-small";
  const [loading, setLoading] = useState(false);

  const themes = store.strategicTheme.all.filter((theme) => theme.asJson.scorecard === id).map((theme) => theme.asJson);

  const loadAll = useCallback(async () => {
    setLoading(true); // start loading

    try {
      await api.strategicTheme.getAll(id);
    } catch (error) {
      console.log(error);
    }
    setLoading(false); // stop loading
  }, [api.strategicTheme, id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);


  if (loading) return (
    <Loading />
  )

  return (
    <Fragment>
      <div className={fyPlanCssClass}>
        <h6 className="title">
          {description}
          {locked && (
            <>
              <span className="lock-icon" data-uk-icon="icon: lock"></span>
            </>
          )}
        </h6>
      </div>
      <div
        className="themes-grid uk-grid-collapse uk-child-width-1-2@s uk-child-width-1-4@m uk-grid-match"
        data-uk-grid >
        {themes.map((theme) => (
          <div key={theme.id}>
            <StrategyTheme theme={theme} />
          </div>
        ))}
      </div>
    </Fragment>
  );
});

export default FYPlan;
