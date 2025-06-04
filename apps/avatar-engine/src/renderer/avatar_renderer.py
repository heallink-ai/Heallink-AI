"""
AvatarRenderer - 3D Avatar Rendering Engine

This module provides real-time 3D avatar rendering with support for:
- Facial animation and expressions
- Lip syncing
- Background scenes
- Real-time performance optimization
"""

import asyncio
import time
from typing import Optional, Dict, Any, List, Tuple
from pathlib import Path
import json

import numpy as np
import cv2
from loguru import logger

from config.settings import AvatarConfig


class BlendShapeData:
    """Container for facial blend shape data."""
    
    def __init__(self):
        self.mouth_shapes: Dict[str, float] = {}
        self.emotion_shapes: Dict[str, float] = {}
        self.eye_shapes: Dict[str, float] = {}
        self.timestamp: float = time.time()


class AvatarModel:
    """Represents a 3D avatar model with animation capabilities."""
    
    def __init__(self, model_id: str, model_path: Path):
        self.model_id = model_id
        self.model_path = model_path
        self.is_loaded = False
        
        # Model data
        self.vertices: Optional[np.ndarray] = None
        self.faces: Optional[np.ndarray] = None
        self.textures: Dict[str, Any] = {}
        self.face_materials: Optional[np.ndarray] = None  # Material index per face
        self.materials: Dict[str, Dict[str, Any]] = {}  # Material properties
        
        # Animation data
        self.blend_shapes: Dict[str, np.ndarray] = {}
        self.current_weights: Dict[str, float] = {}
        
        # Camera and framing data
        self.head_to_waist_height: float = 1.0
        self.camera_target_center: np.ndarray = np.array([0, 0, 0])
        
        # Metadata
        self.metadata: Dict[str, Any] = {}
    
    async def load(self) -> None:
        """Load avatar model from file."""
        logger.info(f"Loading avatar model: {self.model_id}")
        
        try:
            # Try to load actual GLB model first
            from pathlib import Path
            glb_path = Path("/app/assets/models") / f"{self.model_id}.glb"
            if glb_path.exists():
                await self._load_glb_model(glb_path)
                logger.info(f"Loaded GLB model: {glb_path}")
            else:
                # Fallback to placeholder if GLB not found
                logger.warning(f"GLB model not found at {glb_path}, using placeholder")
                await self._create_placeholder_model()
            
            self.is_loaded = True
            logger.info(f"Avatar model loaded successfully: {self.model_id}")
            
        except Exception as e:
            logger.error(f"Failed to load avatar model {self.model_id}: {e}")
            # Fall back to placeholder on any error
            try:
                await self._create_placeholder_model()
                self.is_loaded = True
                logger.info(f"Using placeholder model for {self.model_id}")
            except Exception as fallback_error:
                logger.error(f"Even placeholder model failed: {fallback_error}")
                raise
    
    async def _load_glb_model(self, glb_path: Path) -> None:
        """Load GLB model using trimesh and combine all mesh parts."""
        try:
            import trimesh
            import numpy as np
            
            logger.info(f"Loading GLB model from: {glb_path}")
            
            # Load the GLB file
            scene = trimesh.load(str(glb_path))
            
            if isinstance(scene, trimesh.Scene):
                # GLB contains multiple objects, combine all mesh parts
                if len(scene.geometry) > 0:
                    logger.info(f"Found {len(scene.geometry)} mesh parts in GLB: {list(scene.geometry.keys())}")
                    
                    all_vertices = []
                    all_faces = []
                    all_face_materials = []
                    vertex_offset = 0
                    material_id = 0
                    
                    # Combine all mesh parts into a single mesh
                    for name, mesh in scene.geometry.items():
                        if hasattr(mesh, 'vertices') and hasattr(mesh, 'faces'):
                            logger.info(f"Processing mesh part '{name}': {len(mesh.vertices)} vertices, {len(mesh.faces)} faces")
                            
                            # Debug: Check for visual attributes that might contain textures/colors
                            if hasattr(mesh, 'visual'):
                                logger.info(f"  - {name} has visual attributes: {type(mesh.visual)}")
                                if hasattr(mesh.visual, 'material'):
                                    logger.info(f"  - {name} has material: {type(mesh.visual.material)}")
                                if hasattr(mesh.visual, 'vertex_colors'):
                                    logger.info(f"  - {name} has vertex_colors: shape {mesh.visual.vertex_colors.shape if mesh.visual.vertex_colors is not None else None}")
                                if hasattr(mesh.visual, 'face_colors'):
                                    logger.info(f"  - {name} has face_colors: shape {mesh.visual.face_colors.shape if mesh.visual.face_colors is not None else None}")
                            
                            # Add vertices
                            all_vertices.append(mesh.vertices.astype(np.float32))
                            
                            # Add faces with vertex offset
                            offset_faces = mesh.faces.astype(np.uint32) + vertex_offset
                            all_faces.append(offset_faces)
                            
                            # Extract material information
                            material_color = self._extract_mesh_material(name, mesh)
                            self.materials[name] = material_color
                            
                            # Assign material ID to all faces of this mesh
                            face_materials = np.full(len(mesh.faces), material_id, dtype=np.uint32)
                            all_face_materials.append(face_materials)
                            
                            # Update offsets
                            vertex_offset += len(mesh.vertices)
                            material_id += 1
                    
                    if all_vertices:
                        # Combine all vertices, faces, and materials
                        self.vertices = np.vstack(all_vertices)
                        self.faces = np.vstack(all_faces)
                        self.face_materials = np.hstack(all_face_materials)
                        logger.info(f"Combined all mesh parts: {len(self.vertices)} total vertices, {len(self.faces)} total faces, {len(self.materials)} materials")
                    else:
                        raise ValueError("No valid meshes found in GLB file")
                else:
                    raise ValueError("No geometry found in GLB file")
            elif hasattr(scene, 'vertices') and hasattr(scene, 'faces'):
                # Single mesh object
                self.vertices = scene.vertices.astype(np.float32)
                self.faces = scene.faces.astype(np.uint32)
                logger.info(f"Loaded single mesh: {len(self.vertices)} vertices, {len(self.faces)} faces")
            else:
                raise ValueError("Loaded GLB is not a valid mesh")
            
            # Normalize and center the model
            self._normalize_model_vertices()
            
            # Extract texture information if available
            if hasattr(scene, 'visual') and scene.visual is not None:
                if hasattr(scene.visual, 'material'):
                    self.textures = {"material": scene.visual.material}
            
            # Create basic blend shapes for facial animation
            await self._create_facial_blend_shapes()
            
            logger.info(f"GLB model loaded and normalized: {len(self.vertices)} vertices, {len(self.faces)} faces")
            logger.info(f"Model bounds: X[{self.vertices[:,0].min():.3f}, {self.vertices[:,0].max():.3f}], Y[{self.vertices[:,1].min():.3f}, {self.vertices[:,1].max():.3f}], Z[{self.vertices[:,2].min():.3f}, {self.vertices[:,2].max():.3f}]")
            
        except ImportError:
            logger.error("trimesh library not available, falling back to placeholder")
            raise
        except Exception as e:
            logger.error(f"Error loading GLB model: {e}")
            raise
    
    def _normalize_model_vertices(self) -> None:
        """Normalize model vertices to fit within a standard coordinate system."""
        if self.vertices is None or len(self.vertices) == 0:
            return
            
        # Get model bounds
        min_bounds = self.vertices.min(axis=0)
        max_bounds = self.vertices.max(axis=0)
        
        # Center the model at origin
        center = (min_bounds + max_bounds) / 2
        self.vertices -= center
        
        # Scale model to fit within a unit cube (with some padding)
        scale_factor = 2.0 / np.max(max_bounds - min_bounds)
        self.vertices *= scale_factor
        
        logger.info(f"Model normalized: center offset {center}, scale factor {scale_factor:.3f}")
        
        # Apply production-ready camera framing for head-to-waist view
        self._setup_head_to_waist_framing()
    
    def _setup_head_to_waist_framing(self) -> None:
        """
        Production-ready head-to-waist camera framing.
        Sets up optimal camera positioning to show head to waist region.
        """
        if self.vertices is None:
            return
            
        # Find head and waist positions
        y_coords = self.vertices[:, 1]
        y_min, y_max = np.min(y_coords), np.max(y_coords)
        
        # Define head-to-waist region (top 60% of the model)
        waist_y = y_min + 0.4 * (y_max - y_min)
        head_y = y_max
        
        # Calculate the center point of the head-to-waist region
        target_center_y = (head_y + waist_y) / 2
        
        # Shift the model so the head-to-waist center is at the frame center
        # We want the head-to-waist region to be centered in the frame
        self.vertices[:, 1] -= target_center_y
        
        # Store framing information for rendering
        self.head_to_waist_height = head_y - waist_y
        self.camera_target_center = np.array([0, 0, 0])  # Model center after adjustment
        
        logger.info(f"Head-to-waist framing setup: height = {self.head_to_waist_height:.3f}, center adjusted by {target_center_y:.3f}")
    
    def _detect_avatar_front_direction(self) -> np.ndarray:
        """
        Detect the front-facing direction by analyzing head mesh normals.
        Returns the average direction the face is pointing.
        """
        # Find head vertices (upper portion of the model)
        head_threshold = np.mean(self.vertices[:, 1]) + 0.3 * (np.max(self.vertices[:, 1]) - np.mean(self.vertices[:, 1]))
        head_vertices_mask = self.vertices[:, 1] > head_threshold
        
        # Get face normals for head region
        face_normals = []
        face_centers = []
        
        for face in self.faces:
            if len(face) >= 3:
                v1, v2, v3 = face[0], face[1], face[2]
                
                # Check if this face is in the head region
                if (head_vertices_mask[v1] or head_vertices_mask[v2] or head_vertices_mask[v3]):
                    # Calculate face normal
                    edge1 = self.vertices[v2] - self.vertices[v1]
                    edge2 = self.vertices[v3] - self.vertices[v1]
                    normal = np.cross(edge1, edge2)
                    
                    # Normalize
                    normal_length = np.linalg.norm(normal)
                    if normal_length > 0:
                        normal = normal / normal_length
                        face_normals.append(normal)
                        
                        # Calculate face center
                        center = (self.vertices[v1] + self.vertices[v2] + self.vertices[v3]) / 3
                        face_centers.append(center)
        
        if not face_normals:
            logger.warning("Could not detect face normals, using default front direction")
            return np.array([0, 0, 1])  # Default forward direction
        
        face_normals = np.array(face_normals)
        face_centers = np.array(face_centers)
        
        # Find the dominant front-facing direction
        # The front of the face typically has normals pointing outward in the same general direction
        
        # Filter for forward-facing normals (positive Z component indicates front-facing in most cases)
        forward_mask = face_normals[:, 2] > 0
        forward_normals = face_normals[forward_mask]
        
        if len(forward_normals) == 0:
            # If no forward normals, the avatar might be facing backwards
            # Use the dominant direction
            dominant_direction = np.mean(face_normals, axis=0)
        else:
            # Use the average of forward-facing normals
            dominant_direction = np.mean(forward_normals, axis=0)
        
        # Normalize the direction
        dominant_direction = dominant_direction / np.linalg.norm(dominant_direction)
        
        logger.info(f"Detected avatar front direction: {dominant_direction}")
        return dominant_direction
    
    def _calculate_rotation_to_face_forward(self, current_front_direction: np.ndarray) -> float:
        """
        Calculate the Y-axis rotation angle needed to make the avatar face forward (positive Z).
        """
        target_direction = np.array([0, 0, 1])  # Forward direction (toward camera)
        
        # Project both directions onto the XZ plane (ignore Y component)
        current_xz = np.array([current_front_direction[0], 0, current_front_direction[2]])
        target_xz = np.array([target_direction[0], 0, target_direction[2]])
        
        # Normalize
        current_xz = current_xz / (np.linalg.norm(current_xz) + 1e-8)
        target_xz = target_xz / (np.linalg.norm(target_xz) + 1e-8)
        
        # Calculate angle between current and target direction
        dot_product = np.dot(current_xz, target_xz)
        dot_product = np.clip(dot_product, -1.0, 1.0)  # Prevent numerical errors
        
        angle = np.arccos(dot_product)
        
        # Determine rotation direction using cross product
        cross_product = np.cross(current_xz, target_xz)
        if cross_product < 0:
            angle = -angle
        
        return angle
    
    def _apply_y_rotation(self, angle_radians: float) -> None:
        """Apply Y-axis rotation to avatar vertices."""
        if self.vertices is None:
            return
            
        cos_angle = np.cos(angle_radians)
        sin_angle = np.sin(angle_radians)
        
        rotation_matrix = np.array([
            [cos_angle,  0, -sin_angle],
            [0,          1, 0         ],
            [sin_angle,  0, cos_angle ]
        ])
        
        # Apply rotation to all vertices
        self.vertices = np.dot(self.vertices, rotation_matrix.T)
    
    def _setup_camera_framing(self) -> None:
        """
        Set up camera positioning for optimal head-to-waist framing.
        Adjusts the model position and scale for the best view.
        """
        if self.vertices is None:
            return
            
        # Find head and waist positions
        y_coords = self.vertices[:, 1]
        y_min, y_max = np.min(y_coords), np.max(y_coords)
        
        # Define head-to-waist region (top 60% of the model)
        waist_y = y_min + 0.4 * (y_max - y_min)
        head_y = y_max
        
        # Calculate the center point of the head-to-waist region
        target_center_y = (head_y + waist_y) / 2
        
        # Shift the model so the head-to-waist center is at the frame center
        # We want the head-to-waist region to be centered in the frame
        self.vertices[:, 1] -= target_center_y
        
        # Store framing information for rendering
        self.head_to_waist_height = head_y - waist_y
        self.camera_target_center = np.array([0, 0, 0])  # Model center after adjustment
        
        logger.info(f"Camera framing setup: head-to-waist height = {self.head_to_waist_height:.3f}")
    
    def _extract_mesh_material(self, mesh_name: str, mesh) -> Dict[str, Any]:
        """Extract material properties from a mesh part with proper texture/color loading."""
        # Fallback colors only if material extraction completely fails
        fallback_colors = {
            'Wolf3D_Head': {'base_color': [139, 104, 75], 'type': 'skin'},   # African skin tone
            'Wolf3D_Body': {'base_color': [139, 104, 75], 'type': 'skin'},   # African skin tone
            'EyeLeft': {'base_color': [255, 255, 255], 'type': 'eye'},       # White eye
            'EyeRight': {'base_color': [255, 255, 255], 'type': 'eye'},      # White eye
            'Wolf3D_Teeth': {'base_color': [255, 255, 240], 'type': 'teeth'}, # Off-white teeth
            'Wolf3D_Hair': {'base_color': [35, 31, 32], 'type': 'hair'},     # Dark hair
            'Wolf3D_Outfit_Top': {'base_color': [45, 85, 125], 'type': 'clothing'}, # Dark blue
            'Wolf3D_Outfit_Bottom': {'base_color': [65, 65, 65], 'type': 'clothing'}, # Dark gray
            'Wolf3D_Outfit_Footwear': {'base_color': [45, 35, 25], 'type': 'clothing'}, # Dark brown
        }
        
        # Start with fallback but prioritize actual material extraction
        material_info = {'base_color': [139, 104, 75], 'type': 'default', 'texture': None}  # African skin as default
        
        # Try to extract actual material colors and textures
        material_extracted = False
        
        if hasattr(mesh, 'visual') and mesh.visual is not None:
            try:
                # Check for vertex colors first (often more accurate)
                if hasattr(mesh.visual, 'vertex_colors') and mesh.visual.vertex_colors is not None:
                    # Use average vertex color if available
                    avg_color = mesh.visual.vertex_colors.mean(axis=0)[:3] * 255
                    material_info['base_color'] = [int(avg_color[2]), int(avg_color[1]), int(avg_color[0])]  # BGR
                    material_extracted = True
                    logger.info(f"Extracted vertex colors for {mesh_name}: {material_info['base_color']}")
                
                # Check for face colors
                elif hasattr(mesh.visual, 'face_colors') and mesh.visual.face_colors is not None:
                    avg_color = mesh.visual.face_colors.mean(axis=0)[:3] * 255
                    material_info['base_color'] = [int(avg_color[2]), int(avg_color[1]), int(avg_color[0])]  # BGR
                    material_extracted = True
                    logger.info(f"Extracted face colors for {mesh_name}: {material_info['base_color']}")
                
                # Try material properties
                elif hasattr(mesh.visual, 'material'):
                    material = mesh.visual.material
                    
                    # Check for base color factor (glTF standard)
                    if hasattr(material, 'baseColorFactor') and material.baseColorFactor is not None:
                        rgba = material.baseColorFactor
                        material_info['base_color'] = [int(rgba[2] * 255), int(rgba[1] * 255), int(rgba[0] * 255)]
                        material_extracted = True
                        logger.info(f"Extracted baseColorFactor for {mesh_name}: {material_info['base_color']}")
                    
                    # Check for diffuse color
                    elif hasattr(material, 'diffuse') and material.diffuse is not None:
                        if len(material.diffuse) >= 3:
                            material_info['base_color'] = [int(material.diffuse[2] * 255), int(material.diffuse[1] * 255), int(material.diffuse[0] * 255)]
                            material_extracted = True
                            logger.info(f"Extracted diffuse color for {mesh_name}: {material_info['base_color']}")
                    
                    # Check for texture information
                    if hasattr(material, 'baseColorTexture') and material.baseColorTexture is not None:
                        material_info['texture'] = material.baseColorTexture
                        logger.info(f"Found texture for {mesh_name}")
                        
            except Exception as e:
                logger.warning(f"Material extraction failed for {mesh_name}: {e}")
        
        # Use fallback colors only if extraction completely failed
        if not material_extracted:
            fallback = fallback_colors.get(mesh_name, {'base_color': [139, 104, 75], 'type': 'default'})
            material_info.update(fallback)
            logger.info(f"Using fallback colors for {mesh_name}: {material_info['base_color']}")
        
        # Ensure mesh name type is stored
        if mesh_name in fallback_colors:
            material_info['type'] = fallback_colors[mesh_name]['type']
        
        logger.info(f"Final material for {mesh_name}: {material_info}")
        return material_info
    
    
    async def _create_facial_blend_shapes(self) -> None:
        """Create basic blend shapes for facial animation."""
        if self.vertices is None:
            return
            
        # Create simple blend shapes based on vertex positions
        # This is a simplified approach - in production you'd load actual blend shapes from the GLB
        
        # Mouth open blend shape (move lower vertices down)
        mouth_open = np.copy(self.vertices)
        # Find vertices likely to be mouth area (lower face)
        center_y = np.mean(self.vertices[:, 1])
        mouth_vertices = self.vertices[:, 1] < center_y - 0.1
        mouth_open[mouth_vertices, 1] -= 0.05  # Move mouth vertices down
        
        self.blend_shapes["mouth_open"] = mouth_open - self.vertices
        
        # Smile blend shape (widen mouth area)
        smile = np.copy(self.vertices)
        smile[mouth_vertices, 0] *= 1.1  # Widen mouth area
        self.blend_shapes["smile"] = smile - self.vertices
        
        # Other basic expressions
        self.blend_shapes["brow_up"] = np.zeros_like(self.vertices)
        self.blend_shapes["eye_blink"] = np.zeros_like(self.vertices)
        
        logger.info(f"Created {len(self.blend_shapes)} facial blend shapes")
    
    async def _create_placeholder_model(self) -> None:
        """Create a placeholder 3D model for testing."""
        # Create simple cube vertices (placeholder)
        self.vertices = np.array([
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],  # Front face
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]       # Back face
        ], dtype=np.float32)
        
        # Create simple faces
        self.faces = np.array([
            [0, 1, 2], [0, 2, 3],  # Front face
            [4, 5, 6], [4, 6, 7],  # Back face
            [0, 1, 5], [0, 5, 4],  # Bottom face
            [2, 3, 7], [2, 7, 6],  # Top face
            [0, 3, 7], [0, 7, 4],  # Left face
            [1, 2, 6], [1, 6, 5]   # Right face
        ], dtype=np.uint32)
        
        # Create placeholder blend shapes for mouth movements
        self.blend_shapes = {
            "mouth_open": np.random.random((len(self.vertices), 3)) * 0.1,
            "mouth_smile": np.random.random((len(self.vertices), 3)) * 0.1,
            "mouth_frown": np.random.random((len(self.vertices), 3)) * 0.1,
            "eyebrows_up": np.random.random((len(self.vertices), 3)) * 0.1,
            "eyebrows_down": np.random.random((len(self.vertices), 3)) * 0.1,
        }
        
        # Initialize weights
        self.current_weights = {shape: 0.0 for shape in self.blend_shapes.keys()}
    
    def apply_blend_shapes(self, weights: Dict[str, float]) -> np.ndarray:
        """
        Apply blend shape weights to get deformed vertices.
        
        Args:
            weights: Dictionary of blend shape weights
            
        Returns:
            Deformed vertices array
        """
        if not self.is_loaded or self.vertices is None:
            return np.array([])
        
        # Start with base vertices
        deformed_vertices = self.vertices.copy()
        
        # Apply blend shapes
        for shape_name, weight in weights.items():
            if shape_name in self.blend_shapes and weight > 0:
                blend_shape = self.blend_shapes[shape_name]
                deformed_vertices += blend_shape * weight
        
        return deformed_vertices


class AvatarRenderer:
    """
    Main 3D avatar renderer with real-time animation support.
    """
    
    def __init__(self, avatar_id: str, config: AvatarConfig):
        """
        Initialize the avatar renderer.
        
        Args:
            avatar_id: Unique identifier for the avatar
            config: Avatar engine configuration
        """
        self.avatar_id = avatar_id
        self.config = config
        
        # Rendering state
        self.is_initialized = False
        self.is_rendering = False
        
        # Avatar model
        self.avatar_model: Optional[AvatarModel] = None
        
        # Current blend shape data
        self.current_blend_shapes = BlendShapeData()
        
        # Background and scene
        self.current_background = config.default_background
        self.background_image: Optional[np.ndarray] = None
        
        # Rendering settings
        self.resolution = self._parse_resolution(config.video.resolution)
        self.fps = config.video.fps
        
        # Performance tracking
        self.frame_count = 0
        self.render_times: List[float] = []
        
        logger.info(f"AvatarRenderer initialized for avatar: {self.avatar_id}")
    
    async def initialize(self) -> None:
        """Initialize the avatar renderer."""
        try:
            logger.info(f"Initializing avatar renderer: {self.avatar_id}")
            
            # Load avatar model
            await self._load_avatar_model()
            
            # Load background
            await self._load_background()
            
            # Initialize rendering pipeline
            await self._initialize_rendering_pipeline()
            
            self.is_initialized = True
            logger.info(f"Avatar renderer initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize avatar renderer: {e}")
            raise
    
    async def render_frame(self) -> Optional[np.ndarray]:
        """
        Render a single frame of the avatar.
        
        Returns:
            Rendered frame as numpy array (BGR format) or None if failed
        """
        if not self.is_initialized:
            logger.warning("Avatar renderer not initialized")
            return None
        
        start_time = time.time()
        
        try:
            # Create frame buffer
            frame = self._create_frame_buffer()
            
            # Render background
            if self.background_image is not None:
                frame = self._render_background(frame)
            
            # Render avatar
            frame = await self._render_avatar(frame)
            
            # Post-processing
            frame = self._apply_post_processing(frame)
            
            # Update performance metrics
            render_time = time.time() - start_time
            self._update_performance_metrics(render_time)
            
            self.frame_count += 1
            
            return frame
            
        except Exception as e:
            logger.error(f"Error rendering frame: {e}")
            return None
    
    async def update_mouth_animation(self, lip_sync_data: Dict[str, Any]) -> None:
        """
        Update mouth animation based on lip sync data.
        
        Args:
            lip_sync_data: Lip sync data containing mouth shape weights
        """
        if not self.is_initialized:
            return
        
        try:
            # Update mouth blend shapes
            mouth_shapes = lip_sync_data.get("mouth_shapes", {})
            
            for shape_name, weight in mouth_shapes.items():
                if shape_name in self.current_blend_shapes.mouth_shapes:
                    self.current_blend_shapes.mouth_shapes[shape_name] = weight
            
            self.current_blend_shapes.timestamp = time.time()
            
            logger.debug(f"Updated mouth animation: {len(mouth_shapes)} shapes")
            
        except Exception as e:
            logger.error(f"Error updating mouth animation: {e}")
    
    async def update_facial_expression(self, emotion_data: Dict[str, Any]) -> None:
        """
        Update facial expression based on emotion data.
        
        Args:
            emotion_data: Emotion data containing expression weights
        """
        if not self.is_initialized:
            return
        
        try:
            # Update emotion blend shapes
            emotion_shapes = emotion_data.get("emotion_shapes", {})
            
            for shape_name, weight in emotion_shapes.items():
                self.current_blend_shapes.emotion_shapes[shape_name] = weight
            
            self.current_blend_shapes.timestamp = time.time()
            
            logger.debug(f"Updated facial expression: {len(emotion_shapes)} shapes")
            
        except Exception as e:
            logger.error(f"Error updating facial expression: {e}")
    
    async def set_background(self, background_id: str) -> None:
        """
        Change the background scene.
        
        Args:
            background_id: Background scene identifier
        """
        try:
            logger.info(f"Changing background to: {background_id}")
            
            self.current_background = background_id
            await self._load_background()
            
            logger.info(f"Background changed successfully")
            
        except Exception as e:
            logger.error(f"Error changing background: {e}")
            raise
    
    async def cleanup(self) -> None:
        """Cleanup renderer resources."""
        logger.info("Cleaning up avatar renderer")
        
        self.is_rendering = False
        self.is_initialized = False
        
        # Cleanup GPU resources if any
        # TODO: Implement GPU resource cleanup
        
        logger.info("Avatar renderer cleanup complete")
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """
        Get rendering performance metrics.
        
        Returns:
            Dictionary containing performance metrics
        """
        avg_render_time = np.mean(self.render_times) if self.render_times else 0.0
        
        return {
            "frame_count": self.frame_count,
            "avg_render_time_ms": avg_render_time * 1000,
            "current_fps": 1.0 / avg_render_time if avg_render_time > 0 else 0.0,
            "target_fps": self.fps,
            "resolution": f"{self.resolution[0]}x{self.resolution[1]}",
            "is_initialized": self.is_initialized,
            "avatar_id": self.avatar_id
        }
    
    async def _load_avatar_model(self) -> None:
        """Load the 3D avatar model."""
        model_path = self.config.models_path / f"{self.avatar_id}.json"
        
        # Create avatar model instance
        self.avatar_model = AvatarModel(self.avatar_id, model_path)
        
        # Load the model
        await self.avatar_model.load()
        
        logger.info(f"Avatar model loaded: {self.avatar_id}")
    
    async def _load_background(self) -> None:
        """Load background image/scene."""
        background_path = self.config.assets_path / "backgrounds" / f"{self.current_background}.jpg"
        
        if background_path.exists():
            # Load background image
            self.background_image = cv2.imread(str(background_path))
            if self.background_image is not None:
                # Resize to match rendering resolution
                self.background_image = cv2.resize(
                    self.background_image,
                    self.resolution
                )
        else:
            # Create solid color background - changed to proper blue color
            self.background_image = np.full(
                (self.resolution[1], self.resolution[0], 3),
                (90, 60, 40),  # BGR format: Blue=90, Green=60, Red=40 (blue background)
                dtype=np.uint8
            )
        
        logger.debug(f"Background loaded: {self.current_background}")
    
    async def _initialize_rendering_pipeline(self) -> None:
        """Initialize the 3D rendering pipeline."""
        # TODO: Initialize actual 3D rendering pipeline
        # This would typically involve:
        # - Setting up OpenGL/WebGL context
        # - Loading shaders
        # - Setting up lighting
        # - Configuring camera
        
        logger.debug("Rendering pipeline initialized")
    
    def _create_frame_buffer(self) -> np.ndarray:
        """Create empty frame buffer."""
        return np.zeros(
            (self.resolution[1], self.resolution[0], 3),
            dtype=np.uint8
        )
    
    def _render_background(self, frame: np.ndarray) -> np.ndarray:
        """Render background into frame."""
        if self.background_image is not None:
            frame[:] = self.background_image
        return frame
    
    async def _render_avatar(self, frame: np.ndarray) -> np.ndarray:
        """Render 3D avatar into frame."""
        if not self.avatar_model or not self.avatar_model.is_loaded:
            return frame
        
        try:
            # Get current blend shape weights
            all_weights = {
                **self.current_blend_shapes.mouth_shapes,
                **self.current_blend_shapes.emotion_shapes,
                **self.current_blend_shapes.eye_shapes
            }
            
            # Apply blend shapes to get deformed vertices
            deformed_vertices = self.avatar_model.apply_blend_shapes(all_weights)
            
            # Render 3D mesh
            await self._render_3d_mesh(frame, deformed_vertices)
            
            return frame
            
        except Exception as e:
            logger.error(f"Error rendering avatar: {e}")
            return frame
    
    def _apply_post_processing(self, frame: np.ndarray) -> np.ndarray:
        """Apply post-processing effects to the frame."""
        # TODO: Implement post-processing effects like:
        # - Anti-aliasing
        # - Color correction
        # - Lighting effects
        # - Depth of field
        
        return frame
    
    def _update_performance_metrics(self, render_time: float) -> None:
        """Update performance metrics."""
        self.render_times.append(render_time)
        
        # Keep only last 100 render times for rolling average
        if len(self.render_times) > 100:
            self.render_times.pop(0)
    
    async def _render_3d_mesh(self, frame: np.ndarray, deformed_vertices: np.ndarray) -> None:
        """
        Render 3D mesh using software rasterization.
        
        Args:
            frame: Target frame buffer to render into
            deformed_vertices: 3D vertices after applying blend shapes
        """
        if not self.avatar_model or not self.avatar_model.is_loaded:
            return
            
        if deformed_vertices.size == 0 or self.avatar_model.faces is None:
            return
            
        try:
            # Basic 3D to 2D projection with improved scaling
            height, width = frame.shape[:2]
            
            # Calculate scale based on head-to-waist region for optimal framing
            if len(deformed_vertices) > 0 and hasattr(self.avatar_model, 'head_to_waist_height'):
                # Use head-to-waist height for scaling to ensure good framing
                target_height_pixels = height * 0.8  # Use 80% of screen height
                scale = target_height_pixels / self.avatar_model.head_to_waist_height
                
                # Ensure minimum scale for visibility
                min_scale = min(width, height) * 0.3
                scale = max(scale, min_scale)
            else:
                # Fallback to original scaling method
                model_bounds = np.max(deformed_vertices, axis=0) - np.min(deformed_vertices, axis=0)
                max_dimension = np.max(model_bounds[:2])  # Use X,Y dimensions
                
                if max_dimension > 0:
                    scale = min(width, height) * 0.4 / max_dimension
                else:
                    scale = min(width, height) * 0.4
            
            center_x = width // 2
            center_y = int(height * 0.45)  # Move avatar up slightly to show head/shoulders better
            
            # Project 3D vertices to 2D screen coordinates
            projected_vertices = np.zeros((len(deformed_vertices), 2), dtype=np.int32)
            
            for i, vertex in enumerate(deformed_vertices):
                # Simple orthographic projection with Z-offset for better positioning
                x = int(center_x + vertex[0] * scale)
                y = int(center_y - vertex[1] * scale)  # Flip Y axis
                
                # Clamp to screen bounds
                x = np.clip(x, 0, width - 1)
                y = np.clip(y, 0, height - 1)
                
                projected_vertices[i] = [x, y]
            
            # Render triangular faces with proper materials and Z-depth sorting
            material_names = list(self.avatar_model.materials.keys())
            
            # Create face data with Z-depth for proper sorting
            face_data = []
            for face_idx, face in enumerate(self.avatar_model.faces):
                if len(face) >= 3:
                    v1, v2, v3 = face[0], face[1], face[2]
                    if v1 < len(deformed_vertices) and v2 < len(deformed_vertices) and v3 < len(deformed_vertices):
                        # Calculate face center Z-depth for sorting
                        face_center_z = (deformed_vertices[v1][2] + deformed_vertices[v2][2] + deformed_vertices[v3][2]) / 3
                        face_data.append((face_idx, face, face_center_z))
            
            # Sort faces by Z-depth (back to front for proper layering)
            face_data.sort(key=lambda x: x[2])  # Sort by Z-depth
            
            # Render faces in proper depth order
            for face_idx, face, _ in face_data:  # _ for unused face_z
                # Get triangle vertices (already validated in sorting)
                v1, v2, v3 = face[0], face[1], face[2]
                
                pts = np.array([
                    projected_vertices[v1],
                    projected_vertices[v2], 
                    projected_vertices[v3]
                ], dtype=np.int32)
                
                # Basic lighting calculation
                # Calculate face normal for lighting and culling
                edge1 = deformed_vertices[v2] - deformed_vertices[v1]
                edge2 = deformed_vertices[v3] - deformed_vertices[v1]
                normal = np.cross(edge1, edge2)
                
                # Normalize if possible
                normal_length = np.linalg.norm(normal)
                if normal_length > 0:
                    normal = normal / normal_length
                else:
                    continue  # Skip degenerate triangles
                
                # Simple directional lighting (light from front-top-left)
                light_dir = np.array([0.3, 0.5, 1.0])
                light_dir = light_dir / np.linalg.norm(light_dir)
                
                # Back-face culling: skip faces pointing away from camera
                # Face normal pointing toward camera (positive Z) should be rendered
                if normal[2] <= 0:
                    continue  # Skip back-facing triangles
                
                # Calculate lighting intensity
                light_intensity = max(0.4, np.dot(normal, light_dir))
                
                # Get material color for this face
                if (self.avatar_model.face_materials is not None and 
                    face_idx < len(self.avatar_model.face_materials) and 
                    len(material_names) > 0):
                    
                    material_idx = self.avatar_model.face_materials[face_idx]
                    if material_idx < len(material_names):
                        material_name = material_names[material_idx]
                        material_info = self.avatar_model.materials[material_name]
                        base_color = np.array(material_info['base_color'])
                    else:
                        base_color = np.array([220, 200, 180])  # Default skin tone
                else:
                    base_color = np.array([220, 200, 180])  # Default skin tone
                
                # Apply lighting with minimum brightness to ensure visibility
                light_intensity = max(0.5, light_intensity)  # Increased minimum lighting
                face_color = (base_color * light_intensity).astype(np.uint8)
                face_color = tuple(int(c) for c in face_color)
                
                # Draw filled triangle with anti-aliasing (NO wireframes in production)
                cv2.fillPoly(frame, [pts], face_color, lineType=cv2.LINE_AA)
            
            logger.info(f"🎯 Rendered 3D mesh: {len(deformed_vertices)} vertices, {len(self.avatar_model.faces)} faces, scale: {scale:.2f}")
            
            # Add debug information overlay
            if hasattr(self.config, 'debug') and self.config.debug:
                debug_text = f"Vertices: {len(deformed_vertices)} | Faces: {len(self.avatar_model.faces)} | Scale: {scale:.2f}"
                cv2.putText(frame, debug_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            
        except Exception as e:
            logger.error(f"Error rendering 3D mesh: {e}")
            # Improved fallback: render a visible placeholder
            center_x, center_y = frame.shape[1] // 2, frame.shape[0] // 2
            
            # Draw a larger, more visible placeholder
            cv2.circle(frame, (center_x, center_y), 100, (180, 160, 140), -1)  # Main circle
            cv2.circle(frame, (center_x, center_y), 100, (255, 255, 255), 3)   # White border
            
            # Add error text
            cv2.putText(frame, "Avatar Error", (center_x - 60, center_y - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            cv2.putText(frame, "Check Logs", (center_x - 50, center_y + 20), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
    def _parse_resolution(self, resolution_str: str) -> Tuple[int, int]:
        """Parse resolution string to width, height tuple."""
        resolution_map = {
            "720p": (1280, 720),
            "1080p": (1920, 1080),
            "1440p": (2560, 1440),
            "4K": (3840, 2160)
        }
        
        return resolution_map.get(resolution_str, (1920, 1080))