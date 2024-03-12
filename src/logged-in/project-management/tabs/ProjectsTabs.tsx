import React, { FC } from "react";

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
const ProjectTabs: FC<IProps> = ({ selectedTab, setselectedTab }) => {

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
          label="all"
          name="All"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />

        <TabItem
          label="active"
          name="Active"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="on-hold"
          name="On-Hold"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="at-risk"
          name="At-Risk"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="completed"
          name="Completed"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
      </ul>
    </div>
  );
};

export default ProjectTabs;
