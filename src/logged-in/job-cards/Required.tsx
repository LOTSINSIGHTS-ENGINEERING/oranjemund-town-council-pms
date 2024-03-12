import React from "react";

const IsRequiredInput = ({ id, type, placeholder, value, onChange }) => {
  const inputStyle = {
    border: "1px solid #d9534f", // Red border color
    // Add other styles as needed
  };

  const requiredStyle = {
    color: "#d9534f", // Red text color
    marginLeft: "4px", // Adjust the spacing between text and asterisk
    // Add other styles as needed
  };

  return (
    <div className="uk-form-controls">
      <label htmlFor={id} className="uk-form-label">
        {placeholder}
        <span style={requiredStyle}>*</span>
      </label>
      {type === "textarea" ? (
        <textarea
        //   style={inputStyle}
          className="uk-textarea uk-form-small custom-required"
          rows={5}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      ) : (
        <input
        //   style={inputStyle}
          className="uk-input uk-form-small custom-required"
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      )}
    </div>
  );
};

export default IsRequiredInput;
