// components/ElementSettings.jsx
import React from "react";

export default function ElementSettings({ element, updateElement, updateElementStyle, handleImageUpload }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
      {element.type === "image" ? (
        <div className="space-y-3">
          <input
            type="url"
            value={element.content.startsWith("data:") ? "" : element.content}
            onChange={(e) => updateElement(element.id, { content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Image URL"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && handleImageUpload(element.id, e.target.files[0])}
          />
        </div>
      ) : (
        <textarea
          value={element.content}
          onChange={(e) => updateElement(element.id, { content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
        />
      )}
    </div>
  );
}
