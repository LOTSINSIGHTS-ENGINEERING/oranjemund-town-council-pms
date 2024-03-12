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
      <a href="#">{name}</a>
    </li>
  );
};

interface IProps {
  selectedTab: string;
  setselectedTab: React.Dispatch<React.SetStateAction<string>>;
}
const ReportProjectTabs = (props: IProps) => {
  const { selectedTab, setselectedTab } = props;

  const activeTab = (tab: string) => {
    return tab === selectedTab ? "uk-active" : "";
  };

  const onClickTab = (tab: string) => {
    setselectedTab(tab);
  };

  return (
    <div className="projects-filters">
      <ul className="kit-tabs" data-uk-tab>
        {/* <TabItem
          label="all-tab"
          name="All"
          activeTab={activeTab}
          onClickTab={onClickTab}
        /> */}
        <TabItem
          label="scorecard-tab"
          name="Company"
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
          label="owners-tab"
          name="Owners"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="red-tab"
          name="Red Projects"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
      </ul>
    </div>
  );
};

export default ReportProjectTabs;
