// ElementRenderer.jsx - Email-Safe Version with No Default Padding/Margin on Containers

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaWeixin,
  FaSnapchat,
  FaReddit,
  FaLinkedin,
  FaPinterest,
  FaDiscord,
  FaQuora,
} from "react-icons/fa";
import { FaXTwitter, FaThreads } from "react-icons/fa6";
import { Globe, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";

// ============================================
// HELPER FUNCTIONS
// ============================================

// Browser check helper
const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

// Container types that can hold children
const CONTAINER_TYPES = ["section", "grid", "item", "column", "row"];

const canHaveChildren = (elementType) => {
  return CONTAINER_TYPES.includes(elementType);
};

// Icon component helper
const getIconComponent = (platform) => {
  switch (platform.toLowerCase()) {
    case "facebook":
      return <FaFacebook className="w-6 h-6" />;
    case "youtube":
      return <FaYoutube className="w-6 h-6" />;
    case "instagram":
      return <FaInstagram className="w-6 h-6" />;
    case "tiktok":
      return <FaTiktok className="w-6 h-6" />;
    case "whatsapp":
      return <FaWhatsapp className="w-6 h-6" />;
    case "telegram":
      return <FaTelegram className="w-6 h-6" />;
    case "wechat":
    case "douyin":
      return <FaWeixin className="w-6 h-6" />;
    case "x":
    case "twitter":
      return <FaXTwitter className="w-6 h-6" />;
    case "snapchat":
      return <FaSnapchat className="w-6 h-6" />;
    case "reddit":
      return <FaReddit className="w-6 h-6" />;
    case "linkedin":
      return <FaLinkedin className="w-6 h-6" />;
    case "pinterest":
      return <FaPinterest className="w-6 h-6" />;
    case "threads":
      return <FaThreads className="w-6 h-6" />;
    case "discord":
      return <FaDiscord className="w-6 h-6" />;
    case "quora":
      return <FaQuora className="w-6 h-6" />;
    default:
      return <Globe className="w-6 h-6" />;
  }
};

// Text alignment consistency helper
const getConsistentTextAlign = (textAlign) => {
  const alignMap = {
    left: "left",
    center: "center",
    right: "right",
    justify: "justify",
    start: "left",
    end: "right",
  };
  return alignMap[textAlign] || "left";
};

// Weight normalization for consistent font rendering
const normalizeWeight = (weight) => {
  if (!weight) return 400;
  if (typeof weight === "string") {
    if (weight === "normal") return 400;
    if (weight === "bold") return 700;
    const parsed = parseInt(weight);
    return isNaN(parsed) ? 400 : parsed;
  }
  return weight;
};

// Border styles helper - email safe
const getBorderStyles = (styles) => {
  if (styles.borderWidth && styles.borderColor) {
    const style = styles.borderStyle || "solid";
    return `${styles.borderWidth} ${style} ${styles.borderColor}`;
  }
  return styles.border || "none";
};

// Helper to build spacing from individual properties
const buildSpacing = (styles, property) => {
  const top = styles[`${property}Top`];
  const right = styles[`${property}Right`];
  const bottom = styles[`${property}Bottom`];
  const left = styles[`${property}Left`];

  if (top || right || bottom || left) {
    return `${top || "0"} ${right || "0"} ${bottom || "0"} ${left || "0"}`;
  }
  return undefined;
};

// Build per-corner radius string
const composeCornerRadius = (styles) => {
  const tl = styles?.borderTopLeftRadius;
  const tr = styles?.borderTopRightRadius;
  const br = styles?.borderBottomRightRadius;
  const bl = styles?.borderBottomLeftRadius;

  const anyCorner = tl || tr || br || bl;
  if (anyCorner) {
    return `${tl || "0"} ${tr || "0"} ${br || "0"} ${bl || "0"}`;
  }
  return styles?.borderRadius;
};

// Return the final radius for shapes
const getShapeBorderRadius = (shapeType, styles) => {
  switch ((shapeType || "rectangle").toLowerCase()) {
    case "circle":
    case "oval":
      return "50%";
    case "rounded-rectangle":
      return composeCornerRadius(styles) || "12px";
    case "rectangle":
      return composeCornerRadius(styles) || "0";
    case "trapezoid":
    case "star":
    default:
      return "0";
  }
};

// Only use polygon clip-path for polygon shapes
const getShapeClipPath = (shapeType) => {
  switch ((shapeType || "rectangle").toLowerCase()) {
    case "trapezoid":
      return "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)";
    case "star":
      return "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
    default:
      return "none";
  }
};

// Guard to decide if a shape is polygonal
const isPolygonShape = (shapeType) => {
  const t = (shapeType || "rectangle").toLowerCase();
  return t === "trapezoid" || t === "star";
};

// Get pixel dimension from value
const getPixelDimension = (value, fallback) => {
  if (!value) return fallback;
  const parsed = parseInt(value);
  return isNaN(parsed) ? fallback : parsed;
};

// Enhanced stripLayoutTransforms for export
const stripLayoutTransforms = (node, preserveImageRotation = false) => {
  if (node && node.style) {
    if (!preserveImageRotation) {
      node.style.transform = "none";
      node.style.transformOrigin = "top left";
    }
    node.style.rotate = "";
    node.style.scale = "";
    node.style.translate = "";
    node.style.webkitTransform = preserveImageRotation
      ? node.style.transform
      : "none";
    node.style.msTransform = preserveImageRotation
      ? node.style.transform
      : "none";

    // Ensure consistent text rendering
    node.style.textRendering = "geometricPrecision";
    node.style.webkitFontSmoothing = "antialiased";
    node.style.mozOsxFontSmoothing = "grayscale";

    if (
      node.tagName === "DIV" ||
      node.tagName === "H1" ||
      node.tagName === "H2" ||
      node.tagName === "H3" ||
      node.tagName === "P"
    ) {
      node.style.lineHeight = node.style.lineHeight || "normal";
      node.style.verticalAlign = "baseline";
    }
  }
};

// Enhanced font loading
const ensureFontsLoaded = async () => {
  const id = "export-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?" +
      "family=Inter:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&" +
      "family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&" +
      "family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&" +
      "family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&" +
      "display=swap";
    document.head.appendChild(link);
    await new Promise((r) => setTimeout(r, 1500));
  }

  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.warn("Font loading timeout:", e);
    }
  }
};

// ============================================
// EXPORT ELEMENT CREATION
// ============================================

const createExportElement = (element, globalSettings, isNested = false) => {
  const { id, type, content, styles, link, icons, children } = element;

  const div = document.createElement("div");
  div.style.position = "relative";
  div.style.width = "100%";
  div.style.boxSizing = "border-box";
  div.style.display = "block";

  switch (type) {
    case "section": {
      const section = document.createElement("div");
      section.style.cssText = `
        position: relative;
        width: 100%;
        background-color: ${styles?.backgroundColor || "transparent"};
        border: ${getBorderStyles(styles) || "none"};
        border-radius: ${composeCornerRadius(styles) || "0"};
        padding: ${buildSpacing(styles, "padding") || "0"};
        margin: ${buildSpacing(styles, "margin") || "0"};
        box-shadow: ${styles?.boxShadow || "none"};
        display: block;
        box-sizing: border-box;
      `;
      if (children && children.length) {
        children.forEach((child) => {
          const childElem = createExportElement(child, globalSettings, true);
          if (childElem) {
            section.appendChild(childElem);
          }
        });
      }
      stripLayoutTransforms(section);
      return section;
    }

    case "grid": {
      const grid = document.createElement("div");
      grid.style.cssText = `
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: ${
          styles?.gridTemplateColumns || "repeat(2, 1fr)"
        };
        gap: ${styles?.gap || "0"};
        background-color: ${styles?.backgroundColor || "transparent"};
        border: ${getBorderStyles(styles) || "none"};
        padding: ${buildSpacing(styles, "padding") || "0"};
        margin: ${buildSpacing(styles, "margin") || "0"};
        box-sizing: border-box;
      `;
      if (children && children.length) {
        children.forEach((child) => {
          const childElem = createExportElement(child, globalSettings, true);
          if (childElem) {
            childElem.style.width = "100%";
            childElem.style.height = "auto";
            childElem.style.boxSizing = "border-box";
            grid.appendChild(childElem);
          }
        });
      }
      stripLayoutTransforms(grid);
      return grid;
    }

    case "item": {
      const item = document.createElement("div");
      item.style.cssText = `
        position: relative;
        width: 100%;
        background-color: ${styles?.backgroundColor || "transparent"};
        border: ${getBorderStyles(styles) || "none"};
        padding: ${buildSpacing(styles, "padding") || "0"};
        border-radius: ${composeCornerRadius(styles) || "0"};
        margin: ${buildSpacing(styles, "margin") || "0"};
        box-sizing: border-box;
        display: block;
      `;
      if (children && children.length) {
        children.forEach((child) => {
          const childElem = createExportElement(child, globalSettings, true);
          if (childElem) {
            item.appendChild(childElem);
          }
        });
      }
      stripLayoutTransforms(item);
      return item;
    }

    case "column": {
      const column = document.createElement("div");
      column.style.cssText = `
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: ${styles?.gap || "0"};
        background-color: ${styles?.backgroundColor || "transparent"};
        border: ${getBorderStyles(styles) || "none"};
        padding: ${buildSpacing(styles, "padding") || "0"};
        margin: ${buildSpacing(styles, "margin") || "0"};
        box-sizing: border-box;
      `;
      if (children && children.length) {
        children.forEach((child) => {
          const childElem = createExportElement(child, globalSettings, true);
          if (childElem) {
            column.appendChild(childElem);
          }
        });
      }
      stripLayoutTransforms(column);
      return column;
    }

    case "shape": {
      const shapeType = styles?.shapeType || "rectangle";
      const shapeWidth = parseInt(styles?.width) || 200;
      const shapeHeight = parseInt(styles?.height) || 200;

      const isPoly = isPolygonShape(shapeType);
      const shapeRadius = getShapeBorderRadius(shapeType, styles);
      const shapeClip = getShapeClipPath(shapeType);

      const getFillStyle = () => {
        const fillType = styles?.fillType || "solid";
        switch (fillType) {
          case "linear":
            return `linear-gradient(${styles?.gradientDirection || "0deg"}, ${
              styles?.gradientStartColor || "#3b82f6"
            }, ${styles?.gradientEndColor || "#1e40af"})`;
          case "radial":
            return `radial-gradient(circle, ${
              styles?.gradientStartColor || "#3b82f6"
            }, ${styles?.gradientEndColor || "#1e40af"})`;
          case "none":
            return "transparent";
          default:
            return styles?.backgroundColor || "#3b82f6";
        }
      };

      const shapeDiv = document.createElement("div");
      shapeDiv.style.cssText = `
        width: ${shapeWidth}px;
        height: ${shapeHeight}px;
        background: ${getFillStyle()};
        ${isPoly ? "clip-path:" + shapeClip + ";" : "clip-path:none;"}
        ${
          isPoly
            ? "-webkit-clip-path:" + shapeClip + ";"
            : "-webkit-clip-path:none;"
        }
        ${!isPoly ? "border-radius:" + shapeRadius + ";" : "border-radius:0;"}
        border: ${getBorderStyles(styles)};
        box-shadow: ${styles?.boxShadow || "none"};
        opacity: ${styles?.opacity || "1"};
        box-sizing: border-box;
        margin: 0 auto;
      `;

      stripLayoutTransforms(shapeDiv);
      div.appendChild(shapeDiv);
      break;
    }

    case "text": {
      const textNode = document.createElement("div");
      textNode.textContent = element.content || "Text content";
      const textWeight = normalizeWeight(styles?.fontWeight);
      textNode.style.cssText = `
        margin: ${buildSpacing(styles, "margin") || "0"};
        padding: ${buildSpacing(styles, "padding") || "0"};
        font-size: ${styles?.fontSize || "16px"};
        font-weight: ${textWeight};
        font-variation-settings: "wght" ${textWeight};
        font-style: ${styles?.fontStyle || "normal"};
        text-decoration: ${styles?.textDecoration || "none"};
        color: ${styles?.color || "#333333"};
        line-height: ${styles?.lineHeight || "1.6"};
        text-align: ${getConsistentTextAlign(styles?.textAlign || "left")};
        text-shadow: ${styles?.textShadow || "none"};
        letter-spacing: ${styles?.letterSpacing || "normal"};
        word-spacing: ${styles?.wordSpacing || "normal"};
        text-indent: ${styles?.textIndent || "0"};
        text-transform: ${styles?.textTransform || "none"};
        background-color: ${styles?.backgroundColor || "transparent"};
        border-radius: ${composeCornerRadius(styles) || "0"};
        border: ${getBorderStyles(styles)};
        box-shadow: ${styles?.boxShadow || "none"};
        vertical-align: baseline;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: break-word;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-family: ${
          styles?.fontFamily ||
          globalSettings?.fontFamily ||
          "Arial, sans-serif"
        };
        opacity: ${styles?.opacity || "1"};
        width: 100%;
        box-sizing: border-box;
      `;

      stripLayoutTransforms(textNode);
      div.appendChild(textNode);
      break;
    }

    case "header": {
      const headerNode = document.createElement("h2");
      headerNode.textContent = element.content || "Header";
      const headerWeight = normalizeWeight(styles?.fontWeight);
      headerNode.style.cssText = `
        margin: ${buildSpacing(styles, "margin") || "0"};
        padding: ${buildSpacing(styles, "padding") || "0"};
        font-size: ${styles?.fontSize || "28px"};
        font-weight: ${headerWeight};
        font-variation-settings: "wght" ${headerWeight};
        font-style: ${styles?.fontStyle || "normal"};
        text-decoration: ${styles?.textDecoration || "none"};
        color: ${styles?.color || "#1a1a1a"};
        line-height: ${styles?.lineHeight || "1.4"};
        text-align: ${getConsistentTextAlign(styles?.textAlign || "left")};
        text-shadow: ${styles?.textShadow || "none"};
        letter-spacing: ${styles?.letterSpacing || "normal"};
        word-spacing: ${styles?.wordSpacing || "normal"};
        text-indent: ${styles?.textIndent || "0"};
        text-transform: ${styles?.textTransform || "none"};
        background-color: ${styles?.backgroundColor || "transparent"};
        border-radius: ${composeCornerRadius(styles) || "0"};
        border: ${getBorderStyles(styles)};
        box-shadow: ${styles?.boxShadow || "none"};
        vertical-align: baseline;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: break-word;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-family: ${
          styles?.fontFamily ||
          globalSettings?.fontFamily ||
          "Arial, sans-serif"
        };
        opacity: ${styles?.opacity || "1"};
        width: 100%;
        box-sizing: border-box;
      `;

      stripLayoutTransforms(headerNode);
      div.appendChild(headerNode);
      break;
    }

    case "image": {
      const imageSrc = element.content;
      const shapeType = styles?.shapeType || "rectangle";
      const isPoly = isPolygonShape(shapeType);
      const imgRadius = getShapeBorderRadius(shapeType, styles);
      const imgClip = getShapeClipPath(shapeType);

      // ✅ NEW: Use cropped dimensions if available
      const hasCropData =
        element.cropData && element.cropData.width && element.cropData.height;
      const containerWidth = hasCropData
        ? element.cropData.width
        : parseInt(styles?.width) || 600;
      const containerHeight = hasCropData
        ? element.cropData.height
        : parseInt(styles?.height) || 400;

      const container = document.createElement("div");
      const img = document.createElement("img");

      container.style.cssText = `
    position: relative;
    display: block;
    width: 100%;
    max-width: ${containerWidth}px;
    ${hasCropData ? `height: ${containerHeight}px;` : "height: auto;"}
    margin: ${buildSpacing(styles, "margin") || "0"};
    overflow: hidden;
    border: ${getBorderStyles(styles) || "none"};
    border-radius: ${isPoly ? "0" : imgRadius};
    box-shadow: ${styles?.boxShadow || "none"};
    background-color: ${styles?.backgroundColor || "transparent"};
    opacity: ${styles?.opacity || 1};
    box-sizing: border-box;
    ${isPoly ? `clip-path: ${imgClip};` : ""}
    ${isPoly ? `-webkit-clip-path: ${imgClip};` : ""}
  `;

      img.src = imageSrc;
      img.alt = element.altText || "Image";
      img.style.cssText = `
    width: 100%;
    height: 100%;
    display: block;
    object-fit: ${styles?.objectFit || "cover"};
    border-radius: inherit;
    box-sizing: border-box;
  `;

      container.appendChild(img);

      // ✅ NEW: Add crop data attribute for reference
      if (hasCropData) {
        img.dataset.crop = JSON.stringify(element.cropData);
      }

      if (element.link && element.link.trim()) {
        const linkEl = document.createElement("a");
        linkEl.href = element.link;
        linkEl.target = "_blank";
        linkEl.style.cssText = "display: block; text-decoration: none;";
        linkEl.appendChild(container);
        div.appendChild(linkEl);
      } else {
        div.appendChild(container);
      }
      break;
    }

    case "button": {
      const buttonContainer = document.createElement("div");
      buttonContainer.style.cssText = `
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: ${
          styles?.textAlign === "left" || !styles?.textAlign
            ? "flex-start"
            : styles?.textAlign === "right"
            ? "flex-end"
            : "center"
        };
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      `;

      const button = document.createElement("a");
      button.href = link || "#";
      button.textContent = content || "Button";
      button.style.cssText = `
        padding: ${buildSpacing(styles, "padding") || "12px 24px"};
        display: inline-block;
        text-align: center;
        border-radius: ${composeCornerRadius(styles) || "6px"};
        background-color: ${styles?.backgroundColor || "#007bff"};
        color: ${styles?.color || "#fff"};
        border: ${getBorderStyles(styles)};
        font-size: ${styles?.fontSize || "16px"};
        font-weight: ${normalizeWeight(styles?.fontWeight) || "400"};
        font-style: ${styles?.fontStyle || "normal"};
        font-family: ${
          styles?.fontFamily ||
          globalSettings?.fontFamily ||
          "Arial, sans-serif"
        };
        box-shadow: ${styles?.boxShadow || "none"};
        opacity: ${styles?.opacity || "1"};
        text-decoration: none;
        box-sizing: border-box;
      `;

      stripLayoutTransforms(button);
      buttonContainer.appendChild(button);
      div.appendChild(buttonContainer);
      break;
    }

    case "divider": {
      const dividerContainer = document.createElement("div");
      dividerContainer.style.cssText = `
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: ${
      styles?.textAlign === "left"
        ? "flex-start"
        : styles?.textAlign === "right"
        ? "flex-end"
        : "center"
    };
    padding: ${buildSpacing(styles, "padding") || "0"};
    margin: ${buildSpacing(styles, "margin") || "0"};
    background-color: ${styles?.backgroundColor || "transparent"};
    box-sizing: border-box;
    position: relative;
    gap: 12px;
  `;

      // ✅ UPDATED: Use height-based approach instead of border
      const borderWidth =
        parseInt(styles?.borderBottomWidth || styles?.borderWidth || "2px") ||
        2;
      const borderColor = styles?.borderColor || "#d1d5db";

      const line = document.createElement("div");
      line.style.cssText = `
    flex: 1;
    height: ${borderWidth}px;
    background-color: ${borderColor};
    box-sizing: border-box;
  `;

      stripLayoutTransforms(dividerContainer);
      dividerContainer.appendChild(line);

      // Support optional divider text/label
      if (content) {
        const text = document.createElement("span");
        text.textContent = content;
        text.style.cssText = `
      display: inline-block;
      white-space: nowrap;
      padding: 0 12px;
      background-color: ${globalSettings?.newsletterColor || "white"};
      font-size: ${styles?.fontSize || "14px"};
      color: ${styles?.color || "#666"};
      font-family: ${
        styles?.fontFamily || globalSettings?.fontFamily || "Arial, sans-serif"
      };
    `;
        dividerContainer.appendChild(text);
      }

      div.appendChild(dividerContainer);
      break;
    }

    case "social": {
      const socialContainer = document.createElement("div");
      socialContainer.style.cssText = `
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: ${
          styles?.textAlign === "left"
            ? "flex-start"
            : styles?.textAlign === "right"
            ? "flex-end"
            : "center"
        };
        padding: ${buildSpacing(styles, "padding") || "0"};
        margin: ${buildSpacing(styles, "margin") || "0"};
        background-color: ${styles?.backgroundColor || "transparent"};
        border-radius: ${composeCornerRadius(styles) || "0"};
        border: ${getBorderStyles(styles)};
        box-shadow: ${styles?.boxShadow || "none"};
        box-sizing: border-box;
      `;

      const iconsContainer = document.createElement("div");
      iconsContainer.style.cssText = `
        display: flex;
        gap: ${styles?.gap || "12px"};
      `;

      if (icons && icons.length > 0) {
        icons.forEach((icon) => {
          const linkEl = document.createElement("a");
          linkEl.href = icon.url || "#";
          linkEl.style.cssText = `
            color: ${styles?.iconColor || styles?.color || "#666"};
            text-decoration: none;
            display: inline-block;
            font-size: 24px;
            line-height: 1;
          `;
          linkEl.textContent = "●";
          iconsContainer.appendChild(linkEl);
        });
      }

      stripLayoutTransforms(socialContainer);
      socialContainer.appendChild(iconsContainer);
      div.appendChild(socialContainer);
      break;
    }

    default:
      const unknown = document.createElement("div");
      unknown.textContent = `Unknown element: ${type}`;
      unknown.style.cssText = `
        color: #999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      `;
      stripLayoutTransforms(unknown);
      div.appendChild(unknown);
      break;
  }

  return div;
};

// ============================================
// EDITABLE WRAPPER COMPONENT
// ============================================

const EditableWrapper = ({
  element,
  isEditable,
  tooltip,
  children,
  onDoubleClick,
}) => (
  <div
    data-element-id={element.id}
    tabIndex={isEditable ? 0 : -1}
    onDoubleClick={onDoubleClick}
    className={
      isEditable
        ? "relative outline-none group cursor-pointer"
        : "relative outline-none"
    }
  >
    {isEditable && (
      <div className="pointer-events-none absolute -inset-0.5 rounded-md opacity-0 transition-opacity duration-150 group-hover:opacity-100 ring-2 ring-blue-500/80 ring-offset-2 ring-offset-blue-200/40" />
    )}
    {children}
    {isEditable && tooltip && (
      <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-full bg-gray-900/90 text-white text-[11px] leading-none px-2.5 py-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap">
        {tooltip}
      </span>
    )}
  </div>
);

// ============================================
// ORDER-BASED ELEMENT WRAPPER
// ============================================

// ============================================
// ORDER-BASED ELEMENT WRAPPER
// ============================================

const OrderBasedElementWrapper = ({
  children,
  element,
  updateElement,
  selected,
  onSelect,
  activeView,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  setSelectedElementId,
}) => {
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [handleType, setHandleType] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  // ✅ Extract width/height for dependencies
  const elementWidth = useMemo(
    () => element.styles?.width,
    [element.styles?.width]
  );
  const elementHeight = useMemo(
    () => element.styles?.height,
    [element.styles?.height]
  );

  // ✅ Force re-render when dimensions change
  useEffect(() => {
    if (selected && activeView === "editor") {
      setRenderKey((prev) => prev + 1);
    }
  }, [elementWidth, elementHeight, selected, activeView]);

  const onMouseDown = (e, type) => {
    if (activeView !== "editor") return;

    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setHandleType(type);
    setStartPos({ x: e.clientX, y: e.clientY });

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setStartSize({
        width: rect.width,
        height: rect.height,
      });
    }
  };

  // ✅ CRITICAL FIX: Both width AND height calculations for all handle types
  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing || !containerRef.current || activeView !== "editor")
        return;

      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;

      let newWidth = startSize.width;
      let newHeight = startSize.height;

      switch (handleType) {
        case "right":
          // ✅ RIGHT HANDLE: Only width changes
          newWidth = Math.max(50, startSize.width + dx);
          newHeight = startSize.height; // Keep original height
          break;
        case "bottom":
          // ✅ BOTTOM HANDLE: Only height changes
          newWidth = startSize.width; // Keep original width
          newHeight = Math.max(30, startSize.height + dy);
          break;
        case "bottom-right":
          // ✅ CORNER HANDLE: Both width and height change
          newWidth = Math.max(50, startSize.width + dx);
          newHeight = Math.max(30, startSize.height + dy);
          break;
        default:
          break;
      }

      // ✅ Update BOTH width and height every time
      updateElement(element.id, {
        styles: {
          ...element.styles,
          width: `${Math.round(newWidth)}px`,
          height: `${Math.round(newHeight)}px`,
        },
      });
    },
    [
      isResizing,
      activeView,
      startPos,
      startSize,
      handleType,
      element.id,
      element.styles,
      updateElement,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setHandleType(null);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      key={renderKey}
      ref={containerRef}
      className={`${
        selected && activeView === "editor"
          ? "ring-2 ring-blue-500 ring-offset-1"
          : ""
      }`}
      style={{
        position: "relative",
        width: "100%",
        touchAction: "none",
      }}
      onClick={(e) => {
        if (activeView === "editor") {
          e.stopPropagation();
          if (onSelect) onSelect();
          else if (setSelectedElementId) setSelectedElementId(element.id);
        }
      }}
    >
      {children}

      {/* Move Up Button */}
      {selected && activeView === "editor" && canMoveUp && (
        <button
          onClick={onMoveUp}
          className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded cursor-pointer z-20 flex items-center justify-center text-white shadow-lg transition-colors"
          style={{
            top: "-38px",
            pointerEvents: "auto",
          }}
          title="Move up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Move Down Button */}
      {selected && activeView === "editor" && canMoveDown && (
        <button
          onClick={onMoveDown}
          className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded cursor-pointer z-20 flex items-center justify-center text-white shadow-lg transition-colors"
          style={{
            bottom: "-38px",
            pointerEvents: "auto",
          }}
          title="Move down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {/* ✅ RESIZE HANDLES - Fixed positioning that follows container */}
      {selected && activeView === "editor" && element.type !== "divider" && (
        <>
          {/* Bottom-Right Corner - BOTH width & height */}
          <div
            onMouseDown={(e) => onMouseDown(e, "bottom-right")}
            style={{
              position: "absolute",
              bottom: "-6px",
              right: "-6px",
              width: "12px",
              height: "12px",
              backgroundColor: "#3b82f6",
              border: "2px solid white",
              borderRadius: "2px",
              cursor: "nwse-resize",
              zIndex: 20,
              userSelect: "none",
              pointerEvents: "auto",
              boxShadow: "0 0 6px rgba(0,0,0,0.3)",
            }}
            className="hover:bg-blue-600 active:bg-blue-700 transition-colors"
            title="Resize (drag corner)"
          />

          {/* Right Edge - WIDTH ONLY */}
          <div
            onMouseDown={(e) => onMouseDown(e, "right")}
            style={{
              position: "absolute",
              top: "50%",
              right: "-6px",
              width: "12px",
              height: "12px",
              backgroundColor: "#3b82f6",
              border: "2px solid white",
              borderRadius: "2px",
              cursor: "ew-resize",
              zIndex: 20,
              userSelect: "none",
              pointerEvents: "auto",
              transform: "translateY(-50%)",
              boxShadow: "0 0 6px rgba(0,0,0,0.3)",
            }}
            className="hover:bg-blue-600 active:bg-blue-700 transition-colors"
            title="Resize width (drag side)"
          />

          {/* Bottom Edge - HEIGHT ONLY */}
          <div
            onMouseDown={(e) => onMouseDown(e, "bottom")}
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "50%",
              width: "12px",
              height: "12px",
              backgroundColor: "#3b82f6",
              border: "2px solid white",
              borderRadius: "2px",
              cursor: "ns-resize",
              zIndex: 20,
              userSelect: "none",
              pointerEvents: "auto",
              transform: "translateX(-50%)",
              boxShadow: "0 0 6px rgba(0,0,0,0.3)",
            }}
            className="hover:bg-blue-600 active:bg-blue-700 transition-colors"
            title="Resize height (drag bottom)"
          />
        </>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ElementRenderer({
  element,
  updateElement,
  handleImageUpload,
  selected,
  activeView,
  setSelectedElementId,
  globalSettings,
  onMoveUp,
  onMoveDown,
  selectedElementId,
  canMoveUp,
  canMoveDown,
  onChildMoveUp,
  onChildMoveDown,
  parentId,
  isContainer,
  depth = 0,
  parentElement,
  children,
}) {
  const fileInputRef = useRef(null);
  const { id, type, content, styles, link, icons } = element;
  const elementChildren = element.children || [];

  const editorHelpers = activeView === "editor" ? "editor-border" : "";
  const isEditable = activeView === "editor";
  const isContainerType = canHaveChildren(type);

  const getCompleteStyles = (elementStyles) => {
    const baseStyles = { ...elementStyles };

    if (elementStyles?.borderWidth && elementStyles?.borderColor) {
      baseStyles.border = `${elementStyles.borderWidth} solid ${elementStyles.borderColor}`;
    }

    return {
      backgroundColor: baseStyles.backgroundColor,
      color: baseStyles.color,
      borderRadius: baseStyles.borderRadius,
      border: baseStyles.border,
      borderWidth: baseStyles.borderWidth,
      borderColor: baseStyles.borderColor,
      borderStyle: baseStyles.borderStyle,
      padding: baseStyles.padding,
      margin: baseStyles.margin,
      fontSize: baseStyles.fontSize,
      fontWeight: baseStyles.fontWeight,
      fontStyle: baseStyles.fontStyle,
      textDecoration: baseStyles.textDecoration,
      textShadow: baseStyles.textShadow,
      textAlign: baseStyles.textAlign,
      boxShadow: baseStyles.boxShadow,
      opacity: baseStyles.opacity,
      ...baseStyles,
    };
  };

  const contentStyles = getCompleteStyles({
    ...styles,
    position: undefined,
    left: undefined,
    top: undefined,
  });

  const renderContent = () => {
    // CONTAINER TYPES
    if (isContainerType) {
      let containerStyle = {
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
      };

      switch (type) {
        case "section":
          containerStyle = {
            ...containerStyle,
            backgroundColor: styles?.backgroundColor,
            border: getBorderStyles(styles),
            borderRadius: composeCornerRadius(styles),
            padding: buildSpacing(styles, "padding"),
            margin: buildSpacing(styles, "margin"),
            boxShadow: styles?.boxShadow,
          };
          break;

        case "grid":
          containerStyle = {
            gridTemplateColumns: element.styles?.gridTemplateColumns,
            gap: element.styles?.gap,
            backgroundColor: element.styles?.backgroundColor,
            border:
              element.styles?.borderWidth &&
              element.styles?.borderStyle &&
              element.styles?.borderColor
                ? `${element.styles.borderWidth} ${element.styles.borderStyle} ${element.styles.borderColor}`
                : undefined,
            padding: buildSpacing(element.styles, "padding"),
            borderRadius: composeCornerRadius(element.styles),
            margin: buildSpacing(element.styles, "margin"),
            width: "100%",
            boxSizing: "border-box",
            justifyContent: "start",
            justifyItems: "start",
            alignItems: "start",
            justifySelf: "start",
          };
          break;

        case "item":
          containerStyle = {
            ...containerStyle,
            backgroundColor: styles?.backgroundColor,
            border: getBorderStyles(styles),
            padding: buildSpacing(styles, "padding"),
            borderRadius: composeCornerRadius(styles),
            margin: buildSpacing(styles, "margin"),
          };
          break;

        case "column":
          containerStyle = {
            ...containerStyle,
            display: "flex",
            flexDirection: "column",
            gap: styles?.gap,
            backgroundColor: styles?.backgroundColor,
            border: getBorderStyles(styles),
            padding: buildSpacing(styles, "padding"),
            borderRadius: composeCornerRadius(styles),
            margin: buildSpacing(styles, "margin"),
          };
          break;
      }

      return (
        <div style={containerStyle}>
          {children || (
            <>
              {elementChildren.length > 0 ? (
                <div className="nested-children">
                  {elementChildren.map((child, index) => (
                    <ElementRenderer
                      key={child.id}
                      element={child}
                      updateElement={updateElement}
                      handleImageUpload={handleImageUpload}
                      selectedElementId={selectedElementId}
                      activeView={activeView}
                      selected={selectedElementId === child.id}
                      setSelectedElementId={setSelectedElementId}
                      globalSettings={globalSettings}
                      onMoveUp={
                        onChildMoveUp
                          ? () => onChildMoveUp(child.id)
                          : undefined
                      }
                      onMoveDown={
                        onChildMoveDown
                          ? () => onChildMoveDown(child.id)
                          : undefined
                      }
                      canMoveUp={index > 0}
                      canMoveDown={index < elementChildren.length - 1}
                      parentId={id}
                      depth={depth + 1}
                    />
                  ))}
                </div>
              ) : (
                isEditable && (
                  <div className="empty-container text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded">
                    <Plus className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p>Drop elements here</p>
                    <p className="text-xs mt-1">This {type} is empty</p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      );
    }

    // NON-CONTAINER ELEMENTS
    switch (type) {
      case "shape": {
        const shapeType = styles?.shapeType || "rectangle";
        const isPoly = isPolygonShape(shapeType);
        const shapeRadius = getShapeBorderRadius(shapeType, styles);
        const shapeClip = getShapeClipPath(shapeType);

        const getFillStyle = () => {
          const fillType = styles?.fillType || "solid";

          switch (fillType) {
            case "linear":
              const direction = styles?.gradientDirection || "0deg";
              const startColor = styles?.gradientStartColor || "#3b82f6";
              const endColor = styles?.gradientEndColor || "#1e40af";
              return `linear-gradient(${direction}, ${startColor}, ${endColor})`;

            case "radial":
              const centerColor = styles?.gradientStartColor || "#3b82f6";
              const edgeColor = styles?.gradientEndColor || "#1e40af";
              return `radial-gradient(circle, ${centerColor}, ${edgeColor})`;

            case "none":
              return "transparent";

            default:
              return styles?.backgroundColor || "#3b82f6";
          }
        };

        const shapeWidth = parseInt(styles?.width) || 200;
        const shapeHeight = parseInt(styles?.height) || 200;

        return (
          <EditableWrapper
            element={element}
            isEditable={isEditable}
            tooltip="Click to edit shape"
          >
            <div
              className={`shape-element ${editorHelpers}`}
              style={{
                position: "relative",
                width: `${shapeWidth}px`,
                height: `${shapeHeight}px`,
                margin: "0 auto",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: getFillStyle(),
                  clipPath: isPoly ? shapeClip : "none",
                  WebkitClipPath: isPoly ? shapeClip : "none",
                  borderRadius: isPoly ? "0" : shapeRadius,
                  border: getBorderStyles(styles),
                  boxShadow: styles?.boxShadow,
                  opacity: styles?.opacity,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </EditableWrapper>
        );
      }

      case "text": {
        const textWidth = getPixelDimension(styles?.width, 100);
        const textHeight = getPixelDimension(styles?.height, 100);

        return (
          <EditableWrapper
            element={element}
            isEditable={isEditable}
            tooltip="Click to edit text"
          >
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              className={
                isEditable ? "outline-none cursor-text" : "outline-none"
              }
              style={{
                width: "100%",
                maxWidth: `${textWidth}px`,
                minHeight: `${textHeight}px`,
                margin: buildSpacing(styles, "margin"),
                backgroundColor: styles?.backgroundColor,
                color: styles?.color,
                borderRadius: composeCornerRadius(styles),
                border: getBorderStyles(styles),
                padding: buildSpacing(styles, "padding"),
                fontSize: styles?.fontSize,
                fontWeight: normalizeWeight(styles?.fontWeight),
                fontStyle: styles?.fontStyle,
                textDecoration: styles?.textDecoration,
                textShadow: styles?.textShadow,
                textAlign: getConsistentTextAlign(styles?.textAlign || "left"),
                boxShadow: styles?.boxShadow,
                lineHeight: styles?.lineHeight,
                letterSpacing: styles?.letterSpacing,
                wordSpacing: styles?.wordSpacing,
                textIndent: styles?.textIndent,
                textTransform: styles?.textTransform,
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                display: "block",
                boxSizing: "border-box",
                fontFamily:
                  styles?.fontFamily ||
                  globalSettings?.fontFamily ||
                  "Arial, sans-serif",
                opacity: styles?.opacity,
              }}
              onBlur={(e) => {
                if (isEditable) {
                  updateElement(id, { content: e.currentTarget.textContent });
                }
              }}
            >
              {content || (isEditable ? "Enter your text here..." : null)}
            </div>
          </EditableWrapper>
        );
      }

      case "header": {
        const headerWidth = getPixelDimension(styles?.width, 100);
        const headerHeight = getPixelDimension(styles?.height, 60);

        return (
          <EditableWrapper
            element={element}
            isEditable={isEditable}
            tooltip="Click to edit heading"
          >
            <h2
              contentEditable={isEditable}
              suppressContentEditableWarning
              className={
                isEditable ? "outline-none cursor-text" : "outline-none"
              }
              style={{
                width: "100%",
                maxWidth: `${headerWidth}px`,
                minHeight: `${headerHeight}px`,
                margin: buildSpacing(styles, "margin"),
                backgroundColor: styles?.backgroundColor,
                color: styles?.color,
                borderRadius: composeCornerRadius(styles),
                border: getBorderStyles(styles),
                padding: buildSpacing(styles, "padding"),
                fontSize: styles?.fontSize,
                fontWeight: normalizeWeight(styles?.fontWeight),
                fontStyle: styles?.fontStyle,
                textDecoration: styles?.textDecoration,
                textShadow: styles?.textShadow,
                textAlign: getConsistentTextAlign(styles?.textAlign || "left"),
                boxShadow: styles?.boxShadow,
                lineHeight: styles?.lineHeight,
                letterSpacing: styles?.letterSpacing,
                wordSpacing: styles?.wordSpacing,
                textIndent: styles?.textIndent,
                textTransform: styles?.textTransform,
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                display: "block",
                boxSizing: "border-box",
                fontFamily:
                  styles?.fontFamily ||
                  globalSettings?.fontFamily ||
                  "Arial, sans-serif",
                opacity: styles?.opacity,
              }}
              onBlur={(e) => {
                if (isEditable) {
                  updateElement(id, { content: e.currentTarget.textContent });
                }
              }}
            >
              {content || (isEditable ? "Header Text" : null)}
            </h2>
          </EditableWrapper>
        );
      }

      case "image": {
        const imageWidth = getPixelDimension(styles?.width, 600);
        const imageHeight = getPixelDimension(styles?.height, 400);
        const isImagePresent =
          content &&
          (content.startsWith("data:") || content.startsWith("http"));

        const onDblClick = () => {
          if (!isBrowser() || !isEditable) return;
          const ev = new CustomEvent("open-image-upload", {
            detail: { id },
          });
          window.dispatchEvent(ev);
        };

        const shapeType = styles?.shapeType || "rectangle";
        const isPoly = isPolygonShape(shapeType);
        const imgRadius = getShapeBorderRadius(shapeType, styles);
        const imgClip = getShapeClipPath(shapeType);

        // ✅ NEW: Get crop data if applied
        const hasCropData =
          element.cropData && element.cropData.width && element.cropData.height;
        const cropWidth = hasCropData ? element.cropData.width : imageWidth;
        const cropHeight = hasCropData ? element.cropData.height : imageHeight;

        return (
          <EditableWrapper
            element={element}
            isEditable={isEditable}
            tooltip="Double-click to change"
            onDoubleClick={onDblClick}
          >
            <div
              className={`image-element ${editorHelpers}`}
              style={{
                width: "100%",
                maxWidth: `${imageWidth}px`,
                height: `${imageHeight}px`,
                margin: buildSpacing(styles, "margin"),
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                backgroundColor: styles?.backgroundColor,
                border: getBorderStyles(styles),
                borderRadius: isPoly ? "0" : imgRadius,
                boxShadow: styles?.boxShadow,
                opacity: styles?.opacity,
                clipPath: isPoly ? imgClip : "none",
                WebkitClipPath: isPoly ? imgClip : "none",
                boxSizing: "border-box",
              }}
            >
              {isImagePresent ? (
                <>
                  <img
                    src={content}
                    alt="Newsletter"
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: styles?.objectFit || "cover",
                      display: "block",
                      borderRadius: "inherit",
                      boxSizing: "border-box",
                    }}
                  />

                  {/* ✅ NEW: Display crop indicator badge */}
                  {hasCropData && isEditable && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "600",
                        zIndex: 10,
                        pointerEvents: "none",
                      }}
                    >
                      ✓ Cropped
                    </div>
                  )}
                </>
              ) : isEditable ? (
                <div className="text-gray-500 text-center pointer-events-none">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>Double-click to add image</p>
                </div>
              ) : null}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(id, file);
                  }
                }}
              />
            </div>
          </EditableWrapper>
        );
      }

      case "button": {
        const buttonWidth = getPixelDimension(styles?.width, 200);
        const buttonHeight = getPixelDimension(styles?.height, 50);

        return (
          <EditableWrapper
            element={element}
            isEditable={isEditable}
            tooltip="Click to edit button text"
          >
            <div
              className={`button-container ${editorHelpers}`}
              style={{
                width: "100%",
                maxWidth: `${buttonWidth}px`,
                height: `${buttonHeight}px`,
                margin: buildSpacing(styles, "margin"),
                display: "flex",
                alignItems: "center",
                justifyContent:
                  contentStyles.textAlign === "left" || !contentStyles.textAlign
                    ? "flex-start"
                    : contentStyles.textAlign === "right"
                    ? "flex-end"
                    : "center",
                boxSizing: "border-box",
              }}
            >
              <a
                href={link || "#"}
                style={{
                  padding: buildSpacing(contentStyles, "padding"),
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  borderRadius: composeCornerRadius(contentStyles),
                  backgroundColor: contentStyles.backgroundColor,
                  color: contentStyles.color,
                  border: getBorderStyles(contentStyles),
                  fontSize: contentStyles.fontSize,
                  fontWeight: contentStyles.fontWeight,
                  fontStyle: contentStyles.fontStyle,
                  textShadow: contentStyles.textShadow,
                  fontFamily:
                    contentStyles.fontFamily ||
                    globalSettings?.fontFamily ||
                    "Arial, sans-serif",
                  boxShadow: contentStyles.boxShadow,
                  opacity: contentStyles.opacity,
                  cursor: activeView === "preview" ? "pointer" : "default",
                  width: "100%",
                  height: "100%",
                  boxSizing: "border-box",
                }}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (isEditable && updateElement) {
                    updateElement(id, { content: e.currentTarget.textContent });
                  }
                }}
                onClick={(e) => {
                  if (isEditable) {
                    e.preventDefault();
                  }
                }}
                target={activeView === "preview" ? "_blank" : "_self"}
                rel="noopener noreferrer"
              >
                {content || (isEditable ? "Button" : null)}
              </a>
            </div>
          </EditableWrapper>
        );
      }

      case "divider": {
        const dividerWidth = getPixelDimension(styles?.width, 100);

        return (
          <EditableWrapper
            element={element}
            isEditable={isEditable}
            tooltip="Divider element"
          >
            <div
              className={`divider-element ${editorHelpers}`}
              style={{
                width: "100%",
                maxWidth: `${dividerWidth}%`,
                height: "20px",
                margin: buildSpacing(styles, "margin"),
                display: "flex",
                alignItems: "center",
                justifyContent:
                  contentStyles.textAlign === "left"
                    ? "flex-start"
                    : contentStyles.textAlign === "right"
                    ? "flex-end"
                    : "center",
                position: "relative",
                padding: buildSpacing(contentStyles, "padding"),
                backgroundColor: contentStyles.backgroundColor,
              }}
            >
              <div
                style={{
                  width: "100%",
                  borderBottom: `${
                    styles?.borderBottomWidth || styles?.borderWidth || "2px"
                  } ${
                    styles?.borderBottomStyle || styles?.borderStyle || "solid"
                  } ${
                    styles?.borderColor || styles?.backgroundColor || "#d1d5db"
                  }`,
                  height: "1px",
                }}
              />
              {content && (
                <span
                  style={{
                    position: "absolute",
                    display: "inline-block",
                    padding: "0 12px",
                    backgroundColor: globalSettings?.newsletterColor || "white",
                    fontSize: contentStyles.fontSize,
                    color: contentStyles.color,
                  }}
                >
                  {content}
                </span>
              )}
            </div>
          </EditableWrapper>
        );
      }

      case "social": {
        const socialWidth = getPixelDimension(styles?.width, 300);
        const socialHeight = getPixelDimension(styles?.height, 60);

        return (
          <EditableWrapper
            element={element}
            isEditable={isEditable}
            tooltip="Social media icons"
          >
            <div
              className={`social-element ${editorHelpers}`}
              style={{
                width: "100%",
                maxWidth: `${socialWidth}px`,
                height: `${socialHeight}px`,
                margin: buildSpacing(styles, "margin"),
                display: "flex",
                alignItems: "center",
                justifyContent:
                  contentStyles.textAlign === "left"
                    ? "flex-start"
                    : contentStyles.textAlign === "right"
                    ? "flex-end"
                    : "center",
                padding: buildSpacing(contentStyles, "padding"),
                backgroundColor: contentStyles.backgroundColor,
                borderRadius: composeCornerRadius(contentStyles),
                border: contentStyles.border,
                boxShadow: contentStyles.boxShadow,
              }}
            >
              <div
                className="social-icons-container"
                style={{
                  display: "flex",
                  gap: styles?.gap || "12px",
                }}
              >
                {icons && icons.length > 0
                  ? icons.map((icon) => (
                      <a
                        key={icon.id}
                        href={icon.url || "#"}
                        target={activeView === "preview" ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        style={{
                          color:
                            styles?.iconColor || contentStyles.color || "#666",
                          textDecoration: "none",
                          display: "inline-block",
                          transition: "opacity 0.2s ease",
                        }}
                        className="social-icon hover:opacity-75"
                        onClick={(e) => isEditable && e.preventDefault()}
                      >
                        {getIconComponent(icon.platform)}
                      </a>
                    ))
                  : isEditable && (
                      <p className="text-gray-500 text-sm">
                        No social icons added. Use the sidebar to add them.
                      </p>
                    )}
              </div>
            </div>
          </EditableWrapper>
        );
      }

      default:
        return (
          <EditableWrapper
            element={element}
            isEditable={isEditable}
            tooltip="Unknown element"
          >
            <div className={`${editorHelpers}`} style={contentStyles}>
              <p className="text-gray-500">Unknown element type: {type}</p>
            </div>
          </EditableWrapper>
        );
    }
  };

  return (
    <OrderBasedElementWrapper
      element={element}
      updateElement={updateElement}
      handleImageUpload={handleImageUpload}
      selected={selected}
      onSelect={() => {
        if (activeView === "editor") {
          setSelectedElementId(element.id);
        }
      }}
      activeView={activeView}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      setSelectedElementId={setSelectedElementId}
      style={{
        width: parentElement && parentElement.type === "grid" ? "100%" : "auto",
        height:
          parentElement && parentElement.type === "grid" ? "100%" : "auto",
        boxSizing: "border-box",
      }}
    >
      {renderContent()}
    </OrderBasedElementWrapper>
  );
}

// ============================================
// EXPORTS
// ============================================

export {
  createExportElement,
  ensureFontsLoaded,
  stripLayoutTransforms,
  getConsistentTextAlign,
  normalizeWeight,
  getBorderStyles,
  buildSpacing,
  getShapeClipPath,
  getShapeBorderRadius,
  composeCornerRadius,
  isPolygonShape,
  canHaveChildren,
  CONTAINER_TYPES,
};
