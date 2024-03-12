import { useEffect, useState } from "react";
import { useAppContext } from "../functions/Context";

export interface IUploader {
  file: File | null;
  onUpload: (path: string, file: File) => Promise<void>;
}

const useFileUploader = () => {
  const { api } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setPath] = useState<string>("/");

  const onUpload = async (path: string, file: File) => {
    setPath(path);
    setFile(file);
  };

  const uploader: IUploader = {
    file,
    onUpload,
  };

  useEffect(() => {
    if (!file) return;

    api.uploadManager.uploadFileToStorage(file, filePath);

    // clearing.
    setFile(null);
    setPath("/");

    // update when file changes & !not filePath
  }, [api.uploadManager, file, filePath]);

  return uploader;
};

export default useFileUploader;
