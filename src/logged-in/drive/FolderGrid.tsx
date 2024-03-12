import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef, useState } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { useAppContext } from "../../shared/functions/Context";
import EmptyError from "../admin-settings/EmptyError";
import Folder from "../../shared/models/Folder";
import FolderFileItem from "./FolderFileItem";
import FolderItem from "./FolderItem";
import FolderPath from "./FolderPath";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import { useNavigate } from "react-router-dom";

interface IProps {
  parent: string;
  id: string;
}
const FolderGrid = observer((props: IProps) => {
  const { api, store } = useAppContext();
  const { parent} = props;
  const [loadingCurrent, setCurrentLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState(["root"]);
  const firstUpdate = useRef(true);
  const navigate = useNavigate();

  const role = store.auth.role;
  const department = store.auth.department;
  const me = store.auth.me;

  const currentFolder = store.folder.currentFolderJson;

  const folders = store.folder.all.filter(
    (folder) => folder.asJson.parentId === parent
  );

  const sortByPerspective = (a: Folder, b: Folder) => {
    const order = ["F", "C", "I", "L"];
    const aIndex = order.indexOf(a.asJson.name.charAt(0));
    const bIndex = order.indexOf(b.asJson.name.charAt(0));
    return aIndex - bIndex;
  };

  const sortByName = (a: Folder, b: Folder) => {
    return a.asJson.name.localeCompare(b.asJson.name);
  };

  // Sort folders by name, but sort perspective folder by F,C,I,L
  const sorted = useMemo(() => {
    if (currentFolder && currentFolder.type === "FY")
      return folders.sort(sortByPerspective);
    return folders.sort(sortByName);
  }, [currentFolder, folders]);

  const filterAccess = useMemo(() => {
    if (!me) return []; // TODO: Hanlde error, user not found.

    if (role === USER_ROLES.SUPER_USER || role === USER_ROLES.MD_USER) {
      return sorted;
    } else if (
      role === USER_ROLES.MANAGER_USER ||
      role === USER_ROLES.EMPLOYEE_USER ||
      role === USER_ROLES.ADMIN_USER
    ) {
      let _folders = sorted.filter((f) => {
        return f.asJson.department === department;
      });

      if (parent === "root") return _folders;

      if (currentFolder && currentFolder.type === "Root") {
        const subs = [
          ...me.subordinates.map((s) => s.asJson.uid),
          me.asJson.uid,
        ];

        _folders = _folders.filter((f) => subs.includes(f.asJson.id));
        return _folders;
      }

      return _folders;
    } else if (role === USER_ROLES.EXECUTIVE_USER) {
      return sorted.filter((f) => {
        return f.asJson.department === department;
      });
    } else {
      return [];
    }
  }, [currentFolder, department, me, parent, role, sorted]);

  useEffect(() => {
    const setFolderPath = () => {
      if (loadingCurrent) return;
      const currentFolder = store.folder.getById(parent);

      if (currentFolder) {
        const path = currentFolder.asJson.path || [];
        setPath([...path, parent]);
        store.folder.setCurrentFolder(currentFolder.asJson);
      } else {
        setPath(["root"]);
        store.folder.clearCurrentFolder();
        navigate("/c/drive");
      }
    };
    setFolderPath();

    // Clear current folder on unmoount
    return () => store.folder.clearCurrentFolder();
  }, [loadingCurrent, navigate, parent, store.folder]);

  useEffect(() => {
    // load current folder
    const loadCurrentFolder = async () => {
      if (parent === "root") return;

      setLoading(true); // start loading
      setCurrentLoading(true);
      await api.folder.getById(parent);
      setCurrentLoading(false);
    };

    loadCurrentFolder();
  }, [api.folder, parent]);

  useEffect(() => {
    // load folders from db
    const loadAllFolders = async () => {
      setLoading(true); // start loading

      try {
        store.folderFile.removeAll(); // remove all files everyting in store
        await api.folder.getAll(parent); // load all folders from db
        await api.folderFile.getAll(parent); // load the files to store
      } catch (error) {
        console.log(error);
      }
      setLoading(false); // stop loading
    };

    loadAllFolders();
  }, [api.folder, api.folderFile, parent, store.folderFile]);

  // Load subordinates users
  useEffect(() => {
    const load = async () => {
      if (!currentFolder || !me) {
        return;
      } else {
        if (currentFolder.type !== "Root" || !firstUpdate.current) return;
        // React renders multiple times, so get data once.
        firstUpdate.current = false;

        try {
          await api.user.getAllSubordinates(me.asJson.uid);
        } catch (error) {
          console.log("Error: ", error);
        }
      }
    };

    load();
  }, [api.user, currentFolder, me]);

  return (
    <ErrorBoundary>
      <div className="uk-card uk-card-default uk-card-body uk-card-small uk-margin">
        <div className="section section__folders section section__files">
          <ErrorBoundary>
            <FolderPath path={path} />
          </ErrorBoundary>
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
          <ErrorBoundary>
            <div className="section__layout">
              {!loading &&
                filterAccess.map((folder, index) => (
                  <ErrorBoundary key={folder.asJson.id}>
                    <FolderItem
                      index={index}
                      folder={folder.asJson}
                      path={path}
                    />
                  </ErrorBoundary>
                ))}

              {!loading &&
                store.folderFile.all.map((file, index) => (
                  <ErrorBoundary key={file.asJson.id}>
                    <FolderFileItem
                      index={index}
                      file={file.asJson}
                      path={path}
                    />
                  </ErrorBoundary>
                ))}
            </div>
          </ErrorBoundary>

          <ErrorBoundary>
            {!loading &&
              filterAccess.length === 0 &&
              store.folderFile.all.length === 0 && (
                <ErrorBoundary>
                  <EmptyError errorMessage="Empty! No files found" textOnly />
                </ErrorBoundary>
              )}
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default FolderGrid;
