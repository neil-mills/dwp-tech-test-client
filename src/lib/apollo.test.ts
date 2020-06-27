import ApolloClient from 'apollo-boost';
import { createApolloClient } from './apollo';

import { mocked } from 'ts-jest/utils';

const originalModule = jest.requireActual('apollo-boost');

jest.mock('apollo-boost', () => ({
	...originalModule,
	default: jest.fn(),
	InMemoryCache: jest.fn(),
}));

describe('createApolloClient', () => {
	const restoreMock = jest.fn();
	const writeDataMock = jest.fn();
	const mockCache = {
		writeData: writeDataMock,
		restore: restoreMock,
	};
	const mockUri = `/graphql`;
	let result: any;
	beforeEach(() => {
		mocked(ApolloClient).mockImplementation((opts: any): any => opts);
		result = createApolloClient({ cache: mockCache, uri: mockUri });
	});

	test('creates an apolloClient with correct args', () => {
		expect(ApolloClient).toHaveBeenCalledTimes(1);
		expect(ApolloClient).toHaveBeenCalledWith({
			cache: mockCache,
			uri: mockUri,
		});
	});

	test('returns the client', () => {
		expect(result).toEqual({
			uri: mockUri,
			cache: mockCache,
		});
	});
});
