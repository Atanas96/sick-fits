import gql from 'graphql-tag';
import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existings = [], { args, cache }) {
      console.log({ existings, args, cache });
      const { skip, first } = args;
      // Read the number of items on the page
      const data = cache.readQuery({ query: PAGINATION_QUERY }); // get the data from the pagination

      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existings.slice(skip, skip + first).filter((x) => x);
      // If there are items and there arent enough items to setisfy how many were requested and we are on the last page
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we dont have any items, we must go to the network to fetch them
        return false;
      }
      // If there are items, just return them from the cache, and we dont need to go to the network (database)
      if (items.length) {
        console.log(`There are ${items.length} items in the cache`);
        return items;
      }
      return false; // fallback to network

      // First thing it does it asks the read function for those items
      // We can either do one of two things:
      // First thing we can do is return the items because they are already in the cache
      // The other thing we can do is to return false from here, (network request)
    },

    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when the Apollo client comes back from the network with our products
      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);
      // finally we return the merged items from the cache
      return merged;
    },
  };
}
