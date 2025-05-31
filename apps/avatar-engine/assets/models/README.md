# Avatar Models Directory

## ReadyPlayer.me Integration

ReadyPlayer.me is the **recommended** source for avatar models as they come with built-in blend shapes optimized for facial animation.

### Getting ReadyPlayer.me Avatars

1. **Create Avatar**
   - Go to [ReadyPlayer.me](https://readyplayer.me/)
   - Create a professional medical avatar
   - Choose appropriate hair, clothing, and features
   - Download as `.glb` format

2. **Download Command**
   ```bash
   # Replace YOUR_AVATAR_ID with the actual ID from ReadyPlayer.me
   curl -o doctor_avatar_1.glb "https://models.readyplayer.me/YOUR_AVATAR_ID.glb"
   
   # Example:
   curl -o doctor_avatar_1.glb "https://models.readyplayer.me/64f123abc456def789.glb"
   ```

3. **Built-in Blend Shapes**
   ReadyPlayer.me avatars include **52 standard blend shapes**:
   
   **Mouth & Lips:**
   - `mouthOpen` - Opens mouth
   - `mouthSmile` - Smile expression
   - `mouthFrown` - Frown expression  
   - `mouthPucker` - Pucker lips
   - `mouthStretch` - Stretch lips wide
   - `mouthRollUpper` - Roll upper lip
   - `mouthRollLower` - Roll lower lip
   - `mouthShrugUpper` - Shrug upper lip
   - `mouthShrugLower` - Shrug lower lip
   - `mouthClose` - Close mouth tightly
   
   **Eyes & Eyebrows:**
   - `eyeBlinkLeft` - Blink left eye
   - `eyeBlinkRight` - Blink right eye
   - `eyeLookUpLeft` - Look up with left eye
   - `eyeLookUpRight` - Look up with right eye
   - `eyeLookDownLeft` - Look down with left eye
   - `eyeLookDownRight` - Look down with right eye
   - `eyeLookInLeft` - Look inward with left eye
   - `eyeLookInRight` - Look inward with right eye
   - `eyeLookOutLeft` - Look outward with left eye
   - `eyeLookOutRight` - Look outward with right eye
   - `eyeSquintLeft` - Squint left eye
   - `eyeSquintRight` - Squint right eye
   - `eyeWideLeft` - Widen left eye
   - `eyeWideRight` - Widen right eye
   - `browDownLeft` - Lower left eyebrow
   - `browDownRight` - Lower right eyebrow
   - `browInnerUp` - Raise inner eyebrows
   - `browOuterUpLeft` - Raise outer left eyebrow
   - `browOuterUpRight` - Raise outer right eyebrow
   
   **Cheeks & Nose:**
   - `cheekPuff` - Puff cheeks
   - `cheekSquintLeft` - Squint left cheek
   - `cheekSquintRight` - Squint right cheek
   - `noseSneerLeft` - Sneer left nostril
   - `noseSneerRight` - Sneer right nostril
   
   **Jaw & Tongue:**
   - `jawOpen` - Open jaw
   - `jawForward` - Move jaw forward
   - `jawLeft` - Move jaw left
   - `jawRight` - Move jaw right
   - `tongueOut` - Stick tongue out

### Medical Avatar Recommendations

For healthcare applications, create avatars with:

**Professional Appearance:**
- Business casual or medical scrubs
- Neutral, friendly facial features
- Professional hairstyles
- Appropriate age range (25-50)

**Recommended Avatars:**

1. **Doctor Avatar (Female)**
   - Lab coat or business attire
   - Confident, approachable expression
   - Professional hairstyle

2. **Doctor Avatar (Male)**  
   - Lab coat or shirt and tie
   - Warm, trustworthy appearance
   - Clean, professional look

3. **Nurse Avatar (Female)**
   - Scrubs or nursing uniform
   - Caring, empathetic expression
   - Practical hairstyle

4. **Nurse Avatar (Male)**
   - Scrubs or medical uniform
   - Friendly, professional demeanor
   - Clean, approachable look

### File Naming Convention

```
doctor_female_01.glb    # Primary female doctor
doctor_male_01.glb      # Primary male doctor  
nurse_female_01.glb     # Primary female nurse
nurse_male_01.glb       # Primary male nurse
specialist_01.glb       # Specialist doctor
therapist_01.glb        # Therapist/counselor
```

### Alternative Model Sources

If not using ReadyPlayer.me:

1. **Blender Models**
   - Create custom models with Blender
   - Export as glTF 2.0 (.glb)
   - Include blend shapes for facial animation
   - Keep under 10,000 triangles

2. **Asset Stores**
   - [Sketchfab](https://sketchfab.com/) - Professional 3D models
   - [TurboSquid](https://www.turbosquid.com/) - High-quality avatars
   - [CGTrader](https://www.cgtrader.com/) - Medical character models

3. **AI Generated**
   - [MetaHuman Creator](https://www.unrealengine.com/en-US/metahuman) - Epic Games
   - [Character Creator 4](https://www.reallusion.com/character-creator/) - Reallusion
   - [VRoid Studio](https://vroid.com/en/studio) - Free anime-style avatars

### Model Requirements

**Technical Specifications:**
- **Format**: glTF 2.0 (.glb) preferred
- **Polygons**: < 10,000 triangles for real-time performance
- **Textures**: 1024x1024 or 2048x2048 maximum
- **Blend Shapes**: Minimum 20 facial blend shapes
- **Rigging**: Standard humanoid skeleton

**Optimization Guidelines:**
- Use texture atlasing to reduce draw calls
- Include LOD (Level of Detail) versions if possible
- Compress textures appropriately
- Ensure proper UV mapping

### Testing Models

```bash
# Test model loading
python tools/test_avatar.py --avatar-id doctor_female_01

# Verify blend shapes
python -c "
from src.renderer.avatar_renderer import AvatarModel
model = AvatarModel('test', 'assets/models/doctor_female_01.glb')
await model.load()
print('Blend shapes:', list(model.blend_shapes.keys()))
"
```

### Troubleshooting

**Model Won't Load:**
- Check file format (must be .glb or .gltf)
- Verify file isn't corrupted
- Ensure proper permissions

**Missing Blend Shapes:**
- ReadyPlayer.me models include blend shapes automatically
- Custom models need blend shapes added in Blender/Maya
- Check blend shape naming convention

**Performance Issues:**
- Reduce polygon count
- Use smaller textures
- Enable GPU acceleration if available

### Legal Considerations

- **ReadyPlayer.me**: Free for commercial use with attribution
- **Custom Models**: Ensure you have rights to use
- **Asset Store**: Check licensing terms
- **AI Generated**: Verify commercial usage rights