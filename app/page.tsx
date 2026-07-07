import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/hero";
import { MeetYourArtist } from "@/components/MeetYourArtist";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { FlashCatalog } from "@/components/FlashCatalog";
import { BookingForm } from "@/components/BookingForm";
import { AftercareGuide } from "@/components/AftercareGuide";
import { ContactStudio } from "@/components/ContactStudio";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Tattoos by Jake Llewellyn\",\"description\":\"At Tattoos by jakellewellyn, I offer a range of services to cater to your individual tattoo needs. I specialise in custom designs, client-specified artwork, and cover-ups (depending on the existing design). All tattoo styles are welcome, ensuring your body art is exactly as you envision it.\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"6A Gwerthonor Place Gilfach Bargoed CF81 8JQ\"},\"url\":\"https://tattoos-by-jake-llewellyn-de7953.duckbyte.co\"}" }} />
      <Navbar />
      <div id="hero" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <Hero />
        </Suspense>
      </div>
      <div id="meet-your-artist" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <MeetYourArtist />
        </Suspense>
      </div>
      <div id="portfolio-gallery" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <PortfolioGallery />
        </Suspense>
      </div>
      <div id="flash-catalog" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <FlashCatalog />
        </Suspense>
      </div>
      <div id="booking-form" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <BookingForm />
        </Suspense>
      </div>
      <div id="aftercare-guide" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <AftercareGuide />
        </Suspense>
      </div>
      <div id="contact-studio" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <ContactStudio />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
