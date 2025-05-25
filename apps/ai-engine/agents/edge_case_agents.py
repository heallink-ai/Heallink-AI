"""
Edge Case Agents
===============
Specialized agents for handling edge cases and multilingual support
"""

import logging
from typing import Dict

from agents.base_agent import HealLinkAgent

logger = logging.getLogger(__name__)

class ChildCallerAgent(HealLinkAgent):
    """Handles calls from children"""
    
    def __init__(self):
        super().__init__(
            instructions="""You are speaking with a child. Use simple, friendly language.
            Ask if there's a grown-up nearby who can help.
            Stay calm and reassuring.
            Never ask for personal information from a child."""
        )
    
    async def on_enter(self) -> None:
        await self.session.say(
            "Hi there! I'm Heallink, and I'm here to help. "
            "Is there a grown-up nearby who can talk with me?"
        )

class MultilingualAgent(HealLinkAgent):
    """Handles non-English speakers"""
    
    def __init__(self, language: str = "en"):
        instructions_map = {
            "es": "Eres un asistente de salud que habla español...",
            "fr": "Vous êtes un assistant de santé qui parle français...",
            "ga": "Is cúntóir sláinte thú a labhraíonn Gaeilge...",  # Irish
        }
        
        super().__init__(
            instructions=instructions_map.get(language, "You are a healthcare assistant...")
        )
        self.language = language
    
    async def on_enter(self) -> None:
        greetings: Dict[str, str] = {
            "es": "¡Hola! Soy Heallink, su guía de salud. ¿Cómo puedo ayudarle?",
            "fr": "Bonjour! Je suis Heallink, votre guide santé. Comment puis-je vous aider?",
            "ga": "Dia dhuit! Is mise Heallink, do threoir sláinte. Conas is féidir liom cabhrú leat?",
        }
        
        greeting = greetings.get(self.language, "Hello! I'm Heallink. How can I help?")
        await self.session.say(greeting)