import React from "react";

const Step3 = ({ formData, setFormData }) => {
  // Step 3 does not have a "Next" button since it's the last step

  return (
    <div>
      <label>Email</label>
      <input
        type="text"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {/* Add other Step 3 form fields */}
    </div>
  );
};

export default Step3;
