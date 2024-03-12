// Stepper.js
import React from "react";

const Stepper = ({ steps, currentStep }) => {
  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      {steps.map((step, index) => (
        <div key={index} style={{ display: "inline-block", margin: "0 10px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: index <= currentStep ? "green" : "gray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}>
            {index + 1}
          </div>
          <div
            style={{
              marginTop: "5px",
              color: index <= currentStep ? "green" : "gray",
            }}>
            {step.label}
          </div>
          {index < steps.length - 1 && (
            <div
              style={{
                border: `2px solid ${index <= currentStep ? "green" : "gray"}`,
                height: "2px",
                width: "20px",
                margin: "0 auto",
                marginTop: "5px",
              }}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
