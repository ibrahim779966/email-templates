// EditorCanvas_Complete.jsx - FULLY UPDATED with Dynamic Resize Handles

import React, { forwardRef, useState, useCallback } from "react";
import ElementRenderer from "./ElementRenderer";
import { Mail, Plus } from "lucide-react";

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
    },
    ref
  ) => {
    const [dragOverElementId, setDragOverElementId] = useState(null);

    const CONTAINER_TYPES = ["section", "grid", "item", "column"];

    const canHaveChildren = (elementType) => {
      return CONTAINER_TYPES.includes(elementType);
    };

    const findElementById = (elements, targetId, parent = null, index = -1) => {
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.id === targetId) {
          return { element: el, parent, index: i };
        }
        if (el.children && el.children.length > 0) {
          const found = findElementById(el.children, targetId, el, i);
          if (found) return found;
        }
      }
      return null;
    };

    const updateNestedElement = (elements, targetId, updates) => {
      return elements.map((el) => {
        if (el.id === targetId) {
          return { ...el, ...updates };
        }
        if (el.children && el.children.length > 0) {
          return {
            ...el,
            children: updateNestedElement(el.children, targetId, updates),
          };
        }
        return el;
      });
    };

    // ✅ CRITICAL: Update element and trigger wrapper re-render
    const handleUpdateElement = useCallback(
      (elementId, updates) => {
        const updated = updateNestedElement(elements, elementId, updates);
        setElements(updated);
      },
      [elements]
    );

    const moveElementUp = (id, parentElement = null) => {
      const newElements = [...elements];

      if (parentElement) {
        const updated = updateNestedElement(newElements, parentElement.id, {
          children: (() => {
            const children = [...(parentElement.children || [])];
            const index = children.findIndex((el) => el.id === id);
            if (index > 0) {
              [children[index - 1], children[index]] = [
                children[index],
                children[index - 1],
              ];
            }
            return children;
          })(),
        });
        setElements(updated);
      } else {
        const index = newElements.findIndex((el) => el.id === id);
        if (index > 0) {
          [newElements[index - 1], newElements[index]] = [
            newElements[index],
            newElements[index - 1],
          ];
          setElements(newElements);
        }
      }
    };

    const moveElementDown = (id, parentElement = null) => {
      const newElements = [...elements];

      if (parentElement) {
        const updated = updateNestedElement(newElements, parentElement.id, {
          children: (() => {
            const children = [...(parentElement.children || [])];
            const index = children.findIndex((el) => el.id === id);
            if (index < children.length - 1) {
              [children[index], children[index + 1]] = [
                children[index + 1],
                children[index],
              ];
            }
            return children;
          })(),
        });
        setElements(updated);
      } else {
        const index = newElements.findIndex((el) => el.id === id);
        if (index < newElements.length - 1) {
          [newElements[index], newElements[index + 1]] = [
            newElements[index + 1],
            newElements[index],
          ];
          setElements(newElements);
        }
      }
    };

    const addElementToContainer = (
      containerId,
      elementType,
      elementData = {}
    ) => {
      const newElement = {
        id: Date.now() + Math.random(),
        type: elementType,
        content: elementData.content || getDefaultContent(elementType),
        styles: getDefaultStyles(elementType),
        children: canHaveChildren(elementType) ? [] : undefined,
        ...elementData,
      };

      const newElements = updateNestedElement(elements, containerId, {
        children: (() => {
          const result = findElementById(elements, containerId);
          const container = result?.element;
          return [...(container?.children || []), newElement];
        })(),
      });
      setElements(newElements);
    };

    const getDefaultContent = (type) => {
      switch (type) {
        case "header":
          return "Header";
        case "text":
          return "Enter your text here...";
        case "button":
          return "Click Me";
        case "divider":
          return "";
        case "image":
          return "";
        case "section":
          return "Section";
        case "grid":
          return "Grid";
        case "item":
          return "Item";

        case "shape":
          return "";
        case "social":
          return "";
        default:
          return "";
      }
    };

    const getDefaultStyles = (type) => {
      const baseStyles = {
        width: "100%",
        margin: "0",
        padding: "0",
      };

      switch (type) {
        case "section":
          return {
            ...baseStyles,
            width: "100%",
            backgroundColor: "#f3f4f6",
            borderWidth: "1px",
            borderColor: "#e5e7eb",
            borderStyle: "solid",
            borderRadius: "8px",
            paddingTop: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
            paddingLeft: "20px",
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "20px",
            marginLeft: "0px",
            boxShadow: "none",
            opacity: "1",
          };

        case "grid":
          return {
            ...baseStyles,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            backgroundColor: "#e0f2fe",
            borderWidth: "1px",
            borderColor: "#0ea5e9",
            borderStyle: "none",
            borderRadius: "0px",
            paddingTop: "16px",
            paddingRight: "16px",
            paddingBottom: "16px",
            paddingLeft: "16px",
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "16px",
            marginLeft: "0px",
            boxShadow: "none",
            opacity: "1",
          };

        case "item":
          return {
            ...baseStyles,
            width: "100%",
            backgroundColor: "#fef3c7",
            borderWidth: "1px",
            borderColor: "#f59e0b",
            borderStyle: "dashed",
            borderRadius: "4px",
            paddingTop: "12px",
            paddingRight: "12px",
            paddingBottom: "12px",
            paddingLeft: "12px",
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "0px",
            marginLeft: "0px",
            boxShadow: "none",
            opacity: "1",
          };

        case "header":
          return {
            ...baseStyles,
            width: "100%",
            fontSize: "28px",
            fontWeight: "700",
            fontStyle: "normal",
            color: "#1a1a1a",
            backgroundColor: "transparent",
            borderWidth: "0px",
            borderColor: "#e5e7eb",
            borderStyle: "solid",
            borderRadius: "0px",
            paddingTop: "0px",
            paddingRight: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "16px",
            marginLeft: "0px",
            lineHeight: "1.4",
            letterSpacing: "normal",
            textAlign: "left",
            textDecoration: "none",
            textShadow: "none",
            textTransform: "none",
            boxShadow: "none",
            opacity: "1",
          };

        case "text":
          return {
            ...baseStyles,
            width: "100%",
            fontSize: "16px",
            fontWeight: "400",
            fontStyle: "normal",
            color: "#333333",
            backgroundColor: "transparent",
            borderWidth: "0px",
            borderColor: "#e5e7eb",
            borderStyle: "solid",
            borderRadius: "0px",
            paddingTop: "0px",
            paddingRight: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "16px",
            marginLeft: "0px",
            lineHeight: "1.6",
            letterSpacing: "normal",
            textAlign: "left",
            textDecoration: "none",
            textShadow: "none",
            textTransform: "none",
            boxShadow: "none",
            opacity: "1",
          };

        case "button":
          return {
            ...baseStyles,
            width: "auto",
            backgroundColor: "#007bff",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            fontStyle: "normal",
            borderWidth: "0px",
            borderColor: "#0056b3",
            borderStyle: "solid",
            borderRadius: "6px",
            paddingTop: "12px",
            paddingRight: "24px",
            paddingBottom: "12px",
            paddingLeft: "24px",
            marginTop: "0px",
            marginRight: "auto",
            marginBottom: "16px",
            marginLeft: "auto",
            textAlign: "center",
            textDecoration: "none",
            textShadow: "none",
            boxShadow: "none",
            opacity: "1",
            link: "#",
          };

        case "image":
          return {
            ...baseStyles,
            width: "100%",
            height: "300px",
            backgroundColor: "#f3f4f6",
            borderWidth: "0px",
            borderColor: "#e5e7eb",
            borderStyle: "solid",
            borderRadius: "0px",
            paddingTop: "0px",
            paddingRight: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "16px",
            marginLeft: "0px",
            boxShadow: "none",
            opacity: "1",
            objectFit: "cover",
            shapeType: "rectangle",
          };

        case "divider":
          return {
            ...baseStyles,
            width: "100%",
            height: "2px", // ✅ NEW: Explicit height for thickness
            backgroundColor: "#d1d5db", // ✅ NEW: Use solid color instead of border
            borderWidth: "0px",
            borderColor: "transparent",
            borderStyle: "solid",
            marginTop: "12px",
            marginRight: "0px",
            marginBottom: "12px",
            marginLeft: "0px",
            paddingTop: "0px",
            paddingRight: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            opacity: "1",
          };

        case "shape":
          return {
            ...baseStyles,
            width: "200px",
            height: "200px",
            backgroundColor: "#3b82f6",
            borderWidth: "0px",
            borderColor: "#1e40af",
            borderStyle: "solid",
            borderRadius: "0px",
            marginTop: "0px",
            marginRight: "auto",
            marginBottom: "16px",
            marginLeft: "auto",
            boxShadow: "none",
            opacity: "1",
            shapeType: "rectangle",
            fillType: "solid",
          };

        case "social":
          return {
            ...baseStyles,
            width: "100%",
            backgroundColor: "transparent",
            borderWidth: "0px",
            borderColor: "#e5e7eb",
            borderStyle: "solid",
            borderRadius: "0px",
            paddingTop: "16px",
            paddingRight: "16px",
            paddingBottom: "16px",
            paddingLeft: "16px",
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "16px",
            marginLeft: "0px",
            textAlign: "center",
            color: "#666666",
            gap: "12px",
            boxShadow: "none",
            opacity: "1",
            icons: [],
          };

        default:
          return baseStyles;
      }
    };

    const handleDrop = (e, targetContainerId = null) => {
      e.preventDefault();
      e.stopPropagation();

      setDragOverElementId(null);

      const type = e.dataTransfer.getData("type");
      const sectionDropType = e.dataTransfer.getData("sectionDropType");

      if (targetContainerId && type) {
        addElementToContainer(targetContainerId, type, {});
        return;
      }

      if (type) {
        addElement(type, {});
        return;
      }

      if (sectionDropType) {
       const sectionChildren = [];

switch (sectionDropType) {
  // ============ BASIC LAYOUTS ============
  case "header-text":
    sectionChildren.push(
      { type: "header", content: "Section Header" },
      { type: "text", content: "This is the text content." }
    );
    break;

  case "header-text-button":
    sectionChildren.push(
      { type: "header", content: "Call to Action" },
      { type: "text", content: "Compelling text to encourage action." },
      { type: "button", content: "Take Action", link: "#" }
    );
    break;

  case "text-divider-text":
    sectionChildren.push(
      { type: "text", content: "First section of content." },
      { type: "divider" },
      { type: "text", content: "Second section of content." }
    );
    break;

  case "image-only":
    sectionChildren.push(
      { type: "image", src: "https://via.placeholder.com/600x200", alt: "Full width banner" }
    );
    break;

  // ============ NEWSLETTER HEADERS (GRID LAYOUTS) ============
  case "newsletter-logo-header":
    sectionChildren.push({
      type: "grid",
      content: "Newsletter Header",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "auto 1fr",
        gap: "20px",
        alignItems: "center",
      },
      children: [
        {
          type: "item",
          content: "Logo",
          children: [
            { type: "image", src: "https://via.placeholder.com/120x120", alt: "Logo", styles: { ...getDefaultStyles("image"), width: "120px", height: "120px" } }
          ],
        },
        {
          type: "item",
          content: "Header",
          children: [
            { type: "header", content: "Weekly Newsletter", styles: { ...getDefaultStyles("header"), fontSize: "28px", margin: "0" } }
          ],
        },
      ],
    });
    break;

  case "newsletter-logo-text-date":
    sectionChildren.push({
      type: "grid",
      content: "Newsletter Header with Date",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "auto 1fr",
        gap: "20px",
        alignItems: "center",
      },
      children: [
        {
          type: "item",
          content: "Logo",
          children: [
            { type: "image", src: "https://via.placeholder.com/100x100", alt: "Logo", styles: { ...getDefaultStyles("image"), width: "100px", height: "100px" } }
          ],
        },
        {
          type: "item",
          content: "Text & Date",
          children: [
            { type: "header", content: "Company Newsletter", styles: { ...getDefaultStyles("header"), fontSize: "24px", marginBottom: "5px" } },
            { type: "text", content: "Issue #42 | November 2024", styles: { ...getDefaultStyles("text"), fontSize: "14px", color: "#666", margin: "0" } }
          ],
        },
      ],
    });
    break;

  case "newsletter-logo-social":
    sectionChildren.push({
      type: "grid",
      content: "Newsletter Header with Social",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "auto 1fr",
        gap: "20px",
        alignItems: "center",
      },
      children: [
        {
          type: "item",
          content: "Logo",
          children: [
            { type: "image", src: "https://via.placeholder.com/100x100", alt: "Logo", styles: { ...getDefaultStyles("image"), width: "100px", height: "100px" } }
          ],
        },
        {
          type: "item",
          content: "Social",
          children: [
            { type: "social", styles: { ...getDefaultStyles("social"), justifyContent: "flex-end" } }
          ],
        },
      ],
    });
    break;

  case "newsletter-logo-centered":
    sectionChildren.push(
      { type: "image", src: "https://via.placeholder.com/150x150", alt: "Logo", styles: { ...getDefaultStyles("image"), width: "150px", height: "150px", margin: "0 auto", display: "block" } },
      { type: "text", content: "Your trusted source for industry news", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px", color: "#666", marginTop: "10px" } }
    );
    break;

  case "newsletter-banner":
    sectionChildren.push(
      { type: "image", src: "https://via.placeholder.com/800x200", alt: "Newsletter Banner", styles: { ...getDefaultStyles("image"), width: "100%", height: "auto" } }
    );
    break;

  case "newsletter-logo-text-social":
    sectionChildren.push({
      type: "grid",
      content: "Newsletter Full Header",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "auto 1fr auto",
        gap: "20px",
        alignItems: "center",
      },
      children: [
        {
          type: "item",
          content: "Logo",
          children: [
            { type: "image", src: "https://via.placeholder.com/80x80", alt: "Logo", styles: { ...getDefaultStyles("image"), width: "80px", height: "80px" } }
          ],
        },
        {
          type: "item",
          content: "Title",
          children: [
            { type: "header", content: "Monthly Digest", styles: { ...getDefaultStyles("header"), fontSize: "24px", margin: "0", textAlign: "center" } }
          ],
        },
        {
          type: "item",
          content: "Social",
          children: [
            { type: "social" }
          ],
        },
      ],
    });
    break;

  case "newsletter-header-logo-right":
    sectionChildren.push({
      type: "grid",
      content: "Header with Logo Right",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "1fr auto",
        gap: "20px",
        alignItems: "center",
      },
      children: [
        {
          type: "item",
          content: "Header",
          children: [
            { type: "header", content: "Industry Newsletter", styles: { ...getDefaultStyles("header"), fontSize: "28px", margin: "0" } }
          ],
        },
        {
          type: "item",
          content: "Logo",
          children: [
            { type: "image", src: "https://via.placeholder.com/120x120", alt: "Logo", styles: { ...getDefaultStyles("image"), width: "120px", height: "120px" } }
          ],
        },
      ],
    });
    break;

  // ============ GRID LAYOUTS ============
  case "grid-2col":
    sectionChildren.push({
      type: "grid",
      content: "2-Column Grid",
      children: [
        {
          type: "item",
          content: "Item 1",
          children: [{ type: "text", content: "Column 1 content" }],
        },
        {
          type: "item",
          content: "Item 2",
          children: [{ type: "text", content: "Column 2 content" }],
        },
      ],
    });
    break;

  case "grid-3col":
    sectionChildren.push({
      type: "grid",
      content: "3-Column Grid",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(3, 1fr)",
      },
      children: [
        { type: "item", content: "Item 1", children: [{ type: "text", content: "Column 1" }] },
        { type: "item", content: "Item 2", children: [{ type: "text", content: "Column 2" }] },
        { type: "item", content: "Item 3", children: [{ type: "text", content: "Column 3" }] },
      ],
    });
    break;

  case "grid-4col":
    sectionChildren.push({
      type: "grid",
      content: "4-Column Grid",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(4, 1fr)",
      },
      children: [
        { type: "item", content: "Item 1", children: [{ type: "text", content: "Column 1" }] },
        { type: "item", content: "Item 2", children: [{ type: "text", content: "Column 2" }] },
        { type: "item", content: "Item 3", children: [{ type: "text", content: "Column 3" }] },
        { type: "item", content: "Item 4", children: [{ type: "text", content: "Column 4" }] },
      ],
    });
    break;

  case "grid-2x2":
    sectionChildren.push({
      type: "grid",
      content: "2x2 Grid",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(2, 1fr)",
      },
      children: [
        { type: "item", content: "Item 1", children: [{ type: "text", content: "Top Left" }] },
        { type: "item", content: "Item 2", children: [{ type: "text", content: "Top Right" }] },
        { type: "item", content: "Item 3", children: [{ type: "text", content: "Bottom Left" }] },
        { type: "item", content: "Item 4", children: [{ type: "text", content: "Bottom Right" }] },
      ],
    });
    break;

  // ============ HERO SECTIONS ============
  case "hero-image-header-text-button":
    sectionChildren.push(
      { type: "image", src: "https://via.placeholder.com/800x400", alt: "Hero Image" },
      { type: "header", content: "Welcome to Our Platform", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "Discover amazing features and start your journey today.", styles: { ...getDefaultStyles("text"), textAlign: "center" } },
      { type: "button", content: "Get Started", link: "#" }
    );
    break;

  case "hero-shape-header-text-button":
    sectionChildren.push(
      { type: "shape", styles: { ...getDefaultStyles("shape"), width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto" } },
      { type: "header", content: "Your Success Starts Here", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "Join thousands of satisfied users.", styles: { ...getDefaultStyles("text"), textAlign: "center" } },
      { type: "button", content: "Join Now", link: "#" }
    );
    break;

  case "hero-header-text-2button":
    sectionChildren.push(
      { type: "header", content: "Transform Your Business", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "The complete solution for modern teams.", styles: { ...getDefaultStyles("text"), textAlign: "center" } },
      { type: "button", content: "Start Free Trial", link: "#" },
      { type: "button", content: "Learn More", link: "#", styles: { ...getDefaultStyles("button"), backgroundColor: "#6b7280" } }
    );
    break;

  // ============ MEDIA SECTIONS ============
  case "image-text-side":
    sectionChildren.push({
      type: "grid",
      content: "Image Text Layout",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "1fr 1fr",
      },
      children: [
        {
          type: "item",
          content: "Image",
          children: [{ type: "image", src: "https://via.placeholder.com/400x300", alt: "Feature" }],
        },
        {
          type: "item",
          content: "Text",
          children: [
            { type: "header", content: "Our Story" },
            { type: "text", content: "Learn about our mission and values that drive everything we do." }
          ],
        },
      ],
    });
    break;

  case "text-image-side":
    sectionChildren.push({
      type: "grid",
      content: "Text Image Layout",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "1fr 1fr",
      },
      children: [
        {
          type: "item",
          content: "Text",
          children: [
            { type: "header", content: "Why Choose Us" },
            { type: "text", content: "We deliver excellence in every project we undertake." }
          ],
        },
        {
          type: "item",
          content: "Image",
          children: [{ type: "image", src: "https://via.placeholder.com/400x300", alt: "Feature" }],
        },
      ],
    });
    break;

  case "image-header-text":
    sectionChildren.push(
      { type: "image", src: "https://via.placeholder.com/600x300", alt: "Banner" },
      { type: "header", content: "Featured Content", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "Explore our latest offerings and updates.", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
    );
    break;

  case "image-grid-3":
    sectionChildren.push({
      type: "grid",
      content: "Gallery",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(3, 1fr)",
      },
      children: [
        { type: "item", content: "Image 1", children: [{ type: "image", src: "https://via.placeholder.com/300x200", alt: "Gallery 1" }] },
        { type: "item", content: "Image 2", children: [{ type: "image", src: "https://via.placeholder.com/300x200", alt: "Gallery 2" }] },
        { type: "item", content: "Image 3", children: [{ type: "image", src: "https://via.placeholder.com/300x200", alt: "Gallery 3" }] },
      ],
    });
    break;

  case "image-header-text-button":
    sectionChildren.push(
      { type: "image", src: "https://via.placeholder.com/600x300", alt: "Feature Image" },
      { type: "header", content: "Discover More", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "Explore what makes us different.", styles: { ...getDefaultStyles("text"), textAlign: "center" } },
      { type: "button", content: "Learn More", link: "#" }
    );
    break;

  // ============ ICON SECTIONS ============
  case "icon-header-text":
    sectionChildren.push(
      { type: "shape", styles: { ...getDefaultStyles("shape"), width: "60px", height: "60px", borderRadius: "12px", margin: "0 auto" } },
      { type: "header", content: "Key Feature", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "Description of this amazing feature.", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
    );
    break;

  case "icon-grid-3":
    sectionChildren.push({
      type: "grid",
      content: "Icon Features",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(3, 1fr)",
      },
      children: [
        {
          type: "item",
          content: "Icon 1",
          children: [
            { type: "shape", styles: { ...getDefaultStyles("shape"), width: "40px", height: "40px", borderRadius: "8px", margin: "0 auto" } },
            { type: "text", content: "Feature One", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
          ],
        },
        {
          type: "item",
          content: "Icon 2",
          children: [
            { type: "shape", styles: { ...getDefaultStyles("shape"), width: "40px", height: "40px", borderRadius: "8px", margin: "0 auto" } },
            { type: "text", content: "Feature Two", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
          ],
        },
        {
          type: "item",
          content: "Icon 3",
          children: [
            { type: "shape", styles: { ...getDefaultStyles("shape"), width: "40px", height: "40px", borderRadius: "8px", margin: "0 auto" } },
            { type: "text", content: "Feature Three", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
          ],
        },
      ],
    });
    break;

  case "icon-grid-4":
    sectionChildren.push({
      type: "grid",
      content: "4 Icon Grid",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(4, 1fr)",
      },
      children: [
        { type: "item", content: "Icon 1", children: [{ type: "shape", styles: { ...getDefaultStyles("shape"), width: "40px", height: "40px", borderRadius: "50%", margin: "0 auto" } }] },
        { type: "item", content: "Icon 2", children: [{ type: "shape", styles: { ...getDefaultStyles("shape"), width: "40px", height: "40px", borderRadius: "50%", margin: "0 auto" } }] },
        { type: "item", content: "Icon 3", children: [{ type: "shape", styles: { ...getDefaultStyles("shape"), width: "40px", height: "40px", borderRadius: "50%", margin: "0 auto" } }] },
        { type: "item", content: "Icon 4", children: [{ type: "shape", styles: { ...getDefaultStyles("shape"), width: "40px", height: "40px", borderRadius: "50%", margin: "0 auto" } }] },
      ],
    });
    break;

  case "icon-text-button":
    sectionChildren.push(
      { type: "shape", styles: { ...getDefaultStyles("shape"), width: "70px", height: "70px", borderRadius: "16px", margin: "0 auto" } },
      { type: "text", content: "Start your journey with us today.", styles: { ...getDefaultStyles("text"), textAlign: "center" } },
      { type: "button", content: "Get Started", link: "#" }
    );
    break;

  // ============ CALL-TO-ACTION SECTIONS ============
  case "cta-header-button":
    sectionChildren.push(
      { type: "header", content: "Ready to Get Started?", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "button", content: "Sign Up Now", link: "#" }
    );
    break;

  case "cta-shape-header-text-button":
    sectionChildren.push(
      { type: "shape", styles: { ...getDefaultStyles("shape"), width: "60px", height: "60px", borderRadius: "50%", margin: "0 auto" } },
      { type: "header", content: "Join Our Community", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "Connect with like-minded professionals.", styles: { ...getDefaultStyles("text"), textAlign: "center" } },
      { type: "button", content: "Join Today", link: "#" }
    );
    break;

  case "cta-boxed":
    sectionChildren.push(
      { type: "header", content: "Special Offer", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "Limited time only - don't miss out!", styles: { ...getDefaultStyles("text"), textAlign: "center" } },
      { type: "button", content: "Claim Offer", link: "#" }
    );
    break;

  case "cta-image-header-button":
    sectionChildren.push(
      { type: "image", src: "https://via.placeholder.com/600x200", alt: "CTA Background" },
      { type: "header", content: "Take Action Now", styles: { ...getDefaultStyles("header"), textAlign: "center", marginTop: "-80px", color: "#fff" } },
      { type: "button", content: "Get Started", link: "#" }
    );
    break;

  // ============ FEATURE SECTIONS ============
 // ============ MORE FEATURE SECTIONS ============

case "feature-3col":
  sectionChildren.push({
    type: "grid",
    content: "Features",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    children: [
      {
        type: "item",
        content: "Feature 1",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "40px", height: "40px", borderRadius: "8px", margin: "0 auto" } },
          { type: "header", content: "Fast", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Lightning-fast performance.", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
        ],
      },
      {
        type: "item",
        content: "Feature 2",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "40px", height: "40px", borderRadius: "8px", margin: "0 auto" } },
          { type: "header", content: "Secure", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Bank-level security.", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
        ],
      },
      {
        type: "item",
        content: "Feature 3",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "40px", height: "40px", borderRadius: "8px", margin: "0 auto" } },
          { type: "header", content: "Reliable", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "99.9% uptime guarantee.", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
        ],
      },
    ],
  });
  break;

case "feature-2col":
  sectionChildren.push({
    type: "grid",
    content: "Key Features",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    children: [
      {
        type: "item",
        content: "Feature 1",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "50%", margin: "0 auto" } },
          { type: "header", content: "Innovation", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
          { type: "text", content: "Cutting-edge technology.", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
        ],
      },
      {
        type: "item",
        content: "Feature 2",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "50%", margin: "0 auto" } },
          { type: "header", content: "Support", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
          { type: "text", content: "24/7 customer service.", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
        ],
      },
    ],
  });
  break;

case "feature-list":
  sectionChildren.push(
    { type: "text", content: "✓ Feature one - Amazing capability" },
    { type: "text", content: "✓ Feature two - Powerful tools" },
    { type: "text", content: "✓ Feature three - Easy to use" }
  );
  break;

case "feature-4col":
  sectionChildren.push({
    type: "grid",
    content: "4 Features",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "repeat(4, 1fr)",
    },
    children: [
      {
        type: "item",
        content: "Feature 1",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "35px", height: "35px", borderRadius: "8px", margin: "0 auto" } },
          { type: "text", content: "Easy", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px", fontWeight: "600" } }
        ],
      },
      {
        type: "item",
        content: "Feature 2",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "35px", height: "35px", borderRadius: "8px", margin: "0 auto" } },
          { type: "text", content: "Fast", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px", fontWeight: "600" } }
        ],
      },
      {
        type: "item",
        content: "Feature 3",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "35px", height: "35px", borderRadius: "8px", margin: "0 auto" } },
          { type: "text", content: "Safe", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px", fontWeight: "600" } }
        ],
      },
      {
        type: "item",
        content: "Feature 4",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "35px", height: "35px", borderRadius: "8px", margin: "0 auto" } },
          { type: "text", content: "Smart", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px", fontWeight: "600" } }
        ],
      },
    ],
  });
  break;

case "feature-image-text-2col":
  sectionChildren.push({
    type: "grid",
    content: "Features with Images",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    children: [
      {
        type: "item",
        content: "Feature 1",
        children: [
          { type: "image", src: "https://via.placeholder.com/300x200", alt: "Feature 1" },
          { type: "header", content: "Advanced Analytics", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Track your progress with detailed insights.", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
        ],
      },
      {
        type: "item",
        content: "Feature 2",
        children: [
          { type: "image", src: "https://via.placeholder.com/300x200", alt: "Feature 2" },
          { type: "header", content: "Easy Integration", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Connect with your favorite tools seamlessly.", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
        ],
      },
    ],
  });
  break;

case "feature-horizontal":
  sectionChildren.push({
    type: "grid",
    content: "Horizontal Feature",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "auto 1fr",
      gap: "20px",
      alignItems: "center",
    },
    children: [
      {
        type: "item",
        content: "Icon",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "60px", height: "60px", borderRadius: "12px" } }
        ],
      },
      {
        type: "item",
        content: "Text",
        children: [
          { type: "header", content: "Powerful Feature", styles: { ...getDefaultStyles("header"), fontSize: "20px", marginBottom: "5px" } },
          { type: "text", content: "This feature will transform the way you work and increase productivity.", styles: { ...getDefaultStyles("text"), fontSize: "14px" } }
        ],
      },
    ],
  });
  break;

case "feature-horizontal-list":
  sectionChildren.push({
    type: "grid",
    content: "Feature 1",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "auto 1fr",
      gap: "15px",
      alignItems: "center",
      marginBottom: "15px",
    },
    children: [
      {
        type: "item",
        content: "Icon 1",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "10px" } }
        ],
      },
      {
        type: "item",
        content: "Text 1",
        children: [
          { type: "header", content: "Real-time Updates", styles: { ...getDefaultStyles("header"), fontSize: "18px", margin: "0" } },
          { type: "text", content: "Stay informed with instant notifications.", styles: { ...getDefaultStyles("text"), fontSize: "14px", margin: "5px 0 0 0" } }
        ],
      },
    ],
  });
  sectionChildren.push({
    type: "grid",
    content: "Feature 2",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "auto 1fr",
      gap: "15px",
      alignItems: "center",
      marginBottom: "15px",
    },
    children: [
      {
        type: "item",
        content: "Icon 2",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "10px" } }
        ],
      },
      {
        type: "item",
        content: "Text 2",
        children: [
          { type: "header", content: "Cloud Backup", styles: { ...getDefaultStyles("header"), fontSize: "18px", margin: "0" } },
          { type: "text", content: "Your data is always safe and secure.", styles: { ...getDefaultStyles("text"), fontSize: "14px", margin: "5px 0 0 0" } }
        ],
      },
    ],
  });
  sectionChildren.push({
    type: "grid",
    content: "Feature 3",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "auto 1fr",
      gap: "15px",
      alignItems: "center",
    },
    children: [
      {
        type: "item",
        content: "Icon 3",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "10px" } }
        ],
      },
      {
        type: "item",
        content: "Text 3",
        children: [
          { type: "header", content: "Easy Collaboration", styles: { ...getDefaultStyles("header"), fontSize: "18px", margin: "0" } },
          { type: "text", content: "Work together seamlessly with your team.", styles: { ...getDefaultStyles("text"), fontSize: "14px", margin: "5px 0 0 0" } }
        ],
      },
    ],
  });
  break;

case "feature-icon-left-3row":
  sectionChildren.push({
    type: "grid",
    content: "Feature Row 1",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "auto 1fr",
      gap: "15px",
      alignItems: "start",
      marginBottom: "20px",
    },
    children: [
      {
        type: "item",
        content: "Icon",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "8px" } }
        ],
      },
      {
        type: "item",
        content: "Content",
        children: [
          { type: "header", content: "Smart Automation", styles: { ...getDefaultStyles("header"), fontSize: "18px", marginBottom: "8px" } },
          { type: "text", content: "Automate repetitive tasks and focus on what matters most. Save hours every week.", styles: { ...getDefaultStyles("text"), fontSize: "14px" } }
        ],
      },
    ],
  });
  sectionChildren.push({
    type: "grid",
    content: "Feature Row 2",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "auto 1fr",
      gap: "15px",
      alignItems: "start",
      marginBottom: "20px",
    },
    children: [
      {
        type: "item",
        content: "Icon",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "8px" } }
        ],
      },
      {
        type: "item",
        content: "Content",
        children: [
          { type: "header", content: "Advanced Security", styles: { ...getDefaultStyles("header"), fontSize: "18px", marginBottom: "8px" } },
          { type: "text", content: "Enterprise-grade encryption keeps your data protected at all times.", styles: { ...getDefaultStyles("text"), fontSize: "14px" } }
        ],
      },
    ],
  });
  sectionChildren.push({
    type: "grid",
    content: "Feature Row 3",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "auto 1fr",
      gap: "15px",
      alignItems: "start",
    },
    children: [
      {
        type: "item",
        content: "Icon",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "8px" } }
        ],
      },
      {
        type: "item",
        content: "Content",
        children: [
          { type: "header", content: "Seamless Integration", styles: { ...getDefaultStyles("header"), fontSize: "18px", marginBottom: "8px" } },
          { type: "text", content: "Connect with 1000+ apps and tools you already use every day.", styles: { ...getDefaultStyles("text"), fontSize: "14px" } }
        ],
      },
    ],
  });
  break;

case "feature-boxed-3col":
  sectionChildren.push({
    type: "grid",
    content: "Boxed Features",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    children: [
      {
        type: "item",
        content: "Box 1",
        styles: {
          ...getDefaultStyles("item"),
          padding: "20px",
          border: "2px solid #e0e0e0",
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
        },
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "45px", height: "45px", borderRadius: "8px", margin: "0 auto 10px auto" } },
          { type: "header", content: "Reliable", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "99.9% uptime", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
      {
        type: "item",
        content: "Box 2",
        styles: {
          ...getDefaultStyles("item"),
          padding: "20px",
          border: "2px solid #e0e0e0",
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
        },
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "45px", height: "45px", borderRadius: "8px", margin: "0 auto 10px auto" } },
          { type: "header", content: "Scalable", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Grows with you", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
      {
        type: "item",
        content: "Box 3",
        styles: {
          ...getDefaultStyles("item"),
          padding: "20px",
          border: "2px solid #e0e0e0",
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
        },
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "45px", height: "45px", borderRadius: "8px", margin: "0 auto 10px auto" } },
          { type: "header", content: "Efficient", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Save time daily", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
    ],
  });
  break;

case "feature-numbered-list":
  sectionChildren.push(
    { type: "text", content: "1. First amazing feature that will change everything", styles: { ...getDefaultStyles("text"), fontSize: "16px", marginBottom: "10px" } },
    { type: "text", content: "2. Second powerful capability for enhanced productivity", styles: { ...getDefaultStyles("text"), fontSize: "16px", marginBottom: "10px" } },
    { type: "text", content: "3. Third innovative solution to streamline your workflow", styles: { ...getDefaultStyles("text"), fontSize: "16px" } }
  );
  break;

case "feature-header-3col":
  sectionChildren.push(
    { type: "header", content: "Why Choose Us", styles: { ...getDefaultStyles("header"), textAlign: "center", marginBottom: "20px" } }
  );
  sectionChildren.push({
    type: "grid",
    content: "Features",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    children: [
      {
        type: "item",
        content: "Feature 1",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "10px", margin: "0 auto 10px auto" } },
          { type: "header", content: "Quality", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Premium materials", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
      {
        type: "item",
        content: "Feature 2",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "10px", margin: "0 auto 10px auto" } },
          { type: "header", content: "Speed", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Fast delivery", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
      {
        type: "item",
        content: "Feature 3",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "10px", margin: "0 auto 10px auto" } },
          { type: "header", content: "Support", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "24/7 assistance", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
    ],
  });
  break;

case "feature-alternating":
  sectionChildren.push({
    type: "grid",
    content: "Feature Alt 1",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "auto 1fr",
      gap: "20px",
      alignItems: "center",
      marginBottom: "20px",
    },
    children: [
      {
        type: "item",
        content: "Icon Left",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "55px", height: "55px", borderRadius: "12px" } }
        ],
      },
      {
        type: "item",
        content: "Text Right",
        children: [
          { type: "header", content: "Feature One", styles: { ...getDefaultStyles("header"), fontSize: "18px" } },
          { type: "text", content: "Description of the first feature", styles: { ...getDefaultStyles("text"), fontSize: "14px" } }
        ],
      },
    ],
  });
  sectionChildren.push({
    type: "grid",
    content: "Feature Alt 2",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "1fr auto",
      gap: "20px",
      alignItems: "center",
      marginBottom: "20px",
    },
    children: [
      {
        type: "item",
        content: "Text Left",
        children: [
          { type: "header", content: "Feature Two", styles: { ...getDefaultStyles("header"), fontSize: "18px", textAlign: "right" } },
          { type: "text", content: "Description of the second feature", styles: { ...getDefaultStyles("text"), fontSize: "14px", textAlign: "right" } }
        ],
      },
      {
        type: "item",
        content: "Icon Right",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "55px", height: "55px", borderRadius: "12px" } }
        ],
      },
    ],
  });
  sectionChildren.push({
    type: "grid",
    content: "Feature Alt 3",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "auto 1fr",
      gap: "20px",
      alignItems: "center",
    },
    children: [
      {
        type: "item",
        content: "Icon Left",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "55px", height: "55px", borderRadius: "12px" } }
        ],
      },
      {
        type: "item",
        content: "Text Right",
        children: [
          { type: "header", content: "Feature Three", styles: { ...getDefaultStyles("header"), fontSize: "18px" } },
          { type: "text", content: "Description of the third feature", styles: { ...getDefaultStyles("text"), fontSize: "14px" } }
        ],
      },
    ],
  });
  break;

case "feature-image-top-3col":
  sectionChildren.push({
    type: "grid",
    content: "Image Top Features",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    children: [
      {
        type: "item",
        content: "Feature 1",
        children: [
          { type: "image", src: "https://via.placeholder.com/300x200", alt: "Feature 1" },
          { type: "header", content: "Mobile Ready", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px", marginTop: "10px" } },
          { type: "text", content: "Optimized for all devices and screen sizes.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
      {
        type: "item",
        content: "Feature 2",
        children: [
          { type: "image", src: "https://via.placeholder.com/300x200", alt: "Feature 2" },
          { type: "header", content: "Cloud Based", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px", marginTop: "10px" } },
          { type: "text", content: "Access your data from anywhere, anytime.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
      {
        type: "item",
        content: "Feature 3",
        children: [
          { type: "image", src: "https://via.placeholder.com/300x200", alt: "Feature 3" },
          { type: "header", content: "Secure", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px", marginTop: "10px" } },
          { type: "text", content: "End-to-end encryption for complete privacy.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
    ],
  });
  break;

case "feature-large-icon-2col":
  sectionChildren.push({
    type: "grid",
    content: "Large Icon Features",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    children: [
      {
        type: "item",
        content: "Feature 1",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "80px", height: "80px", borderRadius: "16px", margin: "0 auto 15px auto" } },
          { type: "header", content: "Powerful Analytics", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "20px" } },
          { type: "text", content: "Deep insights into your business performance with real-time dashboards.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
      {
        type: "item",
        content: "Feature 2",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "80px", height: "80px", borderRadius: "16px", margin: "0 auto 15px auto" } },
          { type: "header", content: "Team Collaboration", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "20px" } },
          { type: "text", content: "Work together seamlessly with built-in communication tools.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
    ],
  });
  break;

case "feature-compact-4col":
  sectionChildren.push({
    type: "grid",
    content: "Compact Features",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "repeat(4, 1fr)",
    },
    children: [
      {
        type: "item",
        content: "Feature 1",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "30px", height: "30px", borderRadius: "6px", margin: "0 auto 8px auto" } },
          { type: "text", content: "Quick", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px", fontWeight: "600" } }
        ],
      },
      {
        type: "item",
        content: "Feature 2",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "30px", height: "30px", borderRadius: "6px", margin: "0 auto 8px auto" } },
          { type: "text", content: "Easy", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px", fontWeight: "600" } }
        ],
      },
      {
        type: "item",
        content: "Feature 3",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "30px", height: "30px", borderRadius: "6px", margin: "0 auto 8px auto" } },
          { type: "text", content: "Safe", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px", fontWeight: "600" } }
        ],
      },
      {
        type: "item",
        content: "Feature 4",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "30px", height: "30px", borderRadius: "6px", margin: "0 auto 8px auto" } },
          { type: "text", content: "Smart", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px", fontWeight: "600" } }
        ],
      },
    ],
  });
  break;

case "feature-benefits-3col":
  sectionChildren.push({
    type: "grid",
    content: "Benefits",
    styles: {
      ...getDefaultStyles("grid"),
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    children: [
      {
        type: "item",
        content: "Benefit 1",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "45px", height: "45px", borderRadius: "50%", margin: "0 auto 10px auto", backgroundColor: "#10b981" } },
          { type: "header", content: "Save Time", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Automate tasks and work 10x faster than before.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
      {
        type: "item",
        content: "Benefit 2",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "45px", height: "45px", borderRadius: "50%", margin: "0 auto 10px auto", backgroundColor: "#10b981" } },
          { type: "header", content: "Save Money", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Reduce costs by up to 40% with our solution.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
      {
        type: "item",
        content: "Benefit 3",
        children: [
          { type: "shape", styles: { ...getDefaultStyles("shape"), width: "45px", height: "45px", borderRadius: "50%", margin: "0 auto 10px auto", backgroundColor: "#10b981" } },
          { type: "header", content: "Peace of Mind", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
          { type: "text", content: "Rest easy with our 100% satisfaction guarantee.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
        ],
      },
    ],
  });
  break;
    sectionChildren.push(
      { type: "text", content: "✓ Feature one - Amazing capability" },
      { type: "text", content: "✓ Feature two - Powerful tools" },
      { type: "text", content: "✓ Feature three - Easy to use" }
    );
    break;

  // ============ PRODUCT SECTIONS ============
  case "product-image-header-price-button":
    sectionChildren.push(
      { type: "image", src: "https://via.placeholder.com/400x300", alt: "Product" },
      { type: "header", content: "Product Name", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "$99.99", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "24px", fontWeight: "bold", color: "#16a34a" } },
      { type: "button", content: "Buy Now", link: "#" }
    );
    break;

  case "product-grid-2":
    sectionChildren.push({
      type: "grid",
      content: "Products",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(2, 1fr)",
      },
      children: [
        {
          type: "item",
          content: "Product 1",
          children: [
            { type: "image", src: "https://via.placeholder.com/300x200", alt: "Product 1" },
            { type: "header", content: "Product One", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
            { type: "text", content: "$49.99", styles: { ...getDefaultStyles("text"), textAlign: "center", fontWeight: "bold", color: "#16a34a" } }
          ],
        },
        {
          type: "item",
          content: "Product 2",
          children: [
            { type: "image", src: "https://via.placeholder.com/300x200", alt: "Product 2" },
            { type: "header", content: "Product Two", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "18px" } },
            { type: "text", content: "$79.99", styles: { ...getDefaultStyles("text"), textAlign: "center", fontWeight: "bold", color: "#16a34a" } }
          ],
        },
      ],
    });
    break;

  case "product-featured":
    sectionChildren.push({
      type: "grid",
      content: "Featured Product",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "1fr 1fr",
      },
      children: [
        {
          type: "item",
          content: "Image",
          children: [{ type: "image", src: "https://via.placeholder.com/400x400", alt: "Featured Product" }],
        },
        {
          type: "item",
          content: "Details",
          children: [
            { type: "header", content: "Premium Product" },
            { type: "text", content: "High-quality materials and exceptional craftsmanship. Limited edition." },
            { type: "text", content: "$199.99", styles: { ...getDefaultStyles("text"), fontSize: "28px", fontWeight: "bold", color: "#16a34a" } },
            { type: "button", content: "Add to Cart", link: "#" }
          ],
        },
      ],
    });
    break;

  // ============ STATS & METRICS ============
  case "stats-3col":
    sectionChildren.push({
      type: "grid",
      content: "Statistics",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(3, 1fr)",
      },
      children: [
        {
          type: "item",
          content: "Stat 1",
          children: [
            { type: "header", content: "10K+", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "32px", color: "#4f46e5" } },
            { type: "text", content: "Active Users", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
          ],
        },
        {
          type: "item",
          content: "Stat 2",
          children: [
            { type: "header", content: "500+", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "32px", color: "#4f46e5" } },
            { type: "text", content: "Companies", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
          ],
        },
        {
          type: "item",
          content: "Stat 3",
          children: [
            { type: "header", content: "99%", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "32px", color: "#4f46e5" } },
            { type: "text", content: "Satisfaction", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
          ],
        },
      ],
    });
    break;

  case "stats-4col":
    sectionChildren.push({
      type: "grid",
      content: "Metrics",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(4, 1fr)",
      },
      children: [
        { type: "item", content: "Stat 1", children: [{ type: "header", content: "1M+", styles: { ...getDefaultStyles("header"), textAlign: "center", color: "#4f46e5" } }] },
        { type: "item", content: "Stat 2", children: [{ type: "header", content: "24/7", styles: { ...getDefaultStyles("header"), textAlign: "center", color: "#4f46e5" } }] },
        { type: "item", content: "Stat 3", children: [{ type: "header", content: "150+", styles: { ...getDefaultStyles("header"), textAlign: "center", color: "#4f46e5" } }] },
        { type: "item", content: "Stat 4", children: [{ type: "header", content: "100%", styles: { ...getDefaultStyles("header"), textAlign: "center", color: "#4f46e5" } }] },
      ],
    });
    break;

  // ============ TESTIMONIALS ============
  case "testimonial-single":
    sectionChildren.push(
      { type: "text", content: '"This product changed my business completely. Highly recommended!"', styles: { ...getDefaultStyles("text"), fontStyle: "italic", textAlign: "center" } },
      { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "50%", margin: "10px auto" } },
      { type: "text", content: "- John Doe, CEO", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
    );
    break;

  case "testimonial-grid-2":
    sectionChildren.push({
      type: "grid",
      content: "Testimonials",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(2, 1fr)",
      },
      children: [
        {
          type: "item",
          content: "Testimonial 1",
          children: [
            { type: "text", content: '"Amazing service and support!"', styles: { ...getDefaultStyles("text"), fontStyle: "italic" } },
            { type: "text", content: "- Jane Smith", styles: { ...getDefaultStyles("text"), fontSize: "12px" } }
          ],
        },
        {
          type: "item",
          content: "Testimonial 2",
          children: [
            { type: "text", content: '"Best investment we ever made."', styles: { ...getDefaultStyles("text"), fontStyle: "italic" } },
            { type: "text", content: "- Mike Johnson", styles: { ...getDefaultStyles("text"), fontSize: "12px" } }
          ],
        },
      ],
    });
    break;

  // ============ FOOTER SECTIONS ============
  case "footer-social":
    sectionChildren.push(
      { type: "text", content: "© 2024 Your Company. All rights reserved.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } },
      { type: "social" }
    );
    break;

  case "footer-text-social":
    sectionChildren.push(
      { type: "text", content: "Stay connected with us and never miss an update." },
      { type: "text", content: "© 2024 Your Company. All rights reserved.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "12px", color: "#666" } },
      { type: "social" }
    );
    break;

  case "footer-links-social":
    sectionChildren.push(
      { type: "button", content: "About", link: "#about", styles: { ...getDefaultStyles("button"), backgroundColor: "transparent", color: "#3b82f6", border: "none" } },
      { type: "button", content: "Contact", link: "#contact", styles: { ...getDefaultStyles("button"), backgroundColor: "transparent", color: "#3b82f6", border: "none" } },
      { type: "button", content: "Privacy", link: "#privacy", styles: { ...getDefaultStyles("button"), backgroundColor: "transparent", color: "#3b82f6", border: "none" } },
      { type: "divider" },
      { type: "social" }
    );
    break;

  case "footer-newsletter-signup":
    sectionChildren.push(
      { type: "header", content: "Subscribe to Our Newsletter", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "20px" } },
      { type: "text", content: "Get the latest updates delivered to your inbox.", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } },
      { type: "button", content: "Subscribe", link: "#subscribe" }
    );
    break;

  // ============ CARD SECTIONS ============
  case "card-image-header-text-button":
    sectionChildren.push(
      { type: "image", src: "https://via.placeholder.com/400x250", alt: "Card Image" },
      { type: "header", content: "Card Title", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "This is a card with an image, header, text, and button.", styles: { ...getDefaultStyles("text"), textAlign: "center" } },
      { type: "button", content: "Read More", link: "#" }
    );
    break;

  case "card-shape-header-text":
    sectionChildren.push(
      { type: "shape", styles: { ...getDefaultStyles("shape"), width: "50px", height: "50px", borderRadius: "50%", margin: "0 auto" } },
      { type: "header", content: "Icon Card", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "A simple card with an icon, header, and description.", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
    );
    break;

  case "card-grid-2":
    sectionChildren.push({
      type: "grid",
      content: "Card Grid",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(2, 1fr)",
      },
      children: [
        {
          type: "item",
          content: "Card 1",
          children: [
            { type: "image", src: "https://via.placeholder.com/300x200", alt: "Card 1" },
            { type: "text", content: "Card description", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
          ],
        },
        {
          type: "item",
          content: "Card 2",
          children: [
            { type: "image", src: "https://via.placeholder.com/300x200", alt: "Card 2" },
            { type: "text", content: "Card description", styles: { ...getDefaultStyles("text"), textAlign: "center" } }
          ],
        },
      ],
    });
    break;

  // ============ PROFILE SECTIONS ============
  case "profile-image-header-text-social":
    sectionChildren.push(
      { type: "image", src: "https://via.placeholder.com/150x150", alt: "Profile", styles: { ...getDefaultStyles("image"), borderRadius: "50%", width: "150px", height: "150px", margin: "0 auto" } },
      { type: "header", content: "John Doe", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "Software Developer | Tech Enthusiast", styles: { ...getDefaultStyles("text"), textAlign: "center" } },
      { type: "social" }
    );
    break;

  case "profile-shape-header-text-button":
    sectionChildren.push(
      { type: "shape", styles: { ...getDefaultStyles("shape"), width: "100px", height: "100px", borderRadius: "50%", margin: "0 auto" } },
      { type: "header", content: "Jane Smith", styles: { ...getDefaultStyles("header"), textAlign: "center" } },
      { type: "text", content: "Designer & Creative Director", styles: { ...getDefaultStyles("text"), textAlign: "center" } },
      { type: "button", content: "Contact Me", link: "#" }
    );
    break;

  case "team-grid-3":
    sectionChildren.push({
      type: "grid",
      content: "Team Members",
      styles: {
        ...getDefaultStyles("grid"),
        gridTemplateColumns: "repeat(3, 1fr)",
      },
      children: [
        {
          type: "item",
          content: "Member 1",
          children: [
            { type: "image", src: "https://via.placeholder.com/150x150", alt: "Team Member", styles: { ...getDefaultStyles("image"), borderRadius: "50%", width: "100px", height: "100px", margin: "0 auto" } },
            { type: "header", content: "Alice Brown", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "16px" } },
            { type: "text", content: "CEO", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
          ],
        },
        {
          type: "item",
          content: "Member 2",
          children: [
            { type: "image", src: "https://via.placeholder.com/150x150", alt: "Team Member", styles: { ...getDefaultStyles("image"), borderRadius: "50%", width: "100px", height: "100px", margin: "0 auto" } },
            { type: "header", content: "Bob Wilson", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "16px" } },
            { type: "text", content: "CTO", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
          ],
        },
        {
          type: "item",
          content: "Member 3",
          children: [
            { type: "image", src: "https://via.placeholder.com/150x150", alt: "Team Member", styles: { ...getDefaultStyles("image"), borderRadius: "50%", width: "100px", height: "100px", margin: "0 auto" } },
            { type: "header", content: "Carol Davis", styles: { ...getDefaultStyles("header"), textAlign: "center", fontSize: "16px" } },
            { type: "text", content: "Designer", styles: { ...getDefaultStyles("text"), textAlign: "center", fontSize: "14px" } }
          ],
        },
      ],
    });
    break;

  default:
    sectionChildren.push({ type: "text", content: "Sample content." });

        }

        const createNestedElement = (config) => ({
          id: Date.now() + Math.random() + Math.random(),
          type: config.type,
          content: config.content,
          styles: config.styles || getDefaultStyles(config.type),
          children: config.children
            ? config.children.map(createNestedElement)
            : canHaveChildren(config.type)
            ? []
            : undefined,
          icons: config.icons,
          link: config.link,
        });

        const newSection = {
          id: Date.now() + Math.random(),
          type: "section",
          content: "New Section",
          styles: getDefaultStyles("section"),
          children: sectionChildren.map(createNestedElement),
        };

        setElements([...elements, newSection]);
        return;
      }
    };

    const handleDragOver = (e, elementId = null) => {
      e.preventDefault();
      e.stopPropagation();

      if (elementId) {
        const result = findElementById(elements, elementId);
        if (result && canHaveChildren(result.element.type)) {
          setDragOverElementId(elementId);
        }
      }
    };

    const handleDragLeave = (e, elementId = null) => {
      e.stopPropagation();
      if (elementId === dragOverElementId) {
        setDragOverElementId(null);
      }
    };

    const handleDeleteNested = (elementId) => {
      const deleteFromArray = (elements) => {
        return elements
          .filter((el) => el.id !== elementId)
          .map((el) => {
            if (el.children && el.children.length > 0) {
              return {
                ...el,
                children: deleteFromArray(el.children),
              };
            }
            return el;
          });
      };

      setElements(deleteFromArray(elements));
    };

    // ✅ CRITICAL: Render function that passes full element to ElementRenderer
    const renderElement = (element, index, parentElement = null, depth = 0) => {
      const isContainer = canHaveChildren(element.type);
      const isDragOver = dragOverElementId === element.id;
      const children = element.children || [];

      const siblings = parentElement ? parentElement.children || [] : elements;
      const canMoveUp = index > 0;
      const canMoveDown = index < siblings.length - 1;

      return (
        <div
          key={element.id}
          className={`element-wrapper ${
            isContainer ? "container-element" : ""
          } ${isDragOver ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
          style={{
            position: "relative",
            width: "100%",
            boxSizing: "border-box",
          }}
          onDragOver={(e) => {
            if (isContainer) {
              e.preventDefault();
              e.stopPropagation();
              handleDragOver(e, element.id);
            }
          }}
          onDragLeave={(e) => {
            if (isContainer) {
              e.stopPropagation();
              handleDragLeave(e, element.id);
            }
          }}
          onDrop={(e) => {
            if (isContainer) {
              e.preventDefault();
              e.stopPropagation();
              handleDrop(e, element.id);
            }
          }}
        >
          <ElementRenderer
            element={{
              ...element,
              styles: {
                ...element.styles,
                fontFamily:
                  element.styles?.fontFamily ||
                  globalSettings.fontFamily ||
                  "Arial, sans-serif",
              },
            }}
            updateElement={handleUpdateElement}
            handleImageUpload={handleImageUpload}
            selected={
              activeView === "editor" && element.id === selectedElementId
            }
            activeView={activeView}
            setSelectedElementId={setSelectedElementId}
            globalSettings={globalSettings}
            deleteElement={() => handleDeleteNested(element.id)}
            duplicateElement={duplicateElement}
            onMoveUp={() => moveElementUp(element.id, parentElement)}
            onMoveDown={() => moveElementDown(element.id, parentElement)}
            canMoveUp={canMoveUp}
            selectedElementId={selectedElementId}
            canMoveDown={canMoveDown}
            isContainer={isContainer}
            depth={depth}
            parentElement={parentElement}
          >
            {isContainer && children.length > 0 && (
              <div
                className="nested-children"
                style={{
                  display: element.type === "grid" ? "grid" : "block",

                  gridTemplateColumns:
                    element.type === "grid"
                      ? element.styles?.gridTemplateColumns || "repeat(2, 1fr)"
                      : undefined,
                  gap:
                    element.type === "grid"
                      ? element.styles?.gap || "16px"
                      : undefined,
                  width: "100%",
                  boxSizing: "border-box",
                  position: "relative",
                }}
              >
                {children.map((child, childIndex) => (
                  <div
                    key={child.id}
                    style={{
                      width: "100%",
                      height: "auto",
                      position: "relative",
                      boxSizing: "border-box",
                    }}
                  >
                    {renderElement(child, childIndex, element, depth + 1)}
                  </div>
                ))}
              </div>
            )}

            {isContainer &&
              children.length === 0 &&
              activeView === "editor" && (
                <div className="empty-container text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded mt-2">
                  <Plus className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p>Drop elements here</p>
                  <p className="text-xs mt-1">This {element.type} is empty</p>
                </div>
              )}
          </ElementRenderer>
        </div>
      );
    };

    return (
      <div
        className="flex-1 overflow-y-auto p-6"
        style={{
          backgroundColor: globalSettings.backgroundColor || "#ffffff",
          backgroundImage:
            "radial-gradient(circle, rgba(255,0,200,0.4) 2px, transparent 1px)",
          backgroundSize: "20px 20px, 25px 25px",
          backgroundPosition: "0 0, 9px 9px",
        }}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e)}
        onClick={(e) => {
          const isOutsideCanvas = !e.target.closest(".newsletter-canvas");
          if (activeView === "editor" && isOutsideCanvas) {
            setSelectedElementId(null);
          }
        }}
      >
        <div
          ref={ref}
          className={`newsletter-canvas mx-auto ${
            activeView === "editor" ? "shadow-lg" : ""
          } 
      ${activeView === "preview" ? "export-preview" : ""}`}
          style={{
            maxWidth: globalSettings.maxWidth,
            minHeight: globalSettings.minHeight || "800px",
            backgroundColor: globalSettings.newsletterColor,
            padding: activeView === "preview" ? "0" : "0px",
            margin: "auto",
            position: "relative",
            fontFamily: globalSettings.fontFamily || "Arial, sans-serif",
            overflow: "visible",
            boxSizing: "border-box",
          }}
        >
          {elements.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <p>
                Add elements from the sidebar to start building your newsletter
              </p>
              <p className="text-sm mt-2">
                Use containers (Grid, Item, Section) to create nested structures
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Drop elements into containers to build email-safe layouts
              </p>
            </div>
          ) : (
            <div
              className="elements-container"
              style={{
                display: "block",
                width: "100%",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              {elements.map((element, index) =>
                renderElement(element, index, null, 0)
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

EditorCanvas.displayName = "EditorCanvas";

export default EditorCanvas;
