import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";

interface INodeRow {
    perspective: string;
    children: JSX.Element[];
}

const NodeRow = (props: INodeRow) => {
    return (
        <ErrorBoundary>
            <tr className="map-row">
                <td className="perspective">
                    <h6>{props.perspective}</h6>
                </td>
                <td>
                    <ul className="objective-nodes">{props.children}</ul>
                </td>
            </tr>
        </ErrorBoundary>
    );
};

export default NodeRow;
