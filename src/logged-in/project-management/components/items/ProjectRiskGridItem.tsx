import { IProjectRisk, IRiskSeverity, IRiskStatus } from "../../../../shared/models/ProjectRisks";
import { useAppContext } from "../../../../shared/functions/Context";

interface IGridProps {
    loading: boolean;
    risks: IProjectRisk[];
    color: string;
    onSelectedRisk: (risk: IProjectRisk) => void;
    handleUpdateRisk: (e: React.FormEvent<HTMLFormElement>) => void;
    selectedRisk: IProjectRisk;
    setSelectedRisk: React.Dispatch<React.SetStateAction<IProjectRisk>>;
    quickRiskUpdate: (risk: IProjectRisk) => void
    handleDeleteRisk: (risk: IProjectRisk) => void;

}

export const ProjectGridRiskItem = (props: IGridProps) => {

    const { store } = useAppContext();
    const me = store.auth.meJson;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, riskId: string) => {
        e.dataTransfer.setData('text/plain', riskId);
    }

    const { risks, loading, color, onSelectedRisk, handleUpdateRisk, selectedRisk,
        setSelectedRisk, quickRiskUpdate, handleDeleteRisk } = props;

    return (
        <div>
            {risks.map((risk, index) => (
                <div className="item" key={index} data-uk-tooltip="Drag and Drop, Double Click for more."
                    draggable onDragStart={(e) => handleDragStart(e, risk.id)}>
                    <div className="uk-inline card-actions">
                        <button
                            type="button"
                            className="edit-action-button"
                            data-uk-tooltip={"Edit"}
                            onClick={() => quickRiskUpdate(risk)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-edit"
                            >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <form data-uk-dropdown="mode: click" onSubmit={handleUpdateRisk}>
                            <div>
                                <div className="drop-input">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Risk name"
                                        value={selectedRisk.riskName}
                                        onChange={(e) => setSelectedRisk({ ...selectedRisk, riskName: e.target.value })}
                                    />
                                </div>
                                <div className="item-status">
                                    <label htmlFor="type">Status</label>
                                    <select
                                        id="type"
                                        className="uk-select"
                                        name="type"
                                        value={selectedRisk.status}
                                        onChange={(e) => setSelectedRisk({ ...selectedRisk, status: e.target.value as IRiskStatus })}
                                    >
                                        <option value={"potential"}>Potential</option>
                                        <option value={"identified"}>Identified</option>
                                        <option value={"resolved"}>Resolved</option>
                                    </select>
                                </div>
                                <div className="item-status">
                                    <label htmlFor="type">Severity/Impact</label>
                                    <select
                                        id="type"
                                        className="uk-select"
                                        name="type"
                                        value={selectedRisk.severity}
                                        onChange={(e) => setSelectedRisk({ ...selectedRisk, severity: e.target.value as IRiskSeverity })}
                                    >
                                        <option value={"low"}>Low</option>
                                        <option value={"medium"}>Medium</option>
                                        <option value={"high"}>High</option>
                                    </select>
                                </div>
                                <div className="drop-input">
                                    <div>
                                        <label className="uk-form-label" htmlFor="resolutionDate">
                                            Resolution Date
                                        </label>
                                        <input
                                            id="resolutionDate"
                                            className="uk-input"
                                            type="date"
                                            placeholder="Resolution date"
                                            value={selectedRisk.resolutionDate}
                                            onChange={(e) => setSelectedRisk({ ...selectedRisk, resolutionDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <hr className="uk-divider-large" />
                            <div>
                                {me && risk.usersId[0] === me.uid &&
                                    <div className="uk-flex uk-flex-between">
                                        <div>
                                            <button className="delete-project-button" onClick={() => handleDeleteRisk(risk)}>
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button className="save-project-button"
                                                type="submit">
                                                <span>Save</span>
                                            </button>
                                        </div>
                                    </div>
                                }
                                {loading && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "0",
                                            left: "0",
                                            width: "100%",
                                            height: "100%",
                                            display: "grid",
                                            placeItems: "center",
                                            backgroundColor: "#00000015",
                                        }}
                                    >
                                        <div data-uk-spinner="ratio: 2"></div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                    <div onDoubleClick={() => { onSelectedRisk(risk) }}>
                        <div className={`severity ${risk.severity}`}>
                            severity: {risk.severity}
                        </div>
                        <div className="item-top">
                            <span style={{ backgroundColor: color }}></span>
                            <span style={{ backgroundColor: color }}></span>
                        </div>
                        <div className="item-title">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-alert-triangle"
                            >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <span>{risk.riskName}</span>
                        </div>

                        <div className="desc" style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                            <div>
                                <span>
                                    <b>Description</b>
                                </span>
                                <p style={{ marginBlockStart: ".3rem" }}>
                                    {risk.description}
                                </p>
                            </div>
                            <div>
                                <span>
                                    <b>Business Objectives</b>
                                </span>
                                <p style={{ marginBlockStart: ".3rem" }}>
                                    {risk.objectives}
                                </p>
                            </div>
                            <div>
                                <span>
                                    <b>Log Date</b>
                                </span>
                                <p style={{ marginBlockStart: ".3rem" }}>{risk.logDate}</p>
                            </div>
                            {risk.resolutionDate ? (
                                <div>
                                    <span>
                                        <b>Resolution Date</b>
                                    </span>
                                    <p style={{ marginBlockStart: ".3rem" }}>
                                        {risk.resolutionDate}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                        <h6>{store.user.getItemById(risk.usersId[0])?.asJson.displayName}</h6>
                    </div>
                </div>
            ))}
        </div>
    );
};
