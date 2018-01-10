ci:
  make docker-build \
     clean \
     install \
     staging \
     staging-down
docker-build:
  docker build -f Dockerfile.staging -t graphql-api-server .
clean:
  docker-compose -f docker-compose.staging.yml run --rm clean
install:
  docker-compose -f docker-compose.staging.yml run --rm install
staging:
  docker-compose -f docker-compose.staging.yml up -d staging-deps
  docker-compose -f docker-compose.staging.yml run --rm staging
staging-down:
  docker-compose -f docker-compose.staging.yml down

link:
	heroku plugins:link "$(shell pwd)"

unlink:
	heroku plugins:uninstall heroku-docker

patch:
	npm version patch
	git push
	npm publish
