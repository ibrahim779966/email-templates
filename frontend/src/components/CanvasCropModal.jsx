import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, AlertCircle, ZoomIn, ZoomOut } from "lucide-react";

export default function CanvasCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropConfirm,
  elementDimensions = { width: 300, height: 200 },
}) {
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);

  const [cropRect, setCropRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const targetAspectRatio = elementDimensions.width / elementDimensions.height;

  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialCropRect, setInitialCropRect] = useState(null);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [initialPanOffset, setInitialPanOffset] = useState({ x: 0, y: 0 });

  const MAX_VIEWPORT_WIDTH =
    typeof window !== "undefined" ? window.innerWidth - 100 : 800;
  const MAX_VIEWPORT_HEIGHT =
    typeof window !== "undefined" ? window.innerHeight - 300 : 600;

  const [displayDimensions, setDisplayDimensions] = useState({
    width: 600,
    height: 400,
  });

  const calculateDisplayDimensions = (naturalWidth, naturalHeight) => {
    let displayWidth = Math.min(naturalWidth, MAX_VIEWPORT_WIDTH);
    let displayHeight = Math.min(naturalHeight, MAX_VIEWPORT_HEIGHT);

    const aspectRatio = naturalWidth / naturalHeight;

    if (displayWidth / displayHeight > aspectRatio) {
      displayWidth = displayHeight * aspectRatio;
    } else {
      displayHeight = displayWidth / aspectRatio;
    }

    displayWidth = Math.max(displayWidth, 400);
    displayHeight = Math.max(displayHeight, 300);

    return {
      width: Math.round(displayWidth),
      height: Math.round(displayHeight),
    };
  };

  const handleImageLoad = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    console.log("✅ Image loaded:", { naturalWidth, naturalHeight });

    const display = calculateDisplayDimensions(naturalWidth, naturalHeight);
    setDisplayDimensions(display);
    setImageDimensions({ naturalWidth, naturalHeight });

    const targetAspect = elementDimensions.width / elementDimensions.height;
    let initWidth = display.width * 0.8;
    let initHeight = initWidth / targetAspect;

    if (initHeight > display.height * 0.8) {
      initHeight = display.height * 0.8;
      initWidth = initHeight * targetAspect;
    }

    const initX = (display.width - initWidth) / 2;
    const initY = (display.height - initHeight) / 2;

    setCropRect({
      x: initX,
      y: initY,
      width: initWidth,
      height: initHeight,
    });

    setZoom(1);
    setPanOffset({ x: 0, y: 0 });

    setImageLoaded(true);
    setError(null);
  };

  const handleImageError = () => {
    console.error("❌ Image failed to load");
    setError("Failed to load image. Check CORS settings.");
    setImageLoaded(false);
  };

  const handleMouseDown = (e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialCropRect({ ...cropRect });
  };

  const handleImageMouseDown = (e) => {
    if (
      e.target === containerRef.current ||
      e.target === imageRef.current ||
      e.target.tagName === "svg" ||
      e.target.tagName === "rect"
    ) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setInitialPanOffset({ ...panOffset });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPanOffset({
        x: initialPanOffset.x + dx,
        y: initialPanOffset.y + dy,
      });
      return;
    }

    if (!isDragging || !dragHandle || !initialCropRect) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    let newRect = { ...initialCropRect };
    const minSize = 50;

    // Resizing logic with aspect ratio lock
    const aspectRatio = targetAspectRatio;

    switch (dragHandle) {
      case "tl": {
        // top-left corner
        // Calculate intended new width and height maintaining aspect ratio
        // Move x and y accordingly
        let newWidth = initialCropRect.width - dx;
        let newHeight = newWidth / aspectRatio;

        if (newHeight > initialCropRect.height + dy) {
          newHeight = initialCropRect.height + dy;
          newWidth = newHeight * aspectRatio;
        }

        if (newWidth < minSize) {
          newWidth = minSize;
          newHeight = newWidth / aspectRatio;
        }
        if (newHeight < minSize) {
          newHeight = minSize;
          newWidth = newHeight * aspectRatio;
        }

        let newX = initialCropRect.x + (initialCropRect.width - newWidth);
        let newY = initialCropRect.y + (initialCropRect.height - newHeight);

        // Bounds check
        if (newX < 0) {
          newX = 0;
          newWidth = initialCropRect.x + initialCropRect.width;
          newHeight = newWidth / aspectRatio;
          newY = initialCropRect.y + initialCropRect.height - newHeight;
        }
        if (newY < 0) {
          newY = 0;
          newHeight = initialCropRect.y + initialCropRect.height;
          newWidth = newHeight * aspectRatio;
          newX = initialCropRect.x + initialCropRect.width - newWidth;
        }

        newRect = {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        };
        break;
      }
      case "tr": {
        // top-right corner
        let newWidth = initialCropRect.width + dx;
        let newHeight = newWidth / aspectRatio;

        if (newHeight > initialCropRect.height - dy) {
          newHeight = initialCropRect.height - dy;
          newWidth = newHeight * aspectRatio;
        }

        if (newWidth < minSize) {
          newWidth = minSize;
          newHeight = newWidth / aspectRatio;
        }
        if (newHeight < minSize) {
          newHeight = minSize;
          newWidth = newHeight * aspectRatio;
        }

        let newX = initialCropRect.x;
        let newY = initialCropRect.y + (initialCropRect.height - newHeight);

        // Bounds check
        if (newX + newWidth > displayDimensions.width) {
          newWidth = displayDimensions.width - newX;
          newHeight = newWidth / aspectRatio;
          newY = initialCropRect.y + initialCropRect.height - newHeight;
        }
        if (newY < 0) {
          newY = 0;
          newHeight = initialCropRect.y + initialCropRect.height;
          newWidth = newHeight * aspectRatio;
        }

        newRect = {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        };
        break;
      }
      case "bl": {
        // bottom-left corner
        let newWidth = initialCropRect.width - dx;
        let newHeight = newWidth / aspectRatio;

        if (newHeight > initialCropRect.height + dy) {
          newHeight = initialCropRect.height + dy;
          newWidth = newHeight * aspectRatio;
        }

        if (newWidth < minSize) {
          newWidth = minSize;
          newHeight = newWidth / aspectRatio;
        }
        if (newHeight < minSize) {
          newHeight = minSize;
          newWidth = newHeight * aspectRatio;
        }

        let newX = initialCropRect.x + (initialCropRect.width - newWidth);
        let newY = initialCropRect.y;

        // Bounds check
        if (newX < 0) {
          newX = 0;
          newWidth = initialCropRect.x + initialCropRect.width;
          newHeight = newWidth / aspectRatio;
        }
        if (newY + newHeight > displayDimensions.height) {
          newHeight = displayDimensions.height - newY;
          newWidth = newHeight * aspectRatio;
          newX = initialCropRect.x + initialCropRect.width - newWidth;
        }

        newRect = {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        };
        break;
      }
      case "br": {
        // bottom-right corner
        let newWidth = initialCropRect.width + dx;
        let newHeight = newWidth / aspectRatio;

        if (newHeight > initialCropRect.height + dy) {
          newHeight = initialCropRect.height + dy;
          newWidth = newHeight * aspectRatio;
        }

        if (newWidth < minSize) {
          newWidth = minSize;
          newHeight = newWidth / aspectRatio;
        }
        if (newHeight < minSize) {
          newHeight = minSize;
          newWidth = newHeight * aspectRatio;
        }

        let newX = initialCropRect.x;
        let newY = initialCropRect.y;

        // Bounds check
        if (newX + newWidth > displayDimensions.width) {
          newWidth = displayDimensions.width - newX;
          newHeight = newWidth / aspectRatio;
        }
        if (newY + newHeight > displayDimensions.height) {
          newHeight = displayDimensions.height - newY;
          newWidth = newHeight * aspectRatio;
        }

        newRect = {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        };
        break;
      }
      default:
        break;
    }

    if (newRect.width >= minSize && newRect.height >= minSize) {
      setCropRect(newRect);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
    setDragHandle(null);
    setDragStart({ x: 0, y: 0 });
    setInitialCropRect(null);
    setPanStart({ x: 0, y: 0 });
    setInitialPanOffset({ x: 0, y: 0 });
  };

  const handleReset = () => {
    if (!displayDimensions.width || !displayDimensions.height) return;

    const targetAspect = elementDimensions.width / elementDimensions.height;
    let initWidth = displayDimensions.width * 0.8;
    let initHeight = initWidth / targetAspect;

    if (initHeight > displayDimensions.height * 0.8) {
      initHeight = displayDimensions.height * 0.8;
      initWidth = initHeight * targetAspect;
    }

    const initX = (displayDimensions.width - initWidth) / 2;
    const initY = (displayDimensions.height - initHeight) / 2;

    setCropRect({
      x: initX,
      y: initY,
      width: initWidth,
      height: initHeight,
    });

    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleZoomChange = (value) => {
    setZoom(value[0]);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleCropConfirm = async () => {
    if (!imageRef.current || !imageDimensions) {
      setError("Image not ready");
      return;
    }

    try {
      const actualDisplayWidth = displayDimensions.width * zoom;
      const actualDisplayHeight = displayDimensions.height * zoom;

      const scaleX = imageDimensions.naturalWidth / actualDisplayWidth;
      const scaleY = imageDimensions.naturalHeight / actualDisplayHeight;

      const centerOffsetX = (actualDisplayWidth - displayDimensions.width) / 2;
      const centerOffsetY =
        (actualDisplayHeight - displayDimensions.height) / 2;

      const adjustedX = cropRect.x + centerOffsetX - panOffset.x;
      const adjustedY = cropRect.y + centerOffsetY - panOffset.y;

      const cropData = {
        x: Math.max(0, Math.round(adjustedX * scaleX)),
        y: Math.max(0, Math.round(adjustedY * scaleY)),
        width: Math.round(cropRect.width * scaleX),
        height: Math.round(cropRect.height * scaleY),
      };

      cropData.x = Math.min(
        cropData.x,
        imageDimensions.naturalWidth - cropData.width
      );
      cropData.y = Math.min(
        cropData.y,
        imageDimensions.naturalHeight - cropData.height
      );
      cropData.width = Math.min(
        cropData.width,
        imageDimensions.naturalWidth - cropData.x
      );
      cropData.height = Math.min(
        cropData.height,
        imageDimensions.naturalHeight - cropData.y
      );

      console.log("✂️ Crop data:", cropData);
      console.log("📊 Debug:", {
        zoom,
        panOffset,
        cropRect,
        displayDimensions,
        imageDimensions,
        scaleX,
        scaleY,
      });

      await onCropConfirm(cropData);
    } catch (err) {
      console.error("❌ Crop error:", err);
      setError(err.message || "Failed to apply crop");
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging || isPanning) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [
    isDragging,
    isPanning,
    dragHandle,
    dragStart,
    initialCropRect,
    panStart,
    initialPanOffset,
  ]);

  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setError(null);
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-full p-4 max-w-[90vw] flex flex-col"
        style={{
          width: displayDimensions.width,
          minWidth: displayDimensions.width,
          maxHeight: "90vh",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <DialogHeader>
          <DialogTitle>✂️ Crop Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Crop Area</label>
            <div
              ref={containerRef}
              className="relative mx-auto border border-gray-300 rounded-lg overflow-hidden bg-gray-900"
              style={{
                width: `${displayDimensions.width}px`,
                height: `${displayDimensions.height}px`,
                cursor: isPanning ? "grabbing" : "grab",
                marginRight: "50px",
              }}
              onMouseDown={handleImageMouseDown}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <p className="text-sm text-gray-600">Loading image...</p>
                </div>
              )}

              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="w-full h-full object-contain"
                style={{
                  opacity: imageLoaded ? 1 : 0.5,
                  pointerEvents: "none",
                  userSelect: "none",
                  transform: `scale(${zoom}) translate(${
                    panOffset.x / zoom
                  }px, ${panOffset.y / zoom}px)`,
                  transformOrigin: "center center",
                  transition:
                    isDragging || isPanning ? "none" : "transform 0.2s ease",
                }}
              />

              {imageLoaded && (
                <>
                  {/* Dark overlay outside crop area */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg
                      width="100%"
                      height="100%"
                      className="absolute inset-0"
                    >
                      <defs>
                        <mask id="cropMask">
                          <rect width="100%" height="100%" fill="white" />
                          <rect
                            x={cropRect.x}
                            y={cropRect.y}
                            width={cropRect.width}
                            height={cropRect.height}
                            fill="black"
                          />
                        </mask>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill="rgba(0,0,0,0.5)"
                        mask="url(#cropMask)"
                      />
                    </svg>
                  </div>

                  {/* Crop rectangle */}
                  <div
                    className="absolute border-2 border-blue-500"
                    style={{
                      left: `${cropRect.x}px`,
                      top: `${cropRect.y}px`,
                      width: `${cropRect.width}px`,
                      height: `${cropRect.height}px`,
                      boxShadow: "0 0 0 2000px rgba(0,0,0,0.3)",
                      pointerEvents: "none",
                    }}
                  >
                    {/* Corner handles */}
                    <div
                      className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform z-10"
                      style={{
                        left: "-8px",
                        top: "-8px",
                        pointerEvents: "auto",
                      }}
                      onMouseDown={(e) => handleMouseDown(e, "tl")}
                    />
                    <div
                      className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform z-10"
                      style={{
                        right: "-8px",
                        top: "-8px",
                        pointerEvents: "auto",
                      }}
                      onMouseDown={(e) => handleMouseDown(e, "tr")}
                    />
                    <div
                      className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform z-10"
                      style={{
                        left: "-8px",
                        bottom: "-8px",
                        pointerEvents: "auto",
                      }}
                      onMouseDown={(e) => handleMouseDown(e, "bl")}
                    />
                    <div
                      className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform z-10"
                      style={{
                        right: "-8px",
                        bottom: "-8px",
                        pointerEvents: "auto",
                      }}
                      onMouseDown={(e) => handleMouseDown(e, "br")}
                    />
                  </div>
                </>
              )}
            </div>
            <p className="text-xs text-gray-600">
              🔍 Drag image to pan • Drag corners to resize (ratio locked:{" "}
              {elementDimensions.width}:{elementDimensions.height})
            </p>
          </div>

          {/* Zoom Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium flex items-center gap-2">
                🔍 Zoom: {zoom.toFixed(1)}x
              </label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={!imageLoaded || zoom <= 0.5}
                  className="h-8 w-8 p-0"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={!imageLoaded || zoom >= 3}
                  className="h-8 w-8 p-0"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={handleZoomChange}
              min={0.5}
              max={3}
              step={0.1}
              className="w-full"
              disabled={!imageLoaded}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50%</span>
              <span>100%</span>
              <span>300%</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-xs text-blue-800 leading-relaxed">
              💡 <strong>Drag any corner</strong> to resize the crop area. The
              aspect ratio is locked to {elementDimensions.width}×
              {elementDimensions.height}px ({targetAspectRatio.toFixed(2)}:1) to
              match your canvas dimensions. Use zoom and pan to position large
              or small images precisely.
            </p>
          </div>

          {imageLoaded && imageDimensions && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1">
              <p className="text-gray-700">
                <strong>Original Image:</strong> {imageDimensions.naturalWidth}×
                {imageDimensions.naturalHeight}px
              </p>
              <p className="text-gray-700">
                <strong>Crop Area:</strong>{" "}
                {Math.round(
                  (cropRect.width * zoom * imageDimensions.naturalWidth) /
                    displayDimensions.width
                )}
                ×
                {Math.round(
                  (cropRect.height * zoom * imageDimensions.naturalHeight) /
                    displayDimensions.height
                )}
                px
              </p>
              <p className="text-gray-700">
                <strong>Target Size:</strong> {elementDimensions.width}×
                {elementDimensions.height}px
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!imageLoaded}
            className="gap-2 flex-1 min-w-[100px]"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCropConfirm}
            disabled={!imageLoaded}
            className="bg-blue-600 hover:bg-blue-700 flex-1 min-w-[100px]"
          >
            Apply Crop ✂️
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
