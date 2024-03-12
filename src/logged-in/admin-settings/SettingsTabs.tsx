import React from "react";

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
      <a href="void(0)">{name}</a>
    </li>
  );
};

interface IProps {
  selectedTab: string;
  setselectedTab: React.Dispatch<React.SetStateAction<string>>;
}
const SettingsTabs = (props: IProps) => {
  const { selectedTab, setselectedTab } = props;

  const activeTab = (tab: string) => {
    return tab === selectedTab ? "uk-active" : "";
  };

  const onClickTab = (tab: string) => {
    setselectedTab(tab);
  };

  return (
    <div className="settings-filters">
      <ul className="kit-tabs" data-uk-tab>
        <TabItem
          label="user-tab"
          name="Users"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="scorecard-tab"
          name="Scorecards"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="department-tab"
          name="Departments"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="business-unit-tab"
          name="Business Units"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="strategic-theme-tab"
          name="Strategic Themes"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="vm-tab"
          name="Vision & Mission"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="report-tab"
          name="Reporting To"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
      </ul>
    </div>
  );
};

export default SettingsTabs;
