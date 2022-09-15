import { AccountDetails, User, Session } from 'src/types';
import { SignTransactionResponse } from 'universal-authenticator-library';
import { UALPlatformSignerError } from 'src/components/auth/UALPlatformSignerError';

// Mimics return transaction or error for platform signer
type PlatformSigner = {
  signedTransactionResponse: SignTransactionResponse | null;
  error: UALPlatformSignerError | null;
};

export interface AccountStateInterface {
  loading: unknown;
  localAccountName: string;
  localAccountDetails: AccountDetails;
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
    localAccountName: '',
    localAccountDetails: {} as AccountDetails,
    useLocalSigner: false,
    // Platform Signer
    platformSigner: {
      signedTransactionResponse: null,
      error: null
    },
    // Profile
    isLoggedIn: false,
    profile: {
      _id: '',
      name: '',
      surname: '',
      email: '',
      emailVerified: false,
      receiveEmailNotifications: false,
      accountName: '',
      publicKey: '',
      secret: '',
      linkedAccounts: [''],
      kyc: ''
    },
    session: {
      token: '',
      sessionLength: 0
    }
  };
}
