/**
 * HTML Template Generator Service - FRONTEND
 * Converts your template data to HTML for email campaigns
 * 
 * This service takes your template JSON and generates email-compatible HTML
 */

/**
 * Generate inline CSS string from style object
 */
const generateInlineStyles = (styles) => {
  if (!styles || typeof styles !== "object") return "";

  return Object.entries(styles)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case (backgroundColor -> background-color)
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${cssKey}:${value}`;
    })
    .join(";");
};

/**
 * Generate HTML for a text/heading/paragraph element
 */
const generateTextElement = (element) => {
  const styles = generateInlineStyles(element.styles);
  const tag = element.tag || "p";
  const content = element.content || element.text || "";

  return `<${tag} style="${styles}">${content}</${tag}>`;
};

/**
 * Generate HTML for an image element
 */
const generateImageElement = (element) => {
  const styles = generateInlineStyles(element.styles);
  const src = element.src || element.url || "";
  const alt = element.alt || "Image";
  const width = element.width ? `width="${element.width}"` : "";
  const height = element.height ? `height="${element.height}"` : "";

  return `<img src="${src}" alt="${alt}" ${width} ${height} style="${styles}" />`;
};

/**
 * Generate HTML for a button element
 */
const generateButtonElement = (element) => {
  const buttonStyles = generateInlineStyles(element.styles || {});
  const href = element.href || element.url || "#";
  const text = element.text || element.content || "Click here";

  // Use table-based button for better email client compatibility
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="${buttonStyles}">
          <a href="${href}" style="color: inherit; text-decoration: none; display: block;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
};

/**
 * Generate HTML for a divider element
 */
const generateDividerElement = (element) => {
  const styles = generateInlineStyles(element.styles || {
    borderTop: "1px solid #e0e0e0",
    margin: "20px 0",
  });

  return `<hr style="${styles}" />`;
};

/**
 * Generate HTML for a spacer element
 */
const generateSpacerElement = (element) => {
  const height = element.height || element.size || 20;

  return `<div style="height: ${height}px; line-height: ${height}px; font-size: 0;">&nbsp;</div>`;
};

/**
 * Generate HTML for social icons
 */
const generateSocialElement = (element) => {
  const links = element.links || element.socialLinks || [];
  const iconSize = element.iconSize || 32;
  const spacing = element.spacing || 10;

  if (!links.length) return "";

  const socialHtml = links
    .map(
      (link) => `
      <td style="padding: 0 ${spacing}px;">
        <a href="${link.url || "#"}" style="text-decoration: none;">
          <img src="${link.icon || link.iconUrl}" alt="${link.platform || link.name}" width="${iconSize}" height="${iconSize}" style="display: block; border: 0;" />
        </a>
      </td>
    `
    )
    .join("");

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
      <tr>
        ${socialHtml}
      </tr>
    </table>
  `;
};

/**
 * Generate HTML for a container/section element
 */
const generateContainer = (element) => {
  const styles = generateInlineStyles(element.styles || {});
  const children = element.children || element.elements || [];
  const childrenHtml = children.map((child) => generateElement(child)).join("");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="${styles}">
          ${childrenHtml}
        </td>
      </tr>
    </table>
  `;
};

/**
 * Generate HTML for columns layout
 */
const generateColumnsElement = (element) => {
  const columns = element.columns || element.children || [];
  const columnWidth = `${100 / columns.length}%`;

  const columnsHtml = columns
    .map((column) => {
      const columnStyles = generateInlineStyles(column.styles || {});
      const columnContent = (column.children || column.elements || [])
        .map((child) => generateElement(child))
        .join("");

      return `
        <td width="${columnWidth}" valign="top" style="${columnStyles}">
          ${columnContent}
        </td>
      `;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        ${columnsHtml}
      </tr>
    </table>
  `;
};

/**
 * Main function to generate HTML for any element based on type
 */
const generateElement = (element) => {
  if (!element || !element.type) {
    console.warn("Element missing or has no type:", element);
    return "";
  }

  const type = element.type.toLowerCase();

  switch (type) {
    case "text":
    case "heading":
    case "paragraph":
    case "title":
      return generateTextElement(element);

    case "image":
    case "img":
      return generateImageElement(element);

    case "button":
    case "cta":
      return generateButtonElement(element);

    case "divider":
    case "hr":
    case "separator":
      return generateDividerElement(element);

    case "spacer":
    case "space":
      return generateSpacerElement(element);

    case "social":
    case "socialicons":
    case "social-icons":
      return generateSocialElement(element);

    case "container":
    case "section":
    case "box":
      return generateContainer(element);

    case "columns":
    case "column":
    case "grid":
      return generateColumnsElement(element);

    default:
      console.warn(`Unknown element type: ${element.type}`);
      // Try to render children if they exist
      if (element.children || element.elements) {
        return generateContainer(element);
      }
      return "";
  }
};

/**
 * Generate complete HTML email template
 * THIS IS THE MAIN FUNCTION YOU'LL CALL
 */
const generateEmailHTML = (templateData) => {
  try {
    if (!templateData) {
      throw new Error("Template data is required");
    }

    const {
      name = "Email Template",
      elements = [],
      settings = {},
    } = templateData;

    // Default settings
    const backgroundColor = settings.backgroundColor || "#f4f4f4";
    const contentWidth = settings.contentWidth || "600px";
    const fontFamily =
      settings.fontFamily || "Arial, Helvetica, sans-serif";
    const padding = settings.padding || "20px";

    // Generate body content from elements
    const bodyContent = elements.map((element) => generateElement(element)).join("");

    // Complete HTML with email-safe structure
    const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${name}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding: 10px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${backgroundColor}; font-family: ${fontFamily};">
  <center style="width: 100%; background-color: ${backgroundColor};">
    <div class="email-container" style="max-width: ${contentWidth}; margin: 0 auto;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: ${contentWidth}; margin: 0 auto;">
        <tr>
          <td style="padding: ${padding}; background-color: #ffffff;">
            ${bodyContent}
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>`;

    return {
      success: true,
      html: html.trim(),
    };
  } catch (error) {
    console.error("Error generating email HTML:", error);
    return {
      success: false,
      message: error.message || "Failed to generate email HTML",
      error: error,
    };
  }
};

/**
 * Generate plain text version of email (fallback for email clients)
 */
const generatePlainText = (templateData) => {
  try {
    const extractText = (elements) => {
      if (!Array.isArray(elements)) return "";

      return elements
        .map((element) => {
          const type = element.type?.toLowerCase();

          if (type === "text" || type === "heading" || type === "paragraph") {
            return element.content || element.text || "";
          }

          if (type === "button") {
            return `${element.text || ""} - ${element.href || ""}`;
          }

          if (element.children || element.elements) {
            return extractText(element.children || element.elements);
          }

          return "";
        })
        .filter((text) => text.trim())
        .join("\n\n");
    };

    const plainText = extractText(templateData.elements || []);

    return {
      success: true,
      text: plainText,
    };
  } catch (error) {
    console.error("Error generating plain text:", error);
    return {
      success: false,
      message: error.message || "Failed to generate plain text",
      error: error,
    };
  }
};

/**
 * Validate template data before generating HTML
 */
const validateTemplateData = (templateData) => {
  if (!templateData) {
    return { valid: false, error: "Template data is required" };
  }

  if (!templateData.elements || !Array.isArray(templateData.elements)) {
    return { valid: false, error: "Template must have elements array" };
  }

  if (templateData.elements.length === 0) {
    return { valid: false, error: "Template must have at least one element" };
  }

  return { valid: true };
};

// Export service
const htmlTemplateGenerator = {
  generateEmailHTML,
  generatePlainText,
  validateTemplateData,
  generateElement, // Export for testing individual elements
};

export default htmlTemplateGenerator;

// Named exports
export { generateEmailHTML, generatePlainText, validateTemplateData };
