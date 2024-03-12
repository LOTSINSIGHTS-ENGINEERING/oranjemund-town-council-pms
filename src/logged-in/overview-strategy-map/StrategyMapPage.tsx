import { useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import useBackButton from "../../shared/hooks/useBack";
import StrategicMapObjectiveCompanyModal from "../dialogs/strategic-map-objective-company/StrategicMapObjectiveCompanyModal";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import CompanyStrategicMap from "../company-scorecard/strategic-map/CompanyStrategicMap";

const StrategyMapPage = observer(() => {
  const { api, store } = useAppContext();
  const scorecard = store.scorecard.active;

  const [_, setTitle] = useTitle(); // set page title
  const [loading, setLoading] = useState(false);
  useBackButton();

  useEffect(() => {
    const loadAll = async () => {
      if (!scorecard) return;

      setLoading(true); // start loading
      try {
        await api.department.getAll();
        await api.departmentMeasure.getAll(scorecard.id);
        await api.departmentObjective.getAll(scorecard.id);

        await api.companyMeasure.getAll(scorecard.id);
        await api.companyObjective.getAll(scorecard.id);
      } catch (error) {
        console.log(error);
      }
      setLoading(false); // stop loading
    };

    loadAll();
  }, [
    api.companyMeasure,
    api.companyObjective,
    api.department,
    api.departmentMeasure,
    api.departmentObjective,
    scorecard,
  ]);

  useEffect(() => {
    if (scorecard) setTitle(`Strategy Map: ${scorecard.description}`);
    else setTitle("Strategy Map");
  }, [setTitle, scorecard]);


  return (
    <ErrorBoundary>
      <ErrorBoundary>{!loading && <CompanyStrategicMap />}</ErrorBoundary>
      <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_MAP_OVERVIEW_MODAL} cssClass="uk-modal-container"  >
          <StrategicMapObjectiveCompanyModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default StrategyMapPage;
