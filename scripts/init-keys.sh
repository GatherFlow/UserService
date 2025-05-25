#!/bin/bash

mkdir -p ./src/secrets

echo "$PRIVATE_KEY_B64" | base64 -d > ./src/secrets/private.pem
echo "$PUBLIC_KEY_B64" | base64 -d > ./src/secrets/public.pem

chmod 600 ./src/secrets/private.pem ./src/secrets/public.pem

# EOF