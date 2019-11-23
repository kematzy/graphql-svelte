
import graphql, { fetchOptionsOverride } from "./config";
import { graphqlFetchOptions, hashObject, SubscribeQL } from "graphql-svelte";
import Observable from 'zen-observable';
let sub = new SubscribeQL('wss://go.spphone.uz/v1/graphql', {
  reconnect: true,
  // reconnectionAttempts:3,
  // timeout: 1000,
  lazy: true,
  connectionParams: async () => {
    return {
      headers: {
        "x-hasura-admin-secret": "tscorp"
      }
    };
  }
})


let subscribe = (query) => {
  return sub.request(query);
}


graphql.on('cache', onCache)

function onCache({ cacheKey: cachedCacheKey, cacheValue }) {

}
let get = async (query, variables) => {
  const fetchOptions = graphqlFetchOptions({
    query,
    variables
  });
  fetchOptionsOverride(fetchOptions)
  const has = hashObject(fetchOptions);
  if (graphql.cache[has])
    return new Promise((resolve, reject) => {
      resolve(graphql.cache[has]);
    });
  const pending = graphql.operate({
    fetchOptionsOverride,
    operation: {
      query,
      variables
    }
  });
  return pending.cacheValuePromise
}


export { get, subscribe };
