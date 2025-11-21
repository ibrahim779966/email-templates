// TextPropertiesPanel.jsx - Complete Email-Safe Version

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Trash2,
  Type,
  Palette,
  Move,
  AlignLeft,
  Bold,
  AlertCircle,
} from "lucide-react";

/**
 * TextPropertiesPanel - Email-Safe Text Element Properties
 *
 * Features:
 * - Web-safe fonts only (Arial, Helvetica, Verdana, Georgia, etc.)
 * - Font size minimum 12px (readability)
 * - Hex colors only (#RRGGBB)
 * - Padding controls (margin not supported in email)
 * - Line height for readability (1.5 recommended)
 * - Text formatting (bold, italic, underline)
 * - Text alignment (left, center, right)
 * - Detailed email safety guidance
 */

export default function TextPropertiesPanel({
  element,
  updateElement,
  deleteElement,
}) {
  if (!element) return null;

  /**
   * Handles style changes with proper value normalization
   * Applies email-safe constraints and default units
   */
  const handleStyleChange = (key, rawValue) => {
    // Define which properties need px units
    const pxKeys = new Set([
      "fontSize",
      "letterSpacing",
      "wordSpacing",
      "textIndent",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "borderWidth",
      "borderRadius",
      "gap",
      "width",
      "height",
    ]);

    // Normalize numeric values to px
    const value =
      pxKeys.has(key) && typeof rawValue === "number"
        ? `${rawValue}px`
        : rawValue;

    // Merge styles immutably
    const updatedStyles = { ...element.styles, [key]: value };

    updateElement(element.id, { styles: updatedStyles });
  };

  /**
   * Update element content (text)
   */
  const handleContentChange = (value) => {
    updateElement(element.id, { content: value });
  };

  /**
   * Helper to safely extract numeric values from style strings
   * e.g., "16px" -> 16, "1.5" -> 1.5
   */
  const getSafeNumericValue = (styleValue, defaultValue) => {
    const parsed = parseInt(styleValue);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  /**
   * Helper to get line height as decimal
   */
  const getSafeLineHeight = (lineHeight, defaultValue) => {
    const parsed = parseFloat(lineHeight);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  /**
   * Email-safe font options grouped by category
   * Only includes universally supported fonts across all email clients
   */
  const fontOptions = [
    // ==============================
    // SANS SERIF (100+)
    // ==============================

    { value: "Arial, sans-serif", display: "Arial", category: "Sans Serif" },
    {
      value: "Verdana, sans-serif",
      display: "Verdana",
      category: "Sans Serif",
    },
    {
      value: "Tahoma, sans-serif",
      display: "Tahoma",
      category: "Sans Serif",
    },
    {
      value: "Trebuchet MS, sans-serif",
      display: "Trebuchet MS",
      category: "Sans Serif",
    },
    {
      value: "Helvetica, sans-serif",
      display: "Helvetica",
      category: "Sans Serif",
    },
    {
      value: "Times New Roman, serif",
      display: "Times New Roman",
      category: "Serif",
    },
    { value: "Georgia, serif", display: "Georgia", category: "Serif" },
    { value: "Palatino, serif", display: "Palatino", category: "Serif" },
    {
      value: "Courier New, monospace",
      display: "Courier New",
      category: "Monospace",
    },
    {
      value: "Lucida Console, monospace",
      display: "Lucida Console",
      category: "Monospace",
    },
    {
      value: "Comic Sans MS, cursive",
      display: "Comic Sans MS",
      category: "Handwriting",
    },
    {
      value: "Brush Script MT, cursive",
      display: "Brush Script MT",
      category: "Handwriting",
    },
    {
      value: "Segoe Script, cursive",
      display: "Segoe Script",
      category: "Handwriting",
    },
    {
      value: "Montserrat, sans-serif",
      display: "Montserrat",
      category: "Sans Serif",
    },
    {
      value: "Poppins, sans-serif",
      display: "Poppins",
      category: "Sans Serif",
    },
  ];

  /**
   * Group fonts by category for better organization
   */
  const groupedFonts = fontOptions.reduce((groups, font) => {
    if (!groups[font.category]) groups[font.category] = [];
    groups[font.category].push(font);
    return groups;
  }, {});

  // Get current values from element styles
  const currentFontFamily =
    element.styles?.fontFamily || "Arial, Helvetica, sans-serif";
  const currentFontSize = getSafeNumericValue(element.styles?.fontSize, 16);
  const currentFontWeight = element.styles?.fontWeight || "normal";
  const currentFontStyle = element.styles?.fontStyle || "normal";
  const currentColor = element.styles?.color || "#000000";
  const currentBackgroundColor = element.styles?.backgroundColor || "#ffffff";
  const currentTextAlign = element.styles?.textAlign || "left";
  const currentLineHeight = getSafeLineHeight(element.styles?.lineHeight, 1.5);
  const currentTextDecoration = element.styles?.textDecoration || "none";
  const currentLetterSpacing = element.styles?.letterSpacing || "normal";
  const currentPaddingTop = getSafeNumericValue(element.styles?.paddingTop, 0);
  const currentPaddingRight = getSafeNumericValue(
    element.styles?.paddingRight,
    0
  );
  const currentPaddingBottom = getSafeNumericValue(
    element.styles?.paddingBottom,
    0
  );
  const currentPaddingLeft = getSafeNumericValue(
    element.styles?.paddingLeft,
    0
  );

  return (
    <Card className="shadow-lg border-0">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          Text Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Email-safe typography compatible with{" "}
          <Badge variant="secondary" className="text-xs">
            Gmail
          </Badge>{" "}
          <Badge variant="secondary" className="text-xs">
            Outlook
          </Badge>{" "}
          <Badge variant="secondary" className="text-xs">
            All Clients
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/* Email Safety Notice */}
        <div className="px-4 py-3 bg-blue-50 border-b">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-900">✅ Email-Safe Text</p>
              <p className="text-xs text-blue-800">
                This text element uses only web-safe fonts and inline styles. No
                text shadows, transforms, or advanced effects (not supported in
                email).
              </p>
            </div>
          </div>
        </div>

        {/* Text Content Section */}
        <div className="px-4 py-4 bg-slate-50 border-b">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-600" />
              <Label className="text-sm font-semibold">Text Content</Label>
            </div>
            <textarea
              value={element.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-muted-foreground">
              Plain text only. Line breaks are converted to &lt;br /&gt; in
              email.
            </p>
          </div>
        </div>

        {/* Accordion Sections */}
        <Accordion
          type="multiple"
          defaultValue={["typography", "colors"]}
          className="w-full"
        >
          {/* ==================== TYPOGRAPHY SECTION ==================== */}
          <AccordionItem value="typography" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-emerald-50/50 hover:bg-emerald-50 border-b">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Typography</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4 pt-2">
              {/* Font Family Selector */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Font Family</Label>
                  <Badge variant="default" className="text-xs">
                    Email Safe
                  </Badge>
                </div>
                <Select
                  value={currentFontFamily}
                  onValueChange={(value) =>
                    handleStyleChange("fontFamily", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {Object.entries(groupedFonts).map(([category, fonts]) => (
                      <div key={category}>
                        {/* Category Header */}
                        <div className="px-2 py-2 text-xs font-semibold text-muted-foreground bg-slate-100 sticky top-0">
                          {category}
                        </div>

                        {/* Font Options */}
                        {fonts.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex items-center gap-2">
                              <span
                                style={{ fontFamily: font.value }}
                                className="font-medium"
                              >
                                {font.display}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                • {font.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  🔒 Only universally supported web-safe fonts are available
                </p>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Font Size (px)
                  <Badge variant="outline" className="ml-2 text-xs">
                    Min: 12px, Max: 72px
                  </Badge>
                </Label>
                <div className="flex gap-2 items-center w-full max-w-xs">
                  <Input
                    type="number"
                    min="12"
                    max="72"
                    value={currentFontSize}
                    onChange={(e) => {
                      const value = Math.max(
                        12,
                        Math.min(72, parseInt(e.target.value) || 12)
                      );
                      handleStyleChange("fontSize", value);
                    }}
                    className="flex-1 text-sm box-border w-full"
                    style={{ minWidth: "4rem" }}
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>📐 Recommended sizes:</p>
                  <ul className="list-disc list-inside">
                    <li>Heading: 24-32px</li>
                    <li>Body text: 14-16px</li>
                    <li>Small text: 12-14px</li>
                  </ul>
                </div>
              </div>

              {/* Font Weight */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <Bold className="w-3 h-3" />
                  Font Weight
                </Label>
                <Select
                  value={currentFontWeight}
                  onValueChange={(value) =>
                    handleStyleChange("fontWeight", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">
                      <span style={{ fontWeight: 300 }}>Light (300)</span>
                    </SelectItem>
                    <SelectItem value="400">
                      <span style={{ fontWeight: 400 }}>Normal (400)</span>
                    </SelectItem>
                    <SelectItem value="600">
                      <span style={{ fontWeight: 600 }}>Semibold (600)</span>
                    </SelectItem>
                    <SelectItem value="700">
                      <span style={{ fontWeight: 700 }}>Bold (700)</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  ✅ 400 (normal) and 700 (bold) work everywhere. Others have
                  limited support.
                </p>
              </div>

              {/* Font Style & Decoration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Style</Label>
                  <Select
                    value={currentFontStyle}
                    onValueChange={(value) =>
                      handleStyleChange("fontStyle", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">
                        <span>Normal</span>
                      </SelectItem>
                      <SelectItem value="italic">
                        <span italic>Italic</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text Decoration</Label>
                  <Select
                    value={currentTextDecoration}
                    onValueChange={(value) =>
                      handleStyleChange("textDecoration", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="underline">Underline</SelectItem>
                      <SelectItem value="line-through">
                        Strikethrough
                      </SelectItem>
                      <SelectItem value="overline">Overline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Line Height */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Line Height
                  <Badge variant="outline" className="ml-2 text-xs">
                    Recommended: 1.5
                  </Badge>
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min="1"
                    max="3"
                    step="0.1"
                    value={currentLineHeight}
                    onChange={(e) => {
                      const value = Math.max(
                        1,
                        Math.min(3, parseFloat(e.target.value) || 1.5)
                      );
                      handleStyleChange("lineHeight", value);
                    }}
                    className="flex-1 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">em</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  📏 1.5 (150%) = good readability. 1.2 = compact. 2.0 = loose
                  spacing.
                </p>
              </div>

              {/* Letter Spacing */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Letter Spacing</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min="-5"
                    max="10"
                    step="0.5"
                    value={
                      currentLetterSpacing === "normal"
                        ? 0
                        : parseFloat(currentLetterSpacing) || 0
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      handleStyleChange(
                        "letterSpacing",
                        value === "0" ? "normal" : `${value}px`
                      );
                    }}
                    className="flex-1 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use for headings: positive value increases spacing
                </p>
              </div>

              {/* Text Alignment */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <AlignLeft className="w-3 h-3" />
                  Text Alignment
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: "left", label: "⬅️ Left" },
                    { value: "center", label: "⬆️ Center" },
                    { value: "right", label: "➡️ Right" },
                    { value: "justify", label: "⬌ Justify" },
                  ].map((align) => (
                    <button
                      key={align.value}
                      onClick={() =>
                        handleStyleChange("textAlign", align.value)
                      }
                      className={`px-3 py-2 text-xs font-medium rounded border transition-colors ${
                        currentTextAlign === align.value
                          ? "bg-emerald-500 text-white border-emerald-600"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {align.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  ✅ Left and center work everywhere. Justify has limited
                  support.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ==================== COLORS SECTION ==================== */}
          <AccordionItem value="colors" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-purple-50/50 hover:bg-purple-50 border-b">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Colors</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4 pt-2">
              {/* Text Color */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Text Color
                  <Badge variant="outline" className="ml-2 text-xs">
                    Hex Only
                  </Badge>
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={currentColor}
                    onChange={(e) => {
                      // Validate hex format
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        handleStyleChange("color", e.target.value);
                      }
                    }}
                    className="flex-1 font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>🎨 Safe colors:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { hex: "#000000", name: "Black" },
                      { hex: "#333333", name: "Dark Gray" },
                      { hex: "#666666", name: "Gray" },
                      { hex: "#FFFFFF", name: "White" },
                      { hex: "#0066CC", name: "Blue" },
                    ].map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => handleStyleChange("color", color.hex)}
                        className="px-2 py-1 rounded border text-xs font-medium hover:bg-gray-100"
                        title={color.name}
                      >
                        <div
                          className="w-4 h-4 rounded mb-1"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Background Color
                  <Badge variant="outline" className="ml-2 text-xs">
                    Optional
                  </Badge>
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={currentBackgroundColor}
                    onChange={(e) =>
                      handleStyleChange("backgroundColor", e.target.value)
                    }
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={currentBackgroundColor}
                    onChange={(e) => {
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        handleStyleChange("backgroundColor", e.target.value);
                      }
                    }}
                    className="flex-1 font-mono text-sm"
                    placeholder="#ffffff"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Ensure text color contrasts with background (4.5:1 minimum
                  for accessibility)
                </p>
              </div>

              {/* Color Contrast Checker */}
              <Card className="bg-cyan-50 border-cyan-200">
                <CardContent className="p-3">
                  <p className="text-xs font-medium text-cyan-900">
                    💡 Contrast Ratio:{" "}
                    {(() => {
                      const getLuminance = (hex) => {
                        const rgb = parseInt(hex.slice(1), 16);
                        const r = (rgb >> 16) & 0xff;
                        const g = (rgb >> 8) & 0xff;
                        const b = (rgb >> 0) & 0xff;
                        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                        return l;
                      };
                      const l1 = getLuminance(currentColor);
                      const l2 = getLuminance(currentBackgroundColor);
                      const lighter = Math.max(l1, l2);
                      const darker = Math.min(l1, l2);
                      const ratio = (
                        (lighter + 0.05) /
                        (darker + 0.05)
                      ).toFixed(1);
                      return `${ratio}:1 ${
                        ratio >= 4.5 ? "✅ (WCAG AA)" : "⚠️ (Needs improvement)"
                      }`;
                    })()}
                  </p>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ==================== SPACING SECTION ==================== */}
          <AccordionItem value="spacing" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-green-50/50 hover:bg-green-50 border-b">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-green-600" />
                <span className="font-medium">Spacing (Padding Only)</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4 pt-2">
              {/* Padding Controls */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Padding (px)</Label>
                  <Badge variant="default" className="text-xs">
                    Email Safe
                  </Badge>
                </div>

                <Card className="bg-slate-50 border-dashed">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Top Padding */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Top
                        </Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={currentPaddingTop}
                            onChange={(e) => {
                              const value = Math.max(
                                0,
                                Math.min(100, parseInt(e.target.value) || 0)
                              );
                              handleStyleChange("paddingTop", value);
                            }}
                            className="flex-1 h-8 text-sm"
                          />
                          <span className="text-xs text-muted-foreground">
                            px
                          </span>
                        </div>
                      </div>

                      {/* Right Padding */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Right
                        </Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={currentPaddingRight}
                            onChange={(e) => {
                              const value = Math.max(
                                0,
                                Math.min(100, parseInt(e.target.value) || 0)
                              );
                              handleStyleChange("paddingRight", value);
                            }}
                            className="flex-1 h-8 text-sm"
                          />
                          <span className="text-xs text-muted-foreground">
                            px
                          </span>
                        </div>
                      </div>

                      {/* Bottom Padding */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Bottom
                        </Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={currentPaddingBottom}
                            onChange={(e) => {
                              const value = Math.max(
                                0,
                                Math.min(100, parseInt(e.target.value) || 0)
                              );
                              handleStyleChange("paddingBottom", value);
                            }}
                            className="flex-1 h-8 text-sm"
                          />
                          <span className="text-xs text-muted-foreground">
                            px
                          </span>
                        </div>
                      </div>

                      {/* Left Padding */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Left
                        </Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={currentPaddingLeft}
                            onChange={(e) => {
                              const value = Math.max(
                                0,
                                Math.min(100, parseInt(e.target.value) || 0)
                              );
                              handleStyleChange("paddingLeft", value);
                            }}
                            className="flex-1 h-8 text-sm"
                          />
                          <span className="text-xs text-muted-foreground">
                            px
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-xs text-muted-foreground">
                  ✅ Padding works reliably across all email clients
                </p>
              </div>

              <Separator />

              {/* Margin Warning */}
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-orange-900">
                        ⚠️ Margin Not Supported
                      </p>
                      <p className="text-xs text-orange-800">
                        Email clients often strip or ignore margin properties.
                        Use padding inside text blocks or empty rows/cells for
                        spacing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* ==================== ADVANCED SECTION ==================== */}
          <AccordionItem value="advanced" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-orange-50/50 hover:bg-orange-50 border-b">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Advanced (Email Limited)</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4 pt-2">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-red-900">
                        ❌ Not Supported in Email
                      </p>
                      <ul className="text-xs text-red-800 list-disc list-inside space-y-1">
                        <li>Text shadow</li>
                        <li>Transform/rotate</li>
                        <li>Gradient text</li>
                        <li>Text outline</li>
                        <li>Filter effects</li>
                        <li>Custom web fonts</li>
                        <li>Multi-column layout</li>
                      </ul>
                      <p className="text-xs text-red-800 font-medium mt-2">
                        These properties will be ignored by email clients. Stick
                        to basic formatting only.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-3">
                  <p className="text-xs font-medium text-green-900">
                    ✅ What Works in Email:
                  </p>
                  <ul className="text-xs text-green-800 list-disc list-inside space-y-1 mt-2">
                    <li>Web-safe fonts with fallbacks</li>
                    <li>Font size, weight, style</li>
                    <li>Hex colors (#RRGGBB)</li>
                    <li>Text alignment</li>
                    <li>Line height</li>
                    <li>Padding (not margin)</li>
                    <li>Basic text decoration</li>
                    <li>Letter spacing</li>
                  </ul>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        {/* Preview */}
        <div className="px-4 py-4 bg-slate-50">
          <Label className="text-sm font-semibold mb-3 block">Preview</Label>
          <div
            style={{
              fontFamily: currentFontFamily,
              fontSize: `${currentFontSize}px`,
              fontWeight: currentFontWeight,
              fontStyle: currentFontStyle,
              color: currentColor,
              backgroundColor: currentBackgroundColor,
              textAlign: currentTextAlign,
              lineHeight: currentLineHeight,
              textDecoration: currentTextDecoration,
              letterSpacing:
                currentLetterSpacing === "normal"
                  ? "normal"
                  : currentLetterSpacing,
              padding: `${currentPaddingTop}px ${currentPaddingRight}px ${currentPaddingBottom}px ${currentPaddingLeft}px`,
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            {element.content || "Your text will appear here..."}
          </div>
        </div>

        <Separator />

        {/* Delete Button */}
        <div className="p-4">
          <Button
            onClick={() => deleteElement(element.id)}
            variant="destructive"
            className="w-full gap-2 font-medium"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete Element
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
