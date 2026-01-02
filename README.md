docker run -d \
 --name payload-client1 \
 --env-file /opt/payload/client1.env \
 --network payload-pud-network \
 --restart unless-stopped \
 -l "traefik.enable=true" \
 -l "traefik.http.routers.client1.rule=Host(`client1.yourdomain.com`)" \
 -l "traefik.http.routers.client1.entrypoints=websecure" \
 -l "traefik.http.routers.client1.tls.certresolver=letsencrypt" \
 -l "traefik.http.services.client1.loadbalancer.server.port=3000" \
 ghcr.io/YOUR_ORG/YOUR_IMAGE:latest
