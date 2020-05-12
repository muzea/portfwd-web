import { createContext } from "react";
import { clear, set, get } from "./localStorage";

const initialState = {
  ServerConnected: false,
  host: "127.0.0.1",
  port: 3001,
  autoConnect: false,
  mapList: {},
};

const lsConfig = get();
if (lsConfig !== null) {
  initialState.host = lsConfig.host;
  initialState.port = lsConfig.port;
  initialState.autoConnect = lsConfig.autoConnect;
}

function reducer(state: typeof initialState, action): typeof initialState {
  switch (action.type) {
    case Action.ServerConnected:
      if (state.autoConnect) {
        set({
          host: state.host,
          port: state.port,
          autoConnect: true,
        });
      }
      return { ...state, ServerConnected: action.value };
    case Action.FormChange:
      if (action.key === "autoConnect") {
        if (action.value) {
        } else {
          clear();
        }
      }
      return { ...state, [action.key]: action.value };
    case Action.UpdateList:
      return { ...state, mapList: action.value };
    default:
      throw new Error();
  }
}

const Action = {
  ServerConnected: "ServerConnected",
  FormChange: "FormChange",
  UpdateList: "UpdateList",
};

const FormKey = {
  host: "host",
  port: "port",
};

const StateContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<any>;
}>(null);

export { initialState, reducer, FormKey, Action, StateContext };
