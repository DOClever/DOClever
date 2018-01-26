declare const observableSymbol: symbol;
export default observableSymbol;

declare global {
  export interface SymbolConstructor {
    readonly observable: symbol;
  }

  export const Symbol: SymbolConstructor;
}

export interface Symbol {
  readonly [Symbol.observable]: symbol;
}
