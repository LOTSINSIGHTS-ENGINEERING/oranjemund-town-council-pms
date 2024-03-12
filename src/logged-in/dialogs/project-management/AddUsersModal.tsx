import { observer } from "mobx-react-lite";
import { FC, useMemo, useState } from "react";
import SingleSelect from "../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../shared/functions/Context";

import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IProject } from "../../../shared/models/ProjectManagement";
import { IUser } from "../../../shared/models/User";
import MODAL_NAMES from "../ModalName";
import "./task.scss";
import { MAIL_EMAIL, MAIL_PROJECT_ADDED } from "../../../shared/functions/mailMessages";

export interface IModelType {
  projectId: string;
}
const AddUserModal: FC<IModelType> = observer(({ projectId }) => {
  const { api, store } = useAppContext();
  const me = store.auth.meJson;

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const onSearch = (value: string) => setSearch(value);

  const user: IUser | undefined = store.user.getItemById(search)?.asJson;
  const project: IProject | undefined = store.projectManagement.getItemById(projectId)?.asJson;

  const users = useMemo(() => {
    return search ? store.user.all.filter((u) => u.asJson.uid === search) : store.user.all;
  }, [search, store.user.all]);

  const options = users.map((user) => ({
    label: user.asJson.displayName || "",
    value: user.asJson.uid,
  }));


  const onAddUser = async () => {
    if (!project) return;

    const { MY_SUBJECT, MY_BODY } = MAIL_PROJECT_ADDED(me?.displayName!, project.projectName);
    setLoading(true);

    const _project: IProject = {
      ...project,
      usersId: [...project.usersId, search],
    }

    try {
      await api.projectManagement.addProjectMember(_project);
      await api.mail.sendMail([user?.email!], MAIL_EMAIL, [""], MY_SUBJECT, MY_BODY)
    } catch (error) { }

    setLoading(false);
    onCancel();

  };

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.PROJECTS.ADD_USER);
  };

  return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-height-medium" data-uk-overflow-auto>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Users</h3>
      <div className="dialog-content uk-position-relative" style={{ display: "flex", alignItems: "center" }}>
        <SingleSelect
          name="search-team"
          options={options}
          width="90%"
          onChange={onSearch}
          placeholder="Search by name"
        />
        <button className="uk-margin adduser" onClick={onAddUser}>
          Save
          {loading && <div data-uk-spinner="ratio: .5"></div>}
        </button>
      </div>
    </div>
  );
});

export default AddUserModal;