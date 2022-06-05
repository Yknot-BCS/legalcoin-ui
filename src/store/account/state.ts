import { AccountDetails, User, Session } from 'src/types';

export interface AccountStateInterface {
  loading: unknown;
  cryptoAccountName: string;
  cryptoAccountDetails: AccountDetails;
  useLocalSigner: boolean;
  showPlatformSigner: boolean;
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
    showPlatformSigner: false,
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
