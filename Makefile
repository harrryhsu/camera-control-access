all: build deploy
build: 
	docker build . -t harryhsu4/detection-drawer:latest
deploy:
	docker push harryhsu4/detection-drawer:latest