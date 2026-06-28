"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Store,
  Globe,
  Percent,
  LayoutDashboard,
  FileText,
  ShieldCheck,
  HeadphonesIcon,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Upload,
  ShoppingBag,
  TrendingUp,
  Star,
  Package,
  ClipboardList,
  Banknote,
  MapPin,
  Building2,
  Loader2,
  FileUp,
  IndianRupee,
  Users,
  BarChart3,
  HeartHandshake,
  Settings,
  Truck,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import { Badge } from "@/components/ui/Badge";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
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

const benefits = [
  {
    icon: Globe,
    title: "Pan India Reach",
    description: "Sell to customers across 29,000+ pin codes with our extensive logistics network covering every corner of India.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: Percent,
    title: "Zero Commission*",
    description: "Enjoy zero commission on your first 100 orders. Pay only nominal transaction fees after that. *T&C apply.",
    color: "from-emerald-500 to-green-400",
  },
  {
    icon: LayoutDashboard,
    title: "Business Dashboard",
    description: "Real-time analytics, order management, inventory tracking, and sales reports at your fingertips.",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: FileText,
    title: "Easy Catalog",
    description: "Bulk upload products with our simple catalog manager. AI-powered suggestions for better visibility.",
    color: "from-amber-500 to-orange-400",
  },
  {
    icon: ShieldCheck,
    title: "Payment Protection",
    description: "Secure payment gateway with timely settlements. Buyer verification and dispute resolution included.",
    color: "from-rose-500 to-pink-400",
  },
  {
    icon: HeadphonesIcon,
    title: "Seller Support",
    description: "Dedicated relationship manager. 24/7 support via chat, email, and phone for all your queries.",
    color: "from-indigo-500 to-blue-400",
  },
];

const steps = [
  { icon: ClipboardList, step: "01", title: "Register", description: "Fill in your business details and create your seller account in minutes." },
  { icon: ShieldCheck, step: "02", title: "Get Verified", description: "Submit your documents for KYC. Our team verifies within 48 hours." },
  { icon: Upload, step: "03", title: "Upload Catalog", description: "Add your products with images, prices, and descriptions using our bulk upload tool." },
  { icon: ShoppingBag, step: "04", title: "Start Selling", description: "Go live and start receiving orders from millions of customers across India." },
];

const businessTypes = [
  "Private Limited",
  "Public Limited",
  "Partnership",
  "Sole Proprietorship",
  "LLP",
  "One Person Company",
  "Government Organization",
  "NGO / Trust",
  "Other",
];

interface FormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  gstNumber: string;
  panNumber: string;
  accountNumber: string;
  ifsc: string;
  businessAddress: string;
  businessType: string;
  agreeTerms: boolean;
}

const initialFormData: FormData = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  password: "",
  gstNumber: "",
  panNumber: "",
  accountNumber: "",
  ifsc: "",
  businessAddress: "",
  businessType: "",
  agreeTerms: false,
};

const inputClass = "w-full bg-surface border border-border text-text-primary placeholder:text-text-tertiary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all duration-200";
const labelClass = "block text-sm font-medium text-text-primary mb-1.5";
const selectClass = "w-full bg-surface border border-border text-text-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all duration-200 appearance-none";

function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(12,142,234,0.3),transparent_50%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-zumbii-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-zumbii-300/20 rounded-full blur-3xl" />

      <Container className="relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center lg:text-left">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 mb-6">
              <Store className="w-4 h-4 text-zumbii-200" />
              <span className="text-sm font-medium text-white/90">Seller Program</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Start Selling on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zumbii-200 to-white">
                Zumbii
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Reach Millions of Customers Across India. Zero commission to start. Join India&apos;s fastest-growing marketplace.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button variant="white" size="lg" className="shadow-2xl">
                <ShoppingBag className="w-5 h-5" />
                Register Now
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                Learn More <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start text-white/50 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 0% Commission*</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 10K+ Sellers</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 2M+ Buyers</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 48hr Verification</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-zumbii-400/20 to-transparent rounded-3xl" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Your Store Name</div>
                    <div className="text-white/50 text-sm">Seller since 2025</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Orders", value: "247", icon: ShoppingBag },
                    { label: "Revenue", value: "₹1.2L", icon: IndianRupee },
                    { label: "Products", value: "89", icon: Package },
                    { label: "Rating", value: "4.8★", icon: Star },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <item.icon className="w-4 h-4 text-white/50 mb-1" />
                      <div className="text-lg font-bold text-white">{item.value}</div>
                      <div className="text-xs text-white/40">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Percent className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface-secondary">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Why Sell on Zumbii?"
            subtitle="Everything you need to grow your business online"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit) => (
            <motion.div key={benefit.title} variants={fadeInUp}>
              <Card className="p-6 sm:p-8 h-full text-center">
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg mb-5`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{benefit.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="How It Works"
            subtitle="Get started in four simple steps"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div key={step.step} variants={fadeInUp} className="relative">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg flex items-center justify-center shadow-lg mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zumbii-100 text-zumbii-700 text-sm font-bold mb-3">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8">
                  <ArrowRight className="w-6 h-6 text-zumbii-300" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [gstDoc, setGstDoc] = useState<File | null>(null);
  const [panDoc, setPanDoc] = useState<File | null>(null);
  const [chequeDoc, setChequeDoc] = useState<File | null>(null);

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (setter: (file: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }
    if (!formData.businessType) {
      toast.error("Please select a business type");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);

    toast.success("Registration submitted successfully! We'll get back to you within 48 hours.");
    setFormData(initialFormData);
    setGstDoc(null);
    setPanDoc(null);
    setChequeDoc(null);
  }, [formData]);

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-surface-secondary" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-zumbii-100 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-zumbii-50 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <FadeInSection>
          <SectionHeader
            title="Register as a Seller"
            subtitle="Fill in your business details and start your selling journey"
          />
        </FadeInSection>

        <FadeInSection className="mt-12 max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 lg:p-10" hover={false}>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-zumbii-600" /> Business Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Business Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      className={inputClass}
                      placeholder="Enter your business name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Owner / Director Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={(e) => updateField("ownerName", e.target.value)}
                      className={inputClass}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={inputClass}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={inputClass}
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Password *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className={inputClass}
                      placeholder="Create a password (min 6 chars)"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Business Type *</label>
                    <select
                      required
                      value={formData.businessType}
                      onChange={(e) => updateField("businessType", e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-zumbii-600" /> Tax & Compliance
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>GST Number</label>
                    <input
                      type="text"
                      value={formData.gstNumber}
                      onChange={(e) => updateField("gstNumber", e.target.value)}
                      className={inputClass}
                      placeholder="Enter GST number (optional)"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>PAN Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.panNumber}
                      onChange={(e) => updateField("panNumber", e.target.value)}
                      className={inputClass}
                      placeholder="Enter PAN number"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-zumbii-600" /> Bank Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Account Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.accountNumber}
                      onChange={(e) => updateField("accountNumber", e.target.value)}
                      className={inputClass}
                      placeholder="Enter bank account number"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>IFSC Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.ifsc}
                      onChange={(e) => updateField("ifsc", e.target.value)}
                      className={inputClass}
                      placeholder="Enter IFSC code"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-zumbii-600" /> Address
                </h3>
                <div>
                  <label className={labelClass}>Business Address *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.businessAddress}
                    onChange={(e) => updateField("businessAddress", e.target.value)}
                    className={inputClass + " resize-none"}
                    placeholder="Enter full business address with city, state, pincode"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-zumbii-600" /> Upload Documents
                </h3>
                <p className="text-sm text-text-tertiary mb-4">Upload clear scanned copies or photos of the following documents.</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border-2 border-dashed border-border hover:border-zumbii-300 transition-colors">
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <FileUp className="w-8 h-8 text-zumbii-400" />
                      <span className="text-sm font-medium text-text-primary">GST Certificate</span>
                      <span className="text-xs text-text-tertiary">{gstDoc ? gstDoc.name : "Click to upload"}</span>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange(setGstDoc)} className="hidden" />
                    </label>
                  </div>
                  <div className="p-4 rounded-xl border-2 border-dashed border-border hover:border-zumbii-300 transition-colors">
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <FileUp className="w-8 h-8 text-zumbii-400" />
                      <span className="text-sm font-medium text-text-primary">PAN Card</span>
                      <span className="text-xs text-text-tertiary">{panDoc ? panDoc.name : "Click to upload"}</span>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange(setPanDoc)} className="hidden" />
                    </label>
                  </div>
                  <div className="p-4 rounded-xl border-2 border-dashed border-border hover:border-zumbii-300 transition-colors">
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <FileUp className="w-8 h-8 text-zumbii-400" />
                      <span className="text-sm font-medium text-text-primary">Cancelled Cheque</span>
                      <span className="text-xs text-text-tertiary">{chequeDoc ? chequeDoc.name : "Click to upload"}</span>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange(setChequeDoc)} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => updateField("agreeTerms", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-border text-zumbii-600 focus:ring-zumbii-500"
                  />
                  <span className="text-sm text-text-secondary">
                    I agree to the{" "}
                    <Link href="/terms" className="text-zumbii-600 hover:underline">Terms & Conditions</Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-zumbii-600 hover:underline">Privacy Policy</Link>.{" "}
                    I confirm that the information provided is accurate and I am authorized to register this business.
                  </span>
                </label>
              </div>

              <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
                {loading ? "Submitting..." : "Submit Registration"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </Button>
            </form>
          </Card>
        </FadeInSection>
      </Container>
    </section>
  );
}

function DashboardPreviewSection() {
  const metrics = [
    { icon: ShoppingBag, label: "Total Orders", value: "1,247", change: "+12.5%", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: IndianRupee, label: "Total Revenue", value: "₹3,42,890", change: "+18.2%", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Package, label: "Active Products", value: "89", change: "+5", color: "text-violet-600", bg: "bg-violet-50" },
    { icon: Star, label: "Avg. Rating", value: "4.8 ★", change: "+0.2", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Seller Dashboard Preview"
            subtitle="Get real-time insights into your business performance"
          />
        </FadeInSection>

        <FadeInSection className="mt-12">
          <Card className="p-6 sm:p-8 lg:p-10" hover={false}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Seller Dashboard</h3>
                  <p className="text-xs text-text-tertiary">Your Store Name</p>
                </div>
              </div>
              <Badge variant="success" className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <div key={metric.label} className={`${metric.bg} rounded-2xl p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{metric.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-text-primary">{metric.value}</div>
                  <div className="text-sm text-text-tertiary mt-1">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-surface-secondary">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-text-primary">Recent Orders</h4>
                  <Link href="#" className="text-xs text-zumbii-600 hover:underline">View All</Link>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "#ORD-1234", product: "Wireless Headphones", amount: "₹2,499", status: "Shipped" },
                    { id: "#ORD-1235", product: "Smart Watch", amount: "₹5,999", status: "Processing" },
                    { id: "#ORD-1236", product: "USB Hub 4-Port", amount: "₹799", status: "Delivered" },
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 rounded-xl bg-white">
                      <div>
                        <p className="text-xs text-text-tertiary">{order.id}</p>
                        <p className="text-sm font-medium text-text-primary">{order.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-text-primary">{order.amount}</p>
                        <span className={`text-xs font-medium ${order.status === "Delivered" ? "text-green-600" : order.status === "Shipped" ? "text-blue-600" : "text-amber-600"}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-secondary">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-text-primary">Performance</h4>
                  <span className="text-xs text-text-tertiary">This Month</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Order Fulfillment", value: 94, color: "bg-emerald-500" },
                    { label: "On-time Delivery", value: 88, color: "bg-blue-500" },
                    { label: "Customer Satisfaction", value: 96, color: "bg-violet-500" },
                  ].map((perf) => (
                    <div key={perf.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-text-secondary">{perf.label}</span>
                        <span className="font-medium text-text-primary">{perf.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-tertiary rounded-full overflow-hidden">
                        <div className={`h-full ${perf.color} rounded-full transition-all duration-700`} style={{ width: `${perf.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </FadeInSection>
      </Container>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-zumbii-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-zumbii-300/20 rounded-full blur-3xl" />

      <Container className="relative z-10 text-center">
        <FadeInSection>
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/15 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-6">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Ready to Grow Your Business?
            </h2>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              Join 10,000+ sellers already earning on Zumbii. Start your journey today — zero commission on first 100 orders.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="white" size="lg" className="shadow-2xl">
                Register Now <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                <HeadphonesIcon className="w-5 h-5" />
                Talk to Sales
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/50">
              *Terms & Conditions apply. Zero commission applicable for first 100 orders or first 30 days, whichever is earlier.
            </p>
          </div>
        </FadeInSection>
      </Container>
    </section>
  );
}

export default function SellPage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <RegistrationForm />
      <DashboardPreviewSection />
      <CTASection />
    </>
  );
}
