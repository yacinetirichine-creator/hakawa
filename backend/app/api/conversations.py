"""
Conversations routes - Chat créatif
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.models.schemas import (
    Conversation,
    ConversationCreate,
    ConversationMessage,
    MessageCreate,
)
from app.utils.supabase import supabase
from app.services.ai_service import AIService
from app.utils.admin import get_user_profile, assert_project_access

router = APIRouter()
ai_service = AIService()


@router.get("/{project_id}", response_model=Conversation)
async def get_conversation(
    project_id: str,
    user_id: Optional[str] = None,
    profile: dict = Depends(get_user_profile),
):
    """Get conversation for a project"""
    try:
        assert_project_access(profile, project_id)
        result = (
            supabase.table("conversations")
            .select("*")
            .eq("project_id", project_id)
            .execute()
        )

        if not result.data:
            # Create new conversation if doesn't exist
            new_conv = (
                supabase.table("conversations")
                .insert(
                    {
                        "project_id": project_id,
                        "phase": "exploration",
                        "messages": [],
                    }
                )
                .execute()
            )
            return new_conv.data[0]

        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{project_id}/message")
async def send_message(
    project_id: str,
    message: MessageCreate,
    user_id: Optional[str] = None,
    profile: dict = Depends(get_user_profile),
):
    """Send a message and get AI response"""
    try:
        assert_project_access(profile, project_id)
        # Get current conversation
        conv_result = (
            supabase.table("conversations")
            .select("*")
            .eq("project_id", project_id)
            .execute()
        )

        if not conv_result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")

        conversation = conv_result.data[0]
        messages = conversation.get("messages", [])
        phase = conversation.get("phase", "exploration")

        # Add user message
        user_msg = {
            "role": "user",
            "content": message.content,
            "timestamp": "now()",
        }
        messages.append(user_msg)

        # Get AI response based on phase
        ai_response = await ai_service.chat_response(
            message.content, phase=phase, history=messages, project_id=project_id
        )

        # Add assistant message
        assistant_msg = {
            "role": "assistant",
            "content": ai_response,
            "timestamp": "now()",
        }
        messages.append(assistant_msg)

        # Update conversation
        updated = (
            supabase.table("conversations")
            .update({"messages": messages})
            .eq("id", conversation["id"])
            .execute()
        )

        return {
            "message": assistant_msg,
            "conversation_id": conversation["id"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{project_id}/phase")
async def update_phase(
    project_id: str,
    phase: str,
    user_id: Optional[str] = None,
    profile: dict = Depends(get_user_profile),
):
    """Update conversation phase"""
    try:
        assert_project_access(profile, project_id)
        valid_phases = ["exploration", "planning", "writing", "illustration"]
        if phase not in valid_phases:
            raise HTTPException(
                status_code=400, detail=f"Invalid phase. Must be one of {valid_phases}"
            )

        result = (
            supabase.table("conversations")
            .update({"phase": phase})
            .eq("project_id", project_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")

        return {"phase": phase, "updated": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{project_id}")
async def clear_conversation(
    project_id: str,
    user_id: Optional[str] = None,
    profile: dict = Depends(get_user_profile),
):
    """Clear conversation messages"""
    try:
        assert_project_access(profile, project_id)
        result = (
            supabase.table("conversations")
            .update({"messages": []})
            .eq("project_id", project_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")

        return {"cleared": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
