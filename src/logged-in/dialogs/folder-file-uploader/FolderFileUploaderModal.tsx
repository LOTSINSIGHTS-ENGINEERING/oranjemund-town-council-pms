import { observer } from "mobx-react-lite";
import { FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import useFileUploader from "../../../shared/hooks/useFileUploader";
import MODAL_NAMES from "../ModalName";
import FolderFileUploaderForm from "./FolderFileUploaderForm";

interface IProps {
  id: string;
}
const FolderFileUploaderModal = observer(({ id }: IProps) => {
  const { onUpload } = useFileUploader();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedFiles) return;
    // upload files
    for (let i = 0; i < acceptedFiles.length; i++) {
      const path = "/" + id;
      onUpload(path, acceptedFiles[i]);
    }

    onCancel();
  };

  const onCancel = () => {
    acceptedFiles.length = 0;
    // hide modal
    hideModalFromId(MODAL_NAMES.PROOF_OF_WORK.FOLDER_FILE_UPLOADER_MODAL);
  };

  return (
    <div className="folder-file-uploader-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
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
          <FolderFileUploaderForm
            acceptedFiles={acceptedFiles}
            getInputProps={getInputProps}
            getRootProps={getRootProps}
          />

          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
            >
              Close
            </button>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default FolderFileUploaderModal;
