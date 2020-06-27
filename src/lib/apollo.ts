import ApolloClient, { InMemoryCache } from 'apollo-boost';
const cache = new InMemoryCache();
import { MockClient } from '../lib/types'

interface Args {
	cache?: any;
	uri?: string;
}

export const createApolloClient = (args: Args = {}): ApolloClient<unknown> | MockClient  => {
	const client = new ApolloClient({
		cache,
    uri: `/api`,
    ...args
	});
	return client;
};
