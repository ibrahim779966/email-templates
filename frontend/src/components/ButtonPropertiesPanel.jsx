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

  // ✅ Merge styles safely
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

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Button Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Links fully functional in the{" "}
          <Badge variant="secondary" className="text-xs">
            Preview
          </Badge>{" "}
          and{" "}
          <Badge variant="secondary" className="text-xs">
            Export
          </Badge>{" "}
          views!
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
                    value={element.link || ""}
                    onChange={(e) => handleUpdate("link", e.target.value)}
                    placeholder="https://example.com"
                    className="transition-all duration-200"
                  />
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Size (px)</Label>
                  <Input
                    type="number"
                    min="8"
                    value={parseInt(element.styles?.fontSize) || 14}
                    onChange={(e) =>
                      handleStyleChange("fontSize", `${e.target.value}px`)
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Width (px)</Label>
                      <Input
                        type="number"
                        value={parseInt(element.styles?.width) || 120}
                        onChange={(e) =>
                          handleStyleChange("width", `${e.target.value}px`)
                        }
                        className="transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Height (px)</Label>
                      <Input
                        type="number"
                        value={parseInt(element.styles?.height) || 40}
                        onChange={(e) =>
                          handleStyleChange("height", `${e.target.value}px`)
                        }
                        className="transition-all duration-200"
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

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Border Radius (px)
                  </Label>
                  <Input
                    type="number"
                    value={parseInt(element.styles?.borderRadius) || 4}
                    onChange={(e) =>
                      handleStyleChange("borderRadius", `${e.target.value}px`)
                    }
                    className="transition-all duration-200"
                  />
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
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Spacing Section */}
          <AccordionItem value="spacing" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-green-50/50 hover:bg-green-50 border-b">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-green-600" />
                <span className="font-medium">Spacing</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-6 pt-2">
                {/* Padding */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Padding</Label>
                    <Badge variant="outline" className="text-xs">
                      px
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
                                value={parseInt(element.styles?.[key]) || 0}
                                onChange={(e) =>
                                  handleStyleChange(key, `${e.target.value}px`)
                                }
                                className="h-8 text-sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Margin */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Margin</Label>
                    <Badge variant="outline" className="text-xs">
                      px
                    </Badge>
                  </div>
                  <Card className="bg-slate-50 border-dashed">
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
                                value={parseInt(element.styles?.[key]) || 0}
                                onChange={(e) =>
                                  handleStyleChange(key, `${e.target.value}px`)
                                }
                                className="h-8 text-sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
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
