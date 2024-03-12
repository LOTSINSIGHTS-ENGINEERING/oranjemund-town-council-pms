import React from "react";
import { IFolder } from "../../../shared/models/Folder";

interface IProps {
  folder: IFolder;
  setFolder: React.Dispatch<React.SetStateAction<IFolder>>;
}
const FolderForm = (props: IProps) => {
  const { folder, setFolder } = props;

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="folder-fname">
          Name
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="folder-fname"
            type="text"
            placeholder="Name e.g. ICT"
            value={folder.name}
            onChange={(e) => setFolder({ ...folder, name: e.target.value })}
            required
          />
        </div>
      </div>
    </>
  );
};

export default FolderForm;
