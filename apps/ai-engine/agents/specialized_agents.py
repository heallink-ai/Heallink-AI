"""
Specialized Agents
=================
Specialized agent classes for different stages of the conversation flow
"""

import logging
import asyncio
from datetime import datetime
from typing import Optional

from livekit.agents import (
    Agent, 
    RunContext,
    get_job_context,
    function_tool
)

from agents.base_agent import HealLinkAgent
from models.data_models import CallContext, RiskLevel
from services.healthcare_services import emergency_triage, find_nearby_facilities, book_appointment, determine_specialty_from_symptoms

logger = logging.getLogger(__name__)

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
        logger.info("GreetingAgent activated")
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
        specialty = determine_specialty_from_symptoms(patient_data.symptoms)
        
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