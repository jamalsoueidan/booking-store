import {Outlet} from '@remix-run/react';

import type {
  CustomerPayoutAccountPayoutDetails,
  CustomerPayoutBankAccount,
  CustomerPayoutMobilePay,
} from '~/lib/api/model';

export function isMobilePay(
  details: CustomerPayoutAccountPayoutDetails,
): details is CustomerPayoutMobilePay {
  return (details as CustomerPayoutMobilePay).phoneNumber !== undefined;
}

export function isBankAccount(
  details: CustomerPayoutAccountPayoutDetails,
): details is CustomerPayoutBankAccount {
  return (details as CustomerPayoutBankAccount).bankName !== undefined;
}

export default function AccountPayouts() {
  return <Outlet />;
}
