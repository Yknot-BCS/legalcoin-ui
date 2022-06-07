import { UALError, UALErrorType } from 'universal-authenticator-library';
import { APIError } from '@greymass/eosio';

// Mimics an eosjs error
export class UALPlatformSignerError extends UALError {
  constructor(
    message: string,
    type: UALErrorType,
    cause: APIError | unknown | null
  ) {
    let m = message;
    // TODO typechecking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let e: any = new Error(message);
    if (cause instanceof APIError) {
      if (cause.details && cause.details[0]) {
        m = cause.details[0].message;
        e = new Error(cause.details[0].message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      e.json = {
        code: 500,
        error: cause.error,
        message: 'Internal Service Error'
      };
    }
    super(m, type, e, 'Platform Signer');
  }
}
