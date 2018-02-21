ci:
	make docker-build \
		clean \
		install \
		staging
#		 \
#		staging-down
docker-build:
	docker build -f Dockerfile --build-arg PORT=5300 -t kbespalyi/graphql-api-server .
clean:
#	docker-compose -f docker-compose.yml run --rm clean
install:
#	docker-compose -f docker-compose.yml run --rm install
staging:
	docker-compose -f docker-compose.yml up -d staging-deps
	docker-compose -f docker-compose.yml run --rm staging
staging-down:
	docker-compose -f docker-compose.yml down

herokuci:
	make link \
		unlink \
		patch
link:
	heroku plugins:link "$(shell pwd)"
unlink:
	heroku plugins:uninstall heroku-docker
patch:
	npm version patch
	git push
	npm publish
