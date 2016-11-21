# stm-dashboard
Student classroom management system for St. Thomas More (www.stmschoolpa.com)

## Installation
1. Clone this repository - `git clone https://github.com/st-thomas-more/stm-dashboard.git`
2. Install dependencies - `npm install`
3. Create a `.env` file in the root directory containing:
<br>
    REACT_APP_AUTH0_CLIENT_ID=YOUR_CLIENT_ID
<br>
    REACT_APP_AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
<br>
    REACT_APP_SERVER_ADDRESS=YOUR_SERVER_ADDRESS

## Usage

Run the app in development mode - `npm start`
<br>
Open [localhost:3000](http://localhost:3000) to view it in the browser.

## Testing

Launch test runner in interactive watch mode - `npm test`

## Build

Build the dashboard for production to the `build` folder - `npm run build`

## Notes

This project is based on the [Starter Kit](https://github.com/facebookincubator/create-react-app) from Facebook Incubator.
<br>
See their [User Guide](https://github.com/facebookincubator/create-react-app/blob/master/template/README.md) for more information and development advice.
<br>
[Auth0](https://auth0.com/) is used for user authentication.
