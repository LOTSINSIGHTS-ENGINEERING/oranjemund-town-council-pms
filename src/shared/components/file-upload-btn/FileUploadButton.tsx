import { ChangeEvent } from "react";

interface Props {
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  label: string;
  name: string;
}
const FileUploadButton = (props: Props) => {
  const { onFileChange, name, label } = props;
  return (
    <label className="uk-button secondary uk-margin-small-right">
      <input
        type="file"
        name={name}
        id={`upload-${name}`}
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      {label}
    </label>
  );
};

export default FileUploadButton;
