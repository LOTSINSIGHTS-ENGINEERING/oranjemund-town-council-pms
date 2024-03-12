import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";

interface IProps {
  acceptedFiles: File[];
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
}
const FolderFileUploaderForm = ({
  acceptedFiles,
  getRootProps,
  getInputProps,
}: IProps) => {
  const files = acceptedFiles.map((file) => (
    <div className="selected-file uk-width-1-1" key={file.name}>
      <img src={process.env.PUBLIC_URL + "/icons/file_icon2.png"} alt="" />
      <p className="file-name">{file.name}</p>
    </div>
  ));

  return (
    <>
      <section className="drag-zone uk-width-1-1">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </section>

      <h4 className="selected-files-title">Selected Files</h4>
      <>{files}</>
    </>
  );
};

export default FolderFileUploaderForm;
