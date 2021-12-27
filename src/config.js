function baseEndpoint() {
    return {
        production: 'https://production.com/',
        development: 'http://localhost:3000'
    }
}

function getConfig() {
    return {
        name: "REACT-STARTER-WIDGET",
        requireSSL: false,
        requireApiToken: false,
        check_valid_api_token: buildEndpoint('/authenticate'),
    }
}

function buildEndpoint(route = null) {
    return process.env.NODE_ENV === "production" ? `${baseEndpoint().production}${route}` : `${baseEndpoint().development}${route}`;

}

export default getConfig();
