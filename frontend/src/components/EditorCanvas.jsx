import React, { forwardRef } from "react";
import ElementRenderer from "./ElementRenderer";
import { Mail } from "lucide-react";

const EditorCanvas = forwardRef(
  (
    {
      elements,
      setElements,
      activeView,
      selectedElementId,
      setSelectedElementId,
      addElement,
      deleteElement,
      duplicateElement,
      globalSettings,
      updateElement,
      handleImageUpload,
      handleDragStart,
      handleDragEnter,
      handleDragEnd,
    },
    ref
  ) => {
    const handleDrop = (e) => {
      e.preventDefault();

      // Use CANVAS rect for relative coordinates
      const canvasEl = ref?.current;
      const canvasRect = canvasEl?.getBoundingClientRect();
      if (!canvasRect) return;

      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;

      const type = e.dataTransfer.getData("type");
      const sectionDropType = e.dataTransfer.getData("sectionDropType");
      const simpleSection = e.dataTransfer.getData("simpleSection");

      const xOffset = 350;

      // Clamp helpers
      const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

      // Canvas size in px (fall back to settings if rect missing)
      const canvasW =
        canvasRect.width ||
        parseInt((globalSettings.maxWidth || "600").toString(), 10);
      const canvasH =
        canvasRect.height ||
        parseInt((globalSettings.minHeight || "800").toString(), 10);

      // Conservative defaults for new element size at creation time
      const defaultW = 300;
      const defaultH = 100;

      // Handle a single element drop
      if (type) {
        const rawLeft = x - xOffset;
        const rawTop = y;

        const clampedLeft = clamp(rawLeft, 0, canvasW - defaultW);
        const clampedTop = clamp(rawTop, 0, canvasH - defaultH);

        addElement(type, {
          left: `${clampedLeft}px`,
          top: `${clampedTop}px`,
        });
        return;
      }

      // Handle the drop of a new section
      if (sectionDropType) {
        const elementsToAdd = [];
        let yOffset = y; // Initialize the vertical offset
        const spacing = 120;

        switch (sectionDropType) {
          case "header-text":
            elementsToAdd.push(
              { type: "header", content: "Section Header" },
              {
                type: "text",
                content: "This is the text content for this section.",
              }
            );
            break;
          case "header-text-divider":
            elementsToAdd.push(
              { type: "header", content: "Section Header" },
              {
                type: "text",
                content: "This is the text content for this section.",
              },
              { type: "divider", content: "" }
            );
            break;
          case "header-text-button":
            elementsToAdd.push(
              { type: "header", content: "Call to Action" },
              {
                type: "text",
                content: "Here's some compelling text to encourage action.",
              },
              { type: "button", content: "Take Action", link: "#" }
            );
            break;
          case "image-text":
            elementsToAdd.push(
              { type: "image", content: "" },
              { type: "text", content: "Description text for the image above." }
            );
            break;
          case "image-header-text":
            elementsToAdd.push(
              { type: "image", content: "" },
              { type: "header", content: "Featured Content" },
              {
                type: "text",
                content: "Detailed description of the featured content above.",
              }
            );
            break;
          case "header-divider-text-image":
            elementsToAdd.push(
              { type: "header", content: "Header" },
              { type: "divider", content: "" },
              { type: "text", content: "Text content." },
              { type: "image", content: "" }
            );
            break;
          case "image-header-text-button":
            elementsToAdd.push(
              { type: "image", content: "" },
              { type: "header", content: "Featured Content" },
              {
                type: "text",
                content: "Detailed description of the featured content above.",
              },
              { type: "button", content: "Learn More", link: "#" }
            );
            break;
          case "header-text-image-button":
            elementsToAdd.push(
              { type: "header", content: "Header" },
              { type: "text", content: "Text content." },
              { type: "image", content: "" },
              { type: "button", content: "Button Text", link: "#" }
            );
            break;
          case "header-image-text-social":
            elementsToAdd.push(
              { type: "header", content: "Header" },
              { type: "image", content: "" },
              { type: "text", content: "Text content." },
              {
                type: "social",
                content: "",
                icons: [
                  { id: 1, platform: "facebook", url: "https://facebook.com" },
                  { id: 2, platform: "twitter", url: "https://twitter.com" },
                  {
                    id: 3,
                    platform: "instagram",
                    url: "https://instagram.com",
                  },
                ],
              }
            );
            break;
          case "image-header-divider-text":
            elementsToAdd.push(
              { type: "image", content: "" },
              { type: "header", content: "Header" },
              { type: "divider", content: "" },
              { type: "text", content: "Text content." }
            );
            break;
          case "header-text-divider-image-button":
            elementsToAdd.push(
              { type: "header", content: "Header" },
              { type: "text", content: "Text content." },
              { type: "divider", content: "" },
              { type: "image", content: "" },
              { type: "button", content: "Button Text", link: "#" }
            );
            break;
          case "header-text-social-button":
            elementsToAdd.push(
              { type: "header", content: "Header" },
              { type: "text", content: "Text content." },
              {
                type: "social",
                content: "",
                icons: [
                  { id: 1, platform: "facebook", url: "https://facebook.com" },
                  { id: 2, platform: "twitter", url: "https://twitter.com" },
                  {
                    id: 3,
                    platform: "instagram",
                    url: "https://instagram.com",
                  },
                ],
              },
              { type: "button", content: "Button Text", link: "#" }
            );
            break;
          case "image-image-header-text":
            elementsToAdd.push(
              { type: "image", content: "" },
              { type: "image", content: "" },
              { type: "header", content: "Header" },
              { type: "text", content: "Text content." }
            );
            break;
          case "header-divider-image-text-button-social":
            elementsToAdd.push(
              { type: "header", content: "Header" },
              { type: "divider", content: "" },
              { type: "image", content: "" },
              { type: "text", content: "Text content." },
              { type: "button", content: "Button Text", link: "#" },
              {
                type: "social",
                content: "",
                icons: [
                  { id: 1, platform: "facebook", url: "https://facebook.com" },
                  { id: 2, platform: "twitter", url: "https://twitter.com" },
                  {
                    id: 3,
                    platform: "instagram",
                    url: "https://instagram.com",
                  },
                ],
              }
            );
            break;
          case "header-text-image-image-divider-button":
            elementsToAdd.push(
              { type: "header", content: "Header" },
              { type: "text", content: "Text content." },
              { type: "image", content: "" },
              { type: "image", content: "" },
              { type: "divider", content: "" },
              { type: "button", content: "Button Text", link: "#" }
            );
            break;
          case "header-image-divider-text-social-button":
            elementsToAdd.push(
              { type: "header", content: "Header" },
              { type: "image", content: "" },
              { type: "divider", content: "" },
              { type: "text", content: "Text content." },
              {
                type: "social",
                content: "",
                icons: [
                  { id: 1, platform: "facebook", url: "https://facebook.com" },
                  {
                    id: 2,
                    platform: "twitter",
                    url: "https://twitter.com",
                  },
                  {
                    id: 3,
                    platform: "instagram",
                    url: "https://instagram.com",
                  },
                ],
              },
              { type: "button", content: "Button Text", link: "#" }
            );
            break;
          default:
            elementsToAdd.push({ type: "text", content: "Sample content." });
        }

        elementsToAdd.forEach((elementData) => {
          const rawLeft = x - xOffset;
          const rawTop = yOffset;

          const clampedLeft = clamp(rawLeft, 0, canvasW - defaultW);
          const clampedTop = clamp(rawTop, 0, canvasH - defaultH);

          const elementOptions = {
            left: `${clampedLeft}px`,
            top: `${clampedTop}px`,
          };

          if (elementData.icons) {
            elementOptions.icons = elementData.icons;
          }
          if (elementData.link) {
            elementOptions.link = elementData.link;
          }

          addElement(elementData.type, {
            ...elementOptions,
            content: elementData.content,
          });

          yOffset += spacing; // Increment the vertical position for the next element
        });
        return;
      }
    };

    return (
      <div
        className="flex-1 overflow-y-auto p-6 "
      style={{
    backgroundColor: globalSettings.backgroundColor || "#ffffff",
    backgroundImage:
      "radial-gradient(circle, rgba(255,0,200,0.4) 2px, transparent 1px), radial-gradient(circle, rgba(160,0,255,0.4) 1px, transparent 1px)",
    backgroundSize: "20px 20px, 25px 25px",
    backgroundPosition: "0 0, 9px 9px",

  //  // ✅ Only center the canvas in PREVIEW
  // display: activeView === "preview" ? "flex" : "block",
  // justifyContent: activeView === "preview" ? "center" : "flex-start",
  }}

        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        
      >
        <div
          ref={ref}
          className={`newsletter-canvas mx-auto ${
            activeView === "editor" ? "shadow-lg" : ""
          } 
          ${activeView === "preview" ? "export-preview" : ""}`} // ✅ add export-preview for preview only
          style={{
            maxWidth: globalSettings.maxWidth,
            minHeight: globalSettings.minHeight || "800px",
            backgroundColor: globalSettings.newsletterColor,
            padding: activeView === "preview" ? "0" : "20px",
           margin: activeView === "preview" ? "auto" : "auto",
        
            position: "relative",
            fontFamily: globalSettings.fontFamily || "Arial, sans-serif", // Apply global font
            overflow: "hidden", // ✅ prevent visual overflow outside canvas
          }}
          onClick={(e) => {
            if (
              activeView === "editor" &&
              (e.target.classList.contains("newsletter-canvas") ||
                e.target.classList.contains("shadow-lg"))
            ) {
              setSelectedElementId(null);
            }
          }}
        >
          {elements.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <p>
                Add elements from the sidebar to start building your newsletter
              </p>
              <p className="text-sm mt-2">
                Try dragging individual elements or pre-built sections
              </p>
            </div>
          ) : (
            <div className="elements-container">
              {elements.map((element, index) => (
                <div key={element.id} className="element-wrapper">
                  <ElementRenderer
                    element={{
                      ...element,
                      styles: {
                        ...element.styles,
                        // ✅ Apply element-specific font or fall back to global
                        fontFamily:
                          element.styles?.fontFamily ||
                          globalSettings.fontFamily ||
                          "Arial, sans-serif",
                      },
                    }}
                    updateElement={updateElement}
                    handleImageUpload={handleImageUpload}
                    selected={
                      activeView === "editor" &&
                      element.id === selectedElementId
                    }
                    activeView={activeView}
                    setSelectedElementId={setSelectedElementId}
                    globalSettings={globalSettings}
                    deleteElement={deleteElement}
                    duplicateElement={duplicateElement}
                    handleDragStart={handleDragStart}
                    handleDragEnter={handleDragEnter}
                    handleDragEnd={handleDragEnd}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    );
  }
);

EditorCanvas.displayName = "EditorCanvas";

export default EditorCanvas;
