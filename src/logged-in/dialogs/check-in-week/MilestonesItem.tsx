import { ChangeEvent, Dispatch, Fragment, SetStateAction } from "react";
import { IMilestone } from "../../../shared/models/check-in-model/CheckInWeek";
import { observer } from "mobx-react-lite";
import { generateUID } from "../../shared/utils/utils";
import { runInAction } from "mobx";

interface IMileProps {
    index: number;
    milestoneName: string;
    onChange: (index: number) => (e: ChangeEvent<HTMLInputElement>) => void;
    onRemove: (index: number) => void;
}

export const MileItem = (props: IMileProps) => {

    const { index, milestoneName, onChange, onRemove } = props;

    return (

        <div className="uk-grid uk-margin-small" data-uk-grid>
            <div className="uk-width-expand@s">
                <input
                    className="uk-input uk-form-small"
                    type="text"
                    value={milestoneName}
                    name={"milestoneName"}
                    onChange={onChange(index)}
                />
            </div>
            <div className="uk-width-auto@s">
                <div className="uk-flex uk-flex-middle uk-flex-inline">
                    <div className="uk-margin-left">
                        <div className="icon">
                            <span data-uk-tooltip="Delete item"
                                onClick={() => onRemove(index)}
                                data-uk-icon="icon: trash;"
                            ></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface IItemProps {
    title: string
    miles: IMilestone[];
    setMiles: Dispatch<SetStateAction<IMilestone[]>>;
}

export const MilestonesItem = observer((props: IItemProps) => {
    const { miles, setMiles } = props;

    const onAddItem = () => {
        const newItem: IMilestone = {
            milestoneId: generateUID(),
            milestoneName: "",
            completed: false
        };
        const data = [...miles];
        data.push(newItem);
        setMiles(data);
    };

    const onMilestoneChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
        runInAction(() => {
            const data = [...miles];
            data[index].milestoneName = e.target.value;
            setMiles(data);
        });
    };

    const onMilestoneRemove = (index: number) => {
        const data = [...miles];
        data.splice(index, 1);
        setMiles(data);
    };

    return (
        <Fragment>
            <div className="uk-width-1-1">
                <label className="uk-form-label" htmlFor="weekly-achievement">
                    Achievements/ Milestones
                </label>
                {miles.map((item, index) => (
                    <Fragment key={index}>
                        <MileItem
                            index={index}
                            milestoneName={item.milestoneName}
                            onChange={onMilestoneChange}
                            onRemove={onMilestoneRemove}
                        />
                    </Fragment>
                ))}
                <button className="btn btn-primary uk-margin" type="button" onClick={onAddItem}>
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                    Milestone
                </button>
            </div>
        </Fragment>
    );
});
