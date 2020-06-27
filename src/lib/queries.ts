import gql from 'graphql-tag';

export const LONDON_USERS = gql`
  query LondonUsers {
    londonUsers {
      id
      first_name
      last_name
      email
      ip_address
      latitude
      longitude
      distance
      livesInLondon
    }
  }
  `;