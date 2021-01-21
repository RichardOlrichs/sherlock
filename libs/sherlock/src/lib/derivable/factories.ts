import { Derivable, DerivableAtom, LensDescriptor, MaybeFinalState, SettableDerivable } from '../interfaces';
import { unresolved as unresolvedSymbol } from '../symbols';
import { ErrorWrapper, FinalWrapper } from '../utils';
import { Atom } from './atom';
import { Derivation } from './derivation';
import { Lens } from './lens';

const finalUnresolved = FinalWrapper.wrap(unresolvedSymbol);

/**
 * Construct a new atom with the provided initial value.
 *
 * @param value the initial value
 */
export function atom<V>(value: V): DerivableAtom<V> {
    return new Atom(value);
}
atom.unresolved = function unresolved<V>(): DerivableAtom<V> {
    return new Atom<V>(unresolvedSymbol);
};
atom.error = function error<V>(err: unknown): DerivableAtom<V> {
    return new Atom<V>(new ErrorWrapper(err));
};
atom.final = constant;

/**
 * Creates a new constant with the given value.
 *
 * @param value the immutable value of this Constant
 */
export function constant<V>(value: V): Derivable<V> {
    return new Atom<V>(FinalWrapper.wrap(value));
}
constant.unresolved = function unresolved<V>(): Derivable<V> {
    return new Atom<V>(finalUnresolved);
};
constant.error = function error<V>(err: unknown): Derivable<V> {
    return new Atom<V>(FinalWrapper.wrap(new ErrorWrapper(err)));
};

/**
 * Create a new derivation using the deriver function.
 *
 * @param deriver the deriver function
 */
export function derive<R>(f: () => MaybeFinalState<R>): Derivable<R>;
export function derive<R, P1>(f: (p1: P1) => MaybeFinalState<R>, p1: P1 | Derivable<P1>): Derivable<R>;
export function derive<R, P1, P2>(
    f: (p1: P1, p2: P2) => MaybeFinalState<R>,
    p1: P1 | Derivable<P1>,
    p2: P2 | Derivable<P2>,
): Derivable<R>;
export function derive<R, P>(f: (...ps: P[]) => MaybeFinalState<R>, ...ps: Array<P | Derivable<P>>): Derivable<R>;
export function derive<R, P>(f: (...ps: P[]) => MaybeFinalState<R>, ...ps: Array<P | Derivable<P>>): Derivable<R> {
    return new Derivation(f, ps.length ? ps : undefined);
}

/**
 * Create a new Lens using a get and a set function. The get is used as an normal deriver function
 * including the automatic recording of dependencies, the set is used as a sink for new values.
 *
 * @param descriptor the get and set functions
 */
export function lens<V>(descriptor: LensDescriptor<V, never>): SettableDerivable<V>;
export function lens<V, P1>(descriptor: LensDescriptor<V, P1>, p1: P1 | Derivable<P1>): SettableDerivable<V>;
export function lens<V, P1, P2>(
    descriptor: LensDescriptor<V, P1 | P2>,
    p1: P1 | Derivable<P1>,
    p2: P2 | Derivable<P2>,
): SettableDerivable<V>;
export function lens<V, P>(descriptor: LensDescriptor<V, P>, ...ps: Array<P | Derivable<P>>): SettableDerivable<V>;
export function lens<V, P>(descriptor: LensDescriptor<V, P>, ...ps: Array<P | Derivable<P>>): SettableDerivable<V> {
    return new Lens(descriptor, ps.length ? ps : undefined);
}
