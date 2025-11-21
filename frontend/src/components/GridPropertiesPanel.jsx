// GridPropertiesPanel.jsx - Complete Email-Safe Version

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
  Grid3x3,
  Palette,
  Move,
  Layers,
  Trash2,
  LayoutGrid,
  AlertCircle,
  Info,
} from "lucide-react";

/**
 * GridPropertiesPanel - Email-Safe Grid Container Properties
 *
 * Features:
 * - Grid layout with 1-4 columns
 * - Gap control between grid items
 * - Background color and border styling
 * - Padding and margin controls
 * - Automatic table conversion for email
 * - Mobile-responsive stacking
 *
 * Important: CSS Grid converts to tables in email export
 * All spacing and styling preserved automatically
 */

export default function GridPropertiesPanel({
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

  /**
   * Get column count from grid-template-columns
   */
  const getColumnCount = () => {
    const cols = styles.gridTemplateColumns || "repeat(2, 1fr)";
    const match = cols.match(/repeat\((\d+),/);
    return match ? parseInt(match[1]) : 2;
  };

  /**
   * Set column count
   */
  const setColumnCount = (count) => {
    handleStyleChange("gridTemplateColumns", `repeat(${count}, 1fr)`);
  };

  // Get current values from styles
  const columnCount = getColumnCount();
  const gap = getSafeNumericValue(styles.gap, 16);
  const backgroundColor = styles.backgroundColor || "#f9f9f9";
  const borderWidth = getSafeNumericValue(styles.borderWidth, 0);
  const borderColor = styles.borderColor || "#e5e7eb";
  const borderStyle = styles.borderStyle || "solid";
  const borderRadius = getSafeNumericValue(styles.borderRadius, 0);
  const paddingTop = getSafeNumericValue(styles.paddingTop, 0);
  const paddingRight = getSafeNumericValue(styles.paddingRight, 0);
  const paddingBottom = getSafeNumericValue(styles.paddingBottom, 0);
  const paddingLeft = getSafeNumericValue(styles.paddingLeft, 0);
  const marginTop = getSafeNumericValue(styles.marginTop, 0);
  const marginBottom = getSafeNumericValue(styles.marginBottom, 16);
  return (
    <Card className="shadow-lg border-0">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Grid Container Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Email-safe grid layout compatible with{" "}
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
                ✅ Email-Safe Grid Container
              </p>
              <p className="text-xs text-blue-800">
                CSS Grid automatically converts to table layout in email. All
                spacing, borders, and styling preserved perfectly.
              </p>
            </div>
          </div>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["layout", "appearance"]}
          className="w-full"
        >
          {/* ==================== GRID LAYOUT SECTION ==================== */}
          <AccordionItem value="layout" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-blue-50/50 hover:bg-blue-50 border-b">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Grid Layout</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4 pt-2">
              {/* Column Count */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Number of Columns
                  <Badge variant="outline" className="ml-2 text-xs">
                    Best: 2-3
                  </Badge>
                </Label>
                <Select
                  value={columnCount.toString()}
                  onValueChange={(value) => setColumnCount(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select columns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <span>▯</span>
                        <span>1 Column</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center gap-2">
                        <span>▯ ▯</span>
                        <span>2 Columns (Recommended)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="3">
                      <div className="flex items-center gap-2">
                        <span>▯ ▯ ▯</span>
                        <span>3 Columns</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="4">
                      <div className="flex items-center gap-2">
                        <span>▯ ▯ ▯ ▯</span>
                        <span>4 Columns</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  2-3 columns recommended for mobile-friendly emails
                </p>
              </div>

              <Separator />

              {/* Grid Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preview</Label>
                <div
                  className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                    gap: `${gap}px`,
                  }}
                >
                  {Array.from({ length: columnCount }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border-2 border-blue-400 rounded p-3 text-center text-xs font-medium text-blue-700"
                    >
                      Column {i + 1}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {columnCount} column{columnCount !== 1 ? "s" : ""} with {gap}
                  px gap
                </p>
              </div>

              <Separator />

              {/* Gap - Spacing between items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Gap Between Items
                    <Badge variant="outline" className="ml-2 text-xs">
                      Email: Cell Padding
                    </Badge>
                  </Label>
                  <Badge variant="default" className="text-xs">
                    {gap}px
                  </Badge>
                </div>
                <Slider
                  value={[gap]}
                  onValueChange={(value) =>
                    handleStyleChange("gap", `${value[0]}px`)
                  }
                  max={60}
                  min={0}
                  step={4}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Spacing between grid items. Converts to cell padding in email
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ==================== APPEARANCE SECTION ==================== */}
          <AccordionItem value="appearance" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-cyan-50/50 hover:bg-cyan-50 border-b">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-600" />
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
                    placeholder="#e0f2fe"
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
                    <div className="grid grid-cols-3 gap-3">
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
            </AccordionContent>
          </AccordionItem>

          {/* ==================== SPACING SECTION ==================== */}
          <AccordionItem value="spacing" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-indigo-50/50 hover:bg-indigo-50 border-b">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-indigo-600" />
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
                    <strong>✅ Email-Safe Grid:</strong> CSS Grid automatically
                    converts to table-based layout in email export. All spacing,
                    borders, and styling perfectly preserved.
                  </p>
                </CardContent>
              </Card>

              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-medium text-slate-700">
                  How grid converts to email:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Grid converts to HTML table with columns</li>
                  <li>Gap becomes cell padding</li>
                  <li>Padding wraps the table</li>
                  <li>Margins use spacer rows</li>
                  <li>Mobile auto-stacks to single column</li>
                </ul>
              </div>

              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-medium text-slate-700">
                  Email-safe features:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>✅ Works in all email clients</li>
                  <li>✅ Mobile responsive stacking</li>
                  <li>✅ 1-4 columns supported</li>
                  <li>✅ Best with 2-3 columns</li>
                  <li>✅ All styling preserved</li>
                </ul>
              </div>

              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-medium text-slate-700">
                  Column recommendations:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>1 column: Full width, best for mobile-first</li>
                  <li>2 columns: ~280px each (ideal)</li>
                  <li>3 columns: ~185px each (tight)</li>
                  <li>4 columns: ~140px each (very cramped)</li>
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
            Delete Grid Container
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
