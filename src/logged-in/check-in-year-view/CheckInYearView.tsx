import { useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Toolbar from "../shared/components/toolbar/Toolbar";
import MODAL_NAMES from "../dialogs/ModalName";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import { observer } from "mobx-react-lite";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import showModalFromId from "../../shared/functions/ModalShow";
import CheckInMonthModal from "../dialogs/check-in-month/CheckInMonthModal";
import CheckInMonthItem from "./CheckInMonthItem";
import { useNavigate, useParams } from "react-router-dom";

const CheckInYearView = observer(() => {
  const { api, store } = useAppContext();
  const { yearId = 'defaultYearId' } = useParams<{ yearId?: string }>();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [_, setTitle] = useTitle();

  const year = store.checkIn.checkInYear.getById(yearId)
  const months = store.checkIn.checkInMonth.all;

  useBackButton("/c/checkin");

  const handleNewMonth = () => {
    showModalFromId(MODAL_NAMES.CHECKIN.CHECK_IN_MONTH);
  };

  useEffect(() => {
    if (year) setTitle(`Check In for ${year.asJson.yearName}`);
    else navigate(`/c/checkin`);
  }, [navigate, year, setTitle]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await api.checkIn.checkInMonth.getAll(yearId);
      } catch (error) { }
      setLoading(false)
    };
    
    loadData()

  }, [api.checkIn.checkInMonth, yearId]);

  return (
    <ErrorBoundary>
      <div className="checkin-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <div className="sticky-top">
            <ErrorBoundary>
              <Toolbar
                rightControls={
                  <div className="uk-inline">
                    <button className="btn btn-primary" onClick={handleNewMonth}>
                      <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                      New Month
                    </button>
                  </div>
                }
              />
            </ErrorBoundary>
          </div>
          <ErrorBoundary>
            {!loading && (
              <div className="uk-grid-small" data-uk-grid>
                {months.sort((a, b) => a.asJson.endingDate - b.asJson.endingDate).map((month) => (
                  <CheckInMonthItem key={month.asJson.id} month={month.asJson} />
                ))}
              </div>
            )}
          </ErrorBoundary>
          {loading && <LoadingEllipsis />}
        </div>
      </div>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.CHECKIN.CHECK_IN_MONTH}>
          <CheckInMonthModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CheckInYearView;
