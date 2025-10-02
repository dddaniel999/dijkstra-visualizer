import { useReducer } from "react";

type State = {
  from: string;
  to: string;
  weight: number;
  selected: string | null;
};

type Action =
  | { type: "SET_FROM"; id: string }
  | { type: "SET_TO"; id: string }
  | { type: "SET_WEIGHT"; value: number }
  | { type: "SET_SELECTED"; id: string | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FROM":
      return { ...state, from: action.id };
    case "SET_TO":
      return { ...state, to: action.id };
    case "SET_WEIGHT":
      return { ...state, weight: action.value };
    case "SET_SELECTED":
      return { ...state, selected: action.id };
    default:
      return state;
  }
}

export function usePanelState(init: {
  from: string;
  to: string;
  weight?: number;
}) {
  const [state, dispatch] = useReducer(reducer, {
    from: init.from,
    to: init.to,
    weight: init.weight ?? 1,
    selected: null,
  });

  return {
    ...state,
    setFrom: (id: string) => dispatch({ type: "SET_FROM", id }),
    setTo: (id: string) => dispatch({ type: "SET_TO", id }),
    setWeight: (value: number) => dispatch({ type: "SET_WEIGHT", value }),
    setSelected: (id: string | null) => dispatch({ type: "SET_SELECTED", id }),
  };
}
