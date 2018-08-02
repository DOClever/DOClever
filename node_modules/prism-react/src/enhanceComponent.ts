import { Component, ComponentClass, PropTypes, StatelessComponent } from 'react';
import { Action, Dispatch, Store } from 'redux';
import { createEagerElement } from 'recompose';

type Context<S> = {
  store: Store<S>
};

export interface Wrapper {
  (type: string): string
};

export interface Selector<P, S> {
  (state : P): S
};

type Props<P, S> = {
  wrapper: Wrapper,
  selector: Selector<P, S>
};

const contextDefintion = { store: PropTypes.object.isRequired };

export default <P, S> (
  EnhanceableComponent : ComponentClass<any> | StatelessComponent<any>
) : ComponentClass<Props<P, S>> =>
  class PrismEnhancedComponent extends Component<Props<P, S>, void> {

    static childContextTypes = contextDefintion;
    static contextTypes = contextDefintion;

    static propTypes = {
      wrapper: PropTypes.func.isRequired,
      selector: PropTypes.func.isRequired
    };

    context: Context<P>;

    getChildContext() {
      const {
        selector,
        wrapper
      } = this.props;

      const {
        store
      } = this.context;

      const dispatch : Dispatch<S> = (action : Action) =>
        store.dispatch({
          ...action,
          type: wrapper(action.type)
        });
      
      const getState = (state : S) => selector(store.getState());

      return {
        store: {
          ...store,
          dispatch,
          getState
        }
      };
    }

    render() {
      const { selector, wrapper, ...rest } = this.props;

      return createEagerElement(
        EnhanceableComponent,
        rest
      );
    }
  }