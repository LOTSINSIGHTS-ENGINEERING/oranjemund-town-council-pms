import { useState } from "react";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { IUser } from "../../shared/models/User";
import MODAL_NAMES from "../dialogs/ModalName";

interface IProps {
  user: IUser;

}

const UserItem = (props: IProps) => {
  const { api, store } = useAppContext();

  const [loading, setLoading] = useState(false);

  const { user } = props;
  const cssClass = user.userVerified ? "user" : "user user__not-verified";

  const department = store.department.getById(user.department);
  const departmentName = department ? department.asJson.name : "-";

  const handleEdit = () => {
    store.user.select(user); // set selected user
    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL); // show modal
  };

  //  const handleEditJobCard = () => {
  //    store.user.select(u); // set selected user
  //    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL); // show modal
  //  };

  const disableDB = async () => {
    setLoading(true);

    try {
      await api.user.update({ ...user, disabled: true });
    } catch (error) { }
    setLoading(false);
  };

  const enableDB = async () => {
    setLoading(true);
    try {
      await api.user.update({ ...user, disabled: false });
    } catch (error) { }
    setLoading(false);
  };

  // const handleDisable = async () => {
  //   setLoading(true);
  //   try {
  //     await api.user.disable(user);
  //   } catch (error) { }
  //   setLoading(false);
  // };

  // const handleEnable = async () => {
  //   setLoading(true);
  //   try {
  //     await api.user.enable(user);
  //   } catch (error) { }
  //   setLoading(false);
  // };

  const handleVerify = async () => {
    if (!window.confirm("Verify user?")) return; // TODO: confirmation dialog
    try {
      await api.user.update({ ...user, userVerified: true }); // update user
      // TODO: notify user (success snackbar)
    } catch (error) {
      // TODO: error handling
      console.log(error);
    }
  };

  return (
    <div
      className={`${cssClass} uk-card uk-card-default uk-card-body uk-card-small`}
    >
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">name</span>
            {user.displayName}
          </h6>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="role">
            <span className="span-label">User rights</span>
            {user.role || "-"}
          </p>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="role">
            <span className="span-label">Position</span>
            {user.jobTitle || "-"}
          </p>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="department-name">
            <span className="span-label">Department</span>
            {departmentName}
          </p>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-1-6@m uk-text-right">
          <div className="controls">
            {!user.userVerified && (
              <button
                className="btn-icon uk-margin-small-right"
                onClick={handleVerify}
              >
                <span data-uk-icon="check"></span>Verify
              </button>
            )}
            <button className="btn-icon" title="Edit" onClick={handleEdit}>
              <span data-uk-icon="pencil"></span>
            </button>

            {user.disabled ? (
              <button
                className="btn-icon"
                onClick={enableDB}
                disabled={loading}
                title="Unlock Account"
              >
                {!loading && <span data-uk-icon="lock"></span>}
                {loading && <div data-uk-spinner="ratio: .6"></div>}
              </button>
            ) : (
              <button
                className="btn-icon"
                onClick={disableDB}
                disabled={loading}
                title="Lock Account"
              >
                {!loading && <span data-uk-icon="unlock"></span>}
                {loading && <div data-uk-spinner="ratio: .6"></div>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
