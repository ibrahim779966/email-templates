// EmailNewsletterEditor.jsx;

import React, { useState, useRef, useEffect } from "react";
import {
  parseJsonEmailTemplate,
  exportElementsToJson,
} from "../api/utils/jsonTemplateParser";
import { useDispatch, useSelector } from "react-redux"; // ADD THIS
import EditorSidebar from "./EditorSidebar";
import EditorCanvas from "./EditorCanvas";
import { Code, X } from "lucide-react";
import { parseHTMLToNewsletterElements, validateHTML } from "./htmlParser";
import {
  MousePointer,
  Eye,
  Save,
  Send,
  Download,
  Share2,
  Edit2,
} from "lucide-react";
import domToImage from "dom-to-image-more";
import jsPDF from "jspdf";
import { exportToEmailHtml } from "./ExportToEmailHtml";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// ADD THESE REDUX IMPORTS:
import {
  setElements,
  addElement as addElementAction,
  updateElement as updateElementAction,
  deleteElement as deleteElementAction,
  duplicateElement as duplicateElementAction,
  setSelectedElementId,
  setGlobalSettings,
  setNewsletterName,
  setActiveView,
  saveNewsletter,
  loadTemplateIntoEditor,
  selectElements,
  selectSelectedElement,
  selectGlobalSettings,
  selectNewsletterName,
  selectIsDirty,
  selectSaving,
  setCurrentTemplateId,
} from "../redux/slices/editorSlice";

import { addNotification } from "../redux/slices/uiSlice";

// ✅ ADD THIS:
import { templateService } from "../api/services/templateService";
import { uploadImageToCloudinary } from "../api/utils/imageUtils";
import EmailPreviewPage from "./EmailPreviewPage";
import EmailPreviewUnified from "./EmailPreviewPage";

// Add LZ-String compression library dynamically
if (typeof window !== "undefined" && !window.LZString) {
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js";
  script.async = true;
  document.head.appendChild(script);
}

// Social SVG icons for proper rendering in exports
const SOCIAL_SVGS = {
  facebook:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763013812/templates/ycvjepnwrvnizjronfeb.png",
  twitter:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763013924/templates/b23ztquemmmuoqmaegzv.png",
  x: "https://res.cloudinary.com/dhlex64es/image/upload/v1763013986/templates/r3ahm2kjyb30ckmllzu0.png",
  instagram:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014004/templates/vjjw2ykchjhoxas0hngy.png",
  linkedin:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014026/templates/gob1gnrzqfviszy8frvr.png",
  youtube:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014048/templates/jqgvg4j6n3c6fltn1ntr.png",
  whatsapp:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014067/templates/jiwmzlo0i6bgxvzhwtea.png",
  telegram:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014084/templates/wpxstom0c0ujc5uavkwx.png",
  tiktok:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014146/templates/ios7eoewnxvyeowrsglc.png",
  snapchat:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014190/templates/nveuvcx8pimvmdzmfid2.png",
  reddit:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014213/templates/ivsiyzhvgpd2gk5uwhrz.png",
  pinterest:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014171/templates/ej8ayjgqnt8pzigfg85t.png",
  discord:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014234/templates/k3hnm7a133vwawp0vblo.png",
  threads:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014105/templates/fan0wl9fbigypjtosaqc.png",
  wechat:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014340/templates/zn1jabhgkfqtm9q4jczj.png",
  quora:
    "https://res.cloudinary.com/dhlex64es/image/upload/v1763014355/templates/qxl6sdqf2pehvixadiil.png",
};

const defaultIcons = [
  { id: 1, platform: "facebook", url: "https://facebook.com" },
  { id: 2, platform: "twitter", url: "https://twitter.com" },
  { id: 3, platform: "instagram", url: "https://instagram.com" },
  { id: 4, platform: "linkedin", url: "https://linkedin.com" },
];

// Link tracking for PDF annotations
let exportLinkRects = [];

// Font loading helper with all required weights
const ensureFontsLoaded = async () => {
  const id = "export-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Lato:wght@100;300;400;700;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    await new Promise((r) => setTimeout(r, 800));
  }

  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn("Font loading timeout:", e);
    }
  }
};

// Helper to normalize font weight to numeric value
const normalizeWeight = (weight) => {
  if (!weight) return 400;
  if (/^\d+$/.test(weight)) return parseInt(weight, 10);
  const weightMap = {
    thin: 100,
    extralight: 200,
    ultralight: 200,
    light: 300,
    normal: 400,
    regular: 400,
    medium: 500,
    semibold: 600,
    demibold: 600,
    bold: 700,
    extrabold: 800,
    ultrabold: 800,
    black: 900,
    heavy: 900,
    lighter: 300,
    bolder: 700,
  };
  return weightMap[(weight || "").toLowerCase()] || 400;
};

// Helper to extract rotation from transform string
const extractRotation = (transform) => {
  if (!transform || transform === "none") return 0;
  const match = transform.match(/rotate\(([-\d.]+)deg\)/i);
  return match ? parseFloat(match[1]) : 0;
};

// Helper to extract scale from transform string
const extractScale = (transform) => {
  if (!transform || transform === "none") return 1;
  const match = transform.match(/scale\(([d.]+)\)/i);
  return match ? parseFloat(match[1]) : 1;
};

// Build per-corner radius string if any corner is set
const composeCornerRadius = (styles, fallback = "0px") => {
  const tl = styles?.borderTopLeftRadius;
  const tr = styles?.borderTopRightRadius;
  const br = styles?.borderBottomRightRadius;
  const bl = styles?.borderBottomLeftRadius;

  const anyCorner = tl || tr || br || bl;
  if (anyCorner) {
    return `${tl || "0px"} ${tr || "0px"} ${br || "0px"} ${bl || "0px"}`;
  }
  return styles?.borderRadius || fallback;
};

// Return the final radius to apply given shapeType and styles
const getShapeBorderRadius = (shapeType, styles) => {
  switch ((shapeType || "rectangle").toLowerCase()) {
    case "circle":
    case "oval":
      return "50%";
    case "rounded-rectangle":
      return composeCornerRadius(styles, "12px");
    case "rectangle":
      return composeCornerRadius(styles, "0px");
    case "trapezoid":
    case "star":
    default:
      return "0px";
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

// Helper to strip layout-affecting transforms
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
  }
};

// Helper to normalize all layout transforms in a DOM tree
// Helper to normalize all layout transforms in a DOM tree
const normalizeLayoutTransforms = (root) => {
  const walk = (node) => {
    // ✅ Skip elements that have rotation applied (preserve rotation)
    const hasRotation = node.style?.transform?.includes("rotate");

    if (node.tagName === "IMG") {
      // Preserve image rotation if exists
      if (!hasRotation) {
        stripLayoutTransforms(node, true);
      }
    } else if (!hasRotation) {
      // Only strip if no rotation
      stripLayoutTransforms(node, false);
    }

    Array.from(node.children || []).forEach(walk);
  };
  walk(root);
};
/**
 * Get border styles string
 */
const getBorderStyles = (styles) => {
  if (!styles) return "none";
  const width = styles.borderWidth || styles.borderTopWidth || "0";
  const style = styles.borderStyle || "solid";
  const color = styles.borderColor || "#000";

  if (parseInt(width) > 0) {
    return `${width} ${style} ${color}`;
  }
  return "none";
};

/**
 * Build spacing string from individual values
 */
const buildSpacing = (styles, property, fallback = "0") => {
  if (!styles) return fallback;

  const top = styles?.[`${property}Top`] || fallback;
  const right = styles?.[`${property}Right`] || fallback;
  const bottom = styles?.[`${property}Bottom`] || fallback;
  const left = styles?.[`${property}Left`] || fallback;

  if (top === right && right === bottom && bottom === left) return top;
  return `${top} ${right} ${bottom} ${left}`;
};

/**
 * Push link rectangle for tracking
 */
let linkRects = [];
const pushLinkRect = (href, x, y, w, h) => {
  linkRects.push({ href, x, y, w, h });
};

/**
 * Reset link rects
 */
const resetLinkRects = () => {
  linkRects = [];
};

export default function EmailNewsletterEditor() {
  const [shareDisabled, setShareDisabled] = useState(false);
  const [isSharedDataLoaded, setIsSharedDataLoaded] = useState(false);
  const [showHTMLImportModal, setShowHTMLImportModal] = useState(false);
  const [htmlInput, setHtmlInput] = useState("");
  const [cssInput, setCssInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  // ✅ ADD NEW STATE for progress tracking (add this with other useState declarations)
  const [importProgress, setImportProgress] = useState({
    stage: "idle",
    message: "",
    current: 0,
    total: 0,
  });

  //Redux
  const dispatch = useDispatch();

  // Redux state
  const elements = useSelector(selectElements);
  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false);
  const selectedElement = useSelector(selectSelectedElement);
  const globalSettings = useSelector(selectGlobalSettings);
  const newsletterName = useSelector(selectNewsletterName);
  const isDirty = useSelector(selectIsDirty);
  const saving = useSelector(selectSaving);
  const activeView = useSelector((state) => state.editor.activeView);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [saveTriggered, setSaveTriggered] = useState(false);

  const currentTemplateId = useSelector(
    (state) => state.editor.currentTemplateId
  );

  // Local state (keep these)
  const [isExporting, setIsExporting] = useState(false);

  const [message, setMessage] = useState("");

  // Loading states
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  const [isSharing, setIsSharing] = useState(false);
  const [isExportingHtml, setIsExportingHtml] = useState(false);

  const dragItem = useRef(null);
  const canvasRef = useRef(null);

  // ✅ ADD HTML/CSS IMPORT HANDLER
  // ✅ UPDATED HANDLER - Now async and shows progress
  // Updated handleHTMLCSSImport function
  // Removes fetchImages option - keeps all images as URLs

  const handleHTMLCSSImport = async () => {
    if (!htmlInput.trim()) {
      dispatch(
        addNotification({
          type: "error",
          message: "Please enter HTML code to import",
        })
      );
      return;
    }

    setIsImporting(true);
    setImportProgress({
      stage: "validating",
      message: "Validating HTML...",
      current: 0,
      total: 1,
    });

    try {
      // Validate HTML first
      const validation = validateHTML(htmlInput);

      if (!validation.valid) {
        dispatch(
          addNotification({
            type: "error",
            message: validation.message,
          })
        );
        setIsImporting(false);
        return;
      }

      // Parse HTML and CSS with progress tracking
      const result = await parseHTMLToNewsletterElements(htmlInput, cssInput, {
        onProgress: (progress) => {
          setImportProgress(progress);
        },
      });

      if (result.success && result.elements.length > 0) {
        // ✅ FIX: Replace all elements at once instead of adding one by one
        dispatch(setElements(result.elements));

        // Apply newsletter background color if present
        if (
          result.newsletterBackgroundColor &&
          result.newsletterBackgroundColor !== "rgba(0, 0, 0, 0)"
        ) {
          console.log(
            "Setting newsletter background color:",
            result.newsletterBackgroundColor
          );
          dispatch(
            setGlobalSettings({
              ...globalSettings,
              newsletterColor: result.newsletterBackgroundColor,
            })
          );
        }

        // Close modal and reset inputs
        setShowHTMLImportModal(false);
        setHtmlInput("");
        setCssInput("");
        setImportProgress({
          stage: "idle",
          message: "",
          current: 0,
          total: 0,
        });

        // Show success message
        dispatch(
          addNotification({
            type: "success",
            message: result.message,
          })
        );
      } else {
        dispatch(
          addNotification({
            type: "error",
            message: result.message || "Failed to parse HTML",
          })
        );
      }
    } catch (error) {
      console.error("Import error:", error);
      dispatch(
        addNotification({
          type: "error",
          message: `Import failed: ${error.message}`,
        })
      );
    } finally {
      setIsImporting(false);
      setImportProgress({
        stage: "idle",
        message: "",
        current: 0,
        total: 0,
      });
    }
  };

  // Add this state with other useState declarations
  const [showJsonImportModal, setShowJsonImportModal] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonImportProgress, setJsonImportProgress] = useState({
    stage: "idle",
    message: "",
    current: 0,
    total: 0,
  });

  // Add JSON import handler
  const handleJsonImport = async () => {
    if (!jsonInput.trim()) {
      dispatch(
        addNotification({
          type: "error",
          message: "Please enter JSON template code",
        })
      );
      return;
    }

    try {
      setJsonImportProgress({
        stage: "parsing",
        message: "Parsing JSON template...",
        current: 0,
        total: 1,
      });

      // Parse JSON
      let templateData;
      try {
        templateData = JSON.parse(jsonInput);
      } catch (e) {
        throw new Error(`Invalid JSON: ${e.message}`);
      }

      // Parse template
      const result = parseJsonEmailTemplate(templateData);

      if (result.success && result.elements.length > 0) {
        // Set all parsed data to Redux
        dispatch(setElements(result.elements));
        dispatch(setGlobalSettings(result.globalSettings));
        dispatch(setNewsletterName(result.name));

        // Close modal
        setShowJsonImportModal(false);
        setJsonInput("");
        setJsonImportProgress({
          stage: "idle",
          message: "",
          current: 0,
          total: 0,
        });

        dispatch(
          addNotification({
            type: "success",
            message: result.message,
          })
        );
      } else {
        dispatch(
          addNotification({
            type: "error",
            message: result.message || "Failed to parse JSON template",
          })
        );
      }
    } catch (error) {
      console.error("JSON import error:", error);
      dispatch(
        addNotification({
          type: "error",
          message: `Import failed: ${error.message}`,
        })
      );
    } finally {
      setJsonImportProgress({
        stage: "idle",
        message: "",
        current: 0,
        total: 0,
      });
    }
  };

  // Add JSON Import Modal Component
  const JsonImportModal = () => {
    if (!showJsonImportModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-600" />
              Import JSON Email Template
            </h3>
            <button
              onClick={() => setShowJsonImportModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-6 text-sm">
            Paste your JSON email template with nested container structure.
          </p>

          {/* JSON Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              JSON Template *
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{
  "name": "My Template",
  "globalSettings": { "maxWidth": "600px" },
  "elements": [
    {
      "type": "section",
      "content": "Section",
      "children": [
        {
          "type": "header",
          "content": "Hello"
        },
        {
          "type": "text",
          "content": "Welcome to your email"
        }
      ]
    }
  ]
}`}
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none"
              spellCheck="false"
              disabled={jsonImportProgress.stage !== "idle"}
            />
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>✨ Features:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
              <li>
                Supports nested containers (section, grid, item, column, row)
              </li>
              <li>Automatic ID generation for all elements</li>
              <li>Preserves all styles and properties</li>
              <li>Global settings integration</li>
              <li>Ready for export to email-safe HTML</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowJsonImportModal(false);
                setJsonInput("");
              }}
              disabled={jsonImportProgress.stage !== "idle"}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleJsonImport}
              disabled={
                jsonImportProgress.stage !== "idle" || !jsonInput.trim()
              }
              className={`
              px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
              ${
                jsonImportProgress.stage !== "idle" || !jsonInput.trim()
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:scale-105"
              }
            `}
            >
              {jsonImportProgress.stage !== "idle" ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Importing...
                </>
              ) : (
                "Import JSON Template"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ UPDATED HTML/CSS IMPORT MODAL COMPONENT
  const HTMLImportModal = () => {
    if (!showHTMLImportModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-600" />
              Import HTML/CSS
            </h3>
            <button
              onClick={() => setShowHTMLImportModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-6 text-sm">
            Paste your HTML and CSS code below. Works with both modern HTML and
            email-safe table layouts. Image URLs (including Cloudinary) will be
            preserved.
          </p>
          {/* HTML Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              HTML Code *
            </label>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="<div>Your HTML content here...</div>"
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none"
              spellCheck="false"
              disabled={isImporting}
            />
          </div>

          {/* CSS Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CSS Code (Optional)
            </label>
            <textarea
              value={cssInput}
              onChange={(e) => setCssInput(e.target.value)}
              placeholder=".your-class { color: blue; }"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none"
              spellCheck="false"
              disabled={isImporting}
            />
          </div>

          {/* Progress Bar */}
          {isImporting && importProgress.stage !== "idle" && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">
                  {importProgress.message}
                </span>
                <span className="text-xs text-blue-600">
                  {importProgress.current}/{importProgress.total}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (importProgress.current /
                        Math.max(importProgress.total, 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Info Message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>✨ Features:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
              <li>Parses both modern HTML and email-safe table layouts</li>
              <li>Preserves all image URLs (Cloudinary, external URLs)</li>
              <li>Converts to canvas-ready absolute positioning</li>
              <li>Extracts all styles and properties</li>
              <li>Ready for export to email-safe HTML</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowHTMLImportModal(false);
                setHtmlInput("");
                setCssInput("");
              }}
              disabled={isImporting}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleHTMLCSSImport}
              disabled={isImporting || !htmlInput.trim()}
              className={`
              px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
              ${
                isImporting || !htmlInput.trim()
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:scale-105"
              }
            `}
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Importing...
                </>
              ) : (
                "Import & Convert"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // THUMBNAIL GENERATION
  // ============================================================================
  const generateThumbnail = async () => {
    try {
      await ensureFontsLoaded();
      const node = prepareForExport();
      if (!node) return "";

      Object.assign(node.style, {
        position: "absolute",
        left: "-9999px",
        top: "0",
        zIndex: "-1",
      });
      document.body.appendChild(node);
      await new Promise((r) => setTimeout(r, 800));

      const captureWidth = 600; // ✅ Only first 300px width
      const captureHeight = 1000; // ✅ Only first 300px height

      const dataUrl = await domToImage.toPng(node, {
        quality: 0.9,
        bgcolor: globalSettings.newsletterColor || "#ffffff",
        width: captureWidth,
        height: captureHeight,
        style: {
          clip: `rect(0px, ${captureWidth}px, ${captureHeight}px, 0px)`,
          overflow: "hidden",
        },
        filter: (el) => !el?.dataset?.noExport,
      });

      document.body.removeChild(node);
      return dataUrl;
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      return "";
    }
  };

  // Add this function to handle creating a new template
  const handleNewTemplate = () => {
    if (isDirty || elements.length > 0) {
      // Show confirmation dialog if there are unsaved changes or existing elements
      setShowNewTemplateDialog(true);
    } else {
      // Directly create new template if canvas is empty
      createNewTemplate();
    }
  };

  const createNewTemplate = () => {
    // Clear all template data
    dispatch(setElements([]));
    dispatch(
      setGlobalSettings({
        maxWidth: "600px",
        minHeight: "800px",
        backgroundColor: "#f5f5f5",
        newsletterColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
      })
    );
    dispatch(setNewsletterName(""));
    dispatch(setCurrentTemplateId(null));
    dispatch(setSelectedElementId(null));

    // Close dialog
    setShowNewTemplateDialog(false);

    // Show success message
    dispatch(
      addNotification({
        type: "success",
        message: "New template created!",
      })
    );
  };

  // Add New Template Confirmation Dialog component before your return statement
  const NewTemplateDialog = () => {
    if (!showNewTemplateDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Create New Template?
          </h3>
          <p className="text-gray-600 mb-6">
            The current template will be deleted and a new blank template will
            be created.
            {isDirty && " You have unsaved changes that will be lost."}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowNewTemplateDialog(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createNewTemplate}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            >
              Create New Template
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // SAVE OR UPDATE TEMPLATE TO BACKEND DATABASE
  // ============================================================================
  const handleSave = async () => {
    setSaveTriggered(true); // Mark that save was triggered
    try {
      const result = await dispatch(
        saveNewsletter({ generateThumbnail })
      ).unwrap();
      // isDirty will be automatically set to false by Redux after successful save
      dispatch(
        addNotification({
          type: "success",
          message: currentTemplateId
            ? "Template updated successfully!"
            : "Template saved successfully!",
        })
      );

      console.log("Save result:", result);
    } catch (error) {
      console.error("Save error:", error);
      setSaveTriggered(false); // Reset if save failed
      dispatch(
        addNotification({
          type: "error",
          message: error?.message || "Failed to save template",
        })
      );
    }
  };

  // Check for encoded data in the URL on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get("templateId");

    // Load template by ID if provided
    if (templateId) {
      dispatch(loadTemplateIntoEditor({ templateId }));
    }
  }, [dispatch]);

  const location = useLocation();

  useEffect(() => {
    if (isDirty) {
      setSaveTriggered(false);
    }
  }, [isDirty]);

  // ✅ KEEP THIS ONE - It has the ref protection
  const templateLoadedRef = useRef(false);

  useEffect(() => {
    const tpl = location?.state?.template;
    const action = location?.state?.action;

    // ✅ Skip if already loaded
    if (templateLoadedRef.current) return;

    if (tpl && tpl.elements && tpl.globalSettings) {
      templateLoadedRef.current = true; // ✅ Mark as loaded

      // Load template data
      dispatch(setElements(tpl.elements));
      dispatch(setGlobalSettings(tpl.globalSettings));
      dispatch(setNewsletterName(tpl.name || "Untitled Newsletter"));
      dispatch(setSelectedElementId(null));

      if (tpl.id) {
        dispatch(setCurrentTemplateId(tpl.id));
      }

      if (action === "send") {
        setTimeout(() => {
          try {
            const html = exportToEmailHtml(
              tpl.elements,
              tpl.globalSettings,
              tpl.name || newsletterName
            );
            navigator.clipboard.writeText(html);
            dispatch(
              addNotification({
                type: "success",
                message: "Email HTML ready to send (copied).",
              })
            );
          } catch (e) {
            dispatch(
              addNotification({
                type: "error",
                message: "Failed to prepare email HTML.",
              })
            );
          }
        }, 100);
      } else {
        dispatch(
          addNotification({
            type: "success",
            message: "Template loaded successfully.",
          })
        );
      }

      // Clear location state
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, dispatch, newsletterName]);

  // Add this NEW useEffect for clearing state on cancel
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    // Only clear on ACTUAL PAGE UNLOAD (closing tab/window), not refresh or tab switch
    const handleUnload = () => {
      // This fires ONLY when page is actually being unloaded (closed)
      if (isDirty && !saveTriggered) {
        // User clicked Cancel on the browser dialog - clear template
        dispatch(setElements([]));
        dispatch(
          setGlobalSettings({
            maxWidth: "600px",
            minHeight: "800px",
            backgroundColor: "#f5f5f5",
            newsletterColor: "#ffffff",
            fontFamily: "Arial, sans-serif",
          })
        );
        dispatch(setNewsletterName(""));
        dispatch(setCurrentTemplateId(null));
        dispatch(setSelectedElementId(null));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [isDirty, saveTriggered, dispatch]);

  // Reset flag when editing
  useEffect(() => {
    if (isDirty) {
      setSaveTriggered(false);
    }
  }, [isDirty]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const pushLinkRect = (href, x, y, width, height) => {
    if (!href || href === "#") return;
    exportLinkRects.push({ href, x, y, width, height });
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case "text":
        return "Enter your text here...";
      case "header":
        return "New Header";
      case "image":
        return "";
      case "button":
        return "Click Me";
      case "divider":
        return "";
      case "social":
        return "";
      case "shape":
        return "";
      default:
        return "";
    }
  };

  const getDefaultStyles = (type) => {
    const base = {
      padding: "0",
      // position: "absolute",
      position: "relative", // ✅ ADD
      width: type === "button" ? "auto" : "100%", // ✅ CHANGE from "300px"
      fontFamily: globalSettings.fontFamily || "Arial, sans-serif",
      display: "block",
      marginBottom: "16px", // Add spacing between elements
    };

    switch (type) {
      case "shape":
        return {
          ...base,
          width: "200px",
          height: "200px",

          backgroundColor: "#3b82f6",
          shapeType: "rectangle",
          fillType: "solid",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "#000000",
          opacity: "1",
          boxShadow: "none",
          transform: "none",
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          marginLeft: "0px",
          paddingTop: "0px",
          paddingRight: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
        };
      case "text":
        return {
          ...base,
          fontSize: "16px",
          color: "#333",
          lineHeight: "1.6",
          height: "auto",
          backgroundColor: "transparent",
          fontWeight: "400",
          fontStyle: "normal",
          textDecoration: "none",
          textShadow: "none",
          shadowOffsetX: "0px",
          shadowOffsetY: "0px",
          shadowBlurRadius: "0px",
          shadowColor: "#000000",
        };
      case "header":
        return {
          ...base,
          fontSize: "28px",
          fontWeight: "700",
          textAlign: "center",
          color: "#1a1a1a",
          height: "auto",
          backgroundColor: "transparent",
          fontStyle: "normal",
          textDecoration: "none",
          textShadow: "none",
          shadowOffsetX: "0px",
          shadowOffsetY: "0px",
          shadowBlurRadius: "0px",
          shadowColor: "#000000",
        };
      case "image":
        return {
          ...base,
          textAlign: "center",
          height: "200px",
          width: "300px",
          shapeType: "rectangle",
        };
      case "button":
        return {
          ...base,
          backgroundColor: "#007bff",
          color: "#fff",
          textAlign: "center",
          borderRadius: "6px",
          display: "inline-block",
          width: "150px",
          height: "50px",
          paddingTop: "12px",
          paddingRight: "24px",
          paddingBottom: "12px",
          paddingLeft: "24px",
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          marginLeft: "0px",
          fontWeight: "600",
        };
      case "divider":
        return {
          ...base,
          height: "20px",
          backgroundColor: "#D1D5DB",
          borderBottomWidth: "2px",
          borderBottomStyle: "solid",
          width: "100%",
        };
      case "social":
        return {
          ...base,
          textAlign: "center",
          fontSize: "14px",
          color: "#666",
          height: "60px",
          backgroundColor: "transparent",
        };
      case "section":
        return {
          position: "absolute",
          width: "100%",
          padding: "20px",
          margin: "20px 0",
          backgroundColor: "#f9f9f9",
          border: "1px solid #e5e5e5",
          borderRadius: "8px",
        };
      default:
        return base;
    }
  };

  const handleAddElement = (type, options = {}) => {
    const elementId = `${type}-${Date.now()}`;
    const newElement = {
      id: elementId,
      type,
      content: getDefaultContent(type),
      styles: {
        ...getDefaultStyles(type),
        // left: options.left || "50px",
        // top: options.top || "50px",
        ...options.styles,
      },
      link: type === "button" ? options.link : undefined,
      icons: type === "social" ? options.icons || [...defaultIcons] : undefined,
      children: options.children || [], // ✅ ADD: Support for nested children
    };

    dispatch(addElementAction(newElement));
    dispatch(setSelectedElementId(elementId));
  };

  const handleUpdateElement = (id, updates) => {
    dispatch(updateElementAction({ id, updates }));
  };

  const updateElementStyle = (id, styleUpdates) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    // Remove position-related properties
    const { left, top, position, ...validStyles } = styleUpdates;

    const mergedStyles = {
      ...element.styles,
      ...validStyles,
    };

    dispatch(
      updateElementAction({
        id,
        updates: { styles: mergedStyles },
      })
    );
  };

  const handleDeleteElement = (id) => {
    dispatch(deleteElementAction(id));
  };

  const handleDuplicateElement = (id) => {
    dispatch(duplicateElementAction(id));
  };

  // In EmailNewsletterEditor.jsx

  // ✅ FIXED handleImageUpload - Use templateService instead of direct fetch
  const handleImageUpload = async (elementId, file) => {
    try {
      console.log("🔄 Starting image upload to Cloudinary...");
      console.log("File:", file.name, file.type, file.size);

      // Validate file
      if (!file.type.startsWith("image/")) {
        dispatch(
          addNotification({
            type: "error",
            message: "Please select a valid image file",
          })
        );
        return;
      }

      // Show loading notification
      dispatch(
        addNotification({
          type: "info",
          message: "Uploading image to Cloudinary...",
        })
      );

      // Convert file to base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      console.log("✅ File converted to base64, uploading to backend...");

      // ✅ Use templateService instead of direct fetch
      const response = await templateService.uploadImage(base64Image);

      console.log("✅ Upload successful:", response);

      // ✅ Extract URL from response
      const imageUrl = response.data?.url || response.url;

      if (!imageUrl) {
        throw new Error("No URL returned from upload");
      }

      // ✅ Update element with Cloudinary URL
      handleUpdateElement(elementId, {
        content: imageUrl,
      });

      // Show success notification
      dispatch(
        addNotification({
          type: "success",
          message: "Image uploaded to Cloudinary successfully!",
        })
      );

      console.log("✅ Element updated with Cloudinary URL:", imageUrl);
    } catch (error) {
      console.error("❌ Upload error:", error);

      dispatch(
        addNotification({
          type: "error",
          message: `Failed to upload image: ${error.message}`,
        })
      );
    }
  };
  // ✅ Helper function to compress images
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Resize if image is larger than maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg", // Convert to JPEG for better compression
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

 

  const handleShareLink = async () => {
    try {
      setIsSharing(true);

      // ✅ Share using template ID instead of Cloudinary URL
      if (!currentTemplateId) {
        dispatch(
          addNotification({
            type: "error",
            message: "Please save the template before sharing.",
          })
        );
        return;
      }

      const url = `${window.location.origin}${window.location.pathname}?templateId=${currentTemplateId}`;
      await navigator.clipboard.writeText(url);

      dispatch(
        addNotification({
          type: "success",
          message: "Share link copied to clipboard!",
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          message: "Failed to create share link",
        })
      );
    } finally {
      setIsSharing(false);
    }
  };

  const prepareForExport = () => {
    exportLinkRects = [];

    if (!canvasRef.current) {
      console.error("Canvas element not found.");
      return null;
    }

    const exportContainer = document.createElement("div");
    exportContainer.style.cssText = `
    width: ${globalSettings.maxWidth || "600px"};
    min-height: ${globalSettings.minHeight || "800px"};
    background-color: ${globalSettings.newsletterColor || "#ffffff"};
    font-family: ${globalSettings.fontFamily || "Arial, sans-serif"};
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    position: relative;
    overflow: visible;
    border: none;
    outline: none;
    box-shadow: none;
    transform: none;
    transform-origin: top left;
     display: block; // ✅ ADD
  `;

    // Recursively create export elements for ALL elements including nested containers
    elements.forEach((element) => {
      const elementDiv = createExportElement(element, globalSettings, false);
      if (elementDiv) {
        exportContainer.appendChild(elementDiv);
      }
    });

    return exportContainer;
  };
  const buildSpacing = (styles, property) => {
    const top = styles[`${property}Top`] || "0px";
    const right = styles[`${property}Right`] || "0px";
    const bottom = styles[`${property}Bottom`] || "0px";
    const left = styles[`${property}Left`] || "0px";

    if (top === right && right === bottom && bottom === left) {
      return top;
    }
    return `${top} ${right} ${bottom} ${left}`;
  };

  const getBorderStyles = (elementStyles) => {
    if (
      elementStyles?.borderWidth &&
      elementStyles?.borderColor &&
      elementStyles?.borderStyle
    ) {
      return `${elementStyles.borderWidth} ${elementStyles.borderStyle} ${elementStyles.borderColor}`;
    }
    return elementStyles?.border || "none";
  };

  const createExportElement = (
    element,
    globalSettings = {},
    isNested = false
  ) => {
    const div = document.createElement("div");
    const styles = element.styles || {};

    const imageRotation = extractRotation(styles.transform || styles.rotate);
    const elementScale = extractScale(styles.transform || styles.scale);

    div.style.cssText = `
   position: relative;
    left: ${styles.left || "0px"};
    top: ${styles.top || "0px"};
     width: 100%;
    height: ${styles.height || "auto"};
     margin: ${buildSpacing(styles, "margin") || "0 0 16px 0"};
    padding: ${buildSpacing(styles, "padding") || "0"};
    background: transparent;
    border: none;
    box-shadow: none;
    box-sizing: border-box;
  `;
    stripLayoutTransforms(div);

    switch (element.type) {
      case "section": {
        const section = document.createElement("div");
        section.style.cssText = `
        position: relative;
        width: 100%;
        background-color: ${styles.backgroundColor || "#f9f9f9"};
        border: ${getBorderStyles(styles)};
        border-radius: ${composeCornerRadius(styles, "8px")};
        padding: ${buildSpacing(styles, "padding") || "20px"};
        margin: ${buildSpacing(styles, "margin") || "20px 0"};
        box-shadow: ${styles.boxShadow || "none"};
        display: block;
        box-sizing: border-box;
      `;

        // ✅ ADD: Render nested children
        if (element.children && element.children.length > 0) {
          element.children.forEach((child) => {
            const childElement = createExportElement(
              child,
              globalSettings,
              true
            );
            if (childElement) {
              childElement.style.marginBottom = "16px";
              section.appendChild(childElement);
            }
          });
        }

        stripLayoutTransforms(section);
        return section;
      }

      case "shape": {
        const shapeType = styles?.shapeType || "rectangle";
        const shapeWidth = parseInt(styles?.width) || 200;
        const shapeHeight = parseInt(styles?.height) || 200;
        const isPoly = isPolygonShape(shapeType);
        const shapeRadius = getShapeBorderRadius(shapeType, styles);
        const shapeClip = getShapeClipPath(shapeType);

        div.style.width = `${shapeWidth}px`;
        div.style.height = `${shapeHeight}px`;
        div.style.background = "transparent";
        div.style.boxSizing = "border-box";
        div.style.transform = "none";
        div.style.transformOrigin = "top left";

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

        const container = document.createElement("div");
        container.style.cssText = `
        position: relative;
        width: ${shapeWidth}px;
        height: ${shapeHeight}px;
        display: block;
        margin: ${buildSpacing(styles, "margin") || "0"};
        padding: ${buildSpacing(styles, "padding") || "0"};
        box-sizing: border-box;
        opacity: ${styles?.opacity || "1"};
      `;

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
        ${!isPoly ? "border-radius:" + shapeRadius + ";" : "border-radius:0px;"}
        border: ${getBorderStyles(styles)};
        box-shadow: ${styles?.boxShadow || "none"};
        box-sizing: border-box;
        filter: ${styles?.filter || "none"};
        transform: ${styles?.rotation ? `rotate(${styles.rotation})` : "none"};
      `;

        container.appendChild(shapeDiv);
        stripLayoutTransforms(container);
        div.appendChild(container);
        break;
      }

      case "heading": {
        const header = document.createElement("h2");
        header.textContent = element.content || "Heading";
        const headerWeight = normalizeWeight(styles.fontWeight);
        header.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        margin: 0;
        padding: ${buildSpacing(styles, "padding") || "0"};
        font-size: ${styles.fontSize || "28px"};
        font-weight: ${headerWeight};
        color: ${styles.color || "#1a1a1a"};
        text-align: ${styles.textAlign || "left"};
        line-height: ${styles.lineHeight || "1.4"};
        width: ${styles.width || "auto"};
        height: ${styles.height || "auto"};
        background-color: ${styles.backgroundColor || "transparent"};
        display: block;
        border: ${getBorderStyles(styles)};
        border-radius: ${composeCornerRadius(styles, "0")};
        box-shadow: ${styles.boxShadow || "none"};
        opacity: ${styles.opacity || "1"};
        font-family: ${
          styles.fontFamily || globalSettings.fontFamily || "Arial, sans-serif"
        };
        box-sizing: border-box;
        white-space: pre-wrap;
        font-style: ${styles.fontStyle || "normal"};
        text-decoration: ${styles.textDecoration || "none"};
        text-shadow: ${styles.textShadow || "none"};
        letter-spacing: ${styles.letterSpacing || "normal"};
        word-spacing: ${styles.wordSpacing || "normal"};
        text-indent: ${styles.textIndent || "0"};
        text-transform: ${styles.textTransform || "none"};
        filter: ${styles.filter || "none"};
      `;
        stripLayoutTransforms(header);
        div.appendChild(header);
        break;
      }

      case "text": {
        const text = document.createElement("div");
        text.textContent = element.content || "Text content";
        const textWeight = normalizeWeight(styles.fontWeight);
        text.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        margin: 0;
        padding: ${buildSpacing(styles, "padding") || "0"};
        font-size: ${styles.fontSize || "16px"};
        font-weight: ${textWeight};
        color: ${styles.color || "#333333"};
        line-height: ${styles.lineHeight || "1.6"};
        text-align: ${styles.textAlign || "left"};
        width: ${styles.width || "auto"};
        height: ${styles.height || "auto"};
        background-color: ${styles.backgroundColor || "transparent"};
        display: block;
        border-radius: ${composeCornerRadius(styles, "0")};
        border: ${getBorderStyles(styles)};
        box-shadow: ${styles.boxShadow || "none"};
        opacity: ${styles.opacity || "1"};
        font-family: ${
          styles.fontFamily || globalSettings.fontFamily || "Arial, sans-serif"
        };
        box-sizing: border-box;
        white-space: pre-wrap;
        font-style: ${styles.fontStyle || "normal"};
        text-decoration: ${styles.textDecoration || "none"};
        text-shadow: ${styles.textShadow || "none"};
        letter-spacing: ${styles.letterSpacing || "normal"};
        word-spacing: ${styles.wordSpacing || "normal"};
        text-indent: ${styles.textIndent || "0"};
        text-transform: ${styles.textTransform || "none"};
        vertical-align: ${styles.verticalAlign || "baseline"};
        filter: ${styles.filter || "none"};
      `;
        stripLayoutTransforms(text);
        div.appendChild(text);
        break;
      }

      case "button": {
        const buttonLink = document.createElement("a");
        buttonLink.textContent = element.content || "Button";
        buttonLink.href = element.link || "#";
        const buttonWeight = normalizeWeight(styles.fontWeight);
        buttonLink.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        display: inline-block;
        background-color: ${styles.backgroundColor || "#007bff"};
        color: ${styles.color || "#ffffff"};
        padding: ${buildSpacing(styles, "padding") || "12px 24px"};
        margin: 0;
        text-decoration: none;
        border-radius: ${composeCornerRadius(styles, "6px")};
        font-size: ${styles.fontSize || "16px"};
        font-weight: ${buttonWeight};
        font-style: ${styles.fontStyle || "normal"};
        border: ${getBorderStyles(styles)};
        text-align: center;
        box-shadow: ${styles.boxShadow || "none"};
        opacity: ${styles.opacity || "1"};
        box-sizing: border-box;
        line-height: ${styles.lineHeight || "1.4"};
        font-family: ${
          styles.fontFamily || globalSettings.fontFamily || "Arial, sans-serif"
        };
        cursor: pointer;
        text-shadow: ${styles.textShadow || "none"};
        letter-spacing: ${styles.letterSpacing || "normal"};
        text-transform: ${styles.textTransform || "none"};
        vertical-align: ${styles.verticalAlign || "middle"};
        transition: ${styles.transition || "none"};
        width: ${styles.width || "auto"};
        height: ${styles.height || "auto"};
        filter: ${styles.filter || "none"};
      `;
        stripLayoutTransforms(buttonLink);
        div.appendChild(buttonLink);
        pushLinkRect(
          buttonLink.href,
          parseFloat(styles.left || 0),
          parseFloat(styles.top || 0),
          parseFloat(styles.width || 150),
          parseFloat(styles.height || 40)
        );
        break;
      }

      case "image": {
        const container = document.createElement("div");
        const img = document.createElement("img");

        const imageSrc = element.content || "";

        // ✅ FIXED: Better rotation extraction
        const rotation =
          styles?.rotation ||
          extractRotation(styles.transform || styles.rotate) ||
          0;

        // ✅ Outer container: rotates + holds border, shadow, opacity
        container.style.cssText = `
    position: relative;
    display: inline-block;
    width: ${styles.width || "auto"};
    height: ${styles.height || "auto"};
    overflow: visible;
    border: ${getBorderStyles(styles)};
    border-radius: ${composeCornerRadius(styles, "0")};
    box-shadow: ${styles.boxShadow || "none"};
    background-color: ${styles.backgroundColor || "transparent"};
    opacity: ${styles.opacity || "1"};
    transform: rotate(${rotation}deg);
    transform-origin: ${styles.transformOrigin || "center center"};
    box-sizing: border-box;
    will-change: transform;
  `;

        // ✅ Image styling inside container
        img.src = imageSrc;
        img.alt = "Image";
        img.style.cssText = `
    width: 100%;
    height: 100%;
    display: block;
    object-fit: ${styles.objectFit || "cover"};
    border-radius: inherit;
    box-sizing: border-box;
  `;

        container.appendChild(img);

        // ✅ If the image has a hyperlink
        if (element.link && element.link.trim() !== "") {
          const link = document.createElement("a");
          link.href = element.link;
          link.target = "_blank";
          link.style.cssText = `
      display: inline-block;
      width: 100%;
      height: 100%;
      text-decoration: none;
      transform: rotate(${rotation}deg);
      transform-origin: ${styles.transformOrigin || "center center"};
    `;
          link.appendChild(container);
          div.appendChild(link);
        } else {
          div.appendChild(container);
        }

        // ✅ DON'T strip transforms for images
        // stripLayoutTransforms is not called here anymore

        // ✅ Ensure image displays properly in export preview
        div.style.overflow = "visible";
        container.style.overflow = "visible";

        break;
      }

      case "divider": {
        div.style.backgroundColor = styles.backgroundColor || "#d1d5db";
        div.style.borderRadius = composeCornerRadius(styles, "0");
        div.style.boxShadow = styles.boxShadow || "none";
        div.style.height = styles.height || "2px";
        div.style.width = "100%";
        div.style.opacity = styles.opacity || "1";
        div.style.margin = buildSpacing(styles, "margin") || "0";
        div.style.padding = buildSpacing(styles, "padding") || "0";
        div.style.filter = styles.filter || "none";

        if (styles.borderBottomWidth || styles.borderWidth) {
          div.style.borderBottom = `${
            styles.borderBottomWidth || styles.borderWidth || "2px"
          } ${styles.borderBottomStyle || styles.borderStyle || "solid"} ${
            styles.borderColor || styles.backgroundColor || "#d1d5db"
          }`;
        }

        if (element.content) {
          const dividerText = document.createElement("span");
          dividerText.textContent = element.content;
          const dividerWeight = normalizeWeight(styles.fontWeight);
          dividerText.style.cssText = `
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background-color: ${
            styles.labelBackgroundColor ||
            globalSettings.newsletterColor ||
            "#ffffff"
          };
          padding: 0 12px;
          font-size: ${styles.fontSize || "14px"};
          font-weight: ${dividerWeight};
          color: ${styles.color || "#666"};
          font-style: ${styles.fontStyle || "normal"};
          border-radius: ${composeCornerRadius(styles, "0")};
          font-family: ${
            styles.fontFamily ||
            globalSettings.fontFamily ||
            "Arial, sans-serif"
          };
          display: inline-block;
          text-shadow: ${styles.textShadow || "none"};
          letter-spacing: ${styles.letterSpacing || "normal"};
        `;
          stripLayoutTransforms(dividerText);
          div.appendChild(dividerText);
        }
        break;
      }

      case "social": {
        div.style.textAlign = styles.textAlign || "center";
        div.style.backgroundColor =
          styles.backgroundColor && styles.backgroundColor !== "transparent"
            ? styles.backgroundColor
            : "transparent";
        div.style.borderRadius = composeCornerRadius(styles, "0");
        div.style.boxShadow = styles.boxShadow || "none";
        div.style.opacity = styles.opacity || "1";
        div.style.border = getBorderStyles(styles);
        div.style.fontFamily =
          styles.fontFamily || globalSettings.fontFamily || "Arial, sans-serif";
        div.style.padding = buildSpacing(styles, "padding") || "0";
        div.style.margin = buildSpacing(styles, "margin") || "0";
        div.style.filter = styles.filter || "none";

        if (element.icons && element.icons.length > 0) {
          const iconsContainer = document.createElement("div");
          iconsContainer.style.cssText = `
          display: flex;
          gap: ${styles.gap || "12px"};
          justify-content: ${
            styles.textAlign === "left"
              ? "flex-start"
              : styles.textAlign === "right"
              ? "flex-end"
              : "center"
          };
          align-items: center;
          height: 100%;
          width: 100%;
        `;
          stripLayoutTransforms(iconsContainer);

          element.icons.forEach((icon) => {
            const info = SOCIAL_SVGS[icon.platform?.toLowerCase()];
            const link = document.createElement("a");
            link.href = icon.url || "#";
            link.style.cssText = `
            display: inline-flex;
            width: 28px;
            height: 28px;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            border: none;
            background: transparent;
            transition: ${styles.transition || "opacity 0.2s"};
          `;
            stripLayoutTransforms(link);

            if (info) {
              const svg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              );
              svg.setAttribute("viewBox", info.viewBox);
              svg.setAttribute("width", "24");
              svg.setAttribute("height", "24");

              const path = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              path.setAttribute("d", info.path);
              path.setAttribute(
                "fill",
                styles.iconColor || styles.color || "#666"
              );

              svg.appendChild(path);
              link.appendChild(svg);
            } else {
              const iconWeight = normalizeWeight(styles.fontWeight);
              link.textContent = icon.platform?.charAt(0).toUpperCase();
              link.style.color = styles.iconColor || styles.color || "#666";
              link.style.fontSize = "16px";
              link.style.lineHeight = "24px";
              link.style.fontFamily =
                styles.fontFamily ||
                globalSettings.fontFamily ||
                "Arial, sans-serif";
              link.style.fontWeight = iconWeight.toString();
            }

            iconsContainer.appendChild(link);
            pushLinkRect(icon.url, 0, 0, 28, 28);
          });

          div.appendChild(iconsContainer);
        }
        break;
      }

      default:
        return null;
    }

    return div;
  };
  const downloadAsImage = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setIsExportingPng(true);
    try {
      await ensureFontsLoaded();

      const elementToDownload = prepareForExport();
      if (!elementToDownload) {
        dispatch(
          addNotification({
            type: "error",
            message: "Failed to prepare canvas for export",
          })
        );
        return;
      }

      elementToDownload.style.position = "absolute";
      elementToDownload.style.left = "-9999px";
      elementToDownload.style.top = "0";
      elementToDownload.style.zIndex = "-1";
      document.body.appendChild(elementToDownload);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const dataUrl = await domToImage.toPng(elementToDownload, {
        quality: 1,
        bgcolor: globalSettings.newsletterColor || "#ffffff",
        width: parseInt(globalSettings.maxWidth || "600"),
        height: elementToDownload.scrollHeight,
        style: {
          transformOrigin: "top left",
          backgroundColor: globalSettings.newsletterColor || "#ffffff",
        },
        filter: (node) => !node?.dataset?.noExport,
      });

      document.body.removeChild(elementToDownload);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${newsletterName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // ✅ ADD SUCCESS NOTIFICATION
      dispatch(
        addNotification({
          type: "success",
          message: "PNG exported successfully!",
        })
      );
    } catch (error) {
      console.error("Error generating image:", error);
      // ✅ ADD ERROR NOTIFICATION
      dispatch(
        addNotification({
          type: "error",
          message: "Failed to export PNG. Please try again.",
        })
      );
    } finally {
      setIsExporting(false);
      setIsExportingPng(false);
    }
  };

 

  // Unsaved Changes Warning Dialog
  // Unsaved Changes Warning Dialog
  const UnsavedChangesDialog = () => {
    if (!showUnsavedWarning) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unsaved Changes
          </h3>
          <p className="text-gray-600 mb-6">
            Your template has unsaved changes. Do you want to save before
            leaving?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowUnsavedWarning(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await handleSave();
                setShowUnsavedWarning(false);
                // Navigate away after save
                window.location.href = "/"; // Or your desired route
              }}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Save & Leave
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between shadow-lg">
        {/* Logo and Company Name */}
        {/* Professional Logo - Playful Modern Design */}
        <div className="flex items-center gap-3 mr-8">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f51398] to-[#2001fd] rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-white to-purple-50 rounded-2xl p-3 shadow-xl border-2 border-white group-hover:scale-105 transition-transform">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="2"
                  fill="url(#grad1)"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  rx="2"
                  fill="url(#grad2)"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  rx="2"
                  fill="url(#grad3)"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  rx="2"
                  fill="url(#grad4)"
                />
                <defs>
                  <linearGradient
                    id="grad1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" style={{ stopColor: "#f51398" }} />
                    <stop offset="100%" style={{ stopColor: "#c40cd8" }} />
                  </linearGradient>
                  <linearGradient
                    id="grad2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" style={{ stopColor: "#c40cd8" }} />
                    <stop offset="100%" style={{ stopColor: "#2001fd" }} />
                  </linearGradient>
                  <linearGradient
                    id="grad3"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" style={{ stopColor: "#ff22aa" }} />
                    <stop offset="100%" style={{ stopColor: "#d602ff" }} />
                  </linearGradient>
                  <linearGradient
                    id="grad4"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" style={{ stopColor: "#d602ff" }} />
                    <stop offset="100%" style={{ stopColor: "#2100ff" }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] bg-clip-text text-transparent tracking-tight leading-none">
              EMAIL Newsletter
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1 w-12 bg-gradient-to-r from-[#f51398] to-[#2001fd] rounded-full"></div>
              <p className="text-xs font-bold bg-gradient-to-r from-[#ff22aa] to-[#2100ff] bg-clip-text text-transparent tracking-[0.15em] uppercase">
                Editor Pro
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Name Input */}
        {/* Professional Header with Better Structure */}
        <div className="px-8 py-6 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex items-center justify-between gap-8">
              {/* Left Section: Logo & Newsletter Name */}
              <div className="flex items-center gap-8 min-w-0 flex-1">
                {/* Logo */}
                {/* <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Newsletter Studio
                  </h1>
                </div> */}

                {/* Newsletter Name Input - Only in Editor View */}
                {activeView === "editor" && (
                  <div className="flex items-center gap-3 min-w-0 flex-1 max-w-md">
                    <button
                      onClick={() =>
                        document
                          .querySelector(
                            'input[placeholder="Untitled Newsletter"]'
                          )
                          ?.focus()
                      }
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 transition-all duration-200 hover:scale-110 rounded-lg hover:bg-blue-50"
                      aria-label="Edit Newsletter Name"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>

                    <input
                      type="text"
                      value={newsletterName}
                      onChange={(e) =>
                        dispatch(setNewsletterName(e.target.value))
                      }
                      className="flex-1 text-lg font-semibold bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 min-w-0"
                      placeholder="Untitled Newsletter"
                    />
                  </div>
                )}
              </div>
              {/* ✅ ADD THIS NEW TEMPLATE BUTTON */}
              <button
                onClick={handleNewTemplate}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Template
              </button>
              {/* // Add button in your top toolbar to open JSON import modal */}
              {/* <button
                onClick={() => setShowJsonImportModal(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Code className="w-4 h-4" />
                Import JSON
              </button> */}
              {/* ✅ ADD HTML/CSS IMPORT BUTTON
              <button
                onClick={() => setShowHTMLImportModal(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Code className="w-4 h-4" />
                Import HTML/CSS
              </button> */}

              {/* Center Section: Navigation & Actions */}
              <div className="flex items-center gap-4">
                {/* Navigation Links */}
                <nav className="flex items-center gap-3">
                  {/* <Link
                    to="/templates"
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd]
              hover:from-[#d70f84] hover:via-[#ab0fc4] hover:to-[#2400db]
              transition-all duration-300 flex items-center gap-2 
              shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Templates
                  </Link> */}
                  <Link
                    to="/gallery"
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd]
              hover:from-[#d70f84] hover:via-[#ab0fc4] hover:to-[#2400db]
              transition-all duration-300 flex items-center gap-2 
              shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Templates
                  </Link>

                  <Link
                    to="/saved"
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-[#ff22aa] via-[#d602ff] to-[#2100ff]
              hover:from-[#e01c9a] hover:via-[#b100e6] hover:to-[#1c00d4]
              transition-all duration-300 flex items-center gap-2 
              shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    Saved
                  </Link>
                </nav>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-300"></div>

                {/* Save/Update Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`
            relative px-6 py-2.5 rounded-xl text-sm font-semibold
            transition-all duration-300 flex items-center gap-2.5
            overflow-hidden group
            ${
              saving
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
            }
          `}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <svg
                    className="w-4 h-4 relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  <span className="relative z-10 whitespace-nowrap">
                    {saving
                      ? "Saving..."
                      : currentTemplateId
                      ? "Update"
                      : "Save"}
                  </span>
                </button>
              </div>

              {/* Right Section: View Toggle & Export Actions */}
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
                  <button
                    onClick={() => dispatch(setActiveView("editor"))}
                    className={`
              px-4 py-2 rounded-lg text-sm font-semibold
              transition-all duration-300 flex items-center gap-2
              ${
                activeView === "editor"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }
            `}
                  >
                    <MousePointer className="w-4 h-4" />
                    Editor
                  </button>

                  <button
                    onClick={() => dispatch(setActiveView("preview"))}
                    className={`
              px-4 py-2 rounded-lg text-sm font-semibold
              transition-all duration-300 flex items-center gap-2
              ${
                activeView === "preview"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }
            `}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>

                {/* Export & Share - Only in Preview */}
                {activeView === "preview" && (
                  <>
                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-300"></div>

                    {/* Export & Share Buttons */}
                    <div className="flex items-center gap-2">
                      {/* PNG Export */}
                      <button
                        onClick={downloadAsImage}
                        disabled={isExportingPng}
                        className={`
                  relative px-5 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-300 flex items-center gap-2
                  overflow-hidden group
                  ${
                    isExportingPng
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:scale-105"
                  }
                `}
                      >
                        <Download className="w-4 h-4 relative z-10" />
                        <span className="relative z-10 whitespace-nowrap">
                          {isExportingPng ? "Exporting..." : "PNG"}
                        </span>
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={handleShareLink}
                        disabled={isSharing}
                        className={`
                  relative px-5 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-300 flex items-center gap-2
                  overflow-hidden group
                  ${
                    isSharing
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:scale-105"
                  }
                `}
                      >
                        <Share2 className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform" />
                        <span className="relative z-10 whitespace-nowrap">
                          {isSharing ? "Sharing..." : "Share"}
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* ✅ RENDER MODALS */}
          <UnsavedChangesDialog />
          <NewTemplateDialog />
          <HTMLImportModal />
          <JsonImportModal />
          {/* Export HTML Button - Commented Out */}
         
        </div>
      </div>

      {/* Save Alert */}
      {/* {showSaveAlert && (
        <div className="fixed top-20 right-6 z-50 bg-green-50 border border-green-200 text-green-800 p-3 rounded shadow-lg">
          Newsletter saved successfully!
        </div>
      )} */}

      {/* Message */}
      {message && (
        <div className="fixed top-20 right-6 z-50 bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded shadow-lg">
          {message}
        </div>
      )}

      {/* Main Editor */}
      {/* Main Editor */}

      <div className="flex flex-1 overflow-hidden">
        {activeView === "editor" && (
          <EditorSidebar
            // EditorSidebar props
            globalSettings={globalSettings}
            setGlobalSettings={(settings) =>
              dispatch(setGlobalSettings(settings))
            }
            elements={elements}
            addElement={handleAddElement}
            selectedElement={selectedElement}
            updateElement={handleUpdateElement}
            updateElementStyle={updateElementStyle}
            handleImageUpload={handleImageUpload}
            deleteElement={handleDeleteElement}
          />
        )}

        {activeView === "editor" && (
          <EditorCanvas
            key={`canvas-${elements.length}-${JSON.stringify(globalSettings)}`}
            ref={canvasRef}
            setElements={(newElements) => dispatch(setElements(newElements))}
            activeView={activeView}
            // handleDragStart={handleDragStart}
            // handleDragEnter={handleDragEnter}
            // handleDragEnd={handleDragEnd}
            globalSettings={globalSettings}
            // preservePositions={true}
            selectedElementId={selectedElement?.id}
            setSelectedElementId={(id) => dispatch(setSelectedElementId(id))}
            elements={elements}
            updateElement={handleUpdateElement}
            handleImageUpload={handleImageUpload}
            addElement={handleAddElement}
            deleteElement={handleDeleteElement}
            duplicateElement={handleDuplicateElement}
          />
        )}

        {activeView === "preview" && (
          <EmailPreviewUnified
            template={{
              elements,
              name: newsletterName,
              globalSettings,
            }}
            globalSettings={globalSettings}
          />
        )}
      </div>
    </div>
  );
}
