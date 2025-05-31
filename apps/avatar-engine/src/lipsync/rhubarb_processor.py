"""
Rhubarb Processor - Rhubarb Lip Sync Implementation

This module provides a dedicated Rhubarb lip sync processor for
high-quality lip syncing with minimal latency.
"""

from typing import Dict, List, Optional, Any
import subprocess
import tempfile
from pathlib import Path
from loguru import logger


class RhubarbProcessor:
    """Rhubarb lip sync processor implementation."""
    
    def __init__(self, rhubarb_path: Optional[str] = None):
        self.rhubarb_path = rhubarb_path or self._find_rhubarb()
        self.is_available = self.rhubarb_path is not None
        
        logger.info(f"RhubarbProcessor initialized (available: {self.is_available})")
    
    def _find_rhubarb(self) -> Optional[str]:
        """Find Rhubarb executable."""
        try:
            result = subprocess.run(["which", "rhubarb"], capture_output=True, text=True)
            if result.returncode == 0:
                return result.stdout.strip()
        except Exception:
            pass
        return None
    
    async def process_audio_file(self, audio_file: Path) -> List[Dict[str, Any]]:
        """Process audio file with Rhubarb."""
        if not self.is_available:
            raise RuntimeError("Rhubarb not available")
        
        with tempfile.NamedTemporaryFile(suffix=".json") as output_file:
            cmd = [self.rhubarb_path, str(audio_file), "-f", "json", "-o", output_file.name]
            
            process = await subprocess.create_subprocess_exec(
                *cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            
            await process.communicate()
            
            if process.returncode == 0:
                import json
                with open(output_file.name) as f:
                    return json.load(f).get("mouthCues", [])
        
        return []