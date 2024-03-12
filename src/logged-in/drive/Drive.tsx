import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import useTitle from "../../shared/hooks/useTitle";
import FolderModal from "../dialogs/folder/FolderModal";
import MODAL_NAMES from "../dialogs/ModalName";
import DriveToolbar from "./DriveToolbar";
import FolderGrid from "./FolderGrid";
import UploadTaskModel from "../../shared/models/UploadTask";
import { UploadTaskSnapshot, StorageError, getDownloadURL } from "firebase/storage";
import { IFolderFile } from "../../shared/models/FolderFile";
import FolderFileModal from "../dialogs/folder-file/FolderFileModal";
import useBackButton from "../../shared/hooks/useBack";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import FolderFileUploaderModal from "../dialogs/folder-file-uploader/FolderFileUploaderModal";

interface IUploadTaskItemProps {
  uploadTask: UploadTaskModel;
}
const UploadTaskItem = observer((props: IUploadTaskItemProps) => {
  const { api, store } = useAppContext();
  const { uploadTask } = props;
  const { id: folderId } = useParams();

  const { id, task, fileName, fileExtension } = uploadTask.asJson;

  const [progress, setProgress] = useState(0);
  const [_, setError] = useState("");

  const onChange = (snapshot: UploadTaskSnapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setProgress(progress); // update progress status
  };

  const onError = useCallback(
    (error: StorageError) => {
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          setError("User doesn't have permission to access the object");
          break;
        case "storage/canceled":
          // User canceled the upload
          setError("User canceled the upload");
          break;
        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          setError("Unknown error occurred, inspect error.serverResponse");
          break;
      }

      store.uploadManager.remove(id); // remove from store
    },
    [id, store.uploadManager]
  );

  const onComplete = useCallback(async () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(task.snapshot.ref).then(async (url) => {
      const me = store.auth.meJson; // me
      // folder file
      const folderFile: IFolderFile = {
        id: "",
        name: fileName,
        folderId: folderId || "root",
        url: url,
        extension: fileExtension,
        createdAt: Date.now(),
        createdBy: me ? me.uid : "",
      };

      await api.folderFile.create(folderFile); // create folderFile
      store.uploadManager.remove(id); // remove from store
    });
  }, [
    task.snapshot.ref,
    store.auth.meJson,
    store.uploadManager,
    fileName,
    folderId,
    fileExtension,
    api.folderFile,
    id,
  ]);

  const onCancel = () => {
    const task = store.uploadManager.getById(id);
    if (!task) return;

    task.asJson.task.cancel();
    store.uploadManager.remove(id); // remove from store
  };

  useEffect(() => {
    // Listen for state changes, errors, and completion of the upload.
    task.on("state_changed", onChange, onError, onComplete);
  }, [onComplete, onError, task]);

  return (
    <li className="upload-task">
      <div className="upload-task__icon">
        <img src={process.env.PUBLIC_URL + "/icons/file_icon2.png"} alt="" />
      </div>

      <div className="upload-task__content">
        <div className="uk-flex uk-flex-between">
          <p className="upload-task__content__file-name">{fileName}</p>
          <p className="upload-task__content__progress-percentage">
            {Math.round(progress * 100) / 100}%
          </p>
        </div>
        <div className="upload-task__content__progress-bar">
          <div
            className="progress-indicator"
            style={{ width: progress + "%" }}
          ></div>
        </div>
      </div>

      <div className="upload-task__stop-play-btn">
        <button className="btn-icon" onClick={() => onCancel()}>
          ×
        </button>
      </div>
    </li>
  );
});

const UploadingStatusPopup = observer(() => {
  const { store } = useAppContext();
  const [isUploading, setIsUploading] = useState(true);

  const tasks = store.uploadManager.all;

  useEffect(() => {
    setIsUploading(store.uploadManager.all.length > 0);
  }, [store.uploadManager.all]);

  return (
    <ErrorBoundary>
      {isUploading && (
        <div className="uploading-status-popup uk-card uk-card-default uk-card-body uk-card-small">
          <h6 className="title">Uploads</h6>

          <ul className="upload-tasks-list">
            {tasks.map((task) => (
              <ErrorBoundary key={task.asJson.id}>
                <UploadTaskItem uploadTask={task} />
              </ErrorBoundary>
            ))}
          </ul>
        </div>
      )}
    </ErrorBoundary>
  );
});

const Drive = observer(() => {
  const { store } = useAppContext();
  const { id } = useParams();

  useTitle("Portfolio of Evidence");
  useBackButton();

  const [parent, setParent] = useState("root");

  const handleNewFolder = () => {
    store.folder.clearSelected(); // clear selected folder
    showModalFromId(MODAL_NAMES.PROOF_OF_WORK.FOLDER_MODAL); // show modal
  };

  useEffect(() => {
    setParent(id ? id : "root");
  }, [id]);

  return (
    <ErrorBoundary>
      <div className="drive-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <DriveToolbar id={id || "root"} handleNewFolder={handleNewFolder} />
          </ErrorBoundary>
          <ErrorBoundary>
            <FolderGrid parent={parent} id={id || "root"} />
          </ErrorBoundary>
          <ErrorBoundary>
            <UploadingStatusPopup />
          </ErrorBoundary>
        </div>
      </div>

      <ErrorBoundary>
        {id && (
          <Modal modalId={MODAL_NAMES.PROOF_OF_WORK.FOLDER_FILE_UPLOADER_MODAL}>
            <FolderFileUploaderModal id={id} />
          </Modal>
        )}
        <Modal modalId={MODAL_NAMES.PROOF_OF_WORK.FOLDER_FILE_MODAL}>
          <FolderFileModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.PROOF_OF_WORK.FOLDER_MODAL}>
          <FolderModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default Drive;
