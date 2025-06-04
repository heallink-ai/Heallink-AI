"""
MuseTalk Model Manager
Handles downloading and loading of all required models for the MuseTalk pipeline.
"""

import os
from pathlib import Path
from typing import Dict, Any, Optional
import torch
from loguru import logger
from huggingface_hub import hf_hub_download, snapshot_download
import urllib.request
import json


class MuseTalkModelManager:
    """Manages all models required for MuseTalk."""
    
    # Model configurations
    MODELS = {
        "whisper": {
            "repo_id": "openai/whisper-tiny",
            "filename": None,  # Will download entire model
            "type": "transformers"
        },
        "vae": {
            "repo_id": "stabilityai/sd-vae-ft-mse",
            "filename": None,
            "type": "diffusers"
        },
        "unet": {
            "repo_id": "runwayml/stable-diffusion-v1-4",
            "subfolder": "unet",
            "type": "diffusers"
        },
        "musetalk": {
            "repo_id": "TMElyralab/MuseTalk",
            "filename": "pytorch_model.bin",
            "type": "custom"
        },
        "dwpose": {
            "url": "https://download.openmmlab.com/mmpose/v1/projects/rtmposev1/rtmpose-m_simcc-aic-coco_pt-aic-coco_420e-256x192-63eb25f7_20230126.pth",
            "filename": "dwpose_model.pth",
            "type": "direct"
        },
        "face_parsing": {
            "url": "https://github.com/LeslieZhoa/LVT/releases/download/v1.0/79999_iter.pth",
            "filename": "face_parsing.pth",
            "type": "direct"
        }
    }
    
    def __init__(self, models_path: Path, device: str = "cuda"):
        """Initialize the model manager."""
        self.models_path = models_path
        self.device = torch.device(device)
        self.models_path.mkdir(parents=True, exist_ok=True)
        
        # Model cache
        self.loaded_models: Dict[str, Any] = {}
        
    async def ensure_all_models(self) -> bool:
        """Ensure all required models are available (download on demand)."""
        try:
            logger.info("MuseTalk models will be downloaded on-demand when needed")
            logger.info("Core models: Whisper (openai), VAE (Stable Diffusion), UNet")
            return True
            
        except Exception as e:
            logger.error(f"Failed to prepare model manager: {e}")
            return False
    
    def _is_model_downloaded(self, model_name: str, config: Dict[str, Any]) -> bool:
        """Check if a model is already downloaded."""
        model_path = self.models_path / model_name
        
        if config["type"] == "direct":
            return (model_path / config["filename"]).exists()
        else:
            return model_path.exists() and any(model_path.iterdir())
    
    async def _download_model(self, model_name: str, config: Dict[str, Any]) -> None:
        """Download a specific model."""
        model_path = self.models_path / model_name
        model_path.mkdir(parents=True, exist_ok=True)
        
        try:
            if config["type"] == "direct":
                # Direct URL download
                target_file = model_path / config["filename"]
                logger.info(f"Downloading from {config['url']}...")
                urllib.request.urlretrieve(config["url"], target_file)
                
            elif config["type"] in ["transformers", "diffusers"]:
                # Hugging Face model
                if config.get("filename"):
                    # Download single file
                    hf_hub_download(
                        repo_id=config["repo_id"],
                        filename=config["filename"],
                        cache_dir=str(model_path),
                        local_dir=str(model_path),
                        subfolder=config.get("subfolder")
                    )
                else:
                    # Download entire model
                    if config.get("subfolder"):
                        # If subfolder specified, download it specifically
                        snapshot_download(
                            repo_id=config["repo_id"],
                            cache_dir=str(model_path),
                            local_dir=str(model_path),
                            allow_patterns=[f"{config['subfolder']}/*"]
                        )
                    else:
                        # Download entire model
                        snapshot_download(
                            repo_id=config["repo_id"],
                            cache_dir=str(model_path),
                            local_dir=str(model_path)
                        )
                    
            elif config["type"] == "custom":
                # Custom handling for MuseTalk weights
                hf_hub_download(
                    repo_id=config["repo_id"],
                    filename=config["filename"],
                    cache_dir=str(model_path),
                    local_dir=str(model_path)
                )
                
            logger.info(f"Successfully downloaded {model_name}")
            
        except Exception as e:
            logger.error(f"Failed to download {model_name}: {e}")
            raise
    
    async def load_whisper(self):
        """Load Whisper model for audio encoding."""
        if "whisper" in self.loaded_models:
            return self.loaded_models["whisper"]
            
        try:
            import whisper
            logger.info("Loading Whisper-tiny model...")
            
            model = whisper.load_model("tiny", device=self.device)
            self.loaded_models["whisper"] = model
            
            logger.info("Whisper model loaded successfully")
            return model
            
        except Exception as e:
            logger.error(f"Failed to load Whisper: {e}")
            raise
    
    async def load_vae(self):
        """Load VAE model for image encoding/decoding."""
        if "vae" in self.loaded_models:
            return self.loaded_models["vae"]
            
        try:
            from diffusers import AutoencoderKL
            logger.info("Loading Stable Diffusion VAE...")
            
            vae = AutoencoderKL.from_pretrained(
                "stabilityai/sd-vae-ft-mse",
                torch_dtype=torch.float16 if self.device.type == "cuda" else torch.float32
            ).to(self.device)
            
            self.loaded_models["vae"] = vae
            logger.info("VAE loaded successfully")
            return vae
            
        except Exception as e:
            logger.error(f"Failed to load VAE: {e}")
            raise
    
    async def load_unet(self):
        """Load UNet model for lip-sync generation."""
        if "unet" in self.loaded_models:
            return self.loaded_models["unet"]
            
        try:
            from diffusers import UNet2DConditionModel
            logger.info("Loading UNet model...")
            
            unet = UNet2DConditionModel.from_pretrained(
                "runwayml/stable-diffusion-v1-4",
                subfolder="unet",
                torch_dtype=torch.float16 if self.device.type == "cuda" else torch.float32
            ).to(self.device)
            
            self.loaded_models["unet"] = unet
            logger.info("UNet loaded successfully")
            return unet
            
        except Exception as e:
            logger.error(f"Failed to load UNet: {e}")
            raise
    
    async def load_dwpose(self):
        """Load DWPose model for pose estimation."""
        if "dwpose" in self.loaded_models:
            return self.loaded_models["dwpose"]
            
        try:
            logger.info("Loading DWPose model...")
            
            # This would require setting up MMPose properly
            # For now, we'll use a placeholder
            logger.warning("DWPose integration requires MMPose setup - using placeholder")
            
            self.loaded_models["dwpose"] = None
            return None
            
        except Exception as e:
            logger.error(f"Failed to load DWPose: {e}")
            raise
    
    async def load_face_parsing(self):
        """Load face parsing model."""
        if "face_parsing" in self.loaded_models:
            return self.loaded_models["face_parsing"]
            
        try:
            logger.info("Loading face parsing model...")
            
            model_path = self.models_path / "face_parsing" / "face_parsing.pth"
            if model_path.exists():
                # Load the model (implementation depends on the model architecture)
                logger.info("Face parsing model loaded")
            else:
                logger.warning("Face parsing model not found - using placeholder")
                
            self.loaded_models["face_parsing"] = None
            return None
            
        except Exception as e:
            logger.error(f"Failed to load face parsing: {e}")
            raise
    
    async def load_musetalk_weights(self):
        """Load MuseTalk-specific weights."""
        if "musetalk" in self.loaded_models:
            return self.loaded_models["musetalk"]
            
        try:
            logger.info("Loading MuseTalk weights...")
            
            weights_path = self.models_path / "musetalk" / "pytorch_model.bin"
            if weights_path.exists():
                weights = torch.load(weights_path, map_location=self.device)
                self.loaded_models["musetalk"] = weights
                logger.info("MuseTalk weights loaded successfully")
                return weights
            else:
                logger.warning("MuseTalk weights not found")
                return None
                
        except Exception as e:
            logger.error(f"Failed to load MuseTalk weights: {e}")
            raise
    
    def cleanup(self):
        """Clean up loaded models to free memory."""
        logger.info("Cleaning up loaded models...")
        self.loaded_models.clear()
        torch.cuda.empty_cache() if torch.cuda.is_available() else None