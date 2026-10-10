import React from 'react';
import { Badge } from '../ui/Badge';
import { RequestStatus, BookingStatus, VerificationStatus } from '@petco/shared';

export const StatusBadge = ({ status }: { status: RequestStatus | BookingStatus | VerificationStatus | string }) => {
  switch (status) {
    case RequestStatus.OPEN:
      return <Badge variant="brand">Open</Badge>;
    case RequestStatus.ACCEPTED:
    case BookingStatus.CONFIRMED:
      return <Badge variant="info">Confirmed</Badge>;
    case RequestStatus.IN_PROGRESS:
    case BookingStatus.IN_PROGRESS:
      return <Badge variant="warning">In Progress</Badge>;
    case RequestStatus.COMPLETED:
    case BookingStatus.COMPLETED:
    case VerificationStatus.VERIFIED:
      return <Badge variant="success">Completed</Badge>;
    case RequestStatus.CANCELLED:
    case BookingStatus.CANCELLED:
    case VerificationStatus.REJECTED:
      return <Badge variant="danger">Cancelled</Badge>;
    case VerificationStatus.PENDING:
      return <Badge variant="warning">Pending Verification</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
