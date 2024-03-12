import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IProjectRisk } from "../../../shared/models/ProjectRisks";

import MODAL_NAMES from "../ModalName";
import './task.scss';
import { timeFormart } from "../../project-management/utils/common";
import moment from "moment";

export interface IViewRisk {
  riskId: string;
  projectId: string;
}

const ViewRiskModal: FC<IViewRisk> = observer(({ riskId }) => {
  const { store } = useAppContext();
  const risk: IProjectRisk | undefined = store.projectRisk.getItemById(riskId)?.asJson;

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.PROJECTS.VIEW_RISK);
  };

  if (!risk) return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-2-3">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <span>Risk Not Available</span>
    </div>
  )

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-2-3" data-uk-overflow-auto>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">{risk.riskName}</h3>
      <div className="dialog-content uk-position-relative modal-content">
        <div className="flex-item">
          <div className="decription">
            <h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-align-left">
                <line x1="17" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="17" y1="18" x2="3" y2="18"></line>
              </svg>
              &nbsp;
              Description
            </h5>
            <p>{risk.description}</p>
          </div>
          <div className="decription">
            <h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              &nbsp;
              Log Date
            </h5>
            <p>{moment(risk.logDate).calendar(null, timeFormart)}</p>
          </div>
          <div className="decription">
            <h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              &nbsp;
              Resolution Date
            </h5>
            <p> {risk.resolutionDate ? moment(risk.resolutionDate).calendar(null, timeFormart) : "Not Resolved"}</p>
          </div>
          <div className="members">
            <select
              defaultValue={risk.status}
              id="risk-status"
              className="uk-select"
              name="risk-status"
            >
              <option value={"potential"}>Potential</option>
              <option value={"identified"}>Identified</option>
              <option value={"resolved"}>Resolved</option>
            </select>
            <div className="item-status">
              <label htmlFor="risk-impoact">Severity/Impact</label>
              <select defaultValue={risk.severity}
                id="risk-impoact"
                className="uk-select" name="risk-impoact"
              >
                <option value={"low"}>Low</option>
                <option value={"medium"}>Medium</option>
                <option value={"high"}>High</option>
              </select>
            </div>
            <br />
          </div>
        </div>
      </div>
      <button
        className="btn-text uk-margin-right"
        type="button"
        onClick={onCancel}
      >
        Close
      </button>
    </div>
  );
});

export default ViewRiskModal;
