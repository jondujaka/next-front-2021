import { ApolloClient } from 'apollo-boost';
import { ApolloLink } from 'apollo-link';
import { setContext } from "apollo-link-context";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-fetch';

const cache = new InMemoryCache();

export const client = new ApolloClient({
    cache,
    fetch,
    link: ApolloLink.from([
        setContext((req, prev) => {
          return ({
            headers: {
              ...prev.headers,
              // As long as we are on the same domain with or WP install and Gatsby front end, we can use the x-wp-nonce header to authenticate and fetch previews.
              "X-WP-Nonce": req.variables.nonce ? req.variables.nonce : '',
            },
          })
        }
        ),
        new HttpLink({
            uri: 'https://nextfestival.sk/content/graphql',
            credentials: 'include',
        }),
    ])
});