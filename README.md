#web-ressource https://medium.com/@patrickleet/i-have-a-confession-to-make-i-commit-to-master-6a804f334beb

#Make ci

make ci

#Docker build

1) docker image build -f Dockerfile.staging -t server-graphql .
2) docker-compose -f docker-compose.staging.yml up -d staging-deps

#Docker run graphql

docker-compose -f docker-compose.staging.yml run --rm staging

#Demo: GraphQL

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
