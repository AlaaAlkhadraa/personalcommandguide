"""Webinterface, fase 1: de reviewschermen van de eigenaar.

FastAPI met server-side HTML (Jinja2). Geen React, geen SPA, geen
build-stap — je start hem en het werkt. Mobiel-eerst, want de eigenaar
staat met zijn telefoon bij de brievenbus.

Fase 1 draait lokaal en heeft geen login: er zijn nog geen
klantaccounts, dus er valt nog niets af te schermen.
"""

from .app import maak_app

__all__ = ["maak_app"]
