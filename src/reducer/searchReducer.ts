export const searchActions = {
  SET_SEARCH_TEXT: "SET_SEARCH_TEXT",
  SET_SEARCH_INPUT: "SET_SEARCH_INPUT",
  SET_CACHE_TEXT: "SET_CACHE_TEXT",
  RESET_SEARCH: "RESET_SEARCH",
  ALL_RESET: "ALL_RESET",
} as const;

export interface SearchState {
  searchText: string;
  searchInput: boolean;
  cacheSearchText: string;
}

export type SearchAction =
  | { type: typeof searchActions.SET_SEARCH_TEXT; payload: string }
  | { type: typeof searchActions.SET_SEARCH_INPUT; payload: boolean }
  | { type: typeof searchActions.SET_CACHE_TEXT; payload: string }
  | { type: typeof searchActions.RESET_SEARCH }
  | { type: typeof searchActions.ALL_RESET };

export const initialSearchState: SearchState = {
  searchText: "",
  searchInput: false,
  cacheSearchText: "",
};

export const searchReducer = (
  state: SearchState,
  action: SearchAction
): SearchState => {
  switch (action.type) {
    case searchActions.SET_SEARCH_TEXT:
      return { ...state, searchText: action.payload };
    case searchActions.SET_SEARCH_INPUT:
      return { ...state, searchInput: action.payload };
    case searchActions.SET_CACHE_TEXT:
      return { ...state, cacheSearchText: action.payload };
    case searchActions.RESET_SEARCH:
      return { ...state, searchText: "", cacheSearchText: "" };
    case searchActions.ALL_RESET:
      return initialSearchState;
    default:
      return state;
  }
};
