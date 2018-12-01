## NATS-Queue Microservice
This service will receive POST request with following details, push contents to NATS Streaming. A subscriber worker then process the queue.
```bash
curl -X POST \
  http://localhost:3000/pub \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
	"firstName": "John",
	"lastName": "Appleseed"
}'
```
### NATS Streaming Config

```bash
docker pull nats-streaming
docker network create \
  --driver=bridge \
  --subnet=172.20.0.0/16 \
  --gateway=172.20.0.1 \
  custom
docker rm -f nats-streaming
docker run --network="custom" --ip=172.20.0.10 --name nats-streaming -d -p 4222:4222 -p 8222:8222 nats-streaming -store file -dir datastore
```

### Docker NATS-Queue
To run first create `prod.env` local file in project root and fill up as per `.env.sample`.

To build:
```bash
docker-compose build
```
To run:

```bash
docker-compose up
```

### Local development

After git cloning create `.env` local file in project root and fill up as per `.env.sample`.

```
npm i
npm run watch
```

