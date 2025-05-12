import Link from "next/link";

export const metadata = {
  title: "Legal Information | HealLink",
  description: "Legal information, terms, and policies for the HealLink healthcare platform",
};

export default function LegalPage() {
  return (
    <main className="bg-background text-foreground pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">Legal Information</h1>
          
          <p className="light-text-contrast text-lg mb-12">
            At HealLink, we are committed to transparency and compliance with all relevant healthcare and data 
            protection regulations. Below you will find our legal documents that outline how we operate, 
            how we protect your data, and the terms of using our platform.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-card overflow-hidden border border-border group hover:border-primary transition-colors duration-300">
              <div className="h-48 bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-24 h-24 text-white"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" 
                  />
                </svg>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 gradient-text">Terms of Service</h2>
                <p className="light-text-contrast mb-6">
                  Our Terms of Service outline the rules and guidelines for using the HealLink platform, 
                  including your rights and responsibilities as a user.
                </p>
                <Link 
                  href="/legal/terms" 
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Read Terms
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-5 h-5 ml-2"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" 
                    />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="rounded-xl bg-card overflow-hidden border border-border group hover:border-primary transition-colors duration-300">
              <div className="h-48 bg-gradient-to-br from-royal-blue to-purple-heart flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-24 h-24 text-white"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" 
                  />
                </svg>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 gradient-text">Privacy Policy</h2>
                <p className="light-text-contrast mb-6">
                  Our Privacy Policy explains how we collect, use, and protect your personal information, 
                  including health data, when you use the HealLink platform.
                </p>
                <Link 
                  href="/legal/privacy" 
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Read Privacy Policy
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-5 h-5 ml-2"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" 
                    />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Additional legal documents can be added here with placeholders */}
            <div className="rounded-xl bg-card overflow-hidden border border-border group hover:border-muted transition-colors duration-300 opacity-70">
              <div className="h-48 bg-gradient-to-br from-muted to-accent flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-24 h-24 text-white/80"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" 
                  />
                </svg>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 gradient-text">Cookie Policy</h2>
                <p className="light-text-contrast mb-6">
                  Details about how we use cookies and similar tracking technologies on our platform, 
                  and how you can control them.
                </p>
                <span className="inline-flex items-center px-6 py-3 rounded-xl bg-muted text-muted-foreground">
                  Coming Soon
                </span>
              </div>
            </div>
            
            <div className="rounded-xl bg-card overflow-hidden border border-border group hover:border-muted transition-colors duration-300 opacity-70">
              <div className="h-48 bg-gradient-to-br from-accent to-muted flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-24 h-24 text-white/80"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" 
                  />
                </svg>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 gradient-text">GDPR Compliance</h2>
                <p className="light-text-contrast mb-6">
                  Information about our compliance with the General Data Protection Regulation (GDPR) 
                  and how we protect the rights of EU users.
                </p>
                <span className="inline-flex items-center px-6 py-3 rounded-xl bg-muted text-muted-foreground">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 p-8 rounded-xl neumorph-flat bg-card">
            <h2 className="text-2xl font-semibold mb-4 gradient-text">Need Help?</h2>
            <p className="light-text-contrast mb-6">
              If you have questions about our legal documents or need assistance regarding privacy, 
              data protection, or legal matters, please contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:legal@heallink.io" 
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" 
                  />
                </svg>
                Email Legal Team
              </a>
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 rounded-xl border border-primary text-primary hover:bg-primary/10 transition-colors"
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
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" 
                  />
                </svg>
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}