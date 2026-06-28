"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  Send,
  CheckCircle,
  ArrowRight,
  Search,
  Clock,
  MapPin,
  Building2,
  Package,
  IndianRupee,
  Calendar,
  ChevronRight,
  Sparkles,
  Users,
  MessageCircle,
  Handshake,
  ShoppingBag,
  BadgePercent,
  Star,
  Eye,
  Filter,
  X,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/input";
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

const categories = [
  "Electronics & Electricals",
  "Industrial Machinery",
  "Textiles & Fabrics",
  "Food & Beverages",
  "Chemicals & Pharmaceuticals",
  "Automotive Parts",
  "Construction Materials",
  "Packaging Materials",
  "IT & Software",
  "Medical Equipment",
  "Agriculture Products",
  "Office Supplies",
];

const units = ["Pcs", "Kg", "Meters", "Liters", "Boxes", "Sets", "Tons", "Cartons"];

const openRFQs = [
  { id: "RFQ-2024-001", product: "Industrial LED Panels 100W", category: "Electronics & Electricals", quantity: "5,000", unit: "Pcs", budget: "₹35-45 Lakhs", location: "Mumbai, India", timeline: "30 Days", status: "Open", bids: 12, expiry: "15 Jul 2026" },
  { id: "RFQ-2024-002", product: "Organic Cotton Fabric (200 GSM)", category: "Textiles & Fabrics", quantity: "10,000", unit: "Meters", budget: "₹8-12 Lakhs", location: "Surat, India", timeline: "45 Days", status: "Open", bids: 8, expiry: "20 Jul 2026" },
  { id: "RFQ-2024-003", product: "Pharmaceutical Grade Glycerin", category: "Chemicals & Pharmaceuticals", quantity: "2,500", unit: "Kg", budget: "₹15-20 Lakhs", location: "Hyderabad, India", timeline: "60 Days", status: "Open", bids: 5, expiry: "25 Jul 2026" },
  { id: "RFQ-2024-004", product: "Automotive Brake Pad Sets", category: "Automotive Parts", quantity: "3,000", unit: "Sets", budget: "₹6-9 Lakhs", location: "Chennai, India", timeline: "30 Days", status: "Closed", bids: 15, expiry: "10 Jun 2026" },
  { id: "RFQ-2024-005", product: "Corrugated Boxes (Assorted Sizes)", category: "Packaging Materials", quantity: "50,000", unit: "Pcs", budget: "₹4-6 Lakhs", location: "Delhi, India", timeline: "20 Days", status: "Open", bids: 9, expiry: "30 Jul 2026" },
  { id: "RFQ-2024-006", product: "Cement OPC 53 Grade", category: "Construction Materials", quantity: "500", unit: "Tons", budget: "₹25-30 Lakhs", location: "Bangalore, India", timeline: "45 Days", status: "Open", bids: 7, expiry: "18 Jul 2026" },
];

export default function RFQPage() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    quantity: "",
    unit: "Pcs",
    budgetMin: "",
    budgetMax: "",
    description: "",
    deliveryLocation: "",
    timeline: "",
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "Open" | "Closed">("all");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("RFQ submitted successfully! Suppliers will review your request.");
      setFormData({
        productName: "", category: "", quantity: "", unit: "Pcs",
        budgetMin: "", budgetMax: "", description: "", deliveryLocation: "",
        timeline: "", name: "", company: "", email: "", phone: "",
      });
    }, 1500);
  };

  const filteredRFQs = openRFQs.filter((rfq) =>
    statusFilter === "all" ? true : rfq.status === statusFilter
  );

  const howItWorks = [
    { step: 1, title: "Create RFQ", description: "Fill in product details, quantity, budget, and delivery requirements.", icon: FileText },
    { step: 2, title: "Submit to Suppliers", description: "Your RFQ is sent to relevant verified suppliers in the category.", icon: Send },
    { step: 3, title: "Receive Bids", description: "Suppliers review and submit competitive quotations with pricing.", icon: MessageCircle },
    { step: 4, title: "Compare & Negotiate", description: "Compare bids side-by-side and negotiate terms directly.", icon: Handshake },
    { step: 5, title: "Place Order", description: "Select the best supplier and place your purchase order.", icon: ShoppingBag },
  ];

  const inputClass = "w-full h-10 px-4 text-sm bg-white border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all";
  const labelClass = "block text-sm font-medium text-text-primary mb-1.5";
  const selectClass = "w-full h-10 px-4 text-sm bg-white border border-border rounded-xl text-text-primary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all appearance-none cursor-pointer";

  return (
    <>
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zumbii-900 via-zumbii-800 to-zumbii-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-zumbii-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-zumbii-300/20 rounded-full blur-3xl" />

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                <FileText className="w-4 h-4 text-zumbii-200" />
                <span className="text-sm font-medium text-white/90">Request for Quotation</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                Get Competitive{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zumbii-200 to-white">
                  Bids
                </span>{" "}
                from Multiple Suppliers
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-4 text-lg text-white/70 max-w-xl leading-relaxed">
                Submit your requirements once and receive quotations from multiple verified suppliers. Compare, negotiate, and choose the best deal.
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-4 text-white/50 text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Free to submit</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Multiple quotes</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> No obligation</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Secure & private</span>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            <div className="lg:col-span-3">
              <FadeInSection>
                <Card className="p-6 sm:p-8" glass>
                  <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-zumbii-600" />
                    Submit Your RFQ
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Product Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="productName"
                          value={formData.productName}
                          onChange={handleChange}
                          placeholder="e.g. Industrial LED Panel 100W"
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Category <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={selectClass}
                            required
                          >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <ChevronRight className="w-4 h-4 text-text-tertiary absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-4 gap-5">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Quantity <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="Enter quantity"
                          className={inputClass}
                          required
                          min="1"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Unit <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className={selectClass}
                            required
                          >
                            {units.map((unit) => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                          <ChevronRight className="w-4 h-4 text-text-tertiary absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Budget Range - Min (₹)</label>
                        <input
                          type="number"
                          name="budgetMin"
                          value={formData.budgetMin}
                          onChange={handleChange}
                          placeholder="Min budget"
                          className={inputClass}
                          min="0"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Budget Range - Max (₹)</label>
                        <input
                          type="number"
                          name="budgetMax"
                          value={formData.budgetMax}
                          onChange={handleChange}
                          placeholder="Max budget"
                          className={inputClass}
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Product Description <span className="text-red-500">*</span></label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your requirements in detail — specifications, quality standards, packaging needs, etc."
                        rows={4}
                        className="w-full px-4 py-3 text-sm bg-white border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all resize-none"
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Delivery Location <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="deliveryLocation"
                          value={formData.deliveryLocation}
                          onChange={handleChange}
                          placeholder="City, State"
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Expected Timeline <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          placeholder="e.g. 30 Days"
                          className={inputClass}
                          required
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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
                      {submitting ? "Submitting RFQ..." : "Submit RFQ"} <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </Card>
              </FadeInSection>
            </div>

            <div className="lg:col-span-2">
              <FadeInSection>
                <div className="sticky top-28 space-y-6">
                  <Card className="p-6">
                    <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                      <BadgePercent className="w-4 h-4 text-zumbii-600" />
                      Why Use RFQ?
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Get quotes from 5-15 suppliers in one go",
                        "Save 15-30% compared to direct buying",
                        "Compare pricing, terms & delivery side-by-side",
                        "Negotiate directly with shortlisted suppliers",
                        "100% free — no subscription needed",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-6 gradient-bg text-white">
                    <Building2 className="w-8 h-8 text-white/80 mb-3" />
                    <h3 className="text-lg font-bold mb-2">Need Help Drafting Your RFQ?</h3>
                    <p className="text-sm text-white/70 mb-4">Our team can help you create a detailed RFQ that gets better responses from suppliers.</p>
                    <Button variant="white" size="sm" className="w-full">
                      Get Expert Assistance
                    </Button>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-sm font-bold text-text-primary mb-4">Quick Tips</h3>
                    <ul className="space-y-2.5 text-sm text-text-secondary">
                      <li className="flex items-start gap-2">• Be specific about product specifications</li>
                      <li className="flex items-start gap-2">• Set realistic budget ranges</li>
                      <li className="flex items-start gap-2">• Mention preferred payment terms</li>
                      <li className="flex items-start gap-2">• Include quality certification requirements</li>
                    </ul>
                  </Card>
                </div>
              </FadeInSection>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20 bg-surface-secondary">
        <Container>
          <FadeInSection>
            <SectionHeader
              title="Open RFQs"
              subtitle="Browse current sourcing requests from businesses across India"
            />
          </FadeInSection>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-border shadow-sm">
              {(["all", "Open", "Closed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? "bg-zumbii-600 text-white shadow-md shadow-zumbii-600/20"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {status === "all" ? "All RFQs" : status}
                </button>
              ))}
            </div>
            <span className="text-sm text-text-tertiary ml-auto">{filteredRFQs.length} RFQs found</span>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-surface-tertiary border-b border-border">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase tracking-wider">RFQ ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase tracking-wider">Qty</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase tracking-wider">Budget</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase tracking-wider">Location</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase tracking-wider">Bids</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-primary uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-text-primary uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRFQs.map((rfq) => (
                  <tr key={rfq.id} className="bg-white hover:bg-zumbii-50/30 transition-colors">
                    <td className="px-5 py-4 text-xs font-medium text-zumbii-600">{rfq.id}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-text-primary">{rfq.product}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-text-secondary">{rfq.category}</td>
                    <td className="px-5 py-4 text-sm text-text-primary">{rfq.quantity} {rfq.unit}</td>
                    <td className="px-5 py-4 text-sm font-medium text-text-primary">{rfq.budget}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-xs text-text-secondary">
                        <MapPin className="w-3 h-3" />
                        {rfq.location}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm font-medium text-text-primary">
                        <Users className="w-3.5 h-3.5 text-text-tertiary" />
                        {rfq.bids}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={rfq.status === "Open" ? "success" : "default"} size="sm">
                        {rfq.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 text-xs font-medium text-zumbii-600 hover:text-zumbii-700 transition-colors">
                        View Details <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <FadeInSection className="text-center mt-8">
            <Link href="/b2b/rfq">
              <Button variant="outline" size="lg">
                View All Open RFQs <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </FadeInSection>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container>
          <FadeInSection>
            <SectionHeader
              title="How RFQ Works"
              subtitle="Simple process to get the best quotes from suppliers"
            />
          </FadeInSection>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {howItWorks.map((item) => (
              <motion.div key={item.step} variants={fadeInUp}>
                <Card className="p-6 text-center h-full" hover>
                  <div className="relative inline-flex mb-4">
                    <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zumbii-100 border-2 border-white flex items-center justify-center">
                      <span className="text-[10px] font-bold text-zumbii-700">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
                Ready to Get the Best Quotes?
              </h2>
              <p className="mt-4 text-lg text-white/70 leading-relaxed">
                Submit your first RFQ and receive competitive bids from verified suppliers within 24 hours.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <Link href="#rfq-form">
                  <Button variant="white" size="lg">
                    Submit Your RFQ <Send className="w-5 h-5" />
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
