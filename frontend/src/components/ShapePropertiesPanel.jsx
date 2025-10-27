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

  // Only Rectangle and Circle
  const shapeOptions = [
    { value: "rectangle", label: "Rectangle", icon: Square },
    { value: "circle", label: "Circle", icon: Circle },
  ];

  const currentShape = styles.shapeType || "rectangle";

  const handleStyleChange = (property, value) => {
    updateElementStyle(element.id, { [property]: value });
  };

  const handleColorChange = (property, value) => {
    updateElementStyle(element.id, { [property]: value });
  };

  const handleGradientChange = (property, value) => {
    updateElementStyle(element.id, { [property]: value });
  };

  // Border radius controls for rectangle
  const renderBorderRadiusControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Top-Left</Label>
          <Input
            type="number"
            value={parseInt(styles.borderTopLeftRadius) || 0}
            onChange={(e) =>
              handleStyleChange("borderTopLeftRadius", `${e.target.value}px`)
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
            value={parseInt(styles.borderTopRightRadius) || 0}
            onChange={(e) =>
              handleStyleChange("borderTopRightRadius", `${e.target.value}px`)
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
            value={parseInt(styles.borderBottomLeftRadius) || 0}
            onChange={(e) =>
              handleStyleChange("borderBottomLeftRadius", `${e.target.value}px`)
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
            value={parseInt(styles.borderBottomRightRadius) || 0}
            onChange={(e) =>
              handleStyleChange(
                "borderBottomRightRadius",
                `${e.target.value}px`
              )
            }
            className="h-8 text-xs"
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
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

      {/* Tabs */}
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

        {/* Shape Tab */}
        <TabsContent value="shape" className="space-y-4 mt-4">
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

          {/* Corner Radius for Rectangle Only */}
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

        {/* Style Tab */}
        <TabsContent value="style" className="space-y-4 mt-4">
          {/* Fill Color */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Fill
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
                      value={parseInt(styles.gradientDirection) || 0}
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

          {/* Border */}
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
                    value={parseInt(styles.borderWidth) || 0}
                    onChange={(e) =>
                      handleStyleChange("borderWidth", `${e.target.value}px`)
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

        {/* Effects Tab */}
        <TabsContent value="effects" className="space-y-4 mt-4">
          {/* Opacity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Opacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Slider
                  value={[parseFloat(styles.opacity || 1) * 100]}
                  onValueChange={(value) =>
                    handleStyleChange("opacity", (value[0] / 100).toString())
                  }
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(parseFloat(styles.opacity || 1) * 100)}%
                  </Badge>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shadow */}
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
                    value={parseInt(styles.shadowOffsetX) || 0}
                    onChange={(e) => {
                      const shadow = `${e.target.value}px ${
                        styles.shadowOffsetY || "0px"
                      } ${styles.shadowBlurRadius || "0px"} ${
                        styles.shadowColor || "#000000"
                      }`;
                      handleStyleChange("boxShadow", shadow);
                      handleStyleChange("shadowOffsetX", `${e.target.value}px`);
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Y Offset</Label>
                  <Input
                    type="number"
                    value={parseInt(styles.shadowOffsetY) || 0}
                    onChange={(e) => {
                      const shadow = `${styles.shadowOffsetX || "0px"} ${
                        e.target.value
                      }px ${styles.shadowBlurRadius || "0px"} ${
                        styles.shadowColor || "#000000"
                      }`;
                      handleStyleChange("boxShadow", shadow);
                      handleStyleChange("shadowOffsetY", `${e.target.value}px`);
                    }}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">Blur</Label>
                  <Input
                    type="number"
                    value={parseInt(styles.shadowBlurRadius) || 0}
                    onChange={(e) => {
                      const shadow = `${styles.shadowOffsetX || "0px"} ${
                        styles.shadowOffsetY || "0px"
                      } ${e.target.value}px ${styles.shadowColor || "#000000"}`;
                      handleStyleChange("boxShadow", shadow);
                      handleStyleChange(
                        "shadowBlurRadius",
                        `${e.target.value}px`
                      );
                    }}
                    className="h-8 text-xs"
                    min="0"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Shadow Color</Label>
                  <Input
                    type="color"
                    value={styles.shadowColor || "#000000"}
                    onChange={(e) => {
                      const shadow = `${styles.shadowOffsetX || "0px"} ${
                        styles.shadowOffsetY || "0px"
                      } ${styles.shadowBlurRadius || "0px"} ${e.target.value}`;
                      handleStyleChange("boxShadow", shadow);
                      handleStyleChange("shadowColor", e.target.value);
                    }}
                    className="h-8 p-1 rounded cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rotation */}
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
                  value={parseInt(styles.rotation) || 0}
                  onChange={(e) => {
                    const rotation = `${e.target.value}deg`;
                    handleStyleChange("rotation", rotation);
                    handleStyleChange("transform", `rotate(${rotation})`);
                  }}
                  className="h-8 text-xs"
                  min="0"
                  max="360"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0°</span>
                  <Badge variant="secondary" className="text-xs">
                    {parseInt(styles.rotation) || 0}°
                  </Badge>
                  <span>360°</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4 mt-4">
          {/* Position */}
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
                    value={parseInt(styles.width) || 200}
                    onChange={(e) =>
                      handleStyleChange("width", `${e.target.value}px`)
                    }
                    className="h-8 text-xs"
                    min="10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Height</Label>
                  <Input
                    type="number"
                    value={parseInt(styles.height) || 200}
                    onChange={(e) =>
                      handleStyleChange("height", `${e.target.value}px`)
                    }
                    className="h-8 text-xs"
                    min="10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Margin */}
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
                    value={parseInt(styles.marginTop) || 0}
                    onChange={(e) =>
                      handleStyleChange("marginTop", `${e.target.value}px`)
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Right</Label>
                  <Input
                    type="number"
                    value={parseInt(styles.marginRight) || 0}
                    onChange={(e) =>
                      handleStyleChange("marginRight", `${e.target.value}px`)
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Bottom</Label>
                  <Input
                    type="number"
                    value={parseInt(styles.marginBottom) || 0}
                    onChange={(e) =>
                      handleStyleChange("marginBottom", `${e.target.value}px`)
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Left</Label>
                  <Input
                    type="number"
                    value={parseInt(styles.marginLeft) || 0}
                    onChange={(e) =>
                      handleStyleChange("marginLeft", `${e.target.value}px`)
                    }
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Padding */}
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
                    value={parseInt(styles.paddingTop) || 0}
                    onChange={(e) =>
                      handleStyleChange("paddingTop", `${e.target.value}px`)
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Right</Label>
                  <Input
                    type="number"
                    value={parseInt(styles.paddingRight) || 0}
                    onChange={(e) =>
                      handleStyleChange("paddingRight", `${e.target.value}px`)
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Bottom</Label>
                  <Input
                    type="number"
                    value={parseInt(styles.paddingBottom) || 0}
                    onChange={(e) =>
                      handleStyleChange("paddingBottom", `${e.target.value}px`)
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Left</Label>
                  <Input
                    type="number"
                    value={parseInt(styles.paddingLeft) || 0}
                    onChange={(e) =>
                      handleStyleChange("paddingLeft", `${e.target.value}px`)
                    }
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
