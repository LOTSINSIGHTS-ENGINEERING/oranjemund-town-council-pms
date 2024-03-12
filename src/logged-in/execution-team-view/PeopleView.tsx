import Toolbar from "../shared/components/toolbar/Toolbar";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import StrategicMapObjectiveModal from "../dialogs/strategic-map-objective/StrategicMapObjectiveModal";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import StrategicList from "./strategic-list/StrategicList";
import useBackButton from "../../shared/hooks/useBack";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { generateIndividualPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { exportEmployeeExcelScorecard } from "../shared/functions/Excel";
import { IUser } from "../../shared/models/User";
import { IScorecardBatch } from "../../shared/models/ScorecardBatch";
import useVM from "../../shared/hooks/useVM";

const PeopleView = observer(() => {
  const { api, store } = useAppContext();
  // const role = store.auth.role;
  const { uid } = useParams();
  const { vision, mission } = useVM();

  const [loading, setLoading] = useState(false);
  const [_, setTitle] = useTitle("People"); // set page title

  const navigate = useNavigate();
  useBackButton("/c/scorecards/people/");

  const user = store.user.selected;
  const scorecard = store.scorecard.active;
  const allUsers = store.user.all;

  const loadCompanyAndDepartmnBeforeExport = async (
    scorecard: IScorecardBatch,
    user: IUser
  ) => {
    try {
      // Only get when exporting and drafting.
      await api.companyMeasure.getAll(scorecard.id);
      await api.companyObjective.getAll(scorecard.id);

      // Get all on-load.
      await api.departmentMeasure.getAll(scorecard.id, user.department);
      await api.departmentObjective.getAll(scorecard.id, user.department);
    } catch (error) {
      console.log(error);
    }
  };

  // Export reports
  const handleExportPDF = async () => {
    if (!scorecard || !user) return;
    await loadCompanyAndDepartmnBeforeExport(scorecard, user);

    const title = `${user.displayName} ${scorecard.description} Scorecard`;
    const objectives = store.objective.getByUid(user.uid);
    const measures = store.measure.getByUid(user.uid);
    const username = user.displayName;
    const position = user.jobTitle;
    const supervisor =
      allUsers.find((u) => u.asJson.uid === user.supervisor)?.asJson
        .displayName || "Reporting to no one";
    const strategicObjectives =
      [
        ...store.departmentObjective.all.map((o) => o.asJson),
        ...store.companyObjective.all.map((o) => o.asJson),
      ] || [];
    const contributoryObjectives = objectives.map((o) => o.asJson) || [];
    const allMeasures = measures.map((o) => o.asJson) || [];

    try {
      generateIndividualPerformanceAgreementPDF(
        title,
        vision,
        mission,
        strategicObjectives,
        contributoryObjectives,
        allMeasures,
        username,
        position,
        supervisor
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportExcel = async () => {
    if (!scorecard || !user) return;
    await loadCompanyAndDepartmnBeforeExport(scorecard, user);

    const title = `${user.displayName} ${scorecard.description}`;
    const objectives = store.objective.getByUid(user.uid);
    const measures = store.measure.getByUid(user.uid);

    const strategicObjectives =
      [
        ...store.departmentObjective.all.map((o) => o.asJson),
        ...store.companyObjective.all.map((o) => o.asJson),
      ] || [];
    const contributoryObjectives = objectives.map((o) => o.asJson) || [];
    const allMeasures = measures.map((o) => o.asJson) || [];

    try {
      await exportEmployeeExcelScorecard(
        title,
        strategicObjectives,
        contributoryObjectives,
        allMeasures
      );
    } catch (error) {}
  };

  useEffect(() => {
    const setPageTitle = () => {
      if (!user) navigate("/c/scorecards/people/");
      else setTitle(`Scorecard for ${user.displayName}`);
    };

    setPageTitle();
  }, [navigate, setTitle, user]);

  useEffect(() => {
    if (!uid || !user) return;

    const load = async () => {
      setLoading(true); // start loading
      await api.objective.getAll(uid); // load objectives
      await api.measure.getAll(uid); // load measures
      setLoading(false); // end loading
    };
    load();
  }, [api.measure, api.objective, uid, user]);

  return (
    <ErrorBoundary>
      <div className="people-view-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              rightControls={
                <ErrorBoundary>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    title="Export your scorecard as PDF."
                    onClick={handleExportPDF}
                  >
                    <span data-uk-icon="icon: file-pdf; ratio:.8" />
                    Export PDF
                  </button>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    title="Export your scorecard as EXCEL."
                    onClick={handleExportExcel}
                  >
                    <FontAwesomeIcon
                      icon={faFileExcel}
                      size="lg"
                      className="icon uk-margin-small-right"
                    />
                    Export Excel
                  </button>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
          <ErrorBoundary>
            {!loading && uid && <StrategicList uid={uid} />}
          </ErrorBoundary>
        </div>
      </div>
      <ErrorBoundary>
        <Modal
          modalId={MODAL_NAMES.EXECUTION.MAP_OVERVIEW_MODAL}
          cssClass="uk-modal-container"
        >
          <StrategicMapObjectiveModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default PeopleView;
