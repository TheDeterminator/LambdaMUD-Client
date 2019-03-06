import {combineReducers, createStore, applyMiddleware, compose} from 'redux'
import playReducer from '../components/Play/reducer'
import playerReducer from '../components/Player/reducer'
import mapReducer from '../components/Map/reducer'
import Thunk from 'redux-thunk'
import logger from 'redux-logger'

const rootReducer = combineReducers({
    play: playReducer,
    character: playerReducer,
    map: mapReducer
})

const store = createStore(
    rootReducer, compose(applyMiddleware(Thunk, logger))
) 

export default store