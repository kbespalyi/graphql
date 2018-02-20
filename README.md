#web-ressource https://medium.com/@patrickleet/i-have-a-confession-to-make-i-commit-to-master-6a804f334beb

#Automating the pipeline

make ci

#Docker build

1) docker image build -f Dockerfile --build-arg PORT=5300 -t graphql-api-server .
2) docker-compose -f docker-compose.yml up -d staging-deps

# Docker run graphql

docker-compose -f docker-compose.yml run --rm staging

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

# USING Heroku service


# USING Kubernetes Cluster on Docker for Mac 18.01 using Swarm CLI
ressource: http://collabnix.com/running-kubernetes-cluster-on-docker-for-mac-18-01-using-swarm-cli/

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
