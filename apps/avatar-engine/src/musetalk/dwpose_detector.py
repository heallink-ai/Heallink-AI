"""
DWPose Detector for MuseTalk
Handles face detection and pose estimation using MediaPipe as a reliable alternative to DWPose.
Note: Full DWPose integration would require MMPose which has complex dependencies.
"""

import cv2
import numpy as np
import torch
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from loguru import logger


class DWPoseDetector:
    """
    DWPose detector for face and pose estimation.
    This is a simplified implementation - full DWPose requires MMPose setup.
    """
    
    def __init__(self, device: str = "cuda"):
        """Initialize DWPose detector."""
        self.device = torch.device(device)
        self.is_initialized = False
        
        # Face detector (using MediaPipe as a more reliable alternative)
        self.face_detector = None
        self.pose_detector = None
        
    async def initialize(self):
        """Initialize the detectors."""
        try:
            logger.info("Initializing DWPose detector...")
            
            # Initialize MediaPipe face detection as a reliable alternative
            import mediapipe as mp
            self.mp_face_detection = mp.solutions.face_detection
            self.mp_face_mesh = mp.solutions.face_mesh
            self.mp_drawing = mp.solutions.drawing_utils
            
            # Initialize face detection
            self.face_detector = self.mp_face_detection.FaceDetection(
                model_selection=1,  # 0 for short-range, 1 for full-range
                min_detection_confidence=0.5
            )
            
            # Initialize face mesh for detailed landmarks
            self.face_mesh = self.mp_face_mesh.FaceMesh(
                max_num_faces=1,
                refine_landmarks=True,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )
            
            self.is_initialized = True
            logger.info("DWPose detector initialized (using MediaPipe)")
            
        except ImportError:
            logger.warning("MediaPipe not available, falling back to OpenCV")
            # Fallback to OpenCV
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.face_detector = cv2.CascadeClassifier(cascade_path)
            self.is_initialized = True
            
        except Exception as e:
            logger.error(f"Failed to initialize DWPose detector: {e}")
            raise
    
    def detect_face(self, image: np.ndarray) -> Optional[Dict[str, Any]]:
        """
        Detect face in image and return bounding box and landmarks.
        
        Args:
            image: Input image (BGR format)
            
        Returns:
            Dictionary containing:
                - bbox: (x1, y1, x2, y2) bounding box
                - landmarks: facial landmarks
                - confidence: detection confidence
        """
        if not self.is_initialized:
            raise RuntimeError("DWPose detector not initialized")
            
        try:
            h, w = image.shape[:2]
            
            if hasattr(self, 'mp_face_detection'):
                # MediaPipe detection
                rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                results = self.face_detector.process(rgb_image)
                
                if results.detections:
                    detection = results.detections[0]
                    bbox = detection.location_data.relative_bounding_box
                    
                    # Convert relative coordinates to absolute
                    x1 = int(bbox.xmin * w)
                    y1 = int(bbox.ymin * h)
                    x2 = int((bbox.xmin + bbox.width) * w)
                    y2 = int((bbox.ymin + bbox.height) * h)
                    
                    # Get face mesh landmarks
                    mesh_results = self.face_mesh.process(rgb_image)
                    landmarks = []
                    
                    if mesh_results.multi_face_landmarks:
                        for landmark in mesh_results.multi_face_landmarks[0].landmark:
                            landmarks.append([landmark.x * w, landmark.y * h])
                    
                    return {
                        "bbox": (x1, y1, x2, y2),
                        "landmarks": np.array(landmarks) if landmarks else None,
                        "confidence": detection.score[0] if detection.score else 0.9
                    }
                    
            else:
                # OpenCV fallback
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                faces = self.face_detector.detectMultiScale(
                    gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
                )
                
                if len(faces) > 0:
                    # Get the largest face
                    x, y, w_face, h_face = max(faces, key=lambda f: f[2] * f[3])
                    
                    return {
                        "bbox": (x, y, x + w_face, y + h_face),
                        "landmarks": None,  # OpenCV doesn't provide landmarks
                        "confidence": 0.8  # Default confidence
                    }
            
            return None
            
        except Exception as e:
            logger.error(f"Face detection failed: {e}")
            return None
    
    def extract_face_region(
        self, 
        image: np.ndarray, 
        bbox: Tuple[int, int, int, int],
        padding: float = 0.2
    ) -> np.ndarray:
        """
        Extract face region with padding.
        
        Args:
            image: Input image
            bbox: (x1, y1, x2, y2) bounding box
            padding: Padding ratio to add around face
            
        Returns:
            Cropped face image
        """
        x1, y1, x2, y2 = bbox
        w, h = x2 - x1, y2 - y1
        
        # Add padding
        pad_w = int(w * padding)
        pad_h = int(h * padding)
        
        # Expand region with padding
        x1 = max(0, x1 - pad_w)
        y1 = max(0, y1 - pad_h)
        x2 = min(image.shape[1], x2 + pad_w)
        y2 = min(image.shape[0], y2 + pad_h)
        
        # Extract and resize to standard size
        face_region = image[y1:y2, x1:x2]
        face_region = cv2.resize(face_region, (256, 256))
        
        return face_region
    
    def get_mouth_mask(
        self, 
        landmarks: Optional[np.ndarray], 
        image_shape: Tuple[int, int]
    ) -> np.ndarray:
        """
        Generate mouth region mask from landmarks.
        
        Args:
            landmarks: Facial landmarks
            image_shape: (height, width) of the image
            
        Returns:
            Binary mask for mouth region
        """
        h, w = image_shape
        mask = np.zeros((h, w), dtype=np.uint8)
        
        if landmarks is not None and len(landmarks) >= 468:
            # MediaPipe face mesh has 468 landmarks
            # Mouth landmarks: outer lips (61-67, 84-90, 95-102, 178-184, 191-198, 267-273, 302-308, 311-318)
            mouth_indices = list(range(61, 68)) + list(range(84, 91)) + \
                          list(range(95, 103)) + list(range(178, 185)) + \
                          list(range(191, 199)) + list(range(267, 274)) + \
                          list(range(302, 309)) + list(range(311, 319))
            
            mouth_points = landmarks[mouth_indices].astype(np.int32)
            cv2.fillPoly(mask, [mouth_points], 255)
            
        else:
            # Fallback: create a rectangular mask in the lower third of face
            # This is a rough approximation when landmarks aren't available
            mask[int(h * 0.6):int(h * 0.85), int(w * 0.3):int(w * 0.7)] = 255
            
        return mask
    
    def cleanup(self):
        """Clean up resources."""
        if hasattr(self, 'face_detector') and self.face_detector:
            if hasattr(self.face_detector, 'close'):
                self.face_detector.close()
        if hasattr(self, 'face_mesh') and self.face_mesh:
            if hasattr(self.face_mesh, 'close'):
                self.face_mesh.close()