import { createContext, useContext } from "react";
import AppApi from "../apis/AppApi";
import AppStore from "../stores/AppStore";
import UiStore from "../stores/UiStore";

// Context to contain device width
export const DeviceWidthContext = createContext(0);

interface AppContextType {
  store: AppStore;
  api: AppApi;
  ui: UiStore;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContextType;
};

export const AppContext = createContext<null | AppContextType>(null);
