// StepStage.tsx
import React from "react";

interface IStepStageProps {
  index: number;
  title: string;
  isActive: boolean;
  //  onClick: () => void;
}

const StepStage: React.FC<IStepStageProps> = ({
  index,
  title,
  isActive,
  //  onClick,
}) => {
  const className = `step--stage ${isActive ? "active" : ""}`;

  return (
    <button className={className} 
    // onClick={onClick}
    >
      <div className="step--stage__bubble">
        <div className="step--stage__bubble__content">
          {isActive && (
            <span className="icon" style={{ fontSize: "1.2rem" }}>
              ◔
            </span>
          )}
        </div>
      </div>
      <div className="step--stage__content">
        <p className="label">STEP {index}</p>
        <h6 className="title">{title}</h6>
      </div>
    </button>
  );
};

export default StepStage;
