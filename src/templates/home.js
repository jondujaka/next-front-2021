import React from "react"
import { graphql, Link } from "gatsby"

const Home = ({ data: { page } }) => {

	console.log(page);
  return (

	  <div>
	  <h1>{page.title} ??</h1>
	  {page.translations.length ? <Link to={page.translations[0].uri}>Switch language</Link> : null}
	  </div>
  )
}

export default Home;

export const pageQuery = graphql`
  query Homepage(
    # these variables are passed in via createPage.pageContext in gatsby-node.js
    $id: String!
  ) {
    # selecting the current page by id
    page: wpPage(id: { eq: $id }) {
      id
      content
      title
	  translations {
		  uri
	  }
    }
  }
`
