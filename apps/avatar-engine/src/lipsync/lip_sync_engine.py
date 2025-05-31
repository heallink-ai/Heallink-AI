"""
LipSyncEngine - Audio-to-Viseme Mapping

This module provides real-time lip syncing capabilities by converting audio
input to mouth shape parameters for 3D avatar animation.
"""

import asyncio
import time
from typing import Dict, List, Optional, Any, Union
from pathlib import Path
import tempfile
import subprocess

import numpy as np
import librosa
from loguru import logger

from config.settings import AvatarConfig


class VisemeData:
    """Container for viseme (visual phoneme) data."""
    
    def __init__(self):
        self.mouth_shapes: Dict[str, float] = {
            "mouth_open": 0.0,
            "mouth_wide": 0.0,
            "mouth_narrow": 0.0,
            "mouth_smile": 0.0,
            "mouth_frown": 0.0,
            "lip_pucker": 0.0,
            "lip_stretch": 0.0,
            "jaw_open": 0.0
        }
        self.timestamp: float = time.time()
        self.confidence: float = 1.0


class AudioProcessor:
    """Base class for audio processing."""
    
    def __init__(self, sample_rate: int = 48000):
        self.sample_rate = sample_rate
        self.frame_length = 2048
        self.hop_length = 512
    
    def extract_features(self, audio_data: np.ndarray) -> Dict[str, np.ndarray]:
        """Extract audio features for lip sync analysis."""
        try:
            # Extract MFCC features
            mfccs = librosa.feature.mfcc(
                y=audio_data,
                sr=self.sample_rate,
                n_mfcc=13,
                hop_length=self.hop_length
            )
            
            # Extract spectral features
            spectral_centroids = librosa.feature.spectral_centroid(
                y=audio_data,
                sr=self.sample_rate,
                hop_length=self.hop_length
            )[0]
            
            # Extract energy
            rms_energy = librosa.feature.rms(
                y=audio_data,
                hop_length=self.hop_length
            )[0]
            
            # Extract zero crossing rate
            zcr = librosa.feature.zero_crossing_rate(
                y=audio_data,
                hop_length=self.hop_length
            )[0]
            
            return {
                "mfccs": mfccs,
                "spectral_centroids": spectral_centroids,
                "rms_energy": rms_energy,
                "zero_crossing_rate": zcr
            }
            
        except Exception as e:
            logger.error(f"Error extracting audio features: {e}")
            return {}


class RhubarbLipSync:
    """Rhubarb Lip Sync implementation for rule-based lip syncing."""
    
    def __init__(self, config: AvatarConfig):
        self.config = config
        self.rhubarb_executable = self._find_rhubarb_executable()
        
        # Viseme mapping for Rhubarb output
        self.viseme_mapping = {
            "X": {"mouth_open": 0.0, "jaw_open": 0.0},      # Silence
            "A": {"mouth_open": 0.8, "jaw_open": 0.6},      # /ɑ/ as in "father"
            "B": {"lip_pucker": 0.9, "mouth_narrow": 0.7},  # /p/, /b/, /m/
            "C": {"mouth_wide": 0.8, "lip_stretch": 0.6},   # /ɜ/ as in "turn"
            "D": {"mouth_open": 0.6, "jaw_open": 0.4},      # /aɪ/ as in "bite"
            "E": {"mouth_wide": 0.7, "lip_stretch": 0.8},   # /e/ as in "bed"
            "F": {"mouth_narrow": 0.6, "lip_stretch": 0.3}, # /f/, /v/
            "G": {"mouth_open": 0.5, "jaw_open": 0.3},      # /k/, /g/
            "H": {"mouth_open": 0.4, "jaw_open": 0.2},      # /n/, /t/, /d/
            "I": {"mouth_wide": 0.3, "lip_stretch": 0.9}    # /i/ as in "fleece"
        }
    
    def _find_rhubarb_executable(self) -> Optional[str]:
        """Find Rhubarb executable in system PATH."""
        try:
            result = subprocess.run(
                ["which", "rhubarb"],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except Exception:
            pass
        
        # Check common installation paths
        common_paths = [
            "/usr/local/bin/rhubarb",
            "/usr/bin/rhubarb",
            "./tools/rhubarb",
            "../tools/rhubarb"
        ]
        
        for path in common_paths:
            if Path(path).exists():
                return path
        
        logger.warning("Rhubarb executable not found, using fallback method")
        return None
    
    async def process_audio(self, audio_data: np.ndarray, sample_rate: int) -> List[VisemeData]:
        """Process audio using Rhubarb lip sync."""
        if not self.rhubarb_executable:
            return await self._fallback_processing(audio_data, sample_rate)
        
        try:
            # Create temporary audio file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
                temp_audio_path = temp_audio.name
                
                # Write audio to temporary file
                import soundfile as sf
                sf.write(temp_audio_path, audio_data, sample_rate)
            
            # Create temporary output file
            with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as temp_output:
                temp_output_path = temp_output.name
            
            # Run Rhubarb
            cmd = [
                self.rhubarb_executable,
                temp_audio_path,
                "-f", "json",
                "-o", temp_output_path
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                logger.error(f"Rhubarb failed: {stderr.decode()}")
                return await self._fallback_processing(audio_data, sample_rate)
            
            # Parse Rhubarb output
            import json
            with open(temp_output_path, 'r') as f:
                rhubarb_data = json.load(f)
            
            # Convert to VisemeData
            viseme_list = []
            for mouth_cue in rhubarb_data.get("mouthCues", []):
                viseme = VisemeData()
                viseme_char = mouth_cue.get("value", "X")
                
                if viseme_char in self.viseme_mapping:
                    viseme.mouth_shapes.update(self.viseme_mapping[viseme_char])
                
                viseme.timestamp = mouth_cue.get("start", 0.0)
                viseme_list.append(viseme)
            
            # Cleanup temporary files
            Path(temp_audio_path).unlink(missing_ok=True)
            Path(temp_output_path).unlink(missing_ok=True)
            
            return viseme_list
            
        except Exception as e:
            logger.error(f"Error processing audio with Rhubarb: {e}")
            return await self._fallback_processing(audio_data, sample_rate)
    
    async def _fallback_processing(self, audio_data: np.ndarray, sample_rate: int) -> List[VisemeData]:
        """Fallback processing when Rhubarb is not available."""
        logger.info("Using fallback lip sync processing")
        
        try:
            # Simple energy-based mouth movement
            frame_length = sample_rate // 10  # 100ms frames
            viseme_list = []
            
            for i in range(0, len(audio_data), frame_length):
                frame = audio_data[i:i + frame_length]
                
                # Calculate RMS energy
                rms = np.sqrt(np.mean(frame ** 2))
                
                # Create viseme based on energy
                viseme = VisemeData()
                
                # Map energy to mouth openness
                mouth_open = min(1.0, rms * 10)  # Scale factor
                jaw_open = mouth_open * 0.7
                
                viseme.mouth_shapes["mouth_open"] = mouth_open
                viseme.mouth_shapes["jaw_open"] = jaw_open
                viseme.timestamp = i / sample_rate
                viseme.confidence = 0.5  # Lower confidence for fallback
                
                viseme_list.append(viseme)
            
            return viseme_list
            
        except Exception as e:
            logger.error(f"Error in fallback processing: {e}")
            return []


class LipSyncEngine:
    """
    Main lip sync engine that converts audio to mouth animation data.
    """
    
    def __init__(self, model: str, config: AvatarConfig):
        """
        Initialize the lip sync engine.
        
        Args:
            model: Lip sync model to use ("rhubarb" or "wav2lip")
            config: Avatar engine configuration
        """
        self.model = model
        self.config = config
        self.is_initialized = False
        
        # Audio processing
        self.audio_processor = AudioProcessor(config.audio.sample_rate)
        
        # Model-specific processors
        self.rhubarb_processor: Optional[RhubarbLipSync] = None
        self.wav2lip_processor: Optional[Any] = None  # TODO: Implement Wav2Lip
        
        # Processing queue
        self.audio_queue = asyncio.Queue(maxsize=100)
        self.viseme_cache: Dict[float, VisemeData] = {}
        
        # Performance metrics
        self.processed_frames = 0
        self.processing_times: List[float] = []
        
        logger.info(f"LipSyncEngine initialized with model: {model}")
    
    async def initialize(self) -> None:
        """Initialize the lip sync engine."""
        try:
            logger.info(f"Initializing lip sync engine with model: {self.model}")
            
            if self.model == "rhubarb":
                self.rhubarb_processor = RhubarbLipSync(self.config)
                logger.info("Rhubarb lip sync processor initialized")
            
            elif self.model == "wav2lip":
                # TODO: Initialize Wav2Lip processor
                logger.info("Wav2Lip processor not yet implemented, using Rhubarb fallback")
                self.rhubarb_processor = RhubarbLipSync(self.config)
            
            else:
                raise ValueError(f"Unknown lip sync model: {self.model}")
            
            # Start processing task
            asyncio.create_task(self._processing_loop())
            
            self.is_initialized = True
            logger.info("Lip sync engine initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize lip sync engine: {e}")
            raise
    
    async def process_audio(self, audio_data: Union[bytes, np.ndarray]) -> Dict[str, Any]:
        """
        Process audio data and return lip sync information.
        
        Args:
            audio_data: Raw audio bytes or numpy array
            
        Returns:
            Dictionary containing mouth shape data
        """
        if not self.is_initialized:
            logger.warning("Lip sync engine not initialized")
            return {"mouth_shapes": {}}
        
        try:
            start_time = time.time()
            
            # Convert bytes to numpy array if needed
            if isinstance(audio_data, bytes):
                audio_array = np.frombuffer(audio_data, dtype=np.float32)
            else:
                audio_array = audio_data.astype(np.float32)
            
            # Normalize audio
            if len(audio_array) > 0:
                audio_array = audio_array / np.max(np.abs(audio_array) + 1e-8)
            
            # Add to processing queue
            if not self.audio_queue.full():
                await self.audio_queue.put({
                    "audio": audio_array,
                    "timestamp": time.time(),
                    "sample_rate": self.config.audio.sample_rate
                })
            
            # Get current viseme data
            current_time = time.time()
            viseme_data = self._get_current_viseme(current_time)
            
            # Update performance metrics
            processing_time = time.time() - start_time
            self._update_metrics(processing_time)
            
            return {
                "mouth_shapes": viseme_data.mouth_shapes,
                "timestamp": viseme_data.timestamp,
                "confidence": viseme_data.confidence
            }
            
        except Exception as e:
            logger.error(f"Error processing audio: {e}")
            return {"mouth_shapes": {}}
    
    async def cleanup(self) -> None:
        """Cleanup lip sync engine resources."""
        logger.info("Cleaning up lip sync engine")
        
        self.is_initialized = False
        
        # Clear caches
        self.viseme_cache.clear()
        
        # Drain audio queue
        while not self.audio_queue.empty():
            try:
                self.audio_queue.get_nowait()
            except asyncio.QueueEmpty:
                break
        
        logger.info("Lip sync engine cleanup complete")
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get lip sync performance metrics."""
        avg_processing_time = (
            np.mean(self.processing_times) if self.processing_times else 0.0
        )
        
        return {
            "processed_frames": self.processed_frames,
            "avg_processing_time_ms": avg_processing_time * 1000,
            "model": self.model,
            "is_initialized": self.is_initialized,
            "queue_size": self.audio_queue.qsize(),
            "cache_size": len(self.viseme_cache)
        }
    
    async def _processing_loop(self) -> None:
        """Main audio processing loop."""
        logger.debug("Starting lip sync processing loop")
        
        while self.is_initialized:
            try:
                # Get audio data from queue
                if not self.audio_queue.empty():
                    audio_item = await self.audio_queue.get()
                    
                    audio_array = audio_item["audio"]
                    sample_rate = audio_item["sample_rate"]
                    timestamp = audio_item["timestamp"]
                    
                    # Process audio
                    if self.rhubarb_processor and len(audio_array) > 0:
                        viseme_list = await self.rhubarb_processor.process_audio(
                            audio_array, sample_rate
                        )
                        
                        # Cache viseme data
                        for viseme in viseme_list:
                            self.viseme_cache[timestamp + viseme.timestamp] = viseme
                    
                    self.processed_frames += 1
                
                await asyncio.sleep(0.01)  # 10ms processing interval
                
            except Exception as e:
                logger.error(f"Error in lip sync processing loop: {e}")
                await asyncio.sleep(0.1)
    
    def _get_current_viseme(self, timestamp: float) -> VisemeData:
        """Get the current viseme data for the given timestamp."""
        if not self.viseme_cache:
            return VisemeData()
        
        # Find the closest timestamp in cache
        closest_time = min(
            self.viseme_cache.keys(),
            key=lambda t: abs(t - timestamp)
        )
        
        # Return cached viseme if within reasonable time window
        if abs(closest_time - timestamp) < 0.5:  # 500ms window
            return self.viseme_cache[closest_time]
        
        # Return default viseme if no close match
        return VisemeData()
    
    def _update_metrics(self, processing_time: float) -> None:
        """Update performance metrics."""
        self.processing_times.append(processing_time)
        
        # Keep only last 100 processing times
        if len(self.processing_times) > 100:
            self.processing_times.pop(0)
        
        # Clean old cache entries (older than 5 seconds)
        current_time = time.time()
        old_timestamps = [
            t for t in self.viseme_cache.keys()
            if current_time - t > 5.0
        ]
        
        for timestamp in old_timestamps:
            del self.viseme_cache[timestamp]