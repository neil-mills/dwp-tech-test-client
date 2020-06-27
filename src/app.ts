import { createApolloClient } from './lib/apollo';
import { LONDON_USERS } from './lib/queries';
import { UserData, User, MockClient } from './lib/types';
import { ApolloQueryResult } from 'apollo-client';
import ApolloClient from 'apollo-boost';

import './styles/styles.scss';

const apolloClient = createApolloClient();

export const getLondonUsers = (
	mockClient?: MockClient | ApolloClient<unknown> | MockClient,
): Promise<ApolloQueryResult<UserData>> => {
	return new Promise(async (resolve, reject) => {
		try {
			const client = mockClient || apolloClient;
			const users = await client.query({
				query: LONDON_USERS,
			});
			resolve(users);
		} catch (error) {
			reject(error);
		}
	});
};

export const renderResults = (users: User[]): string => {
	let list = '';
	users.forEach((user) => {
		const {
			first_name,
			last_name,
			email,
			ip_address,
			distance,
			livesInLondon,
		} = user;
		list += `
			<li class="user-list__item">
			<h3 class="user-list__item-title">${first_name} ${last_name}</h3>
			<ul class="user-list__item-meta">
				<li class="user-list__item-meta-attribute">
					Email: <a href="mailto:${email}" class="link" title="${email}">${email}</a>
				</li>
				<li class="user-list__item-meta-attribute">
					IP Address: ${ip_address}
				</li>
				<li class="user-list__item-meta-attribute">
					${
						livesInLondon
							? `Lives in London`
							: `Current distance from London: ${distance.toFixed(2)} miles`
					}
					<span>
					</span>
				</li>
			</ul>
		</li>
			`;
	});
	return list;
};

export const renderUserList = async (): Promise<void> => {
	const app: Element | null = document.querySelector('#app');
	if (app) {
		const render = (html: string): void => {
			app.innerHTML = html;
		};
		try {
			const { data } = await getLondonUsers();
			if (data?.londonUsers.length) {
				render(`
					<ol class="user-list">
					${renderResults(data.londonUsers)}
					</ol>
					`);
			} else {
				render('<p data-alert="warning" role="alert">No users found</p>');
			}
		} catch (error) {
			render(`<p data-alert="error" role="alert">${error}</p>`);
		}
	}
};

renderUserList();
