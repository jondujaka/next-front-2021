import React from "react"
import { graphql, Link } from "gatsby"

const SamplePage = ({ data: { page } }) => {

  return (

	  <div>
	  <h1>{page.title} ??</h1>
	  <Link to={page.translations[0].uri}>Switch language</Link>
	  </div>
  )
}

export default SamplePage;

export const pageQuery = graphql`
  query PageById(
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
