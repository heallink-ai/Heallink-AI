"use client";

import { useState, useEffect } from "react";
import ScrollReveal from "../animations/ScrollReveal";
import Button from "../ui/Button";
import confetti from "canvas-confetti";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isHovered, setIsHovered] = useState(false);

  // Set release date - 3 months from current date
  const releaseDate = new Date();
  releaseDate.setMonth(releaseDate.getMonth() + 3);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = releaseDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [releaseDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success message
    setSubmitted(true);
    
    // Reset form
    setEmail("");
    
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Time unit display component
  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div 
        className={`w-16 h-16 md:w-20 md:h-20 rounded-xl ${
          isHovered ? "bg-gradient-to-br from-purple-heart to-royal-blue" : "neumorph-flat"
        } flex items-center justify-center transition-all duration-300 mb-2`}
      >
        <span className={`text-2xl md:text-3xl font-bold ${isHovered ? "text-white" : "gradient-text"}`}>
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs uppercase dark:text-gray-400 text-gray-600">
        {label}
      </span>
    </div>
  );

  return (
    <section id="coming-soon" className="py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1 px-3 text-sm font-medium bg-purple-heart/10 text-purple-heart rounded-full mb-4">
              Coming Soon
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              New Features <span className="gradient-text">On The Way</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We're working on exciting new features to enhance your healthcare experience. 
              Be the first to know when they launch.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Countdown and form */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="right">
              <div 
                className="mb-12"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <h3 className="text-xl md:text-2xl font-bold mb-8 text-center">
                  Launching In
                </h3>
                <div className="flex justify-center gap-4">
                  <TimeUnit value={countdown.days} label="Days" />
                  <TimeUnit value={countdown.hours} label="Hours" />
                  <TimeUnit value={countdown.minutes} label="Minutes" />
                  <TimeUnit value={countdown.seconds} label="Seconds" />
                </div>
              </div>

              <div className="rounded-2xl p-8 neumorph-flat">
                {!submitted ? (
                  <>
                    <h3 className="text-xl font-bold mb-4">
                      Get Notified When We Launch
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Join our waitlist to be the first to experience our new features and receive
                      exclusive early access.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-heart"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="interests" className="block text-sm font-medium mb-2">
                          I'm interested in (optional)
                        </label>
                        <select
                          id="interests"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-heart"
                        >
                          <option value="">Select your interest</option>
                          <option value="patient">Patient Features</option>
                          <option value="provider">Provider Features</option>
                          <option value="ai">AI Capabilities</option>
                          <option value="all">All Updates</option>
                        </select>
                      </div>
                      <Button
                        type="submit"
                        className="w-full justify-center bg-gradient-to-r from-purple-heart to-royal-blue text-white"
                      >
                        Notify Me
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8 text-green-600 dark:text-green-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      You're now on our waitlist. We'll notify you when we launch.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-purple-heart underline hover:text-royal-blue"
                    >
                      Sign up with another email
                    </button>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Right side - illustration */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-heart/10 rounded-full filter blur-3xl opacity-60 animate-pulse-slow"></div>
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-royal-blue/10 rounded-full filter blur-3xl opacity-60 animate-pulse-slow"></div>

                <div className="relative z-10">
                  {/* Feature preview cards - staggered layout */}
                  <div className="mb-6 transform translate-x-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl neumorph-flat">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
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
                              d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">Predictive Care Planning</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            AI-driven health predictions and personalized care recommendations
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 transform -translate-x-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl neumorph-flat">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-royal-blue"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">Health Data Passport</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Securely share your health records with any provider instantly
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="transform translate-x-12">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl neumorph-flat">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-green-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">Virtual Care Navigator</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Personalized healthcare journey mapping with integrated appointment booking
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* "Coming soon" badge */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center rotate-12 shadow-lg">
                    <span className="text-white font-bold text-sm text-center">
                      Coming<br />Soon
                    </span>
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