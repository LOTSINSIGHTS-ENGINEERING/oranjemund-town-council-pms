import { observer } from "mobx-react-lite";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { IPortfolio } from "../../../shared/models/Portfolio";
import { IProject } from "../../../shared/models/ProjectManagement";

import PortfolioSetting from "./portfolioSettings";
import { useNavigate } from "react-router-dom";
import icons from "../../shared/utils/icons";


const PortfolioItem: FC<IPortfolio> = observer((portfolio) => {
    const { store, api } = useAppContext();
    const [projectCount, setProjectCount] = useState(0);
    const projects = store.projectManagement.all.map(p => p.asJson);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!!projects.length) {
            const count = projects.filter((project: IProject) => {
                return portfolio.id === project.portfolioId
            }).length;
            setProjectCount(count);
        }
    }, [portfolio, projectCount, projects]);

    const handleDeletePortfolio = async () => {
        if (!window.confirm("Are you sure you want to delete?")) return;
        try {
            setLoading(true);
            await api.projectManagement.deletePortfolio(portfolio);
            setLoading(false);
        } catch (error) {

        }
    }

    const handleUpdatePortfolio = async (value: ChangeEvent<HTMLInputElement>) => {
        if (value.target.name !== portfolio.portfolioName && !!value)
            await api.projectManagement.updatePortfolio(portfolio);
    }

    return (
        <div className="portfolio">
            <div className="p-profile">
                <div className="p-item-1" style={{ backgroundColor: portfolio.colors[0], color: portfolio.textColor ?? "black" }}>
                    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }} onClick={() => navigate(`/c/projects/${portfolio.id}`)}>
                        {(!!portfolio.icon) ? <img src={icons.clipboard} alt="portfolio icon" width="50" height="50" data-uk-svg /> : <span style={{ textTransform: "capitalize", fontSize: "50px", fontWeight: "700" }}>{portfolio.portfolioName.slice(0, 2)}</span>}
                    </div>
                    <button className="p-edit-icon" data-uk-tooltip="More" style={{ backgroundColor: portfolio.textColor === "white" ? "#000000d3" : "#ffffff98" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>
                    <PortfolioSetting colors={portfolio.colors} icon={portfolio.icon} portfolioName={portfolio.portfolioName} handleDeletePortfolio={handleDeletePortfolio} loading={loading} handleUpdatePortfolio={handleUpdatePortfolio} />
                </div>
                <div className="p-item-2" style={{ backgroundColor: portfolio.colors[1] }}></div>
                <div className="p-item-3" style={{ backgroundColor: portfolio.colors[2] }}></div>
            </div>
            <div className="p-title">
                <h4 uk-tooltip={portfolio.portfolioName} style={{ textTransform: "capitalize" }}>{portfolio.portfolioName}</h4>
                <span>{projectCount} {projectCount < 2 ? "Project" : "Projects"}</span>
            </div>
        </div>
    )
});

export default PortfolioItem;