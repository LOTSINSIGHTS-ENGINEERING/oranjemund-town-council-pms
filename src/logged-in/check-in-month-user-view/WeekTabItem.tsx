import { IUser } from "../../shared/models/User";
import { ICheckInWeek } from "../../shared/models/check-in-model/CheckInWeek";
import icons from "../shared/utils/icons";

interface ITabItem {
  label: string;
  name: string;
  activeTab: (tab: string) => "" | "uk-active";
  onClickTab: (tab: string) => void;
  onEdit: (week: ICheckInWeek) => void;
  onDeleteWeek: () => Promise<void>;
  week: ICheckInWeek;
  me: IUser;
}

export const WeekTabItem = (props: ITabItem) => {
  const { label, name, week, me, activeTab, onClickTab, onEdit, onDeleteWeek } = props;

  return (
    <li className={activeTab(label)} onClick={() => onClickTab(label)}>
      <a href="void(0);">
        {name}
        {activeTab(label) === "uk-active" && week.uid === me.uid && (
          <>
            <button onClick={() => onEdit(week)} type="button" className="edit-icon" data-uk-tooltip="Edit">
              <img src={icons.circularpen} alt="Edit" width="15" height="15" data-uk-svg />
            </button>
            <button onClick={onDeleteWeek} type="button" className="delete-icon" data-uk-tooltip="Delete">
              <img src={icons.deleteicon} alt="Delete" width="15" height="15" data-uk-svg />
            </button>
          </>

        )}
        {/* {activeTab(label) === "uk-active" && (
          <button onClick={onDeleteWeek} type="button" className="delete-icon" data-uk-tooltip="Delete">
            <img src={icons.deleteicon} alt="Delete" width="15" height="15" data-uk-svg />
          </button>
        )} */}
      </a>
    </li>
  );
};