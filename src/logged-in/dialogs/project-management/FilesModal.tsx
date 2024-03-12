import { FC } from "react";
import './task.scss';

export interface Files {
  tasks: any[] | any;
}

const FilesModal: FC<Files> = ({ tasks }) => {
  const files: any[] = [];
  tasks?.forEach((task: any) => {
    if (task?.files?.length > 0)
      files?.push(...task?.files);
  });

  const fileIcons = (name: string) => {
    const ext = name?.substring((name.lastIndexOf(".") + 1)).toLowerCase();
    if (ext === "jpg" || ext === "png" || ext === "gif" || ext === "tiff" || ext === "psd" || ext === "ai" || ext === "indd" || ext === "raw")
      return (
        <svg
          width="35"
          height="35"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 7C5.34315 7 4 8.34315 4 10C4 11.6569 5.34315 13 7 13C8.65685 13 10 11.6569 10 10C10 8.34315 8.65685 7 7 7ZM6 10C6 9.44772 6.44772 9 7 9C7.55228 9 8 9.44772 8 10C8 10.5523 7.55228 11 7 11C6.44772 11 6 10.5523 6 10Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 3C1.34315 3 0 4.34315 0 6V18C0 19.6569 1.34315 21 3 21H21C22.6569 21 24 19.6569 24 18V6C24 4.34315 22.6569 3 21 3H3ZM21 5H3C2.44772 5 2 5.44772 2 6V18C2 18.5523 2.44772 19 3 19H7.31374L14.1924 12.1214C15.364 10.9498 17.2635 10.9498 18.435 12.1214L22 15.6863V6C22 5.44772 21.5523 5 21 5ZM21 19H10.1422L15.6066 13.5356C15.9971 13.145 16.6303 13.145 17.0208 13.5356L21.907 18.4217C21.7479 18.7633 21.4016 19 21 19Z"
            fill="currentColor"
          />
        </svg>
      );

    if (ext === "php" || ext === "java" || ext === "pl" || ext === "js" || ext === "ts" || ext === "py" || ext === "bal" || ext === "html" || ext === "scss" || ext === "css")
      return (
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.325 3.05011L8.66741 20.4323L10.5993 20.9499L15.2568 3.56775L13.325 3.05011Z"
            fill="currentColor"
          />
          <path
            d="M7.61197 18.3608L8.97136 16.9124L8.97086 16.8933L3.87657 12.1121L8.66699 7.00798L7.20868 5.63928L1.04956 12.2017L7.61197 18.3608Z"
            fill="currentColor"
          />
          <path
            d="M16.388 18.3608L15.0286 16.9124L15.0291 16.8933L20.1234 12.1121L15.333 7.00798L16.7913 5.63928L22.9504 12.2017L16.388 18.3608Z"
            fill="currentColor"
          />
        </svg>
      );

    if (ext === "pdf" || ext === "docs" || ext === "docx" || ext === "pptx" || ext === "ptx" || ext === "txt" || ext === "doc" || ext === "xls" || ext === "xlsx" || ext === "ods")
      return (
        <svg
          width="35"
          height="35"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 18H17V16H7V18Z" fill="currentColor" />
          <path d="M17 14H7V12H17V14Z" fill="currentColor" />
          <path d="M7 10H11V8H7V10Z" fill="currentColor" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z"
            fill="currentColor"
          />
        </svg>
      );

    if (ext === "fbx" || ext === "gbl" || ext === "3d" || ext === "blend")
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      );

    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
    )
  }

  return (
    // 
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-2-3" data-uk-overflow-auto>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <div className="decription">
        <h5 style={{ display: "flex", alignItems: "center" }}>
          <svg
            width="35"
            height="35"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 1.5C2.89543 1.5 2 2.39543 2 3.5V4.5C2 4.55666 2.00236 4.61278 2.00698 4.66825C0.838141 5.07811 0 6.19118 0 7.5V19.5C0 21.1569 1.34315 22.5 3 22.5H21C22.6569 22.5 24 21.1569 24 19.5V7.5C24 5.84315 22.6569 4.5 21 4.5H11.874C11.4299 2.77477 9.86384 1.5 8 1.5H4ZM9.73244 4.5C9.38663 3.9022 8.74028 3.5 8 3.5H4V4.5H9.73244ZM3 6.5C2.44772 6.5 2 6.94772 2 7.5V19.5C2 20.0523 2.44772 20.5 3 20.5H21C21.5523 20.5 22 20.0523 22 19.5V7.5C22 6.94772 21.5523 6.5 21 6.5H3Z"
              fill="currentColor"
            />
          </svg>
          &nbsp;&nbsp;
          <span style={{ fontSize: "1.5rem" }}>Project Attachments</span>
        </h5>
        <div className="file-list">
          {
            files.map((file: any, key) =>
            (<div key={`${key}l;kinknj ${file.link}`} className="file-list-item">
              <div className="icon">
                {fileIcons(file.name)}
              </div>
              <div className="name">
                <a href={file.link}>{file.name}</a>
              </div>
            </div>)
            )
          }
          {files.length === 0 && <span>no attachments</span>}
        </div>
      </div>
    </div>
  );
};

export default FilesModal;
