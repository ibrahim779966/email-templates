// components/SidebarRight.jsx
import React from "react";

export default function SidebarRight({ globalSettings, setGlobalSettings, elements }) {
  return (
    <div className="w-80 bg-white border-l p-4">
      <h3 className="font-semibold mb-4">Global Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Background Color</label>
          <input
            type="color"
            value={globalSettings.backgroundColor}
            onChange={(e) => setGlobalSettings({ ...globalSettings, backgroundColor: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Max Width</label>
          <select
            value={globalSettings.maxWidth}
            onChange={(e) => setGlobalSettings({ ...globalSettings, maxWidth: e.target.value })}
            className="w-full border px-2 py-1"
          >
            <option value="500px">500px</option>
            <option value="600px">600px</option>
            <option value="700px">700px</option>
          </select>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold mb-2">Stats</h4>
        <p>Total Elements: {elements.length}</p>
      </div>
    </div>
  );
}
