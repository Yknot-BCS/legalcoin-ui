import { AnyAction } from '@greymass/eosio';
import { AccountDetails, User, Session } from 'src/types';
import { SignTransactionResponse } from 'universal-authenticator-library';
import { UALPlatformSignerError } from 'src/components/auth/UALPlatformSignerError';

// Mimics return transaction or error for platform signer
type PlatformSigner = {
  actions: AnyAction[];
  signedTransactionResponse: SignTransactionResponse | null;
  error: UALPlatformSignerError | null;
};

export interface AccountStateInterface {
  loading: unknown;
  cryptoAccountName: string;
  cryptoAccountDetails: AccountDetails;
  useLocalSigner: boolean;
  platformSigner: PlatformSigner;
  isLoggedIn: boolean;
  profile: User;
  session: Session;
}

export function state(): AccountStateInterface {
  return {
    // Local Signer
    loading: false,
    cryptoAccountName: '',
    cryptoAccountDetails: {} as AccountDetails,
    useLocalSigner: false,
    // Platform Signer
    platformSigner: {
      actions: [],
      signedTransactionResponse: null,
      error: null
    },
    // Profile
    isLoggedIn: false,
    profile: {
      name: '',
      surname: '',
      email: '',
      emailVerified: false,
      receiveEmailNotifications: false,
      cryptoAccount: {
        accountName: '',
        publicKey: '',
        secret: '',
        linkedAccounts: ['']
      }
    },
    session: {
      token: '',
      sessionLength: 0
    }
  };
}
