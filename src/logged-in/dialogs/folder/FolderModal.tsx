import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultFolder, IFolder } from "../../../shared/models/Folder";
import MODAL_NAMES from "../ModalName";
import FolderForm from "./FolderForm";

const FolderModal = observer(() => {
  const { api, store } = useAppContext();

  const me = store.auth.meJson;

  const [folder, setFolder] = useState<IFolder>({
    ...defaultFolder,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!me) return; // TODO: handle not logged in error.

    setLoading(true); // start loading

    // if selected folder, update
    const selected = store.folder.selected;

    folder.department = me.department; // update folder department
    if (selected) await update(folder);
    else await create(folder);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (folder: IFolder) => {
    try {
      await api.folder.update(folder);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const create = async (folder: IFolder) => {
    try {
      await api.folder.create(folder);
    } catch (error) {
      console.log("Failed to create> Error: ", error);
    }
  };

  const onCancel = () => {
    // clear selected folder
    store.folder.clearSelected();
    // reset form
    setFolder({ ...defaultFolder });
    // hide modal
    hideModalFromId(MODAL_NAMES.PROOF_OF_WORK.FOLDER_MODAL);
  };

  // if selected folder, set form values
  useEffect(() => {
    if (store.folder.selected) {
      setFolder(store.folder.selected);
    }
  }, [store.folder.selected]);

  return (
    <div className="folder-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Folder</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          onSubmit={handleSubmit}
          data-uk-grid
        >
          <FolderForm folder={folder} setFolder={setFolder} />

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

export default FolderModal;
