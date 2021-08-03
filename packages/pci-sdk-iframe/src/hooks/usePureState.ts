import { Dispatch, useReducer } from 'react';

/**
 * A pure alternative to useState.
 *
 * Calling setState with any object will update just the passed fields and leave the previous state as it is.
 *
 * @param initializerArg - The inital state,
 */
export default function usePureState<S>(initializerArg: S) {
	const [state, dispatch] = useReducer(pureReducer, initializerArg);

	// React has this typed as has "any" so we cast to a subset of the state.
	return { state, dispatch } as { state: S; dispatch: Dispatch<Partial<S>> };
}

function pureReducer<S>(state: S, action: Partial<S>) {
	return { ...state, ...action };
}
