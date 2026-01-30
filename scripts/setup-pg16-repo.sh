#!/usr/bin/env bash
# PostgreSQL 16 n'est plus fourni pour Ubuntu Focal (20.04) par PGDG.
# Utilisez Docker (voir README ou MIGRATION.md) ou une base Neon/Supabase.
echo "Le dépôt PGDG ne fournit plus PostgreSQL pour Ubuntu Focal (20.04)."
echo "Options: 1) Docker (postgres:16)  2) Base en ligne Neon/Supabase + restauration via Docker"
exit 1
