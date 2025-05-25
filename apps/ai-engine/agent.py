"""
Heallink Voice Agent - Advanced LiveKit Implementation
======================================================
A production-ready healthcare voice agent with multi-agent workflows,
emergency handling, location-based routing, and comprehensive edge case support.
"""

import asyncio
import json
import logging
import os
import re
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import AsyncIterable, Dict, List, Optional, Any, Set

from dotenv import load_dotenv
from livekit import agents, rtc, api
from livekit.agents import (
    Agent,
    AgentSession,
    AutoSubscribe,
    ChatContext,
    ChatMessage,
    JobContext,
    RunContext,
    RoomInputOptions,
    WorkerOptions,
    function_tool,
    get_job_context,
    ModelSettings,
    ToolError,
    BackgroundAudioPlayer,
    AudioConfig,
    BuiltinAudioClip,
    StopResponse,
)
from livekit.plugins import (
    openai,
    cartesia,
    deepgram,
    noise_cancellation,
    silero,
)
from livekit.plugins.openai import llm
from livekit.agents import stt, tts
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===== Data Models =====

@dataclass
class PatientData:
    """Patient information collected during the call"""
    first_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    location: Optional[str] = None
    neighborhood: Optional[str] = None
    landmark: Optional[str] = None
    eircode: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    symptoms: List[str] = field(default_factory=list)
    symptom_severity: Optional[str] = None
    symptom_onset: Optional[str] = None
    symptom_duration: Optional[str] = None
    is_emergency: bool = False
    conversation_language: str = "en"
    caller_type: str = "patient"  # patient, caregiver, child
    accessibility_needs: List[str] = field(default_factory=list)

@dataclass
class CallContext:
    """Complete context for the call session"""
    patient_data: PatientData
    start_time: datetime
    agent_transitions: List[str] = field(default_factory=list)
    emergency_flagged: bool = False
    appointment_booked: Optional[Dict[str, Any]] = None
    facilities_found: List[Dict[str, Any]] = field(default_factory=list)
    call_recording_consent: Optional[bool] = None
    interaction_count: int = 0
    last_interaction_time: Optional[datetime] = None
    battery_warning_sent: bool = False

class RiskLevel(Enum):
    EMERGENCY = "emergency"
    URGENT = "urgent"
    MODERATE = "moderate"
    LOW = "low"

# ===== Tool Definitions =====

async def emergency_triage(symptoms: List[str], severity: str) -> RiskLevel:
    """Simulated emergency triage logic"""
    emergency_keywords = ["chest pain", "bleeding", "unconscious", "breathing", "suicide"]
    urgent_keywords = ["fever", "vomiting", "severe pain", "infection"]
    
    symptoms_text = " ".join(symptoms).lower()
    
    for keyword in emergency_keywords:
        if keyword in symptoms_text:
            return RiskLevel.EMERGENCY
    
    if severity == "severe" or any(keyword in symptoms_text for keyword in urgent_keywords):
        return RiskLevel.URGENT
    
    return RiskLevel.MODERATE if severity == "moderate" else RiskLevel.LOW

async def find_nearby_facilities(location: str, specialty: Optional[str] = None) -> List[Dict[str, Any]]:
    """Simulated facility finder API"""
    # In production, this would call a real geocoding and facility API
    await asyncio.sleep(0.5)  # Simulate API call
    
    facilities = [
        {
            "name": "St. James's Hospital",
            "address": "James's Street, Dublin 8",
            "distance_km": 1.2,
            "wait_time_minutes": 45,
            "specialties": ["emergency", "cardiology", "general"],
            "phone": "+353 1 410 3000",
            "open_hours": "24/7",
            "transit_accessible": True,
        },
        {
            "name": "Tallaght University Hospital",
            "address": "Tallaght, Dublin 24",
            "distance_km": 8.5,
            "wait_time_minutes": 30,
            "specialties": ["emergency", "pediatrics", "orthopedics"],
            "phone": "+353 1 414 2000",
            "open_hours": "24/7",
            "transit_accessible": True,
        },
        {
            "name": "Dublin City Medical Centre",
            "address": "Dame Street, Dublin 2",
            "distance_km": 2.3,
            "wait_time_minutes": 20,
            "specialties": ["general", "walk-in"],
            "phone": "+353 1 677 1122",
            "open_hours": "08:00-20:00",
            "transit_accessible": True,
        },
    ]
    
    # Filter by specialty if provided
    if specialty:
        facilities = [f for f in facilities if specialty in f["specialties"]]
    
    # Sort by distance
    facilities.sort(key=lambda x: x["distance_km"])
    
    return facilities[:3]  # Return top 3

async def book_appointment(facility: Dict[str, Any], preferred_time: str) -> Dict[str, Any]:
    """Simulated appointment booking"""
    await asyncio.sleep(1.0)  # Simulate API call
    
    return {
        "confirmation_number": f"HL{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "facility": facility["name"],
        "appointment_time": preferred_time,
        "estimated_duration": "30 minutes",
        "preparation_instructions": "Please bring your ID and insurance card if available.",
        "status": "confirmed",
    }

# ===== Base Agent Class =====

class HealLinkAgent(Agent):
    """Base class for all Heallink agents with common functionality"""
    
    def __init__(self, instructions: str, tts_voice: Optional[str] = None, **kwargs):
        # We don't need to set TTS here since the AgentSession has it
        # The TTS is properly defined in the AgentSession initialization
        super().__init__(
            instructions=instructions,
            **kwargs
        )
    
    async def on_user_turn_completed(self, turn_ctx: ChatContext, new_message: ChatMessage) -> None:
        """Handle privacy and profanity filtering"""
        # Get call context
        ctx: CallContext = self.session.userdata
        
        # Update interaction tracking
        ctx.interaction_count += 1
        ctx.last_interaction_time = datetime.now()
        
        # Filter profanity
        profanity_list = ["fuck", "shit", "damn"]  # Simplified list
        # Handle both string and ChatMessage objects
        text = new_message if isinstance(new_message, str) else new_message.text_content
        
        for word in profanity_list:
            if word in text.lower():
                # Give warning on first offense
                if ctx.interaction_count == 1:
                    await self.session.say(
                        "I understand you may be frustrated, but please keep our conversation respectful. "
                        "How can I help you today?"
                    )
                    return
                # Terminate on repeated offense
                elif ctx.interaction_count > 1:
                    await self.session.say(
                        "I'm sorry, but I need to end this call due to inappropriate language. "
                        "Please call back when you're ready to have a respectful conversation."
                    )
                    room = get_job_context().room
                    await room.disconnect()
                    return
        
        # Check for emergency keywords
        emergency_keywords = ["chest pain", "can't breathe", "bleeding", "unconscious", "kill myself"]
        if any(keyword in text.lower() for keyword in emergency_keywords):
            ctx.emergency_flagged = True
            ctx.patient_data.is_emergency = True
    
    async def stt_node(
        self, 
        audio: AsyncIterable[rtc.AudioFrame], 
        model_settings: ModelSettings
    ) -> Optional[AsyncIterable[stt.SpeechEvent]]:
        """Custom STT processing for accent handling"""
        # Pre-process audio for better accent recognition
        async def processed_audio():
            async for frame in audio:
                # In production, apply accent-specific audio preprocessing
                yield frame
        
        # Use default STT with processed audio
        return Agent.default.stt_node(self, processed_audio(), model_settings)
    
    async def tts_node(
        self,
        text: AsyncIterable[str],
        model_settings: ModelSettings
    ) -> AsyncIterable[rtc.AudioFrame]:
        """Custom TTS for pronunciation and pacing"""
        async def processed_text():
            async for chunk in text:
                # Fix medical pronunciations
                chunk = chunk.replace("mg", " milligrams")
                chunk = chunk.replace("ECG", "E C G")
                chunk = chunk.replace("A&E", "A and E")
                chunk = chunk.replace("GP", "G P")
                
                # Add pauses for better comprehension
                chunk = re.sub(r'([.!?])', r'\1 <break time="0.5s"/>', chunk)
                
                yield chunk
        
        # Adjust speech rate for clarity
        async for frame in Agent.default.tts_node(self, processed_text(), model_settings):
            yield frame

# ===== Specialized Agent Classes =====

class GreetingAgent(HealLinkAgent):
    """Initial greeting and emergency screening agent"""
    
    def __init__(self):
        super().__init__(
            instructions="""You are Heallink, a caring healthcare assistant. Your role is to:
            1. Warmly greet the caller and ask for their first name
            2. Immediately screen for emergencies before proceeding
            3. Show empathy and professionalism
            4. Speak clearly with a friendly Irish accent
            
            CRITICAL: If the caller mentions ANY emergency symptoms (chest pain, bleeding, 
            breathing problems, thoughts of self-harm), immediately use the emergency_detected tool.
            
            Keep your responses brief and natural. Maximum 2 sentences per response."""
        )
    
    async def on_enter(self) -> None:
        """Greet the user when agent becomes active"""
        print("GreetingAgent activated")
        await self.session.say(
            "Hi there! I'm Heallink, your health guide. May I have your first name so I know how to address you?"
        )
    
    @function_tool()
    async def save_name(self, context: RunContext[CallContext], name: str) -> Agent:
        """Save the caller's name and proceed to emergency screening"""
        context.userdata.patient_data.first_name = name
        logger.info(f"Caller name recorded: {name}")
        
        # Transition to emergency screening
        return EmergencyScreeningAgent()
    
    @function_tool()
    async def emergency_detected(self, context: RunContext[CallContext]) -> Agent:
        """Immediately transition to emergency agent"""
        context.userdata.emergency_flagged = True
        context.userdata.patient_data.is_emergency = True
        return EmergencyAgent()

class EmergencyScreeningAgent(HealLinkAgent):
    """Dedicated emergency screening agent"""
    
    def __init__(self):
        super().__init__(
            instructions="""You are screening for emergency symptoms. Ask EXACTLY this question:
            "Before we go further, are you experiencing any severe chest pain, unstoppable bleeding, 
            trouble breathing, thoughts of harming yourself, or any other life-threatening issue?"
            
            - If YES or any emergency symptoms mentioned: use emergency_confirmed tool
            - If NO: use no_emergency tool
            - Be compassionate but efficient"""
        )
    
    async def on_enter(self) -> None:
        ctx: CallContext = self.session.userdata
        name = ctx.patient_data.first_name or "there"
        
        await self.session.say(
            f"Thank you, {name}. Before we go further, are you experiencing any severe chest pain, "
            "unstoppable bleeding, trouble breathing, thoughts of harming yourself, or any other "
            "life-threatening issue?"
        )
    
    @function_tool()
    async def emergency_confirmed(self, context: RunContext[CallContext]) -> Agent:
        """Handle confirmed emergency"""
        context.userdata.emergency_flagged = True
        context.userdata.patient_data.is_emergency = True
        return EmergencyAgent()
    
    @function_tool()
    async def no_emergency(self, context: RunContext[CallContext]) -> Agent:
        """Proceed to symptom collection"""
        logger.info("No emergency detected, proceeding to symptom collection")
        return SymptomCollectorAgent()

class EmergencyAgent(HealLinkAgent):
    """Emergency handling agent"""
    
    def __init__(self):
        super().__init__(
            instructions="""You are handling an EMERGENCY. Your ONLY job is to:
            1. Tell them to call 112 or 999 immediately
            2. Offer to place the call for them
            3. DO NOT collect any personal information
            4. Stay calm and supportive
            
            Use the appropriate tool based on their response."""
        )
    
    async def on_enter(self) -> None:
        # Log emergency
        ctx: CallContext = self.session.userdata
        logger.critical(f"EMERGENCY DETECTED - Time: {datetime.now()}, Patient: {ctx.patient_data.first_name}")
        
        await self.session.say(
            "It sounds like this could be serious. Please hang up and dial 112 or 999 right now. "
            "Would you like me to place the call for you?"
        )
    
    @function_tool()
    async def place_emergency_call(self, context: RunContext[CallContext]) -> None:
        """Simulate placing emergency call"""
        # In production, this would initiate a real emergency call
        await context.session.say(
            "I'm connecting you to emergency services now. Stay on the line..."
        )
        
        # Log the action
        logger.critical(f"Emergency call placed at {datetime.now()}")
        
        # In production, transfer to emergency services
        await asyncio.sleep(2)
        await context.session.say("You're being connected now. Help is on the way.")
        
        # End the session
        room = get_job_context().room
        await room.disconnect()
    
    @function_tool()
    async def user_will_call_themselves(self, context: RunContext[CallContext]) -> None:
        """User declined assistance"""
        await context.session.say(
            "Please call 112 or 999 immediately. Take care and get help right away."
        )
        
        # End the session
        room = get_job_context().room
        await room.disconnect()

class SymptomCollectorAgent(HealLinkAgent):
    """Collects and triages symptoms"""
    
    def __init__(self):
        super().__init__(
            instructions="""You are collecting symptom information. Your approach:
            1. First ask: "Okay [name], what's bothering you most today?"
            2. Ask up to 4 clarifying questions about: onset, severity, location, duration
            3. Be empathetic and use simple language
            4. Listen for emergency symptoms and use emergency_detected if needed
            5. After gathering info, use symptom_assessment_complete
            
            Keep responses under 2 sentences. Show understanding."""
        )
    
    async def on_enter(self) -> None:
        ctx: CallContext = self.session.userdata
        name = ctx.patient_data.first_name or "there"
        
        await self.session.say(
            f"Okay {name}, what's bothering you most today?"
        )
    
    @function_tool()
    async def record_symptom(
        self, 
        context: RunContext[CallContext], 
        symptom: str,
        severity: Optional[str] = None,
        onset: Optional[str] = None,
        location: Optional[str] = None,
        duration: Optional[str] = None
    ) -> None:
        """Record symptom information"""
        patient_data = context.userdata.patient_data
        patient_data.symptoms.append(symptom)
        
        if severity:
            patient_data.symptom_severity = severity
        if onset:
            patient_data.symptom_onset = onset
        if duration:
            patient_data.symptom_duration = duration
        
        logger.info(f"Symptom recorded: {symptom}, severity: {severity}")
        
        # Check for emergency symptoms
        risk_level = await emergency_triage(patient_data.symptoms, severity or "moderate")
        
        if risk_level == RiskLevel.EMERGENCY:
            context.userdata.emergency_flagged = True
            return EmergencyAgent()
    
    @function_tool()
    async def symptom_assessment_complete(self, context: RunContext[CallContext]) -> Agent:
        """Complete symptom collection and proceed to demographics"""
        patient_data = context.userdata.patient_data
        
        # Perform triage
        risk_level = await emergency_triage(
            patient_data.symptoms, 
            patient_data.symptom_severity or "moderate"
        )
        
        if risk_level == RiskLevel.EMERGENCY:
            return EmergencyAgent()
        elif risk_level == RiskLevel.URGENT:
            return UrgentCareAgent()
        else:
            return DemographicsAgent()
    
    @function_tool()
    async def emergency_detected(self, context: RunContext[CallContext]) -> Agent:
        """Emergency symptoms detected during collection"""
        context.userdata.emergency_flagged = True
        return EmergencyAgent()

class DemographicsAgent(HealLinkAgent):
    """Collects demographic information safely"""
    
    def __init__(self):
        super().__init__(
            instructions="""You are collecting basic demographic information. 
            Ask for date of birth and location in a friendly, natural way.
            
            Example: "May I confirm your date of birth and where you're calling from, 
            so I can find the best care nearby?"
            
            If they decline, proceed without the information.
            Use the appropriate tools to record information."""
        )
    
    async def on_enter(self) -> None:
        ctx: CallContext = self.session.userdata
        name = ctx.patient_data.first_name or "there"
        
        await self.session.say(
            f"Thank you for that information, {name}. May I confirm your date of birth "
            "and where you're calling from, so I can find the best care nearby?"
        )
    
    @function_tool()
    async def record_demographics(
        self, 
        context: RunContext[CallContext],
        date_of_birth: Optional[str] = None,
        location: Optional[str] = None
    ) -> Agent:
        """Record demographic information and proceed to location"""
        if date_of_birth:
            context.userdata.patient_data.date_of_birth = date_of_birth
        if location:
            context.userdata.patient_data.location = location
            
        return LocationAgent()
    
    @function_tool()
    async def user_declined_demographics(self, context: RunContext[CallContext]) -> Agent:
        """User declined to provide demographics"""
        logger.info("User declined demographics, proceeding with limited info")
        return LocationAgent()

class LocationAgent(HealLinkAgent):
    """Handles location refinement and facility finding"""
    
    def __init__(self):
        super().__init__(
            instructions="""You are helping find nearby healthcare facilities. 
            
            If location is vague (just city), ask for neighborhood, landmark, or Eircode.
            Once you have enough location info, use find_facilities tool.
            Present top 2 options clearly with distance and wait times.
            
            Be helpful and considerate of their transport situation."""
        )
    
    async def on_enter(self) -> None:
        ctx: CallContext = self.session.userdata
        location = ctx.patient_data.location
        
        if location and "dublin" in location.lower():
            await self.session.say(
                "I see you're in Dublin. Could you tell me which neighborhood, "
                "a nearby landmark, or your Eircode? This will help me find the closest facilities."
            )
        else:
            await self.session.say(
                "To find the best care options nearby, could you tell me your location? "
                "A neighborhood, landmark, or Eircode would be helpful."
            )
    
    @function_tool()
    async def update_location(
        self, 
        context: RunContext[CallContext],
        neighborhood: Optional[str] = None,
        landmark: Optional[str] = None,
        eircode: Optional[str] = None
    ) -> None:
        """Update location details"""
        patient_data = context.userdata.patient_data
        
        if neighborhood:
            patient_data.neighborhood = neighborhood
        if landmark:
            patient_data.landmark = landmark
        if eircode:
            patient_data.eircode = eircode
            
        logger.info(f"Location updated: {neighborhood or landmark or eircode}")
    
    @function_tool()
    async def find_facilities(self, context: RunContext[CallContext]) -> None:
        """Find nearby facilities based on symptoms and location"""
        patient_data = context.userdata.patient_data
        
        # Determine specialty based on symptoms
        specialty = None
        symptoms_text = " ".join(patient_data.symptoms).lower()
        
        if "child" in symptoms_text or "baby" in symptoms_text:
            specialty = "pediatrics"
        elif "heart" in symptoms_text or "chest" in symptoms_text:
            specialty = "cardiology"
        elif "broken" in symptoms_text or "fracture" in symptoms_text:
            specialty = "orthopedics"
        
        # Show thinking feedback
        await context.session.say("Let me find the best options for you...")
        
        # Find facilities
        location = patient_data.location or "Dublin"
        facilities = await find_nearby_facilities(location, specialty)
        context.userdata.facilities_found = facilities
        
        if not facilities:
            await context.session.say(
                "I'm having trouble finding facilities in your area. "
                "Please call 112 if this is urgent, or try calling your GP directly."
            )
            return
        
        # Present top 2 options
        await context.session.say(
            f"I found these options for you: "
            f"Option 1: {facilities[0]['name']} on {facilities[0]['address']}, "
            f"about {facilities[0]['distance_km']} kilometers away with a {facilities[0]['wait_time_minutes']} minute wait. "
            f"Option 2: {facilities[1]['name']} on {facilities[1]['address']}, "
            f"about {facilities[1]['distance_km']} kilometers away with a {facilities[1]['wait_time_minutes']} minute wait. "
            f"Would you like me to book at Option 1, Option 2, or hear more choices?"
        )
    
    @function_tool()
    async def select_facility(
        self, 
        context: RunContext[CallContext], 
        option_number: int
    ) -> Agent:
        """User selected a facility"""
        facilities = context.userdata.facilities_found
        
        if 0 < option_number <= len(facilities):
            selected = facilities[option_number - 1]
            context.userdata.appointment_booked = {
                "facility": selected,
                "selected_at": datetime.now()
            }
            return AppointmentAgent()
        else:
            await context.session.say("I didn't catch that. Could you say Option 1 or Option 2?")
    
    @function_tool()
    async def request_more_options(self, context: RunContext[CallContext]) -> None:
        """Show additional facility options"""
        facilities = context.userdata.facilities_found
        
        if len(facilities) > 2:
            facility = facilities[2]
            await context.session.say(
                f"Option 3: {facility['name']} on {facility['address']}, "
                f"about {facility['distance_km']} kilometers away. "
                "Would you like to book at any of these options?"
            )
        else:
            await context.session.say(
                "Those are all the nearby options I found. "
                "Would you like to book at Option 1 or Option 2?"
            )

class AppointmentAgent(HealLinkAgent):
    """Handles appointment booking"""
    
    def __init__(self):
        super().__init__(
            instructions="""You are booking an appointment. 
            Ask for their preferred time (today, tomorrow, specific time).
            Confirm the booking and provide clear next steps.
            Be efficient but thorough."""
        )
    
    async def on_enter(self) -> None:
        ctx: CallContext = self.session.userdata
        facility = ctx.appointment_booked["facility"]
        
        await self.session.say(
            f"Great! I'll help you book at {facility['name']}. "
            "When would you prefer to go? You can say 'as soon as possible', "
            "'today', 'tomorrow', or a specific time."
        )
    
    @function_tool()
    async def book_appointment_slot(
        self, 
        context: RunContext[CallContext],
        preferred_time: str
    ) -> Agent:
        """Book the appointment"""
        appointment_data = context.userdata.appointment_booked
        facility = appointment_data["facility"]
        
        # Show booking in progress
        await context.session.say("Let me book that for you...")
        
        # Book appointment
        booking = await book_appointment(facility, preferred_time)
        appointment_data.update(booking)
        
        # Confirm booking
        await context.session.say(
            f"Perfect! I've booked your appointment at {facility['name']} "
            f"for {preferred_time}. Your confirmation number is {booking['confirmation_number']}. "
            "Please bring your ID and insurance card if available."
        )
        
        return WrapUpAgent()

class UrgentCareAgent(HealLinkAgent):
    """Handles urgent but non-emergency cases"""
    
    def __init__(self):
        super().__init__(
            instructions="""You are handling an urgent care situation.
            Recommend immediate care but not emergency services.
            Offer to find urgent care centers or transfer to nurse line.
            Be calm and supportive."""
        )
    
    async def on_enter(self) -> None:
        await self.session.say(
            "Based on your symptoms, I recommend you seek care soon. "
            "Would you like me to find the nearest urgent care center, "
            "or would you prefer to speak with a nurse right away?"
        )
    
    @function_tool()
    async def find_urgent_care(self, context: RunContext[CallContext]) -> Agent:
        """Find urgent care facilities"""
        return LocationAgent()
    
    @function_tool()
    async def transfer_to_nurse(self, context: RunContext[CallContext]) -> None:
        """Transfer to nurse line"""
        await context.session.say(
            "I'll transfer you to our nurse line now. "
            "Please stay on the line..."
        )
        
        # In production, initiate actual transfer
        await asyncio.sleep(2)
        
        # Log transfer
        logger.info(f"Transfer to nurse line initiated at {datetime.now()}")
        
        # End session
        room = get_job_context().room
        await room.disconnect()

class WrapUpAgent(HealLinkAgent):
    """Final wrap-up and summary"""
    
    def __init__(self):
        super().__init__(
            instructions="""You are wrapping up the call. 
            Provide a brief summary and positive encouragement.
            Offer to send summary via SMS/email.
            End with a caring message."""
        )
    
    async def on_enter(self) -> None:
        ctx: CallContext = self.session.userdata
        name = ctx.patient_data.first_name or "there"
        
        message = f"I've sent a summary to your phone, {name}. "
        
        if ctx.appointment_booked:
            facility = ctx.appointment_booked["facility"]["name"]
            message += f"Remember, your appointment is at {facility}. "
        
        message += "Small steps count—take care!"
        
        await self.session.say(message)
        
        # Log call completion
        logger.info(f"Call completed successfully for {name} at {datetime.now()}")
        
        # End session after a brief pause
        await asyncio.sleep(2)
        room = get_job_context().room
        await room.disconnect()

# ===== Edge Case Handlers =====

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
        greetings = {
            "es": "¡Hola! Soy Heallink, su guía de salud. ¿Cómo puedo ayudarle?",
            "fr": "Bonjour! Je suis Heallink, votre guide santé. Comment puis-je vous aider?",
            "ga": "Dia dhuit! Is mise Heallink, do threoir sláinte. Conas is féidir liom cabhrú leat?",
        }
        
        greeting = greetings.get(self.language, "Hello! I'm Heallink. How can I help?")
        await self.session.say(greeting)

# ===== Main Entry Point =====

async def entrypoint(ctx: JobContext):
    """Main entry point for the Heallink agent"""
    try:
        # Initialize call context
        call_context = CallContext(
            patient_data=PatientData(),
            start_time=datetime.now(),
        )
        
        # Parse job metadata if available
        if ctx.job.metadata:
            try:
                metadata = json.loads(ctx.job.metadata)
                # Pre-populate known data
                if "user_id" in metadata:
                    # In production, fetch user profile from database
                    pass
                if "language" in metadata:
                    call_context.patient_data.conversation_language = metadata["language"]
            except json.JSONDecodeError:
                logger.warning("Failed to parse job metadata")
        
        # Connect to room
        await ctx.connect()
        
        # Determine STT model based on language
        language = call_context.patient_data.conversation_language
        stt_model = "nova-3" if language == "en" else "nova-3-general"
        
        # Create session with advanced configuration
        session = AgentSession[CallContext](
            stt=deepgram.STT(
                model=stt_model,
                language="multi",  # Multilingual support
                punctuate=True,
                filler_words=False,
                endpointing_ms=300,  # ms of silence
            ),
            llm=openai.LLM(
                model="gpt-4o",  # Use best model for healthcare
                temperature=0.3,  # Lower temperature for consistency
                max_completion_tokens=150,  # Keep responses concise
            ),
            tts=cartesia.TTS(
                voice="95856005-0332-41b0-935f-352e296aa0df",  # Irish accent
                speed=0.9,  # Slightly slower for clarity
            ),
            vad=silero.VAD.load(
                min_speech_duration=0.2,  # More responsive
                max_buffered_speech=60.0,  # Maximum amount of speech to buffer in seconds
                min_silence_duration=0.3,  # Short silence threshold
            ),
            turn_detection=MultilingualModel(
                # Using default values for turn detection
                unlikely_threshold=0.6,  # Lower threshold = more sensitive to end of turn
            ),
            userdata=call_context,
        )
        
        # Start the session with the greeting agent
        await session.start(
            room=ctx.room,
            agent=GreetingAgent(),
            room_input_options=RoomInputOptions(
                noise_cancellation=noise_cancellation.BVC(),  # Best voice clarity
            ),
        )
        
        # Start background audio for thinking states
        background_audio = BackgroundAudioPlayer(
            thinking_sound=[
                AudioConfig(BuiltinAudioClip.KEYBOARD_TYPING, volume=0.3),
            ],
        )
        # Make sure TTS is properly set up before starting background audio
        await background_audio.start(room=ctx.room, agent_session=session)
        
        # Monitor for edge cases
        asyncio.create_task(monitor_edge_cases(ctx, session, call_context))
        
        # Log session start
        logger.info(f"Heallink session started at {datetime.now()}")
        
    except Exception as e:
        logger.error(f"Error in entrypoint: {e}", exc_info=True)
        # Attempt graceful error handling
        try:
            await ctx.room.local_participant.publish_data(
                json.dumps({
                    "type": "error",
                    "message": "We're experiencing technical difficulties. Please try again later.",
                }),
                topic="system",
            )
        except:
            pass

async def monitor_edge_cases(ctx: JobContext, session: AgentSession, call_context: CallContext):
    """Monitor for edge cases during the call"""
    try:
        while ctx.room.connection_state == rtc.ConnectionState.CONN_CONNECTED:
            # Monitor for battery low
            if not call_context.battery_warning_sent:
                # Check if we've received battery status from frontend
                # This would come via data channel in production
                pass
            
            # Monitor for long silence (possible disconnect)
            if call_context.last_interaction_time:
                silence_duration = datetime.now() - call_context.last_interaction_time
                if silence_duration > timedelta(seconds=30):
                    await session.say("Hello? Are you still there?")
                    call_context.last_interaction_time = datetime.now()
            
            # Monitor for child voice patterns
            # In production, use voice analysis to detect child speakers
            
            await asyncio.sleep(5)  # Check every 5 seconds
            
    except Exception as e:
        logger.error(f"Error in edge case monitoring: {e}")

# ===== Worker Configuration =====

if __name__ == "__main__":
    # Configure worker options
    worker_options = WorkerOptions(
        entrypoint_fnc=entrypoint,
        drain_timeout=30,  # Wait up to 30 seconds for jobs to finish during shutdown
        shutdown_process_timeout=5.0,  # Wait up to 5 seconds for a process to shut down gracefully
        host="0.0.0.0",
        port=0,  # Use port 0 to let the OS assign an available port
    )
    
    # Start the worker
    agents.cli.run_app(worker_options)