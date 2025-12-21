"""
Système de chiffrement pour données sensibles
"""

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2
from cryptography.hazmat.backends import default_backend
import base64
import os
from typing import Optional


class EncryptionService:
    """Service de chiffrement pour données sensibles"""

    def __init__(self, master_key: Optional[str] = None):
        """
        Initialise le service de chiffrement

        Args:
            master_key: Clé maître pour le chiffrement (doit être en base64)
        """
        if master_key:
            self.key = master_key.encode()
        else:
            # Générer une clé si non fournie (à éviter en production)
            self.key = Fernet.generate_key()

        self.cipher = Fernet(self.key)

    @staticmethod
    def generate_key() -> str:
        """Génère une nouvelle clé de chiffrement"""
        return Fernet.generate_key().decode()

    @staticmethod
    def derive_key(password: str, salt: bytes) -> bytes:
        """
        Dérive une clé de chiffrement depuis un mot de passe

        Args:
            password: Mot de passe source
            salt: Salt pour la dérivation

        Returns:
            Clé de chiffrement dérivée
        """
        kdf = PBKDF2(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend(),
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        return key

    def encrypt(self, data: str) -> str:
        """
        Chiffre des données

        Args:
            data: Données en clair

        Returns:
            Données chiffrées (base64)
        """
        encrypted = self.cipher.encrypt(data.encode())
        return base64.urlsafe_b64encode(encrypted).decode()

    def decrypt(self, encrypted_data: str) -> str:
        """
        Déchiffre des données

        Args:
            encrypted_data: Données chiffrées (base64)

        Returns:
            Données en clair
        """
        try:
            encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted = self.cipher.decrypt(encrypted_bytes)
            return decrypted.decode()
        except Exception as e:
            raise ValueError(f"Erreur de déchiffrement: {str(e)}")

    def encrypt_file(self, file_path: str, output_path: str) -> None:
        """Chiffre un fichier"""
        with open(file_path, "rb") as f:
            data = f.read()

        encrypted = self.cipher.encrypt(data)

        with open(output_path, "wb") as f:
            f.write(encrypted)

    def decrypt_file(self, encrypted_path: str, output_path: str) -> None:
        """Déchiffre un fichier"""
        with open(encrypted_path, "rb") as f:
            encrypted_data = f.read()

        decrypted = self.cipher.decrypt(encrypted_data)

        with open(output_path, "wb") as f:
            f.write(decrypted)


# Singleton global (utilise la clé de l'environnement)
_encryption_service = None


def get_encryption_service() -> EncryptionService:
    """Retourne l'instance globale du service de chiffrement"""
    global _encryption_service
    if _encryption_service is None:
        encryption_key = os.getenv("ENCRYPTION_KEY")
        _encryption_service = EncryptionService(encryption_key)
    return _encryption_service
