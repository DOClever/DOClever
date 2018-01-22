export interface Action {
  type : string
};

export interface Unwrapper {
  (action : Action) : Action | null
};

export interface Handler<S> {
  (state : S, action : Action) : S
};
