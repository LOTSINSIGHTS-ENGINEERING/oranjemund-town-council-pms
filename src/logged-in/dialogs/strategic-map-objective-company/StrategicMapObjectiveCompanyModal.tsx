import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultObjectiveCompany } from "../../../shared/models/ObjectiveCompany";
import MODAL_NAMES from "../ModalName";
import StrategicMapAudit from "./StrategicMapAudit";
import StrategicMapObjectiveTabs from "./StrategicMapObjectiveTabs";
import StrategicMapOverview from "./StrategicMapOverview";

const StrategicMapObjectiveCompanyModal = observer(() => {
  const { store } = useAppContext();
  const [selectedTab, setselectedTab] = useState("overview-tab");
  const [objective, setObjective] = useState(defaultObjectiveCompany);

  useEffect(() => {
    if (store.companyObjective.selected) {
      setObjective({
        ...store.companyObjective.selected,
      });
    } else {
      setObjective({ ...defaultObjectiveCompany });
      store.companyObjective.clearSelected();
      hideModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MAP_OVERVIEW_MODAL);
    }
  }, [store.companyObjective, store.companyObjective.selected]);

  return (
    <div className="strategic-map-objective uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">{objective.description}</h3>

      <div className="dialog-content uk-position-relative">
        <ErrorBoundary>
          <StrategicMapObjectiveTabs
            selectedTab={selectedTab}
            setselectedTab={setselectedTab}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          {selectedTab === "overview-tab" && (
            <StrategicMapOverview objective={objective} />
          )}
        </ErrorBoundary>

        <ErrorBoundary>
          {selectedTab === "audit-tab" && (
            <StrategicMapAudit objective={objective} />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
});

export default StrategicMapObjectiveCompanyModal;
