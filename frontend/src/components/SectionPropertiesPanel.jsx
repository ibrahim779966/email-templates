// SectionPropertiesPanel.jsx - Complete Email-Safe Version

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
  Palette,
  Layers,
  Move,
  Trash2,
  Square,
  AlertCircle,
  Info,
} from "lucide-react";

/**
 * SectionPropertiesPanel - Email-Safe Section Container Properties
 *
 * Features:
 * - Top-level section container for email templates
 * - Background color and border styling
 * - Margin controls (outer spacing)
 * - Border radius with Outlook warning
 * - Drop shadow (preview only)
 * - Full email compatibility guidance
 *
 * Important: Sections are top-level containers that wrap all content
 * They render as outer table wrappers in email
 */

export default function SectionPropertiesPanel({
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
  const backgroundColor = styles.backgroundColor || "#f9f9f9";
  const borderWidth = getSafeNumericValue(styles.borderWidth, 0);
  const borderColor = styles.borderColor || "#e5e5e5";
  const borderStyle = styles.borderStyle || "solid";
  const borderRadius = getSafeNumericValue(styles.borderRadius, 0);
  const marginTop = getSafeNumericValue(styles.marginTop, 20);
  const marginBottom = getSafeNumericValue(styles.marginBottom, 20);
  const boxShadow = styles.boxShadow || "none";

  return (
    <Card className="shadow-lg border-0">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Section Container Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Email-safe section wrapper compatible with{" "}
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
                ✅ Email-Safe Section Container
              </p>
              <p className="text-xs text-blue-800">
                Top-level section wrapper for email templates. Renders as outer
                table with all content inside.
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
            <AccordionTrigger className="px-4 py-3 bg-purple-50/50 hover:bg-purple-50 border-b">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
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
                    placeholder="#f9f9f9"
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
                        32,
                        Math.max(0, parseInt(e.target.value) || 0)
                      );
                      handleStyleChange("borderRadius", `${value}px`);
                    }}
                    className="flex-1 text-sm"
                    min={0}
                    max={32}
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
              {/* Top & Bottom Margin */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">
                    Outer Margins (around section)
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    Limited Support
                  </Badge>
                </div>
                <Card className="bg-slate-50 border-dashed">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Margin Top */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Top Margin
                        </Label>
                        <Input
                          type="number"
                          value={marginTop}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(200, parseInt(e.target.value) || 0)
                            );
                            handleStyleChange("marginTop", `${value}px`);
                          }}
                          className="h-8 text-sm"
                          min={0}
                          max={200}
                        />
                      </div>

                      {/* Margin Bottom */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Bottom Margin
                        </Label>
                        <Input
                          type="number"
                          value={marginBottom}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(200, parseInt(e.target.value) || 0)
                            );
                            handleStyleChange("marginBottom", `${value}px`);
                          }}
                          className="h-8 text-sm"
                          min={0}
                          max={200}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Margin may be unreliable. Use padding in content instead.
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
                    <strong>✅ Email-Safe Section Wrapper:</strong> The
                    top-level section renders as an outer table wrapping all
                    content. Perfect for creating full-width email templates.
                  </p>
                </CardContent>
              </Card>

              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-medium text-slate-700">
                  Section role in email:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Outer wrapper for entire email content</li>
                  <li>Provides full-width background color</li>
                  <li>Can have borders around entire email</li>
                  <li>Top/bottom margins add spacing</li>
                  <li>Perfect for header/footer sections</li>
                </ul>
              </div>

              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-medium text-slate-700">
                  Email-safe features:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>✅ Background color (full width)</li>
                  <li>✅ Borders work perfectly</li>
                  <li>✅ Top/bottom margins (using spacer rows)</li>
                  <li>✅ Works in all email clients</li>
                  <li>✅ Mobile responsive</li>
                </ul>
              </div>

              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-medium text-slate-700">Common uses:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Outer email wrapper with background</li>
                  <li>Header section with background color</li>
                  <li>Footer section with styling</li>
                  <li>Content sections with borders</li>
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
            Delete Section
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
