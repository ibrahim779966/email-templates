// htmlGenerator.js - FIXED TO MATCH FRONTEND EXACTLY

// ============================================================================
// CDN-HOSTED SOCIAL ICONS (Email-Safe)
// ============================================================================

const SOCIAL_ICON_URLS = {
  facebook: "https://res.cloudinary.com/dhlex64es/image/upload/v1763013812/templates/ycvjepnwrvnizjronfeb.png",
  twitter: "https://res.cloudinary.com/dhlex64es/image/upload/v1763013924/templates/b23ztquemmmuoqmaegzv.png",
  x: "https://res.cloudinary.com/dhlex64es/image/upload/v1763013986/templates/r3ahm2kjyb30ckmllzu0.png",
  instagram: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014004/templates/vjjw2ykchjhoxas0hngy.png",
  linkedin: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014026/templates/gob1gnrzqfviszy8frvr.png",
  youtube: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014048/templates/jqgvg4j6n3c6fltn1ntr.png",
  whatsapp: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014067/templates/jiwmzlo0i6bgxvzhwtea.png",
  telegram: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014084/templates/wpxstom0c0ujc5uavkwx.png",
  tiktok: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014146/templates/ios7eoewnxvyeowrsglc.png",
  snapchat: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014190/templates/nveuvcx8pimvmdzmfid2.png",
  reddit: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014213/templates/ivsiyzhvgpd2gk5uwhrz.png",
  pinterest: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014171/templates/ej8ayjgqnt8pzigfg85t.png",
  discord: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014234/templates/k3hnm7a133vwawp0vblo.png",
  threads: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014105/templates/fan0wl9fbigypjtosaqc.png",
  wechat: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014340/templates/zn1jabhgkfqtm9q4jczj.png",
  quora: "https://res.cloudinary.com/dhlex64es/image/upload/v1763014355/templates/qxl6sdqf2pehvixadiil.png",
};

const CONTAINER_TYPES = ["section", "grid", "item", "column", "row"];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildPadding(styles) {
  if (!styles) return "0";
  const top = styles.paddingTop || "0";
  const right = styles.paddingRight || "0";
  const bottom = styles.paddingBottom || "0";
  const left = styles.paddingLeft || "0";
  if (top === right && right === bottom && bottom === left) return top;
  return `${top} ${right} ${bottom} ${left}`;
}

function buildMargin(styles) {
  if (!styles) return "0";
  const top = styles.marginTop || "0";
  const right = styles.marginRight || "0";
  const bottom = styles.marginBottom || "0";
  const left = styles.marginLeft || "0";
  if (top === right && right === bottom && bottom === left) return top;
  return `${top} ${right} ${bottom} ${left}`;
}

function buildBorderRadius(styles) {
  if (!styles) return "0";
  const tl = styles.borderTopLeftRadius;
  const tr = styles.borderTopRightRadius;
  const br = styles.borderBottomRightRadius;
  const bl = styles.borderBottomLeftRadius;
  if (tl || tr || br || bl) {
    return `${tl || "0"} ${tr || "0"} ${br || "0"} ${bl || "0"}`;
  }
  return styles.borderRadius || "0";
}

function getBorderStyles(styles) {
  if (!styles || !styles.borderWidth || styles.borderWidth === "0px") return "none";
  const width = styles.borderWidth || "1px";
  const style = styles.borderStyle || "solid";
  const color = styles.borderColor || "#000000";
  return `${width} ${style} ${color}`;
}

function canHaveChildren(elementType) {
  return CONTAINER_TYPES.includes(elementType);
}

function extractNumericValue(value) {
  if (!value) return 0;
  const parsed = parseInt(String(value).replace(/[^0-9]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
}

// ============================================================================
// ELEMENT GENERATORS
// ============================================================================
function generateElementHTML(element, globalSettings, depth = 0) {
  const { type } = element;
  if (canHaveChildren(type)) {
    return generateContainerHTML(element, globalSettings, depth);
  }
  switch (type) {
    case "heading":
    case "header":
      return generateHeadingHTML(element, globalSettings);
    case "text":
      return generateTextHTML(element, globalSettings);
    case "image":
      return generateImageHTML(element);
    case "button":
      return generateButtonHTML(element, globalSettings);
    case "divider":
      return generateDividerHTML(element);
    case "social":
      return generateSocialHTML(element);
    case "shape":
      return generateShapeHTML(element);
    default:
      return `<!-- Unknown element type: ${type} -->`;
  }
}

// ============================================================================
// CONTAINER ELEMENTS (EXACT MATCH TO FRONTEND)
// ============================================================================
function generateContainerHTML(element, globalSettings, depth = 0) {
  const { type, styles, children } = element;
  const childrenHTML = (children || [])
    .map((child) => generateElementHTML(child, globalSettings, depth + 1))
    .filter(Boolean)
    .join("\n");

  switch (type) {
    case "section": {
      const bgColor = styles?.backgroundColor ? `background-color: ${styles.backgroundColor};` : "";
      const tdStyles = `padding: ${buildPadding(styles) || "20px"}; ${bgColor} border: ${getBorderStyles(styles)}; border-radius: ${buildBorderRadius(styles)}; box-sizing: border-box;`;
      return `<tr><td style="${tdStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${childrenHTML}</table></td></tr>`;
    }
    case "grid": {
      const gridColumns = styles?.gridTemplateColumns || "repeat(2, 1fr)";
      let columnCount = 2;
      const repeatMatch = gridColumns.match(/repeat\((\d+),/);
      if (repeatMatch) columnCount = parseInt(repeatMatch[1]);
      const gap = parseInt(styles?.gap || "16px");
      const rows = [];
      for (let i = 0; i < (children || []).length; i += columnCount) {
        rows.push((children || []).slice(i, i + columnCount));
      }
      const bgColor = styles?.backgroundColor ? `background-color: ${styles.backgroundColor};` : "";
      const gridTdStyles = `padding: ${buildPadding(styles) || "16px"}; ${bgColor} border: ${getBorderStyles(styles)}; border-radius: ${buildBorderRadius(styles)}; box-sizing: border-box;`;
      const rowsHtml = rows.map((row) => {
        const cellWidth = Math.floor(100 / columnCount);
        const cellsHtml = row.map((child, cellIdx) => {
          const cellPadding = cellIdx > 0 ? `0 0 0 ${gap}px` : "0";
          return `<td width="${cellWidth}%" style="vertical-align: top; padding: ${cellPadding}; border-collapse: collapse; box-sizing: border-box;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${generateElementHTML(child, globalSettings, depth + 1)}</table></td>`;
        }).join("\n");
        return `<tr style="border-collapse: collapse;">${cellsHtml}</tr>`;
      }).join("\n");
      return `<tr><td style="${gridTdStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${rowsHtml}</table></td></tr>`;
    }
    case "item": {
      const bgColor = styles?.backgroundColor ? `background-color: ${styles.backgroundColor};` : "";
      const itemTdStyles = `padding: ${buildPadding(styles) || "12px"}; ${bgColor} border: ${getBorderStyles(styles)}; border-radius: ${buildBorderRadius(styles)}; box-sizing: border-box;`;
      return `<tr><td style="${itemTdStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${childrenHTML}</table></td></tr>`;
    }
    case "column": {
      const bgColor = styles?.backgroundColor ? `background-color: ${styles.backgroundColor};` : "";
      const colTdStyles = `padding: ${buildPadding(styles) || "12px"}; ${bgColor} border: ${getBorderStyles(styles)}; box-sizing: border-box;`;
      return `<tr><td style="${colTdStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${childrenHTML}</table></td></tr>`;
    }
    case "row": {
      const rowChildren = children || [];
      const rowCellWidth = rowChildren.length > 0 ? Math.floor(100 / rowChildren.length) : 100;
      const rowGap = parseInt(styles?.gap || "12px");
      const bgColor = styles?.backgroundColor ? `background-color: ${styles.backgroundColor};` : "";
      const rowTdStyles = `padding: ${buildPadding(styles) || "12px"}; ${bgColor} border: ${getBorderStyles(styles)}; box-sizing: border-box;`;
      const cellsHtml = rowChildren.map((child, idx) => `<td width="${rowCellWidth}%" style="vertical-align: top; padding: ${idx > 0 ? `0 0 0 ${rowGap}px` : "0"}; border-collapse: collapse; box-sizing: border-box;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${generateElementHTML(child, globalSettings, depth + 1)}</table></td>`).join("\n");
      return `<tr><td style="${rowTdStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;"><tr>${cellsHtml}</tr></table></td></tr>`;
    }
    default:
      return `<!-- Unknown container type: ${type} -->`;
  }
}

// ============================================================================
// TEXT ELEMENTS (EXACT MATCH TO FRONTEND)
// ============================================================================
function generateHeadingHTML(element, globalSettings) {
  const { content, styles } = element;
  const tag = styles?.headingLevel || "h2";
  const bgColor = styles?.backgroundColor ? `background-color: ${styles.backgroundColor};` : "";
  const headingStyles = `margin: ${buildMargin(styles) || "0"}; padding: ${buildPadding(styles) || "0"}; font-family: ${styles?.fontFamily || globalSettings?.fontFamily || "Arial, sans-serif"}; font-size: ${styles?.fontSize || "28px"}; font-weight: ${styles?.fontWeight || "700"}; font-style: ${styles?.fontStyle || "normal"}; color: ${styles?.color || "#1a1a1a"}; line-height: ${styles?.lineHeight || "1.4"}; text-decoration: ${styles?.textDecoration || "none"}; text-align: ${styles?.textAlign || "left"}; ${bgColor} border: ${getBorderStyles(styles)}; border-radius: ${buildBorderRadius(styles)}; max-width: 600px; box-sizing: border-box; word-wrap: break-word;`;
  return `<tr><td style="padding: 0;"><${tag} style="${headingStyles}">${escapeHtml(content || "Heading")}</${tag}></td></tr>`;
}

function generateTextHTML(element, globalSettings) {
  const { content, styles } = element;
  const bgColor = styles?.backgroundColor ? `background-color: ${styles.backgroundColor};` : "";
  const textStyles = `margin: ${buildMargin(styles) || "0"}; padding: ${buildPadding(styles) || "0"}; font-family: ${styles?.fontFamily || globalSettings?.fontFamily || "Arial, sans-serif"}; font-size: ${styles?.fontSize || "16px"}; font-weight: ${styles?.fontWeight || "400"}; font-style: ${styles?.fontStyle || "normal"}; color: ${styles?.color || "#333333"}; line-height: ${styles?.lineHeight || "1.6"}; text-decoration: ${styles?.textDecoration || "none"}; text-align: ${styles?.textAlign || "left"}; ${bgColor} border: ${getBorderStyles(styles)}; border-radius: ${buildBorderRadius(styles)}; max-width: 600px; box-sizing: border-box; word-wrap: break-word;`;
  return `<tr><td style="padding: 0;"><p style="${textStyles}">${escapeHtml(content || "Text content")}</p></td></tr>`;
}

// ============================================================================
// IMAGE ELEMENT (EXACT MATCH TO FRONTEND - NO COMMENTS, NO EXTRA WHITESPACE)
// ============================================================================
function generateImageHTML(element) {
  if (!element || !element.content) return "<!-- No image content -->";
  const { content: imageSrc, styles = {}, altText = "Image" } = element;
  const width = Math.min(parseInt(styles.width) || 300, 600);
  const height = parseInt(styles.height) || 200;
  const borderWidth = parseInt(styles.borderWidth) || 0;
  const borderStyle = styles.borderStyle || "solid";
  const borderColor = styles.borderColor || "#000000";
  const borderCSS = borderWidth > 0 ? `border: ${borderWidth}px ${borderStyle} ${borderColor};` : "border: none;";
  const shapeType = styles.shapeType || "rectangle";
  let borderRadius = "0px";
  if (shapeType === "circle" || shapeType === "oval") borderRadius = "50%";
  else if (shapeType === "rounded-rectangle") borderRadius = styles.borderRadius || "12px";
  const borderRadiusCSS = shapeType === "trapezoid" || shapeType === "star" ? "" : `border-radius: ${borderRadius};`;
  const opacity = styles.opacity !== undefined ? parseFloat(styles.opacity) : 1;
  const opacityCSS = opacity < 1 ? `opacity: ${opacity};` : "";
  return `<tr><td style="padding: 0;"><table role="presentation" width="${width}" cellpadding="0" cellspacing="0" border="0" style="width: ${width}px; max-width: 600px; margin: 0; padding: 0; border-collapse: collapse; box-sizing: border-box;"><tr><td style="width: ${width}px; height: ${height}px; padding: 0; margin: 0; overflow: hidden; ${borderCSS} ${borderRadiusCSS} box-sizing: border-box;"><img src="${imageSrc}" alt="${altText}" width="${width}" height="${height}" style="width: ${width}px; max-width: 600px; height: ${height}px; display: block; margin: 0; padding: 0; border: none; ${opacityCSS} box-sizing: border-box;" /></td></tr></table></td></tr>`;
}

// ============================================================================
// BUTTON ELEMENT (EXACT MATCH TO FRONTEND)
// ============================================================================
function generateButtonHTML(element, globalSettings) {
  const { content, link, styles } = element;
  const paddingTop = extractNumericValue(styles?.paddingTop) || 12;
  const paddingRight = extractNumericValue(styles?.paddingRight) || 24;
  const paddingBottom = extractNumericValue(styles?.paddingBottom) || 12;
  const paddingLeft = extractNumericValue(styles?.paddingLeft) || 24;
  const bgColor = styles?.backgroundColor || "#007bff";
  const textColor = styles?.color || "#ffffff";
  const fontSize = styles?.fontSize || "16px";
  const fontWeight = styles?.fontWeight || "600";
  const borderRadius = extractNumericValue(buildBorderRadius(styles)) || 6;
  const border = getBorderStyles(styles);
  const buttonStyles = `display: inline-block; padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px; font-family: ${styles?.fontFamily || globalSettings?.fontFamily || "Arial, sans-serif"}; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${textColor}; background-color: ${bgColor}; text-decoration: none; border-radius: ${borderRadius}px; border: ${border}; line-height: 1.4; text-align: center; max-width: 600px; box-sizing: border-box;`;
  const htmlButton = `<a href="${link || "#"}" target="_blank" style="${buttonStyles}">${escapeHtml(content || "Click Here")}</a>`;
  return `<tr><td align="${styles?.textAlign || "center"}" style="padding: ${buildPadding(styles) || "10px 0"}; box-sizing: border-box;">${htmlButton}</td></tr>`;
}

// ============================================================================
// DIVIDER ELEMENT (EXACT MATCH TO FRONTEND)
// ============================================================================
function generateDividerHTML(element) {
  const { styles } = element;
  return `<tr><td style="padding: ${buildPadding(styles) || "12px 0"}; box-sizing: border-box;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;"><tr><td style="border-top: ${styles?.borderTopWidth || styles?.borderWidth || "2px"} ${styles?.borderTopStyle || styles?.borderStyle || "solid"} ${styles?.borderTopColor || styles?.borderColor || "#d1d5db"}; line-height: 0; font-size: 0; box-sizing: border-box;">&nbsp;</td></tr></table></td></tr>`;
}

// ============================================================================
// SOCIAL ICONS (EXACT MATCH TO FRONTEND)
// ============================================================================
function generateSocialHTML(element) {
  const { icons, styles } = element;
  if (!icons || icons.length === 0) return "";
  const iconSize = extractNumericValue(styles?.iconSize) || 32;
  const gap = extractNumericValue(styles?.gap) || 12;
  const iconsHtml = icons.map((icon) => {
    const platform = icon.platform?.toLowerCase();
    const iconUrl = SOCIAL_ICON_URLS[platform];
    return `<td style="padding: 0 ${gap / 2}px; text-align: center; box-sizing: border-box;"><a href="${icon.url || "#"}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">${iconUrl ? `<img src="${iconUrl}" alt="${platform || "Social"}" width="${iconSize}" height="${iconSize}" style="display: block; border: none; width: ${iconSize}px; height: ${iconSize}px; box-sizing: border-box;" border="0" />` : `<span style="font-size: 24px; color: ${styles?.iconColor || "#666"};">●</span>`}</a></td>`;
  }).join("");
  const bgColor = styles?.backgroundColor ? `background-color: ${styles.backgroundColor};` : "";
  const socialStyles = `padding: ${buildPadding(styles) || "12px 0"}; ${bgColor} border: ${getBorderStyles(styles)}; border-radius: ${buildBorderRadius(styles)}; box-sizing: border-box;`;
  return `<tr><td align="${styles?.textAlign || "center"}" style="${socialStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse: collapse; max-width: 600px; box-sizing: border-box;"><tr>${iconsHtml}</tr></table></td></tr>`;
}

// ============================================================================
// SHAPE ELEMENT (EXACT MATCH TO FRONTEND)
// ============================================================================
function generateShapeHTML(element) {
  const { styles } = element;
  const width = Math.min(extractNumericValue(styles?.width) || 200, 600);
  const height = extractNumericValue(styles?.height) || 200;
  const bgColor = styles?.backgroundColor ? `background-color: ${styles.backgroundColor};` : "";
  const shapeStyles = `${bgColor} border: ${getBorderStyles(styles)}; border-radius: ${buildBorderRadius(styles)}; width: ${width}px; height: ${height}px; line-height: ${height}px; font-size: 0; box-sizing: border-box;`;
  return `<tr><td align="center" style="padding: ${buildMargin(styles) || "0"}; box-sizing: border-box;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; box-sizing: border-box;"><tr><td width="${width}" height="${height}" style="${shapeStyles}">&nbsp;</td></tr></table></td></tr>`;
}

// ============================================================================
// MAIN HTML GENERATOR (EXACT MATCH TO FRONTEND)
// ============================================================================
function generateEmailHTML(template) {
  const { elements, globalSettings, name } = template;
  const elementsHtml = (elements || []).map((element) => generateElementHTML(element, globalSettings, 0)).filter(Boolean).join("\n");
  const maxWidth = "600px";
  const bodyBg = globalSettings?.backgroundColor || "#f5f5f5";
  const newsletterBg = globalSettings?.newsletterColor || "#ffffff";
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(name || "Newsletter")}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0 !important; padding: 0 !important; min-height: 100% !important; width: 100% !important; background-color: ${bodyBg} !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    * { -mso-table-lspace: 0pt; -mso-table-rspace: 0pt; }
    img { border: 0 !important; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; max-width: 600px; box-sizing: border-box; -ms-interpolation-mode: bicubic; }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; max-width: 600px; box-sizing: border-box; }
    td { border-collapse: collapse; mso-line-height-rule: exactly; box-sizing: border-box; }
    h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; font-weight: bold; line-height: 1.2; max-width: 600px; box-sizing: border-box; word-wrap: break-word; }
    p { margin: 0; padding: 0; max-width: 600px; box-sizing: border-box; word-wrap: break-word; }
    a { color: inherit; text-decoration: none; max-width: 600px; box-sizing: border-box; -webkit-text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .wrapper { width: 100% !important; max-width: 600px !important; }
      table { width: 100% !important; max-width: 600px !important; }
      img { max-width: 100% !important; height: auto !important; }
      td { width: 100% !important; }
    }
    @supports (display: grid) {
      .wrapper { display: grid; }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, div, p, a { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${bodyBg};">
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${bodyBg};">
    <tr>
      <td width="100%">
  <![endif]-->
  <center style="width: 100%; background-color: ${bodyBg};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${bodyBg}; max-width: 600px; box-sizing: border-box;">
      <tr><td align="center" style="padding: 20px 0;">
        <table role="presentation" class="wrapper" cellpadding="0" cellspacing="0" border="0" style="width: ${maxWidth}; max-width: 600px; background-color: ${newsletterBg}; border-collapse: collapse; box-sizing: border-box;">
          ${elementsHtml}
        </table>
      </td></tr>
    </table>
  </center>
  <!--[if mso | IE]>
      </td>
    </tr>
  </table>
  <![endif]-->
</body>
</html>`.trim();
}

// ============================================================================
// PLAIN TEXT VERSION
// ============================================================================
function generatePlainText(template) {
  const { elements } = template;
  const extractText = (element) => {
    let text = "";
    switch (element.type) {
      case "heading":
      case "header":
        text = `\n${element.content || "Heading"}\n${"=".repeat((element.content || "Heading").length)}\n`;
        break;
      case "text":
        text = `\n${element.content || "Text content"}\n`;
        break;
      case "button":
        text = `\n[${element.content || "Click Here"}] (${element.link || "#"})\n`;
        break;
      case "divider":
        text = "\n---\n";
        break;
      case "social":
        if (element.icons && element.icons.length > 0) {
          text = `\nFollow us:\n${element.icons.map((icon) => `${icon.platform}: ${icon.url}`).join("\n")}\n`;
        }
        break;
      default:
        break;
    }
    if (element.children && element.children.length > 0) {
      text += element.children.map(extractText).join("");
    }
    return text;
  };
  return elements.map(extractText).filter(Boolean).join("") || "Plain text version of your newsletter.";
}

// ============================================================================
// EXPORTS
// ============================================================================
module.exports = {
  generateEmailHTML,
  generateImageHTML,
  generatePlainText,
  canHaveChildren,
  CONTAINER_TYPES,
  SOCIAL_ICON_URLS,
}