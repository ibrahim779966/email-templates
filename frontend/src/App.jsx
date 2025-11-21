import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import EmailNewsletterEditor from "./components/EmailNewsletterEditor";
import TemplateGallerySaved from "./components/SavedTemplates";
import Notifications from "./components/Notifications";
import TemplateGallery2 from "./components/TemplateGalllery2";

export default function App() {
  return (
    <BrowserRouter>
      <Notifications /> {/* ADD THIS - It will show notifications globally */}
      <div className="min-h-screen bg-gray-50">
        <main>
          <Routes>
            {/* Route for the main editor page */}
            <Route path="/" element={<EmailNewsletterEditor />} />

            {/* Route for the new template gallery page */}
           
            <Route path="/gallery" element={<TemplateGallery2 />} />
            {/* Route for the new template gallery page */}
            <Route path="/saved" element={<TemplateGallerySaved />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
