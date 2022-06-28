all: build-web build-api build-docker deploy
build-docker: 
	docker build . -t harryhsu4/detection-drawer:latest
build-web:
	cd web && npm run build && cd ../
build-api:
	cd api && npm run build && cd ../
deploy:
	docker push harryhsu4/detection-drawer:latest
