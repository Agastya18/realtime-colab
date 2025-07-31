import React , { useState } from "react";


const Setting: React.FC = ({canvas}) => {
  return (
    <div>
      <h2>Settings</h2>
      <label>
        Theme:
        <select>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
};
export default Setting;