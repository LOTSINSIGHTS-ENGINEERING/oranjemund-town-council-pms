import { observer } from "mobx-react-lite";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "./Context";

const PrivateRoute = observer((props: any) => {
  const { children } = props;
  const { store } = useAppContext();
  const { pathname } = useLocation();

  const state = { from: pathname };

  return store.auth.me ? children : <Navigate to="/" state={state} />;
});

export default PrivateRoute;
