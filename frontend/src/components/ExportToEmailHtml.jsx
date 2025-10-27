// components/ExportToEmailHtml.js
export const getSocialIconUrl = (platform) => {
  switch (platform?.toLowerCase()) {
    case "facebook": return "https://cdn-icons-png.flaticon.com/512/733/733547.png";
    case "twitter": return "https://cdn-icons-png.flaticon.com/512/733/733579.png";
    case "instagram": return "https://cdn-icons-png.flaticon.com/512/733/733558.png";
    case "linkedin": return "https://cdn-icons-png.flaticon.com/512/733/733561.png";
    case "youtube": return "https://cdn-icons-png.flaticon.com/512/1384/1384060.png";
    default: return "https://via.placeholder.com/30";
  }
};

export const exportToEmailHtml = ({ elements, globalSettings, newsletterName }) => {
  const getInlineStyles = (styles) => {
    if (!styles) return "";
    return Object.entries(styles)
      .map(([key, value]) => {
        const cssKey = key
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase();
        return `${cssKey}: ${value};`;
      })
      .join(" ");
  };

  const bodyStyles = getInlineStyles({
    backgroundColor: globalSettings.newsletterColor,
    fontFamily: globalSettings.fontFamily,
    minHeight: globalSettings.minHeight,
    margin: "0",
    padding: "0",
  });

  const tableWrapperStyles = getInlineStyles({
    maxWidth: globalSettings.maxWidth,
    width: "100%",
    margin: "0 auto",
    borderCollapse: "collapse",
    msoTableLspace: "0pt",
    msoTableRspace: "0pt",
  });

  let contentHtml = "";

  elements.forEach((element) => {
    let elementHtml = "";
    const elementStyles = getInlineStyles(element.styles);

    switch (element.type) {
      case "header":
        elementHtml = `<h2 style="${elementStyles}">${element.content}</h2>`;
        break;

      case "text":
        elementHtml = `<p style="${elementStyles}">${element.content}</p>`;
        break;

      case "image":
        if (element.content) {
          elementHtml = `<img src="${element.content}" alt="" style="display:block; max-width:100%; height:auto; ${elementStyles}" />`;
        }
        break;

      case "button":
        const buttonStyles = getInlineStyles({
          ...element.styles,
          display: "inline-block",
          textDecoration: "none",
          textAlign: "center",
        });
        elementHtml = `
          <a href="${element.link || "#"}" style="${buttonStyles}">
            ${element.content}
          </a>
        `;
        break;

      case "divider":
        const dividerStyles = getInlineStyles({
          width: "100%",
          height: "2px",
          backgroundColor: element.styles.backgroundColor || "#d1d5db",
          border: "none",
          margin: "20px 0",
        });
        elementHtml = `<div style="${dividerStyles}"></div>`;
        break;

      case "social":
        const socialContainerStyles = getInlineStyles({
          textAlign: "center",
          padding: "20px 0",
        });
        let socialIconsHtml = "";
        if (element.icons && Array.isArray(element.icons)) {
          socialIconsHtml = element.icons
            .map((icon) => {
              const iconStyles = getInlineStyles({
                display: "inline-block",
                margin: "0 5px",
              });
              return `
                <a href="${icon.url}" style="${iconStyles}" target="_blank">
                  <img src="${getSocialIconUrl(icon.platform)}" width="30" height="30" alt="${icon.platform}" style="display:block;" />
                </a>
              `;
            })
            .join("");
        }
        elementHtml = `<div style="${socialContainerStyles}">${socialIconsHtml}</div>`;
        break;

      default:
        elementHtml = ``;
    }

    contentHtml += `
      <tr>
        <td align="center" style="padding: 10px 0;">
          ${elementHtml}
        </td>
      </tr>
    `;
  });

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>${newsletterName}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="${bodyStyles}">
  <center style="width: 100%; background-color: ${globalSettings.backgroundColor};">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="${tableWrapperStyles}">
      ${contentHtml}
    </table>
  </center>
</body>
</html>
`;
};
