# Avatar Images

This directory contains avatar images for the HealLink Avatar Engine.

## Image Requirements

- **Format**: JPG, PNG
- **Resolution**: 512x512 pixels (recommended)
- **Content**: High-quality portrait images with clear facial features
- **Lighting**: Well-lit faces work best for lip-sync
- **Orientation**: Frontal view preferred

## Default Avatar

Place your default avatar image as `default.jpg` in this directory.

The default avatar will be used when:
- No specific avatar image is provided
- Avatar image loading fails
- Initial session creation

## Usage

1. Add avatar images to this directory
2. Reference them in API calls using the filename
3. The Avatar Engine will automatically process and optimize them for lip-sync

## Best Practices

- Use high-resolution source images
- Ensure good contrast and lighting
- Avoid heavily shadowed faces
- Test with different lighting conditions