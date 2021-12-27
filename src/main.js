import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './Widget/Widget';
import Config from './config';
import {StateMachineProvider} from "little-state-machine";
import InvalidApiToken from "./Widget/views/error/InvalidApiToken";
import {authenticateApiToken} from "./Widget/services/authenticateApiToken";
import NoSSLEnabled from "./Widget/views/error/NoSSL";
import axios from 'axios';

const widgetName = Config.name;
const widgetConfigName = widgetName + 'Config'
const defaultconfig = {
    is_owner: false
};


let widgetComponent = null;


function app(window) {
    // console.log(window)
    // console.log(`${widgetName} starting`);

    // If we don't already have a name for widget's global object
    // assigned by the host, then they must be using the simple <script> tag method
    // so we need to get our data out of that tag
    if (!window[widgetName]) {
        let tag = document.getElementById(widgetName + '-Script');

        if (!tag) {
            throw Error(`Cannot find script tag with id {$widgetName}-Script`);
        }

        let rawData = tag.getAttribute('data-config');
        rawData = rawData.replace(/'/g, "\"");
        let data = JSON.parse(rawData);

        window[widgetName] = data.name;

        let placeholder = {};
        (placeholder.q = []).push(['init', data.config]);

        window[window[widgetName]] = placeholder;
    }


    let placeholder = window[window[widgetName]];

    // override temporary (until the app loaded) handler
    // for widget's API calls
    window[window[widgetName]] = apiHandler;
    window[widgetConfigName] = defaultconfig;

    if (placeholder) {
        // console.log(`${widgetName} placeholder found`);
        // console.log('placeholder q: ', placeholder.q)
        let queue = placeholder.q;
        if (queue) {
            // console.log(`${widgetName} placeholder queue found`);

            for (var i = 0; i < queue.length; i++) {
                apiHandler(queue[i][0], queue[i][1]);
            }
        }
    }
}

function sslEnabled() {
    if (process.env.NODE_ENV !== 'production') {
        return true;
    } else {
        return 'https:' === document.location.protocol;
    }
}

function validApiToken(token) {
    return authenticateApiToken(token).then(response => {
        return response.data.status === 'authenticated';
    })
}

function setHeaders(token) {
    return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
}
/**
 Method that handles all API calls
 */
async function apiHandler(api, params) {
    if (!api) throw Error('API method required');
    api = api.toLowerCase();
    let config = window[widgetConfigName];

    // console.log(`Handling API call ${api}`, params, config);


    switch (api) {
        case 'init':
            config = Object.assign({}, config, params);
            window[widgetConfigName] = config;

            // get a reference to the created widget component so we can
            // call methods as needed
            widgetComponent = React.createRef();

            // check if SSL is required
            if (Config.requireSSL) {
                if (!sslEnabled()) {
                    ReactDOM.render(
                        <StateMachineProvider>
                            <NoSSLEnabled ref={widgetComponent}/>
                        </StateMachineProvider>, document.getElementById(config.targetElementId)
                    );
                }
            }
            if (Config.requireApiToken) {
                if (! await validApiToken(params.scriptToken)) {
                    ReactDOM.render(
                        <StateMachineProvider>
                            <InvalidApiToken ref={widgetComponent}/>
                        </StateMachineProvider>, document.getElementById(config.targetElementId)
                    );
                }
            }

            // set the global header for all calls to the server
            axios.defaults.headers.common = setHeaders(params.scriptToken);

            ReactDOM.render(
                <StateMachineProvider>
                    <Widget refs={widgetComponent}/>
                </StateMachineProvider>, document.getElementById(config.targetElementId)
            );

            break;
        case 'fo-submit':
            // Send the message to the current widget instance
            widgetComponent.current.setMessage(params);
            break;
        default:
            throw Error(`Method ${api} is not supported`);
    }
}

app(window);

export default app;
