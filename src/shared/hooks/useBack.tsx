import { useState, useEffect } from "react";
import { useAppContext } from "../functions/Context";

const useBackButton = (_path?: string) => {
  const { ui } = useAppContext();
  const [path, setPath] = useState("");

  useEffect(() => {
    if (_path) setPath(_path);
  }, [_path]);

  useEffect(() => {
    if (path) ui.showBackButton(path);
    else ui.hideBackButton();

    return () => {
      ui.hideBackButton();
    };
  }, [path, ui]);

  const returnType: React.Dispatch<React.SetStateAction<string>> = setPath;
  return returnType;
};

export default useBackButton;
