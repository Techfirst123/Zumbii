export const siteConfig = {
  name: 'Zumbii',
  tagline: 'Empowering Businesses, Connecting Communities, Growing Together.',
  description:
    'India\'s premier B2B & B2C marketplace connecting manufacturers, suppliers, distributors, retailers, and customers.',
  url: 'https://zumbii.com',
  email: 'info@zumbii.com',
  phone: '+91 7050193876',
  address: 'DPT 322/3 Dlf Prime Tower Okhla Phase-1 110020 new delhi, India',
  social: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
    youtube: '#',
  },
  download: {
    appStore: '#',
    googlePlay: '#',
  },
} as const;

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Categories', href: '/categories', hasMegaMenu: true },
  { label: "Today's Deals", href: '/deals' },
  { label: 'Business', href: '/business' },
  { label: 'Blogs', href: '/blogs' },
] as const;

export const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Smartphone',
    image: '/images/categories/electronics.jpg',
    description: 'Gadgets, devices & accessories',
    items: [
      'Mobiles & Tablets',
      'Laptops & Computers',
      'Audio & Headphones',
      'Cameras & Drones',
      'Smart Home',
      'Wearables',
      'Gaming',
      'Accessories',
    ],
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    icon: 'Shirt',
    image: '/images/categories/fashion.jpg',
    description: 'Clothing, footwear & more',
    items: [
      "Men's Clothing",
      "Women's Clothing",
      "Kid's Fashion",
      'Footwear',
      'Watches',
      'Jewellery',
      'Bags & Luggage',
      'Ethnic Wear',
    ],
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    icon: 'Home',
    image: '/images/categories/home.jpg',
    description: 'Everything for your home',
    items: [
      'Furniture',
      'Home Decor',
      'Kitchen Appliances',
      'Cookware',
      'Bedding & Linens',
      'Lighting',
      'Storage & Organization',
      'Gardening',
    ],
  },
  {
    name: 'Beauty & Health',
    slug: 'beauty-health',
    icon: 'Sparkles',
    image: '/images/categories/beauty.jpg',
    description: 'Self-care & wellness',
    items: [
      'Skincare',
      'Hair Care',
      'Makeup',
      'Fragrances',
      'Personal Care',
      'Health Supplements',
      'Fitness Equipment',
      'Ayurvedic',
    ],
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    icon: 'Trophy',
    image: '/images/categories/sports.jpg',
    description: 'Active lifestyle gear',
    items: [
      'Cricket',
      'Football',
      'Gym & Fitness',
      'Cycling',
      'Camping & Hiking',
      'Swimming',
      'Indoor Games',
      'Yoga & Pilates',
    ],
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    icon: 'Car',
    image: '/images/categories/automotive.jpg',
    description: 'Car & bike essentials',
    items: [
      'Car Accessories',
      'Bike Accessories',
      'Helmets & Safety',
      'Tyres & Wheels',
      'Oils & Fluids',
      'Car Care',
      'Tools & Equipment',
      'GPS & Electronics',
    ],
  },
  {
    name: 'Books & Stationery',
    slug: 'books-stationery',
    icon: 'BookOpen',
    image: '/images/categories/books.jpg',
    description: 'Read, learn & create',
    items: [
      'Fiction & Non-Fiction',
      'Academic Books',
      'Children Books',
      'Comics',
      'Office Stationery',
      'Art Supplies',
      'School Supplies',
      'Gift Cards',
    ],
  },
  {
    name: 'Industrial & Tools',
    slug: 'industrial-tools',
    icon: 'Wrench',
    image: '/images/categories/industrial.jpg',
    description: 'B2B industrial supplies',
    items: [
      'Power Tools',
      'Hand Tools',
      'Safety Equipment',
      'Electrical Supplies',
      'Plumbing',
      'Packaging',
      'Lab Equipment',
      'Raw Materials',
    ],
  },
] as const;

export const franchiseModels = [
  {
    title: 'Master Franchise',
    description: 'Own the Zumbii brand for an entire region. Recruit sub-franchisees and earn royalties.',
    investment: '₹15L - ₹50L',
    icon: 'Building2',
  },
  {
    title: 'Area Franchise',
    description: 'Operate Zumbii delivery and collection hubs across a city zone.',
    investment: '₹5L - ₹15L',
    icon: 'MapPin',
  },
  {
    title: 'Unit Franchise',
    description: 'Run a single Zumbii micro-warehouse or pickup point in your locality.',
    investment: '₹1L - ₹5L',
    icon: 'Store',
  },
] as const;

export const businessVerticals = [
  {
    title: 'Retail',
    description: 'List and sell products directly to customers across India.',
    icon: 'ShoppingBag',
  },
  {
    title: 'Wholesale',
    description: 'Bulk supply to businesses, retailers, and institutions.',
    icon: 'Package',
  },
  {
    title: 'Manufacturing',
    description: 'Connect with suppliers and distributors for raw materials & finished goods.',
    icon: 'Factory',
  },
  {
    title: 'Supply Chain',
    description: 'End-to-end logistics, warehousing, and distribution services.',
    icon: 'Truck',
  },
  {
    title: 'Distribution',
    description: 'Partner as an authorized distributor for top brands.',
    icon: 'Network',
  },
] as const;

export const footerLinks = {
  company: {
    title: 'Company',
    links: [
      { label: 'About Zumbii', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press & Media', href: '/press' },
      { label: 'Blog', href: '/blogs' },
      { label: 'Investor Relations', href: '/investors' },
    ],
  },
  quickLinks: {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Sell on Zumbii', href: '/sell' },
      { label: 'Franchise', href: '/franchise' },
      { label: 'Business Verticals', href: '/business' },
      { label: 'Today\'s Deals', href: '/deals' },
    ],
  },
  customerService: {
    title: 'Customer Service',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Report a Problem', href: '/report' },
    ],
  },
  connect: {
    title: 'Connect',
    links: [
      { label: 'Facebook', href: '#', icon: 'Facebook' },
      { label: 'Twitter / X', href: '#', icon: 'Twitter' },
      { label: 'Instagram', href: '#', icon: 'Instagram' },
      { label: 'LinkedIn', href: '#', icon: 'Linkedin' },
      { label: 'YouTube', href: '#', icon: 'Youtube' },
    ],
  },
} as const;

export const supportLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Grievance Policy', href: '/grievance' },
  { label: 'Sitemap', href: '/sitemap' },
] as const;
