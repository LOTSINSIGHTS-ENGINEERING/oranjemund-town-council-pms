import { useAppContext } from "../../shared/functions/Context";
import { ICheckInYear } from "../../shared/models/check-in-model/CheckInYear";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import icons from "../shared/utils/icons";

interface IEditProps {
  yearName: string;
  unsavedChanges: boolean;
  loading: boolean;
  handleDelete: () => Promise<void>;
  handleUpdate: (value: string) => void;
}
const Settings = (props: IEditProps) => {

  const { yearName, handleDelete, unsavedChanges, loading, handleUpdate } = props;

  return (
    <div className="checkin-edit" data-uk-dropdown="mode: click">
      <div>
        <div className="dropdown-input">
          <input
            className="uk-input uk-form-small"
            type="text"
            name="name"
            id="name"
            placeholder="year name"
            defaultValue={yearName}
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
  year: ICheckInYear;
}

const CheckInYearItem = observer((props: ItemProps) => {
  const { year } = props;
  const { store, api, ui } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [unsavedChanges, setunSavedChanges] = useState(false);

  const onView = () => {
    store.checkIn.checkInYear.select(year);
    navigate(`/c/checkin/${year.id}`);
  };

  const handleUpdate = async (value: string) => {
    try {
      year.yearName = value;
      setunSavedChanges(true);
      await api.checkIn.checkInYear.update(year);
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
      await api.checkIn.checkInYear.delete(year);
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
          <img src={icons.circularpen} alt={"Edit"} width="15" height="15" data-uk-svg />
        </button>
        <Settings
          yearName={year.yearName}
          handleDelete={handleDelete}
          loading={loading}
          unsavedChanges={unsavedChanges}
          handleUpdate={handleUpdate}
        />
      </div>
      <div className="year-title">
        <small data-uk-tooltip={year.yearName}>{year.yearName}</small>
        <span></span>
      </div>
    </div>
  );
});
export default CheckInYearItem