// src/components/sections/FAQ.tsx
"use client";

import { useState } from "react";
import FAQItem from "../ui/FAQItem";
import ScrollReveal from "../animations/ScrollReveal";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How does HealLink find the right healthcare provider for me?",
      answer:
        "HealLink's AI analyzes your symptoms, medical history, location, insurance coverage, and urgency of care needed. It then matches you with the most appropriate healthcare provider in real-time, considering factors like specialty, proximity, and availability.",
    },
    {
      question: "Is my medical information secure and private?",
      answer:
        "Absolutely. HealLink is fully HIPAA-compliant and uses end-to-end encryption to protect your data. We never share your information with third parties without your explicit consent, and our AI systems are designed with privacy as a core principle.",
    },
    {
      question: "Can HealLink replace emergency services?",
      answer:
        "No, HealLink is not a replacement for emergency services. If you're experiencing a life-threatening emergency, you should call emergency services immediately. HealLink can help direct you to urgent care or emergency departments when appropriate, but always call emergency services for critical situations.",
    },
    {
      question: "Do I need insurance to use HealLink?",
      answer:
        "No, you don't need insurance to use HealLink. While our platform can help find providers that accept your insurance, we can also connect you with affordable care options if you're uninsured, including community health centers and telehealth services with transparent pricing.",
    },
    {
      question: "How do healthcare providers join the HealLink network?",
      answer:
        "Healthcare providers can sign up through our provider portal on the website. After verification of credentials and licensing, providers can set up their profile, including specialties, availability, and services offered. We offer integration with most major EMR systems to streamline the process.",
    },
    {
      question: "Is there a cost to use the HealLink app?",
      answer:
        "The basic HealLink app is free for patients to download and use. Premium features, such as priority routing and expanded telehealth options, are available through subscription plans. Healthcare providers have different pricing tiers based on practice size and integration needs.",
    },
    {
      question: "How accurate is the AI in assessing my symptoms?",
      answer:
        "HealLink's AI has been trained on millions of medical cases and continuously improves through machine learning. However, it's important to understand that our AI is a triage and routing tool, not a diagnostic system. It helps connect you to the right healthcare professional who will make proper clinical assessments and diagnoses.",
    },
    {
      question: "Does HealLink work internationally?",
      answer:
        "Currently, HealLink is available in Ireland and the UK, with plans to expand to other European countries and North America. International travelers within our service areas can use HealLink to find appropriate care while abroad.",
    },
  ];

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1 px-3 text-sm font-medium bg-purple-heart/10 text-purple-heart rounded-full mb-4">
              Common Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get answers to common questions about HealLink's services and
              technology
            </p>
          </div>
        </ScrollReveal>

        {/* Two column layout for FAQs on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-4">
            {faqItems
              .slice(0, Math.ceil(faqItems.length / 2))
              .map((item, index) => (
                <ScrollReveal
                  key={index}
                  direction="up"
                  delay={100 * index}
                  distance={20}
                >
                  <FAQItem
                    question={item.question}
                    answer={item.answer}
                    isOpen={activeIndex === index}
                    toggleOpen={() => toggleFAQ(index)}
                  />
                </ScrollReveal>
              ))}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {faqItems
              .slice(Math.ceil(faqItems.length / 2))
              .map((item, index) => (
                <ScrollReveal
                  key={index + Math.ceil(faqItems.length / 2)}
                  direction="up"
                  delay={100 * (index + Math.ceil(faqItems.length / 2))}
                  distance={20}
                >
                  <FAQItem
                    question={item.question}
                    answer={item.answer}
                    isOpen={
                      activeIndex === index + Math.ceil(faqItems.length / 2)
                    }
                    toggleOpen={() =>
                      toggleFAQ(index + Math.ceil(faqItems.length / 2))
                    }
                  />
                </ScrollReveal>
              ))}
          </div>
        </div>

        {/* Additional Help Section */}
        <ScrollReveal direction="up" delay={100} className="mt-16">
          <div className="text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 neumorph-flat">
            <h3 className="text-2xl font-semibold mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Our team is ready to help with any other questions you might have
              about HealLink's services, technology, or partnerships.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:support@heallink.com"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-purple-heart to-royal-blue text-white neumorph-flat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                Email Support
              </a>
              <a
                href="tel:+35312345678"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium border-2 border-purple-heart text-purple-heart dark:text-white neumorph-flat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                Call Us
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
