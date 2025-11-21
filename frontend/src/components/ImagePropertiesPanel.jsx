// ImagePropertiesPanel.jsx - Email-Safe Version with Canvas Cropping

import React, { useRef, useEffect, useState } from "react";
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
  Trash2,
  Image as ImageIcon,
  Palette,
  Move,
  Layers,
  RotateCw,
  Upload,
  Link,
  AlertCircle,
  Shapes,
  Wand2,
  Loader2,
} from "lucide-react";
import CanvasCropModal from "./CanvasCropModal";
import { applyCanvasCropToElement } from "../api/utils/imageUtils";

const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

// Border radius helpers
const composeCornerRadius = (styles, fallback = "0px") => {
  const tl = styles?.borderTopLeftRadius;
  const tr = styles?.borderTopRightRadius;
  const br = styles?.borderBottomRightRadius;
  const bl = styles?.borderBottomLeftRadius;

  const anyCorner = tl || tr || br || bl;
  if (anyCorner) {
    return `${tl || "0px"} ${tr || "0px"} ${br || "0px"} ${bl || "0px"}`;
  }
  return styles?.borderRadius || fallback;
};

const getShapeBorderRadius = (shapeType, styles) => {
  switch ((shapeType || "rectangle").toLowerCase()) {
    case "circle":
    case "oval":
      return "50%";
    case "rounded-rectangle":
      return composeCornerRadius(styles, "12px");
    case "rectangle":
      return composeCornerRadius(styles, "0px");
    case "trapezoid":
    case "star":
    default:
      return "0px";
  }
};

const getShapeClipPath = (shapeType) => {
  switch ((shapeType || "rectangle").toLowerCase()) {
    case "trapezoid":
      return "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)";
    case "star":
      return "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
    default:
      return "none";
  }
};

export default function ImagePropertiesPanel({
  element,
  updateElement,
  handleImageUpload,
  deleteElement,
}) {
  if (!element) return null;

  // ============================================================================
  // STATE
  // ============================================================================
  const fileInputRef = useRef(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [cropError, setCropError] = useState(null);

  const isImagePresent =
    element.content && element.content.startsWith("data:image");

  useEffect(() => {
    if (!isBrowser()) return;
    const handler = (ev) => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
    window.addEventListener("open-image-upload", handler);
    return () => window.removeEventListener("open-image-upload", handler);
  }, [element?.id]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  // Email-safe style change handler
  const handleStyleChange = (key, value) => {
    const updatedStyles = {
      ...element.styles,
      [key]: value,
    };

    // Border handling
    if (key === "borderWidth" && parseInt(value) > 0) {
      updatedStyles.borderStyle = updatedStyles.borderStyle || "solid";
      updatedStyles.borderColor = updatedStyles.borderColor || "#000000";
    }

    if (key === "borderColor" && !updatedStyles.borderWidth) {
      updatedStyles.borderWidth = "1px";
      updatedStyles.borderStyle = updatedStyles.borderStyle || "solid";
    }

    updateElement(element.id, { styles: updatedStyles });
  };

  // Handle shape changes
  const handleShapeChange = (shapeType) => {
    const updatedStyles = {
      ...element.styles,
      shapeType: shapeType,
    };

    switch (shapeType) {
      case "rectangle":
        updatedStyles.clipPath = "none";
        break;
      case "rounded-rectangle":
        if (
          !updatedStyles.borderRadius &&
          !updatedStyles.borderTopLeftRadius &&
          !updatedStyles.borderTopRightRadius &&
          !updatedStyles.borderBottomRightRadius &&
          !updatedStyles.borderBottomLeftRadius
        ) {
          updatedStyles.borderRadius = "12px";
        }
        updatedStyles.clipPath = "none";
        break;
      case "circle":
      case "oval":
        updatedStyles.borderRadius = "50%";
        updatedStyles.clipPath = "none";
        delete updatedStyles.borderTopLeftRadius;
        delete updatedStyles.borderTopRightRadius;
        delete updatedStyles.borderBottomRightRadius;
        delete updatedStyles.borderBottomLeftRadius;
        break;
      case "trapezoid":
        updatedStyles.borderRadius = "0px";
        updatedStyles.clipPath = "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)";
        delete updatedStyles.borderTopLeftRadius;
        delete updatedStyles.borderTopRightRadius;
        delete updatedStyles.borderBottomRightRadius;
        delete updatedStyles.borderBottomLeftRadius;
        break;
      case "star":
        updatedStyles.borderRadius = "0px";
        updatedStyles.clipPath =
          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
        delete updatedStyles.borderTopLeftRadius;
        delete updatedStyles.borderTopRightRadius;
        delete updatedStyles.borderBottomRightRadius;
        delete updatedStyles.borderBottomLeftRadius;
        break;
      default:
        updatedStyles.borderRadius = "0px";
        updatedStyles.clipPath = "none";
    }

    updateElement(element.id, { styles: updatedStyles });
  };

  // Update image URL
  const handleURLChange = (e) => {
    updateElement(element.id, { content: e.target.value });
  };

  // Update alt text
  const handleAltTextChange = (e) => {
    updateElement(element.id, { altText: e.target.value });
  };

  const handleLayerChange = (direction) => {
    if (direction === "front") {
      handleStyleChange("zIndex", 1000);
    } else if (direction === "back") {
      handleStyleChange("zIndex", 1);
    }
  };

  const isCornerRadiusDisabled = () => {
    const shapeType = element.styles?.shapeType || "rectangle";
    return ["circle", "oval", "trapezoid", "star"].includes(shapeType);
  };

  const getCornerRadiusValue = () => {
    if (isCornerRadiusDisabled()) return 0;
    return parseInt(element.styles?.borderRadius) || 0;
  };

  // ============================================================================
  // CANVAS CROP HANDLERS
  // ============================================================================

  const handleApplyCanvasCrop = async (cropData) => {
    try {
      setIsCropping(true);
      setCropError(null);
      setCropModalOpen(false);

      // Apply crop
      const success = await applyCanvasCropToElement(
        element,
        cropData,
        updateElement,
        true // Upload to Cloudinary
      );

      if (success) {
        console.log("✅ Image cropped successfully!");
        // Optional: Show success toast notification
      }
    } catch (error) {
      console.error("❌ Crop failed:", error);
      setCropError(error.message || "Failed to crop image");
      // Optional: Show error toast notification
    } finally {
      setIsCropping(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
          Image Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Upload images, add alt text for email safety, and customize appearance{" "}
          <Badge variant="secondary" className="text-xs">
            Email-Safe
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Accordion type="multiple" defaultValue={["source"]} className="w-full">
          {/* ===================================================================
              IMAGE SOURCE SECTION
              =================================================================== */}
          <AccordionItem value="source" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-cyan-50/50 hover:bg-cyan-50 border-b">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-600" />
                <span className="font-medium">Image Source</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                {/* Image Preview */}
                {element.content && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Current Image</Label>
                    <div className="relative">
                      <img
                        src={element.content}
                        alt="Current"
                        className="w-full max-h-32 object-contain rounded-md border"
                      />
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {element.content ? "Change Image" : "Upload Image"}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(element.id, file);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      OR
                    </span>
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Link className="w-3 h-3" />
                    Image URL
                  </Label>
                  <Input
                    type="url"
                    value={
                      element.content && !isImagePresent ? element.content : ""
                    }
                    onChange={handleURLChange}
                    placeholder="https://example.com/image.jpg"
                    className="transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use hosted/CDN URLs, not base64 data URIs for email
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ===================================================================
              CANVAS CROPPING SECTION (NEW)
              =================================================================== */}
          <AccordionItem value="cropping" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-green-50/50 hover:bg-green-50 border-b">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-green-600" />
                <span className="font-medium">Canvas Cropping</span>
                {element.cropData && (
                  <Badge className="ml-2 bg-green-600">Applied</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                {/* Info Card */}
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-3">
                    <p className="text-xs text-green-900 font-medium">
                      ✨ Canvas-Based Image Cropping
                    </p>
                    <p className="text-xs text-green-800 mt-2">
                      Crop your image visually on an interactive canvas. The
                      exact crop is saved as a standalone image, ensuring your
                      email shows the perfect crop across all email clients.
                    </p>
                  </CardContent>
                </Card>

                {/* Error Display */}
                {cropError && (
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-3">
                      <p className="text-xs text-red-700">❌ {cropError}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Open Crop Tool Button */}
                <Button
                  type="button"
                  onClick={() => setCropModalOpen(true)}
                  disabled={!element.content || isCropping}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isCropping ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Crop...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Open Canvas Crop Tool
                    </>
                  )}
                </Button>

                {!element.content && (
                  <p className="text-xs text-muted-foreground text-center">
                    Upload an image first to use cropping
                  </p>
                )}

                {/* Crop Applied Indicator */}
                {element.cropData && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-3">
                      <p className="text-xs text-blue-700 font-medium">
                        ✓ Crop Applied
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        Dimensions:{" "}
                        <strong>
                          {element.cropData.width}×{element.cropData.height}px
                        </strong>
                      </p>
                      <p className="text-xs text-blue-600">
                        Position:{" "}
                        <strong>
                          ({element.cropData.x}, {element.cropData.y})
                        </strong>
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ===================================================================
              ACCESSIBILITY & EMAIL SAFETY SECTION
              =================================================================== */}
          <AccordionItem value="accessibility" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-emerald-50/50 hover:bg-emerald-50 border-b">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">
                  Accessibility & Email Safety
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <Card className="bg-emerald-50 border-emerald-200">
                  <CardContent className="p-3">
                    <p className="text-xs text-emerald-900 font-medium">
                      ✅ Email-Safe Images Requirement
                    </p>
                    <p className="text-xs text-emerald-800 mt-2">
                      Always include descriptive alt text. Many email clients
                      (like Outlook) disable images by default. Alt text helps
                      recipients understand your message and improves
                      accessibility.
                    </p>
                  </CardContent>
                </Card>

                {/* Alt Text Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Alt Text
                    <Badge variant="default" className="ml-2 text-xs">
                      Required
                    </Badge>
                  </Label>
                  <Input
                    value={element.altText || ""}
                    onChange={handleAltTextChange}
                    placeholder="Describe the image content..."
                    maxLength="125"
                    className="transition-all duration-200"
                  />
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      Describe what the image shows for screen readers and
                      image-disabled clients
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {(element.altText || "").length}/125
                    </span>
                  </div>
                </div>

                {/* Image Hosting Best Practice */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Image Hosting</Label>
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded border border-blue-200">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm space-y-1">
                      <p className="font-medium text-blue-900">
                        Use Hosted URLs
                      </p>
                      <p className="text-xs text-blue-800">
                        Use CDN/hosted image URLs instead of base64 data URIs:
                      </p>
                      <p className="text-xs text-blue-700 font-mono mt-1">
                        ✓ https://cdn.example.com/image.jpg
                      </p>
                      <p className="text-xs text-blue-700 font-mono">
                        ✗ data:image/png;base64,iVBO...
                      </p>
                      <p className="text-xs text-blue-800 mt-1">
                        Benefits: Better deliverability, smaller email size,
                        faster loading
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Optimization Tip */}
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-3">
                    <p className="text-xs font-medium text-orange-900">
                      📊 Image Optimization Tips
                    </p>
                    <ul className="text-xs text-orange-800 mt-2 space-y-1">
                      <li>• Keep file size under 200KB for fast loading</li>
                      <li>
                        • Use multiple smaller images instead of one large image
                      </li>
                      <li>• Maintain 60:40 text-to-image ratio</li>
                      <li>• Compress images with tools like TinyPNG</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ===================================================================
              IMAGE SHAPE & SIZING SECTION
              =================================================================== */}
          <AccordionItem value="shape" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-indigo-50/50 hover:bg-indigo-50 border-b">
              <div className="flex items-center gap-2">
                <Shapes className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">Image Shape & Sizing</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Shape
                    <Badge variant="outline" className="ml-2 text-xs">
                      Web Only
                    </Badge>
                  </Label>
                  <Select
                    value={element.styles?.shapeType || "rectangle"}
                    onValueChange={handleShapeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="rounded-rectangle">
                        Rounded Rectangle
                      </SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="oval">Oval</SelectItem>
                      <SelectItem value="trapezoid">
                        Trapezoid (Email Limited)
                      </SelectItem>
                      <SelectItem value="star">Star (Email Limited)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Note: Complex shapes may not render in all email clients.
                    Stick to rectangles for email.
                  </p>
                </div>

                {/* Shape Preview */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preview</Label>
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 border mx-auto"
                    style={{
                      borderRadius: getShapeBorderRadius(
                        element.styles?.shapeType,
                        element.styles
                      ),
                      clipPath: getShapeClipPath(element.styles?.shapeType),
                    }}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ===================================================================
              DIMENSIONS & LAYOUT SECTION
              =================================================================== */}
          <AccordionItem value="layout" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-purple-50/50 hover:bg-purple-50 border-b">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Dimensions & Layout</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                {/* Email-Safe Sizing Warning */}
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-3">
                    <p className="text-xs font-medium text-yellow-900">
                      ⚠️ Email Width Guidelines
                    </p>
                    <p className="text-xs text-yellow-800 mt-2">
                      Email content width should be{" "}
                      <strong>600px or less</strong> for optimal display across
                      all devices and email clients. Mobile will resize
                      automatically.
                    </p>
                  </CardContent>
                </Card>

                {/* Size Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Width
                      <Badge variant="outline" className="ml-2 text-xs">
                        px
                      </Badge>
                    </Label>
                    <Input
                      type="number"
                      min="40"
                      max="600"
                      value={parseInt(element.styles?.width) || 300}
                      onChange={(e) =>
                        handleStyleChange(
                          "width",
                          `${Math.min(600, parseInt(e.target.value) || 300)}px`
                        )
                      }
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground">Max: 600px</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Height
                      <Badge variant="outline" className="ml-2 text-xs">
                        px
                      </Badge>
                    </Label>
                    <Input
                      type="number"
                      min="40"
                      value={parseInt(element.styles?.height) || 200}
                      onChange={(e) =>
                        handleStyleChange(
                          "height",
                          `${Math.max(40, parseInt(e.target.value) || 200)}px`
                        )
                      }
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Object Fit */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Image Fit</Label>
                  <Select
                    value={element.styles?.objectFit || "contain"}
                    onValueChange={(value) =>
                      handleStyleChange("objectFit", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select fit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contain">
                        Contain - Fit within bounds (Recommended)
                      </SelectItem>
                      <SelectItem value="cover">
                        Cover - Fill container
                      </SelectItem>
                      <SelectItem value="fill">
                        Fill - Stretch to fit
                      </SelectItem>
                      <SelectItem value="none">None - Original size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Alignment */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Alignment</Label>
                  <Select
                    value={element.styles?.textAlign || "left"}
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
                        Center (Email-Safe)
                      </SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Center alignment works most reliably across email clients
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ===================================================================
              STYLING SECTION
              =================================================================== */}
          <AccordionItem value="styling" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-orange-50/50 hover:bg-orange-50 border-b">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Styling</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                {/* Border */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Border (Email-Safe)
                  </Label>
                  <Card className="bg-slate-50 border-dashed">
                    <CardContent className="p-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                            Width
                          </Label>
                          <div className="flex gap-1 items-center">
                            <Input
                              type="number"
                              min="0"
                              max="8"
                              value={parseInt(element.styles?.borderWidth) || 0}
                              onChange={(e) =>
                                handleStyleChange(
                                  "borderWidth",
                                  `${Math.min(
                                    8,
                                    parseInt(e.target.value) || 0
                                  )}px`
                                )
                              }
                              className="h-8 text-sm"
                            />
                            <Badge variant="outline" className="text-xs">
                              px
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                            Color
                          </Label>
                          <Input
                            type="color"
                            value={element.styles?.borderColor || "#000000"}
                            onChange={(e) =>
                              handleStyleChange("borderColor", e.target.value)
                            }
                            className="h-8 w-full p-1 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Style
                        </Label>
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
                            <SelectItem value="solid">
                              Solid (Most Compatible)
                            </SelectItem>
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
                  <p className="text-xs text-muted-foreground">
                    Max 8px width for Outlook compatibility
                  </p>
                </div>

                {/* Border Radius */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Corner Radius
                    <Badge variant="outline" className="ml-2 text-xs">
                      Limited Support
                    </Badge>
                  </Label>
                  <div className="flex gap-1 items-center">
                    <Input
                      type="number"
                      min="0"
                      max="25"
                      value={getCornerRadiusValue()}
                      onChange={(e) =>
                        handleStyleChange(
                          "borderRadius",
                          `${Math.min(25, parseInt(e.target.value) || 0)}px`
                        )
                      }
                      className="text-sm"
                      disabled={isCornerRadiusDisabled()}
                    />
                    <Badge variant="outline" className="text-xs">
                      px
                    </Badge>
                  </div>
                  {isCornerRadiusDisabled() && (
                    <p className="text-xs text-muted-foreground">
                      {element.styles?.shapeType === "circle" ||
                      element.styles?.shapeType === "oval"
                        ? "Corner radius is automatically set to 50% for circular shapes"
                        : "Corner radius doesn't apply to polygon shapes (trapezoid, star)"}
                    </p>
                  )}
                  <p className="text-xs text-orange-600">
                    ⚠️ Not supported in Outlook 2007-2016. Works best with
                    rectangles.
                  </p>
                </div>

                {/* Opacity */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Opacity
                      <Badge variant="outline" className="ml-2 text-xs">
                        Limited
                      </Badge>
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(
                        (element.styles?.opacity !== undefined
                          ? parseFloat(element.styles.opacity)
                          : 1) * 100
                      )}
                      %
                    </Badge>
                  </div>
                  <Slider
                    value={[
                      element.styles?.opacity !== undefined
                        ? parseFloat(element.styles.opacity)
                        : 1,
                    ]}
                    onValueChange={(value) =>
                      handleStyleChange("opacity", value[0].toString())
                    }
                    max={1}
                    min={0}
                    step={0.05}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    May not work in all email clients
                  </p>
                </div>

                {/* Shadow - Warning */}
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-red-900">
                          ⚠️ Shadows Not Supported in Email
                        </p>
                        <p className="text-xs text-red-800">
                          Box shadows don't render in most email clients. Avoid
                          for email campaigns.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rotation - Warning */}
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-red-900">
                          ⚠️ Rotation Not Supported in Email
                        </p>
                        <p className="text-xs text-red-800">
                          Transform and rotation don't work in most email
                          clients. Avoid for email campaigns.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ===================================================================
              LAYERING SECTION
              =================================================================== */}
          <AccordionItem value="layering" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-green-50/50 hover:bg-green-50 border-b">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-green-600" />
                <span className="font-medium">Layering (Web Preview Only)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="p-3">
                    <p className="text-xs text-gray-600 mb-3">
                      Z-index controls layering in the web editor. These
                      settings are preview-only and won't affect email
                      rendering, as email clients don't support z-index.
                    </p>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Z-Index Control
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleLayerChange("front")}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Layers className="w-3 h-3" />
                          To Front
                        </Button>
                        <Button
                          onClick={() => handleLayerChange("back")}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Layers className="w-3 h-3 rotate-180" />
                          To Back
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        For preview only - arrange images using table structure
                        in email
                      </p>
                    </div>
                  </CardContent>
                </Card>
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

      {/* Canvas Crop Modal */}
      <CanvasCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={element.content}
        onCropConfirm={handleApplyCanvasCrop}
        elementDimensions={{
          width: parseInt(element.styles?.width) || 300,
          height: parseInt(element.styles?.height) || 200,
        }}
      />
    </Card>
  );
}
