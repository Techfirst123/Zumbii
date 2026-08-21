import { PrismaService } from '../prisma/prisma.service';

export interface ActiveCampaignInfo {
  campaignId: string;
  campaignName: string;
  campaignSlug: string;
  campaignPrice: number;
  discountPercent: number;
}

export async function getActiveCampaignsByProductId(
  prisma: PrismaService,
  productIds: string[],
): Promise<Map<string, ActiveCampaignInfo>> {
  const map = new Map<string, ActiveCampaignInfo>();
  if (productIds.length === 0) return map;

  const now = new Date();
  const rows = await prisma.campaignProduct.findMany({
    where: {
      productId: { in: productIds },
      campaign: { status: 'ACTIVE', startAt: { lte: now }, endAt: { gte: now } },
    },
    include: { campaign: { select: { id: true, name: true, slug: true } } },
    orderBy: { campaignPrice: 'asc' },
  });

  for (const row of rows) {
    if (map.has(row.productId)) continue;
    map.set(row.productId, {
      campaignId: row.campaign.id,
      campaignName: row.campaign.name,
      campaignSlug: row.campaign.slug,
      campaignPrice: Number(row.campaignPrice),
      discountPercent: Number(row.discountPercent),
    });
  }

  return map;
}
