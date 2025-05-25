"""
Healthcare Services
==================
Simulated healthcare services for facility finding, appointment booking, 
and emergency triage
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any

from models.data_models import RiskLevel

logger = logging.getLogger(__name__)

async def emergency_triage(symptoms: List[str], severity: str) -> RiskLevel:
    """
    Performs emergency triage based on symptoms and severity
    
    Args:
        symptoms: List of symptom descriptions
        severity: Severity level (mild, moderate, severe)
        
    Returns:
        RiskLevel enum indicating urgency
    """
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
    """
    Finds healthcare facilities based on location and specialty
    
    Args:
        location: Patient's location (city, neighborhood, etc.)
        specialty: Optional medical specialty to filter by
    
    Returns:
        List of facility dictionaries with details
    """
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
    """
    Books an appointment at a healthcare facility
    
    Args:
        facility: Facility dictionary with details
        preferred_time: Preferred appointment time
    
    Returns:
        Appointment confirmation details
    """
    await asyncio.sleep(1.0)  # Simulate API call
    
    return {
        "confirmation_number": f"HL{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "facility": facility["name"],
        "appointment_time": preferred_time,
        "estimated_duration": "30 minutes",
        "preparation_instructions": "Please bring your ID and insurance card if available.",
        "status": "confirmed",
    }

def determine_specialty_from_symptoms(symptoms: List[str]) -> Optional[str]:
    """
    Determines the appropriate medical specialty based on symptoms
    
    Args:
        symptoms: List of symptom descriptions
    
    Returns:
        Appropriate medical specialty or None
    """
    symptoms_text = " ".join(symptoms).lower()
    
    if "child" in symptoms_text or "baby" in symptoms_text:
        return "pediatrics"
    elif "heart" in symptoms_text or "chest" in symptoms_text:
        return "cardiology"
    elif "broken" in symptoms_text or "fracture" in symptoms_text:
        return "orthopedics"
    
    return None