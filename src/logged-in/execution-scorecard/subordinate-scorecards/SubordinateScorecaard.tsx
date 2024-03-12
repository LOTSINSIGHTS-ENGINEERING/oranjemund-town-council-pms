import { useState } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import Tabs from "../../shared/components/tabs/Tabs";
import Toolbar from "../../shared/components/toolbar/Toolbar";
import { ALL_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import Dropdown from "../../../shared/components/dropdown/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faFileExcel, faFilePdf, faHistory } from "@fortawesome/free-solid-svg-icons";

export const SubordinateScorecard = () => {
  const [tab, setTab] = useState(ALL_TAB.id);
  return (
    <div className="scorecard-page uk-section uk-section-small">
      <div className="uk-container uk-container-xlarge">
        <ErrorBoundary>
          <Toolbar
            leftControls={
              <ErrorBoundary>
                <Tabs tab={tab} setTab={setTab} />
              </ErrorBoundary>
            }
            rightControls={
              <ErrorBoundary>
                <>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    // onClick={handleNewObjective}
                    title="Add a new objective to your scorecard"
                  >
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span> New
                    Objective
                  </button>
                </>

                <div className="uk-inline">
                  <button
                    className="btn btn-primary"
                    title="Submit your draft for aproval, View past scorecards, and Export to PDF."
                  >
                    More <span data-uk-icon="icon: more; ratio:.8"></span>
                  </button>

                  <Dropdown pos="bottom-right">
                    <li>
                      <ErrorBoundary>
                        {/* <MoreButton
                          agreement={agreement}
                          isEmptyObjectiveError={isEmptyObjectiveError}
                          isWeightError={totalWeight !== 100}
                        /> */}
                      </ErrorBoundary>
                    </li>
                    <li>
                      <button
                        className="kit-dropdown-btn"
                        // onClick={handleScorecards}
                        title="View the scorecards for the previous financial years."
                      >
                        <FontAwesomeIcon
                          icon={faHistory}
                          size="sm"
                          className="icon uk-margin-small-right"
                        />
                        View Past Scorecards
                      </button>
                    </li>
                    <li>
                      <button
                        className="kit-dropdown-btn"
                        // onClick={handleExportPDF}
                        title="Export your scorecard as PDF."
                      >
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          size="lg"
                          className="icon uk-margin-small-right"
                        />
                        Export PDF
                      </button>
                    </li>
                    <li>
                      <button
                        className="kit-dropdown-btn"
                        // onClick={handleExportExcel}
                        title="Export your scorecard as EXCEL."
                      >
                        <FontAwesomeIcon
                          icon={faFileExcel}
                          size="lg"
                          className="icon uk-margin-small-right"
                        />
                        Export Excel
                      </button>
                    </li>
                    <li>
                      <button
                        className="kit-dropdown-btn"
                        // onClick={handleFeedback}
                        title="Read Comments"
                      >
                        <FontAwesomeIcon
                          icon={faCommentDots}
                          size="lg"
                          className="icon uk-margin-small-right"
                        />
                        Feedback
                      </button>
                    </li>
                  </Dropdown>
                </div>
              </ErrorBoundary>
            }
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};
