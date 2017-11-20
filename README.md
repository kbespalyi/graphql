# graphql
Demo: GraphQL

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
