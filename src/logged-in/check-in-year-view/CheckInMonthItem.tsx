import { useAppContext } from "../../shared/functions/Context";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ICheckInMonth } from "../../shared/models/check-in-model/CheckInMonth";

interface IEditProps {
  monthName: string;
  unsavedChanges: boolean;
  loading: boolean;
  handleDelete: () => Promise<void>;
  handleUpdate: (value: string) => void;
}
const Settings = (props: IEditProps) => {

  const { monthName, handleDelete, unsavedChanges, loading, handleUpdate } = props;

  return (
    <div className="checkin-edit" uk-dropdown="mode: click">
      <div>
        <div className="dropdown-input">
          <input
            className="uk-input uk-form-small"
            type="text"
            name="name"
            id="name"
            placeholder="month name"
            defaultValue={monthName}
            onChange={(e) => handleUpdate(e.target.value)}
          />
          {unsavedChanges && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                backgroundColor: "#00000015",
              }}
            >
              <div data-uk-spinner="ratio: 1.5"></div>
            </div>
          )}
        </div>
      </div>
      <div className="actions">
        <button type="button" className="checkin-actions" onClick={handleDelete}>
          Delete
        </button>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              backgroundColor: "#00000015",
            }}
          >
            <div data-uk-spinner="ratio: 1.5"></div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ItemProps {
  month: ICheckInMonth;
}

const CheckInMonthItem = observer((props: ItemProps) => {

  const { month } = props;
  const { api, ui } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [unsavedChanges, setunSavedChanges] = useState(false);

  const onView = () => {
    navigate(`/c/checkin/${month.yearId}/${month.id}`);
  };

  const handleUpdate = async (value: string) => {
    try {
      month.monthName = value;
      setunSavedChanges(true);
      await api.checkIn.checkInMonth.update(month);
      setunSavedChanges(false);

    } catch {
      ui.snackbar.load({
        id: Date.now(),
        type: "success",
        message: `Failed to update`,
        timeoutInMs: 10000,
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete?")) return;
    try {
      setLoading(true);
      await api.checkIn.checkInMonth.delete(month);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        type: "success",
        message: `Failed to delete`,
        timeoutInMs: 10000,
      });
    }
    setLoading(false);
  };

  return (
    <div className="checkin-card-body">
      <div className="checkin-file">
        <div className="checkin-image" onClick={onView}>
          <img
            src={process.env.PUBLIC_URL + "/icons/folder_icon.svg"}
            width="1700"
            height="1100"
            alt=""
          />
        </div>
        <button className="edit-icon" data-uk-tooltip="Edit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </button>
        <Settings
          monthName={month.monthName}
          handleDelete={handleDelete}
          loading={loading}
          unsavedChanges={unsavedChanges}
          handleUpdate={handleUpdate}
        />
      </div>
      <div className="checkin-title">
        <p>{month.monthName}</p>
      </div>
    </div>
  );
});
export default CheckInMonthItem