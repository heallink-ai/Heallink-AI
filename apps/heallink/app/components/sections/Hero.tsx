// src/components/sections/Hero.tsx
import Button from "../ui/Button";
import ScrollReveal from "../animations/ScrollReveal";
import AppStoreButtons from "../ui/AppStoreButton";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="up" delay={100}>
              <span className="inline-block py-1 px-3 text-sm font-medium bg-purple-heart/10 text-purple-heart rounded-full mb-4">
                AI-Driven Healthcare
              </span>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight high-contrast-text">
                <span className="gradient-text">Intelligent</span> Healthcare
                Routing and Assistance
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <p className="hero-paragraph mb-8">
                Connect with the right healthcare provider instantly through our
                AI-driven health routing platform. No more waiting, no more
                confusion — just immediate, intelligent care.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/auth/signup" size="lg">
                  Get Started
                </Button>
                <Button
                  href="#how-it-works"
                  variant="outline"
                  size="lg"
                  className="header-phone-button"
                >
                  Learn How It Works
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={500}>
              <div className="flex items-center mt-8 gap-2">
                <div className="w-12 h-12 rounded-full bg-purple-heart/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-heart"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Need immediate assistance?
                  </p>
                  <a
                    href="tel:+35387483177"
                    className="font-semibold text-purple-heart hover:underline"
                  >
                    +353 8 7483 1977
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={550}>
              <div className="mt-8">
                <p className="text-sm high-contrast-text mb-3">
                  Download our app:
                </p>
                <div className="custom-app-store-buttons">
                  <AppStoreButtons />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right content - animated illustration */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="left" delay={300}>
              <div className="relative">
                <div className="absolute -top-20 -left-16 w-64 h-64 bg-purple-heart/30 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-royal-blue/20 rounded-full filter blur-3xl opacity-60 animate-pulse-slow"></div>

                <div className="relative z-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black rounded-2xl p-6 neumorph-flat">
                  {/* Mobile app mockup */}
                  <div className="bg-black rounded-xl overflow-hidden border-8 border-gray-800 shadow-lg max-w-xs mx-auto">
                    <div className="h-6 bg-gray-800 flex items-center justify-center">
                      <div className="w-16 h-2 bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-heart/10 to-royal-blue/10">
                      {/* App header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="text-xs text-gray-400">Hello,</div>
                          <div className="text-sm font-semibold">Sarah</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-purple-heart flex items-center justify-center text-white text-xs font-bold">
                          S
                        </div>
                      </div>

                      {/* AI assistant bubble */}
                      <div className="mb-4 p-3 bg-gray-800 rounded-lg rounded-tl-none max-w-[80%]">
                        <div className="text-xs text-white">
                          Hi Sarah, how can I help you today?
                        </div>
                      </div>

                      {/* User message bubble */}
                      <div className="mb-4 p-3 bg-purple-heart rounded-lg rounded-tr-none ml-auto max-w-[80%]">
                        <div className="text-xs text-white">
                          I have a severe headache and slight fever
                        </div>
                      </div>

                      {/* AI analyzing bubble */}
                      <div className="mb-4 p-3 bg-gray-800 rounded-lg rounded-tl-none max-w-[90%]">
                        <div className="text-xs text-white">
                          I&apos;ll help you find the right care. Let me ask a
                          few questions...
                        </div>
                      </div>

                      {/* Input field */}
                      <div className="flex items-center gap-2 mt-8">
                        <div className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-xs text-gray-400">
                          Type your symptoms...
                        </div>
                        <div className="w-8 h-8 rounded-full bg-purple-heart flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="white"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -right-4 top-1/3 w-16 h-16 rounded-xl bg-gradient-to-br from-purple-heart to-royal-blue neumorph-flat text-white flex items-center justify-center transform rotate-12 animate-float">
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
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </div>

                  <div
                    className="absolute -left-6 bottom-12 w-14 h-14 rounded-xl bg-gradient-to-br from-royal-blue to-havelock-blue neumorph-flat text-white flex items-center justify-center transform -rotate-12 animate-float"
                    style={{ animationDelay: "2s" }}
                  >
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
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                      />
                    </svg>
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
