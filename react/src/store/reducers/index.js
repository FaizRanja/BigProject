// third-party
import { combineReducers } from 'redux';

// project-imports
import menu from './menu';
import authReducier from './User';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  authReducier

  
});

export default reducers;
