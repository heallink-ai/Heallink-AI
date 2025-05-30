"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  color?: string;
  isDestructive?: boolean;
  disabled?: boolean;
}

export interface ActionGroup {
  items: ActionItem[];
  showDivider?: boolean;
}

interface ActionMenuProps {
  groups: ActionGroup[];
  triggerIcon?: React.ReactNode;
  triggerLabel?: string;
  triggerClassName?: string;
  id?: string;
  disabled?: boolean;
}

export default function ActionMenu({
  groups,
  triggerIcon = <MoreVertical size={16} />,
  triggerLabel = "Actions",
  triggerClassName = "p-2 rounded-full hover:bg-[color:var(--accent)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-opacity-50",
  id = `action-menu-${Math.random().toString(36).substring(2, 9)}`,
  disabled = false,
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    right: 0,
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = id;

  // Create portal container when component mounts
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      setPortalContainer(document.body);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  // Calculate and set dropdown position when it opens
  const calculateMenuPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0, right: 0 };

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    // Position calculation
    const top = buttonRect.bottom + scrollY;
    const left = buttonRect.left + scrollX;
    const right = window.innerWidth - buttonRect.right - scrollX;

    // Check if we need to show above the button (if near bottom of screen)
    const menuHeight =
      45 *
        Math.min(
          8,
          groups.reduce((acc, group) => acc + group.items.length, 0)
        ) +
      (groups.length - 1) * 10; // Approx height based on items count

    if (buttonRect.bottom + menuHeight > window.innerHeight) {
      return {
        top: buttonRect.top + scrollY - menuHeight,
        left,
        right,
      };
    }

    return { top, left, right };
  };

  // Toggle dropdown and calculate position
  const toggleMenu = () => {
    console.log("ActionMenu toggle clicked, disabled:", disabled, "isOpen:", isOpen);
    if (disabled) return;

    if (!isOpen) {
      const position = calculateMenuPosition();
      setMenuPosition(position);
    }
    setIsOpen(!isOpen);
  };

  // Close menu when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click was outside both menu and button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on window resize or scroll
  useEffect(() => {
    const handleCloseEvents = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleCloseEvents);
    window.addEventListener("scroll", handleCloseEvents, true);

    return () => {
      window.removeEventListener("resize", handleCloseEvents);
      window.removeEventListener("scroll", handleCloseEvents, true);
    };
  }, [isOpen]);

  // Calculate menu style
  const getMenuStyle = () => {
    // Check if dropdown would go off right edge of screen
    const viewportWidth = window.innerWidth;
    const menuRight = menuPosition.left + 192; // 192px = typical dropdown width

    const style: React.CSSProperties = {
      position: "absolute",
      top: `${menuPosition.top}px`,
      zIndex: 9999,
      width: "192px", // w-48 = 12rem = 192px
      maxWidth: "calc(100vw - 20px)",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    };

    if (menuRight > viewportWidth) {
      // Position from right if it would overflow
      style.right = `${menuPosition.right}px`;
    } else {
      // Position from left (default)
      style.left = `${menuPosition.left}px`;
    }

    console.log("Menu style:", style);
    return style;
  };

  return (
    <div className="inline-block" ref={menuRef}>
      <button
        ref={buttonRef}
        className={triggerClassName}
        onClick={(e) => {
          console.log("ActionMenu button clicked! Event:", e);
          e.preventDefault();
          e.stopPropagation();
          toggleMenu();
        }}
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="menu"
        disabled={disabled}
      >
        {triggerIcon}
      </button>

      {isOpen &&
        portalContainer && (
        console.log("Rendering ActionMenu portal, groups:", groups),
        createPortal(
          <div
            id={menuId}
            role="menu"
            className="rounded-md shadow-lg bg-[color:var(--card)] border border-[color:var(--border)]"
            style={getMenuStyle()}
            onKeyDown={handleKeyDown}
          >
            {groups.map((group, groupIndex) => (
              <React.Fragment key={`group-${groupIndex}`}>
                {groupIndex > 0 && group.showDivider && (
                  <div
                    className="border-t border-[color:var(--border)] my-1"
                    role="separator"
                  ></div>
                )}

                <div className="py-1" role="none">
                  {group.items.map((item, itemIndex) => (
                    <button
                      key={`item-${groupIndex}-${itemIndex}`}
                      className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20 focus:bg-[color:var(--accent)]/30 focus:outline-none ${
                        item.disabled
                          ? "opacity-50 cursor-not-allowed"
                          : item.isDestructive
                            ? "text-red-600 dark:text-red-400"
                            : item.color || ""
                      }`}
                      onClick={(e) => {
                        console.log("ActionMenu item clicked:", item.label, "disabled:", item.disabled);
                        e.preventDefault();
                        e.stopPropagation();
                        if (!item.disabled) {
                          console.log("Calling item.onClick for:", item.label);
                          try {
                            item.onClick();
                            console.log("Successfully called onClick for:", item.label);
                          } catch (error) {
                            console.error("Error calling onClick for", item.label, ":", error);
                          }
                          setIsOpen(false);
                        }
                      }}
                      role="menuitem"
                      disabled={item.disabled}
                    >
                      {item.icon && (
                        <span className="mr-2 flex-shrink-0">{item.icon}</span>
                      )}
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>,
          portalContainer
        ))}
    </div>
  );
}
