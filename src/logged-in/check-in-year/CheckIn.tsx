import { useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Toolbar from "../shared/components/toolbar/Toolbar";
import MODAL_NAMES from "../dialogs/ModalName";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import { observer } from "mobx-react-lite";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import CheckInYearModal from "../dialogs/check-in-year/CheckInYearModal";
import showModalFromId from "../../shared/functions/ModalShow";
import CheckInYearList from "./CheckInYearList";
import "./checkin.scss";

const CheckIn = observer(() => {
  const { api, } = useAppContext();
  const [loading, setLoading] = useState(false);
  useTitle("Check In");

  const handleNewYear = () => {
    showModalFromId(MODAL_NAMES.CHECKIN.CHECK_IN_YEAR);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await api.checkIn.checkInYear.getAll();
      } catch (error) { }
      setLoading(false)
    };
    loadData();
  }, [api.checkIn.checkInYear]);

  return (
    <ErrorBoundary>
      <div className="checkin-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <div className="sticky-top">
            <ErrorBoundary>
              <Toolbar
                rightControls={
                  <div className="uk-inline">
                    <button className="btn btn-primary" onClick={handleNewYear}>
                      <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                      New Year
                    </button>
                  </div>
                }
              />
            </ErrorBoundary>
          </div>
          <ErrorBoundary>
            {!loading && (
              <div className="uk-margin">
                <CheckInYearList />
              </div>
            )}
          </ErrorBoundary>
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        </div>
      </div>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.CHECKIN.CHECK_IN_YEAR}>
          <CheckInYearModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CheckIn;
