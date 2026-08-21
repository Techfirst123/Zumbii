import { CampaignStatus } from '@prisma/client';

export type EffectiveCampaignStatus = 'Draft' | 'Scheduled' | 'Active' | 'Expired';

export function computeEffectiveStatus(
  status: CampaignStatus,
  startAt: Date,
  endAt: Date,
  now: Date = new Date(),
): EffectiveCampaignStatus {
  if (status === 'DRAFT') return 'Draft';
  if (status === 'ENDED') return 'Expired';
  if (now < startAt) return 'Scheduled';
  if (now > endAt) return 'Expired';
  return 'Active';
}
