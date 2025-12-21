"""
Validation avancée des entrées utilisateur
"""

import re
from typing import Optional, List
from fastapi import HTTPException, status
import html
import bleach


class InputValidator:
    """Validation et sanitisation des entrées utilisateur"""

    # Patterns de validation
    EMAIL_PATTERN = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    URL_PATTERN = re.compile(
        r"^https?://"  # http:// or https://
        r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"  # domain
        r"localhost|"  # localhost
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"  # IP
        r"(?::\d+)?"  # optional port
        r"(?:/?|[/?]\S+)$",
        re.IGNORECASE,
    )

    # Patterns d'attaques SQL
    SQL_INJECTION_PATTERNS = [
        r"(\bor\b|\band\b).*?=.*?",
        r"union.*?select",
        r"insert.*?into",
        r"delete.*?from",
        r"drop.*?table",
        r"exec(\s|\+)+(s|x)p\w+",
        r"';.*?--",
        r"';.*?#",
    ]

    # Patterns XSS
    XSS_PATTERNS = [
        r"<script[^>]*>.*?</script>",
        r"javascript:",
        r"onerror\s*=",
        r"onload\s*=",
        r"onclick\s*=",
        r"<iframe",
        r"<object",
        r"<embed",
    ]

    @staticmethod
    def validate_email(email: str) -> str:
        """
        Valide et normalise une adresse email

        Args:
            email: Adresse email à valider

        Returns:
            Email normalisé (lowercase, trimmed)

        Raises:
            HTTPException: Si l'email est invalide
        """
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Email requis"
            )

        email = email.strip().lower()

        if not InputValidator.EMAIL_PATTERN.match(email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Format d'email invalide",
            )

        if len(email) > 255:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email trop long (max 255 caractères)",
            )

        return email

    @staticmethod
    def validate_password(password: str, min_length: int = 8) -> None:
        """
        Valide la force d'un mot de passe

        Args:
            password: Mot de passe à valider
            min_length: Longueur minimale requise

        Raises:
            HTTPException: Si le mot de passe ne respecte pas les critères
        """
        if not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Mot de passe requis"
            )

        if len(password) < min_length:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Le mot de passe doit contenir au moins {min_length} caractères",
            )

        if len(password) > 128:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mot de passe trop long (max 128 caractères)",
            )

        # Vérifier la complexité
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)

        if not (has_upper and has_lower and has_digit):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
            )

    @staticmethod
    def validate_url(url: str, require_https: bool = True) -> str:
        """
        Valide une URL

        Args:
            url: URL à valider
            require_https: Si True, n'accepte que HTTPS

        Returns:
            URL validée

        Raises:
            HTTPException: Si l'URL est invalide
        """
        if not url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="URL requise"
            )

        url = url.strip()

        if not InputValidator.URL_PATTERN.match(url):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Format d'URL invalide"
            )

        if require_https and not url.startswith("https://"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'URL doit utiliser HTTPS",
            )

        return url

    @staticmethod
    def sanitize_html(content: str, allowed_tags: Optional[List[str]] = None) -> str:
        """
        Nettoie le HTML pour prévenir les attaques XSS

        Args:
            content: Contenu HTML à nettoyer
            allowed_tags: Liste des balises autorisées

        Returns:
            HTML nettoyé
        """
        if allowed_tags is None:
            # Balises sûres par défaut
            allowed_tags = [
                "p",
                "br",
                "strong",
                "em",
                "u",
                "a",
                "ul",
                "ol",
                "li",
                "h1",
                "h2",
                "h3",
            ]

        allowed_attrs = {
            "a": ["href", "title"],
        }

        # Utiliser bleach pour nettoyer
        cleaned = bleach.clean(
            content, tags=allowed_tags, attributes=allowed_attrs, strip=True
        )

        return cleaned

    @staticmethod
    def sanitize_text(text: str, max_length: Optional[int] = None) -> str:
        """
        Nettoie du texte simple

        Args:
            text: Texte à nettoyer
            max_length: Longueur maximale autorisée

        Returns:
            Texte nettoyé

        Raises:
            HTTPException: Si le texte est trop long
        """
        if not text:
            return ""

        # Supprimer les caractères de contrôle
        text = "".join(char for char in text if ord(char) >= 32 or char == "\n")

        # Échapper les caractères HTML
        text = html.escape(text)

        # Vérifier la longueur
        if max_length and len(text) > max_length:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Texte trop long (max {max_length} caractères)",
            )

        return text.strip()

    @staticmethod
    def detect_sql_injection(text: str) -> bool:
        """
        Détecte les tentatives d'injection SQL

        Args:
            text: Texte à analyser

        Returns:
            True si une tentative d'injection est détectée
        """
        text_lower = text.lower()

        for pattern in InputValidator.SQL_INJECTION_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True

        return False

    @staticmethod
    def detect_xss(text: str) -> bool:
        """
        Détecte les tentatives XSS

        Args:
            text: Texte à analyser

        Returns:
            True si une tentative XSS est détectée
        """
        text_lower = text.lower()

        for pattern in InputValidator.XSS_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True

        return False

    @staticmethod
    def validate_safe_input(text: str, field_name: str = "input") -> str:
        """
        Valide qu'une entrée ne contient pas de code malveillant

        Args:
            text: Texte à valider
            field_name: Nom du champ (pour les messages d'erreur)

        Returns:
            Texte validé

        Raises:
            HTTPException: Si du code malveillant est détecté
        """
        if InputValidator.detect_sql_injection(text):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Contenu suspect détecté dans {field_name}",
            )

        if InputValidator.detect_xss(text):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Contenu suspect détecté dans {field_name}",
            )

        return text
