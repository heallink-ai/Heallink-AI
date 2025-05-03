// src/components/sections/HowItWorks.tsx
import ScrollReveal from "../animations/ScrollReveal";

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

function Step({ number, title, description, icon, delay }: StepProps) {
  return (
    <ScrollReveal direction="up" delay={delay}>
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-heart to-royal-blue text-white flex items-center justify-center neumorph-flat">
            {icon}
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-black neumorph-flat flex items-center justify-center text-purple-heart font-bold">
            {number}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 high-contrast-text">
          {title}
        </h3>
        <p className="light-text-contrast">{description}</p>
      </div>
    </ScrollReveal>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-gray-50/50 dark:bg-gray-900/30"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1 px-3 text-sm font-medium bg-purple-heart/10 text-purple-heart rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="section-title">
              How <span className="gradient-text">HealLink</span> Works
            </h2>
            <p className="section-description">
              Our AI-driven health platform connects you with the right care in
              three simple steps
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <Step
            number={1}
            title="Describe Your Symptoms"
            description="Use our app or call our 24/7 health hotline to describe your symptoms to our AI health agent."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                />
              </svg>
            }
            delay={100}
          />

          <Step
            number={2}
            title="AI Analysis & Routing"
            description="Our AI asks follow-up questions and analyzes your situation to determine the most appropriate care."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>
            }
            delay={200}
          />

          <Step
            number={3}
            title="Connect to Care"
            description="Get connected to the right healthcare provider immediately, whether it's a clinic, specialist, or urgent care."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
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
            }
            delay={300}
          />
        </div>

        {/* Connection lines between steps (visible on desktop) */}
        <div className="hidden md:block max-w-5xl mx-auto relative">
          <div className="absolute left-[27%] right-[27%] top-1/2 -mt-24 h-0.5 bg-gradient-to-r from-purple-heart to-royal-blue z-0"></div>
        </div>
      </div>
    </section>
  );
}
