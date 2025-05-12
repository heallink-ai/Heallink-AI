"use client";

import Link from "next/link";
import AnimatedTitle from "@/app/components/legal/AnimatedTitle";
import AnimatedSection from "@/app/components/legal/AnimatedSection";
import AnimatedList from "@/app/components/legal/AnimatedList";
import BackgroundAnimation from "@/app/components/legal/BackgroundAnimation";
import Divider from "@/app/components/legal/Divider";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  // Current date for the last updated field
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Icons for sections
  const icons = {
    information: (
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
        <line x1="12" x2="12" y1="16" y2="12" />
        <line x1="12" x2="12.01" y1="8" y2="8" />
      </svg>
    ),
    use: (
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
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
    share: (
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
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
      </svg>
    ),
    security: (
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
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    retention: (
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
        <path d="M12 2v8" />
        <path d="m16 6-4 4-4-4" />
        <path d="M21 13v2a9 9 0 1 1-18 0v-2" />
      </svg>
    ),
    rights: (
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
        <path d="M14 9.4V5H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8.6" />
        <path d="m18 2-4 4 4 4" />
      </svg>
    ),
    children: (
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
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
    cookies: (
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
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
        <path d="M8.5 8.5v.01" />
        <path d="M16 15.5v.01" />
        <path d="M12 12v.01" />
        <path d="M11 17v.01" />
        <path d="M7 14v.01" />
      </svg>
    ),
    international: (
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
        <line x1="2" x2="22" y1="12" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    changes: (
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
        <path d="M21 7v6h-6" />
        <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
      </svg>
    ),
    hipaa: (
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
        <path d="M9 12h6" />
        <path d="M11 12v6" />
        <path d="M9 6v6" />
        <path d="M14 6H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
      </svg>
    ),
    california: (
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
        <path d="M3 6v18h18" />
        <path d="m7 15 3-3 2 2 6-6" />
        <rect x="14" y="2" width="8" height="8" />
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
            title="Privacy Policy"
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
                At HealLink, we are committed to protecting your privacy and
                maintaining the security of your personal information. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our Platform. Please
                read it carefully to understand our practices regarding your
                personal data.
              </p>

              <AnimatedSection
                title="1. Information We Collect"
                icon={icons.information}
                delay={0.1}
              >
                <p className="light-text-contrast mb-4">
                  We collect various types of information to provide and improve
                  our services:
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="rounded-lg bg-card/50 p-4 mb-4"
                >
                  <h3 className="text-xl font-medium mb-2 gradient-text">
                    1.1 Personal Information
                  </h3>
                  <AnimatedList
                    items={[
                      "Contact information (name, email address, phone number, address)",
                      "Date of birth and gender",
                      "Profile information and preferences",
                      "Authentication information (username, password)",
                      "Payment information (credit card details, billing address)",
                    ]}
                    delay={0.1}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="rounded-lg bg-card/50 p-4 mb-4"
                >
                  <h3 className="text-xl font-medium mb-2 gradient-text">
                    1.2 Health Information
                  </h3>
                  <AnimatedList
                    items={[
                      "Medical history and current health conditions",
                      "Medications and allergies",
                      "Healthcare provider preferences and history",
                      "Insurance information",
                      "Communications with healthcare providers",
                      "Appointment details and scheduling information",
                    ]}
                    delay={0.1}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="rounded-lg bg-card/50 p-4 mb-4"
                >
                  <h3 className="text-xl font-medium mb-2 gradient-text">
                    1.3 Technical Information
                  </h3>
                  <AnimatedList
                    items={[
                      "Device information (type, operating system, browser)",
                      "IP address and geolocation data",
                      "Usage data (pages visited, time spent, interactions)",
                      "Cookies and similar tracking technologies",
                    ]}
                    delay={0.1}
                  />
                </motion.div>

                <p className="light-text-contrast">
                  We collect information directly from you when you create an
                  account, use our services, or communicate with us, as well as
                  automatically through your use of our Platform.
                </p>
              </AnimatedSection>

              <Divider />

              <AnimatedSection
                title="2. How We Use Your Information"
                icon={icons.use}
                delay={0.1}
              >
                <p className="light-text-contrast mb-4">
                  We use your information for the following purposes:
                </p>

                <AnimatedList
                  items={[
                    "Providing and improving our healthcare routing and assistance services",
                    "Connecting you with appropriate healthcare providers",
                    "Facilitating appointment scheduling and management",
                    "Processing payments and billing",
                    "Enabling secure communications between you and healthcare providers",
                    "Providing customer support and responding to inquiries",
                    "Personalizing your experience and providing recommendations",
                    "Sending service notifications and updates",
                    "Marketing and promotional communications (with your consent)",
                    "Analyzing usage patterns to improve our Platform",
                    "Ensuring the security and integrity of our services",
                    "Complying with legal obligations and healthcare regulations",
                  ]}
                  delay={0.2}
                />

                <p className="light-text-contrast mt-4">
                  We process your information based on legitimate interests,
                  contractual necessity, legal obligations, and your consent, as
                  applicable under relevant data protection laws.
                </p>
              </AnimatedSection>

              <AnimatedSection
                title="3. How We Share Your Information"
                icon={icons.share}
                delay={0.2}
                className="mt-8"
              >
                <p className="light-text-contrast mb-4">
                  We may share your information with the following categories of
                  recipients:
                </p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4"
                >
                  <div className="flex gap-3 items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M19 3v12h-5c-.023-3.681.184-7.406 5-12zm0 12v6h-1v-3M8 3v12h5c.023-3.681-.184-7.406-5-12zm0 12v6h1v-3" />
                      <path d="M5 12c-.814 0-1.572.772-1.896 2.138-.32 1.326-.327 2.862-.004 4.124.324 1.27 1.092 2.138 1.9 2.138.814 0 1.572-.772 1.896-2.138.32-1.326.327-2.862.004-4.124-.324-1.27-1.092-2.138-1.9-2.138zM19 12c.814 0 1.572.772 1.896 2.138.32 1.326.327 2.862.004 4.124-.324 1.27-1.092 2.138-1.9 2.138-.814 0-1.572-.772-1.896-2.138-.32-1.326-.327-2.862-.004-4.124.324-1.27 1.092-2.138 1.9-2.138z" />
                    </svg>
                    <h3 className="text-xl font-medium gradient-text">
                      3.1 Healthcare Providers
                    </h3>
                  </div>
                  <p className="light-text-contrast">
                    We share your health information with healthcare providers
                    you connect with through our Platform to facilitate your
                    care. This sharing is done in accordance with applicable
                    healthcare privacy laws, including HIPAA where applicable.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4"
                >
                  <div className="flex gap-3 items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M16 20h4a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4" />
                      <path d="M12 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
                      <path d="M12 16h-2" />
                      <path d="M12 12h-2" />
                      <path d="M12 8h-2" />
                      <path d="M16 12h.01" />
                    </svg>
                    <h3 className="text-xl font-medium gradient-text">
                      3.2 Service Providers
                    </h3>
                  </div>
                  <p className="light-text-contrast">
                    We engage trusted third-party companies and individuals to
                    facilitate our services, including payment processing,
                    analytics, customer support, and technical infrastructure.
                    These service providers have access to your information only
                    to perform these tasks on our behalf and are obligated to
                    protect your information.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4"
                >
                  <div className="flex gap-3 items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="m9 9 2 2" />
                      <path d="m11 13 2 2" />
                      <path d="m3 21 9-9" />
                      <path d="M12.8 2.8c2 2 5.9 5.9 5.9 5.9a1.95 1.95 0 0 1 0 2.756l-4.244 4.243a1.95 1.95 0 0 1-2.757 0L6.556 10.6a1.95 1.95 0 0 1 0-2.757l4.243-4.241a1.95 1.95 0 0 1 2.001 0L8.044 8.3" />
                    </svg>
                    <h3 className="text-xl font-medium gradient-text">
                      3.3 Legal Requirements
                    </h3>
                  </div>
                  <p className="light-text-contrast">
                    We may disclose your information if required by law,
                    government request, judicial proceeding, court order, or
                    legal process, or to protect our rights, property, or
                    safety, or that of our users or others.
                  </p>
                </motion.div>
              </AnimatedSection>

              <Divider />

              <AnimatedSection
                title="4. Data Security"
                icon={icons.security}
                delay={0.1}
              >
                <p className="light-text-contrast mb-4">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information from
                  unauthorized access, disclosure, alteration, and destruction.
                  These measures include:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="p-4 bg-card rounded-lg flex items-start gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="light-text-contrast">
                      Encryption of sensitive data both in transit and at rest
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="p-4 bg-card rounded-lg flex items-start gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span className="light-text-contrast">
                      Regular security assessments and penetration testing
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="p-4 bg-card rounded-lg flex items-start gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="light-text-contrast">
                      Access controls and authentication mechanisms
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="p-4 bg-card rounded-lg flex items-start gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="M6 8h.01" />
                      <path d="M10 8h.01" />
                      <path d="M14 8h.01" />
                      <path d="M18 8h.01" />
                      <path d="M8 12h.01" />
                      <path d="M12 12h.01" />
                      <path d="M16 12h.01" />
                      <path d="M7 16h10" />
                    </svg>
                    <span className="light-text-contrast">
                      Secure network infrastructure with firewalls and
                      monitoring
                    </span>
                  </motion.div>
                </div>

                <p className="light-text-contrast mb-4">
                  While we strive to use commercially acceptable means to
                  protect your personal information, no method of transmission
                  over the Internet or method of electronic storage is 100%
                  secure. We cannot guarantee absolute security.
                </p>

                <p className="light-text-contrast">
                  We will notify you promptly in the event of a security breach
                  that affects your personal information, in accordance with
                  applicable laws.
                </p>
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
