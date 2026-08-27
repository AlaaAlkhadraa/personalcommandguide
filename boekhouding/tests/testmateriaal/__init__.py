"""Hulpmiddelen om synthetisch testmateriaal te maken.

Bewust zonder externe bibliotheken: de stack ligt vast (Python, SQLite,
Pydantic, pytest) en testmateriaal genereren is geen reden om daarvan af
te wijken. De PDF- en JPEG-schrijvers hier zijn klein en doen precies
wat er voor factuurdocumenten nodig is, niet meer.
"""
