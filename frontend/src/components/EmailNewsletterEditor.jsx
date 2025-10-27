import React, { useState, useRef, useEffect } from "react";
import EditorSidebar from "./EditorSidebar";
import EditorCanvas from "./EditorCanvas";
import { MousePointer, Eye, Save, Send, Download, Share2 } from "lucide-react";
import domToImage from "dom-to-image-more";
import jsPDF from "jspdf";
import { exportToEmailHtml } from "./ExportToEmailHtml";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Add LZ-String compression library dynamically
if (typeof window !== "undefined" && !window.LZString) {
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js";
  script.async = true;
  document.head.appendChild(script);
}

// ============================================================================
// CONFIGURATION - Update these values for your backend
// ============================================================================
const API_BASE_URL = "http://localhost:3000/api/v1";
const CLOUD_NAME = "dhlex64es";
const UPLOAD_PRESET = "newsletter";

// User/Work ID - Replace with your actual user authentication system
// For now, using a dummy workId. In production, get this from your auth context
const WORK_ID = "USER-12345";

// ============================================================================
// API SERVICE - All backend communication functions
// ============================================================================
const TemplateAPI = {
  // Create a new template
  async createTemplate(templateData) {
    const response = await fetch(`${API_BASE_URL}/templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: templateData.name,
        cloudinaryUrl: templateData.cloudinaryUrl,
        workId: WORK_ID,
        previewImageUrl: templateData.previewImageUrl || "",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create template");
    }

    return await response.json();
  },

  // Get all templates for current user
  async getTemplatesByWorkId() {
    const response = await fetch(`${API_BASE_URL}/templates/work/${WORK_ID}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch templates");
    }

    return await response.json();
  },

  // Get a single template by ID
  async getTemplateById(templateId) {
    const response = await fetch(`${API_BASE_URL}/templates/${templateId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch template");
    }

    return await response.json();
  },

  // Update an existing template
  async updateTemplate(templateId, updates) {
    const response = await fetch(`${API_BASE_URL}/templates/${templateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update template");
    }

    return await response.json();
  },

  // Delete a template
  async deleteTemplate(templateId) {
    const response = await fetch(`${API_BASE_URL}/templates/${templateId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete template");
    }

    return await response.json();
  },
};

// Social SVG icons for proper rendering in exports
const SOCIAL_SVGS = {
  facebook: {
    viewBox: "0 0 24 24",
    path: "M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.494v-9.294H9.691V11h3.127V8.41c0-3.1 1.892-4.788 4.657-4.788 1.323 0 2.458.099 2.787.142v3.233h-1.914c-1.5 0-1.791.712-1.791 1.76V11h3.581l-.467 3.706h-3.114V24h6.102C23.407 24 24 23.407 24 22.676V1.324C24 .593 23.407 0 22.676 0z",
  },
  twitter: {
    viewBox: "0 0 24 24",
    path: "M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.607 1.794-1.569 2.163-2.723-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.723 0-4.928 2.205-4.928 4.928 0 .386.044.762.127 1.124-4.094-.205-7.725-2.167-10.159-5.144-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.214 2.188 4.099-.807-.026-1.566-.247-2.228-.616v.062c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.316 0-.624-.03-.927-.086.624 1.951 2.438 3.372 4.587 3.412-1.68 1.318-3.797 2.105-6.102 2.105-.396 0-.788-.023-1.175-.068 2.179 1.397 4.768 2.213 7.548 2.213 9.057 0 14.01-7.506 14.01-14.009 0-.213-.005-.425-.014-.636.962-.694 1.797-1.562 2.457-2.549z",
  },
  instagram: {
    viewBox: "0 0 24 24",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403a4.92 4.92 0 011.78 1.153 4.92 4.92 0 011.153 1.78c.163.457.347 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.92 4.92 0 01-1.153 1.78 4.92 4.92 0 01-1.78 1.153c-.457.163-1.257.347-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.92 4.92 0 01-1.78-1.153 4.92 4.92 0 01-1.153-1.78c-.163-.457-.347-1.257-.403-2.427C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427a4.92 4.92 0 011.153-1.78 4.92 4.92 0 011.78-1.153c.457-.163 1.257-.347 2.427-.403C8.416 2.175 8.796 2.163 12 2.163zm0 1.837c-3.16 0-3.525.012-4.767.069-1.023.047-1.579.218-1.946.363-.49.19-.84.416-1.207.783-.367.367-.593.717-.783 1.207-.145.367-.316.923-.363 1.946-.057 1.242-.069 1.607-.069 4.767s.012 3.525.069 4.767c.047 1.023.218 1.579.363 1.946.19.49.416.84.783 1.207.367.367.717.593 1.207.783.367.145.923.316 1.946.363 1.242.057 1.607.069 4.767.069s3.525-.012 4.767-.069c1.023-.047 1.579-.218 1.946-.363.49-.19.84-.416 1.207-.783.367-.367.593-.717.783-1.207.145-.367.316-.923.363-1.946.057-1.242.069-1.607.069-4.767s-.012-3.525-.069-4.767c-.047-1.023-.218-1.579-.363-1.946-.19-.49-.416-.84-.783-1.207-.367-.367-.717-.593-1.207-.783-.367-.145-.923-.316-1.946-.363-1.242-.057-1.607-.069-4.767-.069zm0 3.651a4.349 4.349 0 110 8.698 4.349 4.349 0 010-8.698zm0 1.837a2.512 2.512 0 100 5.023 2.512 2.512 0 000-5.023zm5.527-2.91a1.017 1.017 0 110 2.034 1.017 1.017 0 010-2.034z",
  },
  linkedin: {
    viewBox: "0 0 24 24",
    path: "M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.5 8h4V24h-4zM8 8h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-5.6c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95V24h-4z",
  },
  youtube: {
    viewBox: "0 0 24 24",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  whatsapp: {
    viewBox: "0 0 24 24",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488z",
  },
  telegram: {
    viewBox: "0 0 24 24",
    path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
  snapchat: {
    viewBox: "0 0 24 24",
    path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001z",
  },
  tiktok: {
    viewBox: "0 0 24 24",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
  reddit: {
    viewBox: "0 0 24 24",
    path: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z",
  },
  pinterest: {
    viewBox: "0 0 24 24",
    path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.719-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.341-.09.394-.293 1.195-.334 1.362-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z",
  },
  threads: {
    viewBox: "0 0 24 24",
    path: "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.055 7.164 1.43 1.781 3.63 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.808-1.707-.619-.536-1.548-.866-2.721-.866-1.072 0-1.866.284-2.298.724-.291.297-.484.792-.484 1.425 0 .613.179 1.085.53 1.404.297.27.659.405 1.074.405.346 0 .658-.064.926-.19.61-.287.91-1.04.91-2.298 0-1.455-.455-2.46-1.35-2.98-.895-.52-2.117-.78-3.665-.78-1.287 0-2.439.28-3.43.835-1.012.565-1.804 1.375-2.359 2.416-.564 1.058-.848 2.288-.848 3.667 0 1.355.284 2.583.847 3.641.555 1.041 1.347 1.851 2.359 2.416.991.555 2.143.835 3.43.835 1.548 0 2.77-.26 3.665-.78.895-.52 1.35-1.525 1.35-2.98 0-1.258-.3-2.011-.91-2.298-.268-.126-.58-.19-.926-.19-.415 0-.777.135-1.074.405-.351.319-.53.791-.53 1.404 0 .633.193 1.128.484 1.425.432.44 1.226.724 2.298.724 1.173 0 2.102-.33 2.721-.866.433-.375.682-.965.808-1.707a13.853 13.853 0 0 0-3.02.142c-1.464.084-2.703.531-3.583 1.291-.922.797-1.395 1.892-1.33 3.082.067 1.224.689 2.275 1.752 2.964.898.583 2.057.866 3.259.801 1.59-.086 2.844-.688 3.73-1.79.662-.826 1.092-1.92 1.284-3.272.761.45 1.324 1.04 1.634 1.75.528 1.205.557 3.185-1.09 4.798-1.442 1.414-3.177 2.025-5.8 2.045z",
  },
  discord: {
    viewBox: "0 0 24 24",
    path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z",
  },
  quora: {
    viewBox: "0 0 24 24",
    path: "M12.737 18.646h-.738c-1.655 0-2.993-1.336-2.993-2.993v-2.995c0-1.656 1.338-2.993 2.993-2.993h.738c1.655 0 2.993 1.337 2.993 2.993v2.995c0 1.657-1.338 2.993-2.993 2.993zm.369-3.36v-2.274c0-.607-.493-1.1-1.1-1.1s-1.1.493-1.1 1.1v2.274c0 .607.493 1.1 1.1 1.1s1.1-.493 1.1-1.1z",
  },
  wechat: {
    viewBox: "0 0 24 24",
    path: "M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.181 0 .655-.52 1.186-1.162 1.186-.642 0-1.162-.531-1.162-1.186 0-.652.52-1.181 1.162-1.181zm5.813 0c.642 0 1.162.529 1.162 1.181 0 .655-.52 1.186-1.162 1.186-.642 0-1.162-.531-1.162-1.186 0-.652.52-1.181 1.162-1.181zm4.721 2.987c-3.897 0-7.022 2.693-7.022 6.04 0 1.838.86 3.516 2.238 4.68a.507.507 0 01.183.572l-.333 1.26c-.016.061-.041.12-.041.181a.243.243 0 00.245.25.275.275 0 00.141-.046l1.637-.952a.726.726 0 01.595-.083c.85.232 1.747.353 2.357.353 3.897 0 7.022-2.693 7.022-6.04 0-3.347-3.125-6.04-7.022-6.04zm-2.607 2.087c.535 0 .969.437.969.979 0 .542-.434.979-.969.979-.535 0-.969-.437-.969-.979 0-.542.434-.979.969-.979zm5.215 0c.535 0 .969.437.969.979 0 .542-.434.979-.969.979-.535 0-.969-.437-.969-.979 0-.542.434-.979.969-.979z",
  },
};

// Link tracking for PDF annotations
let exportLinkRects = [];

// Font loading helper with all required weights
const ensureFontsLoaded = async () => {
  const id = "export-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Lato:wght@100;300;400;700;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    await new Promise((r) => setTimeout(r, 800));
  }

  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn("Font loading timeout:", e);
    }
  }
};

// Helper to normalize font weight to numeric value
const normalizeWeight = (weight) => {
  if (!weight) return 400;
  if (/^\d+$/.test(weight)) return parseInt(weight, 10);
  const weightMap = {
    thin: 100,
    extralight: 200,
    ultralight: 200,
    light: 300,
    normal: 400,
    regular: 400,
    medium: 500,
    semibold: 600,
    demibold: 600,
    bold: 700,
    extrabold: 800,
    ultrabold: 800,
    black: 900,
    heavy: 900,
    lighter: 300,
    bolder: 700,
  };
  return weightMap[(weight || "").toLowerCase()] || 400;
};

// Helper to extract rotation from transform string
const extractRotation = (transform) => {
  if (!transform || transform === "none") return 0;
  const match = transform.match(/rotate\(([-\d.]+)deg\)/i);
  return match ? parseFloat(match[1]) : 0;
};

// Helper to extract scale from transform string
const extractScale = (transform) => {
  if (!transform || transform === "none") return 1;
  const match = transform.match(/scale\(([d.]+)\)/i);
  return match ? parseFloat(match[1]) : 1;
};

// Build per-corner radius string if any corner is set
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

// Return the final radius to apply given shapeType and styles
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

// Only use polygon clip-path for polygon shapes
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

// Guard to decide if a shape is polygonal
const isPolygonShape = (shapeType) => {
  const t = (shapeType || "rectangle").toLowerCase();
  return t === "trapezoid" || t === "star";
};

// Helper to strip layout-affecting transforms
const stripLayoutTransforms = (node, preserveImageRotation = false) => {
  if (node && node.style) {
    if (!preserveImageRotation) {
      node.style.transform = "none";
      node.style.transformOrigin = "top left";
    }
    node.style.rotate = "";
    node.style.scale = "";
    node.style.translate = "";
    node.style.webkitTransform = preserveImageRotation
      ? node.style.transform
      : "none";
    node.style.msTransform = preserveImageRotation
      ? node.style.transform
      : "none";
  }
};

// Helper to normalize all layout transforms in a DOM tree
const normalizeLayoutTransforms = (root) => {
  const walk = (node) => {
    if (node.tagName === "IMG") {
      stripLayoutTransforms(node, true);
    } else {
      stripLayoutTransforms(node, false);
    }
    Array.from(node.children || []).forEach(walk);
  };
  walk(root);
};

export default function EmailNewsletterEditor() {
  const [elements, setElements] = useState([
    {
      id: "header-1",
      type: "header",
      content: "Welcome to Our Newsletter",
      styles: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#1a1a1a",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "transparent",
        width: "100%",
        position: "static",
        fontFamily: "Arial, sans-serif",
      },
    },
  ]);

  const [selectedElementId, setSelectedElementId] = useState(null);
  const [globalSettings, setGlobalSettings] = useState({
    backgroundColor: "#f5f5f5",
    maxWidth: "600px",
    fontFamily: "Arial, sans-serif",
    newsletterColor: "#FFFFFF",
    minHeight: "800px",
  });
  const [newsletterName, setNewsletterName] = useState("Untitled Newsletter");
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [activeView, setActiveView] = useState("editor");
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState("");
  const [shareDisabled, setShareDisabled] = useState(false);
  const [isSharedDataLoaded, setIsSharedDataLoaded] = useState(false);
  
  // Loading states
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isExportingHtml, setIsExportingHtml] = useState(false);
  
  // Track if we're editing an existing template
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  
  const dragItem = useRef(null);
  const canvasRef = useRef(null);

  // ============================================================================
  // THUMBNAIL GENERATION
  // ============================================================================
  const generateThumbnail = async () => {
    try {
      await ensureFontsLoaded();
      const node = prepareForExport();
      if (!node) return "";
      
      Object.assign(node.style, {
        position: "absolute",
        left: "-9999px",
        top: "0",
        zIndex: "-1",
      });
      document.body.appendChild(node);
      await new Promise((r) => setTimeout(r, 800));
      
      const width = Math.min(320, parseInt(globalSettings.maxWidth || 600, 10));
      const scale = width / (parseInt(globalSettings.maxWidth || 600, 10) || 600);
      
      const dataUrl = await domToImage.toPng(node, {
        quality: 0.8,
        bgcolor: globalSettings.newsletterColor || "#ffffff",
        width: parseInt(globalSettings.maxWidth || 600, 10),
        height: node.scrollHeight,
        style: { transform: `scale(${scale})`, transformOrigin: "top left" },
        filter: (el) => !el?.dataset?.noExport,
      });
      
      document.body.removeChild(node);
      return dataUrl;
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      return "";
    }
  };

  // ============================================================================
  // TEMPLATE DATA UPLOAD TO CLOUDINARY (for share feature)
  // ============================================================================
  const saveToCloudinary = async (data) => {
    try {
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("public_id", `newsletter_${Date.now()}`);
      formData.append("resource_type", "raw");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploaded = await res.json();
      if (uploaded.secure_url) {
        return uploaded.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Cloudinary save error:", err);
      throw err;
    }
  };

  // ============================================================================
  // SAVE OR UPDATE TEMPLATE TO BACKEND DATABASE
  // ============================================================================
  const saveOrUpdateTemplate = async () => {
    try {
      setIsSaving(true);
      
      // Step 1: Generate thumbnail
      showMessage("Generating thumbnail...");
      const thumbnailDataUrl = await generateThumbnail();
      
      // Step 2: Upload thumbnail to Cloudinary (if generated)
      let thumbnailCloudinaryUrl = "";
      if (thumbnailDataUrl) {
        showMessage("Uploading thumbnail...");
        const blob = await fetch(thumbnailDataUrl).then(r => r.blob());
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", UPLOAD_PRESET);
        
        const thumbResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        
        const thumbData = await thumbResponse.json();
        if (thumbData.secure_url) {
          thumbnailCloudinaryUrl = thumbData.secure_url;
        }
      }

      // Step 3: Upload template data to Cloudinary
      showMessage("Uploading template data...");
      const templateData = {
        name: newsletterName || "Untitled",
        elements,
        globalSettings,
        workId: WORK_ID,
        createdAt: currentTemplateId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const cloudinaryUrl = await saveToCloudinary(templateData);

      // Step 4: Check if we're updating or creating
      let response;
      if (currentTemplateId) {
        // UPDATE existing template
        showMessage("Updating template...");
        const updates = {
          name: newsletterName || "Untitled",
          cloudinaryUrl: cloudinaryUrl,
        };
        
        if (thumbnailCloudinaryUrl) {
          updates.previewImageUrl = thumbnailCloudinaryUrl;
        }
        
        response = await TemplateAPI.updateTemplate(currentTemplateId, updates);
        showMessage("Template updated successfully!");
      } else {
        // CREATE new template
        showMessage("Saving to database...");
        response = await TemplateAPI.createTemplate({
          name: newsletterName || "Untitled",
          cloudinaryUrl: cloudinaryUrl,
          previewImageUrl: thumbnailCloudinaryUrl,
        });
        
        // Store the new template ID for future updates
        if (response.data && response.data._id) {
          setCurrentTemplateId(response.data._id);
        }
        
        showMessage("Template saved successfully!");
      }
      
      return response;
    } catch (error) {
      console.error("Error saving/updating template:", error);
      showMessage(`Failed to save template: ${error.message}`);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================================
  // LOAD TEMPLATE FROM BACKEND
  // ============================================================================
  const loadTemplateFromBackend = async (templateId) => {
    try {
      showMessage("Loading template...");
      const response = await TemplateAPI.getTemplateById(templateId);
      
      if (response.data) {
        const template = response.data;
        
        // Fetch the actual template data from Cloudinary
        const dataResponse = await fetch(template.cloudinaryUrl);
        const templateData = await dataResponse.json();
        
        setElements(templateData.elements);
        setGlobalSettings(templateData.globalSettings);
        setNewsletterName(templateData.name || "Untitled Newsletter");
        setSelectedElementId(null);
        
        // Store the template ID for updates
        setCurrentTemplateId(template._id);
        
        showMessage("Template loaded successfully!");
      }
    } catch (error) {
      console.error("Error loading template:", error);
      showMessage(`Failed to load template: ${error.message}`);
    }
  };

  // ============================================================================
  // DELETE TEMPLATE FROM BACKEND
  // ============================================================================
  const deleteTemplateFromBackend = async (templateId) => {
    try {
      showMessage("Deleting template...");
      const response = await TemplateAPI.deleteTemplate(templateId);
      
      if (response.message) {
        showMessage(response.message);
      } else {
        showMessage("Template deleted successfully!");
      }
      
      return response;
    } catch (error) {
      console.error("Error deleting template:", error);
      showMessage(`Failed to delete template: ${error.message}`);
      throw error;
    }
  };

  // Check for encoded data in the URL on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateUrl = urlParams.get("template");
    const templateId = urlParams.get("templateId");

    if (templateUrl) {
      // Load from shared Cloudinary URL
      fetch(templateUrl)
        .then((res) => res.json())
        .then((data) => {
          setElements(data.elements);
          setGlobalSettings(data.globalSettings);
          setNewsletterName(data.name || "Untitled Newsletter");
          setShareDisabled(true);
          setIsSharedDataLoaded(true);
          // Don't set currentTemplateId for shared templates
          setCurrentTemplateId(null);
          showMessage("Loaded from shared template!");
        })
        .catch((err) => {
          console.error("Error loading shared template:", err);
          showMessage("Failed to load shared template.");
        });
    } else if (templateId) {
      // Load from backend database
      loadTemplateFromBackend(templateId);
    }
  }, []);

  const location = useLocation();

  useEffect(() => {
    const tpl = location?.state?.template;
    const action = location?.state?.action;
    
    if (tpl && tpl.elements && tpl.globalSettings) {
      setElements(tpl.elements);
      setGlobalSettings(tpl.globalSettings);
      setNewsletterName(tpl.name || "Untitled Newsletter");
      setSelectedElementId(null);
      
      // Store the template ID if available (for updates)
      if (tpl._id) {
        setCurrentTemplateId(tpl._id);
      }
      
      if (action === "send") {
        setTimeout(() => {
          try {
            const html = exportToEmailHtml(
              tpl.elements,
              tpl.globalSettings,
              tpl.name || newsletterName
            );
            navigator.clipboard.writeText(html);
            showMessage("Email HTML ready to send (copied).");
          } catch (e) {
            showMessage("Failed to prepare email HTML.");
          }
        }, 100);
      } else {
        showMessage("Template loaded.");
      }
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const pushLinkRect = (href, x, y, width, height) => {
    if (!href || href === "#") return;
    exportLinkRects.push({ href, x, y, width, height });
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case "text":
        return "Enter your text here...";
      case "header":
        return "New Header";
      case "image":
        return "";
      case "button":
        return "Click Me";
      case "divider":
        return "";
      case "social":
        return "";
      case "shape":
        return "";
      default:
        return "";
    }
  };

  const getDefaultStyles = (type) => {
    const base = {
      padding: "15px 20px",
      position: "absolute",
      width: type === "button" ? "auto" : "300px",
      fontFamily: globalSettings.fontFamily || "Arial, sans-serif",
    };

    switch (type) {
      case "shape":
        return {
          ...base,
          width: "200px",
          height: "200px",
          backgroundColor: "#3b82f6",
          shapeType: "rectangle",
          fillType: "solid",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "#000000",
          opacity: "1",
          boxShadow: "none",
          transform: "none",
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          marginLeft: "0px",
          paddingTop: "0px",
          paddingRight: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
        };
      case "text":
        return {
          ...base,
          fontSize: "16px",
          color: "#333",
          lineHeight: "1.6",
          height: "auto",
          backgroundColor: "transparent",
          fontWeight: "400",
          fontStyle: "normal",
          textDecoration: "none",
          textShadow: "none",
          shadowOffsetX: "0px",
          shadowOffsetY: "0px",
          shadowBlurRadius: "0px",
          shadowColor: "#000000",
        };
      case "header":
        return {
          ...base,
          fontSize: "28px",
          fontWeight: "700",
          textAlign: "center",
          color: "#1a1a1a",
          height: "auto",
          backgroundColor: "transparent",
          fontStyle: "normal",
          textDecoration: "none",
          textShadow: "none",
          shadowOffsetX: "0px",
          shadowOffsetY: "0px",
          shadowBlurRadius: "0px",
          shadowColor: "#000000",
        };
      case "image":
        return {
          ...base,
          textAlign: "center",
          height: "200px",
          width: "300px",
          shapeType: "rectangle",
        };
      case "button":
        return {
          ...base,
          backgroundColor: "#007bff",
          color: "#fff",
          textAlign: "center",
          borderRadius: "6px",
          display: "inline-block",
          width: "150px",
          height: "50px",
          paddingTop: "12px",
          paddingRight: "24px",
          paddingBottom: "12px",
          paddingLeft: "24px",
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          marginLeft: "0px",
          fontWeight: "600",
        };
      case "divider":
        return {
          ...base,
          height: "20px",
          backgroundColor: "#D1D5DB",
          borderBottomWidth: "2px",
          borderBottomStyle: "solid",
          width: "100%",
        };
      case "social":
        return {
          ...base,
          textAlign: "center",
          fontSize: "14px",
          color: "#666",
          height: "60px",
          backgroundColor: "transparent",
        };
      case "section":
        return {
          position: "absolute",
          width: "100%",
          padding: "20px",
          margin: "20px 0",
          backgroundColor: "#f9f9f9",
          border: "1px solid #e5e5e5",
          borderRadius: "8px",
        };
      default:
        return base;
    }
  };

  const addElement = (type, options) => {
    const elementId = `${type}-${Date.now()}`;
    const defaultStyles = getDefaultStyles(type);

    const newElement = {
      id: elementId,
      type,
      content: getDefaultContent(type),
      styles: {
        ...defaultStyles,
        left: options.left || "50px",
        top: options.top || "50px",
        ...options.styles,
      },
      link: type === "button" ? options.link : undefined,
      icons:
        type === "social"
          ? options.icons || [
              { id: 1, platform: "facebook", url: "https://facebook.com" },
              { id: 2, platform: "twitter", url: "https://twitter.com" },
              { id: 3, platform: "instagram", url: "https://instagram.com" },
            ]
          : undefined,
      children: options.children || undefined,
    };

    if (type === "section" && options.children) {
      newElement.children = options.children;
      newElement.styles = {
        ...defaultStyles,
        ...options.styles,
      };
    }

    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(elementId);
  };

  const updateElement = (id, updates) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          return {
            ...el,
            ...updates,
            styles: {
              ...el.styles,
              ...updates.styles,
            },
          };
        }
        return el;
      })
    );
  };

  const updateElementStyle = (id, styleUpdates) => {
    updateElement(id, { styles: styleUpdates });
  };

  const handleImageUpload = async (id, file) => {
    if (!file || !file.type.startsWith("image")) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "newsletter");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        updateElement(id, { content: data.secure_url });
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
    }
  };

  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const duplicateElement = (id) => {
    setElements((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;

      const original = prev[index];
      const copy = {
        ...original,
        id: `${original.type}-${Date.now()}`,
        styles: {
          ...original.styles,
          left: `${parseFloat(original.styles?.left || 0) + 20}px`,
          top: `${parseFloat(original.styles?.top || 0) + 20}px`,
        },
      };

      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
    });
  };

  const handleDragStart = (e, id) => {
    const index = elements.findIndex((el) => el.id === id);
    if (index === -1) return;
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, id) => {
    const newIndex = elements.findIndex((el) => el.id === id);
    if (dragItem.current === null || dragItem.current === newIndex) return;

    setElements((prev) => {
      const newList = [...prev];
      const draggedItem = newList[dragItem.current];
      newList.splice(dragItem.current, 1);
      newList.splice(newIndex, 0, draggedItem);
      dragItem.current = newIndex;
      return newList;
    });
  };

  const handleDragEnd = () => {
    dragItem.current = null;
  };

  const saveNewsletter = () => {
    const data = {
      name: newsletterName,
      elements,
      globalSettings,
      lastSaved: new Date().toISOString(),
    };

    console.log("Saving:", data);
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 2000);
  };

  const copyShareLink = async () => {
    try {
      const dataToShare = {
        name: newsletterName,
        elements,
        globalSettings,
      };

      // Upload JSON to Cloudinary
      const urlOnCloudinary = await saveToCloudinary(dataToShare);

      // Create a share link with template param
      const url = `${window.location.origin}${
        window.location.pathname
      }?template=${encodeURIComponent(urlOnCloudinary)}`;

      await navigator.clipboard.writeText(url);
      showMessage("Share link copied to clipboard!");
    } catch {
      showMessage("Error creating share link.");
    }
  };

  const prepareForExport = () => {
    exportLinkRects = [];

    if (!canvasRef.current) {
      console.error("Canvas element not found.");
      return null;
    }

    const exportContainer = document.createElement("div");
    exportContainer.style.cssText = `
      width: ${globalSettings.maxWidth || "600px"};
      min-height: ${globalSettings.minHeight || "800px"};
      background-color: ${globalSettings.newsletterColor || "#ffffff"};
      font-family: ${globalSettings.fontFamily || "Arial, sans-serif"};
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      position: relative;
      overflow: visible;
      border: none;
      outline: none;
      box-shadow: none;
      transform: none;
      transform-origin: top left;
    `;

    elements.forEach((element) => {
      const elementDiv = createExportElement(element);
      if (elementDiv) {
        if (element.styles?.position === "absolute") {
          elementDiv.style.position = "absolute";
          elementDiv.style.left = element.styles.left || "0px";
          elementDiv.style.top = element.styles.top || "0px";
          if (element.styles?.width)
            elementDiv.style.width = element.styles.width;
          if (element.styles?.height)
            elementDiv.style.height = element.styles.height;
        }
        exportContainer.appendChild(elementDiv);
      }
    });

    normalizeLayoutTransforms(exportContainer);

    return exportContainer;
  };

  const buildSpacing = (styles, property) => {
    const top = styles[`${property}Top`] || "0px";
    const right = styles[`${property}Right`] || "0px";
    const bottom = styles[`${property}Bottom`] || "0px";
    const left = styles[`${property}Left`] || "0px";

    if (top === right && right === bottom && bottom === left) {
      return top;
    }
    return `${top} ${right} ${bottom} ${left}`;
  };

  const getBorderStyles = (elementStyles) => {
    if (
      elementStyles?.borderWidth &&
      elementStyles?.borderColor &&
      elementStyles?.borderStyle
    ) {
      return `${elementStyles.borderWidth} ${elementStyles.borderStyle} ${elementStyles.borderColor}`;
    }
    return elementStyles?.border || "none";
  };

  const createExportElement = (element) => {
    const div = document.createElement("div");
    const styles = element.styles || {};

    const imageRotation = extractRotation(styles.transform || styles.rotate);
    const elementScale = extractScale(styles.transform || styles.scale);

    div.style.cssText = `
      position: absolute;
      left: ${styles.left || "0px"};
      top: ${styles.top || "0px"};
      width: ${styles.width || "auto"};
      height: ${styles.height || "auto"};
      margin: 0;
      padding: 0;
      background: transparent;
      border: none;
      box-shadow: none;
      box-sizing: border-box;
    `;
    stripLayoutTransforms(div);

    switch (element.type) {
      case "shape": {
        const shapeType = styles?.shapeType || "rectangle";
        const shapeWidth = parseInt(styles?.width) || 200;
        const shapeHeight = parseInt(styles?.height) || 200;

        const isPoly = isPolygonShape(shapeType);
        const shapeRadius = getShapeBorderRadius(shapeType, styles);
        const shapeClip = getShapeClipPath(shapeType);

        div.style.width = `${shapeWidth}px`;
        div.style.height = `${shapeHeight}px`;
        div.style.background = "transparent";
        div.style.boxSizing = "border-box";
        div.style.transform = "none";
        div.style.transformOrigin = "top left";

        const getFillStyle = () => {
          const fillType = styles?.fillType || "solid";
          switch (fillType) {
            case "linear":
              return `linear-gradient(${styles?.gradientDirection || "0deg"}, ${
                styles?.gradientStartColor || "#3b82f6"
              }, ${styles?.gradientEndColor || "#1e40af"})`;
            case "radial":
              return `radial-gradient(circle, ${
                styles?.gradientStartColor || "#3b82f6"
              }, ${styles?.gradientEndColor || "#1e40af"})`;
            case "none":
              return "transparent";
            default:
              return styles?.backgroundColor || "#3b82f6";
          }
        };

        const getBorderStyles = (s) => {
          if (parseInt(s?.borderWidth) > 0) {
            return `${s.borderWidth} ${s.borderStyle || "solid"} ${
              s.borderColor || "#000"
            }`;
          }
          return "none";
        };

        const container = document.createElement("div");
        container.style.cssText = `
          position: relative;
          width: ${shapeWidth}px;
          height: ${shapeHeight}px;
          display: block;
          margin: ${buildSpacing(styles, "margin") || "0"};
          padding: ${buildSpacing(styles, "padding") || "0"};
          box-sizing: border-box;
          opacity: ${styles?.opacity || "1"};
        `;

        const shapeDiv = document.createElement("div");

        shapeDiv.style.cssText = `
          width: ${shapeWidth}px;
          height: ${shapeHeight}px;
          background: ${getFillStyle()};
          ${isPoly ? "clip-path:" + shapeClip + ";" : "clip-path:none;"} 
          ${
            isPoly
              ? "-webkit-clip-path:" + shapeClip + ";"
              : "-webkit-clip-path:none;"
          }
          ${
            !isPoly
              ? "border-radius:" + shapeRadius + ";"
              : "border-radius:0px;"
          }
          border: ${getBorderStyles(styles)};
          box-shadow: ${styles?.boxShadow || "none"};
          box-sizing: border-box;
        `;

        container.appendChild(shapeDiv);
        stripLayoutTransforms(container);
        div.appendChild(container);
        break;
      }

      case "header":
        const header = document.createElement("h2");
        header.textContent = element.content || "Header";
        const headerWeight = normalizeWeight(styles.fontWeight);
        header.style.cssText = `
          position: absolute;
          left: 0;
          top: 0;
          margin: 0;
          padding: ${buildSpacing(styles, "padding") || "0"};
          font-size: ${styles.fontSize || "28px"};
          font-weight: ${headerWeight};
          font-variation-settings: "wght" ${headerWeight};
          color: ${styles.color || "#1a1a1a"};
          text-align: ${styles.textAlign || "left"};
          line-height: ${styles.lineHeight || "1.4"};
          width: ${styles.width || "auto"};
          height: ${styles.height || "auto"};
          background-color: ${styles.backgroundColor || "transparent"};
          display: block;
          border-radius: ${composeCornerRadius(styles, "0")};
          border: ${getBorderStyles(styles)};
          box-shadow: ${styles.boxShadow || "none"};
          opacity: ${styles.opacity || "1"};
          font-family: ${
            styles.fontFamily ||
            globalSettings.fontFamily ||
            "Arial, sans-serif"
          };
          box-sizing: border-box;
          white-space: pre-wrap;
          font-style: ${styles.fontStyle || "normal"};
          text-decoration: ${styles.textDecoration || "none"};
          text-shadow: ${styles.textShadow || "none"};
          letter-spacing: ${styles.letterSpacing || "normal"};
          word-spacing: ${styles.wordSpacing || "normal"};
          text-indent: ${styles.textIndent || "0"};
          text-transform: ${styles.textTransform || "none"};
        `;
        stripLayoutTransforms(header);
        div.appendChild(header);
        break;

      case "text":
        const text = document.createElement("div");
        text.textContent = element.content || "Text content";
        const textWeight = normalizeWeight(styles.fontWeight);
        text.style.cssText = `
          position: absolute;
          left: 0;
          top: 0;
          margin: 0;
          padding: ${buildSpacing(styles, "padding") || "0"};
          font-size: ${styles.fontSize || "16px"};
          font-weight: ${textWeight};
          font-variation-settings: "wght" ${textWeight};
          color: ${styles.color || "#333333"};
          line-height: ${styles.lineHeight || "1.6"};
          text-align: ${styles.textAlign || "left"};
          width: ${styles.width || "auto"};
          height: ${styles.height || "auto"};
          background-color: ${styles.backgroundColor || "transparent"};
          display: block;
          border-radius: ${composeCornerRadius(styles, "0")};
          border: ${getBorderStyles(styles)};
          box-shadow: ${styles.boxShadow || "none"};
          opacity: ${styles.opacity || "1"};
          font-family: ${
            styles.fontFamily ||
            globalSettings.fontFamily ||
            "Arial, sans-serif"
          };
          box-sizing: border-box;
          white-space: pre-wrap;
          font-style: ${styles.fontStyle || "normal"};
          text-decoration: ${styles.textDecoration || "none"};
          text-shadow: ${styles.textShadow || "none"};
          letter-spacing: ${styles.letterSpacing || "normal"};
          word-spacing: ${styles.wordSpacing || "normal"};
          text-indent: ${styles.textIndent || "0"};
          text-transform: ${styles.textTransform || "none"};
          vertical-align: ${styles.verticalAlign || "baseline"};
        `;
        stripLayoutTransforms(text);
        div.appendChild(text);
        break;

      case "button":
        const buttonLink = document.createElement("a");
        buttonLink.textContent = element.content || "Button";
        buttonLink.href = element.link || "#";
        const buttonWeight = normalizeWeight(styles.fontWeight);
        buttonLink.style.cssText = `
          display: inline-block;
          background-color: ${styles.backgroundColor || "#007bff"};
          color: ${styles.color || "#ffffff"};
          padding: ${buildSpacing(styles, "padding") || "12px 24px"};
          margin: ${buildSpacing(styles, "margin") || "0"};
          text-decoration: none;
          border-radius: ${composeCornerRadius(styles, "6px")};
          font-size: ${styles.fontSize || "16px"};
          font-weight: ${buttonWeight};
          font-variation-settings: "wght" ${buttonWeight};
          font-style: ${styles.fontStyle || "normal"};
          border: ${getBorderStyles(styles)};
          text-align: center;
          box-shadow: ${styles.boxShadow || "none"};
          opacity: ${styles.opacity || "1"};
          box-sizing: border-box;
          line-height: ${styles.lineHeight || "1.4"};
          font-family: ${
            styles.fontFamily ||
            globalSettings.fontFamily ||
            "Arial, sans-serif"
          };
          cursor: pointer;
          text-shadow: ${styles.textShadow || "none"};
          letter-spacing: ${styles.letterSpacing || "normal"};
          text-transform: ${styles.textTransform || "none"};
          vertical-align: ${styles.verticalAlign || "middle"};
          transition: ${styles.transition || "none"};
        `;
        stripLayoutTransforms(buttonLink);
        div.appendChild(buttonLink);

        const pad = (val, fallback = "0px") =>
          parseFloat((val || fallback).toString());
        const padTop = pad(styles.paddingTop, "12px");
        const padRight = pad(styles.paddingRight, "24px");
        const padBottom = pad(styles.paddingBottom, "12px");
        const padLeft = pad(styles.paddingLeft, "24px");
        const fontSize = pad(styles.fontSize, "16px");

        const text1 = element.content || "Button";
        const charW = fontSize * 0.6;
        const textW = Math.max(40, text1.length * charW);
        const widthPx =
          parseFloat(styles.width || textW + padLeft + padRight) || 150;
        const heightPx =
          parseFloat(styles.height || fontSize + padTop + padBottom) || 40;

        const leftPx = parseFloat(styles.left || "0");
        const topPx = parseFloat(styles.top || "0");
        pushLinkRect(buttonLink.href, leftPx, topPx, widthPx, heightPx);
        break;

      case "image": {
        if (
          element.content &&
          (element.content.startsWith("data:") ||
            element.content.startsWith("http"))
        ) {
          const imgContainer = document.createElement("div");
          const img = document.createElement("img");

          const shapeType = styles?.shapeType || "rectangle";
          const isPoly = isPolygonShape(shapeType);
          const imgRadius = getShapeBorderRadius(shapeType, styles);
          const imgClip = getShapeClipPath(shapeType);

          imgContainer.style.cssText = `
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: ${getBorderStyles(styles)};
            box-shadow: ${styles.boxShadow || "none"};
            opacity: ${styles.opacity || "1"};
            padding: ${buildSpacing(styles, "padding") || "0"};
            margin: ${buildSpacing(styles, "margin") || "0"};
            box-sizing: border-box;
            ${isPoly ? "clip-path:" + imgClip + ";" : "clip-path:none;"}
            ${
              isPoly
                ? "-webkit-clip-path:" + imgClip + ";"
                : "-webkit-clip-path:none;"
            }
            ${
              !isPoly
                ? "border-radius:" + imgRadius + ";"
                : "border-radius:0px;"
            }
          `;

          img.src = element.content;
          img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: ${styles.objectFit || "cover"};
            display: block;
            filter: ${styles.filter || "none"};
            backdrop-filter: ${styles.backdropFilter || "none"};
            ${
              imageRotation
                ? `transform: rotate(${imageRotation}deg) scale(${
                    elementScale || 1
                  });`
                : ""
            }
            transform-origin: center center;
          `;

          imgContainer.appendChild(img);
          div.appendChild(imgContainer);
        } else {
          div.style.backgroundColor = "#f5f5f5";
          div.style.border = "1px dashed #ccc";
          div.style.display = "flex";
          div.style.alignItems = "center";
          div.style.justifyContent = "center";
          div.style.color = "#999";
          div.style.fontSize = "14px";
          div.style.borderRadius = composeCornerRadius(styles, "0");
          div.style.boxShadow = styles.boxShadow || "none";
          div.style.fontFamily =
            styles.fontFamily ||
            globalSettings.fontFamily ||
            "Arial, sans-serif";
          div.textContent = "Image Placeholder";
        }
        break;
      }

      case "divider":
        div.style.backgroundColor = styles.backgroundColor || "#d1d5db";
        div.style.borderRadius = composeCornerRadius(styles, "0");
        div.style.boxShadow = styles.boxShadow || "none";
        div.style.height = styles.height || "2px";
        div.style.width = "100%";
        div.style.opacity = styles.opacity || "1";
        div.style.margin = buildSpacing(styles, "margin") || "0";
        div.style.padding = buildSpacing(styles, "padding") || "0";
        div.style.filter = styles.filter || "none";

        if (styles.borderBottomWidth || styles.borderWidth) {
          div.style.borderBottom = `${
            styles.borderBottomWidth || styles.borderWidth || "2px"
          } ${styles.borderBottomStyle || styles.borderStyle || "solid"} ${
            styles.borderColor || styles.backgroundColor || "#d1d5db"
          }`;
        }

        if (element.content) {
          const dividerText = document.createElement("span");
          dividerText.textContent = element.content;
          const dividerWeight = normalizeWeight(styles.fontWeight);
          dividerText.style.cssText = `
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            background-color: ${
              styles.labelBackgroundColor ||
              globalSettings.newsletterColor ||
              "#ffffff"
            };
            padding: 0 12px;
            font-size: ${styles.fontSize || "14px"};
            font-weight: ${dividerWeight};
            font-variation-settings: "wght" ${dividerWeight};
            color: ${styles.color || "#666"};
            font-style: ${styles.fontStyle || "normal"};
            border-radius: ${composeCornerRadius(styles, "0")};
            font-family: ${
              styles.fontFamily ||
              globalSettings.fontFamily ||
              "Arial, sans-serif"
            };
            display: inline-block;
            text-shadow: ${styles.textShadow || "none"};
            letter-spacing: ${styles.letterSpacing || "normal"};
          `;
          stripLayoutTransforms(dividerText);
          div.appendChild(dividerText);
        }
        break;

      case "social":
        div.style.textAlign = styles.textAlign || "center";
        div.style.backgroundColor =
          styles.backgroundColor && styles.backgroundColor !== "transparent"
            ? styles.backgroundColor
            : "transparent";
        div.style.borderRadius = composeCornerRadius(styles, "0");
        div.style.boxShadow = styles.boxShadow || "none";
        div.style.opacity = styles.opacity || "1";
        div.style.border = getBorderStyles(styles);
        div.style.fontFamily =
          styles.fontFamily || globalSettings.fontFamily || "Arial, sans-serif";
        div.style.padding = buildSpacing(styles, "padding") || "0";
        div.style.margin = buildSpacing(styles, "margin") || "0";
        div.style.filter = styles.filter || "none";

        if (element.icons && element.icons.length > 0) {
          const iconsContainer = document.createElement("div");
          iconsContainer.style.cssText = `
            display: flex;
            gap: ${styles.gap || "12px"};
            justify-content: ${
              styles.textAlign === "left"
                ? "flex-start"
                : styles.textAlign === "right"
                ? "flex-end"
                : "center"
            };
            align-items: center;
            height: 100%;
            width: 100%;
          `;
          stripLayoutTransforms(iconsContainer);

          const gapPx = parseFloat((styles.gap || "12px").toString());
          const iconSize = 24;
          const iconBox = 28;
          const containerWidth = parseFloat(styles.width || "300") || 300;
          const iconsCount = element.icons.length;
          const totalWidth = iconsCount * iconBox + (iconsCount - 1) * gapPx;

          let offsetX = 0;
          const align = (styles.textAlign || "center").toLowerCase();
          if (align === "center")
            offsetX = Math.max(0, (containerWidth - totalWidth) / 2);
          if (align === "right")
            offsetX = Math.max(0, containerWidth - totalWidth);

          const baseLeft = parseFloat(styles.left || "0");
          const baseTop = parseFloat(styles.top || "0");

          element.icons.forEach((icon, i) => {
            const info = SOCIAL_SVGS[icon.platform?.toLowerCase()];
            const link = document.createElement("a");
            link.href = icon.url || "#";
            link.style.cssText = `
              display: inline-flex;
              width: ${iconBox}px;
              height: ${iconBox}px;
              align-items: center;
              justify-content: center;
              text-decoration: none;
              border: none;
              background: transparent;
              transition: ${styles.transition || "opacity 0.2s"};
            `;
            stripLayoutTransforms(link);

            if (info) {
              const svg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              );
              svg.setAttribute("viewBox", info.viewBox);
              svg.setAttribute("width", iconSize.toString());
              svg.setAttribute("height", iconSize.toString());

              const path = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              path.setAttribute("d", info.path);
              path.setAttribute(
                "fill",
                styles.iconColor || styles.color || "#666"
              );

              svg.appendChild(path);
              link.appendChild(svg);
            } else {
              const iconWeight = normalizeWeight(styles.fontWeight);
              link.textContent = icon.platform?.charAt(0).toUpperCase();
              link.style.color = styles.iconColor || styles.color || "#666";
              link.style.fontSize = "16px";
              link.style.lineHeight = `${iconSize}px`;
              link.style.fontFamily =
                styles.fontFamily ||
                globalSettings.fontFamily ||
                "Arial, sans-serif";
              link.style.fontWeight = iconWeight.toString();
              link.style.fontVariationSettings = `"wght" ${iconWeight}`;
            }

            iconsContainer.appendChild(link);

            const x = baseLeft + offsetX + i * (iconBox + gapPx);
            const y =
              baseTop +
              Math.max(0, (parseFloat(styles.height || "28") - iconBox) / 2);
            pushLinkRect(icon.url, x, y, iconBox, iconBox);
          });

          div.appendChild(iconsContainer);
        }
        break;

      case "section":
        div.style.backgroundColor = styles.backgroundColor || "#f9f9f9";
        div.style.border = getBorderStyles(styles) || "1px solid #e5e5e5";
        div.style.borderRadius = composeCornerRadius(styles, "8px");
        div.style.padding = buildSpacing(styles, "padding") || "20px";
        div.style.margin = buildSpacing(styles, "margin") || "20px 0";
        div.style.boxShadow = styles.boxShadow || "none";
        div.style.opacity = styles.opacity || "1";
        div.style.width = styles.width || "100%";
        div.style.fontFamily =
          styles.fontFamily || globalSettings.fontFamily || "Arial, sans-serif";
        div.style.filter = styles.filter || "none";
        div.style.backdropFilter = styles.backdropFilter || "none";

        if (element.children && element.children.length > 0) {
          element.children.forEach((child) => {
            const childElement = createExportElement(child);
            if (childElement) {
              childElement.style.position = "relative";
              childElement.style.marginBottom = "16px";
              div.appendChild(childElement);
            }
          });
        }
        break;

      default:
        return null;
    }

    return div;
  };

  const downloadAsImage = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setIsExportingPng(true);
    try {
      await ensureFontsLoaded();

      const elementToDownload = prepareForExport();
      if (!elementToDownload) return;

      elementToDownload.style.position = "absolute";
      elementToDownload.style.left = "-9999px";
      elementToDownload.style.top = "0";
      elementToDownload.style.zIndex = "-1";
      document.body.appendChild(elementToDownload);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const dataUrl = await domToImage.toPng(elementToDownload, {
        quality: 1,
        bgcolor: globalSettings.newsletterColor || "#ffffff",
        width: parseInt(globalSettings.maxWidth || "600"),
        height: elementToDownload.scrollHeight,
        style: {
          transformOrigin: "top left",
          backgroundColor: globalSettings.newsletterColor || "#ffffff",
        },
        filter: (node) => {
          return !node?.dataset?.noExport;
        },
        imagePlaceholder:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=",
      });

      document.body.removeChild(elementToDownload);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${newsletterName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showMessage("PNG exported successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      showMessage("Failed to generate image. Please try again.");
    } finally {
      setIsExporting(false);
      setIsExportingPng(false);
    }
  };

  const downloadAsPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setIsExportingPdf(true);
    try {
      await ensureFontsLoaded();

      const elementToDownload = prepareForExport();
      if (!elementToDownload) return;

      Object.assign(elementToDownload.style, {
        position: "absolute",
        left: "-9999px",
        top: "0",
        zIndex: "-1",
        border: "none",
        outline: "none",
        boxShadow: "none",
      });
      document.body.appendChild(elementToDownload);

      await new Promise((r) => setTimeout(r, 1200));

      const widthPx = parseInt(globalSettings.maxWidth || "600");
      const heightPx = elementToDownload.scrollHeight;

      const dataUrl = await domToImage.toPng(elementToDownload, {
        quality: 1,
        bgcolor: globalSettings.newsletterColor || "#ffffff",
        width: widthPx,
        height: heightPx,
        style: {
          transformOrigin: "top left",
          backgroundColor: globalSettings.newsletterColor || "#ffffff",
        },
        filter: (node) => {
          return !node?.dataset?.noExport;
        },
        imagePlaceholder:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=",
      });

      document.body.removeChild(elementToDownload);

      const pdf = new jsPDF({
        orientation: widthPx >= heightPx ? "landscape" : "portrait",
        unit: "px",
        format: [widthPx, heightPx],
        compress: true,
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, widthPx, heightPx, undefined, "FAST");

      exportLinkRects.forEach(({ href, x, y, width, height }) => {
        if (!href || href === "#") return;
        try {
          pdf.link(x, y, width, height, { url: href });
        } catch (e) {
          console.warn("Failed to add PDF link:", e);
        }
      });

      pdf.save(
        `${newsletterName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`
      );
      showMessage("PDF exported successfully!");
    } catch (error) {
      console.error("Error generating PDF with links:", error);
      showMessage("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-gray-50 to-white border-b-2 border-gray-300 px-6 py-4 flex items-center justify-between shadow-lg">
        {/* Newsletter Name Input */}
        <div className="flex-1 max-w-md relative group">
          <input
            type="text"
            value={newsletterName}
            onChange={(e) => setNewsletterName(e.target.value)}
            className="text-xl font-bold bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 w-full pr-12 transition-all duration-300"
            placeholder="Untitled Newsletter"
          />
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-0 group-focus-within:w-full transition-all duration-500 absolute bottom-0 left-0 rounded-full"></div>

          <button
            onClick={() =>
              document
                .querySelector('input[placeholder="Untitled Newsletter"]')
                .focus()
            }
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 rounded-full hover:bg-blue-50"
            aria-label="Edit Newsletter Name"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.464.263l-4 1a1 1 0 01-1.213-1.213l1-4a1 1 0 01.263-.464l9.9-9.9a2 2 0 012.828 0zM15.121 4.05L14 2.93l-1.414 1.414 1.121 1.121 1.414-1.414zM13.707 5.464L12.586 4.343 3.414 13.515l-.707 2.828 2.828-.707 9.172-9.172z" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <header className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md rounded-xl p-3 border border-blue-100">
            <nav className="flex items-center gap-3">
              <Link
                to="/templates"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Templates
              </Link>
              <Link
                to="/saved"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Saved Templates
              </Link>
            </nav>
          </header>

          {/* Save/Update Template Button */}
          <button
            onClick={saveOrUpdateTemplate}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              isSaving
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : currentTemplateId
                ? "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white hover:from-amber-600 hover:via-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105 ring-2 ring-amber-200 hover:ring-amber-300"
                : "bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 ring-2 ring-indigo-200 hover:ring-indigo-300"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            {isSaving 
              ? "Saving..." 
              : currentTemplateId 
              ? "Update Template" 
              : "Save Template"
            }
          </button>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* View Toggle Buttons */}
          <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-1.5 shadow-inner">
            <button
              onClick={() => setActiveView("editor")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeView === "editor"
                  ? "bg-white text-blue-600 shadow-md ring-2 ring-blue-100 transform scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
              }`}
            >
              <MousePointer className="w-4 h-4" />
              Editor
            </button>

            <button
              onClick={() => setActiveView("preview")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeView === "preview"
                  ? "bg-white text-blue-600 shadow-md ring-2 ring-blue-100 transform scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          {/* Export & Share Actions */}
          {activeView === "preview" && (
            <div className="flex items-center gap-3">
              {/* Export Buttons */}
              <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 shadow-inner gap-1">
                <button
                  onClick={downloadAsPdf}
                  disabled={isExportingPdf}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isExportingPdf
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  {isExportingPdf ? "Exporting..." : "PDF"}
                </button>

                <button
                  onClick={downloadAsImage}
                  disabled={isExportingPng}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isExportingPng
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  {isExportingPng ? "Exporting..." : "PNG"}
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={async () => {
                  setIsSharing(true);
                  try {
                    await copyShareLink();
                  } finally {
                    setIsSharing(false);
                  }
                }}
                disabled={isSharing}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isSharing
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 text-white hover:from-purple-600 hover:via-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-110 ring-2 ring-purple-200 hover:ring-purple-300"
                }`}
              >
                <Share2 className="w-4 h-4" />
                {isSharing ? "Sharing..." : "Share"}
              </button>
            </div>
          )}

          {/* Export HTML Button */}
          <button
            onClick={async () => {
              setIsExportingHtml(true);
              try {
                const html = exportToEmailHtml({
                  elements,
                  globalSettings,
                  newsletterName,
                });
                await navigator.clipboard.writeText(html);
                showMessage("Email HTML copied to clipboard!");
              } finally {
                setIsExportingHtml(false);
              }
            }}
            disabled={isExportingHtml}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              isExportingHtml
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 ring-2 ring-yellow-200 hover:ring-yellow-300"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            {isExportingHtml ? "Exporting..." : "Export HTML"}
          </button>
        </div>
      </div>

      {/* Save Alert */}
      {showSaveAlert && (
        <div className="fixed top-20 right-6 z-50 bg-green-50 border border-green-200 text-green-800 p-3 rounded shadow-lg">
          Newsletter saved successfully!
        </div>
      )}
      
      {/* Message */}
      {message && (
        <div className="fixed top-20 right-6 z-50 bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded shadow-lg">
          {message}
        </div>
      )}
      
      {/* Main Editor */}
      <div className="flex flex-1 overflow-hidden">
        {activeView === "editor" && (
          <EditorSidebar
            globalSettings={globalSettings}
            setGlobalSettings={setGlobalSettings}
            elements={elements}
            addElement={addElement}
            selectedElement={elements.find((el) => el.id === selectedElementId)}
            updateElement={updateElement}
            updateElementStyle={updateElementStyle}
            handleImageUpload={handleImageUpload}
            deleteElement={deleteElement}
          />
        )}

        <EditorCanvas
          key={`canvas-${elements.length}-${JSON.stringify(globalSettings)}`}
          ref={canvasRef}
          elements={elements}
          activeView={activeView}
          selectedElementId={selectedElementId}
          setSelectedElementId={setSelectedElementId}
          handleDragStart={handleDragStart}
          handleDragEnter={handleDragEnter}
          handleDragEnd={handleDragEnd}
          deleteElement={deleteElement}
          duplicateElement={duplicateElement}
          globalSettings={globalSettings}
          updateElement={updateElement}
          handleImageUpload={handleImageUpload}
          addElement={addElement}
          preservePositions={true}
        />
      </div>
    </div>
  );
}