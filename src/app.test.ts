import * as App from './app';
import { User } from './lib/types';
import { createApolloClient } from './lib/apollo';
import { mocked } from 'ts-jest/utils';
import { MockClient } from './lib/types';
import { LONDON_USERS } from './lib/queries';

jest.mock('./lib/apollo', () => ({
	createApolloClient: jest.fn(),
}));

const mockUser: User = {
	id: '111',
	first_name: '',
	last_name: '',
	email: '',
	ip_address: '',
	latitude: 0.0,
	longitude: 0.0,
	distance: 0,
	livesInLondon: false,
};

interface MockData {
	data: {
		londonUsers: never | User[];
	};
	loading: boolean;
	networkStatus: number;
	stale: boolean;
}

const mockData: MockData = {
	data: {
		londonUsers: [],
	},
	loading: false,
	networkStatus: 200,
	stale: false,
};

const mockClient: MockClient = {
	query: jest.fn(),
};

describe('getLondonUsers', () => {
	beforeEach(() => {
		mocked(createApolloClient).mockReturnValue(mockClient);
	});

	test('Apollo client query is called correctly', async () => {
		const client = createApolloClient();
		await App.getLondonUsers(client);
		expect(client.query).toHaveBeenCalledTimes(1);
    expect(client.query).toHaveBeenCalledWith({ query: LONDON_USERS });
    
    mocked(client.query).mockRejectedValueOnce(new Error("network error"));
    await expect(mocked(client.query)).rejects.toMatchObject({ message: "network error" });
	});
});

describe('renderUserList', () => {
	const renderAppWrapper = () => {
		document.body.innerHTML = `<div id="app"></div>`;
	};
	beforeEach(() => {
		document.body.innerHTML = ``;
		mockData.data.londonUsers = [];
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('Only renders the results if app element exists in dom', async () => {
		renderAppWrapper();
		mockData.data.londonUsers = [mockUser];
		jest.spyOn(App, 'getLondonUsers').mockResolvedValueOnce(mockData);
		await App.renderUserList();
		expect(App.getLondonUsers).toBeCalledTimes(1);
	});

	test('Does not attempt to render if no app wrapper exists', async () => {
		await App.renderUserList();
		expect(App.getLondonUsers).toBeCalledTimes(0);
	});

	test('Results are rendered', async () => {
		renderAppWrapper();
		mockData.data.londonUsers = [mockUser];
		jest.spyOn(App, 'renderResults');
		jest.spyOn(App, 'getLondonUsers').mockResolvedValueOnce(mockData);
		await App.renderUserList();
		expect(App.renderResults).toHaveBeenCalledTimes(1);
		expect(document.querySelectorAll('.user-list__item').length).toBe(
			mockData.data.londonUsers.length,
		);
	});

	test('Renders no results', async () => {
		renderAppWrapper();
		jest.spyOn(App, 'getLondonUsers').mockResolvedValueOnce(mockData);
		jest.spyOn(App, 'renderResults');
		await App.renderUserList();
		expect(App.renderResults).toHaveBeenCalledTimes(0);
		expect(document.querySelectorAll('[data-alert="warning"]').length).toBe(1);
	});

	test('Renders the error message if data request fails', async () => {
		renderAppWrapper();
		const mockErrorMsg = 'mock test error';
		jest
			.spyOn(App, 'getLondonUsers')
			.mockRejectedValueOnce(new Error(mockErrorMsg));
		await App.renderUserList();
		const errorAlerts = document.querySelectorAll('[data-alert="error"]');
		expect(errorAlerts.length).toBe(1);
		expect(errorAlerts[0].textContent).toBe(`Error: ${mockErrorMsg}`);
	});
});
