"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "warning";
  disabled?: boolean;
  closeOnClick?: boolean; // New prop to control closing behavior
}

export interface DropdownGroup {
  items: DropdownItem[];
  label?: string;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  groups: DropdownGroup[];
  align?: "start" | "end";
  className?: string;
  disabled?: boolean;
}

export default function DropdownMenu({
  trigger,
  groups,
  align = "end",
  className = "",
  disabled = false,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Calculate position when opening
  const calculatePosition = () => {
    if (!triggerRef.current) return { top: 0, left: 0, right: 0 };

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportWidth = window.innerWidth;
    
    const top = rect.bottom + scrollY + 4; // 4px gap
    const left = rect.left + scrollX;
    const right = viewportWidth - rect.right - scrollX;

    return { top, left, right };
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (disabled) return;
    
    if (!isOpen) {
      setPosition(calculatePosition());
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown
  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Handle item click
  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    
    // Call the item's onClick handler
    item.onClick();
    
    // Close dropdown only if closeOnClick is true (default)
    if (item.closeOnClick !== false) {
      closeDropdown();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        menuRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeDropdown();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Close on scroll
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => closeDropdown();
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }
  }, [isOpen]);

  const getMenuStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      top: `${position.top}px`,
      zIndex: 50000,
      minWidth: "200px",
      maxWidth: "280px",
    };

    if (align === "end") {
      baseStyle.right = `${position.right}px`;
    } else {
      baseStyle.left = `${position.left}px`;
    }

    return baseStyle;
  };

  const getItemVariantClasses = (variant: DropdownItem["variant"]) => {
    switch (variant) {
      case "destructive":
        return "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50";
      case "warning":
        return "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50";
      default:
        return "text-[color:var(--foreground)] hover:bg-[color:var(--accent)]";
    }
  };

  return (
    <>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={toggleDropdown}
        className={`inline-flex cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      >
        {trigger}
      </div>

      {/* Dropdown Menu Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={getMenuStyle()}
            className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {groups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.label && (
                  <div className="px-4 py-2 text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider bg-[color:var(--muted)]/20">
                    {group.label}
                  </div>
                )}
                
                <div className="py-1">
                  {group.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                      disabled={item.disabled}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150
                        ${getItemVariantClasses(item.variant)}
                        ${item.disabled 
                          ? "opacity-50 cursor-not-allowed" 
                          : "cursor-pointer"
                        }
                        focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-inset
                      `}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0 w-4 h-4">
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-grow text-left">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Divider between groups */}
                {groupIndex < groups.length - 1 && (
                  <div className="border-t border-[color:var(--border)]" />
                )}
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}