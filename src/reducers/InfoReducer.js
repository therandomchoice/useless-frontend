export const setWarning = (message) => {
  return { type: 'set_warning', message };
};

export const addInfo = (message) => {
  return { type: 'add_info', message };
};

export const removeInfo = (message) => {
  return { type: 'remove_info', message };
};

export const addTimedInfo = (seconds, message) => (dispatch) => {
  dispatch(addInfo(message));
  setTimeout(() => dispatch(removeInfo(message)), seconds * 1000);
};

const initialState = {
  warnings: [],
  infos: [],
};

const InfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'set_warning':
      return {
        warnings: action.message !== null ? [action.message] : [],
        infos: state.infos,
      };
    case 'add_warning':
      return {
        warnings: state.warnings.concat(action.message),
        infos: state.infos,
      };
    case 'remove_warning':
      return {
        warnings: state.warnings.filter(
          (message) => message !== action.message
        ),
        infos: state.infos,
      };
    case 'add_info':
      return {
        infos: state.infos.concat(action.message),
        warnings: state.warnings,
      };
    case 'remove_info':
      return {
        infos: state.infos.filter((w) => w !== action.message),
        warnings: state.warnings,
      };
    default:
      return state;
  }
};

export default InfoReducer;
