#!/usr/bin/env python
"""Generate requirements.txt from the installed packages in the current environment."""

import subprocess
import sys

def main():
    """Generate requirements.txt from the installed packages in the current environment."""
    print("Generating requirements.txt from installed packages...")
    
    try:
        result = subprocess.run(
            ["uv", "pip", "freeze"],
            capture_output=True,
            text=True,
            check=True,
        )
        
        with open("requirements.txt", "w") as f:
            f.write(result.stdout)
        
        print("Successfully generated requirements.txt")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"Error generating requirements.txt: {e}")
        print(f"stderr: {e.stderr}")
        return 1

if __name__ == "__main__":
    sys.exit(main())