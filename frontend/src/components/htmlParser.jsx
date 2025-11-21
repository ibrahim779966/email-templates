// htmlParser.js - COMPLETE PRODUCTION VERSION WITH DEEP NESTING SUPPORT

/**
 * Validates if a URL is a Cloudinary URL
 */
const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const cloudinaryPattern =
    /^https?:\/\/res\.cloudinary\.com\/[^\/]+\/(image|video|raw)\/upload\/.+/i;
  return cloudinaryPattern.test(url);
};

// ✅ Unique ID counter
let uniqueIdCounter = 0;

const generateUniqueId = (type) => {
  uniqueIdCounter++;
  return `${type}-${Date.now()}-${uniqueIdCounter}`;
};

/**
 * Detect social platform from URL
 */
const detectSocialPlatform = (url) => {
  if (!url) return "website";
  const lowerUrl = url.toLowerCase();

  const platforms = {
    facebook: "facebook",
    twitter: "twitter",
    "x.com": "twitter",
    instagram: "instagram",
    linkedin: "linkedin",
    youtube: "youtube",
    tiktok: "tiktok",
    whatsapp: "whatsapp",
    telegram: "telegram",
    snapchat: "snapchat",
    reddit: "reddit",
    pinterest: "pinterest",
    discord: "discord",
    threads: "threads",
  };

  for (const [key, value] of Object.entries(platforms)) {
    if (lowerUrl.includes(key)) return value;
  }

  return "website";
};

/**
 * Clean font-family string
 */
const cleanFontFamily = (fontFamily) => {
  if (!fontFamily) return "Arial, sans-serif";

  let cleaned = fontFamily.replace(/["']/g, "").split(",")[0].trim();

  const genericFonts = [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
  ];
  if (genericFonts.includes(cleaned.toLowerCase())) {
    return `Arial, ${cleaned}`;
  }

  return `${cleaned}, sans-serif`;
};

/**
 * Parse inline styles
 */
const parseInlineStyles = (element) => {
  const styleAttr = element.getAttribute("style");
  if (!styleAttr) return {};

  const styles = {};
  const declarations = styleAttr.split(";").filter((s) => s.trim());

  declarations.forEach((declaration) => {
    const colonIndex = declaration.indexOf(":");
    if (colonIndex === -1) return;

    const property = declaration.substring(0, colonIndex).trim();
    const value = declaration.substring(colonIndex + 1).trim();

    if (property && value) {
      const camelProperty = property.replace(/-([a-z])/g, (g) =>
        g[1].toUpperCase()
      );
      styles[camelProperty] = value.replace(/!important/g, "").trim();
    }
  });

  return styles;
};

/**
 * Normalize font weight
 */
const normalizeFontWeight = (weight) => {
  if (!weight) return "400";

  const weightMap = {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  };

  const weightStr = String(weight).toLowerCase();
  return weightMap[weightStr] || String(weight);
};

/**
 * Extract positioning from element
 */
const extractPositioning = (element, containerRect) => {
  const rect = element.getBoundingClientRect();
  const inline = parseInlineStyles(element);

  const relativeLeft = containerRect
    ? rect.left - containerRect.left
    : rect.left;
  const relativeTop = containerRect ? rect.top - containerRect.top : rect.top;

  return {
    left: inline.left || `${Math.max(0, Math.round(relativeLeft))}px`,
    top: inline.top || `${Math.max(0, Math.round(relativeTop))}px`,
    width: inline.width || `${Math.round(rect.width)}px`,
    height: inline.height || `${Math.round(rect.height)}px`,
  };
};

/**
 * Extract comprehensive styles from element
 */
const extractStyles = (element, containerRect = null) => {
  const computed = window.getComputedStyle(element);
  const inline = parseInlineStyles(element);
  const positioning = extractPositioning(element, containerRect);

  const styles = {
    position: "absolute",
    left: positioning.left,
    top: positioning.top,
    width: positioning.width,
    height: positioning.height,

    fontSize: computed.fontSize || "16px",
    fontWeight: normalizeFontWeight(computed.fontWeight) || "400",
    fontFamily: cleanFontFamily(computed.fontFamily || inline.fontFamily),
    lineHeight: computed.lineHeight || "1.6",
    textAlign: computed.textAlign || "left",
    fontStyle: computed.fontStyle || "normal",
    textDecoration: computed.textDecoration || "none",
    textTransform: computed.textTransform || "none",
    letterSpacing: computed.letterSpacing || "normal",
    color: computed.color || "#333333",

    padding: computed.padding || "0",
    paddingTop: computed.paddingTop || "0",
    paddingRight: computed.paddingRight || "0",
    paddingBottom: computed.paddingBottom || "0",
    paddingLeft: computed.paddingLeft || "0",
    margin: computed.margin || "0",
    marginTop: computed.marginTop || "0",
    marginRight: computed.marginRight || "0",
    marginBottom: computed.marginBottom || "0",
    marginLeft: computed.marginLeft || "0",

    backgroundColor:
      computed.backgroundColor !== "rgba(0, 0, 0, 0)"
        ? computed.backgroundColor
        : "transparent",

    border: computed.border || "none",
    borderWidth: computed.borderWidth || "0",
    borderStyle: computed.borderStyle || "solid",
    borderColor: computed.borderColor || "#000000",
    borderRadius: computed.borderRadius || "0",
    borderTopLeftRadius: computed.borderTopLeftRadius || "0",
    borderTopRightRadius: computed.borderTopRightRadius || "0",
    borderBottomLeftRadius: computed.borderBottomLeftRadius || "0",
    borderBottomRightRadius: computed.borderBottomRightRadius || "0",
  };

  return { ...styles, ...inline };
};

/**
 * Check if element is a shape
 */
const isShapeElement = (row) => {
  const candidates = row.querySelectorAll("div, span");

  for (const el of candidates) {
    const styles = window.getComputedStyle(el);
    const hasBackground = styles.backgroundColor !== "rgba(0, 0, 0, 0)";
    const hasSize =
      parseFloat(styles.width) > 20 && parseFloat(styles.height) > 20;
    const hasMinimalText = el.textContent.trim().length < 5;
    const isNotTable = !el.querySelector("table");
    const isNotImage = !el.querySelector("img");
    const isNotLink = !el.querySelector("a");

    if (
      hasBackground &&
      hasSize &&
      hasMinimalText &&
      isNotTable &&
      isNotImage &&
      isNotLink
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Check if row contains only images
 */
const isImageRow = (row) => {
  const imgs = row.querySelectorAll("img");
  const text = row.textContent.trim();
  return imgs.length > 0 && text.length < 10;
};

/**
 * Check if row contains social icons
 */
const isSocialRow = (row) => {
  const links = Array.from(row.querySelectorAll("a"));
  const imgs = row.querySelectorAll("img");
  const svgs = row.querySelectorAll("svg");

  return (
    links.length >= 2 &&
    (svgs.length >= 2 || imgs.length >= 2) &&
    row.textContent.trim().length < 100
  );
};

/**
 * Check if row contains a button
 */
const isButtonRow = (row) => {
  const links = row.querySelectorAll("a");
  if (links.length !== 1) return false;

  const link = links[0];
  const linkStyles = window.getComputedStyle(link);

  const hasBackground = linkStyles.backgroundColor !== "rgba(0, 0, 0, 0)";
  const isInlineBlock =
    linkStyles.display === "inline-block" || linkStyles.display === "block";
  const hasNoMedia = !link.querySelector("img") && !link.querySelector("svg");

  return hasBackground && isInlineBlock && hasNoMedia;
};

/**
 * Check if row is a divider
 */
const isDividerRow = (row) => {
  const hr = row.querySelector("hr");
  if (hr) return true;

  // Check for div with height < 5px and background
  const divs = row.querySelectorAll("div");
  for (const div of divs) {
    const styles = window.getComputedStyle(div);
    const height = parseFloat(styles.height);
    const hasBackground = styles.backgroundColor !== "rgba(0, 0, 0, 0)";
    if (height > 0 && height < 5 && hasBackground) {
      return true;
    }
  }

  return false;
};

/**
 * Determine element type from row - HANDLES NESTED CONTENT
 */
const determineElementType = (row) => {
  if (isDividerRow(row)) return "divider";
  if (isSocialRow(row)) return "social";
  if (isButtonRow(row)) return "button";
  if (isImageRow(row)) return "image";
  if (isShapeElement(row)) return "shape";

  // ✅ Check for headings (including nested)
  const heading = row.querySelector("h1, h2, h3, h4, h5, h6");
  if (heading && heading.textContent.trim().length > 0) return "header";

  // ✅ Check for large text (including nested)
  const allText = row.querySelectorAll(
    "p, div, span, td, h1, h2, h3, h4, h5, h6"
  );
  for (const el of allText) {
    const text = el.textContent.trim();
    if (text.length < 5) continue;

    const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
    if (fontSize > 24) return "header";
  }

  // ✅ If has meaningful text content, it's text
  const textContent = row.textContent.trim();
  if (textContent.length > 5) return "text";

  return "text";
};

/**
 * Parse image row
 */
const parseImageRow = (row, index, containerRect, cumulativeTop) => {
  const imgs = Array.from(row.querySelectorAll("img"));

  return imgs.map((img, imgIndex) => {
    const link = img.closest("a")?.href || "";
    const rect = img.getBoundingClientRect();
    const containerLeft = containerRect ? containerRect.left : 0;
    const containerTop = containerRect ? containerRect.top : 0;

    const left = Math.max(0, Math.round(rect.left - containerLeft));
    const top = Math.max(0, Math.round(rect.top - containerTop));
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    return {
      id: generateUniqueId("img"),
      type: "image",
      content: img.src || img.getAttribute("src") || "",
      link: link,
      styles: {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        maxWidth: `${width}px`,
        maxHeight: `${height}px`,
        objectFit: window.getComputedStyle(img).objectFit || "cover",
        objectPosition: window.getComputedStyle(img).objectPosition || "center",
        altText: img.alt || "Newsletter Image",
        borderRadius: window.getComputedStyle(img).borderRadius || "0",
        opacity: window.getComputedStyle(img).opacity || "1",
      },
    };
  });
};

/**
 * Parse social icons row
 */
const parseSocialRow = (row, index, containerRect, cumulativeTop) => {
  const links = Array.from(row.querySelectorAll("a"));

  if (links.length === 0) return null;

  const icons = links.map((link, idx) => ({
    id: idx + 1,
    platform: detectSocialPlatform(link.href),
    url: link.href || "#",
  }));

  let gap = "12px";
  if (links.length > 1) {
    const first = links[0].getBoundingClientRect();
    const second = links[1].getBoundingClientRect();
    const calculatedGap = second.left - (first.left + first.width);
    if (calculatedGap > 0) {
      gap = `${Math.round(calculatedGap)}px`;
    }
  }

  const rowRect = row.getBoundingClientRect();
  const left = Math.max(
    0,
    Math.round(rowRect.left - (containerRect?.left || 0))
  );
  const top = Math.max(0, Math.round(rowRect.top - (containerRect?.top || 0)));

  const containerStyles = extractStyles(row, containerRect);

  return {
    id: generateUniqueId("social"),
    type: "social",
    content: "",
    icons: icons,
    styles: {
      ...containerStyles,
      left: `${left}px`,
      top: `${top}px`,
      width: `${Math.round(rowRect.width)}px`,
      height: `${Math.round(rowRect.height)}px`,
      gap: gap,
      iconColor: containerStyles.color || "#666",
      iconSize: "24",
    },
  };
};

/**
 * Parse shape row
 */
const parseShapeRow = (row, index, containerRect, cumulativeTop) => {
  const candidates = row.querySelectorAll("div, span");
  let shapeEl = null;

  for (const el of candidates) {
    const styles = window.getComputedStyle(el);
    const hasBackground = styles.backgroundColor !== "rgba(0, 0, 0, 0)";
    const hasSize =
      parseFloat(styles.width) > 20 && parseFloat(styles.height) > 20;

    if (hasBackground && hasSize) {
      shapeEl = el;
      break;
    }
  }

  if (!shapeEl) return null;

  const styles = window.getComputedStyle(shapeEl);
  const rect = shapeEl.getBoundingClientRect();

  const width = Math.round(rect.width);
  const height = Math.round(rect.height);
  const left = Math.max(0, Math.round(rect.left - (containerRect?.left || 0)));
  const top = Math.max(0, Math.round(rect.top - (containerRect?.top || 0)));

  let shapeType = "rectangle";
  const borderRadius = parseFloat(styles.borderRadius);

  if (borderRadius >= Math.min(width, height) / 2) {
    shapeType = width === height ? "circle" : "ellipse";
  } else if (borderRadius > 0) {
    shapeType = "rounded-rectangle";
  }

  const bgImage = styles.backgroundImage;
  let fillType = "solid";
  if (bgImage && bgImage.includes("linear-gradient")) {
    fillType = "linear";
  } else if (bgImage && bgImage.includes("radial-gradient")) {
    fillType = "radial";
  }

  return {
    id: generateUniqueId("shape"),
    type: "shape",
    content: "",
    styles: {
      position: "absolute",
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: styles.backgroundColor || "#3b82f6",
      shapeType: shapeType,
      fillType: fillType,
      borderWidth: styles.borderWidth || "0px",
      borderStyle: styles.borderStyle || "solid",
      borderColor: styles.borderColor || "#000000",
      borderRadius: styles.borderRadius || "0px",
      borderTopLeftRadius: styles.borderTopLeftRadius || "0px",
      borderTopRightRadius: styles.borderTopRightRadius || "0px",
      borderBottomLeftRadius: styles.borderBottomLeftRadius || "0px",
      borderBottomRightRadius: styles.borderBottomRightRadius || "0px",
      opacity: styles.opacity || "1",
      boxShadow: styles.boxShadow || "none",
      transform: styles.transform || "none",
      paddingTop: "0px",
      paddingRight: "0px",
      paddingBottom: "0px",
      paddingLeft: "0px",
      marginTop: "0px",
      marginRight: "0px",
      marginBottom: "0px",
      marginLeft: "0px",
    },
  };
};

/**
 * Parse button row - HANDLES NESTED CONTENT
 */
const parseButtonRow = (row, index, containerRect, cumulativeTop) => {
  const link = row.querySelector("a");

  if (!link) return null;

  const rect = link.getBoundingClientRect();
  const left = Math.max(0, Math.round(rect.left - (containerRect?.left || 0)));
  const top = Math.max(0, Math.round(rect.top - (containerRect?.top || 0)));
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  return {
    id: generateUniqueId("button"),
    type: "button",
    content: link.textContent.trim(),
    link: link.href || "#",
    styles: {
      ...extractStyles(link, containerRect),
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      buttonPadding: window.getComputedStyle(link).padding || "12px 24px",
    },
  };
};

/**
 * Parse divider row
 */
const parseDividerRow = (row, index, containerRect, cumulativeTop) => {
  const hr = row.querySelector("hr");
  const divider = hr || row.querySelector("div[style*='height']") || row;

  const rect = divider.getBoundingClientRect();
  const left = Math.max(0, Math.round(rect.left - (containerRect?.left || 0)));
  const top = Math.max(0, Math.round(rect.top - (containerRect?.top || 0)));

  const styles = extractStyles(divider, containerRect);

  return {
    id: generateUniqueId("divider"),
    type: "divider",
    content: "",
    styles: {
      ...styles,
      left: `${left}px`,
      top: `${top}px`,
      width: "100%",
      borderWidth: styles.borderTopWidth || styles.borderWidth || "2px",
      borderStyle: styles.borderTopStyle || styles.borderStyle || "solid",
      borderColor: styles.borderTopColor || styles.borderColor || "#d1d5db",
    },
  };
};

/**
 * Parse heading/header row - HANDLES NESTED CONTENT
 */
const parseHeadingRow = (row, index, containerRect, cumulativeTop) => {
  let heading = row.querySelector("h1, h2, h3, h4, h5, h6");

  if (!heading) {
    const allText = Array.from(row.querySelectorAll("p, div, span, td"));
    heading = allText.find((el) => {
      const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
      const text = el.textContent.trim();
      return fontSize > 24 && text.length > 0;
    });
  }

  if (!heading || heading.textContent.trim().length === 0) return null;

  const rect = heading.getBoundingClientRect();
  const left = Math.max(0, Math.round(rect.left - (containerRect?.left || 0)));
  const top = Math.max(0, Math.round(rect.top - (containerRect?.top || 0)));
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  return {
    id: generateUniqueId("header"),
    type: "header",
    content: heading.textContent.trim(),
    styles: {
      ...extractStyles(heading, containerRect),
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      headingLevel: heading.tagName.toLowerCase() || "h2",
    },
  };
};

/**
 * Parse text row - HANDLES NESTED CONTENT
 */
const parseTextRow = (row, index, containerRect, cumulativeTop) => {
  let textElement = row.querySelector("p");

  if (!textElement || textElement.textContent.trim().length === 0) {
    textElement = row.querySelector("div");
  }

  if (!textElement || textElement.textContent.trim().length === 0) {
    const allElements = Array.from(row.querySelectorAll("*"));
    textElement = allElements.find((el) => {
      const text = el.textContent.trim();
      const hasNoImages = !el.querySelector("img");
      const hasNoButtons = !el.querySelector("a[style*='background']");
      return text.length > 10 && hasNoImages && hasNoButtons;
    });
  }

  if (!textElement || textElement.textContent.trim().length === 0) {
    textElement = row;
  }

  const textContent = textElement.textContent.trim();
  if (textContent.length === 0) return null;

  const rect = textElement.getBoundingClientRect();
  const left = Math.max(0, Math.round(rect.left - (containerRect?.left || 0)));
  const top = Math.max(0, Math.round(rect.top - (containerRect?.top || 0)));
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  return {
    id: generateUniqueId("text"),
    type: "text",
    content: textContent,
    styles: {
      ...extractStyles(textElement, containerRect),
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    },
  };
};

/**
 * Main parsing function - HANDLES DEEPLY NESTED TABLES
 */
/**
 * Main parsing function - IMPROVED TO HANDLE ALL NESTED CONTENT
 */
export const parseHTMLToNewsletterElements = async (
  htmlString,
  cssString = "",
  options = {}
) => {
  const { onProgress } = options;

  uniqueIdCounter = 0;

  console.log("🚀 Starting HTML parsing...");
  console.log("📏 HTML length:", htmlString.length);

  try {
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlString;
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.visibility = "hidden";
    document.body.appendChild(tempContainer);

    const mainTable =
      tempContainer.querySelector('table[width="600"]') ||
      tempContainer.querySelector("table.wrapper") ||
      tempContainer.querySelector('table[style*="width: 600px"]') ||
      tempContainer.querySelector('table[style*="width:600px"]') ||
      tempContainer.querySelector("table");

    if (!mainTable) {
      document.body.removeChild(tempContainer);
      throw new Error("No main table found in HTML");
    }

    console.log("📦 Found main table");

    let styleElement = null;
    if (cssString) {
      styleElement = document.createElement("style");
      styleElement.textContent = cssString;
      document.head.appendChild(styleElement);
      console.log("🎨 CSS applied");
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const containerRect = mainTable.getBoundingClientRect();
    const tableStyles = window.getComputedStyle(mainTable);
    const newsletterBg = tableStyles.backgroundColor || "#ffffff";

    console.log("🎨 Newsletter background:", newsletterBg);

    // ✅ NEW APPROACH: Process all content elements directly, not by rows
    const elements = [];
    let cloudinaryImageCount = 0;

    // Track processed content to avoid duplicates
    const processedContent = new Set();

    // ✅ 1. Find and process ALL images
    const allImages = Array.from(mainTable.querySelectorAll("img"));
    console.log(`📷 Found ${allImages.length} total images`);

    allImages.forEach((img, idx) => {
      const imgSrc = img.src || img.getAttribute("src") || "";
      if (!imgSrc || processedContent.has(imgSrc)) return;

      processedContent.add(imgSrc);

      const link = img.closest("a")?.href || "";
      const rect = img.getBoundingClientRect();
      const left = Math.max(0, Math.round(rect.left - containerRect.left));
      const top = Math.max(0, Math.round(rect.top - containerRect.top));
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      const element = {
        id: generateUniqueId("img"),
        type: "image",
        content: imgSrc,
        link: link,
        styles: {
          position: "absolute",
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          minWidth: `${width}px`,
          minHeight: `${height}px`,
          maxWidth: `${width}px`,
          maxHeight: `${height}px`,
          objectFit: window.getComputedStyle(img).objectFit || "cover",
          objectPosition:
            window.getComputedStyle(img).objectPosition || "center",
          altText: img.alt || "Newsletter Image",
          borderRadius: window.getComputedStyle(img).borderRadius || "0",
          opacity: window.getComputedStyle(img).opacity || "1",
        },
      };

      if (isCloudinaryUrl(imgSrc)) {
        cloudinaryImageCount++;
        console.log(`  ☁️ Image ${idx + 1}: ${imgSrc.substring(0, 50)}...`);
      }

      elements.push(element);
    });

    // ✅ 2. Find and process ALL headings
    const allHeadings = Array.from(
      mainTable.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );
    console.log(`📰 Found ${allHeadings.length} total headings`);

    allHeadings.forEach((heading, idx) => {
      const content = heading.textContent.trim();
      if (!content || processedContent.has(content)) return;

      processedContent.add(content);

      const rect = heading.getBoundingClientRect();
      const left = Math.max(0, Math.round(rect.left - containerRect.left));
      const top = Math.max(0, Math.round(rect.top - containerRect.top));
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      elements.push({
        id: generateUniqueId("header"),
        type: "header",
        content: content,
        styles: {
          ...extractStyles(heading, containerRect),
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          headingLevel: heading.tagName.toLowerCase() || "h2",
        },
      });

      console.log(`  📰 Heading ${idx + 1}: "${content.substring(0, 40)}"`);
    });

    // ✅ 3. Find and process ALL paragraphs
    const allParagraphs = Array.from(mainTable.querySelectorAll("p"));
    console.log(`📝 Found ${allParagraphs.length} total paragraphs`);

    allParagraphs.forEach((p, idx) => {
      const content = p.textContent.trim();
      if (!content || content.length < 5 || processedContent.has(content))
        return;

      processedContent.add(content);

      const rect = p.getBoundingClientRect();
      const left = Math.max(0, Math.round(rect.left - containerRect.left));
      const top = Math.max(0, Math.round(rect.top - containerRect.top));
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      elements.push({
        id: generateUniqueId("text"),
        type: "text",
        content: content,
        styles: {
          ...extractStyles(p, containerRect),
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        },
      });

      console.log(`  📝 Text ${idx + 1}: "${content.substring(0, 50)}"`);
    });

    // ✅ 4. Find and process ALL buttons (links with background)
    const allLinks = Array.from(mainTable.querySelectorAll("a"));
    console.log(`🔗 Found ${allLinks.length} total links`);

    allLinks.forEach((link, idx) => {
      const linkStyles = window.getComputedStyle(link);
      const hasBackground = linkStyles.backgroundColor !== "rgba(0, 0, 0, 0)";
      const hasNoMedia =
        !link.querySelector("img") && !link.querySelector("svg");

      if (!hasBackground || !hasNoMedia) return;

      const content = link.textContent.trim();
      const href = link.href || "#";
      const contentKey = `btn:${content}:${href}`;

      if (!content || processedContent.has(contentKey)) return;

      processedContent.add(contentKey);

      const rect = link.getBoundingClientRect();
      const left = Math.max(0, Math.round(rect.left - containerRect.left));
      const top = Math.max(0, Math.round(rect.top - containerRect.top));
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      elements.push({
        id: generateUniqueId("button"),
        type: "button",
        content: content,
        link: href,
        styles: {
          ...extractStyles(link, containerRect),
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          buttonPadding: linkStyles.padding || "12px 24px",
        },
      });

      console.log(`  🔘 Button ${idx + 1}: "${content}"`);
    });

    // ✅ 5. Find and process ALL dividers
    const allHrs = Array.from(mainTable.querySelectorAll("hr"));
    const allDividerDivs = Array.from(mainTable.querySelectorAll("div")).filter(
      (div) => {
        const styles = window.getComputedStyle(div);
        const height = parseFloat(styles.height);
        const hasBackground = styles.backgroundColor !== "rgba(0, 0, 0, 0)";
        return height > 0 && height < 5 && hasBackground;
      }
    );

    const allDividers = [...allHrs, ...allDividerDivs];
    console.log(`➖ Found ${allDividers.length} total dividers`);

    allDividers.forEach((divider, idx) => {
      const rect = divider.getBoundingClientRect();
      const dividerKey = `divider:${rect.top}:${rect.width}`;

      if (processedContent.has(dividerKey)) return;

      processedContent.add(dividerKey);

      const left = Math.max(0, Math.round(rect.left - containerRect.left));
      const top = Math.max(0, Math.round(rect.top - containerRect.top));

      const styles = extractStyles(divider, containerRect);

      elements.push({
        id: generateUniqueId("divider"),
        type: "divider",
        content: "",
        styles: {
          ...styles,
          left: `${left}px`,
          top: `${top}px`,
          width: "100%",
          borderWidth: styles.borderTopWidth || styles.borderWidth || "2px",
          borderStyle: styles.borderTopStyle || styles.borderStyle || "solid",
          borderColor: styles.borderTopColor || styles.borderColor || "#d1d5db",
        },
      });

      console.log(`  ➖ Divider ${idx + 1}`);
    });

    // ✅ 6. Find and process social icons
    const allRows = Array.from(mainTable.querySelectorAll("tr"));
    allRows.forEach((row, idx) => {
      if (isSocialRow(row)) {
        const links = Array.from(row.querySelectorAll("a"));
        const socialKey = `social:${links.map((l) => l.href).join(":")}`;

        if (processedContent.has(socialKey)) return;

        processedContent.add(socialKey);

        const social = parseSocialRow(row, idx, containerRect, 0);
        if (social) {
          elements.push(social);
          console.log(
            `  👥 Social icons: ${social.icons
              .map((i) => i.platform)
              .join(", ")}`
          );
        }
      }
    });

    // ✅ Sort elements by top position (vertical order)
    elements.sort((a, b) => {
      const topA = parseInt(a.styles.top) || 0;
      const topB = parseInt(b.styles.top) || 0;
      return topA - topB;
    });

    document.body.removeChild(tempContainer);
    if (styleElement) {
      document.head.removeChild(styleElement);
    }

    if (onProgress) {
      onProgress({
        stage: "complete",
        message: `Successfully imported ${elements.length} elements!`,
        current: elements.length,
        total: elements.length,
      });
    }

    const elementTypeCounts = elements.reduce((acc, el) => {
      acc[el.type] = (acc[el.type] || 0) + 1;
      return acc;
    }, {});

    console.log("\n✅ Parse complete!");
    console.log("📊 Summary:");
    console.log(`   Total elements: ${elements.length}`);
    console.log(`   Cloudinary images: ${cloudinaryImageCount}`);
    console.log("   Element breakdown:", elementTypeCounts);

    return {
      success: true,
      elements: elements,
      newsletterBackgroundColor: newsletterBg,
      message: `Successfully imported ${elements.length} element(s) with ${cloudinaryImageCount} Cloudinary images`,
    };
  } catch (error) {
    console.error("❌ Parse error:", error);
    console.error("Stack trace:", error.stack);

    return {
      success: false,
      elements: [],
      message: `Parse error: ${error.message}`,
    };
  }
};

/**
 * Validate HTML before parsing
 */
export const validateHTML = (htmlString) => {
  try {
    if (!htmlString || htmlString.trim().length === 0) {
      return {
        valid: false,
        message: "HTML string is empty",
      };
    }

    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlString;

    const hasContent =
      tempContainer.textContent.trim().length > 0 ||
      tempContainer.querySelector("img") !== null;

    if (!hasContent) {
      return {
        valid: false,
        message: "HTML appears to be empty (no text or images found)",
      };
    }

    const hasTable = tempContainer.querySelector("table") !== null;
    if (!hasTable) {
      return {
        valid: false,
        message: "HTML must contain a table structure for email layout",
      };
    }

    console.log("✅ HTML validation passed");
    return {
      valid: true,
      message: "HTML is valid and ready to parse",
    };
  } catch (error) {
    return {
      valid: false,
      message: `Validation error: ${error.message}`,
    };
  }
};
