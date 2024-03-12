import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import { colours } from "../data/colors";

interface IProps {
    portfolioName: string;
    colors: any[];
    icon: string;
    loading: any;
    handleDeletePortfolio: any;
    handleUpdatePortfolio: any;
}
const PortfolioSetting: FC<IProps> = observer(({ colors, portfolioName, handleDeletePortfolio, loading, handleUpdatePortfolio }) => {

    const [colorChoice, setColorChoice] = useState("");
    const [_portfolioName, setPortfolioName] = useState("");

    useEffect(() => {
        colours.forEach(color => {
            if (JSON.stringify(color.colors) === JSON.stringify(colors)) {
                setColorChoice(color.name);
            }
        })
    }, [colors]);

    return (
        <div className="" style={{ backgroundColor: "white", width: "18rem", zIndex: "1000", borderRadius: "6px" }} uk-dropdown="mode: click">
            <div>
                <div className="drop-input">
                    <input type="text" name="name" id="name" placeholder="Portfolio Name"
                        defaultValue={portfolioName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPortfolioName(e.target.value)} />
                    <button className="update-name" onClick={() => { handleUpdatePortfolio({ name: _portfolioName }) }}>
                        <span data-uk-icon="icon:check; ratio: .7"></span>
                    </button>
                </div>
                <h5><b>Colors</b></h5>

                <div className="colors">
                    {
                        colours.map((color: any, key) => (
                            <div className="color-palette ripple-surface" key={`${key}imwyyef7kw9875${color}`} onClick={(e) => { setColorChoice(color.name); handleUpdatePortfolio({ colors: color.colors, textColor: color.textColor }); }}>
                                {colorChoice === color.name ? (<div className="check"><span uk-icon="icon:check; ratio: .7"></span></div>) : null}
                                <div className="palette-1" style={{ backgroundColor: color.colors[0] }}></div>
                                <div className="palette-2" style={{ backgroundColor: color.colors[1] }}></div>
                                <div className="palette-3" style={{ backgroundColor: color.colors[2] }}></div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <hr className="uk-divider-icon" />
            <div>
                <div className="portfolio-actions" onClick={handleDeletePortfolio}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>Delete Portfolio</span>
                </div>
                {loading && <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", display: "grid", placeItems: "center", backgroundColor: "#00000015" }}><div data-uk-spinner="ratio: 2"></div></div>}
            </div>
        </div>
    )
});

export default PortfolioSetting;