import {
  faAngleRight,
  faAnglesRight,
  faBriefcase,
  faBullseye,
  faCaretDown,
  faChartColumn,
  faChartPie,
  faChartSimple,
  faChessBoard,
  faCircleDot,
  faDatabase,
  faGears,
  faHomeAlt,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import { useAppContext } from "../../shared/functions/Context";

const Account = () => {
  return (
    <div className="account-settings uk-margin">
      <img src={`${process.env.PUBLIC_URL}/unicomms.png`} alt="" />
    </div>
  );
};
const DEV_MODE_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon
              icon={faHomeAlt}
              className="icon uk-margin-small-right"
            />
            Overview
            <span className="down-arrow" data-uk-icon="triangle-down"></span>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartPie}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                <FontAwesomeIcon
                  icon={faCircleDot}
                  className="icon uk-margin-small-right"
                />
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Strategy
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>

          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company-review"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company Reviews
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department-review"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments Reviews
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon
              icon={faBullseye}
              className="icon uk-margin-small-right"
            />
            Scorecards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Individual Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Employee Scorecard
              </NavLink>
            </li>
            {/* <li>
              <NavLink to={"scorecards/subordinate"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Subordinate Scorecard
              </NavLink>
            </li> */}
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Reviews
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"execution"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Execution
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Charts & Reports
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Other Tasks
              </NavLink>
            </li>
            <li>
              <NavLink to={"checkin"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Check In
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon
              icon={faDatabase}
              className="icon uk-margin-small-right"
            />
            Portfolio of evidence
          </NavLink>
        </li>
      
        {/* <li className="list-item uk-parent">
          <NavLink to="job-cards" className="navlink">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="icon uk-margin-small-right"
            />
            Job Cards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to="job-cards/dashboard" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="job-cards/create" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Create Job Card
              </NavLink>
            </li>
         
          </ul>
        </li> */}

        <li className="list-item uk-parent">
          <NavLink to={"reports"} className="navlink">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="icon uk-margin-small-right"
            />
            Charts and Reports
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"reports/kpis"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartColumn}
                  className="icon uk-margin-small-right"
                />
                Performance Reports
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"admin"} className="navlink">
            <FontAwesomeIcon
              icon={faShield}
              className="icon uk-margin-small-right"
            />
            Admin
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"admin/settings"} className="navlink">
                <FontAwesomeIcon
                  icon={faGears}
                  className="icon uk-margin-small-right"
                />
                Settings
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
const DIRECTOR_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon
              icon={faHomeAlt}
              className="icon uk-margin-small-right"
            />
            Overview
            <span className="down-arrow" data-uk-icon="triangle-down"></span>
          </NavLink>

          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartPie}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                <FontAwesomeIcon
                  icon={faCircleDot}
                  className="icon uk-margin-small-right"
                />
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        {/* <li className="list-item uk-parent">
          <NavLink to="job-cards" className="navlink">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="icon uk-margin-small-right"
            />
            Job Cards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to="job-cards/dashboard" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="job-cards/create" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Create Job Card
              </NavLink>
            </li>
          </ul>
        </li> */}
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Strategy
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>

          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company-review"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company Reviews
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
const MD_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon
              icon={faHomeAlt}
              className="icon uk-margin-small-right"
            />
            Overview
            <span className="down-arrow" data-uk-icon="triangle-down"></span>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartPie}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                <FontAwesomeIcon
                  icon={faCircleDot}
                  className="icon uk-margin-small-right"
                />
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to="job-cards" className="navlink">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="icon uk-margin-small-right"
            />
            Job Cards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to="job-cards/dashboard" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="job-cards/create" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Create Job Card
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Strategy
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>

          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department-review"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments Reviews
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon
              icon={faBullseye}
              className="icon uk-margin-small-right"
            />
            Scorecards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Reviews
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon
              icon={faDatabase}
              className="icon uk-margin-small-right"
            />
            Portfolio of evidence
          </NavLink>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"reports"} className="navlink">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="icon uk-margin-small-right"
            />
            Charts and Reports
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"reports/kpis"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartColumn}
                  className="icon uk-margin-small-right"
                />
                Performance Reports
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
const SUPER_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon
              icon={faHomeAlt}
              className="icon uk-margin-small-right"
            />
            Overview
            <span className="down-arrow" data-uk-icon="triangle-down"></span>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartPie}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                <FontAwesomeIcon
                  icon={faCircleDot}
                  className="icon uk-margin-small-right"
                />
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        {/* <li className="list-item uk-parent">
          <NavLink to="job-cards" className="navlink">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="icon uk-margin-small-right"
            />
            Job Cards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to="job-cards/dashboard" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="job-cards/create" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Create Job Card
              </NavLink>
            </li>
          </ul>
        </li> */}
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Strategy
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>

          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company-review"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company Reviews
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department-review"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments Reviews
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon
              icon={faBullseye}
              className="icon uk-margin-small-right"
            />
            Scorecards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Individual Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Employee Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Reviews
              </NavLink>
            </li>
          </ul>
        </li>

        {/* execution */}

        <li className="list-item uk-parent">
          <NavLink to={"execution"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Execution
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Charts & Reports
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Other Tasks
              </NavLink>
            </li>
            <li>
              <NavLink to={"checkin"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Check In
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon
              icon={faDatabase}
              className="icon uk-margin-small-right"
            />
            Portfolio of evidence
          </NavLink>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"reports"} className="navlink">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="icon uk-margin-small-right"
            />
            Charts and Reports
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"reports/kpis"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartColumn}
                  className="icon uk-margin-small-right"
                />
                Performance Reports
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"admin"} className="navlink">
            <FontAwesomeIcon
              icon={faShield}
              className="icon uk-margin-small-right"
            />
            Admin
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"admin/settings"} className="navlink">
                <FontAwesomeIcon
                  icon={faGears}
                  className="icon uk-margin-small-right"
                />
                Settings
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
const EXECUTIVE_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon
              icon={faHomeAlt}
              className="icon uk-margin-small-right"
            />
            Overview
            <span className="down-arrow" data-uk-icon="triangle-down"></span>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartPie}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                <FontAwesomeIcon
                  icon={faCircleDot}
                  className="icon uk-margin-small-right"
                />
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to="job-cards" className="navlink">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="icon uk-margin-small-right"
            />
            Job Cards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to="job-cards/dashboard" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="job-cards/create" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Create Job Card
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Strategy
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>

          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon
              icon={faBullseye}
              className="icon uk-margin-small-right"
            />
            Scorecards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Employee Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Reviews
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon
              icon={faDatabase}
              className="icon uk-margin-small-right"
            />
            Portfolio of evidence
          </NavLink>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"reports"} className="navlink">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="icon uk-margin-small-right"
            />
            Charts and Reports
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"reports/kpis"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartColumn}
                  className="icon uk-margin-small-right"
                />
                Performance Reports
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
const ADMIN_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon
              icon={faHomeAlt}
              className="icon uk-margin-small-right"
            />
            Overview
            <span className="down-arrow" data-uk-icon="triangle-down"></span>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartPie}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                <FontAwesomeIcon
                  icon={faCircleDot}
                  className="icon uk-margin-small-right"
                />
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        {/* <li className="list-item uk-parent">
          <NavLink to="job-cards" className="navlink">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="icon uk-margin-small-right"
            />
            Job Cards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to="job-cards/dashboard" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="job-cards/create" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Create Job Card
              </NavLink>
            </li>
          </ul>
        </li> */}
        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Strategy
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>

          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon
              icon={faBullseye}
              className="icon uk-margin-small-right"
            />
            Scorecards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Individual Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Employee Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Overview
              </NavLink>
            </li>
          </ul>
        </li>
        {/* execution */}
        {/* <li className="list-item uk-parent">
          <NavLink to={"execution"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Execution
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Charts & Reports
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Other Tasks
              </NavLink>
            </li>
            <li>
              <NavLink to={"checkin"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Check In
              </NavLink>
            </li>
          </ul>
        </li> */}

        <li className="list-item">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon
              icon={faDatabase}
              className="icon uk-margin-small-right"
            />
            Portfolio of evidence
          </NavLink>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"admin"} className="navlink">
            <FontAwesomeIcon
              icon={faShield}
              className="icon uk-margin-small-right"
            />
            Admin
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"admin/settings"} className="navlink">
                <FontAwesomeIcon
                  icon={faGears}
                  className="icon uk-margin-small-right"
                />
                Settings
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
const MANAGER_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon
              icon={faHomeAlt}
              className="icon uk-margin-small-right"
            />
            Overview
            <span className="down-arrow" data-uk-icon="triangle-down"></span>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartPie}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                <FontAwesomeIcon
                  icon={faCircleDot}
                  className="icon uk-margin-small-right"
                />
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Strategy
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>

          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments
              </NavLink>
            </li>
          </ul>
        </li>
        {/* <li className="list-item uk-parent">
          <NavLink to="job-cards" className="navlink">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="icon uk-margin-small-right"
            />
            Job Cards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to="job-cards/dashboard" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="job-cards/create" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Create Job Card
              </NavLink>
            </li>
          </ul>
        </li> */}

        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon
              icon={faBullseye}
              className="icon uk-margin-small-right"
            />
            Scorecards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Individual Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Employee Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Reviews
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon
              icon={faDatabase}
              className="icon uk-margin-small-right"
            />
            Portfolio of evidence
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
const SUPERVISOR_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon
              icon={faHomeAlt}
              className="icon uk-margin-small-right"
            />
            Overview
            <span className="down-arrow" data-uk-icon="triangle-down"></span>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartPie}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                <FontAwesomeIcon
                  icon={faCircleDot}
                  className="icon uk-margin-small-right"
                />
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
        {/* <li className="list-item uk-parent">
          <NavLink to="job-cards" className="navlink">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="icon uk-margin-small-right"
            />
            Job Cards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to="job-cards/dashboard" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="job-cards/create" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Create Job Card
              </NavLink>
            </li>
          </ul>
        </li> */}

        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Strategy
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>

          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon
              icon={faBullseye}
              className="icon uk-margin-small-right"
            />
            Scorecards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Individual Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Employee Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Reviews
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon
              icon={faDatabase}
              className="icon uk-margin-small-right"
            />
            Portfolio of evidence
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
const EMPLOYEE_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon
              icon={faHomeAlt}
              className="icon uk-margin-small-right"
            />
            Overview
            <span className="down-arrow" data-uk-icon="triangle-down"></span>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartPie}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                <FontAwesomeIcon
                  icon={faCircleDot}
                  className="icon uk-margin-small-right"
                />
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"strategy"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Strategy
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>

          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"strategy/themes"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/company-review"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Company Reviews
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments
              </NavLink>
            </li>
            <li>
              <NavLink to={"strategy/department-review"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Departments Reviews
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={"scorecards"} className="navlink">
            <FontAwesomeIcon
              icon={faBullseye}
              className="icon uk-margin-small-right"
            />
            Scorecards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"scorecards/my"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Individual Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/supervision"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Employee Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/subordinate"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Subordinate Scorecard
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/people"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={"scorecards/reviews"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Performance Reviews
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={"execution"} className="navlink">
            <FontAwesomeIcon
              icon={faChessBoard}
              className="icon uk-margin-small-right"
            />
            Execution
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"statistics"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Charts & Reports
              </NavLink>
            </li>
            <li>
              <NavLink to={"portfolio"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Portfolios
              </NavLink>
            </li>
            <li>
              <NavLink to={"projects"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={"tasks"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Other Tasks
              </NavLink>
            </li>
            <li>
              <NavLink to={"checkin"} className="navlink">
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="icon uk-margin-small-right"
                />
                Check In
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item">
          <NavLink to={"drive"} className="navlink">
            <FontAwesomeIcon
              icon={faDatabase}
              className="icon uk-margin-small-right"
            />
            Portfolio of evidence
          </NavLink>
        </li>

        {/* <li className="list-item uk-parent">
          <NavLink to="job-cards" className="navlink">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="icon uk-margin-small-right"
            />
            Job Cards
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to="job-cards/dashboard" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="job-cards/create" className="navlink">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="icon uk-margin-small-right"
                />
                Create Job Card
              </NavLink>
            </li>
         
          </ul>
        </li> */}

        <li className="list-item uk-parent">
          <NavLink to={"reports"} className="navlink">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="icon uk-margin-small-right"
            />
            Charts and Reports
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"reports/kpis"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartColumn}
                  className="icon uk-margin-small-right"
                />
                Performance Reports
              </NavLink>
            </li>
          </ul>
        </li>

        {/* <li className="list-item uk-parent">
          <NavLink to={"admin"} className="navlink">
            <FontAwesomeIcon
              icon={faShield}
              className="icon uk-margin-small-right"
            />
            Admin
            <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"admin/settings"} className="navlink">
                <FontAwesomeIcon
                  icon={faGears}
                  className="icon uk-margin-small-right"
                />
                Settings
              </NavLink>
            </li>
          </ul>
        </li> */}
      </ul>
    </div>
  );
};
const GUEST_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item uk-parent">
          <NavLink to={"home"} className="navlink">
            <FontAwesomeIcon
              icon={faHomeAlt}
              className="icon uk-margin-small-right"
            />
            Overview
            <span className="down-arrow" data-uk-icon="triangle-down"></span>
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={"home/dashboard"} className="navlink">
                <FontAwesomeIcon
                  icon={faChartPie}
                  className="icon uk-margin-small-right"
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"home/strategy-map"} className="navlink">
                <FontAwesomeIcon
                  icon={faCircleDot}
                  className="icon uk-margin-small-right"
                />
                Strategy Map
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
      {/* <li className="list-item uk-parent">
        <NavLink to="job-cards" className="navlink">
          <FontAwesomeIcon
            icon={faBriefcase}
            className="icon uk-margin-small-right"
          />
          Job Cards
          <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
        </NavLink>
        <ul className="uk-nav-sub">
          <li>
            <NavLink to="job-cards/dashboard" className="navlink">
              <FontAwesomeIcon
                icon={faAngleRight}
                className="icon uk-margin-small-right"
              />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="job-cards/create" className="navlink">
              <FontAwesomeIcon
                icon={faAngleRight}
                className="icon uk-margin-small-right"
              />
              Create Job Card
            </NavLink>
          </li>
        </ul>
      </li> */}
    </div>
  );
};

const DrawerList = observer(() => {
  const { store } = useAppContext();
  const role = store.auth.role;

  const DEV_MODE =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development";

  if (DEV_MODE) return <DEV_MODE_DRAWER />;

  switch (role) {
    case USER_ROLES.DIRECTOR_USER:
      return <DIRECTOR_USER_DRAWER />;

    case USER_ROLES.MD_USER:
      return <MD_USER_DRAWER />;

    case USER_ROLES.SUPER_USER:
      return <SUPER_USER_DRAWER />;

    case USER_ROLES.EXECUTIVE_USER:
      return <EXECUTIVE_USER_DRAWER />;

    case USER_ROLES.ADMIN_USER:
      return <ADMIN_USER_DRAWER />;

    case USER_ROLES.MANAGER_USER:
      return <MANAGER_USER_DRAWER />;

    case USER_ROLES.SUPERVISOR_USER:
      return <SUPERVISOR_USER_DRAWER />;

    case USER_ROLES.EMPLOYEE_USER:
      return <EMPLOYEE_USER_DRAWER />;

    default:
      return <GUEST_USER_DRAWER />;
  }
});

const DrawerContent = () => {
  return (
    <div className="drawer-content">
      <Account />
      <DrawerList />
    </div>
  );
};

const OverlayDrawer = () => {
  return (
    <div id="navbar-drawer" data-uk-offcanvas="overlay: true">
      <div className="uk-offcanvas-bar">
        <button
          className="uk-offcanvas-close"
          type="button"
          data-uk-close
        ></button>
        <DrawerContent />
      </div>
    </div>
  );
};

const FixedDrawer = () => {
  return (
    <div className="drawer fixed-drawer uk-visible@s">
      <DrawerContent />
    </div>
  );
};

const Drawer = () => {
  return (
    <ErrorBoundary>
      <OverlayDrawer />
      <FixedDrawer />
    </ErrorBoundary>
  );
};

export default Drawer;
