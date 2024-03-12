import React from "react";
import { IFolderFile } from "../../../shared/models/FolderFile";

interface IProps {
  file: IFolderFile;
  setFile: React.Dispatch<React.SetStateAction<IFolderFile>>;
}
const FolderFileForm = (props: IProps) => {
  const { file, setFile } = props;

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="file-name">
          Name
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="file-name"
            type="text"
            placeholder="Name e.g. ICT"
            value={file.name}
            onChange={(e) => setFile({ ...file, name: e.target.value })}
            required
          />
        </div>
      </div>
    </>
  );
};

export default FolderFileForm;
