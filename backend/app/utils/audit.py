"""
Système d'audit et logging sécurisé
"""

from datetime import datetime
from typing import Optional, Dict, Any
from app.utils.supabase import supabase_admin
import json
import hashlib


class AuditLogger:
    """Service d'audit pour tracer toutes les actions sensibles"""

    @staticmethod
    async def log_action(
        user_id: str,
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        success: bool = True,
        error_message: Optional[str] = None,
    ) -> None:
        """
        Enregistre une action dans les logs d'audit

        Args:
            user_id: ID de l'utilisateur
            action: Type d'action (CREATE, READ, UPDATE, DELETE, LOGIN, etc.)
            resource_type: Type de ressource (project, chapter, user, etc.)
            resource_id: ID de la ressource concernée
            ip_address: Adresse IP de l'utilisateur
            user_agent: User agent du navigateur
            metadata: Données supplémentaires
            success: Si l'action a réussi
            error_message: Message d'erreur si échec
        """
        try:
            audit_entry = {
                "user_id": user_id,
                "action": action,
                "resource_type": resource_type,
                "resource_id": resource_id,
                "ip_address": ip_address,
                "user_agent": user_agent,
                "metadata": json.dumps(metadata) if metadata else None,
                "success": success,
                "error_message": error_message,
                "action_timestamp": datetime.utcnow().isoformat(),
                "hash": None,  # Pour vérifier l'intégrité
            }

            # Créer un hash pour vérifier l'intégrité du log
            audit_entry["hash"] = AuditLogger._create_hash(audit_entry)

            # Insérer dans Supabase
            supabase_admin.table("audit_logs").insert(audit_entry).execute()

        except Exception as e:
            # Ne jamais faire échouer une requête à cause d'un problème d'audit
            print(f"⚠️ Erreur lors de l'audit: {str(e)}")

    @staticmethod
    def _create_hash(entry: Dict[str, Any]) -> str:
        """Crée un hash SHA256 de l'entrée d'audit pour vérifier l'intégrité"""
        # Créer une chaîne déterministe à partir de l'entrée
        data_string = f"{entry['user_id']}|{entry['action']}|{entry['resource_type']}|{entry['action_timestamp']}"
        return hashlib.sha256(data_string.encode()).hexdigest()

    @staticmethod
    async def log_security_event(
        event_type: str,
        severity: str,
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        """
        Enregistre un événement de sécurité critique

        Args:
            event_type: Type d'événement (BRUTE_FORCE, UNAUTHORIZED_ACCESS, etc.)
            severity: Niveau de sévérité (LOW, MEDIUM, HIGH, CRITICAL)
            user_id: ID utilisateur si applicable
            ip_address: Adresse IP source
            details: Détails supplémentaires
        """
        try:
            security_event = {
                "event_type": event_type,
                "severity": severity,
                "user_id": user_id,
                "ip_address": ip_address,
                "details": json.dumps(details) if details else None,
                "event_timestamp": datetime.utcnow().isoformat(),
            }

            supabase_admin.table("security_events").insert(security_event).execute()

            # Si événement critique, alerter immédiatement
            if severity == "CRITICAL":
                await AuditLogger._send_alert(security_event)

        except Exception as e:
            print(f"⚠️ Erreur lors du log de sécurité: {str(e)}")

    @staticmethod
    async def _send_alert(event: Dict[str, Any]) -> None:
        """Envoie une alerte pour un événement critique"""
        # TODO: Implémenter l'envoi d'emails/SMS/Slack pour les alertes critiques
        print(f"🚨 ALERTE SÉCURITÉ CRITIQUE: {event['event_type']}")


# Actions d'audit communes
class AuditAction:
    # Authentification
    LOGIN = "LOGIN"
    LOGOUT = "LOGOUT"
    LOGIN_FAILED = "LOGIN_FAILED"
    PASSWORD_RESET = "PASSWORD_RESET"
    EMAIL_VERIFIED = "EMAIL_VERIFIED"

    # CRUD
    CREATE = "CREATE"
    READ = "READ"
    UPDATE = "UPDATE"
    DELETE = "DELETE"

    # Génération IA
    AI_GENERATION = "AI_GENERATION"
    IMAGE_GENERATION = "IMAGE_GENERATION"

    # Export
    EXPORT_PDF = "EXPORT_PDF"
    EXPORT_EPUB = "EXPORT_EPUB"

    # Admin
    ADMIN_ACCESS = "ADMIN_ACCESS"
    ROLE_CHANGE = "ROLE_CHANGE"


# Types de ressources
class ResourceType:
    PROJECT = "project"
    CHAPTER = "chapter"
    USER = "user"
    PROFILE = "profile"
    CONVERSATION = "conversation"
    IMAGE = "image"
    EXPORT = "export"


# Événements de sécurité
class SecurityEvent:
    BRUTE_FORCE = "BRUTE_FORCE_ATTEMPT"
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS"
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
    INVALID_TOKEN = "INVALID_TOKEN"
    SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY"
    SQL_INJECTION_ATTEMPT = "SQL_INJECTION_ATTEMPT"
    XSS_ATTEMPT = "XSS_ATTEMPT"
    CSRF_ATTEMPT = "CSRF_ATTEMPT"


# Niveaux de sévérité
class Severity:
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"
