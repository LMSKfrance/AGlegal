import icons from "./icons";

const nav_links = [
  {
    id: 1,
    title: "Home",
    url: "/",
  },
  {
    id: 2,
    title: "About us",
    url: "/about",
  },
  {
    id: 3,
    title: "Services",
    url: "/services",
  },
  {
    id: 4,
    title: "Book appointment",
    url: "/appointment",
  },
  {
    id: 5,
    title: "Team",
    url: "/team",
  },
  {
    id: 6,
    title: "Blog",
    url: "/news",
  },
  {
    id: 7,
    title: "Contact",
    url: "/contact",
  },
];

const socials = [
  {
    id: 1,
    title: "Instagram",
    url: "https://www.instagram.com/",
    icon: icons.Instagram,
  },
  {
    id: 2,
    title: "Facebook",
    url: "https://www.facebook.com/",
    icon: icons.Facebook,
  },
  {
    id: 3,
    title: "Linkedin",
    url: "https://www.linkedin.com/",
    icon: icons.LinkedIn,
  },
  {
    id: 4,
    title: "Youtube",
    url: "https://www.youtube.com/",
    icon: icons.Youtube,
  },
];

const top_offices = [
  {
    id: 1,
    title: "Los Angeles",
    image: "/images/offices/hollywood.jpg",
  },
  {
    id: 2,
    title: "New York",
    image: "/images/offices/new-york.jpg",
  },
  {
    id: 3,
    title: "San Francisco",
    image: "/images/offices/san-francisco.jpg",
  },
  {
    id: 4,
    title: "Houston",
    image: "/images/offices/houston.jpg",
  },
  {
    id: 5,
    title: "Miami",
    image: "/images/offices/miami.jpg",
  },
  {
    id: 6,
    title: "Boston",
    image: "/images/offices/boston.jpg",
  },
];

const bottom_offices = [
  {
    id: 1,
    title: "Washington D.C.",
    image: "/images/offices/washington.jpg",
  },
  {
    id: 2,
    title: "Atlanta",
    image: "/images/offices/atlanta.jpg",
  },
  {
    id: 3,
    title: "Dallas",
    image: "/images/offices/dallas.jpg",
  },
  {
    id: 4,
    title: "Philadelphia",
    image: "/images/offices/philadelphia.jpg",
  },
  {
    id: 5,
    title: "Denver",
    image: "/images/offices/denver.jpg",
  },
  {
    id: 6,
    title: "Minneapolis",
    image: "/images/offices/minneapolis.jpg",
  },
];

const services = [
  {
    id: 1,
    image: "/images/services/corporate.jpg",
    title: "Corporate & business law",
    description:
      "Legal support for businesses, including company formation, contracts, mergers, and intellectual property.",
    text1:
      "Navigating the complexities of business law is crucial to the success and longevity of your company. Whether you’re starting a new business or looking to expand or protect an established one, our experienced legal team is here to provide expert support.",
    text2:
      "We offer comprehensive services to businesses of all sizes, from startups to established enterprises, ensuring that every aspect of your business operations remains legally sound and compliant.",
    quote:
      "Choosing the right structure for your business is a critical decision that impacts everything from taxation to liability protection",
    thumbnail_image: "/images/ag-legal.jpg",
    slug: "corporate-business-law",
  },
  {
    id: 2,
    image: "/images/services/family-law.jpg",
    title: "Contract Law",
    description:
      "Compassionate guidance for divorce, child custody, alimony, and adoption cases.",
    text1:
      "Family law matters are often emotionally charged and complex, requiring a delicate approach and expert legal guidance. Our team is dedicated to helping families navigate these challenges with compassion and care, ensuring that your rights and interests are protected.",
    text2:
      "We provide a range of family law services, from divorce and child custody to adoption and alimony, helping you find the best path forward for your family.",
    quote:
      "We understand the sensitive nature of family law cases and provide the support and guidance you need.",
    thumbnail_image: "/images/ag-legal.jpg",
    slug: "contract-law",
  },
  {
    id: 3,
    image: "/images/services/criminal-defense.jpg",
    title: "Criminal Defense",
    description:
      "Strong representation for misdemeanors, felonies, and protecting your legal rights.",
    text1:
      "When facing criminal charges, having a skilled defense attorney on your side can make all the difference. Our team is dedicated to protecting your rights and providing a strong defense against a range of criminal charges.",
    text2:
      "We handle cases involving misdemeanors, felonies, and more, ensuring that you receive the best possible outcome.",
    quote:
      "We fight for your rights and work tirelessly to secure the best possible outcome for your case.",
    thumbnail_image: "/images/ag-legal.jpg",
    slug: "criminal-defense",
  },
  {
    id: 4,
    image: "/images/services/real-estate-law.jpg",
    title: "Real estate law",
    description:
      "We handle real estate transactions, leases, zoning issues, and property dispute resolutions efficiently.",
    text1:
      "Real estate transactions and disputes can be complex and challenging to navigate. Our team is here to provide expert guidance and support, ensuring that your real estate matters are handled with care and efficiency.",
    text2:
      "We offer a range of real estate law services, from property transactions to zoning issues, helping you achieve your real estate goals.",
    quote:
      "Our team has the experience and expertise to handle all your real estate law needs.",
    thumbnail_image: "/images/ag-legal.jpg",
    slug: "real-estate-law",
  },
  {
    id: 5,
    image: "/images/services/estate-plannings.jpg",
    title: "Estate planning & wills",
    description:
      "Help securing compensation for accidents, malpractice, and workplace injuries.",
    text1:
      "Estate planning is a critical step in securing your legacy and ensuring that your loved ones are provided for. Our team offers comprehensive estate planning services, including wills, trusts, and probate, to help you protect your assets and provide for your family's future.",
    text2:
      "We work closely with you to create a personalized estate plan that meets your unique needs and goals, ensuring that your wishes are carried out and your loved ones are taken care of.",
    quote:
      "We provide expert estate planning services to help you secure your legacy.",
    thumbnail_image: "/images/ag-legal.jpg",
    slug: "estate-planning-wills",
  },
  {
    id: 6,
    image: "/images/services/immigration-law.jpg",
    title: "Immigration law",
    description:
      "Wills, trusts, and probate services to secure your legacy and loved ones' future.",
    text1:
      "Immigration law can be challenging to navigate, but our experienced team is here to help you through every step of the process. Whether you need assistance with visas, residency, citizenship, or asylum applications, we are dedicated to achieving the best possible outcome for you and your family.",
    text2:
      "Our personalized approach ensures that we understand your unique situation and provide tailored legal solutions. We are committed to advocating for your rights and helping you realize your immigration goals with confidence.",
    quote:
      "Navigating immigration law can be overwhelming, but you don't have to do it alone. We're here to help.",
    thumbnail_image: "/images/ag-legal.jpg",
    slug: "immigration-law",
  },
];

const benefits = [
  {
    id: 1,
    icon: icons.Shield,
    title: "Expertise you can trust",
    description:
      "Our seasoned attorneys bring years of experience across multiple legal areas to provide reliable, results-driven solutions.",
  },
  {
    id: 2,
    icon: icons.Star,
    title: "Personalized service",
    description:
      "Every case is unique—our team tailors strategies to meet your needs, ensuring dedicated and individualized support.",
  },
  {
    id: 3,
    icon: icons.Speaker,
    title: "Clear communication",
    description:
      "We keep you informed with transparent updates at every stage, so you always know where your case stands.",
  },
  {
    id: 4,
    icon: icons.Cup,
    title: "Proven track record",
    description:
      "With a history of successful settlements and court victories, we fight for outcomes that exceed your expectations.",
  },
];

const tabs = [
  {
    id: 1,
    title: "Consultation",
    content: {
      title: "Initial consultation",
      description:
        "We start by understanding your case through a detailed consultation, answering your questions, and outlining the best approach.",
      image: "/images/process/consultation.jpg",
      number: "01",
    },
  },
  {
    id: 2,
    title: "Evaluation",
    content: {
      title: "Case evaluation",
      description:
        "Our team evaluates the case in detail, identifying key issues, strengths, and areas requiring attention.",
      image: "/images/process/evaluation.jpg",
      number: "02",
    },
  },
  {
    id: 3,
    title: "Action",
    content: {
      title: "Taking action",
      description:
        "We proceed with all necessary steps, from filing paperwork to representing you in court, ensuring no stone is left unturned.",
      image: "/images/process/action.jpg",
      number: "03",
    },
  },
  {
    id: 4,
    title: "Results",
    content: {
      title: "Achieving results",
      description:
        "Our goal is to deliver the best possible outcome for you, ensuring satisfaction and resolution.",
      image: "/images/process/results.jpg",
      number: "04",
    },
  },
];

const top_testimonials = [
  {
    id: 1,
    quote:
      "I’ve worked with several law firms in the past, but none compare to the level of care and dedication I received here. I felt supported every step of the way.",
    author_image: "/images/testimonials/rose-williams.jpg",
    author_name: "Rose Williams",
    author_position: "Williams Legal Advisors",
  },
  {
    id: 2,
    quote:
      "I couldn't have asked for better representation. Their expertise and strategic approach resulted in a favorable outcome for my case. Highly recommend!",
    author_image: "/images/testimonials/david-smith.jpg",
    author_name: "David Smith",
    author_position: "Smith Enterprises",
  },
  {
    id: 3,
    quote:
      "From start to finish, the service was exceptional. They made a stressful situation much easier to handle, and their dedication really showed in the results.",
    author_image: "/images/testimonials/michael-roberts.jpg",
    author_name: "Michael Roberts",
    author_position: "Roberts Group",
  },
];

const bottom_testimonials = [
  {
    id: 1,
    quote:
      "This team went above and beyond. Their professionalism and attention to detail were unmatched. I’m extremely grateful for their support.",
    author_image: "/images/testimonials/sophia-turner.jpg",
    author_name: "Sophia Turner",
    author_position: "Turner Consulting",
  },
  {
    id: 2,
    quote:
      "Working with this firm was an absolute pleasure. They handled my case with the utmost care and ensured a positive outcome. I’m highly impressed.",
    author_image: "/images/testimonials/james-mitchell.jpg",
    author_name: "James Mitchell",
    author_position: "Mitchell & Co.",
  },
  {
    id: 3,
    quote:
      "Exceptional service from start to finish. The team's expertise and personalized approach made all the difference in my case. Highly recommend them.",
    author_image: "/images/testimonials/emily-davis.jpg",
    author_name: "Emily Davis",
    author_position: "Davis Law Group",
  },
];

const members = [
  {
    id: 1,
    slug: "vladimer-gabrielashvili",
    title: "Vladimer Gabrielashvili",
    position: "Partner",
    description:
      "Vladimer, a partner at AG Legal Consulting since 2007, has held key legal and government roles, including at Georgian Railway and the National Security Council.",
    quote:
      "Strong legal foundations are the cornerstone of every successful business and lasting personal legacy.",
    text1:
      "Vladimer Gabrielashvili is a founding partner at AG Legal Consulting. He graduated from the Faculty of Law at Ivane Javakhishvili Tbilisi State University and has been practicing law since 2001. Over the course of his career, he has held senior legal positions at major Georgian institutions, including Georgian Railway and the National Security Council of Georgia.",
    text2:
      "Vladimer specializes in corporate and business law, mergers and acquisitions, government relations, and dispute resolution. He advises domestic and international clients on complex cross-border transactions and regulatory matters. He is a member of the Georgian Bar Association and is recognized as a leading practitioner in corporate law by major legal directories.",
    image: "/images/members/vladimer-gabrielashvili.jpg",
    socials: [
      {
        id: 1,
        name: "Instagram",
        icon: icons.Instagram,
        link: "https://www.instagram.com/",
      },
      {
        id: 2,
        name: "Facebook",
        icon: icons.Facebook,
        link: "https://www.facebook.com/",
      },
    ],
  },
  {
    id: 2,
    slug: "dimitri-aleksidze",
    title: "Dimitri Aleksidze",
    position: "Partner",
    description:
      "Dimitri Aleksidze, a partner at AG Legal Consulting, has held key legal and executive positions across leading Georgian enterprises and public institutions.",
    quote:
      "Effective legal counsel is not just about knowing the law — it is about understanding the business behind every decision.",
    text1:
      "Dimitri Aleksidze is a partner at AG Legal Consulting with over 15 years of legal practice across both the private and public sectors. He received his law degree from Tbilisi State University and completed advanced studies in European business law. Early in his career, Dimitri served as in-house counsel for several major Georgian corporations, gaining deep expertise in transactional and regulatory work.",
    text2:
      "At AG Legal Consulting, Dimitri focuses on mergers and acquisitions, corporate restructuring, contract law, and commercial dispute resolution. He represents clients in complex negotiations and court proceedings, providing practical, results-driven legal advice. Dimitri is a certified attorney and an active member of the Georgian Bar Association.",
    image: "/images/members/dimitri-aleksidze.jpg",
    socials: [
      {
        id: 1,
        name: "Instagram",
        icon: icons.Instagram,
        link: "https://www.instagram.com/",
      },
      {
        id: 2,
        name: "Facebook",
        icon: icons.Facebook,
        link: "https://www.facebook.com/",
      },
    ],
  },
  {
    id: 3,
    slug: "lika-galustashvili",
    title: "Lika Galustashvili",
    position: "Senior Associate",
    description:
      "Lika specializes in civil and administrative law, with additional expertise in corporate law, intellectual property, and contract law.",
    quote:
      "Choosing the right structure for your business is a critical decision that impacts everything from taxation to liability protection.",
    text1:
      "Lika Galustashvili graduated from the Faculty of Law at Ivane Javakhishvili Tbilisi State University, where she earned her LL.B. and LL.M. degrees in Private Law. She also completed part of her Master's studies at the University of La Coruña in Spain. Later, she pursued a Master's in European Studies at Ivane Javakhishvili Tbilisi State University, supported by a scholarship from the KONRAD ADENAUER Fund.",
    text2:
      "Lika began her career as a paralegal and gained valuable experience in both the private and public sectors, as well as with non-governmental organizations. Before joining AG Legal Consulting in 2020 as an associate, she worked at the National Bureau of Enforcement. At AG Legal Consulting, Lika specializes in civil and administrative law, with additional expertise in corporate law, intellectual property law, and contract law. She provides clients with comprehensive legal advice on corporate reorganization, restructuring, and employment matters. Lika is actively involved in M&A and real estate transactions, drafting and analyzing legal documents and representing clients in the courts of Georgia. She is a member of the Georgian Bar Association and speaks Georgian, English, Spanish, and Russian.",
    image: "/images/members/lika-galustashvili.jpg",
    socials: [
      {
        id: 1,
        name: "Instagram",
        icon: icons.Instagram,
        link: "https://www.instagram.com/",
      },
      {
        id: 2,
        name: "Facebook",
        icon: icons.Facebook,
        link: "https://www.facebook.com/",
      },
    ],
  },
  {
    id: 4,
    slug: "nikoloz-abutidze",
    title: "Nikoloz Abutidze",
    position: "Senior Associate",
    description:
      "Nikoloz Abutidze, a licensed insolvency practitioner and PhD candidate, specializes in insolvency, corporate, and real estate law.",
    quote:
      "Sound legal analysis and practical judgment are the pillars of every successful transaction and dispute resolution.",
    text1:
      "Nikoloz Abutidze holds a law degree from Ivane Javakhishvili Tbilisi State University and is currently a PhD candidate in civil law. He is a licensed insolvency practitioner and has completed specialized training in corporate governance and commercial arbitration. His academic background is complemented by broad practical experience in both advisory and litigation roles.",
    text2:
      "At AG Legal Consulting, Nikoloz advises clients on insolvency proceedings, corporate restructuring, real estate transactions, and commercial disputes. He has represented clients before Georgian courts at all levels and has been involved in several landmark insolvency cases. Nikoloz is a member of the Georgian Bar Association and the Chamber of Insolvency Practitioners of Georgia.",
    image: "/images/members/nikoloz-abutidze.jpg",
    socials: [
      {
        id: 1,
        name: "Instagram",
        icon: icons.Instagram,
        link: "https://www.instagram.com/",
      },
      {
        id: 2,
        name: "Facebook",
        icon: icons.Facebook,
        link: "https://www.facebook.com/",
      },
    ],
  },
  {
    id: 5,
    slug: "aleksandre-khasia",
    title: "Aleksandre Khasia",
    position: "Financial Manager",
    description:
      "Aleksandre Khasia, financial manager at AG Legal Consulting since 2008, oversees all financial operations, reporting, and corporate planning for the firm.",
    quote:
      "Financial clarity and disciplined management are essential to building a firm that clients and partners can always rely on.",
    text1:
      "Aleksandre Khasia holds a degree in Economics and Finance from Tbilisi State University and has completed additional professional development courses in corporate financial management and accounting. He joined AG Legal Consulting in 2008 and has since played a central role in shaping the financial infrastructure of the firm.",
    text2:
      "Aleksandre oversees all aspects of the firm's financial operations, including budgeting, financial reporting, payroll management, and tax compliance. He works closely with the partners to ensure fiscal soundness across all client-facing and internal operations. His expertise extends to advising clients on financial structuring in the context of corporate transactions and business formation.",
    image: "/images/members/aleksandre-khasia.jpg",
    socials: [
      {
        id: 1,
        name: "Instagram",
        icon: icons.Instagram,
        link: "https://www.instagram.com/",
      },
      {
        id: 2,
        name: "Facebook",
        icon: icons.Facebook,
        link: "https://www.facebook.com/",
      },
    ],
  },
  {
    id: 6,
    slug: "eka-arsenidze",
    title: "Eka Arsenidze",
    position: "Senior Administrative Manager",
    description:
      "Eka Arsenidze, Senior Administrative Manager at AG Legal Consulting since 2008, leads the firm's administrative operations with precision and dedication.",
    quote:
      "A well-run firm starts from the inside — the strength of our team is built on trust, discipline, and genuine care for every client.",
    text1:
      "Eka Arsenidze has been a cornerstone of AG Legal Consulting's administrative operations since joining the firm in 2008. She holds a degree in Business Administration and has accumulated extensive experience in law firm management, client relations, and organizational development. Her leadership has been instrumental in building the firm's internal culture and operational standards.",
    text2:
      "As Senior Administrative Manager, Eka coordinates the firm's day-to-day operations, oversees client intake and communications, manages the administrative team, and ensures that all internal processes run smoothly and efficiently. She works closely with attorneys and partners to support the delivery of high-quality legal services. Eka is known for her exceptional organizational skills and commitment to client service excellence.",
    image: "/images/members/eka-arsenidze.jpg",
    socials: [
      {
        id: 1,
        name: "Instagram",
        icon: icons.Instagram,
        link: "https://www.instagram.com/",
      },
      {
        id: 2,
        name: "Facebook",
        icon: icons.Facebook,
        link: "https://www.facebook.com/",
      },
    ],
  },
  {
    id: 7,
    slug: "kakhaber-kipiani",
    title: "Kakhaber Kipiani",
    position: "Of Counsel",
    description:
      "Kakha, counsel at AG Legal Consulting since 2024, was a senior lawyer and partner at leading Georgian law firms for over two decades.",
    quote:
      "Decades of practice have taught me that every legal challenge, no matter how complex, has a solution rooted in careful analysis and sound judgment.",
    text1:
      "Kakhaber Kipiani brings over 25 years of legal experience to AG Legal Consulting, where he serves as Of Counsel. He graduated from the Faculty of Law at Ivane Javakhishvili Tbilisi State University and subsequently earned advanced qualifications in commercial and constitutional law. Over his career, he has been a partner at two of Georgia's most respected law firms and has appeared before the Constitutional Court of Georgia on multiple occasions.",
    text2:
      "Kakhaber specializes in constitutional law, commercial litigation, arbitration, and regulatory affairs. He advises the firm and its clients on high-stakes disputes and complex legal strategy. His extensive courtroom experience and depth of legal knowledge make him a trusted advisor across a wide range of practice areas. Kakhaber is a member of the Georgian Bar Association and a recognized authority in Georgian commercial law.",
    image: "/images/members/kakhaber-kipiani.jpg",
    socials: [
      {
        id: 1,
        name: "Instagram",
        icon: icons.Instagram,
        link: "https://www.instagram.com/",
      },
      {
        id: 2,
        name: "Facebook",
        icon: icons.Facebook,
        link: "https://www.facebook.com/",
      },
    ],
  },
];

const faqs = [
  {
    id: 1,
    question: "What types of cases does your firm handle?",
    answer:
      "We specialize in a wide range of legal areas, including business law, family law, criminal defense, real estate, and personal injury. Explore our services to find the right solution for your legal needs.",
  },
  {
    id: 2,
    question: "How much do your services cost?",
    answer:
      "The cost of our services varies depending on the complexity of your case. We offer a free initial consultation to discuss your legal needs and provide you with a quote. Contact us to schedule an appointment.",
  },
  {
    id: 3,
    question: "How do I schedule a consultation?",
    answer:
      "To schedule a consultation, simply fill out our online contact form or give us a call. We will get back to you as soon as possible to discuss your legal needs and set up an appointment.",
  },
  {
    id: 4,
    question: "What should I bring to my initial consultation?",
    answer:
      "For your initial consultation, please bring any relevant documents related to your case, including contracts, court orders, and correspondence. This will help us better understand your situation and provide you with the best possible advice.",
  },
  {
    id: 5,
    question: "How long does it take to resolve a case?",
    answer:
      "The time it takes to resolve your case will depend on a variety of factors, including the complexity of the legal issues involved and the willingness of the parties to reach a settlement. We will work diligently to resolve your case as quickly and efficiently as possible.",
  },
  {
    id: 6,
    question: "Can I change attorneys if I’m not satisfied?",
    answer:
      "If you are not satisfied with your current attorney, you have the right to change representation at any time. We will work with you to ensure a smooth transition and provide you with the legal support you need.",
  },
];

const footer_nav_links = [
  { id: 1, title: "Solutions", url: "/services" },
  { id: 2, title: "Approach", url: "/about" },
  { id: 3, title: "Team", url: "/team" },
  { id: 4, title: "FAQ", url: "/about#faq" },
  { id: 5, title: "Contact", url: "/contact" },
];

const footer_social_links = [
  { id: 1, title: "Facebook", url: "https://www.facebook.com/" },
  { id: 2, title: "Instagram", url: "https://www.instagram.com/" },
  { id: 3, title: "Twitter", url: "https://twitter.com/" },
  { id: 4, title: "Linkedin", url: "https://www.linkedin.com/" },
];

const footer_links = [...footer_nav_links, ...footer_social_links.map((l) => ({ ...l, type: "social" }))];

const content = [
  {
    id: 1,
    title: "Integrity",
    description:
      "We are unwavering in our commitment to upholding the highest ethical standards. Each case we take is handled with complete transparency, ensuring that we act in the best interest of our clients while maintaining honesty and trust in all our dealings.",
    image: "/images/values/integrity.jpg",
  },
  {
    id: 2,
    title: "Compassion",
    description:
      "We understand that legal issues can be overwhelming and stressful. Our team is dedicated to providing a supportive and empathetic environment for our clients, ensuring that they feel heard, understood, and cared for throughout the legal process.",
    image: "/images/values/compassion.jpg",
  },
  {
    id: 3,
    title: "Expertise",
    description:
      "Our team of experienced attorneys is committed to providing exceptional legal services. We have the knowledge, skills, and resources to handle a wide range of legal matters, and we work tirelessly to achieve the best possible outcome for our clients.",
    image: "/images/values/expertise.jpg",
  },
];

const features = [
  {
    id: 1,
    title: "Client-centered approach",
    description:
      "We focus on understanding our clients unique needs to craft personalized legal strategies that prioritize their best interests and ensure success.",
    icon: icons.HeartedPerson,
  },
  {
    id: 2,
    title: "Proven track record",
    description:
      "With over 25 years of experience, we’ve handled thousands of cases with favorable outcomes, showcasing our expertise and commitment.",
    icon: icons.CheckShield,
  },
  {
    id: 3,
    title: "Experienced legal team",
    description:
      "We use advanced tools for efficient case management, virtual consultations, and accurate results, ensuring convenience and faster outcomes.",
    icon: icons.Hat,
  },
  {
    id: 4,
    title: "Commitment to ethical practice",
    description:
      "Integrity and transparency guide us. We act in our clients' best interests, building trust through ethical and professional practices.",
    icon: icons.Scale,
  },
];

const tags = [
  {
    id: 1,
    title: "All",
  },
  {
    id: 2,
    title: "Corporate law",
  },
  {
    id: 3,
    title: "Family law",
  },
  {
    id: 4,
    title: "Real estate",
  },
  {
    id: 5,
    title: "Personal injury",
  },
  {
    id: 6,
    title: "Criminal defense",
  },
  {
    id: 7,
    title: "Immigration",
  },
  {
    id: 8,
    title: "Legal trends",
  },
  {
    id: 9,
    title: "Case studies",
  },
  {
    id: 10,
    title: "Tips & guides",
  },
];

const articles = [
  {
    id: 1,
    title: "Navigating the latest corporate law changes",
    date: "Dec 20, 2025",
    time: "8 min read",
    description:
      "Discover how recent changes in corporate law might impact businesses across industries and how to stay compliant.",
    image: "/images/news/law-changes.jpg",
    type: "main",
    tags: ["Corporate law", "Legal trends"],
  },
  {
    id: 2,
    title: "The growing importance of cybersecurity law",
    date: "Dec 18, 2025",
    type: "side",
    tags: ["Family law", "Case studies"],
  },
  {
    id: 3,
    title: "Top 5 estate planning tips for 2025",
    date: "Dec 22, 2025",
    time: "5 min read",
    description:
      "Learn the best practices for estate planning to secure your legacy and protect your loved ones.",
    image: "/images/news/estate-planning.jpg",
    type: "main",
    tags: ["Real estate", "Tips & guides"],
  },
  {
    id: 4,
    title: "Key trends in family law for 2025",
    date: "Dec 12, 2025",
    type: "side",
    tags: ["Personal injury", "Family law"],
  },
  {
    id: 5,
    title: "How to handle real estate disputes effectively",
    date: "Dec 10, 2025",
    type: "side",
    tags: ["Criminal defense", "Real estate"],
  },
  {
    id: 6,
    title: "The impact of recent personal injury law changes",
    date: "Dec 8, 2025",
    time: "7 min read",
    description:
      "Discover how recent changes in personal injury law might impact individuals and families and how to protect your rights.",
    image: "/images/news/impact.jpg",
    type: "main",
    tags: ["Personal injury", "Legal trends"],
  },
  {
    id: 7,
    title: "The latest criminal defense case studies",
    date: "Dec 5, 2025",
    type: "side",
    tags: ["Corporate law", "Case studies"],
  },
  {
    id: 8,
    title: "The impact of recent personal injury law changes",
    date: "Dec 8, 2025",
    type: "side",
    tags: ["Personal injury", "Legal trends"],
  },
  {
    id: 9,
    title: "The latest criminal defense case studies",
    date: "Dec 5, 2025",
    time: "5 min read",
    description:
      "Explore recent criminal defense case studies and learn how top attorneys successfully defended their clients in court.",
    image: "/images/news/case-studies.jpg",
    type: "main",
    tags: ["Family law", "Case studies"],
  },
  {
    id: 10,
    title: "How Immigration Policies Impact Criminal Defense Cases",
    date: "Oct 28, 2025",
    time: "9 min read",
    description:
      "Explore the intersection of immigration policies and criminal defense, and how recent changes affect both individuals and attorneys.",
    image: "/images/news/immigration.jpg",
    type: "main",
    tags: ["Immigration", "Criminal defense"],
  },
];

const topics = [
  {
    value: "1",
    label: "Corporate & business law",
  },
  {
    value: "2",
    label: "Criminal law",
  },
  {
    value: "3",
    label: "Family law",
  },
  {
    value: "4",
    label: "Immigration law",
  },
];

const ui = {
  hero: {
    brand: "AG Legal Consulting",
    title: "Your Trusted Legal\nAdvisors in Georgia",
    cta: "CONSULT WITH US",
    description:
      "Join our mission to create a better tomorrow through legal and social support.",
  },
  about: {
    title: "Who we are",
    description:
      "AG Legal Consulting has been providing expert legal counsel to businesses and individuals since 2007. With years of experience and a strong reputation, our team is dedicated to being your trusted advisor, offering clear and effective guidance through any legal challenges",
  },
  services: {
    title: "Our legal services",
    description:
      "At AG Legal Consulting, we believe that great legal advice is built on trust, transparency, and a strong dedication to delivering exceptional outcomes.",
  },
  benefits: {
    title: "Why work with us?",
  },
  process: {
    title: "Our working process",
    description:
      "We follow a streamlined process to ensure your legal matters are handled efficiently and effectively, keeping you informed every step of the way.",
  },
  team: {
    title: "Meet our team",
    description:
      "At AG Legal Consulting, our people are our most valuable asset. Our team consists of highly skilled associates and professionals with diverse expertise and backgrounds.",
  },
  news: {
    title: "Legal insights & updates",
    description:
      "Our team of skilled attorneys and legal professionals is dedicated to providing you with top-tier legal support.",
  },
  cta: {
    subtitle: "Ready to take the next step?",
    title: "Schedule your consultation today",
    button: "SCHEDULE NOW",
  },
  faq: {
    title: "Frequently asked questions.",
  },
  header: {
    contact: "Contact us",
    menu: "Menu",
    followUs: "Follow us",
  },
  footer: {
    download: "Download Presentation",
    size: "PDF, 3 MB",
    copyright: "© 2026 AG Legal. All rights reserved.",
    terms: "Terms & conditions",
    privacy: "Privacy Policy",
  },
  service: {
    learnMore: "LEARN MORE",
  },
};

const mock = {
  nav_links,
  socials,
  top_offices,
  bottom_offices,
  services,
  benefits,
  tabs,
  top_testimonials,
  bottom_testimonials,
  members,
  faqs,
  footer_links,
  footer_nav_links,
  footer_social_links,
  content,
  features,
  tags,
  articles,
  topics,
  ui,
};

export default mock;
