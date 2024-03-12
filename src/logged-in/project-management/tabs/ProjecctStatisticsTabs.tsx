import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useAppContext } from "../../../shared/functions/Context";

interface ITabItem {
  label: string;
  name: string;
  activeTab: (tab: string) => "" | "uk-active";
  onClickTab: (tab: string) => void;
}
const TabItem = (props: ITabItem) => {
  const { label, name, activeTab, onClickTab } = props;

  return (
    <li className={activeTab(label)} onClick={() => onClickTab(label)}>
      <a href="#">{name}</a>
    </li>
  );
};

interface IProps {
  selectedTab: string;
  setselectedTab: React.Dispatch<React.SetStateAction<string>>;
}
const ProjectStatisticsTabs: FC<IProps> = observer(({ selectedTab, setselectedTab }) => {

  const { store } = useAppContext();

  const activeTab = (tab: string) => {
    return tab === selectedTab ? "uk-active" : "";
  };

  const onClickTab = (tab: string) => {
    localStorage.setItem("project-s-selected-tab", tab);
    setselectedTab(tab);
  };

  return (
    <div className="settings-filters">
      <ul className="kit-tabs" data-uk-tab>
        <TabItem
          label="company-tab"
          name="Company"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="department-tab"
          name="Department"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="individual-tab"
          name="Individual"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="project-tab"
          name="Projects"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
      </ul>
    </div>
  );
});

export default ProjectStatisticsTabs;
