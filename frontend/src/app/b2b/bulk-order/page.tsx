"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ShoppingBag,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Package,
  Truck,
  BadgePercent,
  Shield,
  IndianRupee,
  BarChart3,
  FileText,
  Send,
  ChevronRight,
  Sparkles,
  Zap,
  Users,
  Building2,
  Clock,
  Gift,
  Scale,
  Calculator,
  ClipboardList,
  Star,
  HeartHandshake,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function FadeInSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const tierData = [
  { tier: "Standard", minQty: "100", maxQty: "499", unitPrice: "₹849", discount: "0%", badge: "—" },
  { tier: "Silver", minQty: "500", maxQty: "999", unitPrice: "₹799", discount: "6%", badge: "Save ₹50/unit" },
  { tier: "Gold", minQty: "1,000", maxQty: "4,999", unitPrice: "₹729", discount: "14%", badge: "Save ₹120/unit" },
  { tier: "Platinum", minQty: "5,000", maxQty: "9,999", unitPrice: "₹649", discount: "24%", badge: "Save ₹200/unit" },
  { tier: "Enterprise", minQty: "10,000+", maxQty: "∞", unitPrice: "₹549", discount: "35%", badge: "Custom pricing" },
];

const benefits = [
  { icon: BadgePercent, title: "Up to 40% Savings", description: "Volume-based pricing with deeper discounts on larger quantities.", color: "from-emerald-500 to-green-400" },
  { icon: Truck, title: "Free Logistics", description: "Free pan-India delivery on orders above ₹50,000 with real-time tracking.", color: "from-blue-500 to-cyan-400" },
  { icon: Shield, title: "Quality Guarantee", description: "Strict QC checks and replacement guarantee on all bulk orders.", color: "from-violet-500 to-purple-400" },
  { icon: Clock, title: "Priority Manufacturing", description: "Dedicated production slots for bulk orders with faster turnaround.", color: "from-amber-500 to-orange-400" },
  { icon: Gift, title: "Sample Allocation", description: "Free product samples included with every bulk order above ₹1 Lakh.", color: "from-rose-500 to-pink-400" },
  { icon: FileText, title: "GST Invoicing", description: "Automated GST-compliant invoices with e-way bill generation.", color: "from-cyan-500 to-blue-400" },
  { icon: Scale, title: "Custom Packaging", description: "White-label and custom packaging options for enterprise orders.", color: "from-indigo-500 to-blue-400" },
  { icon: HeartHandshake, title: "Dedicated Manager", description: "Account manager assigned for order coordination and support.", color: "from-teal-500 to-cyan-400" },
];

export default function BulkOrderPage() {
  const [calculator, setCalculator] = useState({
    productPrice: 899,
    quantity: 100,
  });
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    unit: "Pcs",
    specifications: "",
    deliveryLocation: "",
    timeline: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const getUnitPrice = (qty: number) => {
    if (qty >= 10000) return 549;
    if (qty >= 5000) return 649;
    if (qty >= 1000) return 729;
    if (qty >= 500) return 799;
    return 849;
  };

  const unitPrice = getUnitPrice(calculator.quantity);
  const totalAmount = calculator.productPrice * calculator.quantity;
  const discountedUnitPrice = getUnitPrice(calculator.quantity);
  const discountedTotal = discountedUnitPrice * calculator.quantity;
  const savings = totalAmount - discountedTotal;
  const savingsPercent = Math.round((savings / totalAmount) * 100);

  const handleCalcChange = (field: string, value: string) => {
    setCalculator((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Bulk quote request submitted! Our team will contact you within 24 hours.");
      setFormData({
        productName: "", quantity: "", unit: "Pcs", specifications: "",
        deliveryLocation: "", timeline: "", name: "", company: "",
        email: "", phone: "", message: "",
      });
    }, 1500);
  };

  const inputClass = "w-full h-10 px-4 text-sm bg-white border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all";
  const labelClass = "block text-sm font-medium text-text-primary mb-1.5";

  const tierColors: Record<string, string> = {
    Standard: "bg-surface-tertiary border-border",
    Silver: "bg-slate-50 border-slate-200",
    Gold: "bg-amber-50 border-amber-200",
    Platinum: "bg-zumbii-50 border-zumbii-200",
    Enterprise: "bg-violet-50 border-violet-200",
  };

  return (
    <>
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zumbii-900 via-zumbii-800 to-zumbii-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-zumbii-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-zumbii-300/20 rounded-full blur-3xl" />

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                <ShoppingBag className="w-4 h-4 text-zumbii-200" />
                <span className="text-sm font-medium text-white/90">Bulk Ordering</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                Order in Bulk,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zumbii-200 to-white">
                  Save Big
                </span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-4 text-lg text-white/70 max-w-xl leading-relaxed">
                Get the best wholesale prices with volume-based discounts. Free delivery, quality guarantee, and dedicated support on every bulk order.
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-4 text-white/50 text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Volume discounts</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Free delivery</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> GST invoices</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Quality assured</span>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <FadeInSection>
              <Card className="p-6 sm:p-8" glass={true}>
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-zumbii-600" />
                  Bulk Pricing Calculator
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Product Unit Price (₹)</label>
                    <input
                      type="number"
                      value={calculator.productPrice}
                      onChange={(e) => handleCalcChange("productPrice", e.target.value)}
                      className={inputClass}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Order Quantity</label>
                    <input
                      type="number"
                      value={calculator.quantity}
                      onChange={(e) => handleCalcChange("quantity", e.target.value)}
                      className={inputClass}
                      min="1"
                    />
                  </div>

                  <div className="border-t border-border pt-5 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Base Unit Price</span>
                      <span className="font-medium text-text-primary">₹{calculator.productPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Bulk Unit Price</span>
                      <span className="font-medium text-emerald-600">₹{discountedUnitPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Quantity</span>
                      <span className="font-medium text-text-primary">{calculator.quantity.toLocaleString()} units</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Without Bulk Discount</span>
                      <span className="font-medium text-text-primary">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">With Bulk Discount</span>
                      <span className="font-bold text-lg text-zumbii-600">₹{discountedTotal.toLocaleString()}</span>
                    </div>
                    {savings > 0 && (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-800">You Save</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-emerald-600">₹{savings.toLocaleString()}</span>
                            <span className="ml-2 text-xs font-medium text-emerald-500">({savingsPercent}% off)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </FadeInSection>

            <div className="space-y-6">
              <FadeInSection>
                <Card className="overflow-hidden">
                  <div className="p-6 border-b border-border bg-gradient-to-r from-zumbii-50 to-white">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-zumbii-600" />
                      Quantity Pricing Tiers
                    </h3>
                    <p className="text-sm text-text-tertiary mt-1">Based on product unit price of ₹{calculator.productPrice}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-surface-tertiary">
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase">Tier</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase">Quantity Range</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase">Unit Price</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase">Discount</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase">Benefit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {tierData.map((tier) => {
                          const isActive = calculator.quantity >= parseInt(tier.minQty.replace(/,/g, "")) &&
                            (tier.maxQty === "∞" || calculator.quantity <= parseInt(tier.maxQty.replace(/,/g, "")));
                          return (
                            <tr
                              key={tier.tier}
                              className={`${tierColors[tier.tier]} ${
                                isActive ? "ring-2 ring-zumbii-400 ring-inset bg-zumbii-50/50" : ""
                              } transition-all`}
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-bold ${
                                    tier.tier === "Enterprise" ? "text-violet-600" :
                                    tier.tier === "Platinum" ? "text-zumbii-600" :
                                    tier.tier === "Gold" ? "text-amber-600" : "text-text-primary"
                                  }`}>{tier.tier}</span>
                                  {isActive && (
                                    <Badge variant="info" size="sm" className="bg-zumbii-600 text-white">Your Tier</Badge>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-4 text-sm text-text-primary">{tier.minQty} — {tier.maxQty}</td>
                              <td className="px-5 py-4">
                                <span className={`text-sm font-bold ${
                                  isActive ? "text-zumbii-600 text-base" : "text-text-primary"
                                }`}>{tier.unitPrice}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  parseInt(tier.discount) >= 20 ? "bg-green-100 text-green-700" :
                                  parseInt(tier.discount) >= 10 ? "bg-amber-100 text-amber-700" :
                                  "bg-surface-tertiary text-text-secondary"
                                }`}>{tier.discount}</span>
                              </td>
                              <td className="px-5 py-4 text-xs text-text-secondary">{tier.badge}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </FadeInSection>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20 bg-surface-secondary">
        <Container>
          <FadeInSection>
            <SectionHeader
              title="Benefits of Bulk Ordering"
              subtitle="Why businesses choose Zumbii for their bulk procurement"
            />
          </FadeInSection>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit) => (
              <motion.div key={benefit.title} variants={fadeInUp}>
                <Card className="p-6 h-full" hover>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-text-primary mb-2">{benefit.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            <div className="lg:col-span-3">
              <FadeInSection>
              <Card className="p-6 sm:p-8" glass={true}>
                  <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-zumbii-600" />
                    Request a Bulk Quote
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Product Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="productName"
                          value={formData.productName}
                          onChange={handleFormChange}
                          placeholder="e.g. Industrial LED Panel 100W"
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Quantity <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleFormChange}
                          placeholder="Enter quantity"
                          className={inputClass}
                          required
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Unit <span className="text-red-500">*</span></label>
                        <select
                          name="unit"
                          value={formData.unit}
                          onChange={handleFormChange}
                          className="w-full h-10 px-4 text-sm bg-white border border-border rounded-xl text-text-primary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all appearance-none cursor-pointer"
                          required
                        >
                          <option value="Pcs">Pcs</option>
                          <option value="Kg">Kg</option>
                          <option value="Meters">Meters</option>
                          <option value="Liters">Liters</option>
                          <option value="Boxes">Boxes</option>
                          <option value="Sets">Sets</option>
                          <option value="Tons">Tons</option>
                          <option value="Cartons">Cartons</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Delivery Timeline <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleFormChange}
                          placeholder="e.g. 30 Days"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Product Specifications</label>
                      <textarea
                        name="specifications"
                        value={formData.specifications}
                        onChange={handleFormChange}
                        placeholder="Describe specifications, quality requirements, packaging needs..."
                        rows={3}
                        className="w-full px-4 py-3 text-sm bg-white border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all resize-none"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Delivery Location <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="deliveryLocation"
                          value={formData.deliveryLocation}
                          onChange={handleFormChange}
                          placeholder="City, State"
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Additional Message</label>
                        <input
                          type="text"
                          name="message"
                          value={formData.message}
                          onChange={handleFormChange}
                          placeholder="Any special requirements"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="border-t border-border pt-5">
                      <h3 className="text-sm font-semibold text-text-primary mb-4">Contact Information</h3>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>Your Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder="Full name"
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleFormChange}
                            placeholder="Company name"
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="your@email.com"
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            placeholder="+91 98765 43210"
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
                      {submitting ? "Submitting..." : "Request Bulk Quote"} <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </Card>
              </FadeInSection>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-28 space-y-6">
                <FadeInSection>
                  <Card className="p-6 gradient-bg text-white">
                    <Zap className="w-8 h-8 text-white/80 mb-3" />
                    <h3 className="text-lg font-bold mb-2">Why Buy in Bulk?</h3>
                    <ul className="space-y-3 text-sm text-white/80">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-green-300 shrink-0 mt-0.5" />
                        Save up to 40% on unit costs
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-green-300 shrink-0 mt-0.5" />
                        Free pan-India delivery
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-green-300 shrink-0 mt-0.5" />
                        Priority manufacturing slots
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-green-300 shrink-0 mt-0.5" />
                        Dedicated account manager
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-green-300 shrink-0 mt-0.5" />
                        Flexible payment terms
                      </li>
                    </ul>
                  </Card>
                </FadeInSection>

                <FadeInSection>
                  <Card className="p-6">
                    <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      Bulk Order Stats
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: "Avg. Order Value", value: "₹1.2 Lakhs" },
                        { label: "Avg. Savings", value: "22%" },
                        { label: "Avg. Delivery Time", value: "12 Days" },
                        { label: "Repeat Order Rate", value: "87%" },
                      ].map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">{stat.label}</span>
                          <span className="text-sm font-bold text-text-primary">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </FadeInSection>

                <FadeInSection>
                  <Card className="p-6 border-emerald-200 bg-emerald-50">
                    <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                      <Gift className="w-4 h-5" />
                      Special Offer
                    </h3>
                    <p className="text-sm text-emerald-700">
                      Get <strong>free samples</strong> and <strong>custom packaging</strong> on your first bulk order above ₹1 Lakh. Limited time offer!
                    </p>
                  </Card>
                </FadeInSection>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zumbii-600 via-zumbii-700 to-zumbii-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.1),transparent_50%)]" />
        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <FadeInSection>
              <Badge variant="new" className="mb-4 bg-white/10 text-white border-white/20">Get Started</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
                Ready to Save on Bulk Orders?
              </h2>
              <p className="mt-4 text-lg text-white/70 leading-relaxed">
                Get competitive bulk pricing from verified suppliers. Free delivery on orders above ₹50,000.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <Link href="/b2b/rfq">
                  <Button variant="white" size="lg">
                    Submit RFQ Instead <FileText className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/b2b">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                    Explore B2B Marketplace <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </Container>
      </section>
    </>
  );
}
