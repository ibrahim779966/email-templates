// EmailPreviewUnified-Enhanced.jsx - Complete Email Preview with Zoho + Professional UI

import React, { useRef, useEffect, useState } from "react";

// ============================================================================
// EMBEDDED HTML GENERATOR (Complete Backend Logic with All Client Features)
// ============================================================================

const SOCIAL_ICON_URLS = {
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

const CONTAINER_TYPES = ["section", "grid", "item", "column", "row"];

const EMAIL_CLIENTS = [
  {
    id: "gmail",
    name: "Gmail",
    icon: "📧",
    color: "#EA4335",
    support: "✓ Modern CSS",
  },
  {
    id: "gmail-dark",
    name: "Gmail Dark",
    icon: "🌙",
    color: "#202124",
    support: "✓ Dark Mode",
  },
  {
    id: "outlook",
    name: "Outlook",
    icon: "📮",
    color: "#0078D4",
    support: "⚠ Limited CSS",
  },
  {
    id: "apple",
    name: "Apple Mail",
    icon: "🍎",
    color: "#555555",
    support: "✓ Full Support",
  },
  {
    id: "yahoo",
    name: "Yahoo",
    icon: "⚡",
    color: "#7B0099",
    support: "✓ Good Support",
  },
  {
    id: "ios",
    name: "iOS Mail",
    icon: "📱",
    color: "#34C759",
    support: "✓ Mobile",
  },
  {
    id: "zoho",
    name: "Zoho Mail",
    icon: "🦁",
    color: "#088b63",
    support: "✓ Modern CSS",
  },
];

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
  if (!styles || !styles.borderWidth || styles.borderWidth === "0px")
    return "none";
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

function generateContainerHTML(element, globalSettings, depth = 0) {
  const { type, styles, children } = element;
  const childrenHTML = (children || [])
    .map((child) => generateElementHTML(child, globalSettings, depth + 1))
    .filter(Boolean)
    .join("\n");

  switch (type) {
    case "section": {
      const bgColor = styles?.backgroundColor
        ? `background-color: ${styles.backgroundColor};`
        : "";
      const tdStyles = `padding: ${
        buildPadding(styles) || "20px"
      }; ${bgColor} border: ${getBorderStyles(
        styles
      )}; border-radius: ${buildBorderRadius(styles)}; box-sizing: border-box;`;
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
      const bgColor = styles?.backgroundColor
        ? `background-color: ${styles.backgroundColor};`
        : "";
      const gridTdStyles = `padding: ${
        buildPadding(styles) || "16px"
      }; ${bgColor} border: ${getBorderStyles(
        styles
      )}; border-radius: ${buildBorderRadius(styles)}; box-sizing: border-box;`;
      const rowsHtml = rows
        .map((row) => {
          const cellWidth = Math.floor(100 / columnCount);
          const cellsHtml = row
            .map((child, cellIdx) => {
              const cellPadding = cellIdx > 0 ? `0 0 0 ${gap}px` : "0";
              return `<td width="${cellWidth}%" style="vertical-align: top; padding: ${cellPadding}; border-collapse: collapse; box-sizing: border-box;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${generateElementHTML(
                child,
                globalSettings,
                depth + 1
              )}</table></td>`;
            })
            .join("\n");
          return `<tr style="border-collapse: collapse;">${cellsHtml}</tr>`;
        })
        .join("\n");
      return `<tr><td style="${gridTdStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${rowsHtml}</table></td></tr>`;
    }
    case "item": {
      const bgColor = styles?.backgroundColor
        ? `background-color: ${styles.backgroundColor};`
        : "";
      const itemTdStyles = `padding: ${
        buildPadding(styles) || "12px"
      }; ${bgColor} border: ${getBorderStyles(
        styles
      )}; border-radius: ${buildBorderRadius(styles)}; box-sizing: border-box;`;
      return `<tr><td style="${itemTdStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${childrenHTML}</table></td></tr>`;
    }
    case "column": {
      const bgColor = styles?.backgroundColor
        ? `background-color: ${styles.backgroundColor};`
        : "";
      const colTdStyles = `padding: ${
        buildPadding(styles) || "12px"
      }; ${bgColor} border: ${getBorderStyles(
        styles
      )}; box-sizing: border-box;`;
      return `<tr><td style="${colTdStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${childrenHTML}</table></td></tr>`;
    }
    case "row": {
      const rowChildren = children || [];
      const rowCellWidth =
        rowChildren.length > 0 ? Math.floor(100 / rowChildren.length) : 100;
      const rowGap = parseInt(styles?.gap || "12px");
      const bgColor = styles?.backgroundColor
        ? `background-color: ${styles.backgroundColor};`
        : "";
      const rowTdStyles = `padding: ${
        buildPadding(styles) || "12px"
      }; ${bgColor} border: ${getBorderStyles(
        styles
      )}; box-sizing: border-box;`;
      const cellsHtml = rowChildren
        .map(
          (child, idx) =>
            `<td width="${rowCellWidth}%" style="vertical-align: top; padding: ${
              idx > 0 ? `0 0 0 ${rowGap}px` : "0"
            }; border-collapse: collapse; box-sizing: border-box;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;">${generateElementHTML(
              child,
              globalSettings,
              depth + 1
            )}</table></td>`
        )
        .join("\n");
      return `<tr><td style="${rowTdStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;"><tr>${cellsHtml}</tr></table></td></tr>`;
    }
    default:
      return `<!-- Unknown container type: ${type} -->`;
  }
}

function generateHeadingHTML(element, globalSettings) {
  const { content, styles } = element;
  const tag = styles?.headingLevel || "h2";
  const bgColor = styles?.backgroundColor
    ? `background-color: ${styles.backgroundColor};`
    : "";
  const headingStyles = `margin: ${buildMargin(styles) || "0"}; padding: ${
    buildPadding(styles) || "0"
  }; font-family: ${
    styles?.fontFamily || globalSettings?.fontFamily || "Arial, sans-serif"
  }; font-size: ${styles?.fontSize || "28px"}; font-weight: ${
    styles?.fontWeight || "700"
  }; font-style: ${styles?.fontStyle || "normal"}; color: ${
    styles?.color || "#1a1a1a"
  }; line-height: ${styles?.lineHeight || "1.4"}; text-decoration: ${
    styles?.textDecoration || "none"
  }; text-align: ${
    styles?.textAlign || "left"
  }; ${bgColor} border: ${getBorderStyles(
    styles
  )}; border-radius: ${buildBorderRadius(
    styles
  )}; max-width: 600px; box-sizing: border-box; word-wrap: break-word;`;
  return `<tr><td style="padding: 0;"><${tag} style="${headingStyles}">${escapeHtml(
    content || "Heading"
  )}</${tag}></td></tr>`;
}

function generateTextHTML(element, globalSettings) {
  const { content, styles } = element;
  const bgColor = styles?.backgroundColor
    ? `background-color: ${styles.backgroundColor};`
    : "";
  const textStyles = `margin: ${buildMargin(styles) || "0"}; padding: ${
    buildPadding(styles) || "0"
  }; font-family: ${
    styles?.fontFamily || globalSettings?.fontFamily || "Arial, sans-serif"
  }; font-size: ${styles?.fontSize || "16px"}; font-weight: ${
    styles?.fontWeight || "400"
  }; font-style: ${styles?.fontStyle || "normal"}; color: ${
    styles?.color || "#333333"
  }; line-height: ${styles?.lineHeight || "1.6"}; text-decoration: ${
    styles?.textDecoration || "none"
  }; text-align: ${
    styles?.textAlign || "left"
  }; ${bgColor} border: ${getBorderStyles(
    styles
  )}; border-radius: ${buildBorderRadius(
    styles
  )}; max-width: 600px; box-sizing: border-box; word-wrap: break-word;`;
  return `<tr><td style="padding: 0;"><p style="${textStyles}">${escapeHtml(
    content || "Text content"
  )}</p></td></tr>`;
}

function generateImageHTML(element) {
  if (!element || !element.content) return "<!-- No image content -->";
  const { content: imageSrc, styles = {}, altText = "Image" } = element;
  const width = Math.min(parseInt(styles.width) || 300, 600);
  const height = parseInt(styles.height) || 200;
  const borderWidth = parseInt(styles.borderWidth) || 0;
  const borderStyle = styles.borderStyle || "solid";
  const borderColor = styles.borderColor || "#000000";
  const borderCSS =
    borderWidth > 0
      ? `border: ${borderWidth}px ${borderStyle} ${borderColor};`
      : "border: none;";
  const shapeType = styles.shapeType || "rectangle";
  let borderRadius = "0px";
  if (shapeType === "circle" || shapeType === "oval") borderRadius = "50%";
  else if (shapeType === "rounded-rectangle")
    borderRadius = styles.borderRadius || "12px";
  const borderRadiusCSS =
    shapeType === "trapezoid" || shapeType === "star"
      ? ""
      : `border-radius: ${borderRadius};`;
  const opacity = styles.opacity !== undefined ? parseFloat(styles.opacity) : 1;
  const opacityCSS = opacity < 1 ? `opacity: ${opacity};` : "";
  return `<tr><td style="padding: 0;"><table role="presentation" width="${width}" cellpadding="0" cellspacing="0" border="0" style="width: ${width}px; max-width: 600px; margin: 0; padding: 0; border-collapse: collapse; box-sizing: border-box;"><tr><td style="width: ${width}px; height: ${height}px; padding: 0; margin: 0; overflow: hidden; ${borderCSS} ${borderRadiusCSS} box-sizing: border-box;"><img src="${imageSrc}" alt="${altText}" width="${width}" height="${height}" style="width: ${width}px; max-width: 600px; height: ${height}px; display: block; margin: 0; padding: 0; border: none; ${opacityCSS} box-sizing: border-box;" /></td></tr></table></td></tr>`;
}

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
  const buttonStyles = `display: inline-block; padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px; font-family: ${
    styles?.fontFamily || globalSettings?.fontFamily || "Arial, sans-serif"
  }; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${textColor}; background-color: ${bgColor}; text-decoration: none; border-radius: ${borderRadius}px; border: ${border}; line-height: 1.4; text-align: center; max-width: 600px; box-sizing: border-box;`;
  const htmlButton = `<a href="${
    link || "#"
  }" target="_blank" style="${buttonStyles}">${escapeHtml(
    content || "Click Here"
  )}</a>`;
  return `<tr><td align="${styles?.textAlign || "center"}" style="padding: ${
    buildPadding(styles) || "10px 0"
  }; box-sizing: border-box;">${htmlButton}</td></tr>`;
}

function generateDividerHTML(element) {
  const { styles } = element;
  return `<tr><td style="padding: ${
    buildPadding(styles) || "12px 0"
  }; box-sizing: border-box;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: collapse; box-sizing: border-box;"><tr><td style="border-top: ${
    styles?.borderTopWidth || styles?.borderWidth || "2px"
  } ${styles?.borderTopStyle || styles?.borderStyle || "solid"} ${
    styles?.borderTopColor || styles?.borderColor || "#d1d5db"
  }; line-height: 0; font-size: 0; box-sizing: border-box;">&nbsp;</td></tr></table></td></tr>`;
}

function generateSocialHTML(element) {
  const { icons, styles } = element;
  if (!icons || icons.length === 0) return "";
  const iconSize = extractNumericValue(styles?.iconSize) || 32;
  const gap = extractNumericValue(styles?.gap) || 12;
  const iconsHtml = icons
    .map((icon) => {
      const platform = icon.platform?.toLowerCase();
      const iconUrl = SOCIAL_ICON_URLS[platform];
      return `<td style="padding: 0 ${
        gap / 2
      }px; text-align: center; box-sizing: border-box;"><a href="${
        icon.url || "#"
      }" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">${
        iconUrl
          ? `<img src="${iconUrl}" alt="${
              platform || "Social"
            }" width="${iconSize}" height="${iconSize}" style="display: block; border: none; width: ${iconSize}px; height: ${iconSize}px; box-sizing: border-box;" border="0" />`
          : `<span style="font-size: 24px; color: ${
              styles?.iconColor || "#666"
            };">●</span>`
      }</a></td>`;
    })
    .join("");
  const bgColor = styles?.backgroundColor
    ? `background-color: ${styles.backgroundColor};`
    : "";
  const socialStyles = `padding: ${
    buildPadding(styles) || "12px 0"
  }; ${bgColor} border: ${getBorderStyles(
    styles
  )}; border-radius: ${buildBorderRadius(styles)}; box-sizing: border-box;`;
  return `<tr><td align="${
    styles?.textAlign || "center"
  }" style="${socialStyles}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse: collapse; max-width: 600px; box-sizing: border-box;"><tr>${iconsHtml}</tr></table></td></tr>`;
}

function generateShapeHTML(element) {
  const { styles } = element;
  const width = Math.min(extractNumericValue(styles?.width) || 200, 600);
  const height = extractNumericValue(styles?.height) || 200;
  const bgColor = styles?.backgroundColor
    ? `background-color: ${styles.backgroundColor};`
    : "";
  const shapeStyles = `${bgColor} border: ${getBorderStyles(
    styles
  )}; border-radius: ${buildBorderRadius(
    styles
  )}; width: ${width}px; height: ${height}px; line-height: ${height}px; font-size: 0; box-sizing: border-box;`;
  return `<tr><td align="center" style="padding: ${
    buildMargin(styles) || "0"
  }; box-sizing: border-box;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; box-sizing: border-box;"><tr><td width="${width}" height="${height}" style="${shapeStyles}">&nbsp;</td></tr></table></td></tr>`;
}

function generateEmailHTML(template) {
  const { elements, globalSettings, name } = template;
  const elementsHtml = (elements || [])
    .map((element) => generateElementHTML(element, globalSettings, 0))
    .filter(Boolean)
    .join("\n");
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

function getClientPreviewHTML(emailHTML, clientType) {
  const isDark = clientType === "gmail-dark";
  const bgColor = isDark ? "#1a1a1a" : "#f5f5f5";
  const textColor = isDark ? "#e0e0e0" : "#202124";
  const paperColor = isDark ? "#2d2d2d" : "#ffffff";

  const baseStyle = `* { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } body { margin: 0; padding: 0; min-height: 100vh; width: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; } img { border: 0; max-width: 100%; -ms-interpolation-mode: bicubic; } table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }`;

  if (clientType === "gmail" || clientType === "gmail-dark") {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="x-apple-disable-message-reformatting"><style>${baseStyle} body { background-color: ${bgColor}; color: ${textColor}; } .container { background-color: ${bgColor}; padding: 20px; min-height: 100vh; } .paper { background-color: ${paperColor}; color: ${
      isDark ? "#e0e0e0" : "#202124"
    }; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,${
      isDark ? "0.5" : "0.15"
    }); max-width: 600px; margin: 0 auto; overflow: hidden; } ${
      isDark ? ".paper img { opacity: 0.95; }" : ""
    }</style></head><body><div class="container"><div class="paper">${emailHTML}</div></div></body></html>`;
  }

  if (clientType === "outlook") {
    return `<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><style>${baseStyle} body { background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif !important; } .container { background-color: #ffffff; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; box-shadow: 0 1px 3px rgba(0,0,0,0.1); } table { width: 100%; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; } td { mso-line-height-rule: exactly; }</style><!--[if mso]><style type="text/css">body, table, td, div, p, a { font-family: Arial, sans-serif !important; }</style><![endif]--></head><body><div class="container">${emailHTML}</div></body></html>`;
  }

  if (clientType === "apple") {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="x-apple-disable-message-reformatting"><style>${baseStyle} body { background-color: #f0f0f0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; } .container { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.12); overflow: hidden; } table { width: 100%; } img { height: auto; -webkit-text-size-adjust: 100%; }</style></head><body><div class="container">${emailHTML}</div></body></html>`;
  }

  if (clientType === "yahoo") {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${baseStyle} body { background-color: #fafafa; padding: 20px; font-family: Helvetica, Arial, sans-serif; } .container { background-color: #ffffff; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; box-shadow: 0 1px 2px rgba(0,0,0,0.08); } table { width: 100%; } img { display: block; max-width: 100%; }</style></head><body><div class="container">${emailHTML}</div></body></html>`;
  }

  if (clientType === "ios") {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"><meta name="format-detection" content="telephone=no"><meta name="format-detection" content="date=no"><meta name="format-detection" content="address=no"><meta name="format-detection" content="email=no"><meta name="x-apple-disable-message-reformatting"><style>${baseStyle} body { background-color: #f2f2f7; padding: 8px; font-family: -apple-system, BlinkMacSystemFont, "San Francisco", sans-serif; } .container { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.1); } img { -webkit-touch-callout: none; -webkit-user-select: none; } table { width: 100%; border-collapse: collapse; } a { -webkit-tap-highlight-color: rgba(0,0,0,0.3); }</style></head><body><div class="container">${emailHTML}</div></body></html>`;
  }

  if (clientType === "zoho") {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="x-apple-disable-message-reformatting"><style>${baseStyle} body { background: linear-gradient(135deg, #f4fbf9 0%, #f5f7fa 100%); padding: 20px; font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif; } .container { background-color: #ffffff; max-width: 600px; margin: 0 auto; border: 2px solid #088b63; border-radius: 10px; box-shadow: 0 2px 8px rgba(8, 139, 99, 0.13); overflow: hidden; } table { width: 100%; border-collapse: collapse; } img { display: block; max-width: 100%; height: auto; }</style></head><body><div class="container">${emailHTML}</div></body></html>`;
  }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${baseStyle}</style></head><body style="background-color: #f5f5f5; padding: 20px;"><div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"><style>@media (max-width: 600px) { * { max-width: 100% !important; } }</style>${emailHTML}</div></body></html>`;
}

// ============================================================================
// REACT COMPONENT - ENHANCED UNIFIED PREVIEW WITH PROFESSIONAL UI
// ============================================================================

const EmailPreviewUnified = ({ template, globalSettings }) => {
  const iframeRefs = useRef({});
  const [activeClient, setActiveClient] = useState("gmail");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailHTML, setEmailHTML] = useState("");
  const [copyStatus, setCopyStatus] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  // Generate email HTML once
  useEffect(() => {
    try {
      setError(null);
      setLoading(true);
      if (!template?.elements) {
        setError("No template provided");
        setLoading(false);
        return;
      }
      const html = generateEmailHTML({
        elements: template.elements,
        globalSettings: globalSettings,
        name: template.name,
      });
      setEmailHTML(html);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [template, globalSettings]);

  // Render each client preview
  useEffect(() => {
    if (!emailHTML || !iframeRefs.current[activeClient]) return;
    const clientHTML = getClientPreviewHTML(emailHTML, activeClient);
    iframeRefs.current[activeClient].srcdoc = clientHTML;
  }, [emailHTML, activeClient]);

  // Copy HTML to clipboard
  const handleCopyClick = () => {
    try {
      if (!emailHTML) {
        setCopyStatus("❌ No HTML to copy!");
        setTimeout(() => setCopyStatus(null), 2000);
        return;
      }
      const fullHTML = getClientPreviewHTML(emailHTML, activeClient);
      navigator.clipboard.writeText(fullHTML);
      setCopyStatus("✅ Copied to clipboard!");
      setTimeout(() => setCopyStatus(null), 3000);
    } catch (err) {
      setCopyStatus("❌ Failed to copy!");
      setTimeout(() => setCopyStatus(null), 2000);
    }
  };

  // Download HTML file
  const handleDownloadClick = () => {
    try {
      if (!emailHTML) return;
      const fullHTML = getClientPreviewHTML(emailHTML, activeClient);
      const blob = new Blob([fullHTML], { type: "text/html;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `email-${activeClient}-${new Date().getTime()}.html`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const currentClientInfo = EMAIL_CLIENTS.find((c) => c.id === activeClient);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(90deg, #f4fbf9 0%, #f5f7fa 100%)",
        overflow: "hidden",
      }}
    >
      {/* Premium Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "2px solid #e0e0e0",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          gap: "16px",
          flexWrap: "wrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            🌐 Email Client Preview
            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#088b63",
                backgroundColor: "#e8f5f1",
                padding: "4px 10px",
                borderRadius: "12px",
              }}
            >
              7 Clients
            </span>
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#888" }}>
            Test rendering across major email platforms including Zoho
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              backgroundColor: loading
                ? "#fff3cd"
                : error
                ? "#f8d7da"
                : "#d4edda",
              color: loading ? "#856404" : error ? "#721c24" : "#155724",
              fontSize: "13px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "⏳ Generating..." : error ? "⚠ Error" : "✅ Ready"}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyClick}
            disabled={loading || !emailHTML}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #4285f4",
              backgroundColor: loading ? "#f0f0f0" : "#e7f3ff",
              color: loading ? "#999" : "#4285f4",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "13px",
              whiteSpace: "nowrap",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: loading ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 4px rgba(66, 133, 244, 0.1)",
            }}
            title="Copy HTML to clipboard"
          >
            📋 Copy
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownloadClick}
            disabled={loading || !emailHTML}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #28a745",
              backgroundColor: loading ? "#f0f0f0" : "#e7ffe7",
              color: loading ? "#999" : "#28a745",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "13px",
              whiteSpace: "nowrap",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: loading ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 4px rgba(40, 167, 69, 0.1)",
            }}
            title="Download HTML file"
          >
            ⬇️ Download
          </button>

          {/* Info Toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: showInfo ? "#f0f0f0" : "#ffffff",
              color: "#333",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
            title="Toggle client info"
          >
            ℹ️ Info
          </button>

          {/* Copy Status */}
          {copyStatus && (
            <span
              style={{
                fontSize: "13px",
                color: copyStatus.includes("✅") ? "#28a745" : "#d32f2f",
                fontWeight: "600",
                whiteSpace: "nowrap",
                animation: "fadeInOut 3s ease-out",
              }}
            >
              {copyStatus}
            </span>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: "12px 24px",
            backgroundColor: "#fef7e0",
            borderBottom: "1px solid #f9a825",
            color: "#b3791d",
            fontSize: "13px",
            flexShrink: 0,
            fontWeight: "500",
          }}
        >
          ⚠️ <strong>Error:</strong> {error}
        </div>
      )}

      {/* Professional Client Tabs */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#ffffff",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          flexShrink: 0,
          alignItems: "center",
        }}
      >
        {EMAIL_CLIENTS.map((client) => (
          <button
            key={client.id}
            onClick={() => setActiveClient(client.id)}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border:
                activeClient === client.id
                  ? `2px solid ${client.color}`
                  : "1px solid #ddd",
              backgroundColor:
                activeClient === client.id ? client.color + "15" : "#f9f9f9",
              color: activeClient === client.id ? client.color : "#666",
              cursor: "pointer",
              fontWeight: activeClient === client.id ? "600" : "500",
              fontSize: "13px",
              whiteSpace: "nowrap",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              boxShadow:
                activeClient === client.id
                  ? `0 2px 8px ${client.color}20`
                  : "none",
            }}
          >
            <span style={{ fontSize: "16px" }}>{client.icon}</span>
            {client.name}
          </button>
        ))}
      </div>

      {/* Client Info Section */}
      {showInfo && currentClientInfo && (
        <div
          style={{
            padding: "12px 24px",
            backgroundColor: "#f0f8ff",
            borderBottom: "1px solid #b3d9ff",
            fontSize: "13px",
            color: "#0066cc",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
            fontWeight: "500",
          }}
        >
          <span style={{ fontWeight: "700", fontSize: "16px" }}>
            {currentClientInfo.icon}
          </span>
          <div>
            <strong>{currentClientInfo.name}</strong>:{" "}
            {currentClientInfo.support}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #e0e0e0",
              borderTop: "3px solid #088b63",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
            Generating email preview...
          </p>
        </div>
      )}

      {/* Preview Container */}
      {!loading && (
        <div
          style={{
            flex: 1,
            overflow: "auto",
            backgroundColor: "transparent",
            padding: "32px 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div style={{ width: "100%", maxWidth: "700px" }}>
            {EMAIL_CLIENTS.map((client) => (
              <iframe
                key={client.id}
                ref={(el) => (iframeRefs.current[client.id] = el)}
                style={{
                  width: "100%",
                  minHeight: "700px",
                  border: "none",
                  borderRadius: "16px",
                  backgroundColor: "white",
                  display: activeClient === client.id ? "block" : "none",
                  margin: "0 auto",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
                title={`${client.name} Preview`}
                sandbox="allow-same-origin"
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </div>
  );
};

export default EmailPreviewUnified;
