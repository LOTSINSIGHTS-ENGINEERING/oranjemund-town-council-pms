import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultFolderFile, IFolderFile } from "../../../shared/models/FolderFile";
import MODAL_NAMES from "../ModalName";
import FolderFileForm from "./FolderFileForm";

const FolderFileModal = observer(() => {
  const { api, store } = useAppContext();

  const [folderFile, setFolderFile] = useState<IFolderFile>({
    ...defaultFolderFile,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // start loading

    // if selected folderFile, update
    const selected = store.folderFile.selected;

    if (selected) await update(folderFile);
    else await create(folderFile);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (folderFile: IFolderFile) => {
    try {
      await api.folderFile.update(folderFile);
    } catch (error) {
      // console.log(error);
    }
  };

  const create = async (folderFile: IFolderFile) => {
    try {
      await api.folderFile.create(folderFile);
    } catch (error) {
      // console.log(error);
    }
  };

  const onCancel = () => {
    // console.log("Cancelling");

    // clear selected folderFile
    store.folderFile.clearSelected();
    // reset form
    setFolderFile({ ...defaultFolderFile });
    // hide modal
    hideModalFromId(MODAL_NAMES.PROOF_OF_WORK.FOLDER_FILE_MODAL);
  };

  // if selected folderFile, set form values
  useEffect(() => {
    if (store.folderFile.selected) setFolderFile(store.folderFile.selected);
  }, [store.folderFile.selected]);

  return (
    <div className="folderFile-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">File</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          onSubmit={handleSubmit}
          data-uk-grid
        >
          <FolderFileForm file={folderFile} setFile={setFolderFile} />

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

export default FolderFileModal;
