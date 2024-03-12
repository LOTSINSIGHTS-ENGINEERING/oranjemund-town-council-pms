import { useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Toolbar from "../shared/components/toolbar/Toolbar";
import SettingsTabs from "./SettingsTabs";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId from "../../shared/functions/ModalShow";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import DepartmentList from "./DepartmentList";
import UserList from "./UserList";
import ScorecardList from "./ScorecardList";
import BusinessUnitList from "./BusinessUnitList";
import UserModal from "../dialogs/user/UserModal";
import Modal from "../../shared/components/Modal";
import BusinessUnitModal from "../dialogs/business-unit/BusinessUnitModal";
import DepartmentModal from "../dialogs/department/DepartmentModal";
import ScorecardBatchModal from "../dialogs/scorecard-batch/ScorecardBatchModal";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import { observer } from "mobx-react-lite";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import VisionMisionList from "./VisionMisionList";
import VMModal from "../dialogs/visionmission/VMModal";
import StrategicThemeModal from "../dialogs/strategic-theme/StrategicThemeModal";
import StrategicThemeList from "./StrategicThemeList";
import { ReportingTo } from "./ReportingTo";

// import JobCardForm from "../dialogs/job-card/JobCardForm";
// import JobCardModal from "../company-job-card/JobCardModal";

const AdminSettings = observer(() => {
  const { api, store } = useAppContext();
  const [selectedTab, setselectedTab] = useState("user-tab");
  const [loading, setLoading] = useState(false);
  const scorecard = store.scorecard.active;

  useTitle("Admin Settings");
  useBackButton();

  const handleNewUser = () => {
    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL);
  };

  const handleNewBatch = () => {
    store.scorecard.clearSelected(); // clear selected scorecard batch
    showModalFromId(MODAL_NAMES.ADMIN.SCORECARD_BATCH_MODAL); // show modal
  };

  const handleNewDepartment = () => {
    store.department.clearSelected(); // clear selected department
    showModalFromId(MODAL_NAMES.ADMIN.DEPARTMENT_MODAL); // show modal
  };

  const handleNewBusinessUnit = () => {
    store.businessUnit.clearSelected(); // clear selected business unit
    showModalFromId(MODAL_NAMES.ADMIN.BUSINESS_UNIT_MODAL); // show modal
  };
  const handleNewVM = () => {
    store.businessUnit.clearSelected(); // clear selected business unit
    showModalFromId(MODAL_NAMES.ADMIN.VM_MODAL); // show modal
  };

  const handleNewTheme = () => {
    store.strategicTheme.clearSelected(); // clear selected business unit
    showModalFromId(MODAL_NAMES.ADMIN.STRATEGIC_THEME_MODAL); // show modal
  };
  useEffect(() => {
    // load data from db
    const loadAll = async () => {
      setLoading(true); // start loading
      try {
        await api.user.getAll();
        await api.department.getAll();
        await api.scorecard.getAll();
        await api.businessUnit.getAll();
        await api.visionmission.getAll();
        await api.strategicTheme.getAll(scorecard!.id);
      } catch (error) {
        // console.log("Error: ", error);
      }
      setLoading(false); // stop loading
    };
    loadAll();
  }, [api.businessUnit, api.department, api.scorecard, api.user,api.strategicTheme, api.visionmission, scorecard]);

  return (
    <ErrorBoundary>
      <div className="admin-settings uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <div className="sticky-top">
            <ErrorBoundary>
              <Toolbar
                leftControls={
                  <SettingsTabs
                    selectedTab={selectedTab}
                    setselectedTab={setselectedTab}
                  />
                }
                rightControls={
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                      Add
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewUser}>
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          New User
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewBatch}>
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          New Scorecard
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewDepartment}>
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          New Department
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewBusinessUnit}>
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          New Business Unit
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewTheme}>
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          New strategic Theme
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewVM}>
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          Vision & Mission
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                }
              />
            </ErrorBoundary>
          </div>

          <ErrorBoundary>
            {!loading && (
              <div className="uk-margin">
                {selectedTab === "user-tab" && <UserList />}
                {selectedTab === "scorecard-tab" && <ScorecardList />}
                {selectedTab === "department-tab" && <DepartmentList />}
                {selectedTab === "business-unit-tab" && <BusinessUnitList />}
                {selectedTab === "strategic-theme-tab" && (
                  <StrategicThemeList />
                )}
                {selectedTab === "vm-tab" && <VisionMisionList />}
                {selectedTab === "report-tab" && <ReportingTo />}
              </div>
            )}
          </ErrorBoundary>

          {/* Loading */}
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.ADMIN.USER_MODAL}>
          <UserModal />
        </Modal>
        {/* <Modal modalId={MODAL_NAMES.ADMIN.JOBCARD_USER_MODAL}>
          <JobCardModal/>
        </Modal> */}

        <Modal modalId={MODAL_NAMES.ADMIN.SCORECARD_BATCH_MODAL}>
          <ScorecardBatchModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.DEPARTMENT_MODAL}>
          <DepartmentModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.BUSINESS_UNIT_MODAL}>
          <BusinessUnitModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.STRATEGIC_THEME_MODAL}>
          <StrategicThemeModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.VM_MODAL}>
          <VMModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default AdminSettings;
