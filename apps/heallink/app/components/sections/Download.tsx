// src/components/sections/Download.tsx

import ScrollReveal from "../animations/ScrollReveal";
import AppStoreButtons from "../ui/AppStoreButton";

export default function Download() {
  return (
    <section
      id="download"
      className="py-20 bg-gradient-to-br from-purple-heart to-royal-blue text-white"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="right">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get Started with HealLink Today
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Download the HealLink app to connect with the right healthcare
                providers instantly. Say goodbye to long wait times and hello to
                intelligent, personalized healthcare routing.
              </p>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  How to Get Started:
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-purple-heart font-bold mr-4">
                      1
                    </div>
                    <div>
                      <p>
                        Download the HealLink app from the App Store or Google
                        Play
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-purple-heart font-bold mr-4">
                      2
                    </div>
                    <div>
                      <p>
                        Create an account and enter your basic health
                        information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-purple-heart font-bold mr-4">
                      3
                    </div>
                    <div>
                      <p>
                        Describe your symptoms or healthcare needs to our AI
                        assistant
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-purple-heart font-bold mr-4">
                      4
                    </div>
                    <div>
                      <p>Get connected to the right care in seconds</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <AppStoreButtons />
              </div>

              <div className="mt-8">
                <p className="text-sm opacity-80">
                  Or call our 24/7 health hotline:{" "}
                  <a href="tel:+35312345678" className="font-bold">
                    +353 8 7483 1977
                  </a>
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right content - app preview */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-white/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>

                {/* Phone mockup */}
                <div className="relative z-10 max-w-xs mx-auto">
                  <div className="bg-black rounded-[3rem] overflow-hidden border-[14px] border-black shadow-2xl">
                    <div className="relative">
                      {/* Notch */}
                      <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl z-10 flex justify-center items-center">
                        <div className="w-1/3 h-4 bg-black rounded-xl"></div>
                      </div>

                      {/* Status bar */}
                      <div className="h-10 bg-purple-heart/90 flex items-center justify-between px-6 pt-5">
                        <div className="text-xs text-white">9:41</div>
                        <div className="flex space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            className="text-white"
                          >
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            className="text-white"
                          >
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                            <path d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            className="text-white"
                          >
                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                          </svg>
                        </div>
                      </div>

                      {/* App content */}
                      <div className="bg-gradient-to-b from-purple-heart/80 to-royal-blue/90 min-h-[520px] px-4 py-6">
                        {/* App header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
                              <span className="text-purple-heart font-bold text-lg">
                                H
                              </span>
                            </div>
                            <span className="text-white font-semibold">
                              HealLink
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 text-white"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Welcome section */}
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm mb-6">
                          <h3 className="text-white text-lg font-semibold mb-2">
                            Hi, Emma!
                          </h3>
                          <p className="text-white/80 text-sm mb-3">
                            How can I help you today?
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/10 rounded-xl p-3 text-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 mx-auto mb-2 text-white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                />
                              </svg>
                              <span className="text-white text-xs">
                                Find Care
                              </span>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 text-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 mx-auto mb-2 text-white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                />
                              </svg>
                              <span className="text-white text-xs">
                                Appointments
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* AI Chat section */}
                        <div className="rounded-2xl bg-white p-4 mb-6">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                HealLink Assistant
                              </h4>
                              <p className="text-xs text-gray-500">Now</p>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-4">
                            I've found three dermatologists near you who
                            specialize in pediatric eczema and accept your
                            insurance. Would you like to see their availability?
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            <button className="bg-purple-heart text-white text-sm rounded-lg py-2 px-3">
                              Yes, please
                            </button>
                            <button className="bg-gray-200 text-gray-700 text-sm rounded-lg py-2 px-3">
                              More options
                            </button>
                          </div>
                        </div>

                        {/* Bottom input */}
                        <div className="flex items-center bg-white/20 rounded-full backdrop-blur-sm px-4 py-2">
                          <input
                            type="text"
                            placeholder="Tell me what you need..."
                            className="flex-1 bg-transparent text-white text-sm border-0 focus:outline-none placeholder-white/60"
                          />
                          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center ml-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-purple-heart"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone bottom line */}
                  <div className="flex justify-center mt-2">
                    <div className="w-1/3 h-1 bg-white/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
