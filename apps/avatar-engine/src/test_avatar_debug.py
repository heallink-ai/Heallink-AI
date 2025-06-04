#!/usr/bin/env python3
"""
Debug script to test 3D avatar rendering in isolation.
This helps identify if the issue is in rendering or LiveKit streaming.
"""

import asyncio
import sys
import os
from pathlib import Path
import cv2
import numpy as np

# Add src to path
sys.path.append(str(Path(__file__).parent / "src"))

from config.settings import AvatarConfig
from renderer.avatar_renderer import AvatarModel, AvatarRenderer

async def test_glb_loading():
    """Test GLB model loading in isolation."""
    print("🔍 Testing GLB model loading...")
    
    glb_path = Path("/app/assets/models/doctor_avatar_1.glb")
    if not glb_path.exists():
        print(f"❌ GLB file not found: {glb_path}")
        return None
    
    model = AvatarModel("doctor_avatar_1", glb_path)
    await model.load()
    
    if model.is_loaded:
        print(f"✅ GLB loaded: {len(model.vertices)} vertices, {len(model.faces)} faces")
        
        # Print vertex bounds for debugging
        if model.vertices is not None:
            min_bounds = np.min(model.vertices, axis=0)
            max_bounds = np.max(model.vertices, axis=0)
            print(f"📐 Vertex bounds: min={min_bounds}, max={max_bounds}")
            
            # Check if vertices are reasonable
            if np.max(np.abs(model.vertices)) < 0.01:
                print("⚠️  Vertices seem very small - scaling might be needed")
            elif np.max(np.abs(model.vertices)) > 100:
                print("⚠️  Vertices seem very large - scaling might be needed")
        
        return model
    else:
        print("❌ Failed to load GLB model")
        return None

async def test_avatar_rendering():
    """Test avatar rendering and save debug frame."""
    print("\n🎨 Testing avatar rendering...")
    
    # Create config with debug enabled
    config = AvatarConfig()
    config.debug = True
    config.debug_wireframe = True
    config.debug_vertices = True
    
    # Create renderer
    renderer = AvatarRenderer("doctor_avatar_1", config)
    await renderer.initialize()
    
    # Render a test frame
    frame = await renderer.render_frame()
    
    if frame is not None:
        print(f"✅ Frame rendered: {frame.shape}")
        
        # Save debug frame
        output_path = "debug_avatar_frame.png"
        cv2.imwrite(output_path, frame)
        print(f"💾 Debug frame saved: {output_path}")
        
        # Analyze frame contents
        unique_colors = len(np.unique(frame.reshape(-1, frame.shape[-1]), axis=0))
        print(f"🎨 Frame has {unique_colors} unique colors")
        
        # Check if frame is just background
        if unique_colors < 10:
            print("⚠️  Frame seems to have very few colors - avatar might not be rendering")
        
        # Check color distribution
        avg_color = np.mean(frame, axis=(0, 1))
        print(f"🎭 Average frame color (BGR): {avg_color}")
        
        return frame
    else:
        print("❌ Failed to render frame")
        return None

async def test_face_rendering():
    """Test individual face rendering to debug triangle issues."""
    print("\n🔺 Testing individual face rendering...")
    
    model = await test_glb_loading()
    if not model:
        return
    
    # Create a simple test frame
    width, height = 640, 480
    test_frame = np.full((height, width, 3), (90, 60, 40), dtype=np.uint8)
    
    if model.vertices is not None and model.faces is not None:
        # Test rendering first few faces manually
        deformed_vertices = model.apply_blend_shapes({})
        
        if len(deformed_vertices) > 0:
            # Manual projection for debugging
            scale = min(width, height) * 0.4
            center_x, center_y = width // 2, height // 2
            
            projected_vertices = []
            for vertex in deformed_vertices:
                x = int(center_x + vertex[0] * scale)
                y = int(center_y - vertex[1] * scale)
                projected_vertices.append([x, y])
            
            projected_vertices = np.array(projected_vertices, dtype=np.int32)
            
            # Render first 10 faces with different colors for debugging
            colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 0), (255, 0, 255)]
            faces_rendered = 0
            
            for i, face in enumerate(model.faces[:10]):  # Only first 10 faces
                if len(face) >= 3:
                    v1, v2, v3 = face[0], face[1], face[2]
                    
                    if (v1 < len(projected_vertices) and v2 < len(projected_vertices) and 
                        v3 < len(projected_vertices)):
                        
                        pts = np.array([
                            projected_vertices[v1],
                            projected_vertices[v2], 
                            projected_vertices[v3]
                        ], dtype=np.int32)
                        
                        # Use different color for each face
                        color = colors[i % len(colors)]
                        cv2.fillPoly(test_frame, [pts], color)
                        
                        # Draw wireframe
                        cv2.polylines(test_frame, [pts], True, (255, 255, 255), 2)
                        
                        faces_rendered += 1
            
            print(f"✅ Rendered {faces_rendered} test faces")
            
            # Save debug face frame
            cv2.imwrite("debug_faces.png", test_frame)
            print("💾 Debug faces saved: debug_faces.png")
            
            # Also draw all vertex points
            vertex_frame = test_frame.copy()
            for i, vertex in enumerate(projected_vertices[:50]):  # First 50 vertices
                cv2.circle(vertex_frame, tuple(vertex), 3, (255, 255, 255), -1)
                cv2.putText(vertex_frame, str(i), (vertex[0]+5, vertex[1]), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1)
            
            cv2.imwrite("debug_vertices.png", vertex_frame)
            print("💾 Debug vertices saved: debug_vertices.png")

async def main():
    """Main debug function."""
    print("🚀 Starting Avatar Debug Session")
    print("=" * 50)
    
    try:
        # Test 1: GLB Loading
        model = await test_glb_loading()
        
        # Test 2: Full rendering
        frame = await test_avatar_rendering()
        
        # Test 3: Individual face rendering
        await test_face_rendering()
        
        print("\n" + "=" * 50)
        print("🎯 Debug Summary:")
        print("1. Check debug_avatar_frame.png for full rendering result")
        print("2. Check debug_faces.png for individual face rendering")
        print("3. Check debug_vertices.png for vertex positioning")
        print("\nIf all files show content, the issue is in LiveKit streaming.")
        print("If files are empty/background only, the issue is in 3D rendering.")
        
    except Exception as e:
        print(f"❌ Debug failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())