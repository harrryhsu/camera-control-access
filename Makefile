all: build-web build-api build-docker
build-docker: 
	docker buildx build --platform linux/amd64,linux/arm64 -t harryhsu4/detection-drawer:latest --push .
build-web:
	cd web && npm run build && cd ../
build-api:
	cd api && npm run build && cd ../
start-buildx:
	docker buildx create --name builder --use --bootstrap