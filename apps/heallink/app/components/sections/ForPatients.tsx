// src/components/sections/ForPatients.tsx
import ScrollReveal from "../animations/ScrollReveal";
import Button from "../ui/Button";

export default function ForPatients() {
  return (
    <section id="for-patients" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - illustration */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="right">
              <div className="relative">
                <div className="absolute -top-20 left-20 w-64 h-64 bg-purple-heart/20 rounded-full filter blur-3xl opacity-60 animate-pulse-slow"></div>

                <div className="relative z-10 rounded-2xl overflow-hidden neumorph-flat">
                  {/* Mobile app interface mockup */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-heart to-royal-blue text-white flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm.5-11.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1h4ZM12 8a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 .5.5Zm-5 3.5a.5.5 0 0 1 0 1H3a.5.5 0 0 1 0-1h4Z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold">HealLink Assistant</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Now
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                        Based on your symptoms, I recommend Dr. Sarah Chen at
                        Dublin Family Health. She has an opening today at 2:30
                        PM and is only 3.2 miles away. Would you like me to
                        schedule the appointment?
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 neumorph-flat">
                          <div className="text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6 mx-auto mb-2 text-green-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              Book Now
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 neumorph-flat">
                          <div className="text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6 mx-auto mb-2 text-gray-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              More Options
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center neumorph-flat">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Today, 2:30 PM</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Dr. Sarah Chen
                          </p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center neumorph-flat">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Dublin Family Health</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            3.2 miles away
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -right-4 top-1/4 w-16 h-16 rounded-xl bg-gradient-to-br from-royal-blue to-royal-blue-800 neumorph-flat text-white flex items-center justify-center transform rotate-12 animate-float">
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
                      d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64"
                    />
                  </svg>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right side - content */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="left" delay={100}>
              <span className="inline-block py-1 px-3 text-sm font-medium bg-purple-heart/10 text-purple-heart rounded-full mb-4">
                For Patients
              </span>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get Connected to the{" "}
                <span className="gradient-text">Right Care</span> Instantly
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={300}>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Stop spending hours navigating complex healthcare systems.
                HealLink's AI listens to your symptoms and instantly connects
                you to the most appropriate healthcare provider.
              </p>
            </ScrollReveal>

            <div className="space-y-6">
              <ScrollReveal direction="left" delay={400}>
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
                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Immediate Response
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      No hold times or waiting—our AI agent picks up instantly
                      and guides you to the right care.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={500}>
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
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Smart Localization
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Find healthcare providers near you, with real-time
                      availability and appointment booking.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={600}>
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
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Time-Saving</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Skip the research and phone calls—get directed to the
                      right specialist or clinic in seconds.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal direction="left" delay={700}>
              <div className="mt-10">
                <Button href="#download">Get Started</Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
