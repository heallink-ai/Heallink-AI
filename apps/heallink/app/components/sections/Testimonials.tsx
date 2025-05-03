import { useState, useEffect } from "react";
import TestimonialCard from "../ui/TestimonialCard";
import ScrollReveal from "../animations/ScrollReveal";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "HealLink saved me so much stress. When my son had a high fever at 2 AM, the app connected us with a pediatrician within minutes. No emergency room visit needed!",
      author: "Melissa T.",
      role: "Parent",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      quote:
        "As a busy physician, HealLink's AI assistant has been game-changing. It helps me stay organized, suggests potential diagnoses I might have missed, and handles documentation.",
      author: "Dr. James Chen",
      role: "Family Physician",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      quote:
        "After moving to a new city, I needed a specialist for my chronic condition. HealLink found me the perfect doctor who took my insurance. The whole process took 5 minutes.",
      author: "David R.",
      role: "Patient",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      quote:
        "Our clinic partnered with HealLink six months ago and patient satisfaction has increased 40%. The AI triage system ensures patients are properly directed to our services.",
      author: "Sarah Wilson",
      role: "Clinic Administrator",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      quote:
        "As someone with anxiety, making medical calls is difficult. HealLink's app interface makes explaining my symptoms and finding help so much easier and less stressful.",
      author: "Michael K.",
      role: "Patient",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      quote:
        "The HealLink AI assistant caught a potential medication interaction I nearly missed. It's like having a reliable second opinion available at all times during consultations.",
      author: "Dr. Rebecca Jones",
      role: "Neurologist",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = { mobile: 1, tablet: 2, desktop: 3 };
  const [visibleSlides, setVisibleSlides] = useState(slidesToShow.desktop);

  // Handle responsive slider
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleSlides(slidesToShow.mobile);
      } else if (window.innerWidth < 1024) {
        setVisibleSlides(slidesToShow.tablet);
      } else {
        setVisibleSlides(slidesToShow.desktop);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Next and previous slide handlers
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev + visibleSlides >= testimonials.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - visibleSlides : prev - 1
    );
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, visibleSlides]);

  return (
    <section className="py-20 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1 px-3 text-sm font-medium bg-purple-heart/10 text-purple-heart rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="section-title">
              What Our <span className="gradient-text">Users Say</span>
            </h2>
            <p className="section-description">
              See how HealLink is transforming healthcare experiences for
              providers and patients alike
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonial slider */}
        <div className="relative">
          <div className="overflow-hidden py-8">
            <div
              className="flex transition-transform duration-500 ease-out space-x-6"
              style={{
                transform: `translateX(-${
                  currentSlide * (100 / visibleSlides)
                }%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0"
                  style={{
                    flex: `0 0 calc(${100 / visibleSlides}% - ${
                      (5 * (visibleSlides - 1)) / visibleSlides
                    }rem)`,
                  }}
                >
                  <TestimonialCard
                    quote={testimonial.quote}
                    author={testimonial.author}
                    role={testimonial.role}
                    image={testimonial.image}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 md:-translate-x-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-800 dark:text-gray-200 z-10 neumorph-flat"
            aria-label="Previous testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 md:translate-x-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-800 dark:text-gray-200 z-10 neumorph-flat"
            aria-label="Next testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({
            length: Math.ceil(testimonials.length / visibleSlides),
          }).map((_, index) => {
            const startIndex = index * visibleSlides;
            const isActive =
              currentSlide >= startIndex &&
              currentSlide < startIndex + visibleSlides;

            return (
              <button
                key={index}
                onClick={() => setCurrentSlide(startIndex)}
                className={`w-3 h-3 rounded-full transition-all ${
                  isActive
                    ? "bg-purple-heart w-8"
                    : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                }`}
                aria-label={`Go to testimonial page ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
