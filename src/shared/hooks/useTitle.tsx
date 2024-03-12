import React, { useEffect, useState } from "react";
import { useAppContext } from "../functions/Context";

const useTitle = (defaultTitle?: string) => {
  const { ui } = useAppContext();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (defaultTitle) setTitle(defaultTitle);
  }, [defaultTitle]);

  useEffect(() => {
    document.title = title;
    ui.setTitle(title);

    return () => {
      document.title = "";
      ui.setTitle("");
    };
  }, [title, ui]);

  const returnType: [string, React.Dispatch<React.SetStateAction<string>>] = [
    title,
    setTitle,
  ];
  return returnType;
};

export default useTitle;
