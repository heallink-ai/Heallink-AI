"use client";

import React from "react";

export default function GeospatialMap() {
  // In a real application, this would be integrated with a mapping library like MapBox or Google Maps API
  // For now, we'll create a stylized placeholder

  return (
    <div className="bg-[color:var(--card)] rounded-xl p-5 neumorph-flat">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">Provider Distribution</h2>
        <div className="flex gap-2">
          <select
            className="text-xs rounded-md px-2 py-1 bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
            defaultValue="all"
          >
            <option value="all">All Providers</option>
            <option value="hospitals">Hospitals</option>
            <option value="clinics">Clinics</option>
            <option value="pharmacies">Pharmacies</option>
          </select>
        </div>
      </div>

      <div className="relative h-80 overflow-hidden rounded-lg neumorph-pressed flex items-center justify-center">
        {/* Placeholder map with gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--card)]">
          {/* Grid lines for map-like appearance */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              opacity: 0.3,
            }}
          ></div>

          {/* Placeholder provider locations */}
          <div
            className="absolute h-2 w-2 rounded-full bg-purple-heart animate-pulse-slow"
            style={{ top: "30%", left: "25%" }}
          ></div>
          <div
            className="absolute h-3 w-3 rounded-full bg-purple-heart animate-pulse-slow"
            style={{ top: "40%", left: "35%" }}
          ></div>
          <div
            className="absolute h-4 w-4 rounded-full bg-purple-heart animate-pulse-slow"
            style={{ top: "35%", left: "55%" }}
          ></div>
          <div
            className="absolute h-2 w-2 rounded-full bg-purple-heart animate-pulse-slow"
            style={{ top: "60%", left: "65%" }}
          ></div>
          <div
            className="absolute h-2 w-2 rounded-full bg-purple-heart animate-pulse-slow"
            style={{ top: "70%", left: "30%" }}
          ></div>
          <div
            className="absolute h-3 w-3 rounded-full bg-purple-heart animate-pulse-slow"
            style={{ top: "45%", left: "75%" }}
          ></div>
          <div
            className="absolute h-2 w-2 rounded-full bg-purple-heart animate-pulse-slow"
            style={{ top: "25%", left: "85%" }}
          ></div>
          <div
            className="absolute h-3 w-3 rounded-full bg-purple-heart animate-pulse-slow"
            style={{ top: "55%", left: "15%" }}
          ></div>
        </div>

        {/* Map overlay message */}
        <div className="relative z-10 text-center px-6 py-4 rounded-md bg-[color:var(--card)]/80 neumorph-flat backdrop-blur-sm">
          <p className="text-sm text-[color:var(--foreground)]">
            Interactive map showing provider locations
          </p>
          <p className="text-xs mt-1 text-[color:var(--muted-foreground)]">
            Actual implementation would use MapBox or Google Maps API
          </p>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[color:var(--card)] neumorph-flat">
            <span className="text-lg">+</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[color:var(--card)] neumorph-flat">
            <span className="text-lg">−</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-purple-heart"></div>
          <span>Hospital</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-royal-blue"></div>
          <span>Clinic</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-havelock-blue"></div>
          <span>Pharmacy</span>
        </div>
      </div>
    </div>
  );
}
