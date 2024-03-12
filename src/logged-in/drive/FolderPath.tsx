import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { useAppContext } from "../../shared/functions/Context";

interface IBreadCrumbProps {
  folderid: string;
}
const BreadCrumb = (props: IBreadCrumbProps) => {
  const { api, store } = useAppContext();
  const { folderid } = props;
  const [loading, setLoading] = useState(false);
  const [folder, setFolder] = useState("");
  const navigate = useNavigate();

  const onView = (folder: string) => (e: any) => {
    if (folder === "root") navigate(`/c/drive`);
    else navigate(`/c/drive/${folder}`);
  };

  // get folder name from folder id
  const getFolderName = useCallback(async () => {
    if (loading) return;

    const currentFolder = store.folder.getById(folderid);
    if (currentFolder) setFolder(currentFolder.asJson.name);
    else setFolder(folderid);
  }, [loading, folderid, store.folder]);

  useEffect(() => {
    getFolderName();
  }, [getFolderName]);

  useEffect(() => {
    // load folder
    const load = async () => {
      try {
        setLoading(true);
        await api.folder.getById(folderid);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, [api.folder, folderid]);

  if (loading)
    <li className="path-li-item uk-inline">
      <LoadingEllipsis />
    </li>;

  return (
    <li className="path-li-item uk-inline">
      <button className="path-btn" onClick={onView(folderid)}>
        {folderid === "root" ? "Drive" : folder}
      </button>
    </li>
  );
};

interface IProps {
  path: string[];
}
const FolderPath = observer((props: IProps) => {
  const { path } = props;

  // useEffect(() => {
  //   console.log(path[2]);
  // });

  return (
    <ErrorBoundary>
      <ul className="section__folder-path">
        {path.map((folder) => (
          <ErrorBoundary key={folder}>
            <BreadCrumb folderid={folder} />
          </ErrorBoundary>
        ))}
      </ul>
    </ErrorBoundary>
  );
});
export default FolderPath;
