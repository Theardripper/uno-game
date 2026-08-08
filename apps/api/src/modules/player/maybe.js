// maybe.js - Implementação da Monad Maybe
export class Maybe {
  constructor(value) {
    this.value = value;
  }

  // Contrutor / Instanciação
  static of(value) {
    return new Maybe(value);
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  // Interface de Functor (map)
  map(fn) {
    if (this.isNothing()) {
      return Maybe.of(null);
    }
    return Maybe.of(fn(this.value));
  }

  // Interface de Monad (flatMap / chain / bind)
  flatMap(fn) {
    if (this.isNothing()) {
      return Maybe.of(null);
    }
    return fn(this.value);
  }

  // Retorna o valor ou um padrão
  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.value;
  }
}