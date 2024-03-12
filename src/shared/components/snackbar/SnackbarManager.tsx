import { observer } from "mobx-react-lite";
import { useAppContext } from "../../functions/Context";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import Snackbar from "./Snackbar";

const SnackbarManager = observer(() => {
  const { ui } = useAppContext();

  const onClose = (id: number) => {
    ui.snackbar.remove(id);
  };

  return (
    <div>
      <ErrorBoundary>
        {ui.snackbar.snackbars &&
          ui.snackbar.snackbars.map((snackbar, index) => (
            <Snackbar
              key={index}
              index={index}
              onClose={onClose}
              {...snackbar.asJson}
            />
          ))}
      </ErrorBoundary>
    </div>
  );
});

export default SnackbarManager;
