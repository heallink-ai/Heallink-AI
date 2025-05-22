"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Link as LinkIcon,
  Crop,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X,
  Image as ImageIcon,
  Save,
  Trash2,
  RefreshCw,
} from "lucide-react";
import ReactCrop, { Crop as CropType, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => Promise<void>;
  currentImageUrl?: string;
  isUploading?: boolean;
}

// Tab button component
interface TabButtonProps {
  label: string;
  icon: JSX.Element; // Changed from React.ReactNode to fix type issue
  active: boolean;
  onClick: () => void;
}

function TabButton({ label, icon, active, onClick }: TabButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
        ${active ? "bg-primary text-white shadow-md" : "hover:bg-primary/10"}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onSave,
  currentImageUrl,
  isUploading = false,
}: ImageUploadModalProps) {
  // Remove the unused theme variable
  const [activeTab, setActiveTab] = useState<
    "upload" | "camera" | "url" | "edit"
  >("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // For image editing
  const [crop, setCrop] = useState<CropType>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initial setup - show current image if available
  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }

    // Cleanup function to release camera stream when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentImageUrl, cameraStream]);

  // Reset error message when changing tabs
  useEffect(() => {
    setErrorMessage(null);
  }, [activeTab]);

  // Keyboard event handler for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside modal to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      setErrorMessage(
        "Please select a valid image file (JPEG, PNG, GIF, WEBP)"
      );
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setPendingFile(file);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      // Validate file is an image
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        setErrorMessage(
          "Please drop a valid image file (JPEG, PNG, GIF, WEBP)"
        );
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setPendingFile(file);
        setErrorMessage(null);
        setActiveTab("edit");
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraReady(true);
        setErrorMessage(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMessage(
        "Could not access camera. Please ensure you've granted camera permissions."
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsCameraReady(false);
    }
  };

  const capturePhoto = () => {
    if (!isCameraReady || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL then to File
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", {
            type: "image/jpeg",
          });
          setPendingFile(file);

          const fileUrl = URL.createObjectURL(blob);
          setPreviewUrl(fileUrl);

          // Switch to edit tab after capture
          setActiveTab("edit");

          // Stop camera since we've captured a photo
          stopCamera();
        }
      },
      "image/jpeg",
      0.9
    );
  };

  // URL image functions
  const fetchImageFromUrl = async () => {
    if (!imageUrl.trim()) {
      setErrorMessage("Please enter an image URL");
      return;
    }

    try {
      setErrorMessage("Loading image...");

      // Fetch the image
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error("The URL does not point to a valid image");
      }

      const blob = await response.blob();

      // Validate file size (5MB limit)
      if (blob.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB");
      }

      // Create a File from the Blob
      const fileName = imageUrl.split("/").pop() || "image.jpg";
      const file = new File([blob], fileName, { type: contentType });
      setPendingFile(file);

      // Create and set preview URL
      const fileUrl = URL.createObjectURL(blob);
      setPreviewUrl(fileUrl);

      // Clear error and switch to edit tab
      setErrorMessage(null);
      setActiveTab("edit");
    } catch (error) {
      console.error("Error fetching image:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch image"
      );
    }
  };

  // Image editing functions
  const onImageLoad = useCallback((img: HTMLImageElement) => {
    imageRef.current = img;

    // Reset crop to center of the image and reasonable size
    const width = Math.min(80, (img.width / img.height) * 80);
    setCrop({
      unit: "%",
      width,
      height: width,
      x: (100 - width) / 2,
      y: (100 - width) / 2,
    });
  }, []);

  const rotateImage = (direction: "clockwise" | "counterclockwise") => {
    const delta = direction === "clockwise" ? 90 : -90;
    setRotation((prev) => (prev + delta) % 360);
  };

  const adjustZoom = (direction: "in" | "out") => {
    const delta = direction === "in" ? 0.1 : -0.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const resetImageEdits = () => {
    setCrop({
      unit: "%",
      width: 100,
      height: 100,
      x: 0,
      y: 0,
    });
    setRotation(0);
    setZoom(1);
  };

  // Generate edited image file
  const generateEditedImage = () => {
    if (!imageRef.current || !completedCrop || !previewCanvasRef.current)
      return null;

    const image = imageRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Calculate cropped image dimensions
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas dimensions to the cropped area size
    const pixelRatio = window.devicePixelRatio;
    canvas.width = completedCrop.width * scaleX * pixelRatio;
    canvas.height = completedCrop.height * scaleY * pixelRatio;

    // Scale canvas context
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    // Calculate the center point for rotation
    const centerX = image.width / 2;
    const centerY = image.height / 2;

    // Save the context state before transformations
    ctx.save();

    // Translate to center, rotate, scale, and translate back
    ctx.translate(
      canvas.width / (2 * pixelRatio),
      canvas.height / (2 * pixelRatio)
    );
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-centerX, -centerY);

    // Draw the image with the crop applied
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      -completedCrop.width / 2,
      -completedCrop.height / 2,
      completedCrop.width,
      completedCrop.height
    );

    // Restore context state
    ctx.restore();

    // Convert canvas to Blob/File
    return new Promise<File>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File(
              [blob],
              pendingFile?.name || "edited-image.jpg",
              {
                type: "image/jpeg",
              }
            );
            resolve(file);
          }
        },
        "image/jpeg",
        0.9
      );
    });
  };

  // Save the final image
  const handleSaveImage = async () => {
    if (activeTab === "edit" && completedCrop) {
      try {
        const editedFile = await generateEditedImage();
        if (editedFile) {
          await onSave(editedFile);
          onClose();
        }
      } catch (error) {
        console.error("Error saving edited image:", error);
        setErrorMessage("Failed to save the edited image");
      }
    } else if (pendingFile) {
      try {
        await onSave(pendingFile);
        onClose();
      } catch (error) {
        console.error("Error saving image:", error);
        setErrorMessage("Failed to save the image");
      }
    }
  };

  // Clear all selections
  const handleClearImage = () => {
    setPreviewUrl(currentImageUrl || null);
    setPendingFile(null);
    setErrorMessage(null);
    setActiveTab("upload");
    setImageUrl("");
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  };

  // Main component render
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          ref={modalRef}
          className="relative mx-auto max-w-3xl w-full rounded-2xl bg-background p-6 shadow-2xl sm:p-8"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text">
              Profile Picture
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full p-1.5 hover:bg-primary/10"
              onClick={onClose}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex items-center justify-center space-x-4 border-b border-primary/10 pb-4">
            <TabButton
              label="Upload"
              icon={<Upload size={18} />}
              active={activeTab === "upload"}
              onClick={() => setActiveTab("upload")}
            />
            <TabButton
              label="Camera"
              icon={<Camera size={18} />}
              active={activeTab === "camera"}
              onClick={() => {
                setActiveTab("camera");
                startCamera();
              }}
            />
            <TabButton
              label="URL"
              icon={<LinkIcon size={18} />}
              active={activeTab === "url"}
              onClick={() => setActiveTab("url")}
            />
            {previewUrl && (
              <TabButton
                label="Edit"
                icon={<Crop size={18} />}
                active={activeTab === "edit"}
                onClick={() => setActiveTab("edit")}
              />
            )}
          </div>

          {/* Content area */}
          <div className="mb-6">
            {/* Upload tab */}
            {activeTab === "upload" && (
              <div
                className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 
                  ${isDragging ? "border-primary bg-primary/5" : "border-primary/30"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative mb-4 h-48 w-48 overflow-hidden rounded-full">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      sizes="192px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-4 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <ImageIcon size={32} className="text-primary" />
                    </div>
                    <p className="text-lg font-medium">
                      Drag & drop your image here
                    </p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      or click to browse (JPEG, PNG, GIF, WEBP up to 5MB)
                    </p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white shadow-lg hover:bg-primary/90"
                  onClick={triggerFileInput}
                >
                  <Upload size={16} />
                  <span>Choose Image</span>
                </motion.button>
              </div>
            )}

            {/* Camera tab */}
            {activeTab === "camera" && (
              <div className="flex flex-col items-center">
                <div className="relative mb-4 h-64 w-full max-w-md overflow-hidden rounded-lg bg-black">
                  {isCameraReady ? (
                    <video
                      ref={videoRef}
                      className="h-full w-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <p className="text-white">Camera is starting...</p>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full bg-primary p-4 text-white shadow-lg hover:bg-primary/90 disabled:opacity-50"
                  onClick={capturePhoto}
                  disabled={!isCameraReady}
                >
                  <Camera size={24} />
                </motion.button>

                {/* Hidden canvas for capturing photos */}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {/* URL tab */}
            {activeTab === "url" && (
              <div className="flex flex-col items-center">
                <div className="mb-4 w-full max-w-md">
                  <label
                    htmlFor="imageUrl"
                    className="mb-2 block text-sm font-medium"
                  >
                    Image URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="imageUrl"
                      type="url"
                      className="w-full rounded-lg border border-primary/30 bg-background p-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-white shadow-lg hover:bg-primary/90"
                      onClick={fetchImageFromUrl}
                    >
                      <LinkIcon size={16} />
                      <span>Fetch</span>
                    </motion.button>
                  </div>
                </div>

                {previewUrl && (
                  <div className="relative h-48 w-48 overflow-hidden rounded-full">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      sizes="192px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Edit tab */}
            {activeTab === "edit" && previewUrl && (
              <div className="flex flex-col items-center">
                <div className="relative mb-4 w-full max-w-md overflow-hidden rounded-lg">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1} // Force 1:1 aspect ratio for avatars
                    circularCrop // Make it a circular crop
                  >
                    <Image
                      ref={(img) => {
                        if (img) {
                          imageRef.current = img;
                        }
                      }}
                      src={previewUrl}
                      alt="Edit preview"
                      width={400}
                      height={400}
                      className="max-h-96 w-full object-contain"
                      onLoad={(e) => onImageLoad(e.currentTarget)}
                      style={{
                        transform: `rotate(${rotation}deg) scale(${zoom})`,
                        transformOrigin: "center",
                      }}
                    />
                  </ReactCrop>
                </div>

                {/* Edit tools */}
                <div className="mb-4 flex items-center justify-center space-x-3 rounded-lg bg-primary/5 p-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10"
                    onClick={() => rotateImage("counterclockwise")}
                  >
                    <RotateCcw size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10"
                    onClick={() => rotateImage("clockwise")}
                  >
                    <RotateCw size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10"
                    onClick={() => adjustZoom("out")}
                  >
                    <ZoomOut size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10"
                    onClick={() => adjustZoom("in")}
                  >
                    <ZoomIn size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10"
                    onClick={resetImageEdits}
                  >
                    <RefreshCw size={20} />
                  </motion.button>
                </div>

                {/* Hidden canvas for final image creation */}
                <canvas ref={previewCanvasRef} className="hidden" />
              </div>
            )}

            {/* Error message */}
            {errorMessage && (
              <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-500/10"
              onClick={handleClearImage}
              disabled={isUploading}
            >
              <Trash2 size={16} />
              <span>Clear</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white shadow-lg hover:bg-primary/90 disabled:opacity-50"
              onClick={handleSaveImage}
              disabled={!pendingFile || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
