import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultUser, IUser } from "../../../shared/models/User";
import MODAL_NAMES from "../ModalName";
import UserForm from "./UserForm";

const UserModal = observer(() => {
  
  const { api, store, ui } = useAppContext();

  const [user, setUser] = useState({ ...defaultUser });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const selected = store.user.selected;

    if (selected) await update(user);
    else await create(user);
    setLoading(false);
    onCancel();
  };

  const update = async (user: IUser) => {
    try {
      await api.user.update(user);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Failed to update user.",
        type: "warning",
      });
    }
  };

  const create = async (user: IUser) => {
    try {
      await api.user.create(user);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Failed to create user.",
        type: "warning",
      });
    }
  };

  const onCancel = () => {
    // clear selected user
    store.user.clearSelected();
    // reset form
    setUser({ ...defaultUser });
    // hide modal
    hideModalFromId(MODAL_NAMES.ADMIN.USER_MODAL);
  };

  // if selected user, set form values
  useEffect(() => {
    if (store.user.selected) setUser({ ...store.user.selected });
    else setUser({ ...defaultUser });
  }, [store.user.selected]);

  return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">User</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          onSubmit={handleSubmit}
          data-uk-grid
        >
          <UserForm user={user} setUser={setUser} />
          

          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default UserModal;
