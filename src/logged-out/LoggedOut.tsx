import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { useState, FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ErrorAlert } from "../shared/components/alert/Alert";
import ErrorBoundary from "../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../shared/components/loading/Loading";
import Modal from "../shared/components/Modal";
import { useAppContext } from "../shared/functions/Context";
import showModalFromId from "../shared/functions/ModalShow";
import { PASSWORD } from "./dialog/Dialogs";
import ForgotPasswordDialog from "./dialog/ForgotPasswordDialog";
import DisabledAccount from "./DisabledAccount";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const Loader = () => {
  return (
    <div style={style}>
      <LoadingEllipsis />
    </div>
  );
};

type ILocationState = {
  from: string;
};

const LoggedOut = observer(() => {
  const { api, store } = useAppContext();

  const location = useLocation();
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });

  const [loggingloading, setLogginLoading] = useState(false);
  const [userNotFoundError, setUserNotFoundError] = useState(false);

  const [passwordType, setPasswordType] = useState("password");

  const forgotPassword = () => {
    showModalFromId(PASSWORD.FORGOT_PASSWORD_DIALOG);
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const onSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLogginLoading(true);
    const { email, password = "" } = signInForm;
    const $user = await api.auth.signIn(email, password);

    if (!$user) {
      setUserNotFoundError(true);
      setLogginLoading(false);
      return;
    }
  };

  if (store.auth.loading) return <Loader />;

  if (store.auth.me && store.auth.me.asJson.disabled)
    return <DisabledAccount title={"Disabled"} />;

  if (!store.auth.loading && store.auth.me) {
    const state = location.state as ILocationState;

    if (state) return <Navigate to={state.from} />;
    return <Navigate to="/c/home/dashboard" />;
  }

  return (
    <ErrorBoundary>
      <div className="logged-out">
        <div className="login uk-card uk-card-body">
          {userNotFoundError && (
            <ErrorAlert
              msg="Username or password is incorrect"
              onClose={() => setUserNotFoundError(false)}
            />
          )}
          <h3 className="uk-card-title">
            <span>Unicomms</span> Performance Management System
          </h3>
          <form className="uk-form-stacked uk-width-1-1" onSubmit={onSignIn}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="user-login-email">
                Email
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  id="user-login-email"
                  type="email"
                  placeholder="Email"
                  value={signInForm.email}
                  onChange={(e) =>
                    setSignInForm({
                      ...signInForm,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin uk-width-1-1 uk-inline">
              <label className="uk-form-label" htmlFor="user-login-password">
                Password
              </label>
              <div className="uk-form-controls">
                <button
                  type="button"
                  className="icon-button uk-form-icon uk-form-icon-flip"
                  onClick={togglePassword}
                >
                  {passwordType === "password" ? (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="icon uk-margin-small-right"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faEye}
                      className="icon uk-margin-small-right"
                    />
                  )}
                </button>
                <input
                  className="uk-input"
                  id="user-login-password"
                  type={passwordType}
                  placeholder="Password"
                  value={signInForm.password}
                  onChange={(e) =>
                    setSignInForm({
                      ...signInForm,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <div className="controls">
                <div className="uk-flex uk-margin">
                  <div>
                    <button className="uk-button uk-margin-right" type="submit">
                      Login
                      {loggingloading && (
                        <div
                          className="uk-margin-small-left"
                          data-uk-spinner="ratio: 0.5"
                        />
                      )}
                    </button>
                  </div>
                  <div>
                    <button
                      className="uk-button uk-margin-right"
                      type="button"
                      onClick={forgotPassword}
                    >
                      Forgot password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Modal modalId={PASSWORD.FORGOT_PASSWORD_DIALOG}>
        <ForgotPasswordDialog />
      </Modal>
    </ErrorBoundary>
  );
});

export default LoggedOut;
