from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import (
    openai,
    cartesia,
    deepgram,
    noise_cancellation,
    silero,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv()


class HealLinkAssistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions="""
        You are a helpful AI healthcare assistant for the Heallink platform. 
        Your goal is to assist patients with their healthcare needs and questions. 
        Keep responses professional, accurate, and empathetic. 
        Do not provide specific medical advice or diagnoses, but help users 
        understand general health information and guide them to appropriate care. 
        If asked about an emergency, always suggest contacting emergency services. 
        Be concise in your responses.
        """)


async def entrypoint(ctx: agents.JobContext):
    session = AgentSession(
        stt=deepgram.STT(model="nova-3", language="multi"),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=cartesia.TTS(),
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )

    await session.start(
        room=ctx.room,
        agent=HealLinkAssistant(),
        room_input_options=RoomInputOptions(
            # LiveKit Cloud enhanced noise cancellation
            # - If self-hosting, omit this parameter
            # - For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(), 
        ),
    )

    await ctx.connect()

    await session.generate_reply(
        instructions="Greet the user, introduce yourself as Heallink's AI healthcare assistant, and offer your assistance."
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))