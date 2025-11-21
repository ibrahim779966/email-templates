// DividerPropertiesPanel.jsx - Email-Safe Version

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
import { Trash2, Type, Palette, Move, Minus } from "lucide-react";

export default function DividerPropertiesPanel({
  element,
  updateElement,
  deleteElement,
}) {
  if (!element) return null;

  // ✅ Merge styles safely with email-safe defaults
  const handleStyleChange = (key, value) => {
    updateElement(element.id, {
      styles: {
        ...element.styles,
        [key]: value,
      },
    });
  };

  // ✅ Update non-style properties
  const handleUpdate = (key, value) => {
    updateElement(element.id, {
      [key]: value,
    });
  };

  // Helper to get safe numeric values
  const getSafeNumericValue = (styleValue, defaultValue) => {
    const parsed = parseInt(styleValue);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          Divider Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Email-safe dividers compatible with{" "}
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
        <Accordion
          type="multiple"
          defaultValue={["content"]}
          className="w-full"
        >
          {/* Content Section */}
          <AccordionItem value="content" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-blue-50/50 hover:bg-blue-50 border-b">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Content</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Divider Text (Optional)
                  </Label>
                  <Input
                    value={element.content || ""}
                    onChange={(e) => handleUpdate("content", e.target.value)}
                    placeholder="Optional text inside divider"
                    className="transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty for a simple line divider. Text support varies
                    across email clients.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text Alignment</Label>
                  <Select
                    value={element.styles?.textAlign || "center"}
                    onValueChange={(value) =>
                      handleStyleChange("textAlign", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Font styling for divider text */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Font Family
                    <Badge variant="outline" className="ml-2 text-xs">
                      Email Safe
                    </Badge>
                  </Label>
                  <Select
                    value={
                      element.styles?.fontFamily ||
                      "Arial, Helvetica, sans-serif"
                    }
                    onValueChange={(value) =>
                      handleStyleChange("fontFamily", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial, Helvetica, sans-serif">
                        Arial
                      </SelectItem>
                      <SelectItem value="Helvetica, Arial, sans-serif">
                        Helvetica
                      </SelectItem>
                      <SelectItem value="Verdana, Geneva, sans-serif">
                        Verdana
                      </SelectItem>
                      <SelectItem value="Georgia, Times, serif">
                        Georgia
                      </SelectItem>
                      <SelectItem value="'Times New Roman', Times, serif">
                        Times New Roman
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Font Size (px)
                      <Badge variant="outline" className="ml-2 text-xs">
                        Min: 12px
                      </Badge>
                    </Label>
                    <Input
                      type="number"
                      min="12"
                      max="24"
                      value={getSafeNumericValue(element.styles?.fontSize, 14)}
                      onChange={(e) =>
                        handleStyleChange(
                          "fontSize",
                          `${Math.max(12, parseInt(e.target.value) || 12)}px`
                        )
                      }
                      className="transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={element.styles?.color || "#666666"}
                        onChange={(e) =>
                          handleStyleChange("color", e.target.value)
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={element.styles?.color || "#666666"}
                        onChange={(e) =>
                          handleStyleChange("color", e.target.value)
                        }
                        className="flex-1 font-mono text-sm"
                        placeholder="#666666"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Line Styling Section */}
          <AccordionItem value="styling" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-purple-50/50 hover:bg-purple-50 border-b">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Line Styling</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Line Height/Thickness (px)
                    <Badge variant="outline" className="ml-2 text-xs">
                      Recommended: 1-4px
                    </Badge>
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="8"
                    value={getSafeNumericValue(element.styles?.height, 2)}
                    onChange={(e) =>
                      handleStyleChange(
                        "height",
                        `${Math.min(
                          8,
                          Math.max(1, parseInt(e.target.value) || 1)
                        )}px`
                      )
                    }
                    className="transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum 8px for best email client compatibility
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Border Style
                    <Badge variant="outline" className="ml-2 text-xs">
                      Email Safe
                    </Badge>
                  </Label>
                  <Select
                    value={element.styles?.borderBottomStyle || "solid"}
                    onValueChange={(value) =>
                      handleStyleChange("borderBottomStyle", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-gray-600"></div>
                          Solid (Most Compatible)
                        </div>
                      </SelectItem>
                      <SelectItem value="dotted">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-gray-600 border-dotted border-t-2 border-gray-600"></div>
                          Dotted (Limited)
                        </div>
                      </SelectItem>
                      <SelectItem value="dashed">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-gray-600 border-dashed border-t-2 border-gray-600"></div>
                          Dashed (Limited)
                        </div>
                      </SelectItem>
                      <SelectItem value="double">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1 border-double border-t-4 border-gray-600"></div>
                          Double (Limited)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    ⚠️ Dashed, dotted, and double may not render correctly in
                    all email clients. Solid is safest.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Line Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={element.styles?.backgroundColor || "#d1d5db"}
                      onChange={(e) =>
                        handleStyleChange("backgroundColor", e.target.value)
                      }
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={element.styles?.backgroundColor || "#d1d5db"}
                      onChange={(e) =>
                        handleStyleChange("backgroundColor", e.target.value)
                      }
                      className="flex-1 font-mono text-sm"
                      placeholder="#d1d5db"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use hex values only (#d1d5db, #000000, etc.)
                  </p>
                </div>

                {/* Use border-bottom instead of background for better compatibility */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Use Border-Bottom
                    <Badge variant="default" className="ml-2 text-xs">
                      Recommended
                    </Badge>
                  </Label>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded border border-green-200">
                    <input
                      type="checkbox"
                      checked={element.styles?.useBorderBottom !== false}
                      onChange={(e) =>
                        handleStyleChange("useBorderBottom", e.target.checked)
                      }
                      id="useBorder"
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor="useBorder"
                      className="cursor-pointer text-sm"
                    >
                      Use border-bottom instead of height (better email
                      compatibility)
                    </label>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Spacing Section */}
          <AccordionItem value="spacing" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-green-50/50 hover:bg-green-50 border-b">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-green-600" />
                <span className="font-medium">Spacing (Padding Only)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-6 pt-2">
                {/* Padding */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">
                      Padding (Top/Bottom)
                    </Label>
                    <Badge variant="default" className="text-xs">
                      Email Safe
                    </Badge>
                  </div>
                  <Card className="bg-slate-50 border-dashed">
                    <CardContent className="p-3">
                      <div className="grid grid-cols-2 gap-3">
                        {["Top", "Bottom"].map((side) => {
                          const key = `padding${side}`;
                          return (
                            <div key={key} className="space-y-1">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                                {side}
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                max="50"
                                value={getSafeNumericValue(
                                  element.styles?.[key],
                                  0
                                )}
                                onChange={(e) =>
                                  handleStyleChange(
                                    key,
                                    `${Math.min(
                                      50,
                                      Math.max(0, parseInt(e.target.value) || 0)
                                    )}px`
                                  )
                                }
                                className="h-8 text-sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  <p className="text-xs text-muted-foreground">
                    ✅ Padding works reliably across all email clients
                  </p>
                </div>

                {/* Margin - Warning */}
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <div className="text-orange-600 font-bold mt-1">⚠️</div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-orange-900">
                          Don't Use Margin
                        </p>
                        <p className="text-xs text-orange-800">
                          Margin has unreliable support in email clients and is
                          often stripped. Use padding instead, or add empty rows
                          to your email table for vertical spacing.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Width Settings */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Width</Label>
                  <Select
                    value={element.styles?.width || "100%"}
                    onValueChange={(value) => handleStyleChange("width", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100%">
                        Full Width (Recommended)
                      </SelectItem>
                      <SelectItem value="90%">90%</SelectItem>
                      <SelectItem value="80%">80%</SelectItem>
                      <SelectItem value="70%">70%</SelectItem>
                      <SelectItem value="50%">50%</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Most dividers span the full content width. Use percentages
                    instead of pixels for better mobile compatibility.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        {/* Footer with Delete Button */}
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
