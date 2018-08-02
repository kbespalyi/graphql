#web-resources:
 https://medium.com/@patrickleet/i-have-a-confession-to-make-i-commit-to-master-6a804f334beb
 https://www.thepolyglotdeveloper.com/2018/07/protect-graphql-properties-jwt-nodejs-application/

#Automating the pipeline

make ci

#Docker build

1) docker image build -f Dockerfile --build-arg PORT=5300 -t graphql-api-server .
2) docker-compose -f docker-compose.yml up -d staging-deps

# Docker run graphql

docker-compose -f docker-compose.yml run --rm staging

# Kill all running containers
docker kill $(docker ps -q)
# Delete all stopped containers (including data-only containers)
docker rm $(docker ps -a -q)
# Delete all 'untagged/dangling' (<none>) images
docker rmi $(docker images -q -f dangling=true)
# Delete ALL images
docker rmi $(docker images -q)

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

wget  --output-document=output.txt https://graphql-api-server.herokuapp.com/?query=%7B%0A%20%20book%28isbn%3A%20%220140373535%22%29%20%7B%0A%20%20%20%20title%0A%20%20%20%20isbn%0A%20%20%20%20isbn13%0A%20%20%20%20description%0A%20%20%20%20authors%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20books%20%7B%0A%20%20%20%20%20%20%20%20title%0A%20%20%20%20%20%20%20%20isbn%0A%20%20%20%20%20%20%20%20isbn13%0A%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A


# USING Heroku service

heroku login
heroku git:remote -a graphql-api-server
git push heroku master

# Test locally
heroku local web

# Restart HEROKU
heroku restart web.1



# USING Kubernetes Cluster on Docker for Mac 18.01 using Swarm CLI
resource: http://collabnix.com/running-kubernetes-cluster-on-docker-for-mac-18-01-using-swarm-cli/

# Checking
kubectl version
docker stack ls

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
