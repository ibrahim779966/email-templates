// src/components/SidebarLeft.jsx
import React from "react";
import { Type, Image, Link, Grid3X3, Users } from "lucide-react";
import TextPropertiesPanel from "./TextPropertiesPanel";
import ImagePropertiesPanel from "./ImagePropertiesPanel";
import ButtonPropertiesPanel from "./ButtonPropertiesPanel";
import DividerPropertiesPanel from "./DividerPropertiesPanel";
import SocialPropertiesPanel from "./SocialPropertiesPanel";

export default function SidebarLeft({
  addElement,
  selectedElement,
  updateElementStyle,
  deleteElement, // This prop is correctly received here
  handleImageUpload,
}) {
  const elementTypes = [
    { type: "text", icon: Type, label: "Text" },
    { type: "header", icon: Type, label: "Header" },
    { type: "image", icon: Image, label: "Image" },
    { type: "button", icon: Link, label: "Button" },
    { type: "divider", icon: Grid3X3, label: "Divider" },
    { type: "social", icon: Users, label: "Social Links" },
  ];

  return (
    <div className="w-80 bg-white border-r p-4 flex flex-col">
      <h3 className="font-semibold mb-4">Add Elements</h3>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {elementTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => addElement(type)}
            className="p-3 border rounded-md hover:bg-gray-50 flex flex-col items-center"
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {selectedElement && (selectedElement.type === "text" || selectedElement.type === "header") && (
        <TextPropertiesPanel
          element={selectedElement}
          updateElementStyle={updateElementStyle}
          deleteElement={deleteElement} // Correctly pass the prop here
          handleImageUpload={handleImageUpload} //  And passed down here
          updateElement={updateElementStyle} // Assuming updateElementStyle is the same as updateElement
        />
      )}

      {selectedElement && selectedElement.type === "image" && (
        <ImagePropertiesPanel
          element={selectedElement}
          updateElementStyle={updateElementStyle}
          deleteElement={deleteElement} // Add the prop here
          handleImageUpload={handleImageUpload} // <-- ADD THIS LINE
        />
      )}

      {selectedElement && selectedElement.type === "button" && (
        <ButtonPropertiesPanel
          element={selectedElement}
          updateElementStyle={updateElementStyle}
          deleteElement={deleteElement} // Add the prop here
        />
      )}

      {selectedElement && selectedElement.type === "divider" && (
        <DividerPropertiesPanel
          element={selectedElement}
          updateElementStyle={updateElementStyle}
          deleteElement={deleteElement} // Add the prop here
        />
      )}

      {selectedElement && selectedElement.type === "social" && (
        <SocialPropertiesPanel
          element={selectedElement}
          updateElementStyle={updateElementStyle}
          deleteElement={deleteElement} // Add the prop here
        />
      )}
    </div>
  );
}