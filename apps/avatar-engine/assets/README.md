# Avatar Assets

This directory contains 3D models, textures, animations, and other assets for the Avatar Engine.

## Directory Structure

```
assets/
├── models/           # 3D avatar models (.glb, .gltf)
├── textures/         # Texture maps (diffuse, normal, roughness, etc.)
├── animations/       # Animation data and blend shapes
├── sounds/           # Audio files for testing
├── backgrounds/      # Background images and scenes
└── config/           # Asset configuration files
```

## Asset Guidelines

### 3D Models

- **Format**: Use glTF 2.0 (.glb or .gltf) for maximum compatibility
- **Polygon Count**: Keep under 10,000 triangles for real-time performance
- **Blend Shapes**: Include facial blend shapes for animation
- **Naming**: Use descriptive names (e.g., `doctor_female_01.glb`)

### Textures

- **Resolution**: 1024x1024 or 2048x2048 for main textures
- **Format**: Use JPEG for diffuse maps, PNG for alpha channels
- **Maps**: Include diffuse, normal, and roughness maps minimum
- **Compression**: Optimize for web delivery

### Blend Shapes

Required blend shapes for facial animation:
- `mouth_open` - Mouth opening
- `mouth_smile` - Smile expression
- `mouth_frown` - Frown expression
- `mouth_pucker` - Lip pucker
- `mouth_stretch` - Lip stretch
- `eyebrow_up` - Eyebrow raise
- `eyebrow_down` - Eyebrow lower
- `eye_blink` - Eye blinking
- `jaw_open` - Jaw opening

### Backgrounds

- **Resolution**: 1920x1080 minimum for 1080p rendering
- **Format**: JPEG for photographs, PNG for transparency
- **Lighting**: Consider lighting conditions for avatar integration

## Asset Optimization

### Performance Tips

1. **LOD Models**: Create multiple levels of detail
2. **Texture Streaming**: Use compressed textures
3. **Animation Compression**: Optimize blend shape data
4. **Batching**: Group similar materials

### Quality Guidelines

- **Photorealistic**: High-quality textures and modeling
- **Consistent Style**: Maintain visual coherence
- **Appropriate Scale**: Ensure proper proportions
- **Optimization**: Balance quality with performance

## Adding New Assets

1. Place files in appropriate subdirectories
2. Update `config/avatars.yaml` with new asset references
3. Test avatar loading and rendering
4. Verify performance metrics

## Asset Sources

### 3D Models
- Custom modeling using Blender, Maya, or similar
- Purchased from asset stores (ReadyPlayerMe, etc.)
- Generated using AI tools (with proper licensing)

### Textures
- Photography-based textures
- Procedural generation
- Asset store purchases

### Licensing

Ensure all assets have appropriate licenses for commercial use. Document licensing information for each asset.

## Troubleshooting

### Common Issues

1. **Model Not Loading**: Check file format and size
2. **Missing Textures**: Verify texture paths in model files
3. **Animation Issues**: Ensure blend shapes are properly named
4. **Performance Problems**: Reduce polygon count or texture resolution

### Debug Tools

Use the Avatar Engine debug endpoints:
- `/avatars/{id}/info` - Get avatar information
- `/avatars/{id}/metrics` - View performance metrics
- `/assets/models/{filename}` - Direct asset access