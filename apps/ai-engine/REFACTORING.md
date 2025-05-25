# Heallink Agent Refactoring

This document describes the refactored structure of the Heallink Voice Agent system.

## Overview

The original `agent.py` has been refactored into a more modular structure with clear separation of concerns:

```
apps/ai-engine/
├── agent_main.py         # Main entry point for the agent
├── models/               # Data models and structures
│   ├── __init__.py
│   └── data_models.py    # Patient data, call context, risk levels
├── agents/               # Agent implementations
│   ├── __init__.py
│   ├── base_agent.py     # Base HealLinkAgent class
│   ├── specialized_agents.py # All conversation flow agents
│   └── edge_case_agents.py  # Special case handlers
├── services/             # External services and APIs
│   ├── __init__.py
│   └── healthcare_services.py # Facility finding, appointment booking, etc.
└── utils/                # Utility functions
    ├── __init__.py
    └── monitoring.py     # Edge case monitoring
```

## Key Components

### Models
- **data_models.py**: Contains all data structures used by the system including PatientData, CallContext, and RiskLevel.

### Agents
- **base_agent.py**: Contains the HealLinkAgent base class with common functionality.
- **specialized_agents.py**: Contains all the specialized agent classes for different conversation stages.
- **edge_case_agents.py**: Contains specialized agents for handling edge cases like child callers and multilingual support.

### Services
- **healthcare_services.py**: Contains service functions for emergency triage, facility finding, and appointment booking.

### Utils
- **monitoring.py**: Contains utilities for monitoring call state and handling edge cases.

## Entry Point

The new entry point is `agent_main.py`, which sets up the LiveKit agent session and starts the conversation flow with the GreetingAgent.

## How to Run

The agent can be run using:

```bash
python agent_main.py
```

Or using the provided `agent-entrypoint.sh` script, which has been updated to use the new entry point.

## Benefits of the New Structure

1. **Modularity**: Each component has a clear responsibility
2. **Maintainability**: Easier to locate and modify specific functionality
3. **Testability**: Components can be tested in isolation
4. **Readability**: Smaller, focused files are easier to understand
5. **Extensibility**: New agents or services can be added with minimal changes to existing code