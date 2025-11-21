// SocialPropertiesPanel.jsx - Email-Safe Version

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
  AlertCircle,
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
      altText: "",
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

  // Helper to get safe numeric values
  const getSafeNumericValue = (styleValue, defaultValue) => {
    const parsed = parseInt(styleValue);
    return isNaN(parsed) ? defaultValue : parsed;
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
          Email-safe social links compatible with{" "}
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
          defaultValue={["styling"]}
          className="w-full"
        >
          {/* Email Safety Notice */}
          <div className="px-4 py-3 bg-blue-50 border-b">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium text-blue-900">
                  Email-Safe Social Links
                </p>
                <p className="text-xs text-blue-800">
                  Social icons render as text links with alt text fallback. All
                  links are clickable and tracked across all email clients.
                </p>
              </div>
            </div>
          </div>

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
                {/* Icon Color */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Icon Color
                    <Badge variant="outline" className="ml-2 text-xs">
                      Hex Only
                    </Badge>
                  </Label>
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
                  <p className="text-xs text-muted-foreground">
                    Use hex values for consistent rendering across all email
                    clients
                  </p>
                </div>

                {/* Alignment */}
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
                      <SelectItem value="center">
                        Center (Recommended)
                      </SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Center alignment works most reliably across email clients
                  </p>
                </div>

                {/* Icon Size */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Icon Size (px)
                    <Badge variant="outline" className="ml-2 text-xs">
                      Recommended: 24-32px
                    </Badge>
                  </Label>
                  <div className="flex gap-1 items-center">
                    <Input
                      type="number"
                      min="16"
                      max="64"
                      value={getSafeNumericValue(element.styles?.iconSize, 24)}
                      onChange={(e) =>
                        handleStyleChange(
                          "iconSize",
                          `${Math.min(
                            64,
                            Math.max(16, parseInt(e.target.value) || 24)
                          )}px`
                        )
                      }
                      className="text-sm"
                    />
                    <Badge variant="outline" className="text-xs">
                      px
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    16-64px range. Smaller sizes work better in email clients
                    (max 32px)
                  </p>
                </div>

                {/* Spacing Between Icons */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Spacing Between Icons
                    <Badge variant="outline" className="ml-2 text-xs">
                      Recommended: 8-16px
                    </Badge>
                  </Label>
                  <div className="flex gap-1 items-center">
                    <Input
                      type="number"
                      min="4"
                      max="32"
                      value={getSafeNumericValue(element.styles?.gap, 8)}
                      onChange={(e) =>
                        handleStyleChange(
                          "gap",
                          `${Math.min(
                            32,
                            Math.max(4, parseInt(e.target.value) || 8)
                          )}px`
                        )
                      }
                      className="text-sm"
                    />
                    <Badge variant="outline" className="text-xs">
                      px
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use padding or cells for spacing, not margin (unreliable in
                    email)
                  </p>
                </div>

                {/* Font */}
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
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size for Labels */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Font Size (px)
                    <Badge variant="outline" className="ml-2 text-xs">
                      12-14px
                    </Badge>
                  </Label>
                  <div className="flex gap-1 items-center">
                    <Input
                      type="number"
                      min="12"
                      max="18"
                      value={getSafeNumericValue(element.styles?.fontSize, 14)}
                      onChange={(e) =>
                        handleStyleChange(
                          "fontSize",
                          `${Math.min(
                            18,
                            Math.max(12, parseInt(e.target.value) || 14)
                          )}px`
                        )
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
                                <p className="text-xs text-muted-foreground">
                                  Full URL to your social profile
                                </p>
                              </div>

                              {/* Alt Text for Accessibility */}
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                                  Alt Text (Accessibility)
                                </Label>
                                <Input
                                  type="text"
                                  value={icon.altText || ""}
                                  onChange={(e) =>
                                    updatePlatform(
                                      icon.id,
                                      "altText",
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Follow us on ${
                                    platformInfo?.label || "Social Media"
                                  }`}
                                  maxLength="100"
                                  className="h-9 text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                  e.g., "Follow us on{" "}
                                  {platformInfo?.label || "Social"}" (max 100
                                  chars)
                                </p>
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
