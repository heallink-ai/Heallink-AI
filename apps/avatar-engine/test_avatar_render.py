#!/usr/bin/env python3
"""
Avatar Rendering Test Script
===========================
This script tests the avatar rendering functionality to debug issues.
"""

import asyncio
import sys
import numpy as np
import cv2
from pathlib import Path

# Add the src directory to Python path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

from config.settings import AvatarConfig
from renderer.avatar_renderer import AvatarRenderer, AvatarModel

async def test_avatar_loading():
    """Test loading and basic rendering of the avatar model."""
    print("🔧 Testing Avatar Engine Rendering...")
    
    # Create config with debug enabled
    config = AvatarConfig()
    config.debug = True
    config.debug_wireframe = True
    config.debug_overlay = True
    config.assets_path = Path("assets")
    config.models_path = Path("assets/models")
    
    try:
        # Test avatar model loading
        print("\n📦 Testing Avatar Model Loading...")
        avatar_model = AvatarModel("doctor_avatar_1", config.models_path / "doctor_avatar_1.json")
        await avatar_model.load()
        
        if avatar_model.is_loaded:
            print(f"✅ Avatar model loaded successfully!")
            print(f"   Vertices: {len(avatar_model.vertices)}")
            print(f"   Faces: {len(avatar_model.faces)}")
            print(f"   Vertex bounds: X[{avatar_model.vertices[:,0].min():.3f}, {avatar_model.vertices[:,0].max():.3f}]")
            print(f"                  Y[{avatar_model.vertices[:,1].min():.3f}, {avatar_model.vertices[:,1].max():.3f}]")
            print(f"                  Z[{avatar_model.vertices[:,2].min():.3f}, {avatar_model.vertices[:,2].max():.3f}]")
        else:
            print("❌ Failed to load avatar model")
            return False
        
        # Test avatar renderer
        print("\n🎨 Testing Avatar Renderer...")
        renderer = AvatarRenderer("doctor_avatar_1", config)
        await renderer.initialize()
        
        if renderer.is_initialized:
            print("✅ Avatar renderer initialized successfully!")
            
            # Render a test frame
            print("\n🖼️  Rendering test frame...")
            frame = await renderer.render_frame()
            
            if frame is not None:
                print(f"✅ Frame rendered successfully! Shape: {frame.shape}")
                
                # Save test frame for inspection
                test_output_path = Path("test_avatar_frame.png")
                cv2.imwrite(str(test_output_path), frame)
                print(f"💾 Test frame saved to: {test_output_path.absolute()}")
                
                # Analyze frame content
                print("\n🔍 Frame Analysis:")
                
                # Check if frame is just background
                unique_colors = len(np.unique(frame.reshape(-1, frame.shape[-1]), axis=0))
                print(f"   Unique colors: {unique_colors}")
                
                # Check for non-background pixels (assuming background is uniform)
                background_color = frame[0, 0]  # Top-left pixel as background reference
                non_background_pixels = np.sum(np.any(frame != background_color, axis=2))
                total_pixels = frame.shape[0] * frame.shape[1]
                non_background_percentage = (non_background_pixels / total_pixels) * 100
                
                print(f"   Background color (BGR): {background_color}")
                print(f"   Non-background pixels: {non_background_pixels}/{total_pixels} ({non_background_percentage:.1f}%)")
                
                if non_background_percentage > 5:  # If more than 5% of pixels are non-background
                    print("✅ Avatar appears to be rendering (significant non-background content)")
                else:
                    print("⚠️  Mostly background detected - avatar may not be visible")
                
                return True
            else:
                print("❌ Failed to render frame")
                return False
        else:
            print("❌ Failed to initialize avatar renderer")
            return False
            
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_glb_model_direct():
    """Test GLB model loading directly."""
    print("\n🔍 Testing GLB Model Loading Directly...")
    
    try:
        import trimesh
        
        glb_path = Path("assets/models/doctor_avatar_1.glb")
        if not glb_path.exists():
            print(f"❌ GLB file not found: {glb_path.absolute()}")
            return False
        
        print(f"📂 Loading GLB from: {glb_path.absolute()}")
        scene = trimesh.load(str(glb_path))
        
        print(f"✅ GLB loaded successfully!")
        print(f"   Type: {type(scene)}")
        
        if isinstance(scene, trimesh.Scene):
            print(f"   Scene geometries: {len(scene.geometry)}")
            for name, geom in scene.geometry.items():
                print(f"     {name}: {type(geom)} - {len(geom.vertices)} vertices, {len(geom.faces)} faces")
        elif hasattr(scene, 'vertices'):
            print(f"   Single mesh: {len(scene.vertices)} vertices, {len(scene.faces)} faces")
        
        return True
        
    except ImportError:
        print("❌ trimesh library not available")
        return False
    except Exception as e:
        print(f"❌ Error loading GLB: {e}")
        return False

async def main():
    """Main test function."""
    print("🚀 Avatar Engine Rendering Debug Test")
    print("=" * 50)
    
    # Test GLB loading directly first
    glb_success = await test_glb_model_direct()
    
    if glb_success:
        # Test full avatar pipeline
        avatar_success = await test_avatar_loading()
        
        if avatar_success:
            print("\n🎉 All tests passed! Avatar rendering should be working.")
            print("\n💡 If you're still seeing brown background:")
            print("   1. Check that the LiveKit video stream is properly connected")
            print("   2. Verify the avatar session is active in the Avatar Engine")
            print("   3. Enable debug modes: DEBUG=true DEBUG_WIREFRAME=true")
            print("   4. Check the test_avatar_frame.png file for visual confirmation")
        else:
            print("\n❌ Avatar rendering tests failed. Check logs above for details.")
    else:
        print("\n❌ GLB model loading failed. Check that the model file exists and is valid.")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    asyncio.run(main())