import { useState, useEffect } from "react";
import { useAppContext } from "../functions/Context";

const useNetwork = () => {
  const { ui } = useAppContext();
  const [isOnline, setisOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setisOnline(true);
      ui.snackbar.load({
        id: Date.now(),
        message: "Online!",
        type: "success",
      });
    };
    const handleOffline = () => {
      setisOnline(false);
      ui.snackbar.load({
        id: Date.now(),
        message: "Offline! Check your internet connection.",
        type: "danger",
      });
    };

    window.addEventListener("online", handleOnline, true);
    window.addEventListener("offline", handleOffline, true);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [ui.snackbar]);

  return isOnline;
};

export default useNetwork;
