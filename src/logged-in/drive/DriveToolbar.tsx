import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import MODAL_NAMES from "../dialogs/ModalName";
import Toolbar from "../shared/components/toolbar/Toolbar";

interface IProps {
  id: string;
  handleNewFolder: () => void;
}
const DriveToolbar = observer(({ id, handleNewFolder }: IProps) => {
  const { store } = useAppContext();

  const [canEdit, setCanEdit] = useState(true);
  // current folder.
  const currentFolder = store.folder.currentFolder;
  // Logged in user
  const me = store.auth.meJson;

  const handleUpload = () => {
    showModalFromId(MODAL_NAMES.PROOF_OF_WORK.FOLDER_FILE_UPLOADER_MODAL); // show modal
  };

  useEffect(() => {
    if (!currentFolder || !me) {
      setCanEdit(false);
    } else {
      const folderAccess =
        currentFolder.department === me.department &&
        (currentFolder.createdBy === me.uid ||
          currentFolder.id.includes(me.uid));
      const folderType =
        currentFolder.type === "Perspective" || currentFolder.type === "Other";
      setCanEdit(folderType && folderAccess);
    }
  }, [currentFolder, me]);

  return (
    <div className="drive-toolbar uk-margin">
      <Toolbar
        title="Portfolio of Evidence"
        rightControls={
          <div className="uk-inline">
            <button className="btn btn-primary" disabled={!canEdit}>
              <span data-uk-icon="icon: plus-circle; ratio: .8"></span> More
            </button>

            {canEdit && (
              <Dropdown pos="bottom-right">
                <li>
                  <button
                    className="kit-dropdown-btn"
                    onClick={handleNewFolder}
                  >
                    <span data-uk-icon="icon: folder; ratio: .8"></span>
                    New Folder
                  </button>
                </li>

                {id && (
                  <li>
                    <button className="kit-dropdown-btn" onClick={handleUpload}>
                      <span data-uk-icon="icon: upload; ratio:.8"></span>
                      Upload File
                    </button>
                  </li>
                )}
              </Dropdown>
            )}
          </div>
        }
      />
    </div>
  );
});

export default DriveToolbar;
