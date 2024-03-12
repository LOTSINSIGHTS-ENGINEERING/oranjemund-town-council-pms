import { ViewMode } from "gantt-task-react";
import { FC, useState } from "react";
import "../styles/gantt.style.scss";
type ViewSwitcherProps = {
    isChecked: boolean;
    onViewListChange: (isChecked: boolean) => void;
    onViewModeChange: (viewMode: ViewMode) => void;
};

const GanttChartAction: FC<ViewSwitcherProps> = ({ isChecked, onViewModeChange, onViewListChange }) => {
    const [selectedView, setSelectedView] = useState(`${localStorage.getItem('selected-gantt-view') ?? "week"}`)

    const configureSettings = (value: string) => {
        setSelectedView(value);
        localStorage.setItem('selected-gantt-view', value)
    }


    return (
        <div className="gantt-actions">
            <div className="switcher">
                <div className="toggle-switch" uk-tooltip={isChecked ? "close side list" : "open side list"}>
                    <input
                        type="checkbox"
                        className="toggle-switch-checkbox"
                        // name={this.props.Name}
                        defaultValue={`${isChecked}`}
                        id="switcher"
                        onChange={() => { onViewListChange(!isChecked); localStorage.setItem("active-list", `${!isChecked}`); }}
                    />
                    <label className={`toggle-switch-label ${!!isChecked ? 'toggle-switch-label-active' : ''}`} htmlFor="switcher">
                        <span className="toggle-switch-inner" />
                        <span className="toggle-switch-switch" />
                    </label>
                </div>
            </div>

            <div className="gantt-actions-button">
                <button className={`gannt-button ${selectedView === "hour" ? "selected-view-option" : ""}`} onClick={() => { onViewModeChange(ViewMode.Hour); configureSettings("hour") }}>
                    Hour
                </button>
                <button className={`gannt-button ${selectedView === "qday" ? "selected-view-option" : ""}`} onClick={() => { onViewModeChange(ViewMode.QuarterDay); configureSettings("qday") }}>
                    4 Hours
                </button>
                <button className={`gannt-button ${selectedView === "hday" ? "selected-view-option" : ""}`} onClick={() => { onViewModeChange(ViewMode.HalfDay); configureSettings("hday") }}>
                    Half of Day
                </button>
                <button className={`gannt-button ${selectedView === "day" ? "selected-view-option" : ""}`} onClick={() => { onViewModeChange(ViewMode.Day); configureSettings("day") }}>
                    Day
                </button>
                <button className={`gannt-button ${selectedView === "week" ? "selected-view-option" : ""}`} onClick={() => { onViewModeChange(ViewMode.Week); configureSettings("week") }}>
                    Week
                </button>
                <button className={`gannt-button ${selectedView === "month" ? "selected-view-option" : ""}`} onClick={() => { onViewModeChange(ViewMode.Month); configureSettings("month") }}>
                    Month
                </button>
                <button className={`gannt-button ${selectedView === "year" ? "selected-view-option" : ""}`} onClick={() => { onViewModeChange(ViewMode.Year); configureSettings("year") }}>
                    Year
                </button>
            </div>

        </div>
    )
}

export default GanttChartAction;