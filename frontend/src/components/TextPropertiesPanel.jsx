// TextPropertiesPanel.jsx

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
import { Trash2, Type, Palette, Move, AlignLeft, Bold } from "lucide-react";

export default function TextPropertiesPanel({
  element,
  updateElement,
  updateElementStyle,
  deleteElement,
}) {
  if (!element) return null;

  // ✅ ROBUST style merger with unit normalization and shadow rebuild
  const handleStyleChange = (key, rawValue) => {
    // Keys that need px units when numeric
    const pxKeys = new Set([
      "fontSize",
      "letterSpacing",
      "wordSpacing",
      "textIndent",
      "shadowOffsetX",
      "shadowOffsetY",
      "shadowBlurRadius",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "borderWidth",
      "borderRadius",
      "gap",
      "width",
      "height",
    ]);

    // Normalize numeric sliders to px
    const value =
      pxKeys.has(key) && typeof rawValue === "number"
        ? `${rawValue}px`
        : rawValue;

    // Merge styles immutably
    const next = { ...element.styles, [key]: value };

    // Auto-rebuild textShadow when shadow properties change
    if (key.startsWith("shadow") || key === "textShadow") {
      const x = next.shadowOffsetX || "2px";
      const y = next.shadowOffsetY || "2px";
      const blur = next.shadowBlurRadius || "4px";
      const color = next.shadowColor || "#000000";

      next.textShadow =
        key === "textShadow"
          ? value // Direct textShadow update
          : next.textShadow === "none" && key !== "textShadow"
          ? "none" // Keep disabled if explicitly none
          : `${x} ${y} ${blur} ${color}`; // Rebuild from parts
    }

    updateElement(element.id, { styles: next });
  };

  const fontOptions = [
    // ==============================
    // SANS SERIF (100+)
    // ==============================
    {
      value: "Poppins, sans-serif",
      display: "Poppins",
      category: "Sans Serif",
    },
    { value: "Roboto, sans-serif", display: "Roboto", category: "Sans Serif" },
    {
      value: "Open Sans, sans-serif",
      display: "Open Sans",
      category: "Sans Serif",
    },
    { value: "Lato, sans-serif", display: "Lato", category: "Sans Serif" },
    {
      value: "Montserrat, sans-serif",
      display: "Montserrat",
      category: "Sans Serif",
    },
    { value: "Nunito, sans-serif", display: "Nunito", category: "Sans Serif" },
    {
      value: "Source Sans Pro, sans-serif",
      display: "Source Sans Pro",
      category: "Sans Serif",
    },
    {
      value: "Raleway, sans-serif",
      display: "Raleway",
      category: "Sans Serif",
    },
    {
      value: "PT Sans, sans-serif",
      display: "PT Sans",
      category: "Sans Serif",
    },
    { value: "Ubuntu, sans-serif", display: "Ubuntu", category: "Sans Serif" },
    {
      value: "Work Sans, sans-serif",
      display: "Work Sans",
      category: "Sans Serif",
    },
    { value: "Inter, sans-serif", display: "Inter", category: "Sans Serif" },
    {
      value: "Fira Sans, sans-serif",
      display: "Fira Sans",
      category: "Sans Serif",
    },
    {
      value: "Quicksand, sans-serif",
      display: "Quicksand",
      category: "Sans Serif",
    },
    { value: "Barlow, sans-serif", display: "Barlow", category: "Sans Serif" },
    {
      value: "DM Sans, sans-serif",
      display: "DM Sans",
      category: "Sans Serif",
    },
    { value: "Lexend, sans-serif", display: "Lexend", category: "Sans Serif" },
    {
      value: "IBM Plex Sans, sans-serif",
      display: "IBM Plex Sans",
      category: "Sans Serif",
    },
    {
      value: "Space Grotesk, sans-serif",
      display: "Space Grotesk",
      category: "Sans Serif",
    },
    {
      value: "Epilogue, sans-serif",
      display: "Epilogue",
      category: "Sans Serif",
    },
    {
      value: "Archivo, sans-serif",
      display: "Archivo",
      category: "Sans Serif",
    },
    { value: "Sen, sans-serif", display: "Sen", category: "Sans Serif" },
    {
      value: "Questrial, sans-serif",
      display: "Questrial",
      category: "Sans Serif",
    },
    { value: "Mulish, sans-serif", display: "Mulish", category: "Sans Serif" },
    { value: "Jost, sans-serif", display: "Jost", category: "Sans Serif" },
    {
      value: "Assistant, sans-serif",
      display: "Assistant",
      category: "Sans Serif",
    },
    { value: "Asap, sans-serif", display: "Asap", category: "Sans Serif" },
    { value: "Exo, sans-serif", display: "Exo", category: "Sans Serif" },
    { value: "Cabin, sans-serif", display: "Cabin", category: "Sans Serif" },
    {
      value: "Manrope, sans-serif",
      display: "Manrope",
      category: "Sans Serif",
    },
    {
      value: "Plus Jakarta Sans, sans-serif",
      display: "Plus Jakarta Sans",
      category: "Sans Serif",
    },
    {
      value: "Red Hat Display, sans-serif",
      display: "Red Hat Display",
      category: "Sans Serif",
    },
    { value: "Karla, sans-serif", display: "Karla", category: "Sans Serif" },
    { value: "Oxygen, sans-serif", display: "Oxygen", category: "Sans Serif" },
    {
      value: "Noto Sans, sans-serif",
      display: "Noto Sans",
      category: "Sans Serif",
    },
    { value: "Prompt, sans-serif", display: "Prompt", category: "Sans Serif" },
    {
      value: "Maven Pro, sans-serif",
      display: "Maven Pro",
      category: "Sans Serif",
    },
    {
      value: "Titillium Web, sans-serif",
      display: "Titillium Web",
      category: "Sans Serif",
    },
    { value: "Hind, sans-serif", display: "Hind", category: "Sans Serif" },
    {
      value: "Commissioner, sans-serif",
      display: "Commissioner",
      category: "Sans Serif",
    },
    {
      value: "Chakra Petch, sans-serif",
      display: "Chakra Petch",
      category: "Sans Serif",
    },
    {
      value: "Be Vietnam Pro, sans-serif",
      display: "Be Vietnam Pro",
      category: "Sans Serif",
    },
    {
      value: "Albert Sans, sans-serif",
      display: "Albert Sans",
      category: "Sans Serif",
    },
    {
      value: "Public Sans, sans-serif",
      display: "Public Sans",
      category: "Sans Serif",
    },

    // Web Safe Sans Serif
    { value: "Arial, sans-serif", display: "Arial", category: "Sans Serif" },
    {
      value: "Helvetica, sans-serif",
      display: "Helvetica",
      category: "Sans Serif",
    },
    {
      value: "Verdana, sans-serif",
      display: "Verdana",
      category: "Sans Serif",
    },
    { value: "Tahoma, sans-serif", display: "Tahoma", category: "Sans Serif" },
    {
      value: "Trebuchet MS, sans-serif",
      display: "Trebuchet MS",
      category: "Sans Serif",
    },
    {
      value: "Segoe UI, sans-serif",
      display: "Segoe UI",
      category: "Sans Serif",
    },
    {
      value: "Calibri, sans-serif",
      display: "Calibri",
      category: "Sans Serif",
    },
    {
      value: "Candara, sans-serif",
      display: "Candara",
      category: "Sans Serif",
    },
    {
      value: "Century Gothic, sans-serif",
      display: "Century Gothic",
      category: "Sans Serif",
    },
    {
      value: "Franklin Gothic Medium, sans-serif",
      display: "Franklin Gothic Medium",
      category: "Sans Serif",
    },
    {
      value: "Gill Sans, sans-serif",
      display: "Gill Sans",
      category: "Sans Serif",
    },
    { value: "Impact, sans-serif", display: "Impact", category: "Sans Serif" },
    {
      value: "Lucida Sans Unicode, sans-serif",
      display: "Lucida Sans Unicode",
      category: "Sans Serif",
    },

    // ==============================
    // SERIF (80+)
    // ==============================
    {
      value: "Merriweather, serif",
      display: "Merriweather",
      category: "Serif",
    },
    {
      value: "Playfair Display, serif",
      display: "Playfair Display",
      category: "Serif",
    },
    { value: "Lora, serif", display: "Lora", category: "Serif" },
    { value: "PT Serif, serif", display: "PT Serif", category: "Serif" },
    {
      value: "Crimson Text, serif",
      display: "Crimson Text",
      category: "Serif",
    },
    {
      value: "Libre Baskerville, serif",
      display: "Libre Baskerville",
      category: "Serif",
    },
    { value: "EB Garamond, serif", display: "EB Garamond", category: "Serif" },
    {
      value: "Cormorant Garamond, serif",
      display: "Cormorant Garamond",
      category: "Serif",
    },
    { value: "Spectral, serif", display: "Spectral", category: "Serif" },
    { value: "Vollkorn, serif", display: "Vollkorn", category: "Serif" },
    { value: "Alegreya, serif", display: "Alegreya", category: "Serif" },
    {
      value: "Frank Ruhl Libre, serif",
      display: "Frank Ruhl Libre",
      category: "Serif",
    },
    { value: "Cardo, serif", display: "Cardo", category: "Serif" },
    { value: "Literata, serif", display: "Literata", category: "Serif" },
    { value: "Neuton, serif", display: "Neuton", category: "Serif" },
    {
      value: "Old Standard TT, serif",
      display: "Old Standard TT",
      category: "Serif",
    },
    { value: "Crete Round, serif", display: "Crete Round", category: "Serif" },
    { value: "Gelasio, serif", display: "Gelasio", category: "Serif" },
    {
      value: "Headland One, serif",
      display: "Headland One",
      category: "Serif",
    },
    { value: "Noto Serif, serif", display: "Noto Serif", category: "Serif" },
    {
      value: "Source Serif Pro, serif",
      display: "Source Serif Pro",
      category: "Serif",
    },
    {
      value: "IBM Plex Serif, serif",
      display: "IBM Plex Serif",
      category: "Serif",
    },
    { value: "Crimson Pro, serif", display: "Crimson Pro", category: "Serif" },
    { value: "Domine, serif", display: "Domine", category: "Serif" },
    {
      value: "Gentium Book Basic, serif",
      display: "Gentium Book Basic",
      category: "Serif",
    },
    {
      value: "Brygada 1918, serif",
      display: "Brygada 1918",
      category: "Serif",
    },
    { value: "Petrona, serif", display: "Petrona", category: "Serif" },
    {
      value: "Libre Caslon Text, serif",
      display: "Libre Caslon Text",
      category: "Serif",
    },
    { value: "Zilla Slab, serif", display: "Zilla Slab", category: "Serif" },
    { value: "Amiri, serif", display: "Amiri", category: "Serif" },

    // Web Safe Serif
    {
      value: "Times New Roman, serif",
      display: "Times New Roman",
      category: "Serif",
    },
    { value: "Georgia, serif", display: "Georgia", category: "Serif" },
    { value: "Palatino, serif", display: "Palatino", category: "Serif" },
    { value: "Baskerville, serif", display: "Baskerville", category: "Serif" },
    { value: "Cambria, serif", display: "Cambria", category: "Serif" },
    {
      value: "Book Antiqua, serif",
      display: "Book Antiqua",
      category: "Serif",
    },
    { value: "Constantia, serif", display: "Constantia", category: "Serif" },
    { value: "Garamond, serif", display: "Garamond", category: "Serif" },

    // ==============================
    // SLAB SERIF (25+)
    // ==============================
    {
      value: "Roboto Slab, serif",
      display: "Roboto Slab",
      category: "Slab Serif",
    },
    { value: "Bitter, serif", display: "Bitter", category: "Slab Serif" },
    { value: "Arvo, serif", display: "Arvo", category: "Slab Serif" },
    { value: "Rockwell, serif", display: "Rockwell", category: "Slab Serif" },
    {
      value: "Josefin Slab, serif",
      display: "Josefin Slab",
      category: "Slab Serif",
    },
    {
      value: "Museo Slab, serif",
      display: "Museo Slab",
      category: "Slab Serif",
    },
    { value: "Coustard, serif", display: "Coustard", category: "Slab Serif" },
    { value: "Kreon, serif", display: "Kreon", category: "Slab Serif" },
    { value: "Bevan, serif", display: "Bevan", category: "Slab Serif" },
    {
      value: "Bree Serif, serif",
      display: "Bree Serif",
      category: "Slab Serif",
    },
    { value: "Caladea, serif", display: "Caladea", category: "Slab Serif" },
    {
      value: "Slabo 27px, serif",
      display: "Slabo 27px",
      category: "Slab Serif",
    },
    { value: "Sreda, serif", display: "Sreda", category: "Slab Serif" },
    {
      value: "Noticia Text, serif",
      display: "Noticia Text",
      category: "Slab Serif",
    },
    { value: "Patua One, serif", display: "Patua One", category: "Slab Serif" },
    { value: "Rokkitt, serif", display: "Rokkitt", category: "Slab Serif" },
    { value: "Volkhov, serif", display: "Volkhov", category: "Slab Serif" },
    { value: "Enriqueta, serif", display: "Enriqueta", category: "Slab Serif" },
    { value: "Sanchez, serif", display: "Sanchez", category: "Slab Serif" },
    { value: "Podkova, serif", display: "Podkova", category: "Slab Serif" },
    {
      value: "Francois One, serif",
      display: "Francois One",
      category: "Slab Serif",
    },

    // ==============================
    // MONOSPACE (40+)
    // ==============================
    {
      value: "Fira Code, monospace",
      display: "Fira Code",
      category: "Monospace",
    },
    {
      value: "JetBrains Mono, monospace",
      display: "JetBrains Mono",
      category: "Monospace",
    },
    {
      value: "Roboto Mono, monospace",
      display: "Roboto Mono",
      category: "Monospace",
    },
    {
      value: "Source Code Pro, monospace",
      display: "Source Code Pro",
      category: "Monospace",
    },
    {
      value: "IBM Plex Mono, monospace",
      display: "IBM Plex Mono",
      category: "Monospace",
    },
    {
      value: "Inconsolata, monospace",
      display: "Inconsolata",
      category: "Monospace",
    },
    {
      value: "Space Mono, monospace",
      display: "Space Mono",
      category: "Monospace",
    },
    { value: "PT Mono, monospace", display: "PT Mono", category: "Monospace" },
    {
      value: "Ubuntu Mono, monospace",
      display: "Ubuntu Mono",
      category: "Monospace",
    },
    {
      value: "Fira Mono, monospace",
      display: "Fira Mono",
      category: "Monospace",
    },
    { value: "Cousine, monospace", display: "Cousine", category: "Monospace" },
    {
      value: "Oxygen Mono, monospace",
      display: "Oxygen Mono",
      category: "Monospace",
    },
    {
      value: "Anonymous Pro, monospace",
      display: "Anonymous Pro",
      category: "Monospace",
    },
    {
      value: "Cutive Mono, monospace",
      display: "Cutive Mono",
      category: "Monospace",
    },
    {
      value: "Overpass Mono, monospace",
      display: "Overpass Mono",
      category: "Monospace",
    },
    {
      value: "Red Hat Mono, monospace",
      display: "Red Hat Mono",
      category: "Monospace",
    },
    { value: "VT323, monospace", display: "VT323", category: "Monospace" },
    {
      value: "Azeret Mono, monospace",
      display: "Azeret Mono",
      category: "Monospace",
    },
    {
      value: "B612 Mono, monospace",
      display: "B612 Mono",
      category: "Monospace",
    },
    {
      value: "Cascadia Code, monospace",
      display: "Cascadia Code",
      category: "Monospace",
    },
    {
      value: "Commit Mono, monospace",
      display: "Commit Mono",
      category: "Monospace",
    },
    {
      value: "Geist Mono, monospace",
      display: "Geist Mono",
      category: "Monospace",
    },

    // Web Safe Monospace
    {
      value: "Consolas, monospace",
      display: "Consolas",
      category: "Monospace",
    },
    {
      value: "Courier New, monospace",
      display: "Courier New",
      category: "Monospace",
    },
    { value: "Monaco, monospace", display: "Monaco", category: "Monospace" },
    { value: "Menlo, monospace", display: "Menlo", category: "Monospace" },
    {
      value: "Lucida Console, monospace",
      display: "Lucida Console",
      category: "Monospace",
    },
    {
      value: "DejaVu Sans Mono, monospace",
      display: "DejaVu Sans Mono",
      category: "Monospace",
    },

    // ==============================
    // DISPLAY / DECORATIVE (50+)
    // ==============================
    { value: "Oswald, sans-serif", display: "Oswald", category: "Display" },
    {
      value: "Bebas Neue, sans-serif",
      display: "Bebas Neue",
      category: "Display",
    },
    { value: "Anton, sans-serif", display: "Anton", category: "Display" },
    { value: "Righteous, cursive", display: "Righteous", category: "Display" },
    {
      value: "Fredoka One, cursive",
      display: "Fredoka One",
      category: "Display",
    },
    {
      value: "Alfa Slab One, cursive",
      display: "Alfa Slab One",
      category: "Display",
    },
    { value: "Bangers, cursive", display: "Bangers", category: "Display" },
    { value: "Creepster, cursive", display: "Creepster", category: "Display" },
    {
      value: "Abril Fatface, cursive",
      display: "Abril Fatface",
      category: "Display",
    },
    { value: "Bungee, cursive", display: "Bungee", category: "Display" },
    {
      value: "Russo One, sans-serif",
      display: "Russo One",
      category: "Display",
    },
    {
      value: "Chakra Petch, sans-serif",
      display: "Chakra Petch",
      category: "Display",
    },
    { value: "Orbitron, sans-serif", display: "Orbitron", category: "Display" },
    { value: "Exo 2, sans-serif", display: "Exo 2", category: "Display" },
    { value: "Rajdhani, sans-serif", display: "Rajdhani", category: "Display" },
    { value: "Saira, sans-serif", display: "Saira", category: "Display" },
    {
      value: "Staatliches, cursive",
      display: "Staatliches",
      category: "Display",
    },
    {
      value: "Squada One, cursive",
      display: "Squada One",
      category: "Display",
    },
    { value: "Audiowide, cursive", display: "Audiowide", category: "Display" },
    {
      value: "Electrolize, sans-serif",
      display: "Electrolize",
      category: "Display",
    },
    { value: "Iceberg, cursive", display: "Iceberg", category: "Display" },
    { value: "Jura, sans-serif", display: "Jura", category: "Display" },
    { value: "Michroma, sans-serif", display: "Michroma", category: "Display" },
    { value: "Monoton, cursive", display: "Monoton", category: "Display" },
    {
      value: "Faster One, cursive",
      display: "Faster One",
      category: "Display",
    },
    {
      value: "Black Ops One, cursive",
      display: "Black Ops One",
      category: "Display",
    },
    { value: "Coda, cursive", display: "Coda", category: "Display" },
    {
      value: "Concert One, cursive",
      display: "Concert One",
      category: "Display",
    },
    { value: "Fugaz One, cursive", display: "Fugaz One", category: "Display" },
    {
      value: "Hammersmith One, sans-serif",
      display: "Hammersmith One",
      category: "Display",
    },
    { value: "Kalam, cursive", display: "Kalam", category: "Display" },
    {
      value: "Lilita One, cursive",
      display: "Lilita One",
      category: "Display",
    },
    { value: "Modak, cursive", display: "Modak", category: "Display" },
    {
      value: "Passion One, cursive",
      display: "Passion One",
      category: "Display",
    },
    {
      value: "Press Start 2P, cursive",
      display: "Press Start 2P",
      category: "Display",
    },
    {
      value: "Sigmar One, cursive",
      display: "Sigmar One",
      category: "Display",
    },
    { value: "Titan One, cursive", display: "Titan One", category: "Display" },

    // ==============================
    // HANDWRITING / SCRIPT (40+)
    // ==============================
    {
      value: "Dancing Script, cursive",
      display: "Dancing Script",
      category: "Handwriting",
    },
    {
      value: "Pacifico, cursive",
      display: "Pacifico",
      category: "Handwriting",
    },
    { value: "Satisfy, cursive", display: "Satisfy", category: "Handwriting" },
    {
      value: "Kaushan Script, cursive",
      display: "Kaushan Script",
      category: "Handwriting",
    },
    {
      value: "Great Vibes, cursive",
      display: "Great Vibes",
      category: "Handwriting",
    },
    {
      value: "Indie Flower, cursive",
      display: "Indie Flower",
      category: "Handwriting",
    },
    {
      value: "Amatic SC, cursive",
      display: "Amatic SC",
      category: "Handwriting",
    },
    {
      value: "Shadows Into Light, cursive",
      display: "Shadows Into Light",
      category: "Handwriting",
    },
    { value: "Caveat, cursive", display: "Caveat", category: "Handwriting" },
    { value: "Kalam, cursive", display: "Kalam", category: "Handwriting" },
    {
      value: "Patrick Hand, cursive",
      display: "Patrick Hand",
      category: "Handwriting",
    },
    {
      value: "Architects Daughter, cursive",
      display: "Architects Daughter",
      category: "Handwriting",
    },
    {
      value: "Homemade Apple, cursive",
      display: "Homemade Apple",
      category: "Handwriting",
    },
    {
      value: "Permanent Marker, cursive",
      display: "Permanent Marker",
      category: "Handwriting",
    },
    {
      value: "Crafty Girls, cursive",
      display: "Crafty Girls",
      category: "Handwriting",
    },
    {
      value: "Courgette, cursive",
      display: "Courgette",
      category: "Handwriting",
    },
    { value: "Allura, cursive", display: "Allura", category: "Handwriting" },
    {
      value: "Alex Brush, cursive",
      display: "Alex Brush",
      category: "Handwriting",
    },
    { value: "Cookie, cursive", display: "Cookie", category: "Handwriting" },
    {
      value: "Tangerine, cursive",
      display: "Tangerine",
      category: "Handwriting",
    },
    {
      value: "Yellowtail, cursive",
      display: "Yellowtail",
      category: "Handwriting",
    },
    {
      value: "Petit Formal Script, cursive",
      display: "Petit Formal Script",
      category: "Handwriting",
    },
    {
      value: "Sacramento, cursive",
      display: "Sacramento",
      category: "Handwriting",
    },
    {
      value: "Pinyon Script, cursive",
      display: "Pinyon Script",
      category: "Handwriting",
    },
    {
      value: "Leckerli One, cursive",
      display: "Leckerli One",
      category: "Handwriting",
    },
    { value: "Lobster, cursive", display: "Lobster", category: "Handwriting" },
    {
      value: "Lobster Two, cursive",
      display: "Lobster Two",
      category: "Handwriting",
    },
    {
      value: "Marck Script, cursive",
      display: "Marck Script",
      category: "Handwriting",
    },
    {
      value: "Nothing You Could Do, cursive",
      display: "Nothing You Could Do",
      category: "Handwriting",
    },
    {
      value: "Parisienne, cursive",
      display: "Parisienne",
      category: "Handwriting",
    },
    { value: "Rancho, cursive", display: "Rancho", category: "Handwriting" },
    {
      value: "Reenie Beanie, cursive",
      display: "Reenie Beanie",
      category: "Handwriting",
    },
    {
      value: "Rock Salt, cursive",
      display: "Rock Salt",
      category: "Handwriting",
    },
    {
      value: "Schoolbell, cursive",
      display: "Schoolbell",
      category: "Handwriting",
    },
    {
      value: "Sue Ellen Francisco, cursive",
      display: "Sue Ellen Francisco",
      category: "Handwriting",
    },
    {
      value: "Walter Turncoat, cursive",
      display: "Walter Turncoat",
      category: "Handwriting",
    },
    {
      value: "Waiting for the Sunrise, cursive",
      display: "Waiting for the Sunrise",
      category: "Handwriting",
    },
    {
      value: "Coming Soon, cursive",
      display: "Coming Soon",
      category: "Handwriting",
    },
    {
      value: "Handlee, cursive",
      display: "Handlee",
      category: "Handwriting",
    },
    { value: "Kristi, cursive", display: "Kristi", category: "Handwriting" },

    // Web Safe Cursive
    {
      value: "Brush Script MT, cursive",
      display: "Brush Script MT",
      category: "Handwriting",
    },
    {
      value: "Lucida Handwriting, cursive",
      display: "Lucida Handwriting",
      category: "Handwriting",
    },
    {
      value: "Segoe Script, cursive",
      display: "Segoe Script",
      category: "Handwriting",
    },
    {
      value: "Comic Sans MS, cursive",
      display: "Comic Sans MS",
      category: "Handwriting",
    },

    // ==============================
    // BLACKLETTER / GOTHIC (15+)
    // ==============================
    {
      value: "UnifrakturCook, cursive",
      display: "UnifrakturCook",
      category: "Blackletter",
    },
    {
      value: "MedievalSharp, cursive",
      display: "MedievalSharp",
      category: "Blackletter",
    },
    {
      value: "Cinzel Decorative, cursive",
      display: "Cinzel Decorative",
      category: "Blackletter",
    },
    {
      value: "Pirata One, cursive",
      display: "Pirata One",
      category: "Blackletter",
    },
    {
      value: "Germania One, cursive",
      display: "Germania One",
      category: "Blackletter",
    },
    {
      value: "Fette Fraktur, cursive",
      display: "Fette Fraktur",
      category: "Blackletter",
    },
    { value: "Nosifer, cursive", display: "Nosifer", category: "Blackletter" },
    {
      value: "Metamorphous, cursive",
      display: "Metamorphous",
      category: "Blackletter",
    },
    { value: "Griffy, cursive", display: "Griffy", category: "Blackletter" },
    {
      value: "Jim Nightshade, cursive",
      display: "Jim Nightshade",
      category: "Blackletter",
    },
    {
      value: "Butcherman, cursive",
      display: "Butcherman",
      category: "Blackletter",
    },
    { value: "Eater, cursive", display: "Eater", category: "Blackletter" },
    {
      value: "New Rocker, cursive",
      display: "New Rocker",
      category: "Blackletter",
    },

    // ==============================
    // FANTASY / DECORATIVE (20+)
    // ==============================
    { value: "Cinzel, serif", display: "Cinzel", category: "Fantasy" },
    {
      value: "Uncial Antiqua, cursive",
      display: "Uncial Antiqua",
      category: "Fantasy",
    },
    {
      value: "Celtic Hand, cursive",
      display: "Celtic Hand",
      category: "Fantasy",
    },
    { value: "Luminari, fantasy", display: "Luminari", category: "Fantasy" },
    { value: "Papyrus, fantasy", display: "Papyrus", category: "Fantasy" },
    {
      value: "Copperplate, fantasy",
      display: "Copperplate",
      category: "Fantasy",
    },
    {
      value: "Trajan Pro, fantasy",
      display: "Trajan Pro",
      category: "Fantasy",
    },
    {
      value: "Enchanted Land, fantasy",
      display: "Enchanted Land",
      category: "Fantasy",
    },
    { value: "Mason, cursive", display: "Mason", category: "Fantasy" },
    { value: "Macondo, cursive", display: "Macondo", category: "Fantasy" },
    {
      value: "Almendra Display, cursive",
      display: "Almendra Display",
      category: "Fantasy",
    },
    { value: "Creepster, cursive", display: "Creepster", category: "Fantasy" },
    { value: "Chonburi, cursive", display: "Chonburi", category: "Fantasy" },
    {
      value: "Emblema One, cursive",
      display: "Emblema One",
      category: "Fantasy",
    },
    { value: "Fascinate, cursive", display: "Fascinate", category: "Fantasy" },
    { value: "Flavors, cursive", display: "Flavors", category: "Fantasy" },
    {
      value: "Freckle Face, cursive",
      display: "Freckle Face",
      category: "Fantasy",
    },
    {
      value: "Henny Penny, cursive",
      display: "Henny Penny",
      category: "Fantasy",
    },
    {
      value: "Mystery Quest, cursive",
      display: "Mystery Quest",
      category: "Fantasy",
    },
    { value: "Rye, cursive", display: "Rye", category: "Fantasy" },

    // ==============================
    // SYSTEM UI / SPECIAL (10+)
    // ==============================
    {
      value: "system-ui, sans-serif",
      display: "System UI",
      category: "System UI",
    },
    {
      value: "-apple-system, sans-serif",
      display: "Apple System",
      category: "System UI",
    },
    {
      value: "BlinkMacSystemFont, sans-serif",
      display: "Blink Mac System",
      category: "System UI",
    },
    { value: "ui-serif, serif", display: "UI Serif", category: "System UI" },
    {
      value: "ui-sans-serif, sans-serif",
      display: "UI Sans Serif",
      category: "System UI",
    },
    {
      value: "ui-monospace, monospace",
      display: "UI Monospace",
      category: "System UI",
    },
    {
      value: "ui-rounded, sans-serif",
      display: "UI Rounded",
      category: "System UI",
    },

    // ==============================
    // EMOJI FONTS (5+)
    // ==============================
    {
      value: "Apple Color Emoji, sans-serif",
      display: "Apple Color Emoji",
      category: "Emoji",
    },
    {
      value: "Segoe UI Emoji, sans-serif",
      display: "Segoe UI Emoji",
      category: "Emoji",
    },
    {
      value: "Noto Color Emoji, sans-serif",
      display: "Noto Color Emoji",
      category: "Emoji",
    },
    { value: "Twemoji, sans-serif", display: "Twemoji", category: "Emoji" },
    { value: "EmojiOne, sans-serif", display: "EmojiOne", category: "Emoji" },
  ];

  const groupedFonts = fontOptions.reduce((groups, font) => {
    if (!groups[font.category]) groups[font.category] = [];
    groups[font.category].push(font);
    return groups;
  }, {});

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          Text Properties
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Customize typography, colors, and layout for your{" "}
          <Badge variant="secondary" className="text-xs">
            text content
          </Badge>{" "}
          elements.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Accordion
          type="multiple"
          defaultValue={["typography"]}
          className="w-full"
        >
          {/* Typography Section */}
          <AccordionItem value="typography" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-emerald-50/50 hover:bg-emerald-50 border-b">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Typography</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Family</Label>
                  <Select
                    value={element.styles?.fontFamily || ""}
                    onValueChange={(value) =>
                      handleStyleChange("fontFamily", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent className="max-h-96">
                      {Object.entries(groupedFonts).map(([category, fonts]) => (
                        <div key={category}>
                          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                            {category}
                          </div>
                          {fonts.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: font.value }}>
                                {font.display}
                              </span>
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Font Size</Label>
                    <div className="flex gap-1 items-center">
                      <Input
                        type="number"
                        min="8"
                        value={parseInt(element.styles?.fontSize) || 16}
                        onChange={(e) =>
                          handleStyleChange("fontSize", Number(e.target.value))
                        }
                        className="text-sm"
                      />
                      <Badge variant="outline" className="text-xs">
                        px
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Bold className="w-3 h-3" />
                      Weight
                    </Label>
                    <Select
                      value={element.styles?.fontWeight || "normal"}
                      onValueChange={(value) =>
                        handleStyleChange("fontWeight", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light</SelectItem>
                        <SelectItem value="400">Normal</SelectItem>
                        <SelectItem value="600">Semibold</SelectItem>
                        <SelectItem value="700">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Line Height</Label>
                  <div className="flex gap-1 items-center">
                    <Input
                      type="number"
                      min="0.5"
                      step="0.1"
                      value={parseFloat(element.styles?.lineHeight) || 1.5}
                      onChange={(e) =>
                        handleStyleChange("lineHeight", e.target.value)
                      }
                      className="text-sm"
                    />
                    <Badge variant="outline" className="text-xs">
                      em
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Controls spacing between lines
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <AlignLeft className="w-3 h-3" />
                    Text Alignment
                  </Label>
                  <Select
                    value={element.styles?.textAlign || "left"}
                    onValueChange={(value) =>
                      handleStyleChange("textAlign", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Text Effects Section */}
          <AccordionItem value="text-effects" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-emerald-50/50 hover:bg-emerald-50 border-b">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Text Effects</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                {/* Font Style Toggles */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Font Style</Label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        handleStyleChange(
                          "fontWeight",
                          element.styles?.fontWeight === "bold"
                            ? "normal"
                            : "bold"
                        )
                      }
                      className={`px-3 py-2 text-sm font-bold rounded border transition-colors ${
                        element.styles?.fontWeight === "bold"
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      B
                    </button>

                    <button
                      onClick={() =>
                        handleStyleChange(
                          "fontStyle",
                          element.styles?.fontStyle === "italic"
                            ? "normal"
                            : "italic"
                        )
                      }
                      className={`px-3 py-2 text-sm italic rounded border transition-colors ${
                        element.styles?.fontStyle === "italic"
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      I
                    </button>

                    <button
                      onClick={() =>
                        handleStyleChange(
                          "textDecoration",
                          element.styles?.textDecoration === "underline"
                            ? "none"
                            : "underline"
                        )
                      }
                      className={`px-3 py-2 text-sm underline rounded border transition-colors ${
                        element.styles?.textDecoration === "underline"
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      U
                    </button>
                  </div>
                </div>

                {/* Font Weight Slider */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Weight</Label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-8">100</span>
                    <input
                      type="range"
                      min="100"
                      max="900"
                      step="100"
                      value={parseInt(element.styles?.fontWeight) || 400}
                      onChange={(e) =>
                        handleStyleChange("fontWeight", e.target.value)
                      }
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-xs text-gray-500 w-8">900</span>
                    <span className="text-xs font-semibold text-gray-700 w-8">
                      {parseInt(element.styles?.fontWeight) || 400}
                    </span>
                  </div>
                </div>

                {/* Text Shadow Controls */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Text Shadow</Label>

                  {/* Shadow Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const hasShadow =
                          element.styles?.textShadow &&
                          element.styles.textShadow !== "none";
                        if (hasShadow) {
                          handleStyleChange("textShadow", "none");
                        } else {
                          // Build shadow from individual properties
                          const x = element.styles?.shadowOffsetX || "2px";
                          const y = element.styles?.shadowOffsetY || "2px";
                          const blur =
                            element.styles?.shadowBlurRadius || "4px";
                          const color =
                            element.styles?.shadowColor || "#000000";
                          handleStyleChange(
                            "textShadow",
                            `${x} ${y} ${blur} ${color}`
                          );
                        }
                      }}
                      className={`px-4 py-2 text-sm rounded border transition-colors ${
                        element.styles?.textShadow &&
                        element.styles.textShadow !== "none"
                          ? "bg-purple-500 text-white border-purple-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {element.styles?.textShadow &&
                      element.styles.textShadow !== "none"
                        ? "Remove Shadow"
                        : "Add Shadow"}
                    </button>
                  </div>

                  {/* Shadow Controls - show only if shadow is enabled */}
                  {element.styles?.textShadow &&
                    element.styles.textShadow !== "none" && (
                      <div className="space-y-3 pl-4 border-l-2 border-purple-200">
                        {/* Shadow Offset X */}
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">
                            Horizontal Offset
                          </Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="-20"
                              max="20"
                              step="1"
                              value={
                                parseInt(element.styles?.shadowOffsetX) || 2
                              }
                              onChange={(e) =>
                                handleStyleChange(
                                  "shadowOffsetX",
                                  Number(e.target.value)
                                )
                              }
                              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-gray-600 w-8">
                              {parseInt(element.styles?.shadowOffsetX) || 2}px
                            </span>
                          </div>
                        </div>

                        {/* Shadow Offset Y */}
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">
                            Vertical Offset
                          </Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="-20"
                              max="20"
                              step="1"
                              value={
                                parseInt(element.styles?.shadowOffsetY) || 2
                              }
                              onChange={(e) =>
                                handleStyleChange(
                                  "shadowOffsetY",
                                  Number(e.target.value)
                                )
                              }
                              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-gray-600 w-8">
                              {parseInt(element.styles?.shadowOffsetY) || 2}px
                            </span>
                          </div>
                        </div>

                        {/* Shadow Blur Radius */}
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">
                            Blur Radius
                          </Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="20"
                              step="1"
                              value={
                                parseInt(element.styles?.shadowBlurRadius) || 4
                              }
                              onChange={(e) =>
                                handleStyleChange(
                                  "shadowBlurRadius",
                                  Number(e.target.value)
                                )
                              }
                              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-gray-600 w-8">
                              {parseInt(element.styles?.shadowBlurRadius) || 4}
                              px
                            </span>
                          </div>
                        </div>

                        {/* Shadow Color */}
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">
                            Shadow Color
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={element.styles?.shadowColor || "#000000"}
                              onChange={(e) =>
                                handleStyleChange("shadowColor", e.target.value)
                              }
                              className="w-8 h-8 p-1 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={element.styles?.shadowColor || "#000000"}
                              onChange={(e) =>
                                handleStyleChange("shadowColor", e.target.value)
                              }
                              className="flex-1 font-mono text-xs"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Colors Section */}
          <AccordionItem value="colors" className="border-0">
            <AccordionTrigger className="px-4 py-3 bg-purple-50/50 hover:bg-purple-50 border-b">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Colors</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={element.styles?.color || "#000000"}
                      onChange={(e) =>
                        handleStyleChange("color", e.target.value)
                      }
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={element.styles?.color || "#000000"}
                      onChange={(e) =>
                        handleStyleChange("color", e.target.value)
                      }
                      className="flex-1 font-mono text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Background Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={element.styles?.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        handleStyleChange("backgroundColor", e.target.value)
                      }
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={element.styles?.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        handleStyleChange("backgroundColor", e.target.value)
                      }
                      className="flex-1 font-mono text-sm"
                      placeholder="#ffffff"
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
                                  handleStyleChange(key, Number(e.target.value))
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
                                  handleStyleChange(key, Number(e.target.value))
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
