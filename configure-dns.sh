#!/bin/bash

# Carrega as credenciais do arquivo .env
source .env.godaddy

# Configurações
DOMAIN="segundoinquilino.com.br"
NETLIFY_URL="jovial-kheer-90cc3d.netlify.app"

# Lista todos os domínios primeiro para debug
echo "Listando domínios disponíveis..."
curl -s -X GET \
    "https://api.godaddy.com/v1/domains" \
    -H "Authorization: sso-key $GODADDY_KEY" | json_pp

# Configura os registros DNS
echo -e "\n\nConfigurando registros DNS..."
curl -X PUT \
    "https://api.godaddy.com/v1/domains/$DOMAIN/records" \
    -H "Authorization: sso-key $GODADDY_KEY" \
    -H "Content-Type: application/json" \
    -d '[
        {
            "type": "A",
            "name": "@",
            "data": "75.2.60.5",
            "ttl": 600
        },
        {
            "type": "CNAME",
            "name": "www",
            "data": "'$NETLIFY_URL'",
            "ttl": 3600
        }
    ]'

# Verifica os registros
echo -e "\nVerificando registros configurados:"
curl -s -X GET \
    "https://api.godaddy.com/v1/domains/$DOMAIN/records" \
    -H "Authorization: sso-key $GODADDY_KEY" | json_pp
