"""
Data models for Heallink Voice Agent
====================================
Contains all data structures used by the agent system
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any

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
    """Risk levels for patient triage"""
    EMERGENCY = "emergency"
    URGENT = "urgent"
    MODERATE = "moderate"
    LOW = "low"