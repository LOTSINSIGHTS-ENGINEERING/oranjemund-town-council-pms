import { useAppContext } from "../../shared/functions/Context";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../shared/models/User";
import { ICheckInMonth } from "../../shared/models/check-in-model/CheckInMonth";

interface ItemProps {
  user: IUser;
  month: ICheckInMonth;
}

const CheckInUserItem = observer((props: ItemProps) => {
  const { user, month } = props;

  const { store } = useAppContext();
  const navigate = useNavigate();

  const onView = () => {
    store.checkIn.checkInMonth.select(month);
    navigate(`/c/checkin/${month.yearId}/${month.id}/${user.uid}`);
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
      </div>
      <div className="checkin-title"><p>{user.displayName}</p></div>
    </div>
  );
});
export default CheckInUserItem