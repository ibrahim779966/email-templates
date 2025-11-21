/**
 * Parse JSON email template with nested containers
 * Converts flat or hierarchical JSON structure into nested element tree
 */

export const parseJsonEmailTemplate = (jsonData) => {
  try {
    // Validate JSON structure
    if (!jsonData || typeof jsonData !== "object") {
      return {
        success: false,
        message: "Invalid JSON template structure",
        elements: [],
      };
    }

    // Extract elements and global settings
    const {
      elements = [],
      globalSettings = {},
      name = "Imported Template",
    } = jsonData;

    if (!Array.isArray(elements) || elements.length === 0) {
      return {
        success: false,
        message: "Template must contain an 'elements' array",
        elements: [],
      };
    }

    // Parse elements recursively to handle nested containers
    const parsedElements = elements.map((el) => parseElement(el, Date.now()));

    return {
      success: true,
      message: `Successfully imported ${parsedElements.length} elements`,
      elements: parsedElements,
      globalSettings: {
        maxWidth: globalSettings.maxWidth || "600px",
        minHeight: globalSettings.minHeight || "800px",
        backgroundColor: globalSettings.backgroundColor || "#f5f5f5",
        newsletterColor: globalSettings.newsletterColor || "#ffffff",
        fontFamily: globalSettings.fontFamily || "Arial, sans-serif",
        ...globalSettings,
      },
      name,
    };
  } catch (error) {
    console.error("JSON parse error:", error);
    return {
      success: false,
      message: `Failed to parse template: ${error.message}`,
      elements: [],
    };
  }
};

/**
 * Parse individual element, handling nested children
 */
const parseElement = (data, timestamp, parentId = null) => {
  const elementId = `${data.type}-${timestamp}-${Math.random()}`;

  // Container types that can have children
  const CONTAINER_TYPES = ["section", "grid", "item", "column", "row"];
  const isContainer = CONTAINER_TYPES.includes(data.type);

  // Parse element
  const element = {
    id: elementId,
    type: data.type || "text",
    content: data.content || getDefaultContent(data.type),
    styles: {
      ...getDefaultStyles(data.type),
      ...(data.styles || {}),
    },
    link: data.link,
    icons: data.icons,
    children: isContainer ? [] : undefined,
  };

  // Parse nested children if they exist
  if (isContainer && data.children && Array.isArray(data.children)) {
    element.children = data.children.map((child) =>
      parseElement(child, timestamp + Math.random(), elementId)
    );
  }

  return element;
};

/**
 * Get default content based on element type
 */
const getDefaultContent = (type) => {
  const contentMap = {
    text: "Enter your text here...",
    header: "Header",
    button: "Click Me",
    image: "",
    divider: "",
    social: "",
    shape: "",
    section: "Section",
    grid: "Grid",
    item: "Item",
    column: "Column",
    row: "Row",
  };
  return contentMap[type] || "";
};

/**
 * Get default styles based on element type
 */
const getDefaultStyles = (type) => {
  const baseStyles = {
    width: "100%",
    margin: "0",
    padding: "0",
  };

  const styleMap = {
    section: {
      ...baseStyles,
      backgroundColor: "#f3f4f6",
      borderRadius: "8px",
      padding: "20px",
    },
    grid: {
      ...baseStyles,
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "16px",
    },
    item: {
      ...baseStyles,
      backgroundColor: "transparent",
    },
    column: {
      ...baseStyles,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    row: {
      ...baseStyles,
      display: "flex",
      flexDirection: "row",
      gap: "12px",
    },
    header: {
      ...baseStyles,
      fontSize: "28px",
      fontWeight: "700",
      color: "#1a1a1a",
    },
    text: {
      ...baseStyles,
      fontSize: "16px",
      color: "#333333",
      lineHeight: "1.6",
    },
    button: {
      width: "auto",
      padding: "12px 24px",
      backgroundColor: "#007bff",
      color: "#ffffff",
      borderRadius: "6px",
      textAlign: "center",
    },
    image: {
      ...baseStyles,
      height: "300px",
    },
    divider: {
      ...baseStyles,
      borderBottomWidth: "2px",
      borderColor: "#d1d5db",
    },
  };

  return styleMap[type] || baseStyles;
};

/**
 * Export: Convert Redux state back to JSON for saving
 */
export const exportElementsToJson = (elements, globalSettings, name) => {
  return {
    name,
    globalSettings,
    elements: elements.map(normalizeElement),
  };
};

/**
 * Normalize element for JSON export
 */
const normalizeElement = (element) => {
  const normalized = {
    type: element.type,
    content: element.content,
    styles: element.styles,
  };

  if (element.link) normalized.link = element.link;
  if (element.icons) normalized.icons = element.icons;

  // Include children if they exist
  if (element.children && element.children.length > 0) {
    normalized.children = element.children.map(normalizeElement);
  }

  return normalized;
};
