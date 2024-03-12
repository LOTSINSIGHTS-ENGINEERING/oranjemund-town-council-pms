import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContextMenu, { ContextMenuOption } from "../../shared/components/context-menu/ContextMenu";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { IFolder } from "../../shared/models/Folder";
import MODAL_NAMES from "../dialogs/ModalName";

interface IProps {
  index: number;
  folder: IFolder;
  path: string[];
}
const FolderItem = ({ index, folder, path }: IProps) => {
  const { api, store, ui } = useAppContext();
  const navigate = useNavigate();
  const me = store.auth.meJson;

  const disableEdit = () => {
    if (!me) return;
    const hideEdit = path[2] === me.uid;
    return hideEdit;
  };

  const style = { "--i": index } as React.CSSProperties;
  const ROOT_PATH = window.location.href;
  const [copyLinkBtnText, setCopyLinkBtnText] = useState<
    "Copy Link" | "Copied"
  >("Copy Link");
  const [isLocked, setisLocked] = useState(true);
  const className = isLocked ? "folder folder--locked" : "folder";

  const onOpen = () => {
    if (isLocked) return; // TODO: cannot do action for locked actions.
    navigate(`/c/drive/${folder.id}`);
  };

  const onRename = () => {
    if (isLocked) return; // TODO: cannot do action for locked actions.
    store.folder.select(folder);
    showModalFromId(MODAL_NAMES.PROOF_OF_WORK.FOLDER_MODAL); // show modal
  };

  const onDelete = async () => {
    if (!window.confirm("Delete folder?")) return;
    // delete Folder
    try {
      await api.folder.delete(folder);
      ui.snackbar.load({
        id: Date.now(),
        message: "Folder deleted.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to delete folder.",
        type: "danger",
      });
    }
  };

  const onCopyLink = () => {
    if (isLocked) return; // TODO: cannot do action for locked actions.
    const basePathArr = ROOT_PATH.split("/");
    basePathArr.pop();

    const basePath = basePathArr.join("/");

    if (!basePath) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to copy folder.",
        type: "danger",
      });
    } else {
      const path = `${basePath}/${folder.id}`;
      window.navigator.clipboard.writeText(path); // add to clipboard
      ui.snackbar.load({
        id: Date.now(),
        message: "Folder path copied to clipboard.",
        type: "success",
      });
      setCopyLinkBtnText("Copied");
    }
  };

  useEffect(() => {
    if (!me) return; // TODO: handle not locked in error.
    if (me.role === USER_ROLES.SUPER_USER || me.role === USER_ROLES.MD_USER) {
      setisLocked(false); // if user is super user, then unlock
    } else {
      setisLocked(false); // if user is super user, then unlock
      // if user is executive, then lock department folders
      // if folder department is not same as my department, then it's locked
      if (folder.department === me.department) {
        if (me.role === USER_ROLES.EXECUTIVE_USER) {
          setisLocked(false);
        } else if (folder.type !== "User") {
          setisLocked(false);
        } else {
          setisLocked(false);
        }
      } else {
        setisLocked(true);
      }
    }
  }, [folder.department, folder.id, folder.type, me]);

  useEffect(() => {
    if (copyLinkBtnText === "Copy Link") return;
    setTimeout(() => {
      setCopyLinkBtnText("Copy Link");
    }, 1100);

    return () => { };
  }, [copyLinkBtnText]);

  if (isLocked) return <></>;

  return (
    <ContextMenu
      options={
        <ErrorBoundary>
          {disableEdit() && (
            <>
              <ContextMenuOption onClick={onOpen} disabled={isLocked}>
                <span data-uk-icon="icon: expand; ratio: .8"></span> Open
              </ContextMenuOption>
              {folder.type === "Other" && (
                <ErrorBoundary>
                  <ContextMenuOption onClick={onRename} disabled={isLocked}>
                    <span data-uk-icon="icon: pencil; ratio: .8"></span> Rename
                  </ContextMenuOption>
                  <ContextMenuOption onClick={onDelete}>
                    <span data-uk-icon="icon: trash; ratio: .8"></span> Delete
                  </ContextMenuOption>
                </ErrorBoundary>
              )}
              <ContextMenuOption
                onClick={onCopyLink}
                success={copyLinkBtnText === "Copied"}
                disabled={isLocked}
              >
                <span
                  data-uk-icon={`icon: ${copyLinkBtnText === "Copied" ? "check" : "link"
                    }; ratio: .8`}
                ></span>{" "}
                {copyLinkBtnText}
              </ContextMenuOption>
            </>
          )}
        </ErrorBoundary>
      }
    >
      <button className={className} onDoubleClick={onOpen} style={style}>
        <div className="folder__icon">
          {isLocked && (
            <span
              className="folder__icon--locked"
              data-uk-icon="icon: lock; ratio: .8"
            ></span>
          )}
          <img src={process.env.PUBLIC_URL + "/icons/folder_icon.svg"} alt="" />
        </div>
        <div className="folder__content">
          <div className="folder__content__name">{folder.name}</div>
        </div>
      </button>
    </ContextMenu>
  );
};
export default FolderItem;
