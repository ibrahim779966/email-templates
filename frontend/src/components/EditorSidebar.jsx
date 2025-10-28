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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Square } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Property Panels - Import your professional panels here
import TextPropertiesPanel from "./TextPropertiesPanel";
import ImagePropertiesPanel from "./ImagePropertiesPanel";
import ButtonPropertiesPanel from "./ButtonPropertiesPanel";
import DividerPropertiesPanel from "./DividerPropertiesPanel";
import SocialPropertiesPanel from "./SocialPropertiesPanel";
import ShapePropertiesPanel from "./ShapePropertiesPanel";

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

  // When selectedElement changes, switch to Elements tab and scroll to Properties
  useEffect(() => {
    if (selectedElement && selectedElement.id !== prevSelectedIdRef.current) {
      setActiveTab("elements");
      setTimeout(() => {
        propertiesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      prevSelectedIdRef.current = selectedElement.id;
    }
  }, [selectedElement]);

// Element configurations with enhanced styling
const elementTypes = [
  {
    type: "shape",
    label: "Shape Block",
    icon: Square,
    description: "Rectangle or Circle shapes",
classes: "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
    iconColor: "text-pink-600 bg-pink-100"
  },
  {
    type: "text",
    label: "Text Block",
    icon: Type,
    description: "Add editable text content",
   classes: "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
    iconColor: "text-pink-600 bg-pink-100"
  },
  {
    type: "header",
    label: "Header Block",
    icon: Type,
    description: "Add prominent headings",
    classes: "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
    iconColor: "text-purple-600 bg-purple-100"
  },
  {
    type: "image",
    label: "Image Block",
    icon: Image,
    description: "Upload or link images",
    classes: "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
    iconColor: "text-purple-600 bg-purple-100"
  },
  {
    type: "button",
    label: "Button Block",
    icon: Link,
    description: "Interactive call-to-action",
    classes: "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
    iconColor: "text-blue-600 bg-blue-100"
  },
  {
    type: "divider",
    label: "Divider",
    icon: Minus,
    description: "Visual section separator",
    classes: "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
    iconColor: "text-blue-600 bg-blue-100"
  },
  {
    type: "social",
    label: "Social Links",
    icon: Globe,
    classes: "bg-white hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-300/60 transition-all duration-200",
    iconColor: "text-pink-600 bg-pink-100"
  }
];


  // Complete sections list with all combinations
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
          id: "header-text-divider",
          name: "Header + Text + Divider",
          type: "header-text-divider",
          preview: (
            <div className="p-2 bg-gradient-to-b from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg space-y-1.5 shadow-sm">
              <div className="h-4 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
              <div className="h-8 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
              <div className="border-t-2 border-gray-500 w-full"></div>
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
          id: "image-text",
          name: "Image + Text",
          type: "image-text",
          preview: (
            <div className="p-2 bg-gradient-to-b from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg space-y-1.5 shadow-sm">
              <div className="h-12 bg-gradient-to-r from-emerald-400 to-emerald-500 w-full rounded shadow-sm"></div>
              <div className="h-6 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            </div>
          ),
        },
        {
          id: "image-header-text",
          name: "Image + Header + Text",
          type: "image-header-text",
          preview: (
            <div className="p-2 bg-gradient-to-b from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg space-y-1.5 shadow-sm">
              <div className="h-12 bg-gradient-to-r from-emerald-400 to-emerald-500 w-full rounded shadow-sm"></div>
              <div className="h-4 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
              <div className="h-6 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
            </div>
          ),
        },
      ],
    },
    // {
    //   category: "Intermediate Combinations",
    //   sections: [
    //     {
    //       id: "header-divider-text-image",
    //       name: "Header + Divider + Text + Image",
    //       type: "header-divider-text-image",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-teal-50 to-teal-100 border border-teal-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="border-t-2 border-gray-500 w-full"></div>
    //           <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //           <div className="h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 w-full rounded shadow-sm"></div>
    //         </div>
    //       ),
    //     },
    //     {
    //       id: "image-header-text-button",
    //       name: "Image + Header + Text + Button",
    //       type: "image-header-text-button",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-teal-50 to-teal-100 border border-teal-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 w-full rounded shadow-sm"></div>
    //           <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //           <div className="h-4 w-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
    //         </div>
    //       ),
    //     },
    //     {
    //       id: "header-text-image-button",
    //       name: "Header + Text + Image + Button",
    //       type: "header-text-image-button",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-teal-50 to-teal-100 border border-teal-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //           <div className="h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 w-full rounded shadow-sm"></div>
    //           <div className="h-4 w-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
    //         </div>
    //       ),
    //     },
    //     {
    //       id: "header-image-text-social",
    //       name: "Header + Image + Text + Social",
    //       type: "header-image-text-social",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-teal-50 to-teal-100 border border-teal-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 w-full rounded shadow-sm"></div>
    //           <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //           <div className="flex justify-center gap-1">
    //             <div className="h-3 w-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //             <div className="h-3 w-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //             <div className="h-3 w-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //           </div>
    //         </div>
    //       ),
    //     },
    //     {
    //       id: "image-header-divider-text",
    //       name: "Image + Header + Divider + Text",
    //       type: "image-header-divider-text",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-teal-50 to-teal-100 border border-teal-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 w-full rounded shadow-sm"></div>
    //           <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="border-t-2 border-gray-500 w-full"></div>
    //           <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //         </div>
    //       ),
    //     },
    //   ],
    // },
    // {
    //   category: "Advanced Layouts",
    //   sections: [
    //     {
    //       id: "header-text-divider-image-button",
    //       name: "Header + Text + Divider + Image + Button",
    //       type: "header-text-divider-image-button",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-violet-50 to-violet-100 border border-violet-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //           <div className="border-t-2 border-gray-500 w-full"></div>
    //           <div className="h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 w-full rounded shadow-sm"></div>
    //           <div className="h-3 w-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
    //         </div>
    //       ),
    //     },
    //     {
    //       id: "header-text-social-button",
    //       name: "Header + Text + Social + Button",
    //       type: "header-text-social-button",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-violet-50 to-violet-100 border border-violet-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //           <div className="flex justify-center gap-1">
    //             <div className="h-3 w-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //             <div className="h-3 w-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //             <div className="h-3 w-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //           </div>
    //           <div className="h-3 w-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
    //         </div>
    //       ),
    //     },
    //     {
    //       id: "image-image-header-text",
    //       name: "Image + Image + Header + Text",
    //       type: "image-image-header-text",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-violet-50 to-violet-100 border border-violet-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="flex gap-1">
    //             <div className="h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 w-1/2 rounded shadow-sm"></div>
    //             <div className="h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 w-1/2 rounded shadow-sm"></div>
    //           </div>
    //           <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="h-4 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //         </div>
    //       ),
    //     },
    //     {
    //       id: "header-divider-image-text-button-social",
    //       name: "Header + Divider + Image + Text + Button + Social",
    //       type: "header-divider-image-text-button-social",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-violet-50 to-violet-100 border border-violet-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="border-t-2 border-gray-500 w-full"></div>
    //           <div className="h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 w-full rounded shadow-sm"></div>
    //           <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //           <div className="h-2 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
    //           <div className="flex justify-center gap-0.5">
    //             <div className="h-2 w-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //             <div className="h-2 w-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //             <div className="h-2 w-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //           </div>
    //         </div>
    //       ),
    //     },
    //     {
    //       id: "header-text-image-image-divider-button",
    //       name: "Header + Text + Image + Image + Divider + Button",
    //       type: "header-text-image-image-divider-button",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-violet-50 to-violet-100 border border-violet-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //           <div className="flex gap-1">
    //             <div className="h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 w-1/2 rounded shadow-sm"></div>
    //             <div className="h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 w-1/2 rounded shadow-sm"></div>
    //           </div>
    //           <div className="border-t-2 border-gray-500 w-full"></div>
    //           <div className="h-2 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
    //         </div>
    //       ),
    //     },
    //     {
    //       id: "header-image-divider-text-social-button",
    //       name: "Header + Image + Divider + Text + Social + Button",
    //       type: "header-image-divider-text-social-button",
    //       preview: (
    //         <div className="p-2 bg-gradient-to-b from-violet-50 to-violet-100 border border-violet-200 rounded-lg space-y-1 shadow-sm">
    //           <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 w-3/4 mx-auto rounded shadow-sm"></div>
    //           <div className="h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 w-full rounded shadow-sm"></div>
    //           <div className="border-t-2 border-gray-500 w-full"></div>
    //           <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 w-full rounded shadow-sm"></div>
    //           <div className="flex justify-center gap-0.5">
    //             <div className="h-2 w-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //             <div className="h-2 w-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //             <div className="h-2 w-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded shadow-sm"></div>
    //           </div>
    //           <div className="h-2 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto shadow-sm"></div>
    //         </div>
    //       ),
    //     },
    //   ],
    // },
  ];

  const renderElementsTab = () => (
    <div className="space-y-6 bg-gradient-to-l from-white to-white">
      {/* Elements Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-4 pt-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
            <Blocks className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg bg-gradient-to-r from-white to-white bg-clip-text text-">
            Elements
          </h3>
          <Badge
            variant="secondary"
            className="text-xs bg-blue-100 text-blue-700 border-blue-200"
          >
            Drag & Drop
          </Badge>
        </div>

 <div className="px-4 space-y-4">
  {elementTypes.map((element) => {
    const Icon = element.icon;
    return (
      <Card
        key={element.type}
        className={`cursor-grab active:cursor-grabbing transition-all duration-300
        ${element.shadowColor} ${element.color} ${element.classes}
        transform hover:scale-[1.02] border-2 border-black rounded-xl`}
        draggable
        onDragStart={(e) => e.dataTransfer.setData("type", element.type)}
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
              <h3 className="font-bold text-lg bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
                Properties
              </h3>
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
          <h3 className="font-bold text-lg bg-clip-text text-black">
            Sections
          </h3>
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
          <h3 className="font-bold text-lg bg-clip-text text-black">
            Global Settings
          </h3>
        </div>

        <div className="space-y-6">
          {/* Canvas Settings */}
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/50 shadow-lg">
            <CardHeader className="pb-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-t-lg">
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="w-4 h-4 text-orange-600" />
                <span className="text-orange-800">Canvas Settings</span>
              </CardTitle>
              <CardDescription className="text-sm text-orange-700">
                Control the overall appearance of your newsletter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Canvas Background
                </Label>
                <div className="flex gap-2">
                  <div className="relative">
                    <Input
                      type="color"
                      value={globalSettings.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        setGlobalSettings({
                          ...globalSettings,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="w-12 h-10 p-1 cursor-pointer flex-shrink-0 border-2 border-orange-200 rounded-lg shadow-sm"
                    />
                  </div>
                  <Input
                    type="text"
                    value={globalSettings.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="flex-1 font-mono text-sm min-w-0 border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Newsletter Background
                </Label>
                <div className="flex gap-2">
                  <div className="relative">
                    <Input
                      type="color"
                      value={globalSettings.newsletterColor || "#ffffff"}
                      onChange={(e) =>
                        setGlobalSettings({
                          ...globalSettings,
                          newsletterColor: e.target.value,
                        })
                      }
                      className="w-12 h-10 p-1 cursor-pointer flex-shrink-0 border-2 border-orange-200 rounded-lg shadow-sm"
                    />
                  </div>
                  <Input
                    type="text"
                    value={globalSettings.newsletterColor || "#ffffff"}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        newsletterColor: e.target.value,
                      })
                    }
                    className="flex-1 font-mono text-sm min-w-0 border-2 border-orange-200 focus:border-orange-400"
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
              <CardDescription className="text-sm text-purple-700">
                Configure dimensions and spacing
              </CardDescription>
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
                    className="text-sm flex-1 min-w-0 border-2 border-purple-200 focus:border-purple-400"
                  />
                  <Badge
                    variant="outline"
                    className="text-xs flex-shrink-0 bg-purple-100 text-purple-700 border-purple-300"
                  >
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
                    className="text-sm flex-1 min-w-0 border-2 border-purple-200 focus:border-purple-400"
                  />
                  <Badge
                    variant="outline"
                    className="text-xs flex-shrink-0 bg-purple-100 text-purple-700 border-purple-300"
                  >
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
            className="flex flex-col items-center gap-1 py-3 text-[#f51398] hover:bg-gradient-to-br hover:from-pink-100 hover:to-pink-200/70 data-[state=active]:bg-white data-[state=active]:text-[#f51398] data-[state=active]:shadow-lg data-[state=active]:border-2 data-[state=active]:border-[#f51398] rounded-lg transition-all duration-300"
          >
            <Blocks size={20} />
            <span className="text-xs font-semibold">Elements</span>
          </TabsTrigger>
          <TabsTrigger
            value="sections"
            className="flex flex-col items-center gap-1 py-3 text-[#c40cd8] hover:bg-gradient-to-br hover:from-purple-100 hover:to-purple-200/70 data-[state=active]:bg-white data-[state=active]:text-[#c40cd8] data-[state=active]:shadow-lg data-[state=active]:border-2 data-[state=active]:border-[#c40cd8] rounded-lg transition-all duration-300"
          >
            <LayoutTemplate size={20} />
            <span className="text-xs font-semibold">Sections</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex flex-col items-center gap-1 py-3 text-[#2001fd] hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200/70 data-[state=active]:bg-white data-[state=active]:text-[#2001fd] data-[state=active]:shadow-lg data-[state=active]:border-2 data-[state=active]:border-[#2001fd] rounded-lg transition-all duration-300"
          >
            <Settings size={20} />
            <span className="text-xs font-semibold">Settings</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent
            value="elements"
            className="h-full m-0 bg-gradient-to-b from-blue-50/30 to-indigo-50/30"
          >
            <ScrollArea className="h-full">{renderElementsTab()}</ScrollArea>
          </TabsContent>

          <TabsContent
            value="sections"
            className="h-full m-0 bg-gradient-to-b from-emerald-50/30 to-teal-50/30"
          >
            {renderSectionsTab()}
          </TabsContent>

          <TabsContent
            value="settings"
            className="h-full m-0 bg-gradient-to-b from-orange-50/30 to-amber-50/30"
          >
            {renderSettingsTab()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
