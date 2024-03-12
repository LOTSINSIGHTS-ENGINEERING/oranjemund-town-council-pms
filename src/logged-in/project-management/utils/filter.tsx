import { FC } from "react";
import "../styles/filter.style.scss";

type List = {
    id: string;
    name: string;
}
type IFilterProps = {
    list: List[] | any;
    selectedValue: string;
    setSelectedValue: (value: string) => void;
}
const Filter: FC<IFilterProps> = ({ list, selectedValue, setSelectedValue }) => {

    const onSelectItem = (id: string) => {
        localStorage.setItem("filter-value", id);
        setSelectedValue(id);
    };

    const sortItem = (a: List, b: List) => {
        if (a.name.trim() > b.name.trim()) return 1
        else if (b.name.trim() > a.name.trim()) return -1
        else return 0
    }

    return (
        <div className="filter-items">
            {list.sort(sortItem).map((item: List, index: number) => (
                <div className={`item ${item.id === selectedValue ? "active" : ""}`}
                    key={index}
                    onClick={() => onSelectItem(item.id)}>
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
    )
}

export default Filter;