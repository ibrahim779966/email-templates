// EditorSidebar.jsx - Updated with Container Elements
import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  LayoutTemplate,
  Type,
  Image,
  Link,
  Minus,
  Globe,
  Blocks,
  Plus,
  Grip,
  ChevronRight,
  BarChart3,
  Palette,
  Monitor,
  Layers,
  Box,
  Grid3x3,
  Square,
  Columns,
  Rows,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Property Panels
import TextPropertiesPanel from "./TextPropertiesPanel";
import ImagePropertiesPanel from "./ImagePropertiesPanel";
import ButtonPropertiesPanel from "./ButtonPropertiesPanel";
import DividerPropertiesPanel from "./DividerPropertiesPanel";
import SocialPropertiesPanel from "./SocialPropertiesPanel";
import ShapePropertiesPanel from "./ShapePropertiesPanel";
import SectionPropertiesPanel from "./SectionPropertiesPanel";
import GridPropertiesPanel from "./GridPropertiesPanel";
import ItemPropertiesPanel from "./ItemPropertiesPanel";

export default function EditorSidebar({
  globalSettings,
  setGlobalSettings,
  elements,
  addElement,
  selectedElement,
  updateElement,
  updateElementStyle,
  handleImageUpload,
  deleteElement,
}) {
  const [activeTab, setActiveTab] = useState("elements");
  const propertiesRef = useRef(null);
  const prevSelectedIdRef = useRef(null);

  useEffect(() => {
    if (selectedElement && selectedElement.id !== prevSelectedIdRef.current) {
      setActiveTab("elements");
      setTimeout(() => {
        propertiesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      prevSelectedIdRef.current = selectedElement.id;
    }
  }, [selectedElement]);

  // ✅ CONTAINER ELEMENTS (Can hold children)
  const containerElements = [
    {
      type: "section",
      label: "Section Container",
      icon: Box,
      description: "Main container for grouping",
      classes:
        "bg-white hover:bg-gray-50 hover:border-gray-500 shadow-md hover:shadow-gray-300/60 transition-all duration-200",
      iconColor: "text-gray-600 bg-gray-100",
    },
    {
      type: "grid",
      label: "Grid Container",
      icon: Grid3x3,
      description: "2-3 column grid layout",
      classes:
        "bg-white hover:bg-blue-50 hover:border-blue-500 shadow-md hover:shadow-blue-300/60 transition-all duration-200",
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      type: "item",
      label: "Item Container",
      icon: Square,
      description: "Grid item or group box",
      classes:
        "bg-white hover:bg-yellow-50 hover:border-yellow-500 shadow-md hover:shadow-yellow-300/60 transition-all duration-200",
      iconColor: "text-yellow-600 bg-yellow-100",
    },
  ];

  // ✅ CONTENT ELEMENTS (Cannot hold children)
  const contentElements = [
    {
      type: "shape",
      label: "Shape Block",
      icon: Square,
      description: "Rectangle or Circle shapes",
      classes:
        "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
      iconColor: "text-pink-600 bg-pink-100",
    },
    {
      type: "text",
      label: "Text Block",
      icon: Type,
      description: "Add editable text content",
      classes:
        "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
      iconColor: "text-pink-600 bg-pink-100",
    },
    {
      type: "header",
      label: "Header Block",
      icon: Type,
      description: "Add prominent headings",
      classes:
        "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
      iconColor: "text-purple-600 bg-purple-100",
    },
    {
      type: "image",
      label: "Image Block",
      icon: Image,
      description: "Upload or link images",
      classes:
        "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
      iconColor: "text-purple-600 bg-purple-100",
    },
    {
      type: "button",
      label: "Button Block",
      icon: Link,
      description: "Interactive call-to-action",
      classes:
        "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      type: "divider",
      label: "Divider",
      icon: Minus,
      description: "Visual section separator",
      classes:
        "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      type: "social",
      label: "Social Links",
      icon: Globe,
      classes:
        "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
      iconColor: "text-pink-600 bg-pink-100",
    },
  ];

  // Enhanced sections with grid templates
const sectionCategories = [
  {
    category: "Basic Layouts",
    sections: [
      {
        id: "header-text",
        name: "Header + Text",
        type: "header-text",
        preview: (
          <div className="p-2 bg-gradient-to-b from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-4 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
            <div className="h-8 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "header-text-button",
        name: "Header + Text + Button",
        type: "header-text-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-4 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
            <div className="h-6 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="h-5 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "text-divider-text",
        name: "Text + Divider + Text",
        type: "text-divider-text",
        preview: (
          <div className="p-2 bg-gradient-to-b from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-6 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 w-full"></div>
            <div className="h-6 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "image-only",
        name: "Full Width Image",
        type: "image-only",
        preview: (
          <div className="p-2 bg-gradient-to-b from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg shadow-sm">
            <div className="h-14 bg-gradient-to-br from-purple-300 to-purple-400 w-full rounded shadow-sm"></div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Newsletter Headers",
    sections: [
      {
        id: "newsletter-logo-header",
        name: "Logo + Header (Grid)",
        type: "newsletter-logo-header",
        preview: (
          <div className="p-2 bg-gradient-to-b from-sky-50 to-sky-100 border border-sky-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-1.5 items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-sky-400 to-sky-500 rounded shadow-sm"></div>
              <div className="col-span-2 h-3 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "newsletter-logo-text-date",
        name: "Logo + Text + Date (Grid)",
        type: "newsletter-logo-text-date",
        preview: (
          <div className="p-2 bg-gradient-to-b from-sky-50 to-sky-100 border border-sky-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-1.5 items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-sky-400 to-sky-500 rounded shadow-sm"></div>
              <div className="col-span-2 space-y-0.5">
                <div className="h-2.5 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded shadow-sm"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-2/3 rounded shadow-sm"></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "newsletter-logo-social",
        name: "Logo + Social (Grid)",
        type: "newsletter-logo-social",
        preview: (
          <div className="p-2 bg-gradient-to-b from-sky-50 to-sky-100 border border-sky-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-1.5 items-center">
              <div className="h-7 w-7 bg-gradient-to-br from-sky-400 to-sky-500 rounded shadow-sm"></div>
              <div className="col-span-2 flex gap-1 justify-end">
                <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
                <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
                <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "newsletter-logo-centered",
        name: "Centered Logo",
        type: "newsletter-logo-centered",
        preview: (
          <div className="p-2 bg-gradient-to-b from-sky-50 to-sky-100 border border-sky-200 rounded-lg space-y-1 shadow-sm">
            <div className="h-7 w-7 bg-gradient-to-br from-sky-400 to-sky-500 rounded mx-auto shadow-sm"></div>
            <div className="h-2 bg-gradient-to-r from-gray-600 to-gray-700 w-3/4 mx-auto rounded shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "newsletter-banner",
        name: "Full Banner Header",
        type: "newsletter-banner",
        preview: (
          <div className="p-2 bg-gradient-to-b from-sky-50 to-sky-100 border border-sky-200 rounded-lg shadow-sm">
            <div className="h-10 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 w-full rounded shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "newsletter-logo-text-social",
        name: "Logo + Text + Social (3 Col)",
        type: "newsletter-logo-text-social",
        preview: (
          <div className="p-2 bg-gradient-to-b from-sky-50 to-sky-100 border border-sky-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-1 items-center">
              <div className="h-6 w-6 bg-gradient-to-br from-sky-400 to-sky-500 rounded shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded shadow-sm"></div>
              <div className="flex gap-0.5 justify-end">
                <div className="h-2.5 w-2.5 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
                <div className="h-2.5 w-2.5 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "newsletter-header-logo-right",
        name: "Header + Logo Right",
        type: "newsletter-header-logo-right",
        preview: (
          <div className="p-2 bg-gradient-to-b from-sky-50 to-sky-100 border border-sky-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-1.5 items-center">
              <div className="col-span-2 h-3 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded shadow-sm"></div>
              <div className="h-8 w-8 bg-gradient-to-br from-sky-400 to-sky-500 rounded shadow-sm ml-auto"></div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Grid Layouts",
    sections: [
      {
        id: "grid-2col",
        name: "2-Column Grid",
        type: "grid-2col",
        preview: (
          <div className="p-2 bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-12 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
              <div className="h-12 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "grid-3col",
        name: "3-Column Grid",
        type: "grid-3col",
        preview: (
          <div className="p-2 bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-1">
              <div className="h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
              <div className="h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
              <div className="h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "grid-4col",
        name: "4-Column Grid",
        type: "grid-4col",
        preview: (
          <div className="p-2 bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-4 gap-1">
              <div className="h-8 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
              <div className="h-8 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
              <div className="h-8 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
              <div className="h-8 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "grid-2x2",
        name: "2x2 Grid",
        type: "grid-2x2",
        preview: (
          <div className="p-2 bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
              <div className="h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
              <div className="h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
              <div className="h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Hero Sections",
    sections: [
      {
        id: "hero-image-header-text-button",
        name: "Hero with Image",
        type: "hero-image-header-text-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-purple-50 to-purple-100 border border-purple-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-8 bg-gradient-to-br from-purple-300 to-purple-400 w-full rounded shadow-sm"></div>
            <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-2/3 mx-auto rounded shadow-sm"></div>
            <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="h-4 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "hero-shape-header-text-button",
        name: "Hero with Shape",
        type: "hero-shape-header-text-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-purple-50 to-purple-100 border border-purple-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-8 w-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full mx-auto shadow-sm"></div>
            <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-2/3 mx-auto rounded shadow-sm"></div>
            <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="h-4 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "hero-header-text-2button",
        name: "Hero with 2 Buttons",
        type: "hero-header-text-2button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-purple-50 to-purple-100 border border-purple-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-4 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
            <div className="h-6 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="flex gap-1 justify-center">
              <div className="h-4 w-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded shadow-sm"></div>
              <div className="h-4 w-14 bg-gradient-to-r from-gray-500 to-gray-600 rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Media Sections",
    sections: [
      {
        id: "image-text-side",
        name: "Image + Text Side-by-Side",
        type: "image-text-side",
        preview: (
          <div className="p-2 bg-gradient-to-b from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-12 bg-gradient-to-br from-green-300 to-green-400 rounded shadow-sm"></div>
              <div className="space-y-1">
                <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
                <div className="h-8 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "text-image-side",
        name: "Text + Image Side-by-Side",
        type: "text-image-side",
        preview: (
          <div className="p-2 bg-gradient-to-b from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="space-y-1">
                <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
                <div className="h-8 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              </div>
              <div className="h-12 bg-gradient-to-br from-green-300 to-green-400 rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "image-header-text",
        name: "Image + Header + Text",
        type: "image-header-text",
        preview: (
          <div className="p-2 bg-gradient-to-b from-green-50 to-green-100 border border-green-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-8 bg-gradient-to-br from-green-300 to-green-400 w-full rounded shadow-sm"></div>
            <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-2/3 mx-auto rounded shadow-sm"></div>
            <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "image-grid-3",
        name: "3-Image Gallery",
        type: "image-grid-3",
        preview: (
          <div className="p-2 bg-gradient-to-b from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-1">
              <div className="h-10 bg-gradient-to-br from-green-300 to-green-400 rounded shadow-sm"></div>
              <div className="h-10 bg-gradient-to-br from-green-300 to-green-400 rounded shadow-sm"></div>
              <div className="h-10 bg-gradient-to-br from-green-300 to-green-400 rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "image-header-text-button",
        name: "Image Top Full Card",
        type: "image-header-text-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-green-50 to-green-100 border border-green-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-7 bg-gradient-to-br from-green-300 to-green-400 w-full rounded shadow-sm"></div>
            <div className="h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
            <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="h-3.5 w-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Icon Sections",
    sections: [
      {
        id: "icon-header-text",
        name: "Icon + Header + Text",
        type: "icon-header-text",
        preview: (
          <div className="p-2 bg-gradient-to-b from-rose-50 to-rose-100 border border-rose-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-6 w-6 bg-gradient-to-br from-rose-400 to-rose-500 rounded-lg mx-auto shadow-sm"></div>
            <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-2/3 mx-auto rounded shadow-sm"></div>
            <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "icon-grid-3",
        name: "3 Icons with Text",
        type: "icon-grid-3",
        preview: (
          <div className="p-2 bg-gradient-to-b from-rose-50 to-rose-100 border border-rose-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-1">
              <div className="space-y-0.5">
                <div className="h-4 w-4 bg-gradient-to-br from-rose-400 to-rose-500 rounded mx-auto shadow-sm"></div>
                <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              </div>
              <div className="space-y-0.5">
                <div className="h-4 w-4 bg-gradient-to-br from-rose-400 to-rose-500 rounded mx-auto shadow-sm"></div>
                <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              </div>
              <div className="space-y-0.5">
                <div className="h-4 w-4 bg-gradient-to-br from-rose-400 to-rose-500 rounded mx-auto shadow-sm"></div>
                <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "icon-grid-4",
        name: "4 Icons Grid",
        type: "icon-grid-4",
        preview: (
          <div className="p-2 bg-gradient-to-b from-rose-50 to-rose-100 border border-rose-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-4 gap-0.5">
              <div className="h-5 w-5 bg-gradient-to-br from-rose-400 to-rose-500 rounded mx-auto shadow-sm"></div>
              <div className="h-5 w-5 bg-gradient-to-br from-rose-400 to-rose-500 rounded mx-auto shadow-sm"></div>
              <div className="h-5 w-5 bg-gradient-to-br from-rose-400 to-rose-500 rounded mx-auto shadow-sm"></div>
              <div className="h-5 w-5 bg-gradient-to-br from-rose-400 to-rose-500 rounded mx-auto shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "icon-text-button",
        name: "Icon + Text + Button",
        type: "icon-text-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-rose-50 to-rose-100 border border-rose-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-7 w-7 bg-gradient-to-br from-rose-400 to-rose-500 rounded-lg mx-auto shadow-sm"></div>
            <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="h-4 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Call-to-Action",
    sections: [
      {
        id: "cta-header-button",
        name: "Simple CTA",
        type: "cta-header-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-orange-50 to-orange-100 border border-orange-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-4 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
            <div className="h-5 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "cta-shape-header-text-button",
        name: "CTA with Icon",
        type: "cta-shape-header-text-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-orange-50 to-orange-100 border border-orange-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-6 w-6 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full mx-auto shadow-sm"></div>
            <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-2/3 mx-auto rounded shadow-sm"></div>
            <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="h-4 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "cta-boxed",
        name: "Boxed CTA",
        type: "cta-boxed",
        preview: (
          <div className="p-2 bg-gradient-to-b from-orange-50 to-orange-100 border border-orange-200 rounded-lg shadow-sm">
            <div className="p-2 bg-white/50 rounded border border-orange-300 space-y-1">
              <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
              <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
              <div className="h-4 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "cta-image-header-button",
        name: "CTA with Background",
        type: "cta-image-header-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-orange-50 to-orange-100 border border-orange-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-8 bg-gradient-to-br from-orange-300 to-orange-400 w-full rounded shadow-sm relative flex items-center justify-center">
              <div className="h-3 bg-white/90 w-2/3 rounded shadow-sm"></div>
            </div>
            <div className="h-4 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
          </div>
        ),
      },
    ],
  },
{
  category: "Feature Sections",
  sections: [
    {
      id: "feature-3col",
      name: "3 Features",
      type: "feature-3col",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-3 gap-1">
            <div className="space-y-1">
              <div className="h-4 w-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-2col",
      name: "2 Features",
      type: "feature-2col",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="space-y-1">
              <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-list",
      name: "Feature List",
      type: "feature-list",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg space-y-1 shadow-sm">
          <div className="flex gap-1.5 items-center">
            <div className="h-3 w-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm flex-shrink-0"></div>
            <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="h-3 w-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm flex-shrink-0"></div>
            <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="h-3 w-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm flex-shrink-0"></div>
            <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-4col",
      name: "4 Features Grid",
      type: "feature-4col",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-4 gap-0.5">
            <div className="space-y-0.5">
              <div className="h-3.5 w-3.5 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-3.5 w-3.5 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-3.5 w-3.5 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-3.5 w-3.5 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-image-text-2col",
      name: "2 Features with Images",
      type: "feature-image-text-2col",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="space-y-1">
              <div className="h-6 bg-gradient-to-br from-cyan-300 to-cyan-400 w-full rounded shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-6 bg-gradient-to-br from-cyan-300 to-cyan-400 w-full rounded shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-horizontal",
      name: "Horizontal Feature",
      type: "feature-horizontal",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-4 gap-1 items-center">
            <div className="h-6 w-6 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm"></div>
            <div className="col-span-3 space-y-0.5">
              <div className="h-2 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-horizontal-list",
      name: "Horizontal Feature List",
      type: "feature-horizontal-list",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg space-y-1 shadow-sm">
          <div className="grid grid-cols-4 gap-1 items-center">
            <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm"></div>
            <div className="col-span-3 h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
          <div className="grid grid-cols-4 gap-1 items-center">
            <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm"></div>
            <div className="col-span-3 h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
          <div className="grid grid-cols-4 gap-1 items-center">
            <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm"></div>
            <div className="col-span-3 h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-icon-left-3row",
      name: "3 Features Icon Left",
      type: "feature-icon-left-3row",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg space-y-1.5 shadow-sm">
          <div className="grid grid-cols-5 gap-1 items-start">
            <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm"></div>
            <div className="col-span-4 space-y-0.5">
              <div className="h-1.5 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1 items-start">
            <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm"></div>
            <div className="col-span-4 space-y-0.5">
              <div className="h-1.5 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1 items-start">
            <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm"></div>
            <div className="col-span-4 space-y-0.5">
              <div className="h-1.5 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-boxed-3col",
      name: "3 Boxed Features",
      type: "feature-boxed-3col",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-white/60 p-1 rounded border border-cyan-300 space-y-0.5">
              <div className="h-4 w-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
            </div>
            <div className="bg-white/60 p-1 rounded border border-cyan-300 space-y-0.5">
              <div className="h-4 w-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
            </div>
            <div className="bg-white/60 p-1 rounded border border-cyan-300 space-y-0.5">
              <div className="h-4 w-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-numbered-list",
      name: "Numbered Features",
      type: "feature-numbered-list",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg space-y-1 shadow-sm">
          <div className="grid grid-cols-6 gap-1 items-center">
            <div className="h-4 w-4 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full shadow-sm"></div>
            <div className="col-span-5 h-2.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
          <div className="grid grid-cols-6 gap-1 items-center">
            <div className="h-4 w-4 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full shadow-sm"></div>
            <div className="col-span-5 h-2.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
          <div className="grid grid-cols-6 gap-1 items-center">
            <div className="h-4 w-4 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full shadow-sm"></div>
            <div className="col-span-5 h-2.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-header-3col",
      name: "Features with Header",
      type: "feature-header-3col",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg space-y-1.5 shadow-sm">
          <div className="h-3 bg-gradient-to-r from-gray-700 to-gray-800 w-2/3 mx-auto rounded shadow-sm"></div>
          <div className="grid grid-cols-3 gap-1">
            <div className="space-y-0.5">
              <div className="h-4 w-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-4 w-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-4 w-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-alternating",
      name: "Alternating Features",
      type: "feature-alternating",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg space-y-1.5 shadow-sm">
          <div className="grid grid-cols-3 gap-1 items-center">
            <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm"></div>
            <div className="col-span-2 h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-1 items-center">
            <div className="col-span-2 h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm ml-auto"></div>
          </div>
          <div className="grid grid-cols-3 gap-1 items-center">
            <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded shadow-sm"></div>
            <div className="col-span-2 h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-image-top-3col",
      name: "3 Features Image Top",
      type: "feature-image-top-3col",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-3 gap-1">
            <div className="space-y-0.5">
              <div className="h-5 bg-gradient-to-br from-cyan-300 to-cyan-400 w-full rounded shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-2.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-5 bg-gradient-to-br from-cyan-300 to-cyan-400 w-full rounded shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-2.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-5 bg-gradient-to-br from-cyan-300 to-cyan-400 w-full rounded shadow-sm"></div>
              <div className="h-1.5 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-2.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-large-icon-2col",
      name: "2 Large Icon Features",
      type: "feature-large-icon-2col",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="space-y-1">
              <div className="h-7 w-7 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-7 w-7 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-compact-4col",
      name: "4 Compact Features",
      type: "feature-compact-4col",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-4 gap-1">
            <div className="space-y-0.5">
              <div className="h-3 w-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-3 w-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-3 w-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
            </div>
            <div className="space-y-0.5">
              <div className="h-3 w-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded mx-auto shadow-sm"></div>
              <div className="h-1 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "feature-benefits-3col",
      name: "3 Benefits Features",
      type: "feature-benefits-3col",
      preview: (
        <div className="p-2 bg-gradient-to-b from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-3 gap-1">
            <div className="space-y-1">
              <div className="h-4 w-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
              <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
  ],
},
  {
    category: "Product Sections",
    sections: [
      {
        id: "product-image-header-price-button",
        name: "Product Card",
        type: "product-image-header-price-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-8 bg-gradient-to-br from-emerald-300 to-emerald-400 w-full rounded shadow-sm"></div>
            <div className="h-2.5 bg-gradient-to-r from-gray-700 to-gray-800 w-2/3 mx-auto rounded shadow-sm"></div>
            <div className="h-3 bg-gradient-to-r from-green-500 to-green-600 w-1/3 mx-auto rounded shadow-sm"></div>
            <div className="h-3.5 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "product-grid-2",
        name: "2 Product Grid",
        type: "product-grid-2",
        preview: (
          <div className="p-2 bg-gradient-to-b from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="space-y-0.5">
                <div className="h-7 bg-gradient-to-br from-emerald-300 to-emerald-400 w-full rounded shadow-sm"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
                <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 w-1/2 mx-auto rounded"></div>
              </div>
              <div className="space-y-0.5">
                <div className="h-7 bg-gradient-to-br from-emerald-300 to-emerald-400 w-full rounded shadow-sm"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
                <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 w-1/2 mx-auto rounded"></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "product-featured",
        name: "Featured Product",
        type: "product-featured",
        preview: (
          <div className="p-2 bg-gradient-to-b from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-12 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded shadow-sm"></div>
              <div className="space-y-1">
                <div className="h-2.5 bg-gradient-to-r from-gray-700 to-gray-800 w-full rounded"></div>
                <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
                <div className="h-2.5 bg-gradient-to-r from-green-500 to-green-600 w-1/2 rounded"></div>
                <div className="h-3 w-full bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Stats & Metrics",
    sections: [
      {
        id: "stats-3col",
        name: "3 Stats",
        type: "stats-3col",
        preview: (
          <div className="p-2 bg-gradient-to-b from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-1">
              <div className="space-y-0.5 text-center">
                <div className="h-4 bg-gradient-to-r from-indigo-500 to-indigo-600 w-3/4 mx-auto rounded shadow-sm"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              </div>
              <div className="space-y-0.5 text-center">
                <div className="h-4 bg-gradient-to-r from-indigo-500 to-indigo-600 w-3/4 mx-auto rounded shadow-sm"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              </div>
              <div className="space-y-0.5 text-center">
                <div className="h-4 bg-gradient-to-r from-indigo-500 to-indigo-600 w-3/4 mx-auto rounded shadow-sm"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "stats-4col",
        name: "4 Stats Grid",
        type: "stats-4col",
        preview: (
          <div className="p-2 bg-gradient-to-b from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-4 gap-0.5">
              <div className="h-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded shadow-sm"></div>
              <div className="h-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded shadow-sm"></div>
              <div className="h-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded shadow-sm"></div>
              <div className="h-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Testimonials",
    sections: [
      {
        id: "testimonial-single",
        name: "Single Testimonial",
        type: "testimonial-single",
        preview: (
          <div className="p-2 bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-6 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-sm flex-shrink-0"></div>
              <div className="h-2 bg-gradient-to-r from-gray-600 to-gray-700 w-1/2 rounded"></div>
            </div>
          </div>
        ),
      },
      {
        id: "testimonial-grid-2",
        name: "2 Testimonials",
        type: "testimonial-grid-2",
        preview: (
          <div className="p-2 bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="space-y-0.5">
                <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
                <div className="h-2 w-2 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full"></div>
              </div>
              <div className="space-y-0.5">
                <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
                <div className="h-2 w-2 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full"></div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Footer Sections",
    sections: [
      {
        id: "footer-social",
        name: "Social Footer",
        type: "footer-social",
        preview: (
          <div className="p-2 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-lg shadow-sm">
            <div className="space-y-1.5">
              <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-1/2 mx-auto rounded"></div>
              <div className="flex gap-1 justify-center">
                <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
                <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
                <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "footer-text-social",
        name: "Footer with Text",
        type: "footer-text-social",
        preview: (
          <div className="p-2 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500 w-2/3 mx-auto rounded"></div>
            <div className="flex gap-1 justify-center">
              <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
              <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
              <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "footer-links-social",
        name: "Footer with Links",
        type: "footer-links-social",
        preview: (
          <div className="p-2 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="flex gap-1 justify-center">
              <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 w-10 rounded shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 w-10 rounded shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 w-10 rounded shadow-sm"></div>
            </div>
            <div className="flex gap-1 justify-center">
              <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
              <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
              <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "footer-newsletter-signup",
        name: "Newsletter Signup",
        type: "footer-newsletter-signup",
        preview: (
          <div className="p-2 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-lg space-y-1 shadow-sm">
            <div className="h-2.5 bg-gradient-to-r from-gray-600 to-gray-700 w-3/4 mx-auto rounded"></div>
            <div className="h-3 bg-white border border-gray-300 w-full rounded"></div>
            <div className="h-3 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded mx-auto"></div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Card Sections",
    sections: [
      {
        id: "card-image-header-text-button",
        name: "Full Card",
        type: "card-image-header-text-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 rounded-lg shadow-sm">
            <div className="bg-white p-1.5 rounded shadow space-y-1">
              <div className="h-6 bg-gradient-to-br from-amber-300 to-amber-400 w-full rounded shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 w-2/3 rounded shadow-sm"></div>
              <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
              <div className="h-3 w-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "card-shape-header-text",
        name: "Icon Card",
        type: "card-shape-header-text",
        preview: (
          <div className="p-2 bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 rounded-lg shadow-sm">
            <div className="bg-white p-1.5 rounded shadow space-y-1">
              <div className="h-5 w-5 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full mx-auto shadow-sm"></div>
              <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 w-2/3 mx-auto rounded shadow-sm"></div>
              <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "card-grid-2",
        name: "2 Card Grid",
        type: "card-grid-2",
        preview: (
          <div className="p-2 bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-1">
              <div className="bg-white p-1 rounded shadow space-y-0.5">
                <div className="h-4 bg-gradient-to-br from-amber-300 to-amber-400 w-full rounded"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              </div>
              <div className="bg-white p-1 rounded shadow space-y-0.5">
                <div className="h-4 bg-gradient-to-br from-amber-300 to-amber-400 w-full rounded"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded"></div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    category: "Profile Sections",
    sections: [
      {
        id: "profile-image-header-text-social",
        name: "Profile Card",
        type: "profile-image-header-text-social",
        preview: (
          <div className="p-2 bg-gradient-to-b from-violet-50 to-violet-100 border border-violet-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-8 w-8 bg-gradient-to-br from-violet-400 to-violet-500 rounded-full mx-auto shadow-sm"></div>
            <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-2/3 mx-auto rounded shadow-sm"></div>
            <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="flex gap-1 justify-center">
              <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
              <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
              <div className="h-3 w-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
            </div>
          </div>
        ),
      },
      {
        id: "profile-shape-header-text-button",
        name: "Profile with Button",
        type: "profile-shape-header-text-button",
        preview: (
          <div className="p-2 bg-gradient-to-b from-violet-50 to-violet-100 border border-violet-200 rounded-lg space-y-1.5 shadow-sm">
            <div className="h-8 w-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full mx-auto shadow-sm"></div>
            <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-2/3 mx-auto rounded shadow-sm"></div>
            <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            <div className="h-4 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
          </div>
        ),
      },
      {
        id: "team-grid-3",
        name: "Team Grid (3)",
        type: "team-grid-3",
        preview: (
          <div className="p-2 bg-gradient-to-b from-violet-50 to-violet-100 border border-violet-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-1">
              <div className="space-y-0.5">
                <div className="h-5 w-5 bg-gradient-to-br from-violet-400 to-violet-500 rounded-full mx-auto shadow-sm"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
              </div>
              <div className="space-y-0.5">
                <div className="h-5 w-5 bg-gradient-to-br from-violet-400 to-violet-500 rounded-full mx-auto shadow-sm"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
              </div>
              <div className="space-y-0.5">
                <div className="h-5 w-5 bg-gradient-to-br from-violet-400 to-violet-500 rounded-full mx-auto shadow-sm"></div>
                <div className="h-1.5 bg-gradient-to-r from-gray-600 to-gray-700 w-full rounded"></div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
];
  const renderElementsTab = () => (
    <div className="space-y-6 bg-gradient-to-l from-white to-white">
      {/* CONTAINER ELEMENTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-4 pt-6">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md">
            <Box className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg">Containers</h3>
          <Badge
            variant="secondary"
            className="text-xs bg-indigo-100 text-indigo-700 border-indigo-200"
          >
            Nestable
          </Badge>
        </div>

        <div className="px-4 space-y-4">
          {containerElements.map((element) => {
            const Icon = element.icon;
            return (
              <Card
                key={element.type}
                className={`cursor-grab active:cursor-grabbing transition-all duration-300
                ${element.classes} transform hover:scale-[1.02] border-2 border-black rounded-xl`}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("type", element.type)
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg ${element.iconColor} flex-shrink-0 shadow-sm border border-black/30`}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate text-gray-800">
                        {element.label}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {element.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Grip className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CONTENT ELEMENTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
            <Blocks className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg">Elements</h3>
          <Badge
            variant="secondary"
            className="text-xs bg-blue-100 text-blue-700 border-blue-200"
          >
            Drag & Drop
          </Badge>
        </div>

        <div className="px-4 space-y-4">
          {contentElements.map((element) => {
            const Icon = element.icon;
            return (
              <Card
                key={element.type}
                className={`cursor-grab active:cursor-grabbing transition-all duration-300
                ${element.classes} transform hover:scale-[1.02] border-2 border-black rounded-xl`}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("type", element.type)
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg ${element.iconColor} flex-shrink-0 shadow-sm border border-black/30`}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate text-gray-800">
                        {element.label}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {element.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Grip className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Properties Section */}
      {selectedElement && (
        <>
          <div className="mx-4">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          </div>
          <div className="px-4 pb-6" ref={propertiesRef}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg">Properties</h3>
              <Badge
                variant="outline"
                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
              >
                {selectedElement.type}
              </Badge>
            </div>

            <div
              className="w-full max-w-full overflow-hidden bg-gradient-to-br from-purple-50/50 to-indigo-50/50 rounded-lg p-4 border border-purple-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedElement.type === "section" && (
                <SectionPropertiesPanel
                  element={selectedElement}
                  updateElement={updateElement}
                  // updateElementStyle={updateElementStyle}
                  deleteElement={deleteElement}
                />
              )}
              {selectedElement.type === "grid" && (
                <GridPropertiesPanel
                  element={selectedElement}
                  updateElement={updateElement}
                  // updateElementStyle={updateElementStyle}
                  deleteElement={deleteElement}
                />
              )}
              {selectedElement.type === "item" && (
                <ItemPropertiesPanel
                  element={selectedElement}
                  updateElement={updateElement}
                  // updateElementStyle={updateElementStyle}
                  deleteElement={deleteElement}
                />
              )}

              {selectedElement.type === "shape" && (
                <ShapePropertiesPanel
                  element={selectedElement}
                  updateElement={updateElement}
                  updateElementStyle={updateElementStyle}
                  deleteElement={deleteElement}
                />
              )}
              {(selectedElement.type === "text" ||
                selectedElement.type === "header") && (
                <TextPropertiesPanel
                  element={selectedElement}
                  updateElement={updateElement}
                  updateElementStyle={updateElementStyle}
                  deleteElement={deleteElement}
                  handleImageUpload={handleImageUpload}
                />
              )}
              {selectedElement.type === "image" && (
                <ImagePropertiesPanel
                  element={selectedElement}
                  updateElement={updateElement}
                  updateElementStyle={updateElementStyle}
                  deleteElement={deleteElement}
                  handleImageUpload={handleImageUpload}
                />
              )}
              {selectedElement.type === "button" && (
                <ButtonPropertiesPanel
                  element={selectedElement}
                  updateElement={updateElement}
                  updateElementStyle={updateElementStyle}
                  deleteElement={deleteElement}
                />
              )}
              {selectedElement.type === "divider" && (
                <DividerPropertiesPanel
                  element={selectedElement}
                  updateElement={updateElement}
                  updateElementStyle={updateElementStyle}
                  deleteElement={deleteElement}
                />
              )}
              {selectedElement.type === "social" && (
                <SocialPropertiesPanel
                  element={selectedElement}
                  updateElement={updateElement}
                  updateElementStyle={updateElementStyle}
                  deleteElement={deleteElement}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderSectionsTab = () => (
    <ScrollArea className="h-full">
      <div className="space-x-10 pb-6">
        <div className="flex items-center gap-2 px-4 pt-6 pb-4">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg">Sections</h3>
          <Badge
            variant="secondary"
            className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200"
          >
            Pre-built
          </Badge>
        </div>

        {sectionCategories.map((category) => (
          <div key={category.category} className="space-y-3">
            <div className="px-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#c40cd8] to-purple-400"></div>
                <h4 className="font-bold text-sm text-gray-700 uppercase tracking-wider">
                  {category.category}
                </h4>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
              </div>
            </div>
            <div className="px-4 space-y-3">
              {category.sections.map((section) => (
                <Card
                  key={section.id}
                  className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-300 bg-white hover:bg-purple-50 border border-purple-200 hover:border-[#c40cd8] transform hover:scale-[1.02] shadow-md"
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("sectionDropType", section.type)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-sm mb-2 truncate text-gray-800">
                          {section.name}
                        </h5>
                        {section.preview}
                      </div>
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <Grip className="w-4 h-4 text-[#c40cd8]" />
                        <ChevronRight className="w-4 h-4 text-[#c40cd8]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  const renderSettingsTab = () => (
    <ScrollArea className="h-full">
      <div className="space-y-6 pb-6 px-4">
        <div className="flex items-center gap-2 pt-6">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg">Global Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Canvas Settings */}
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/50 shadow-lg">
            <CardHeader className="pb-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-t-lg">
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="w-4 h-4 text-orange-600" />
                <span className="text-orange-800">Canvas Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Canvas Background
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={globalSettings.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={globalSettings.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Newsletter Background
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={globalSettings.newsletterColor || "#ffffff"}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        newsletterColor: e.target.value,
                      })
                    }
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={globalSettings.newsletterColor || "#ffffff"}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        newsletterColor: e.target.value,
                      })
                    }
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layout Settings */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 shadow-lg">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-t-lg">
              <CardTitle className="text-base flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-purple-600" />
                <span className="text-purple-800">Layout Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Max Width
                </Label>
                <div className="flex gap-1 items-center">
                  <Input
                    type="number"
                    value={parseInt(globalSettings.maxWidth) || 0}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        maxWidth: `${e.target.value}px`,
                      })
                    }
                    className="text-sm flex-1"
                  />
                  <Badge variant="outline" className="text-xs">
                    px
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Minimum Height
                </Label>
                <div className="flex gap-1 items-center">
                  <Input
                    type="number"
                    value={parseInt(globalSettings.minHeight) || 800}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        minHeight: `${e.target.value}px`,
                      })
                    }
                    className="text-sm flex-1"
                  />
                  <Badge variant="outline" className="text-xs">
                    px
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 shadow-lg">
            <CardHeader className="pb-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-t-lg">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800">Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200">
                <span className="text-sm font-semibold text-gray-700">
                  Total Elements
                </span>
                <Badge
                  variant="secondary"
                  className="font-mono text-lg bg-emerald-100 text-emerald-800 px-3 py-1"
                >
                  {elements.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <div className="h-full w-96 max-w-96 min-w-96 flex flex-col bg-gradient-to-br from-gray-50 to-white border-r border-gray-300 shadow-xl">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        <TabsList className="grid w-full h-22 z-10 grid-cols-3 bg-gradient-to-r from-[#fbd3ec] to-[#dcd2ff] border-b-2 border-[#f3c7ff] flex-shrink-0 p-1">
          <TabsTrigger
            value="elements"
            className="flex flex-col items-center gap-1 py-3"
          >
            <Blocks size={20} />
            <span className="text-xs font-semibold">Elements</span>
          </TabsTrigger>
          <TabsTrigger
            value="sections"
            className="flex flex-col items-center gap-1 py-3"
          >
            <LayoutTemplate size={20} />
            <span className="text-xs font-semibold">Sections</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex flex-col items-center gap-1 py-3"
          >
            <Settings size={20} />
            <span className="text-xs font-semibold">Settings</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="elements" className="h-full m-0">
            <ScrollArea className="h-full">{renderElementsTab()}</ScrollArea>
          </TabsContent>

          <TabsContent value="sections" className="h-full m-0">
            {renderSectionsTab()}
          </TabsContent>

          <TabsContent value="settings" className="h-full m-0">
            {renderSettingsTab()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
