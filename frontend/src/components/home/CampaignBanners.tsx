"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Megaphone, ArrowRight } from "lucide-react";
import Container from "@/components/ui/container";
import { campaignsApi, resolveImageUrl, ApiError, type BackendCampaign } from "@/lib/api";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CampaignBanners() {
  const [campaigns, setCampaigns] = useState<BackendCampaign[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    campaignsApi
      .homepage()
      .then((res) => {
        if (!cancelled) setCampaigns(res);
      })
      .catch((err) => console.error(err instanceof ApiError ? err.message : err))
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || campaigns.length === 0) return null;

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className={`grid gap-5 ${
            campaigns.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {campaigns.map((campaign) => (
            <motion.div key={campaign.id} variants={fadeInUp}>
              <Link
                href={`/campaigns/${campaign.slug}`}
                className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-3xl bg-zumbii-950 px-7 py-8 sm:px-10 sm:py-10"
              >
                {campaign.bannerImageUrl && (
                  <Image
                    src={resolveImageUrl(campaign.bannerImageUrl)}
                    alt={campaign.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zumbii-950 via-zumbii-950/50 to-transparent" />
                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-400 backdrop-blur">
                    <Megaphone className="h-3 w-3" />
                    Limited-time campaign
                  </span>
                  <h3 className="mt-3 text-xl sm:text-2xl font-black text-white">{campaign.name}</h3>
                  {campaign.description && (
                    <p className="mt-2 max-w-md text-sm text-white/75 line-clamp-2">{campaign.description}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 group-hover:gap-2.5 transition-all">
                    Shop the sale <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
