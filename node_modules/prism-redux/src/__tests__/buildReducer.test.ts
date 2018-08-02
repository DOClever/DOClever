import { Action } from '../types';
import buildReducer from '../buildReducer';

const staticUnwrapper = (action : Action) => action;

describe('buildReducer', () => {
  it('should return an initial state when undefined state is provided', () => {
    const initialState = 42;

    const reducer = buildReducer([{
      unwrapper: staticUnwrapper,
      handler: state => state
    }], initialState);

    expect(reducer(undefined, { type: 'foobar' }))
      .toBe(initialState);
  });

  it('should provide unwrapped action as argument', () => {
    const actionType = 'UNWRAPPED';

    const reducer = buildReducer([{
      unwrapper: action => ({ type: actionType}),
      handler: ((state, { type }) => type)
    }], '');

    expect(reducer(undefined, { type: 'bazbar' })).toBe(actionType);
  });

  it('should not call the handler if it does not unwrapper doesnt match the action', () => {
    const nonMatchingActionType = 'NonMatching';
    const matchingActionType = 'Matching';

    const initialState = 42;

    const reducer = buildReducer([{
      unwrapper: action => {
        if (action.type === matchingActionType) {
          return action;
        } else {
          return null;
        }
      },
      handler: () => 43
    }], initialState);

    expect(reducer(undefined, { type: nonMatchingActionType })).toBe(initialState);
    expect(reducer(undefined, { type: matchingActionType })).toBe(43);
  });

  it('should return original reference to the state when no action is handled', () => {
    const state = {};

    const reducer = buildReducer([{
      unwrapper: action => null,
      handler: state => ({ ...state })
    }], state);

    expect(reducer(undefined, { type: 'foo' })).toBe(state);
  })
});
