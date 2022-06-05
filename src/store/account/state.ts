import { AnyAction } from '@greymass/eosio';
import { AccountDetails, User, Session } from 'src/types';

type PlatformSigner = {
  actions: AnyAction[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signedTransaction: any;
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
      signedTransaction: null
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
