import { Action, Handler, Unwrapper } from './types';

export interface UnwrapperHandlerPair<S> {
  unwrapper: Unwrapper,
  handler: Handler<S>
};

export default <S>(handlers : Array<UnwrapperHandlerPair<S>>, initialState : S) =>
  (state = initialState, action : Action) : S =>
    handlers
    .map(({ unwrapper, handler }) => ({ unwrappedAction: unwrapper(action), handler }))
    .reduce((currentState, { unwrappedAction, handler }) => {
      if (unwrappedAction) {
        return handler(currentState, unwrappedAction);
      } else {
        return currentState;
      }
    }, state);
