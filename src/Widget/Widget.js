import React from 'react'
import {Route, Switch} from 'react-router-dom';
import {MemoryRouter} from 'react-router'
import Example from './views/example';

export default function Widget() {
    return (
        <MemoryRouter>
            <Switch>
                <Route exact path='/' render={() => <Example/>}/>
            </Switch>
        </MemoryRouter>
    )
};
