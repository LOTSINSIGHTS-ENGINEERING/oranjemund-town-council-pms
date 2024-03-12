// MultiStepForm.tsx
import React, { useState } from "react";
import Stepper from "./Stepper";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = 3; // Assuming you have 3 steps

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const steps = [
    {
      label: "Create",
      component: <Step1 handleNext={handleNext} />,
    },
    {
      label: "Allocate",
      component: <Step2 handleNext={handleNext} />,
    },
    // {
    //   label: "Step 3",
    //   component: <Step3 />,
    // },
  ];

  return (
    <div>
      <Stepper steps={steps} currentStep={currentStep} />
      {steps[currentStep].component}
    </div>
  );
};

export default MultiStepForm;
