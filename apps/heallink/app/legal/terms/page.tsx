"use client";

import Link from "next/link";
import AnimatedTitle from "@/app/components/legal/AnimatedTitle";
import AnimatedSection from "@/app/components/legal/AnimatedSection";
import AnimatedList from "@/app/components/legal/AnimatedList";
import BackgroundAnimation from "@/app/components/legal/BackgroundAnimation";
import Divider from "@/app/components/legal/Divider";
import { motion } from "framer-motion";

export default function TermsPage() {
  // Current date for the last updated field
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Icons for sections
  const icons = {
    acceptance: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    services: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M17.28 14.27a6.004 6.004 0 0 0-10.56 0" />
        <path d="M20 4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16Z" />
      </svg>
    ),
    registration: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M15 11h6m-3-3v6" />
      </svg>
    ),
    privacy: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
      </svg>
    ),
    providers: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.56 3.69a9 9 0 0 0-2.92 1.95" />
        <path d="M3.69 8.56A9 9 0 0 0 3 12" />
        <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
        <path d="M8.56 20.31A9 9 0 0 0 12 21" />
        <path d="M15.44 20.31a9 9 0 0 0 2.92-1.95" />
        <path d="M20.31 15.44A9 9 0 0 0 21 12" />
        <path d="M20.31 8.56a9 9 0 0 0-1.95-2.92" />
        <path d="M15.44 3.69A9 9 0 0 0 12 3" />
        <path d="M12 12v.01" />
      </svg>
    ),
    disclaimer: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
    ),
    conduct: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    ip: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12h2" />
        <path d="M6 6h2" />
        <path d="M15 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M20 16.2A4 4 0 0 0 16.2 12H7.8A4 4 0 0 0 4 16.2" />
        <path d="M15 12V6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v6" />
      </svg>
    ),
    payment: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
    liability: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    ),
    indemnification: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.73 21a11 11 0 0 1-11-11V3.27a1 1 0 0 1 .607-.92 1 1 0 0 1 1.07.22l4.792 4.79 5.5-5.5" />
        <path d="M22 13.764V21a1 1 0 0 1-1 1h-7.268a2 2 0 0 1-1.414-.586l-1.813-1.814" />
      </svg>
    ),
    modifications: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
    ),
    law: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 12h12" />
        <circle cx="12" cy="12" r="8" />
        <path d="m20 4-8.5 8.5" />
        <path d="m4 20 8.5-8.5" />
      </svg>
    ),
    contact: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 8.5A3.5 3.5 0 0 1 5.5 5H19v12.5a3.5 3.5 0 0 1-3.5 3.5H4a2 2 0 0 1-2-2V8.5Z" />
        <path d="M19 5V3.5A1.5 1.5 0 0 0 17.5 2H15a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V8.5A3.5 3.5 0 0 0 18.5 5H5.5A3.5 3.5 0 0 0 2 8.5" />
      </svg>
    ),
  };

  return (
    <main className="bg-background text-foreground pt-28 pb-20 relative">
      <BackgroundAnimation />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <Link
              href="/legal"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Legal Hub
            </Link>
          </motion.div>

          <AnimatedTitle
            title="Terms and Conditions"
            subtitle={`Last Updated: ${today}`}
            className="mb-12"
          />

          <div className="space-y-8">
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <p className="light-text-contrast">
                Welcome to HealLink. These Terms and Conditions govern your use
                of the HealLink platform, including our website, mobile
                applications, and services (collectively, the "Platform"). By
                accessing or using our Platform, you agree to these Terms.
                Please read them carefully.
              </p>

              <AnimatedSection
                title="1. Acceptance of Terms"
                icon={icons.acceptance}
                delay={0.1}
              >
                <p className="light-text-contrast">
                  By accessing or using the HealLink Platform, you agree to be
                  bound by these Terms and Conditions and our Privacy Policy. If
                  you do not agree with any part of these terms, you may not use
                  our services.
                </p>
              </AnimatedSection>

              <AnimatedSection
                title="2. Description of Services"
                icon={icons.services}
                delay={0.2}
                className="mt-8"
              >
                <p className="light-text-contrast mb-4">
                  HealLink is an AI-driven healthcare routing and assistance
                  platform that connects users with healthcare providers. Our
                  services include but are not limited to:
                </p>
                <AnimatedList
                  items={[
                    "Connecting patients with appropriate healthcare providers",
                    "Scheduling appointments and consultations",
                    "Secure messaging between patients and providers",
                    "Access to medical records and health information",
                    "Telemedicine consultations",
                    "Health tracking and monitoring",
                  ]}
                  delay={0.3}
                />
              </AnimatedSection>

              <Divider />

              <AnimatedSection
                title="3. User Registration and Accounts"
                icon={icons.registration}
                delay={0.1}
              >
                <p className="light-text-contrast mb-4">
                  To use certain features of our Platform, you must register for
                  an account. When you register, you agree to:
                </p>
                <AnimatedList
                  items={[
                    "Provide accurate, current, and complete information",
                    "Maintain and update your information",
                    "Keep your password secure and confidential",
                    "Notify us immediately of any unauthorized access to your account",
                    "Take responsibility for all activities that occur under your account",
                  ]}
                  delay={0.2}
                />
                <p className="light-text-contrast mt-4">
                  You must be at least 18 years old to create an account. You
                  may create an account for a minor under your legal
                  guardianship, but you will be responsible for ensuring
                  compliance with these Terms.
                </p>
              </AnimatedSection>

              <AnimatedSection
                title="4. Privacy and Data Protection"
                icon={icons.privacy}
                delay={0.2}
                className="mt-8"
              >
                <p className="light-text-contrast mb-4">
                  Your privacy is important to us. Our{" "}
                  <Link
                    href="/legal/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  describes how we collect, use, and protect your personal
                  information.
                </p>
                <p className="light-text-contrast mb-4">
                  HealLink is committed to protecting your health information in
                  accordance with applicable laws, including the Health
                  Insurance Portability and Accountability Act (HIPAA) where
                  applicable.
                </p>
                <p className="light-text-contrast">
                  By using our Platform, you consent to the collection, use, and
                  sharing of your information as described in our Privacy
                  Policy.
                </p>
              </AnimatedSection>

              <Divider />

              <AnimatedSection
                title="5. Healthcare Providers"
                icon={icons.providers}
                delay={0.1}
              >
                <p className="light-text-contrast mb-4">
                  HealLink connects users with independent healthcare providers.
                  We do not employ these providers directly.
                </p>
                <p className="light-text-contrast mb-4">
                  While we verify the credentials of healthcare providers on our
                  platform, we do not guarantee the quality of care provided by
                  these professionals. You are responsible for evaluating and
                  selecting the appropriate provider for your needs.
                </p>
                <p className="light-text-contrast">
                  Any relationship between you and a healthcare provider is
                  separate from your relationship with HealLink. The provider's
                  own terms of service and privacy policies will also apply to
                  services they provide.
                </p>
              </AnimatedSection>

              <AnimatedSection
                title="6. Medical Advice Disclaimer"
                icon={icons.disclaimer}
                delay={0.2}
                className="mt-8"
              >
                <p className="light-text-contrast mb-4">
                  The content provided on HealLink is for informational and
                  educational purposes only. It is not a substitute for
                  professional medical advice, diagnosis, or treatment.
                </p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-4 bg-primary/10 border-l-4 border-primary rounded-r-md mb-4"
                >
                  <p className="light-text-contrast font-semibold">
                    Always seek the advice of your physician or other qualified
                    health provider with any questions you may have regarding a
                    medical condition. Never disregard professional medical
                    advice or delay seeking it because of something you have
                    read on our Platform.
                  </p>
                </motion.div>
                <p className="light-text-contrast">
                  In a medical emergency, call your doctor or emergency services
                  immediately. HealLink does not recommend or endorse specific
                  tests, physicians, products, procedures, or other information
                  that may be mentioned on the Platform.
                </p>
              </AnimatedSection>

              <Divider />

              <AnimatedSection
                title="7. User Conduct"
                icon={icons.conduct}
                delay={0.1}
              >
                <p className="light-text-contrast mb-4">
                  When using our Platform, you agree not to:
                </p>
                <AnimatedList
                  items={[
                    "Violate any applicable laws or regulations",
                    "Infringe on the rights of others, including privacy and intellectual property rights",
                    "Upload or transmit viruses or other malicious code",
                    "Attempt to gain unauthorized access to our systems or user accounts",
                    "Interfere with or disrupt the Platform or servers",
                    "Engage in fraudulent, deceptive, or misleading practices",
                    "Use the Platform for any illegal or unauthorized purpose",
                    "Harass, intimidate, or threaten any users or providers",
                  ]}
                  delay={0.2}
                />
                <p className="light-text-contrast mt-4">
                  We reserve the right to terminate or suspend access to our
                  Platform for violations of these conduct guidelines.
                </p>
              </AnimatedSection>

              <AnimatedSection
                title="8. Intellectual Property"
                icon={icons.ip}
                delay={0.2}
                className="mt-8"
              >
                <p className="light-text-contrast mb-4">
                  All content on the HealLink Platform, including text,
                  graphics, logos, icons, images, audio clips, digital
                  downloads, and software, is the property of HealLink or its
                  content suppliers and is protected by international copyright
                  laws.
                </p>
                <p className="light-text-contrast mb-4">
                  You may access, use, and display the Platform on a computer or
                  mobile device and download and print pages for your personal,
                  non-commercial use. You must not reproduce, distribute,
                  modify, create derivative works from, publicly display,
                  publicly perform, republish, download, store, or transmit any
                  content without our express written permission.
                </p>
                <p className="light-text-contrast">
                  The HealLink name, logo, and all related names, logos, product
                  and service names, designs, and slogans are trademarks of
                  HealLink or its affiliates. You may not use these marks
                  without our prior written permission.
                </p>
              </AnimatedSection>

              <Divider />

              <AnimatedSection
                title="9. Payment Terms"
                icon={icons.payment}
                delay={0.1}
              >
                <p className="light-text-contrast mb-4">
                  Some services on HealLink may require payment. By providing
                  payment information, you represent that you are authorized to
                  use the payment method, and you authorize us to charge your
                  payment method for the services you purchase.
                </p>
                <p className="light-text-contrast mb-4">
                  All fees are exclusive of taxes, which will be added where
                  applicable. You are responsible for paying all fees and
                  applicable taxes associated with your use of our Platform.
                </p>
                <p className="light-text-contrast">
                  Payment for healthcare provider services may be processed
                  directly by the provider or through HealLink, depending on the
                  service. Please refer to the specific service terms for
                  payment details.
                </p>
              </AnimatedSection>

              <AnimatedSection
                title="10. Limitation of Liability"
                icon={icons.liability}
                delay={0.2}
                className="mt-8"
              >
                <p className="light-text-contrast mb-4">
                  To the maximum extent permitted by law, HealLink, its
                  affiliates, and their respective officers, directors,
                  employees, and agents shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including but not limited to loss of profits, data, use, or
                  goodwill, arising out of or in connection with your use of the
                  Platform.
                </p>
                <p className="light-text-contrast mb-4">
                  In no event shall our total liability to you for all claims
                  exceed the amount you have paid to HealLink for use of the
                  Platform during the twelve (12) months preceding the event
                  giving rise to the liability.
                </p>
                <p className="light-text-contrast">
                  Some jurisdictions do not allow the exclusion of certain
                  warranties or the limitation or exclusion of liability for
                  certain damages. Accordingly, some of the above limitations
                  may not apply to you.
                </p>
              </AnimatedSection>

              <Divider />

              <AnimatedSection
                title="11. Indemnification"
                icon={icons.indemnification}
                delay={0.1}
              >
                <p className="light-text-contrast">
                  You agree to indemnify, defend, and hold harmless HealLink,
                  its affiliates, licensors, and service providers, and its and
                  their respective officers, directors, employees, contractors,
                  agents, licensors, suppliers, successors, and assigns from and
                  against any claims, liabilities, damages, judgments, awards,
                  losses, costs, expenses, or fees (including reasonable
                  attorneys' fees) arising out of or relating to your violation
                  of these Terms or your use of the Platform.
                </p>
              </AnimatedSection>

              <AnimatedSection
                title="12. Modifications to Terms"
                icon={icons.modifications}
                delay={0.2}
                className="mt-8"
              >
                <p className="light-text-contrast">
                  We may modify these Terms at any time by posting the revised
                  terms on our Platform. Your continued use of the Platform
                  after the effective date of the revised Terms constitutes your
                  acceptance of the terms. It is your responsibility to check
                  the Terms periodically for changes.
                </p>
              </AnimatedSection>

              <Divider />

              <AnimatedSection
                title="13. Governing Law"
                icon={icons.law}
                delay={0.1}
              >
                <p className="light-text-contrast">
                  These Terms shall be governed by and construed in accordance
                  with the laws of the Republic of Ghana, without giving effect
                  to any principles of conflicts of law. Any legal action or
                  proceeding arising under these Terms shall be brought
                  exclusively in the courts located in Accra, Ghana, and you
                  consent to the personal jurisdiction and venue therein.
                </p>
              </AnimatedSection>

              <AnimatedSection
                title="14. Contact Information"
                icon={icons.contact}
                delay={0.2}
                className="mt-8"
              >
                <p className="light-text-contrast mb-4">
                  If you have any questions about these Terms, please contact us
                  at:
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-5 bg-card rounded-xl neumorph-flat"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 light-text-contrast">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 mr-3 text-primary"
                      >
                        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                        <path d="M3 9 12 15 21 9" />
                        <path d="M3 9 12 3 21 9" />
                      </svg>
                      <span>hello@heallink.io</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 mr-3 text-primary"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>+353 874831977</span>
                    </div>
                    <div className="flex items-center md:col-span-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 mr-3 text-primary"
                      >
                        <path d="M18 7.59a1 1 0 0 0-1.999-.011" />
                        <path d="M7 14.998c-.5 0-1-.5-1-1v-1l-1.646-1.646a1 1 0 0 1 0-1.414L7.0799 6.293a1 1 0 0 1 .707-.293H9v3l3-3h4a1 1 0 0 1 1 1v8.1m0 0a1 1 0 0 1-1 .9h-2.012m0 0a3 3 0 1 0-4 0m4 0h-4" />
                        <path d="M17 14.998v-6" />
                        <path d="M13 14.998v-5" />
                        <circle cx="13" cy="19" r="3" />
                      </svg>
                      <span>HealLink, Accra, Ghana</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>

              <motion.div
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                    />
                  </svg>
                  Return to Home
                </Link>
              </motion.div>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}
