interface IProp {
  isActive: boolean;
  title: string;
  onClick: () => void;
}
const Tab = (props: IProp) => {
  const { isActive, title, onClick } = props;
  const activeClass = isActive ? "uk-active" : "";

  return (
    <li className={` ${activeClass}`} onClick={onClick}>
      <a href="void(0)">{title}</a>
    </li>
  );
};

interface IProps {
  tab: "Employee" | "Exco";
  setTab: React.Dispatch<React.SetStateAction<"Employee" | "Exco">>;
}
export const ReviewTabs = (props: IProps) => {
  const { tab, setTab } = props;

  const setExco = () => setTab("Exco");
  const setEmployee = () => setTab("Employee");

  return (
    <ul className="kit-tabs uk-margin" data-uk-tab>
      <Tab isActive={tab === "Exco"} title="EXCO Review" onClick={setExco} />
      <Tab
        isActive={tab === "Employee"}
        title="Employee Review"
        onClick={setEmployee}
      />
    </ul>
  );
};
