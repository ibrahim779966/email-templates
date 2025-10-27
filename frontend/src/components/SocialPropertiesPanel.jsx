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
  Share2,
  Palette,
  Settings,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";

export default function SocialPropertiesPanel({
  element,
  updateElement,
  deleteElement,
}) {
  if (!element) return null;

  // ✅ Merge safely
  const handleStyleChange = (key, value) => {
    updateElement(element.id, {
      styles: {
        ...element.styles,
        [key]: value,
      },
    });
  };

  // ✅ Add a new platform
  const addPlatform = () => {
    const newIcon = {
      id: Date.now(),
      platform: "facebook",
      url: "",
    };
    updateElement(element.id, {
      icons: [...(element.icons || []), newIcon],
    });
  };

  // ✅ Update platform field
  const updatePlatform = (id, field, value) => {
    const updatedIcons = element.icons.map((icon) =>
      icon.id === id ? { ...icon, [field]: value } : icon
    );
    updateElement(element.id, { icons: updatedIcons });
  };

  // ✅ Remove a platform
  const removePlatform = (id) => {
    updateElement(element.id, {
      icons: element.icons.filter((icon) => icon.id !== id),
    });
  };

  const platformOptions = [
    { value: "facebook", label: "Facebook", color: "#1877F2" },
    { value: "youtube", label: "YouTube", color: "#FF0000" },
    { value: "instagram", label: "Instagram", color: "#E4405F" },
    { value: "tiktok", label: "TikTok", color: "#000000" },
    { value: "whatsapp", label: "WhatsApp", color: "#25D366" },
    { value: "telegram", label: "Telegram", color: "#0088CC" },
    { value: "wechat", label: "WeChat", color: "#07C160" },
    { value: "twitter", label: "X / Twitter", color: "#000000" },
    { value: "snapchat", label: "Snapchat", color: "#FFFC00" },
    { value: "reddit", label: "Reddit", color: "#FF4500" },
    { value: "linkedin", label: "LinkedIn", color: "#0A66C2" },
    { value: "pinterest", label: "Pinterest", color: "#BD081C" },
    { value: "threads", label: "Threads", color: "#000000" },
    { value: "discord", label: "Discord", color: "#5865F2" },
    { value: "quora", label: "Quora", color: "#B92B27" },
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          Social Links Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Links and social icons are fully functional in the{" "}
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
          defaultValue={["styling"]}
          className="w-full"
        >
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
                  <Label className="text-sm font-medium">Icon Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={element.styles?.iconColor || "#666666"}
                      onChange={(e) =>
                        handleStyleChange("iconColor", e.target.value)
                      }
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={element.styles?.iconColor || "#666666"}
                      onChange={(e) =>
                        handleStyleChange("iconColor", e.target.value)
                      }
                      className="flex-1 font-mono text-sm"
                      placeholder="#666666"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Alignment</Label>
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

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Spacing Between Icons
                  </Label>
                  <div className="flex gap-1 items-center">
                    <Input
                      type="number"
                      value={parseInt(element.styles?.gap) || 8}
                      onChange={(e) =>
                        handleStyleChange("gap", `${e.target.value}px`)
                      }
                      className="text-sm"
                    />
                    <Badge variant="outline" className="text-xs">
                      px
                    </Badge>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Platforms Section */}
          <AccordionItem value="platforms" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-pink-50/50 hover:bg-pink-50 border-b">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-pink-600" />
                <span className="font-medium">Platforms</span>
                <Badge variant="outline" className="text-xs ml-auto mr-2">
                  {(element.icons || []).length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                {(element.icons || []).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Share2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No social platforms added yet</p>
                    <p className="text-xs mt-1">
                      Click "Add Platform" to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(element.icons || []).map((icon, index) => {
                      const platformInfo = platformOptions.find(
                        (p) => p.value === icon.platform
                      );
                      return (
                        <Card key={icon.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor:
                                        platformInfo?.color || "#666666",
                                    }}
                                  ></div>
                                  <Label className="text-sm font-medium">
                                    Platform #{index + 1}
                                  </Label>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePlatform(icon.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                                  Platform
                                </Label>
                                <Select
                                  value={icon.platform}
                                  onValueChange={(value) =>
                                    updatePlatform(icon.id, "platform", value)
                                  }
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {platformOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                              backgroundColor: option.color,
                                            }}
                                          ></div>
                                          {option.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  URL
                                </Label>
                                <Input
                                  type="url"
                                  value={icon.url || ""}
                                  onChange={(e) =>
                                    updatePlatform(
                                      icon.id,
                                      "url",
                                      e.target.value
                                    )
                                  }
                                  placeholder="https://..."
                                  className="h-9 text-sm"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                <Button
                  onClick={addPlatform}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                  Add Platform
                </Button>
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
