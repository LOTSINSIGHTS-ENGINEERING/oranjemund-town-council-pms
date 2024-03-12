import { useAppContext } from "../../functions/Context";

const VisionMission = () => {
  const { store } = useAppContext();
  return (
    <div className="header">
      {store.visionmission.all.map((vm) => (
        <div key={vm.asJson.id}>
          <h6 className="vision">Vision: {vm.asJson.vision}</h6>
          <h6 className="mission">Mission: {vm.asJson.mission}</h6>
        </div>
      ))}
    </div>
  );
};

export default VisionMission;
