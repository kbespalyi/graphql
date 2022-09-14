# web-resources:
 https://medium.com/@patrickleet/i-have-a-confession-to-make-i-commit-to-master-6a804f334beb
 https://www.thepolyglotdeveloper.com/2018/07/protect-graphql-properties-jwt-nodejs-application/

# Firstly, test this service via the mocha
>npm test

# Run locally
>npm start
-> http://localhost:4000

# Demo: GraphQL

Request to Goodreads:

{
  book(isbn: "0140373535") {
    title
    isbn
    isbn13
    description
    authors {
      name
      books {
        title
        isbn
        isbn13
        description
      }
    }
  }
}


# Docker build manually

1) docker build -f Dockerfile --build-arg PORT=5300 -t kbespalyi/graphql-api-server .
2) docker-compose -f docker-compose.yml up -d staging-deps

# Docker run graphql manually

1) docker run --name graphql-api-server -p 80:5300 -d kbespalyi/graphql-api-server:latest
2) docker-compose -f docker-compose.yml run --rm staging
3) docker run -d --restart no -p 80:5300 --env-file .env kbespalyi/graphql-api-server DB=mongodb node ./server/server.js

# OR by automating the pipeline

>make ci

# Stop containers
>docker stop containerID
>docker rm containerID

# Tags and push to Docker Hub
>docker tag kbespalyi/graphql-api-server kbespalyi/graphql-api-server
>docker push kbespalyi/graphql-api-server



# Kill all running containers
>docker kill $(docker ps -q)
# Delete all stopped containers (including data-only containers)
>docker rm $(docker ps -a -q)
# Delete all 'untagged/dangling' (<none>) images
>docker rmi $(docker images -q -f dangling=true)
# Delete ALL images
>docker rmi $(docker images -q)


# USING Heroku service

>heroku login
>heroku git:remote -a graphql-api-server
# Build with CLI
>git push heroku master

# Or Upgrading an app and build with Docker-Hub Cli
>heroku stack:set heroku-22 -a graphql-api-server
>git commit --allow-empty -m "Upgrading to heroku-22"
then up docker and build image
>docker build -f Dockerfile --build-arg PORT=5300 -t kbespalyi/graphql-api-server .
>docker tag kbespalyi/graphql-api-server kbespalyi/graphql-api-server
>docker push kbespalyi/graphql-api-server
then login to container via heroku
>heroku container:login
>docker login --username=_ --password=$(heroku auth:token) registry.heroku.com
then push and release container with name "web" (from heroku.yml)
>heroku container:push web
>heroku container:release web

# Test locally
>heroku local web

# Restart HEROKU
>heroku restart web.1

# Create output.txt based on the get-request to heroku service deployed
>wget  --output-document=output.txt https://graphql-api-server.herokuapp.com/?query=%7B%0A%20%20book%28isbn%3A%20%220140373535%22%29%20%7B%0A%20%20%20%20title%0A%20%20%20%20isbn%0A%20%20%20%20isbn13%0A%20%20%20%20description%0A%20%20%20%20authors%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20books%20%7B%0A%20%20%20%20%20%20%20%20title%0A%20%20%20%20%20%20%20%20isbn%0A%20%20%20%20%20%20%20%20isbn13%0A%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A



# USING Kubernetes Cluster on Docker for Mac 18.01 using Swarm CLI
resource:
- http://collabnix.com/running-kubernetes-cluster-on-docker-for-mac-18-01-using-swarm-cli/
- https://github.com/docker/compose-on-kubernetes

# init docker-machine
docker-machine rm default
docker-machine create --driver virtualbox default

docker-machine env default
> export DOCKER_TLS_VERIFY="1"
> export DOCKER_HOST="tcp://192.168.99.101:2376"
> export DOCKER_CERT_PATH="/Users/khuseinbespalyi/.docker/machine/machines/default"
> export DOCKER_MACHINE_NAME="default"

# Checking
kubectl version
docker stack ls

kubectl get all -n docker

# install
docker swarm init
brew install kubectl
curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.24.1/minikube-darwin-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/
minikube start

kubectl get services --namespace=kube-system

# Deploy to Kubernetes
docker stack deploy -c docker-compose.yml graphql-api-server
docker stack ls

# Checking services
kubectl get svc

# Checking pods
kubectl get pods

# Removing services
docker stack rm graphql-api-server
