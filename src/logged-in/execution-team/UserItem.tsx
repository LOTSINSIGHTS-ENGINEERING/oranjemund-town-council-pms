import { useNavigate } from "react-router-dom";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import { useAppContext } from "../../shared/functions/Context";
import { IUser } from "../../shared/models/User";

interface IProps {
  user: IUser;
}
const UserItem = (props: IProps) => {
  const { store } = useAppContext();

  const { user } = props;
  const { displayName, uid, jobTitle } = user;
  // user intials
  const initials = displayName
    ?.split(" ")
    .slice(0, 2)
    .map((name) => name[0])
    .join("");
  const navigate = useNavigate();

  const handleView = () => {
    store.user.select(user);
    navigate(uid);
  };

  const onView = () => {
    if (user.role === USER_ROLES.EXECUTIVE_USER) {
    } else handleView();
  };

  return (
    <div className="user-item uk-card uk-card-default">
      <div className="body">
        <div className="profile">
          <div className="initials">{initials}</div>
        </div>
        <p className="label">Username</p>
        <h6 className="name">{displayName}</h6>

        <p className="label">Role</p>
        <p className="position">{jobTitle || "Unknown"}</p>
      </div>
      <div className="footer uk-text-center">
        <button className="btn-icon uk-margin-small-right" onClick={onView}>
          View Scorecard <span uk-icon="arrow-right"></span>
        </button>
      </div>
    </div>
  );
};

export default UserItem;
