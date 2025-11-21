import React, { useState } from "react";
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
import { Trash2, Type, Palette, Move } from "lucide-react";

export default function ButtonPropertiesPanel({
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

  // ✅ Update non-style props
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
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Button Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Email-safe buttons compatible with{" "}
          <Badge variant="secondary" className="text-xs">
            Gmail
          </Badge>{" "}
          <Badge variant="secondary" className="text-xs">
            Outlook
          </Badge>{" "}
          <Badge variant="secondary" className="text-xs">
            Yahoo
          </Badge>{" "}
          and all major email clients!
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
                  <Label className="text-sm font-medium">Button Text</Label>
                  <Input
                    value={element.content || ""}
                    onChange={(e) => handleUpdate("content", e.target.value)}
                    placeholder="Enter button text..."
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Link URL</Label>
                  <Input
                    type="url"
                    value={element.link || "https://www.google.com"}
                    onChange={(e) => handleUpdate("link", e.target.value)}
                    placeholder="https://example.com"
                    className="transition-all duration-200"
                  />
                  {/* WARNING ADDED HERE */}
                  <p className="text-xs text-red-500 font-medium pt-1">
                    ⚠️ Outlook requires a **valid link (href)** for the button
                    to render correctly using its VML fallback. If no link is
                    provided, the button may not be visible in Outlook.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Styling Section */}
          <AccordionItem value="styling" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-purple-50/50 hover:bg-purple-50 border-b">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Styling</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                {/* Font Family - Email Safe */}
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
                      <SelectItem value="Tahoma, Geneva, sans-serif">
                        Tahoma
                      </SelectItem>
                      <SelectItem value="'Courier New', Courier, monospace">
                        Courier New
                      </SelectItem>
                      <SelectItem value="'Trebuchet MS', sans-serif">
                        Trebuchet MS
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                    max="48"
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={element.styles?.color || "#ffffff"}
                        onChange={(e) =>
                          handleStyleChange("color", e.target.value)
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={element.styles?.color || "#ffffff"}
                        onChange={(e) =>
                          handleStyleChange("color", e.target.value)
                        }
                        className="flex-1 font-mono text-sm"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Background</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={element.styles?.backgroundColor || "#007bff"}
                        onChange={(e) =>
                          handleStyleChange("backgroundColor", e.target.value)
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={element.styles?.backgroundColor || "#007bff"}
                        onChange={(e) =>
                          handleStyleChange("backgroundColor", e.target.value)
                        }
                        className="flex-1 font-mono text-sm"
                        placeholder="#007bff"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Width (px)
                      <Badge variant="outline" className="ml-2 text-xs">
                        Min: 120px
                      </Badge>
                    </Label>
                    <Input
                      type="number"
                      min="120"
                      value={getSafeNumericValue(element.styles?.width, 200)}
                      onChange={(e) =>
                        handleStyleChange(
                          "width",
                          `${Math.max(120, parseInt(e.target.value) || 120)}px`
                        )
                      }
                      className="transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Height (px)
                      <Badge variant="outline" className="ml-2 text-xs">
                        Min: 44px
                      </Badge>
                    </Label>
                    <Input
                      type="number"
                      min="44"
                      value={getSafeNumericValue(element.styles?.height, 50)}
                      onChange={(e) =>
                        handleStyleChange(
                          "height",
                          `${Math.max(44, parseInt(e.target.value) || 44)}px`
                        )
                      }
                      className="transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Border Radius (px)
                    <Badge variant="outline" className="ml-2 text-xs">
                      Max: 25px
                    </Badge>
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="25"
                    value={getSafeNumericValue(element.styles?.borderRadius, 4)}
                    onChange={(e) =>
                      handleStyleChange(
                        "borderRadius",
                        `${Math.min(
                          25,
                          Math.max(0, parseInt(e.target.value) || 0)
                        )}px`
                      )
                    }
                    className="transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    Note: Outlook 2007-2016 doesn't support rounded corners
                  </p>
                </div>

                {/* Border Settings */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Border</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Width (px)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="8"
                        value={getSafeNumericValue(
                          element.styles?.borderWidth,
                          1
                        )}
                        onChange={(e) =>
                          handleStyleChange(
                            "borderWidth",
                            `${Math.min(
                              8,
                              Math.max(0, parseInt(e.target.value) || 0)
                            )}px`
                          )
                        }
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Style</Label>
                      <Select
                        value={element.styles?.borderStyle || "solid"}
                        onValueChange={(value) =>
                          handleStyleChange("borderStyle", value)
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                          <SelectItem value="dotted">Dotted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Color</Label>
                      <Input
                        type="color"
                        value={element.styles?.borderColor || "#007bff"}
                        onChange={(e) =>
                          handleStyleChange("borderColor", e.target.value)
                        }
                        className="h-8 p-1 cursor-pointer"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max border width: 8px for Outlook compatibility
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

                {/* Font Weight */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Weight</Label>
                  <Select
                    value={element.styles?.fontWeight || "bold"}
                    onValueChange={(value) =>
                      handleStyleChange("fontWeight", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="700">700</SelectItem>
                      <SelectItem value="600">600</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Spacing Section */}
          <AccordionItem value="spacing" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-green-50/50 hover:bg-green-50 border-b">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-green-600" />
                <span className="font-medium">Spacing (Use Padding)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-6 pt-2">
                {/* Padding - Recommended for Email */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">
                      Padding (Recommended)
                    </Label>
                    <Badge variant="default" className="text-xs">
                      Email Safe
                    </Badge>
                  </div>
                  <Card className="bg-slate-50 border-dashed">
                    <CardContent className="p-3">
                      <div className="grid grid-cols-2 gap-3">
                        {["Top", "Right", "Bottom", "Left"].map((side) => {
                          const key = `padding${side}`;
                          return (
                            <div key={key} className="space-y-1">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                                {side}
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                value={getSafeNumericValue(
                                  element.styles?.[key],
                                  0
                                )}
                                onChange={(e) =>
                                  handleStyleChange(
                                    key,
                                    `${Math.max(
                                      0,
                                      parseInt(e.target.value) || 0
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

                <Separator />

                {/* Margin - Warning */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Margin</Label>
                    <Badge variant="destructive" className="text-xs">
                      Limited Support
                    </Badge>
                  </div>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-3">
                      <div className="grid grid-cols-2 gap-3">
                        {["Top", "Right", "Bottom", "Left"].map((side) => {
                          const key = `margin${side}`;
                          return (
                            <div key={key} className="space-y-1">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                                {side}
                              </Label>
                              <Input
                                type="number"
                                value={getSafeNumericValue(
                                  element.styles?.[key],
                                  0
                                )}
                                onChange={(e) =>
                                  handleStyleChange(
                                    key,
                                    `${Math.max(
                                      0,
                                      parseInt(e.target.value) || 0
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
                  <p className="text-xs text-orange-600 font-medium">
                    ⚠️ Margin has unreliable support in email clients. Use
                    padding or table cells for spacing.
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
