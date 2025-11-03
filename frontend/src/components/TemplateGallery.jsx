//TemplateGallery.jsx
import React, { useState } from "react";

const templatesData = [
  {
    category: "Real Estate",
    color: "bg-green-500",
    templates: [
      {
        title: "New Property Listing (Email)",
        type: "email",
        placeholderUrl: "/NewProperty.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1758865040%2Fnewsletter_1758865041034",
      },
      {
        title: "Limited-Time Offer (Email)",
        type: "email",
        placeholderUrl: "/LimitedTimeOffer1.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759128968%2Fnewsletter_1759128967504",
      },
      {
        title: "Monthly Newsletter (Email)",
        type: "email",
        placeholderUrl: "/MonthlyNewsletter.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1758868499%2Fnewsletter_1758868500757",
      },
      {
        title: "Monthly Newsletter (Email)",
        type: "email",
        placeholderUrl: "/MonthlyNewsletter2.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759140278%2Fnewsletter_1759140278076",
      },
      // { title: "Quick Offer Alert (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/dcfce7/4338ca?text=Quick+Offer", link: "#" },
      // { title: "Site Visit Reminder (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/bbf7d0/4338ca?text=Site+Visit", link: "#" },
    ],
  },
  {
    category: "Financial Services",
    color: "bg-indigo-500",
    templates: [
      {
        title: "Product Promo (Email)",
        type: "email",
        placeholderUrl: "/Financial_Services_ProductPromo.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759127286%2Fnewsletter_1759127285080",
      },
      {
        title: "Educational Drip Campaign (Email)",
        type: "email",
        placeholderUrl: "/Financial_Services_EducationDrip.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759217959%2Fnewsletter_1759217958602",
      },
      {
        title: "Payment Reminder (Email)",
        type: "email",
        placeholderUrl: "/Financial_Services_PaymentReminder.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759312040%2Fnewsletter_1759312042153",
      },
      // { title: "KYC/Payment Reminder (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/e0e7ff/4338ca?text=KYC+Reminder", link: "#" },
      // { title: "New Product Alert (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/bfdbfe/4338ca?text=New+Product+Alert", link: "#" },
    ],
  },
  {
    category: "Healthcare & Wellness",
    color: "bg-teal-500",
    templates: [
      {
        title: "Health Camp Invite (Email)",
        type: "email",
        placeholderUrl: "/Healthcare_&_ Wellness_HealthCampInvite1.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759476484%2Fnewsletter_1759476483433",
      },
      // { title: "Health Camp Invite (Email)", type: "email", placeholderUrl: "https://placehold.co/400x300/ccfbf1/0f766e?text=Health+Camp", link: "https://email-newsletter-rcg1wxpu5-rohitgawandeleadmasters-projects.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1758539939%2Fnewsletter_1758539939142" },
      // { title: "Health Camp Invite (Email)", type: "email", placeholderUrl: "https://placehold.co/400x300/ccfbf1/0f766e?text=Health+Camp", link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1758539939%2Fnewsletter_1758539939142" },
      {
        title: "Service Promotion (Email)",
        type: "email",
        placeholderUrl: "/Healthcare_&_ Wellness_ServicePromotion1.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759728470%2Fnewsletter_1759728468910",
      },
      {
        title: "Service Promotion (Email)",
        type: "email",
        placeholderUrl: "/Healthcare_&_ Wellness_ServicePromotion2.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759636279%2Fnewsletter_1759636277220",
      },
      {
        title: "Wellness Newsletter (Email)",
        type: "email",
        placeholderUrl: "/Healthcare_&_ Wellness_Newsletter.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759586049%2Fnewsletter_1759586044997",
      },
      // { title: "Appointment Reminder (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/c7f6f1/4338ca?text=Appointment+Reminder", link: "#" },
      // { title: "Lab/Test Result Updates (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/a8f0ed/4338ca?text=Lab+Results", link: "#" },
    ],
  },
  {
    category: "Education & Training",
    color: "bg-blue-500",
    templates: [
      {
        title: "Course Enrollment (Email)",
        type: "email",
        placeholderUrl: "/Education_&_ Training_CourseEnrollement.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759744598%2Fnewsletter_1759744597020",
      },
      {
        title: "Open House/Webinar Invite (Email)",
        type: "email",
        placeholderUrl: "/Education_&_ Training_WebinarInvite.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759753750%2Fnewsletter_1759753750171",
      },
      {
        title: "Student Success Story (Email)",
        type: "email",
        placeholderUrl: "/Education_&_ Training_StudentSuccess.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759821166%2Fnewsletter_1759821167445",
      },
      // { title: "Inquiry Follow-up (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/e0e7ff/4338ca?text=Inquiry+Followup", link: "#" },
      // { title: "Webinar Reminder (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/bfdbfe/4338ca?text=Webinar+Reminder", link: "#" },
    ],
  },
  {
    category: "Retail & E-commerce",
    color: "bg-red-500",
    templates: [
      {
        title: "Promo Offer (Email)",
        type: "email",
        placeholderUrl: "/Retail_&_E-commerce_PromoOffer.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759898229%2Fnewsletter_1759898228215",
      },
      {
        title: "New Arrivals (Email)",
        type: "email",
        placeholderUrl: "/Retail_&_E-commerce_NewArrivals.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759916701%2Fnewsletter_1759916700715",
      },
      {
        title: "Abandoned Cart Reminder (Email)",
        type: "email",
        placeholderUrl: "/Retail_&_E-commerce_AbandonedCart.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759924138%2Fnewsletter_1759924137893",
      },
      // { title: "Flash Sale Alert (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/fecdd3/4338ca?text=Flash+Sale+Alert", link: "#" },
      // { title: "Product Catalog Showcase (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/fbcfe8/4338ca?text=Product+Catalog", link: "#" },
    ],
  },
  {
    category: "Travel & Hospitality",
    color: "bg-cyan-500",
    templates: [
      {
        title: "Tour Package Promo (Email)",
        type: "email",
        placeholderUrl: "/Travel_&_Hospitality_TourPackage.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1759995737%2Fnewsletter_1759995736788",
      },
      {
        title: "Personalized Offers (Email)",
        type: "email",
        placeholderUrl: "/Travel_&_Hospitality_PersnalizedOffer.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760012743%2Fnewsletter_1760012743452",
      },
      {
        title: "Booking Confirmation (Email)",
        type: "email",
        placeholderUrl: "/Travel_&_Hospitality_BookingConformation1.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760076931%2Fnewsletter_1760076930240",
      },
      {
        title: "Booking Confirmation (Email)",
        type: "email",
        placeholderUrl: "/Travel_&_Hospitality_BookingConformation2.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760080626%2Fnewsletter_1760080625244",
      },
      // { title: "Reservation Confirm (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/cffafe/4338ca?text=Reservation+Confirm", link: "#" },
      // { title: "Flight/Trip Reminder (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/a5f3fc/4338ca?text=Flight+Reminder", link: "#" },
    ],
  },
  {
    category: "Technology & SaaS",
    color: "bg-purple-500",
    templates: [
      {
        title: "Product Demo Invite (Email)",
        type: "email",
        placeholderUrl: "/Technology_&_SaaS_ProductDemo.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760099165%2Fnewsletter_1760099164182",
      },
      {
        title: "Case Study/Whitepaper (Email)",
        type: "email",
        placeholderUrl: "/Technology_&_SaaS_CaseStudy.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760340366%2Fnewsletter_1760340367633",
      },
      {
        title: "Onboarding Series (Email)",
        type: "email",
        placeholderUrl: "/Technology_&_SaaS_OnboradingSeries.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760419422%2Fnewsletter_1760419424697",
      },
      // { title: "Trial Signup Follow-up (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/f3e8ff/4338ca?text=Trial+Followup", link: "#" },
      // { title: "Quick Support Check-in (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/d8b4fe/4338ca?text=Support+Checkin", link: "#" },
    ],
  },
  {
    category: "Media & Entertainment",
    color: "bg-pink-500",
    templates: [
      {
        title: "Event Promotion (Email)",
        type: "email",
        placeholderUrl: "/Media_&_Entertainment_EventPromotion.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760445921%2Fnewsletter_1760445924099",
      },
      {
        title: "Content Recommendations (Email)",
        type: "email",
        placeholderUrl: "/Media_&_Entertainment_ContentRecommendation.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760520438%2Fnewsletter_1760520441741",
      },
      {
        title: "Subscription Renewal (Email)",
        type: "email",
        placeholderUrl: "/Media_&_Entertainment_SubscriptionReneval.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760530839%2Fnewsletter_1760530843179",
      },
      // { title: "Event Reminder (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/fbcfe8/4338ca?text=Event+Reminder", link: "#" },
      // { title: "New Content Alert (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/fce7f3/4338ca?text=New+Content+Alert", link: "#" },
    ],
  },
  {
    category: "Automotive",
    color: "bg-gray-500",
    templates: [
      {
        title: "New Car Launch (Email)",
        type: "email",
        placeholderUrl: "/Automotive_NewCarLaunch.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760598625%2Fnewsletter_1760598630147",
      },
      {
        title: "Promo Offer (Email)",
        type: "email",
        placeholderUrl: "/Automotive_PromoOffer.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760673369%2Fnewsletter_1760673374693",
      },
      {
        title: "Follow-up Post-Inquiry (Email)",
        type: "email",
        placeholderUrl: "/Automotive_FollowUpPostEnquiry.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1760689699%2Fnewsletter_1760689705874",
      },
      // { title: "Service Camp Alert (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/d1d5db/4338ca?text=Service+Camp", link: "#" },
      // { title: "Test Drive Reminder (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/e5e7eb/4338ca?text=Test+Drive+Reminder", link: "#" },
    ],
  },
  {
    category: "Professional Services",
    color: "bg-yellow-500",
    templates: [
      {
        title: "Services Intro (Email)",
        type: "email",
        placeholderUrl: "/Professional_Services_ServicesIntro.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1761214836%2Fnewsletter_1761214833186",
      },
      {
        title: "Case Study Newsletter (Email)",
        type: "email",
        placeholderUrl: "/Professional_Services_CaseStudy.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1761272273%2Fnewsletter_1761272268391",
      },
      {
        title: "Client Testimonial (Email)",
        type: "email",
        placeholderUrl: "/Professional_Services_ClientTestimonial.png",
        link: "https://email-newsletter-tan.vercel.app/?template=https%3A%2F%2Fres.cloudinary.com%2Fdhlex64es%2Fraw%2Fupload%2Fv1761286219%2Fnewsletter_1761286214182",
      },
      // { title: "Meeting Follow-up (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/fef3c7/4338ca?text=Meeting+Followup", link: "#" },
      // { title: "Consultation Scheduling (WhatsApp)", type: "whatsapp", placeholderUrl: "https://placehold.co/400x300/fde047/4338ca?text=Consult+Scheduling", link: "#" },
    ],
  },
];

export default function TemplateGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredData =
    selectedCategory === "All"
      ? templatesData
      : templatesData.filter(
          (section) => section.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-12 font-poppins text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-5xl sm:text-6xl font-black mb-3
          bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] 
          bg-clip-text text-transparent tracking-tight leading-tight"
          >
            Template Gallery
          </h1>
          <p className="mt-6 text-xl font-medium text-gray-600 max-w-2xl mx-auto">
            Choose a design to start crafting your masterpiece
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 pb-8 border-b border-gray-200">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-8 py-3 rounded-full font-semibold 
          transition-all duration-300 ${
            selectedCategory === "All"
              ? "bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] text-white shadow-[0_4px_20px_rgba(196,12,216,0.4)] scale-105"
              : "bg-green-100 text-gray-700 border border-gray-300 hover:border-[#c40cd8] hover:scale-105 hover:shadow-md"
          }`}
          >
            All Templates
          </button>

          {templatesData.map((section, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(section.category)}
              className={`px-8 py-3 rounded-full font-semibold 
            transition-all duration-300 ${
              selectedCategory === section.category
                ? "bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] text-white shadow-[0_4px_20px_rgba(196,12,216,0.4)] scale-105"
                : "bg-green-100 text-gray-900 border border-gray-800 hover:border-[#c40cd8] hover:scale-105 hover:shadow-md"
            }`}
            >
              {section.category}
            </button>
          ))}
        </div>

        {/* Templates Sections */}
        {filteredData.map((section, index) => (
          <section key={index} className="mb-20">
            <div className="mb-8">
              <h2
                className="text-3xl sm:text-4xl font-black mb-2
              bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] 
              bg-clip-text text-transparent inline-block"
              >
                {section.category}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] rounded-full mt-2"></div>
            </div>

            {/* Template Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.templates.map((template, i) => (
                <div
                  key={i}
                  className="
                  group
                  bg-white rounded-xl overflow-hidden
                  border border-gray-200
                  shadow-sm
                  h-80
                  transition-all duration-500 ease-in-out
                  relative
                  hover:h-auto
                  hover:shadow-[0_8px_40px_rgba(245,19,152,0.25),0_0_60px_rgba(196,12,216,0.15)]
                  hover:z-20
                  hover:scale-[1.02]
                  hover:border-transparent
                "
                >
                  <a
                    href={template.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full flex-col"
                  >
                    {/* Image Container */}
                    {/* Title - Always visible at bottom */}
                    <div className="p-5 bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] relative">
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                      <h3
                        className="text-lg font-bold text-white text-center relative z-10
                        tracking-tight leading-tight"
                      >
                        {template.title}
                      </h3>
                    </div>
                    <div className="flex-1 overflow-hidden min-h-0 bg-gray-100">
                      <img
                        src={template.placeholderUrl}
                        alt={template.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
