// DividerPropertiesPanel/jsx
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

  // ✅ Merge styles safely
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

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          Divider Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Create visual separations with customizable{" "}
          <Badge variant="secondary" className="text-xs">
            dividers
          </Badge>{" "}
          and optional text content.
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
                  <Label className="text-sm font-medium">Divider Text</Label>
                  <Input
                    value={element.content || ""}
                    onChange={(e) => handleUpdate("content", e.target.value)}
                    placeholder="Optional text inside divider"
                    className="transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty for a simple line divider
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
                  <Label className="text-sm font-medium">Thickness (px)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={parseInt(element.styles?.height) || 2}
                    onChange={(e) =>
                      handleStyleChange("height", `${e.target.value}px`)
                    }
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Border Width (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={parseInt(element.styles?.borderBottomWidth) || 2}
                    onChange={(e) =>
                      handleStyleChange(
                        "borderBottomWidth",
                        `${e.target.value}px`
                      )
                    }
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Border Style</Label>
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
                          Solid
                        </div>
                      </SelectItem>
                      <SelectItem value="dotted">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-gray-600 border-dotted border-t-2 border-gray-600"></div>
                          Dotted
                        </div>
                      </SelectItem>
                      <SelectItem value="dashed">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-gray-600 border-dashed border-t-2 border-gray-600"></div>
                          Dashed
                        </div>
                      </SelectItem>
                      <SelectItem value="double">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1 border-double border-t-4 border-gray-600"></div>
                          Double
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color</Label>
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
              <div className="space-y-4 pt-2">
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
