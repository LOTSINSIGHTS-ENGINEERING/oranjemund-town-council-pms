import React, { useEffect, useState } from "react";
import ContextMenu, {
  ContextMenuOption,
} from "../../shared/components/context-menu/ContextMenu";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { IFolderFile } from "../../shared/models/FolderFile";
import MODAL_NAMES from "../dialogs/ModalName";
import { getIconForExtension } from "./FileExtension";

interface IProps {
  index: number;
  file: IFolderFile;
  path: string[];
}
const FolderFileItem = ({ file, index, path }: IProps) => {
  const { api, store, ui } = useAppContext();
  const me = store.auth.meJson;

  const disableEdit = () => {
    if (!me) return;
    const hideEdit = path[2] === me.uid;
    return hideEdit;
  };

  const [copyLinkBtnText, setCopyLinkBtnText] = useState<
    "Copy Link" | "Copied"
  >("Copy Link");

  const style = { "--i": index } as React.CSSProperties;

  const onOpen = () => {
    window.open(
      file.url,
      "_blank" // <- This is what makes it open in a new window.
    );
  };

  const onRename = () => {
    store.folderFile.select(file);
    showModalFromId(MODAL_NAMES.PROOF_OF_WORK.FOLDER_FILE_MODAL); // show modal
  };

  const onDelete = async () => {
    if (!window.confirm("Delete file?")) return;
    // delete file
    try {
      await api.folderFile.delete(file);
      ui.snackbar.load({
        id: Date.now(),
        message: "File deleted.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to delete file.",
        type: "danger",
      });
    }
  };

  const onCopyLink = () => {
    window.navigator.clipboard.writeText(file.url); // add to clipboard
    setCopyLinkBtnText("Copied"); // TODO: alert copied to clipboard
  };

  useEffect(() => {
    if (copyLinkBtnText === "Copy Link") return;

    setTimeout(() => {
      setCopyLinkBtnText("Copy Link");
    }, 1100);

    return () => {};
  }, [copyLinkBtnText]);

  return (
    <ContextMenu
      options={
        <ErrorBoundary>
          {disableEdit() && (
            <>
              <ContextMenuOption onClick={onOpen}>
                <span data-uk-icon="icon: expand; ratio: .8"></span> Open
              </ContextMenuOption>
              <ContextMenuOption onClick={onRename}>
                <span data-uk-icon="icon: pencil; ratio: .8"></span> Rename
              </ContextMenuOption>
              <ContextMenuOption onClick={onDelete}>
                <span data-uk-icon="icon: trash; ratio: .8"></span> Delete
              </ContextMenuOption>

              <ContextMenuOption
                onClick={onCopyLink}
                success={copyLinkBtnText === "Copied"}
              >
                <span
                  data-uk-icon={`icon: ${
                    copyLinkBtnText === "Copied" ? "check" : "link"
                  }; ratio: .8`}
                ></span>
                {copyLinkBtnText}
              </ContextMenuOption>
            </>
          )}
        </ErrorBoundary>
      }
    >
      <button
        className="file-item"
        style={style}
        onClick={onOpen}
        data-uk-tooltip={file.name}
      >
        <div className="file-item__icon">
          <img src={getIconForExtension(file.extension)} alt="" />
        </div>
        <div className="file-item__content">
          {/* <div className="file-item__content__name">{file.name}</div> */}
        </div>
      </button>
    </ContextMenu>
  );
};

export default FolderFileItem;
