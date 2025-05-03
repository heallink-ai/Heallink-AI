// src/components/sections/ForProviders.tsx
import ScrollReveal from "../animations/ScrollReveal";
import Button from "../ui/Button";

export default function ForProviders() {
  return (
    <section
      id="for-providers"
      className="py-20 bg-gray-50/50 dark:bg-gray-900/30"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          {/* Right side - illustration */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -top-10 right-20 w-64 h-64 bg-royal-blue/20 rounded-full filter blur-3xl opacity-60 animate-pulse-slow"></div>

                <div className="relative z-10 rounded-2xl overflow-hidden neumorph-flat">
                  {/* Doctor dashboard mockup */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
                      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                        <h3 className="font-semibold high-contrast-text">
                          Patient Dashboard
                        </h3>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-heart/10 text-purple-heart flex items-center justify-center">
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
                                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                              />
                            </svg>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-purple-heart/10 text-purple-heart flex items-center justify-center">
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
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-purple-heart/10 to-royal-blue/10 rounded-lg p-3 border-l-4 border-purple-heart">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium high-contrast-text">
                              John D. (Incoming)
                            </h4>
                            <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                              New
                            </span>
                          </div>
                          <p className="text-xs light-text-contrast mt-1">
                            Symptoms: Persistent cough, fatigue, 38.1°C fever
                          </p>
                          <div className="mt-2 text-xs text-purple-heart">
                            <span className="font-medium">AI Suggestion:</span>{" "}
                            Consider COVID-19 test, check oxygen levels
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium high-contrast-text">
                              Emma S.
                            </h4>
                            <span className="text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                              14:30
                            </span>
                          </div>
                          <p className="text-xs light-text-contrast mt-1">
                            Follow-up: Blood pressure monitoring, medication
                            review
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium high-contrast-text">
                              Michael R.
                            </h4>
                            <span className="text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                              15:15
                            </span>
                          </div>
                          <p className="text-xs light-text-contrast mt-1">
                            Annual checkup: No presenting symptoms
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm light-text-muted">
                            7 more appointments today
                          </span>
                          <button className="text-sm text-purple-heart">
                            View Schedule
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl p-4 neumorph-flat">
                      <h3 className="font-semibold mb-3 high-contrast-text">
                        AI Clinical Co-pilot
                      </h3>
                      <div className="flex items-start bg-purple-heart/5 p-3 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-heart to-royal-blue text-white flex items-center justify-center mr-3 flex-shrink-0">
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
                              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                            />
                          </svg>
                        </div>
                        <div className="text-xs high-contrast-text">
                          <p className="mb-1">
                            For patient John D., consider the following:
                          </p>
                          <ul className="list-disc list-inside space-y-1 pl-1">
                            <li>
                              Patient's symptoms align with both COVID-19 and
                              seasonal influenza
                            </li>
                            <li>
                              Medical history shows asthma - monitor respiratory
                              function
                            </li>
                            <li>
                              Similar presentation 3 months ago resulted in
                              bronchitis diagnosis
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -left-4 top-1/3 w-16 h-16 rounded-xl bg-gradient-to-br from-purple-heart-600 to-royal-blue-700 neumorph-flat text-white flex items-center justify-center transform -rotate-12 animate-float">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                    />
                  </svg>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Left side - content */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="right" delay={100}>
              <span className="inline-block py-1 px-3 text-sm font-medium bg-purple-heart/10 text-purple-heart rounded-full mb-4">
                For Healthcare Providers
              </span>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={200}>
              <h2 className="section-title">
                An Intelligent{" "}
                <span className="gradient-text">Clinical Co-pilot</span> at Your
                Side
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={300}>
              <p className="section-description">
                HealLink transforms your clinical workflow with AI that supports
                decision-making while keeping you in control. Our platform works
                seamlessly in the background to provide insights when you need
                them most.
              </p>
            </ScrollReveal>

            <div className="space-y-6">
              <ScrollReveal direction="right" delay={400}>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-purple-heart/10 text-purple-heart flex items-center justify-center mr-4 neumorph-flat">
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
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 high-contrast-text">
                      Patient Context at a Glance
                    </h3>
                    <p className="light-text-contrast">
                      Our AI surfaces relevant patient history, medication
                      alerts, and evidence-based suggestions during
                      consultations.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={500}>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-purple-heart/10 text-purple-heart flex items-center justify-center mr-4 neumorph-flat">
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
                        d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 high-contrast-text">
                      Reduce Administrative Burden
                    </h3>
                    <p className="light-text-contrast">
                      Automate documentation, coding suggestions, and follow-up
                      scheduling to focus more on patient care.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={600}>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-purple-heart/10 text-purple-heart flex items-center justify-center mr-4 neumorph-flat">
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
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 high-contrast-text">
                      Optimized Patient Flow
                    </h3>
                    <p className="light-text-contrast">
                      HealLink intelligently routes patients to your practice
                      based on your expertise and availability, improving
                      matching.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal direction="right" delay={700}>
              <div className="mt-10">
                <Button href="#download">Partner With Us</Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
