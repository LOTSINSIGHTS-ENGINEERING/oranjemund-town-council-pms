import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import { useAppContext } from "../../shared/functions/Context";

const Navbar = observer(() => {
  const { api, store, ui } = useAppContext();
  const navigate = useNavigate();

  const me = store.auth.meJson;
  const name = me ? me.displayName || " " : " ";
  const initials = name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const handleLogOut = () => {
    api.auth.logOut();
  };

  const navigateBack = () => {
    if (ui.backPath) navigate(ui.backPath);
    else navigate(-1);

    ui.hideBackButton();
  };

  return (
    <div
      className="sticky"
      data-uk-sticky="sel-target: .uk-navbar; cls-active: uk-navbar-sticky"
    >
      <nav className="navbar" data-uk-navbar>
        <div className="uk-navbar-left uk-hidden@s">
          <button
            className="uk-navbar-toggle"
            data-uk-navbar-toggle-icon
            data-uk-toggle="target: #navbar-drawer"
          ></button>
        </div>

        <div className="navbar-title navbar-left uk-navbar-left uk-margin-left">
          {ui.backButton && (
            <div className="icon">
              <span
                data-uk-icon="icon: arrow-left; ratio: 1.2"
                onClick={navigateBack}
              ></span>
            </div>
          )}
          <p>{ui.title}</p>
        </div>

        <div className="navbar-right uk-navbar-right">
          <ul className="uk-navbar-nav">
            <li className="avartar-li-item">
              <p className="avartar-username">
                <span className="name">{me?.displayName}</span>
                <br />
                <span className="job-title">{me?.jobTitle || "Unknown"}</span>
              </p>
              <button className="user-avartar">
                <p className="avartar-initials">{initials}</p>
              </button>
              <Dropdown>
                <li>
                  <button className="kit-dropdown-btn" onClick={handleLogOut}>
                    <span
                      className="uk-margin-small-right"
                      data-uk-icon="sign-out"
                    ></span>
                    Sign out
                  </button>
                </li>
              </Dropdown>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
});

export default Navbar;
