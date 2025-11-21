// ItemPropertiesPanel.jsx - Complete Email-Safe Version

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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Square,
  Palette,
  Move,
  Layers,
  Trash2,
  AlertCircle,
  Info,
} from "lucide-react";

/**
 * ItemPropertiesPanel - Email-Safe Item Container Properties
 *
 * Features:
 * - Background color and border styling
 * - Padding and margin controls
 * - Content alignment (vertical and horizontal)
 * - Border radius with Outlook warning
 * - Drop shadow and opacity (preview only)
 * - Full email compatibility guidance
 *
 * Important: Items render as table cells or div containers
 * All styles are email-safe and inline
 */

export default function ItemPropertiesPanel({
  element,
  updateElement,
  deleteElement,
}) {
  if (!element) return null;

  const styles = element.styles || {};

  /**
   * Handle style changes with proper value formatting
   */
  const handleStyleChange = (key, value) => {
    updateElement(element.id, {
      styles: {
        ...styles,
        [key]: value,
      },
    });
  };

  /**
   * Helper to safely extract numeric values
   */
  const getSafeNumericValue = (styleValue, defaultValue) => {
    const parsed = parseInt(styleValue);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Get current values from styles
  const backgroundColor = styles.backgroundColor || "#fef3c7";
  const borderWidth = getSafeNumericValue(styles.borderWidth, 0);
  const borderColor = styles.borderColor || "#f59e0b";
  const borderStyle = styles.borderStyle || "solid";
  const borderRadius = getSafeNumericValue(styles.borderRadius, 0);
  const boxShadow = styles.boxShadow || "none";
  const opacity = parseFloat(styles.opacity) || 1;
  const paddingTop = getSafeNumericValue(styles.paddingTop, 12);
  const paddingRight = getSafeNumericValue(styles.paddingRight, 12);
  const paddingBottom = getSafeNumericValue(styles.paddingBottom, 12);
  const paddingLeft = getSafeNumericValue(styles.paddingLeft, 12);
  const marginTop = getSafeNumericValue(styles.marginTop, 0);
  const marginBottom = getSafeNumericValue(styles.marginBottom, 0);
  const verticalAlign = styles.verticalAlign || "top";
  const textAlign = styles.textAlign || "left";

  return (
    <Card className="shadow-lg border-0">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          Item Container Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Email-safe item/box container compatible with{" "}
          <Badge variant="secondary" className="text-xs">
            All Email Clients
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/* Email Safety Notice */}
        <div className="px-4 py-3 bg-blue-50 border-b">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-900">
                ✅ Email-Safe Item Container
              </p>
              <p className="text-xs text-blue-800">
                Renders as table cell or DIV with inline styles. All properties
                are email-client compatible.
              </p>
            </div>
          </div>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["appearance"]}
          className="w-full"
        >
          {/* ==================== APPEARANCE SECTION ==================== */}
          <AccordionItem value="appearance" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-yellow-50/50 hover:bg-yellow-50 border-b">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">Appearance</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4 pt-2">
              {/* Background Color */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Background Color
                  <Badge variant="outline" className="ml-2 text-xs">
                    Hex Only
                  </Badge>
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) =>
                      handleStyleChange("backgroundColor", e.target.value)
                    }
                    className="w-12 h-10 p-1 cursor-pointer rounded"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => {
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        handleStyleChange("backgroundColor", e.target.value);
                      }
                    }}
                    className="flex-1 font-mono text-sm"
                    placeholder="#fef3c7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email-safe: Use hex format (#RRGGBB)
                </p>
              </div>

              <Separator />

              {/* Border */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Border</Label>
                <Card className="bg-slate-50 border-dashed">
                  <CardContent className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Border Width */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Width (px)
                          <Badge variant="outline" className="ml-2 text-xs">
                            Max: 8px
                          </Badge>
                        </Label>
                        <Input
                          type="number"
                          value={borderWidth}
                          onChange={(e) => {
                            const value = Math.min(
                              8,
                              Math.max(0, parseInt(e.target.value) || 0)
                            );
                            handleStyleChange("borderWidth", `${value}px`);
                          }}
                          className="h-8 text-sm"
                          min={0}
                          max={8}
                        />
                        <p className="text-xs text-muted-foreground">
                          Limited to 8px for Outlook
                        </p>
                      </div>

                      {/* Border Color */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Color
                        </Label>
                        <Input
                          type="color"
                          value={borderColor}
                          onChange={(e) =>
                            handleStyleChange("borderColor", e.target.value)
                          }
                          className="h-8 w-full p-1 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Border Style */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        Style
                      </Label>
                      <Select
                        value={borderStyle}
                        onValueChange={(value) =>
                          handleStyleChange("borderStyle", value)
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="solid">Solid (Best)</SelectItem>
                          <SelectItem value="dashed">
                            Dashed (Limited)
                          </SelectItem>
                          <SelectItem value="dotted">
                            Dotted (Limited)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Border Radius */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Corner Radius
                  <Badge variant="outline" className="ml-2 text-xs">
                    Limited Support
                  </Badge>
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={borderRadius}
                    onChange={(e) => {
                      const value = Math.min(
                        25,
                        Math.max(0, parseInt(e.target.value) || 0)
                      );
                      handleStyleChange("borderRadius", `${value}px`);
                    }}
                    className="flex-1 text-sm"
                    min={0}
                    max={25}
                  />
                  <Badge variant="outline" className="text-xs">
                    px
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Rounded corners not supported in Outlook 2007-2016
                </p>
              </div>

              <Separator />

              {/* Drop Shadow */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Drop Shadow
                    <Badge variant="outline" className="ml-2 text-xs">
                      Preview Only
                    </Badge>
                  </Label>
                  <Switch
                    checked={boxShadow !== "none"}
                    onCheckedChange={(checked) =>
                      handleStyleChange(
                        "boxShadow",
                        checked ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
                      )
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Shadows not supported in email. Preview only.
                </p>
              </div>

              <Separator />

              {/* Opacity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Opacity
                    <Badge variant="outline" className="ml-2 text-xs">
                      Preview Only
                    </Badge>
                  </Label>
                  <Badge variant="default" className="text-xs">
                    {Math.round(opacity * 100)}%
                  </Badge>
                </div>
                <Slider
                  value={[opacity]}
                  onValueChange={(value) =>
                    handleStyleChange("opacity", value[0].toString())
                  }
                  max={1}
                  min={0}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Opacity not supported in email. Preview only.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ==================== SPACING SECTION ==================== */}
          <AccordionItem value="spacing" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-amber-50/50 hover:bg-amber-50 border-b">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-amber-600" />
                <span className="font-medium">Spacing</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4 pt-2">
              {/* Padding - Inner Spacing */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">
                    Inner Padding (inside container)
                  </Label>
                  <Badge variant="default" className="text-xs">
                    Email Safe
                  </Badge>
                </div>
                <Card className="bg-slate-50 border-dashed">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Top */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Top
                        </Label>
                        <Input
                          type="number"
                          value={paddingTop}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(100, parseInt(e.target.value) || 0)
                            );
                            handleStyleChange("paddingTop", `${value}px`);
                          }}
                          className="h-8 text-sm"
                          min={0}
                          max={100}
                        />
                      </div>

                      {/* Right */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Right
                        </Label>
                        <Input
                          type="number"
                          value={paddingRight}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(100, parseInt(e.target.value) || 0)
                            );
                            handleStyleChange("paddingRight", `${value}px`);
                          }}
                          className="h-8 text-sm"
                          min={0}
                          max={100}
                        />
                      </div>

                      {/* Bottom */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Bottom
                        </Label>
                        <Input
                          type="number"
                          value={paddingBottom}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(100, parseInt(e.target.value) || 0)
                            );
                            handleStyleChange("paddingBottom", `${value}px`);
                          }}
                          className="h-8 text-sm"
                          min={0}
                          max={100}
                        />
                      </div>

                      {/* Left */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Left
                        </Label>
                        <Input
                          type="number"
                          value={paddingLeft}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(100, parseInt(e.target.value) || 0)
                            );
                            handleStyleChange("paddingLeft", `${value}px`);
                          }}
                          className="h-8 text-sm"
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground">
                  ✅ Padding works reliably across all email clients
                </p>
              </div>

              <Separator />

              {/* Margin - Outer Spacing */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">
                    Outer Margin (around container)
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    Limited Support
                  </Badge>
                </div>
                <Card className="bg-slate-50 border-dashed">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Margin Top */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Top Margin
                        </Label>
                        <Input
                          type="number"
                          value={marginTop}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(100, parseInt(e.target.value) || 0)
                            );
                            handleStyleChange("marginTop", `${value}px`);
                          }}
                          className="h-8 text-sm"
                          min={0}
                          max={100}
                        />
                      </div>

                      {/* Margin Bottom */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Bottom Margin
                        </Label>
                        <Input
                          type="number"
                          value={marginBottom}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(100, parseInt(e.target.value) || 0)
                            );
                            handleStyleChange("marginBottom", `${value}px`);
                          }}
                          className="h-8 text-sm"
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Margin may be unreliable. Use padding in parent instead.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ==================== ALIGNMENT SECTION ==================== */}
          <AccordionItem value="alignment" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-orange-50/50 hover:bg-orange-50 border-b">
              <div className="flex items-center gap-2">
                <span className="text-orange-600">⬌</span>
                <span className="font-medium">Content Alignment</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4 pt-2">
              {/* Vertical Alignment */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Vertical Alignment
                  <Badge variant="outline" className="ml-2 text-xs">
                    Email Safe
                  </Badge>
                </Label>
                <Select
                  value={verticalAlign}
                  onValueChange={(value) =>
                    handleStyleChange("verticalAlign", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">
                      <div className="flex items-center gap-2">
                        <span>⬆</span>
                        <span>Top (Default)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="middle">
                      <div className="flex items-center gap-2">
                        <span>⬌</span>
                        <span>Middle</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bottom">
                      <div className="flex items-center gap-2">
                        <span>⬇</span>
                        <span>Bottom</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How content aligns vertically within this item
                </p>
              </div>

              <Separator />

              {/* Text Alignment */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Text Alignment
                  <Badge variant="outline" className="ml-2 text-xs">
                    Email Safe
                  </Badge>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "left", label: "←" },
                    { value: "center", label: "⊕" },
                    { value: "right", label: "→" },
                  ].map((align) => (
                    <button
                      key={align.value}
                      onClick={() =>
                        handleStyleChange("textAlign", align.value)
                      }
                      className={`px-3 py-2 text-sm font-medium rounded border transition-colors ${
                        textAlign === align.value
                          ? "bg-orange-500 text-white border-orange-600"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {align.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  How text aligns horizontally within content
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ==================== EMAIL INFO SECTION ==================== */}
          <AccordionItem value="email" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-green-50/50 hover:bg-green-50 border-b">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-green-600" />
                <span className="font-medium">Email Rendering</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-3 pt-2">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-3">
                  <p className="text-xs font-medium text-green-900 leading-relaxed">
                    <strong>✅ Email-Safe Item Container:</strong> Items render
                    as table cells or DIV containers with inline styles. All
                    email clients support these properties perfectly.
                  </p>
                </CardContent>
              </Card>

              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-medium text-slate-700">
                  Supported in email:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>✅ Background color (hex only)</li>
                  <li>✅ Borders (width, color, style)</li>
                  <li>✅ Padding (inner spacing)</li>
                  <li>✅ Vertical alignment</li>
                  <li>✅ Text alignment</li>
                  <li>✅ Border radius (limited Outlook)</li>
                </ul>
              </div>

              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-medium text-slate-700">
                  Preview-only features:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>⚠️ Drop shadow (not in email)</li>
                  <li>⚠️ Opacity (not in email)</li>
                  <li>⚠️ Margin (limited support)</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
            Delete Item Container
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
