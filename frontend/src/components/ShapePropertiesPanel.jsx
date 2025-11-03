import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Square,
  Circle,
  Trash2,
  RotateCw,
  Move,
  Palette,
  LayoutGrid,
  Radius,
} from "lucide-react";

const ShapePropertiesPanel = ({
  element,
  updateElement,
  updateElementStyle,
  deleteElement,
}) => {
  const [activeTab, setActiveTab] = useState("shape");
  const styles = element.styles || {};

  // ============================================================================
  // CONFIG
  // ============================================================================

  const shapeOptions = [
    { value: "rectangle", label: "Rectangle", icon: Square },
    { value: "circle", label: "Circle", icon: Circle },
  ];

  const currentShape = styles.shapeType || "rectangle";

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Parse px value - removes 'px' suffix and returns integer
   * @param {string|number} value - Value with or without 'px'
   * @returns {number} Parsed integer value
   */
  const parsePx = (value) => parseInt(value) || 0;

  /**
   * Add px suffix to value
   * @param {string|number} value - Numeric value
   * @returns {string} Value with 'px' suffix
   */
  const toPx = (value) => `${value}px`;

  // ============================================================================
  // STYLE UPDATE HANDLERS
  // ============================================================================

  /**
   * Generic style change handler
   * @param {string} property - CSS property name
   * @param {any} value - Property value
   */
  const handleStyleChange = (property, value) => {
    updateElementStyle(element.id, { [property]: value });
  };

  /**
   * Color change handler
   * @param {string} property - CSS property name
   * @param {string} value - Hex color value
   */
  const handleColorChange = (property, value) => {
    updateElementStyle(element.id, { [property]: value });
  };

  /**
   * Gradient change handler
   * @param {string} property - Gradient property name
   * @param {string} value - Property value
   */
  const handleGradientChange = (property, value) => {
    updateElementStyle(element.id, { [property]: value });
  };

  // ============================================================================
  // SHADOW HANDLERS
  // ============================================================================

  /**
   * Build box-shadow CSS string from individual properties
   * @param {object} params - Shadow parameters
   * @returns {string} Complete box-shadow CSS string
   */
  const buildShadowString = ({ offsetX, offsetY, blur, color }) => {
    if (
      parsePx(offsetX) === 0 &&
      parsePx(offsetY) === 0 &&
      parsePx(blur) === 0
    ) {
      return "none";
    }
    return `${offsetX} ${offsetY} ${blur} ${color}`;
  };

  /**
   * Handle shadow X offset change
   * @param {string} value - New X offset value
   */
  const handleShadowOffsetXChange = (value) => {
    const newShadow = buildShadowString({
      offsetX: toPx(value),
      offsetY: styles.shadowOffsetY || "0px",
      blur: styles.shadowBlurRadius || "0px",
      color: styles.shadowColor || "#000000",
    });

    updateElementStyle(element.id, {
      boxShadow: newShadow,
      shadowOffsetX: toPx(value),
    });
  };

  /**
   * Handle shadow Y offset change
   * @param {string} value - New Y offset value
   */
  const handleShadowOffsetYChange = (value) => {
    const newShadow = buildShadowString({
      offsetX: styles.shadowOffsetX || "0px",
      offsetY: toPx(value),
      blur: styles.shadowBlurRadius || "0px",
      color: styles.shadowColor || "#000000",
    });

    updateElementStyle(element.id, {
      boxShadow: newShadow,
      shadowOffsetY: toPx(value),
    });
  };

  /**
   * Handle shadow blur change
   * @param {string} value - New blur radius value
   */
  const handleShadowBlurChange = (value) => {
    const newShadow = buildShadowString({
      offsetX: styles.shadowOffsetX || "0px",
      offsetY: styles.shadowOffsetY || "0px",
      blur: toPx(value),
      color: styles.shadowColor || "#000000",
    });

    updateElementStyle(element.id, {
      boxShadow: newShadow,
      shadowBlurRadius: toPx(value),
    });
  };

  /**
   * Handle shadow color change
   * @param {string} color - New color value
   */
  const handleShadowColorChange = (color) => {
    const newShadow = buildShadowString({
      offsetX: styles.shadowOffsetX || "0px",
      offsetY: styles.shadowOffsetY || "0px",
      blur: styles.shadowBlurRadius || "0px",
      color: color,
    });

    updateElementStyle(element.id, {
      boxShadow: newShadow,
      shadowColor: color,
    });
  };

  // ============================================================================
  // OPACITY HANDLER
  // ============================================================================

  /**
   * Handle opacity change from slider
   * Converts 0-100 slider value to 0-1 opacity value
   * @param {array} value - Slider value array [0-100]
   */
  const handleOpacityChange = (value) => {
    const opacity = value / 100; // Convert 0-100 to 0-1
    updateElementStyle(element.id, {
      opacity: opacity,
    });
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Render border radius controls for rectangle shape
   * @returns {JSX} Border radius input group
   */
  const renderBorderRadiusControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Top-Left</Label>
          <Input
            type="number"
            value={parsePx(styles.borderTopLeftRadius)}
            onChange={(e) =>
              handleStyleChange("borderTopLeftRadius", toPx(e.target.value))
            }
            className="h-8 text-xs"
            min="0"
            max="100"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Top-Right</Label>
          <Input
            type="number"
            value={parsePx(styles.borderTopRightRadius)}
            onChange={(e) =>
              handleStyleChange("borderTopRightRadius", toPx(e.target.value))
            }
            className="h-8 text-xs"
            min="0"
            max="100"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Bottom-Left</Label>
          <Input
            type="number"
            value={parsePx(styles.borderBottomLeftRadius)}
            onChange={(e) =>
              handleStyleChange("borderBottomLeftRadius", toPx(e.target.value))
            }
            className="h-8 text-xs"
            min="0"
            max="100"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Bottom-Right</Label>
          <Input
            type="number"
            value={parsePx(styles.borderBottomRightRadius)}
            onChange={(e) =>
              handleStyleChange("borderBottomRightRadius", toPx(e.target.value))
            }
            className="h-8 text-xs"
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-100 rounded-md">
            {currentShape === "circle" ? (
              <Circle className="w-4 h-4 text-cyan-600" />
            ) : (
              <Square className="w-4 h-4 text-cyan-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">Shape Properties</h3>
            <p className="text-xs text-gray-500">Rectangle or Circle</p>
          </div>
        </div>
        <Button
          onClick={() => deleteElement(element.id)}
          size="sm"
          variant="destructive"
          className="h-8 px-2"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      <Separator />

      {/* ===== TABS ===== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-8">
          <TabsTrigger value="shape" className="text-xs">
            Shape
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs">
            Style
          </TabsTrigger>
          <TabsTrigger value="effects" className="text-xs">
            Effects
          </TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">
            Layout
          </TabsTrigger>
        </TabsList>

        {/* ===== SHAPE TAB ===== */}
        <TabsContent value="shape" className="space-y-4 mt-4">
          {/* Shape Type Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Square className="w-4 h-4" />
                Shape Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={currentShape}
                onValueChange={(value) => handleStyleChange("shapeType", value)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shapeOptions.map((shape) => {
                    const Icon = shape.icon;
                    return (
                      <SelectItem key={shape.value} value={shape.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {shape.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Corner Radius Card - Only for Rectangle */}
          {currentShape === "rectangle" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Radius className="w-4 h-4" />
                  Corner Radius
                </CardTitle>
              </CardHeader>
              <CardContent>{renderBorderRadiusControls()}</CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ===== STYLE TAB ===== */}
        <TabsContent value="style" className="space-y-4 mt-4">
          {/* Fill Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Fill
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Fill Type Selector */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Fill Type</Label>
                <Select
                  value={styles.fillType || "solid"}
                  onValueChange={(value) =>
                    handleStyleChange("fillType", value)
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="linear">Linear Gradient</SelectItem>
                    <SelectItem value="radial">Radial Gradient</SelectItem>
                    <SelectItem value="none">No Fill</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Solid Color */}
              {(!styles.fillType || styles.fillType === "solid") && (
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={styles.backgroundColor || "#3b82f6"}
                    onChange={(e) =>
                      handleColorChange("backgroundColor", e.target.value)
                    }
                    className="w-12 h-8 p-1 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={styles.backgroundColor || "#3b82f6"}
                    onChange={(e) =>
                      handleColorChange("backgroundColor", e.target.value)
                    }
                    className="flex-1 h-8 text-xs font-mono"
                    placeholder="#3b82f6"
                  />
                </div>
              )}

              {/* Linear Gradient */}
              {styles.fillType === "linear" && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">Start Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={styles.gradientStartColor || "#3b82f6"}
                        onChange={(e) =>
                          handleGradientChange(
                            "gradientStartColor",
                            e.target.value
                          )
                        }
                        className="w-12 h-8 p-1 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={styles.gradientStartColor || "#3b82f6"}
                        onChange={(e) =>
                          handleGradientChange(
                            "gradientStartColor",
                            e.target.value
                          )
                        }
                        className="flex-1 h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">End Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={styles.gradientEndColor || "#1e40af"}
                        onChange={(e) =>
                          handleGradientChange(
                            "gradientEndColor",
                            e.target.value
                          )
                        }
                        className="w-12 h-8 p-1 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={styles.gradientEndColor || "#1e40af"}
                        onChange={(e) =>
                          handleGradientChange(
                            "gradientEndColor",
                            e.target.value
                          )
                        }
                        className="flex-1 h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">
                      Direction (deg)
                    </Label>
                    <Input
                      type="number"
                      value={parsePx(styles.gradientDirection) || 0}
                      onChange={(e) =>
                        handleGradientChange(
                          "gradientDirection",
                          `${e.target.value}deg`
                        )
                      }
                      className="h-8 text-xs mt-1"
                      min="0"
                      max="360"
                    />
                  </div>
                </div>
              )}

              {/* Radial Gradient */}
              {styles.fillType === "radial" && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">
                      Center Color
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={styles.gradientStartColor || "#3b82f6"}
                        onChange={(e) =>
                          handleGradientChange(
                            "gradientStartColor",
                            e.target.value
                          )
                        }
                        className="w-12 h-8 p-1 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={styles.gradientStartColor || "#3b82f6"}
                        onChange={(e) =>
                          handleGradientChange(
                            "gradientStartColor",
                            e.target.value
                          )
                        }
                        className="flex-1 h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Edge Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={styles.gradientEndColor || "#1e40af"}
                        onChange={(e) =>
                          handleGradientChange(
                            "gradientEndColor",
                            e.target.value
                          )
                        }
                        className="w-12 h-8 p-1 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={styles.gradientEndColor || "#1e40af"}
                        onChange={(e) =>
                          handleGradientChange(
                            "gradientEndColor",
                            e.target.value
                          )
                        }
                        className="flex-1 h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Border Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Border
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">Width</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.borderWidth)}
                    onChange={(e) =>
                      handleStyleChange("borderWidth", toPx(e.target.value))
                    }
                    className="h-8 text-xs"
                    min="0"
                    max="20"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-gray-600">Style</Label>
                  <Select
                    value={styles.borderStyle || "solid"}
                    onValueChange={(value) =>
                      handleStyleChange("borderStyle", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-600">Border Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={styles.borderColor || "#000000"}
                    onChange={(e) =>
                      handleColorChange("borderColor", e.target.value)
                    }
                    className="w-12 h-8 p-1 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={styles.borderColor || "#000000"}
                    onChange={(e) =>
                      handleColorChange("borderColor", e.target.value)
                    }
                    className="flex-1 h-8 text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== EFFECTS TAB ===== */}
        <TabsContent value="effects" className="space-y-4 mt-4">
          {/* Opacity Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Opacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Slider
                  value={[(styles.opacity || 1) * 100]}
                  onValueChange={handleOpacityChange}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round((styles.opacity || 1) * 100)}%
                  </Badge>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shadow Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Box Shadow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">X Offset</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.shadowOffsetX)}
                    onChange={(e) => handleShadowOffsetXChange(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Y Offset</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.shadowOffsetY)}
                    onChange={(e) => handleShadowOffsetYChange(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">Blur</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.shadowBlurRadius)}
                    onChange={(e) => handleShadowBlurChange(e.target.value)}
                    className="h-8 text-xs"
                    min="0"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Color</Label>
                  <Input
                    type="color"
                    value={styles.shadowColor || "#000000"}
                    onChange={(e) => handleShadowColorChange(e.target.value)}
                    className="h-8 p-1 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-2 bg-gray-100 rounded-lg border border-gray-300">
                <p className="text-xs font-mono text-gray-600 break-all">
                  {styles.boxShadow || "none"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rotation Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Rotation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={parsePx(styles.rotation)}
                  onChange={(e) => {
                    const degValue = `${e.target.value}deg`; // ✅ Store as "deg" not "px"
                    updateElementStyle(element.id, { rotation: degValue });
                  }}
                  className="h-8 text-xs"
                  min="0"
                  max="360"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0°</span>
                  <Badge variant="secondary" className="text-xs">
                    {parsePx(styles.rotation)}°
                  </Badge>
                  <span>360°</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== LAYOUT TAB ===== */}
        <TabsContent value="layout" className="space-y-4 mt-4">
          {/* Position & Size Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Move className="w-4 h-4" />
                Position & Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">Width</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.width) || 200}
                    onChange={(e) => {
                      handleStyleChange("width", toPx(e.target.value));
                    }}
                    className="h-8 text-xs"
                    min="10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Height</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.height) || 200}
                    onChange={(e) => {
                      handleStyleChange("height", toPx(e.target.value));
                    }}
                    className="h-8 text-xs"
                    min="10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Margin Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">Top</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.marginTop)}
                    onChange={(e) => {
                      handleStyleChange("marginTop", toPx(e.target.value));
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Right</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.marginRight)}
                    onChange={(e) => {
                      handleStyleChange("marginRight", toPx(e.target.value));
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Bottom</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.marginBottom)}
                    onChange={(e) => {
                      handleStyleChange("marginBottom", toPx(e.target.value));
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Left</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.marginLeft)}
                    onChange={(e) => {
                      handleStyleChange("marginLeft", toPx(e.target.value));
                    }}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Padding Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Padding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">Top</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.paddingTop)}
                    onChange={(e) => {
                      handleStyleChange("paddingTop", toPx(e.target.value));
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Right</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.paddingRight)}
                    onChange={(e) => {
                      handleStyleChange("paddingRight", toPx(e.target.value));
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Bottom</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.paddingBottom)}
                    onChange={(e) => {
                      handleStyleChange("paddingBottom", toPx(e.target.value));
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Left</Label>
                  <Input
                    type="number"
                    value={parsePx(styles.paddingLeft)}
                    onChange={(e) => {
                      handleStyleChange("paddingLeft", toPx(e.target.value));
                    }}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShapePropertiesPanel;
