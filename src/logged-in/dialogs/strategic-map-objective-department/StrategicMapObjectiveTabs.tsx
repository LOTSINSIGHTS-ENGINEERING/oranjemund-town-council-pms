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

const StrategicMapObjectiveTabs = (props: IProps) => {
  const { selectedTab, setselectedTab } = props;

  const activeTab = (tab: string) => {
    return tab === selectedTab ? "uk-active" : "";
  };

  const onClickTab = (tab: string) => {
    setselectedTab(tab);
  };

  return (
    <div className="tabs">
      <ul className="kit-tabs" data-uk-tab>
        <TabItem
          label="overview-tab"
          name="Overview"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
        <TabItem
          label="audit-tab"
          name="Audit"
          activeTab={activeTab}
          onClickTab={onClickTab}
        />
      </ul>
    </div>
  );
};

export default StrategicMapObjectiveTabs;
