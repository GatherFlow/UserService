import type { Maybe } from '../types/index.js'

export class Result<T, E> {
	private _value: Maybe<T>
	private _error: Maybe<E>

	private constructor({ value, error }: { value: Maybe<T>; error: Maybe<E> }) {
		this._value = value
		this._error = error
	}

	static success<T>(value: T): Result<T, null> {
		return new Result<T, never>({ value, error: null })
	}

	static fail<E>(error: E) {
		return new Result<never, E>({ value: null, error })
	}

	isSuccess() {
		return !!this._value
	}

	isFailure() {
		return !!this._error
	}

	get value(): T {
		if (!this._value) {
			throw new Error('Cannot get value from a failed result')
		}

		return this._value
	}

	get error(): E {
		if (!this._error) {
			throw new Error('Cannot get error from a successful result')
		}

		return this._error
	}
}
