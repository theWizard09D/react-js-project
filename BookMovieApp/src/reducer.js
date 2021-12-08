export const reducer = (state, action) => {
    switch (action.type) {
      case "ACCESS_TOKEN":
        const token = action.payLoad;
        return {
          ...state,
          accessToken: token
        }
  
      default:
        return state
    }
  }
  
  export const initialState = {
    accessToken: ""
  }