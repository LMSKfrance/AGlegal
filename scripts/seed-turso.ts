/**
 * Seed the Turso database with all initial content.
 * Idempotent: skips tables that already have data.
 *
 * Usage:
 *   1. Create .env.local with TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
 *   2. Run: npm run db:seed-turso
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import * as schema from "../lib/db/schema";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("❌  TURSO_DATABASE_URL is not set.");
  console.error("    Create .env.local with TURSO_DATABASE_URL and TURSO_AUTH_TOKEN, then run:");
  console.error("    npm run db:seed-turso");
  process.exit(1);
}

const client = createClient({ url, authToken });
const db = drizzle(client, { schema });

// ─── Data ────────────────────────────────────────────────────────────────────

const servicesEn = [
  { slug: "corporate-business-law", title: "Corporate & business law", description: "Legal support for businesses, including company formation, contracts, mergers, and intellectual property.", text1: "Navigating the complexities of business law is crucial to the success and longevity of your company. Whether you're starting a new business or looking to expand or protect an established one, our experienced legal team is here to provide expert support.", text2: "We offer comprehensive services to businesses of all sizes, from startups to established enterprises, ensuring that every aspect of your business operations remains legally sound and compliant.", quote: "Choosing the right structure for your business is a critical decision that impacts everything from taxation to liability protection", image: "/images/services/corporate.jpg", thumbnail_image: "/images/ag-legal.jpg" },
  { slug: "contract-law", title: "Contract Law", description: "Compassionate guidance for divorce, child custody, alimony, and adoption cases.", text1: "Family law matters are often emotionally charged and complex, requiring a delicate approach and expert legal guidance. Our team is dedicated to helping families navigate these challenges with compassion and care, ensuring that your rights and interests are protected.", text2: "We provide a range of family law services, from divorce and child custody to adoption and alimony, helping you find the best path forward for your family.", quote: "We understand the sensitive nature of family law cases and provide the support and guidance you need.", image: "/images/services/family-law.jpg", thumbnail_image: "/images/ag-legal.jpg" },
  { slug: "criminal-defense", title: "Criminal Defense", description: "Strong representation for misdemeanors, felonies, and protecting your legal rights.", text1: "When facing criminal charges, having a skilled defense attorney on your side can make all the difference. Our team is dedicated to protecting your rights and providing a strong defense against a range of criminal charges.", text2: "We handle cases involving misdemeanors, felonies, and more, ensuring that you receive the best possible outcome.", quote: "We fight for your rights and work tirelessly to secure the best possible outcome for your case.", image: "/images/services/criminal-defense.jpg", thumbnail_image: "/images/ag-legal.jpg" },
  { slug: "real-estate-law", title: "Real estate law", description: "We handle real estate transactions, leases, zoning issues, and property dispute resolutions efficiently.", text1: "Real estate transactions and disputes can be complex and challenging to navigate. Our team is here to provide expert guidance and support, ensuring that your real estate matters are handled with care and efficiency.", text2: "We offer a range of real estate law services, from property transactions to zoning issues, helping you achieve your real estate goals.", quote: "Our team has the experience and expertise to handle all your real estate law needs.", image: "/images/services/real-estate-law.jpg", thumbnail_image: "/images/ag-legal.jpg" },
  { slug: "estate-planning-wills", title: "Estate planning & wills", description: "Help securing compensation for accidents, malpractice, and workplace injuries.", text1: "Estate planning is a critical step in securing your legacy and ensuring that your loved ones are provided for. Our team offers comprehensive estate planning services, including wills, trusts, and probate, to help you protect your assets and provide for your family's future.", text2: "We work closely with you to create a personalized estate plan that meets your unique needs and goals, ensuring that your wishes are carried out and your loved ones are taken care of.", quote: "We provide expert estate planning services to help you secure your legacy.", image: "/images/services/estate-plannings.jpg", thumbnail_image: "/images/ag-legal.jpg" },
  { slug: "immigration-law", title: "Immigration law", description: "Wills, trusts, and probate services to secure your legacy and loved ones' future.", text1: "Immigration law can be challenging to navigate, but our experienced team is here to help you through every step of the process. Whether you need assistance with visas, residency, citizenship, or asylum applications, we are dedicated to achieving the best possible outcome for you and your family.", text2: "Our personalized approach ensures that we understand your unique situation and provide tailored legal solutions. We are committed to advocating for your rights and helping you realize your immigration goals with confidence.", quote: "Navigating immigration law can be overwhelming, but you don't have to do it alone. We're here to help.", image: "/images/services/immigration-law.jpg", thumbnail_image: "/images/ag-legal.jpg" },
];

const servicesKa = [
  { slug: "corporate-business-law", title: "კორპორატიული და საბიზნესო სამართალი", description: "სამართლებრივი მხარდაჭერა ბიზნესისთვის: კომპანიის დაარსება, კონტრაქტები, შერწყმები და ინტელექტუალური საკუთრება.", text1: "ბიზნეს სამართლის სირთულეების ნავიგაცია გადამწყვეტია თქვენი კომპანიის წარმატებისა და გრძელვადიანობისთვის.", text2: "ჩვენ ვთავაზობთ ყოვლისმომცველ მომსახურებას ყველა ზომის ბიზნესისთვის.", quote: "თქვენი ბიზნესისთვის სწორი სტრუქტურის არჩევა გადამწყვეტი გადაწყვეტილებაა." },
  { slug: "contract-law", title: "საკონტრაქტო სამართალი", description: "სამართლებრივი მხარდაჭერა განქორწინების, ბავშვის მოვლის, ალიმენტისა და საშვილებრივის საკითხებში.", text1: "ოჯახური სამართლის საკითხები ხშირად ემოციურად დატვირთული და რთულია.", text2: "ჩვენ ვთავაზობთ ოჯახური სამართლის მომსახურებების სპექტრს.", quote: "ჩვენ გვესმის ოჯახური სამართლის საქმეების მგრძნობიარე ხასიათი." },
  { slug: "criminal-defense", title: "სისხლის სამართლის დაცვა", description: "ძლიერი წარმომადგენლობა სისულელეებში, დანაშაულებში და თქვენი სამართლებრივი უფლებების დაცვაში.", text1: "სისხლის სამართლის ბრალდებების წინაშე ყოფნისას, უნარიანი დამცველი ადვოკატის ქონა ყველაფერს ცვლის.", text2: "ჩვენ ვმუშაობთ სისულელეების, დანაშაულებისა და სხვა საქმეებზე.", quote: "ჩვენ ვიბრძვით თქვენი უფლებებისთვის და ვმუშაობთ დაუღალავად." },
  { slug: "real-estate-law", title: "საუძრავი ქონების სამართალი", description: "ვმართავთ უძრავი ქონების ტრანზაქციებს, ლიზინგს, ზონირების საკითხებსა და უძრავი ქონების დავების მოგვარებას.", text1: "უძრავი ქონების ტრანზაქციები და დავები შეიძლება იყოს რთული და გამოწვევითი.", text2: "ჩვენ ვთავაზობთ უძრავი ქონების სამართლის მომსახურებების სპექტრს.", quote: "ჩვენს გუნდს აქვს გამოცდილება და კომპეტენცია ყველა უძრავი ქონების სამართლის საჭიროების დასაკმაყოფილებლად." },
  { slug: "estate-planning-wills", title: "საკუთრების დაგეგმვა და ანდერძები", description: "დახმარება კომპენსაციის უზრუნველყოფაში ავარიების, სამედიცინო შეცდომებისა და სამუშაო ტრავმების შემთხვევაში.", text1: "საკუთრების დაგეგმვა გადამწყვეტი ნაბიჯია თქვენი მემკვიდრეობის დაცვისა და საყვარელი ადამიანების უზრუნველყოფისთვის.", text2: "ჩვენ მჭიდროდ ვმუშაობთ თქვენთან პერსონალიზებული საკუთრების გეგმის შესაქმნელად.", quote: "ჩვენ ვაწვდით ექსპერტულ მომსახურებას საკუთრების დაგეგმვაში." },
  { slug: "immigration-law", title: "იმიგრაციის სამართალი", description: "ანდერძები, ტრასტები და მემკვიდრეობის მომსახურება თქვენი მემკვიდრეობისა და საყვარელი ადამიანების მომავლის დასაცავად.", text1: "იმიგრაციის სამართლის ნავიგაცია შეიძლება გამოწვევითი იყოს, მაგრამ ჩვენი გამოცდილი გუნდი აქ არის.", text2: "ჩვენი პერსონალიზებული მიდგომა უზრუნველყოფს, რომ გვესმის თქვენი უნიკალური სიტუაცია.", quote: "იმიგრაციის სამართლის ნავიგაცია შეიძლება დამთრგუნველი იყოს, მაგრამ არ ხართ მარტო." },
];

const membersData = [
  { slug: "vladimer-gabrielashvili", titleEn: "Vladimer Gabrielashvili", titleKa: "ვლადიმერ გაბრიელაშვილი", positionEn: "Partner", positionKa: "პარტნიორი", descriptionEn: "Vladimer, a partner at AG Legal Consulting since 2007, has held key legal and government roles, including at Georgian Railway and the National Security Council.", descriptionKa: "ვლადიმერი AG ლეგალური კონსალტინგის პარტნიორია 2007 წლიდან.", quoteEn: "Strong legal foundations are the cornerstone of every successful business and lasting personal legacy.", quoteKa: "ძლიერი სამართლებრივი საფუძვლები არის ყოველი წარმატებული ბიზნესისა და მტკიცე პირადი მემკვიდრეობის საფუძველი.", text1En: "Vladimer Gabrielashvili is a founding partner at AG Legal Consulting. He graduated from the Faculty of Law at Ivane Javakhishvili Tbilisi State University and has been practicing law since 2001.", text1Ka: "ვლადიმერ გაბრიელაშვილი AG ლეგალური კონსალტინგის დამფუძნებელი პარტნიორია.", text2En: "Vladimer specializes in corporate and business law, mergers and acquisitions, government relations, and dispute resolution.", text2Ka: "ვლადიმერი სპეციალიზირდება კორპორატიულ და საბიზნესო სამართალში.", image: "/images/members/vladimer-gabrielashvili.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { slug: "dimitri-aleksidze", titleEn: "Dimitri Aleksidze", titleKa: "დიმიტრი ალექსიძე", positionEn: "Partner", positionKa: "პარტნიორი", descriptionEn: "Dimitri Aleksidze, a partner at AG Legal Consulting, has held key legal and executive positions across leading Georgian enterprises and public institutions.", descriptionKa: "დიმიტრი ალექსიძე, AG ლეგალური კონსალტინგის პარტნიორი.", quoteEn: "Effective legal counsel is not just about knowing the law — it is about understanding the business behind every decision.", quoteKa: "ეფექტური სამართლებრივი რჩევა არ არის მხოლოდ სამართლის ცოდნა.", text1En: "Dimitri Aleksidze is a partner at AG Legal Consulting with over 15 years of legal practice across both the private and public sectors.", text1Ka: "დიმიტრი ალექსიძე AG ლეგალური კონსალტინგის პარტნიორია 15 წელზე მეტი სამართლებრივი პრაქტიკით.", text2En: "At AG Legal Consulting, Dimitri focuses on mergers and acquisitions, corporate restructuring, contract law, and commercial dispute resolution.", text2Ka: "AG ლეგალური კონსალტინგში დიმიტრი ფოკუსირდება შერწყმებასა და შესყიდვებზე.", image: "/images/members/dimitri-aleksidze.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { slug: "lika-galustashvili", titleEn: "Lika Galustashvili", titleKa: "ლიკა გალუსტაშვილი", positionEn: "Senior Associate", positionKa: "უფროსი ასოციატი", descriptionEn: "Lika specializes in civil and administrative law, with additional expertise in corporate law, intellectual property, and contract law.", descriptionKa: "ლიკა სპეციალიზირდება სამოქალაქო და ადმინისტრაციულ სამართალში.", quoteEn: "Choosing the right structure for your business is a critical decision that impacts everything from taxation to liability protection.", quoteKa: "თქვენი ბიზნესისთვის სწორი სტრუქტურის არჩევა გადამწყვეტი გადაწყვეტილებაა.", text1En: "Lika Galustashvili graduated from the Faculty of Law at Ivane Javakhishvili Tbilisi State University, where she earned her LL.B. and LL.M. degrees in Private Law.", text1Ka: "ლიკა გალუსტაშვილი დაამთავრა ივანე ჯავახიშვილის სახელობის თბილისის სახელმწიფო უნივერსიტეტის სამართლის ფაკულტეტი.", text2En: "Lika began her career as a paralegal and gained valuable experience in both the private and public sectors.", text2Ka: "AG ლეგალური კონსალტინგში ლიკა სპეციალიზირდება სამოქალაქო და ადმინისტრაციულ სამართალში.", image: "/images/members/lika-galustashvili.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { slug: "nikoloz-abutidze", titleEn: "Nikoloz Abutidze", titleKa: "ნიკოლოზ აბუტიძე", positionEn: "Senior Associate", positionKa: "უფროსი ასოციატი", descriptionEn: "Nikoloz Abutidze, a licensed insolvency practitioner and PhD candidate, specializes in insolvency, corporate, and real estate law.", descriptionKa: "ნიკოლოზ აბუტიძე, ლიცენზირებული გაკოტრების პრაქტიკოსი.", quoteEn: "Sound legal analysis and practical judgment are the pillars of every successful transaction and dispute resolution.", quoteKa: "საფუძვლიანი სამართლებრივი ანალიზი და პრაქტიკული განაჩენი არის ყოველი წარმატებული ტრანზაქციის საყრდენი.", text1En: "Nikoloz Abutidze holds a law degree from Ivane Javakhishvili Tbilisi State University and is currently a PhD candidate in civil law.", text1Ka: "ნიკოლოზ აბუტიძეს აქვს სამართლის ხარისხი ივანე ჯავახიშვილის სახელობის თბილისის სახელმწიფო უნივერსიტეტიდან.", text2En: "At AG Legal Consulting, Nikoloz advises clients on insolvency proceedings, corporate restructuring, real estate transactions, and commercial disputes.", text2Ka: "AG ლეგალური კონსალტინგში ნიკოლოზი აკონსულტირებს კლიენტებს გაკოტრების პროცედურებზე.", image: "/images/members/nikoloz-abutidze.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { slug: "aleksandre-khasia", titleEn: "Aleksandre Khasia", titleKa: "ალექსანდრე ხასია", positionEn: "Financial Manager", positionKa: "ფინანსური მენეჯერი", descriptionEn: "Aleksandre Khasia, financial manager at AG Legal Consulting since 2008, oversees all financial operations, reporting, and corporate planning for the firm.", descriptionKa: "ალექსანდრე ხასია, AG ლეგალური კონსალტინგის ფინანსური მენეჯერი 2008 წლიდან.", quoteEn: "Financial clarity and disciplined management are essential to building a firm that clients and partners can always rely on.", quoteKa: "ფინანსური სიცხადე და დისციპლინირებული მართვა აუცილებელია ფირმის ასაშენებლად.", text1En: "Aleksandre Khasia holds a degree in Economics and Finance from Tbilisi State University and has completed additional professional development courses.", text1Ka: "ალექსანდრე ხასიას აქვს ეკონომიკისა და ფინანსების ხარისხი თბილისის სახელმწიფო უნივერსიტეტიდან.", text2En: "Aleksandre oversees all aspects of the firm's financial operations, including budgeting, financial reporting, payroll management, and tax compliance.", text2Ka: "ალექსანდრე ხელმძღვანელობს ფირმის ფინანსურ ოპერაციების ყველა ასპექტს.", image: "/images/members/aleksandre-khasia.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { slug: "eka-arsenidze", titleEn: "Eka Arsenidze", titleKa: "ეკა არსენიძე", positionEn: "Senior Administrative Manager", positionKa: "უფროსი ადმინისტრაციული მენეჯერი", descriptionEn: "Eka Arsenidze, Senior Administrative Manager at AG Legal Consulting since 2008, leads the firm's administrative operations with precision and dedication.", descriptionKa: "ეკა არსენიძე, AG ლეგალური კონსალტინგის უფროსი ადმინისტრაციული მენეჯერი 2008 წლიდან.", quoteEn: "A well-run firm starts from the inside — the strength of our team is built on trust, discipline, and genuine care for every client.", quoteKa: "კარგად მართული ფირმა იწყება შიგნიდან.", text1En: "Eka Arsenidze has been a cornerstone of AG Legal Consulting's administrative operations since joining the firm in 2008.", text1Ka: "ეკა არსენიძე AG ლეგალური კონსალტინგის ადმინისტრაციული ოპერაციების ძირითადი ფიგურაა 2008 წლიდან.", text2En: "As Senior Administrative Manager, Eka coordinates the firm's day-to-day operations, oversees client intake and communications.", text2Ka: "უფროს ადმინისტრაციულ მენეჯერად ეკა კოორდინირებს ფირმის ყოველდღიურ ოპერაციებს.", image: "/images/members/eka-arsenidze.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { slug: "kakhaber-kipiani", titleEn: "Kakhaber Kipiani", titleKa: "კახაბერ ყიფიანი", positionEn: "Of Counsel", positionKa: "საკონსულტაციო ადვოკატი", descriptionEn: "Kakha, counsel at AG Legal Consulting since 2024, was a senior lawyer and partner at leading Georgian law firms for over two decades.", descriptionKa: "კახა, AG ლეგალური კონსალტინგის საკონსულტაციო ადვოკატი 2024 წლიდან.", quoteEn: "Decades of practice have taught me that every legal challenge, no matter how complex, has a solution rooted in careful analysis and sound judgment.", quoteKa: "ათწლეულების პრაქტიკამ მასწავლა, რომ ყოველ სამართლებრივ გამოწვევას აქვს გადაწყვეტილება.", text1En: "Kakhaber Kipiani brings over 25 years of legal experience to AG Legal Consulting, where he serves as Of Counsel.", text1Ka: "კახაბერ ყიფიანი მოაქვს 25 წელზე მეტი სამართლებრივი გამოცდილება AG ლეგალურ კონსალტინგში.", text2En: "Kakhaber specializes in constitutional law, commercial litigation, arbitration, and regulatory affairs.", text2Ka: "კახაბერი სპეციალიზირდება კონსტიტუციურ სამართალში, კომერციულ ლიტიგაციაში, არბიტრაჟში.", image: "/images/members/kakhaber-kipiani.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
];

const faqsEn = [
  { question: "What types of cases does your firm handle?", answer: "We specialize in a wide range of legal areas, including business law, family law, criminal defense, real estate, and personal injury. Explore our services to find the right solution for your legal needs." },
  { question: "How much do your services cost?", answer: "The cost of our services varies depending on the complexity of your case. We offer a free initial consultation to discuss your legal needs and provide you with a quote. Contact us to schedule an appointment." },
  { question: "How do I schedule a consultation?", answer: "To schedule a consultation, simply fill out our online contact form or give us a call. We will get back to you as soon as possible to discuss your legal needs and set up an appointment." },
  { question: "What should I bring to my initial consultation?", answer: "For your initial consultation, please bring any relevant documents related to your case, including contracts, court orders, and correspondence. This will help us better understand your situation and provide you with the best possible advice." },
  { question: "How long does it take to resolve a case?", answer: "The time it takes to resolve your case will depend on a variety of factors, including the complexity of the legal issues involved and the willingness of the parties to reach a settlement." },
  { question: "Can I change attorneys if I'm not satisfied?", answer: "If you are not satisfied with your current attorney, you have the right to change representation at any time. We will work with you to ensure a smooth transition and provide you with the legal support you need." },
];

const faqsKa = [
  { question: "რა სახის საქმეებს მართავს თქვენი ფირმა?", answer: "ჩვენ სპეციალიზირდებით სამართლის ფართო სპექტრში: ბიზნეს სამართალი, ოჯახური სამართალი, სისხლის სამართლის დაცვა, უძრავი ქონება და პირადი ტრავმა." },
  { question: "რა ღირს თქვენი მომსახურება?", answer: "მომსახურების ღირებულება დამოკიდებულია თქვენი საქმის სირთულეზე. ჩვენ ვთავაზობთ უფასო საწყის კონსულტაციას." },
  { question: "როგორ დავაჯავშნო კონსულტაცია?", answer: "კონსულტაციის დასაჯავშნად შეავსეთ ჩვენი ონლაინ საკონტაქტო ფორმა ან დაგვირეკეთ." },
  { question: "რა უნდა წამოვიღო საწყის კონსულტაციაზე?", answer: "საწყისი კონსულტაციისთვის გთხოვთ წამოიღოთ ყველა შესაბამისი დოკუმენტი თქვენი საქმის შესახებ." },
  { question: "რამდენი დრო სჭირდება საქმის მოგვარებას?", answer: "საქმის მოგვარების დრო დამოკიდებულია მრავალ ფაქტორზე: ჩართული სამართლებრივი საკითხების სირთულეზე და მხარეების მზადყოფნაზე შეთანხმებაზე." },
  { question: "შემიძლია ადვოკატის შეცვლა, თუ არ ვარ კმაყოფილი?", answer: "თუ არ ხართ კმაყოფილი თქვენი მიმდინარე ადვოკატით, გაქვთ უფლება ნებისმიერ დროს შეცვალოთ წარმომადგენლობა." },
];

const testimonialsData = [
  { quoteEn: "I've worked with several law firms in the past, but none compare to the level of care and dedication I received here. I felt supported every step of the way.", quoteKa: "წარსულში მუშაობდი რამდენიმე სამართლებრივ ფირმასთან, მაგრამ არცერთი არ შეიძლება შევადარო იმ ზრუნვასა და ერთგულებას, რაც აქ მივიღე.", authorName: "Rose Williams", authorPosition: "Williams Legal Advisors", authorImage: "/images/testimonials/rose-williams.jpg", row: "top" },
  { quoteEn: "I couldn't have asked for better representation. Their expertise and strategic approach resulted in a favorable outcome for my case. Highly recommend!", quoteKa: "უკეთესი წარმომადგენლობის ვერ მოვითხოვებდი. მათმა ექსპერტიზამ და სტრატეგიულმა მიდგომამ ხელსაყრელი შედეგი მოუტანა ჩემს საქმეს.", authorName: "David Smith", authorPosition: "Smith Enterprises", authorImage: "/images/testimonials/david-smith.jpg", row: "top" },
  { quoteEn: "From start to finish, the service was exceptional. They made a stressful situation much easier to handle, and their dedication really showed in the results.", quoteKa: "დასაწყისიდან დასასრულამდე მომსახურება განსაკუთრებული იყო. მათ სტრესული სიტუაცია გაცილებით ადვილი გახადეს.", authorName: "Michael Roberts", authorPosition: "Roberts Group", authorImage: "/images/testimonials/michael-roberts.jpg", row: "top" },
  { quoteEn: "This team went above and beyond. Their professionalism and attention to detail were unmatched. I'm extremely grateful for their support.", quoteKa: "ამ გუნდმა ზღვარს გადააჭარბა. მათი პროფესიონალიზმი და დეტალებზე ყურადღება შეუდარებელი იყო.", authorName: "Sophia Turner", authorPosition: "Turner Consulting", authorImage: "/images/testimonials/sophia-turner.jpg", row: "bottom" },
  { quoteEn: "Working with this firm was an absolute pleasure. They handled my case with the utmost care and ensured a positive outcome. I'm highly impressed.", quoteKa: "ამ ფირმასთან მუშაობა ნამდვილი სიამოვნება იყო. ჩემს საქმეს უკიდურესი ზრუნვით მართავდნენ.", authorName: "James Mitchell", authorPosition: "Mitchell & Co.", authorImage: "/images/testimonials/james-mitchell.jpg", row: "bottom" },
  { quoteEn: "Exceptional service from start to finish. The team's expertise and personalized approach made all the difference in my case. Highly recommend them.", quoteKa: "განსაკუთრებული მომსახურება დასაწყისიდან დასასრულამდე. გუნდის ექსპერტიზამ და პერსონალიზებულმა მიდგომამ ყველაფერი შეცვალა.", authorName: "Emily Davis", authorPosition: "Davis Law Group", authorImage: "/images/testimonials/emily-davis.jpg", row: "bottom" },
];

const uiSettings = [
  { key: "hero.brand", valueEn: "AG Legal Consulting", valueKa: "AG ლეგალური კონსალტინგი", group: "hero" },
  { key: "hero.title", valueEn: "Your Trusted Legal\nAdvisors in Georgia", valueKa: "თქვენი სანდო სამართლებრივი\nმრჩევლები საქართველოში", group: "hero" },
  { key: "hero.cta", valueEn: "CONSULT WITH US", valueKa: "დაგვიკავშირდით", group: "hero" },
  { key: "hero.description", valueEn: "Join our mission to create a better tomorrow through legal and social support.", valueKa: "შემოუერთდით ჩვენს მისიას — უკეთესი ხვალის შექმნა სამართლებრივი და სოციალური მხარდაჭერის მეშვეობით.", group: "hero" },
  { key: "about.title", valueEn: "Who we are", valueKa: "ვინ ვართ ჩვენ", group: "about" },
  { key: "about.description", valueEn: "AG Legal Consulting has been providing expert legal counsel to businesses and individuals since 2007. With years of experience and a strong reputation, our team is dedicated to being your trusted advisor, offering clear and effective guidance through any legal challenges", valueKa: "AG ლეგალური კონსალტინგი 2007 წლიდან უზრუნველყოფს ექსპერტულ სამართლებრივ რჩევას.", group: "about" },
  { key: "services.title", valueEn: "Our legal services", valueKa: "ჩვენი სამართლებრივი მომსახურება", group: "services" },
  { key: "services.description", valueEn: "At AG Legal Consulting, we believe that great legal advice is built on trust, transparency, and a strong dedication to delivering exceptional outcomes.", valueKa: "AG ლეგალური კონსალტინგში გვჯერა, რომ დიდი სამართლებრივი რჩევა აგებულია ნდობაზე, გამჭვირვალობაზე.", group: "services" },
  { key: "benefits.title", valueEn: "Why work with us?", valueKa: "რატომ ვმუშაობთ ჩვენთან?", group: "benefits" },
  { key: "process.title", valueEn: "Our working process", valueKa: "ჩვენი სამუშაო პროცესი", group: "process" },
  { key: "process.description", valueEn: "We follow a streamlined process to ensure your legal matters are handled efficiently and effectively, keeping you informed every step of the way.", valueKa: "ჩვენ მივყვებით ოპტიმიზებულ პროცესს, რათა უზრუნველვყოთ თქვენი სამართლებრივი საკითხების ეფექტური მართვა.", group: "process" },
  { key: "team.title", valueEn: "Meet our team", valueKa: "გაიცანით ჩვენი გუნდი", group: "team" },
  { key: "team.description", valueEn: "At AG Legal Consulting, our people are our most valuable asset. Our team consists of highly skilled associates and professionals with diverse expertise and backgrounds.", valueKa: "AG ლეგალური კონსალტინგში ჩვენი ადამიანები ჩვენი ყველაზე ძვირფასი აქტივია.", group: "team" },
  { key: "news.title", valueEn: "Legal insights & updates", valueKa: "სამართლებრივი ინსაითები და განახლებები", group: "news" },
  { key: "news.description", valueEn: "Our team of skilled attorneys and legal professionals is dedicated to providing you with top-tier legal support.", valueKa: "ჩვენი გამოცდილი ადვოკატებისა და სამართლებრივი პროფესიონალების გუნდი ეძღვნება უმაღლესი დონის სამართლებრივი მხარდაჭერის მიწოდებას.", group: "news" },
  { key: "cta.subtitle", valueEn: "Ready to take the next step?", valueKa: "მზად ხართ შემდეგი ნაბიჯისთვის?", group: "cta" },
  { key: "cta.title", valueEn: "Schedule your consultation today", valueKa: "დაჯავშნეთ კონსულტაცია დღესვე", group: "cta" },
  { key: "cta.button", valueEn: "SCHEDULE NOW", valueKa: "დაჯავშნა ახლა", group: "cta" },
  { key: "faq.title", valueEn: "Frequently asked questions.", valueKa: "ხშირად დასმული კითხვები.", group: "faq" },
  { key: "footer.download", valueEn: "Download Presentation", valueKa: "პრეზენტაციის ჩამოტვირთვა", group: "footer" },
  { key: "footer.size", valueEn: "PDF, 3 MB", valueKa: "PDF, 3 MB", group: "footer" },
  { key: "footer.copyright", valueEn: "© 2025 AG Legal. All rights reserved.", valueKa: "© 2025 AG Legal. ყველა უფლება დაცულია.", group: "footer" },
  { key: "footer.terms", valueEn: "Terms & conditions", valueKa: "წესები და პირობები", group: "footer" },
  { key: "footer.privacy", valueEn: "Privacy Policy", valueKa: "კონფიდენციალურობის პოლიტიკა", group: "footer" },
  { key: "header.contact", valueEn: "Contact us", valueKa: "დაგვიკავშირდით", group: "header" },
  { key: "header.menu", valueEn: "Menu", valueKa: "მენიუ", group: "header" },
  { key: "header.followUs", valueEn: "Follow us", valueKa: "გაგვიყოლეთ", group: "header" },
  { key: "service.learnMore", valueEn: "LEARN MORE", valueKa: "გაიგეთ მეტი", group: "service" },
  // About page settings
  { key: "about.numbers.title", valueEn: "Our legacy in numbers.", valueKa: null, group: "about" },
  { key: "about.numbers.description", valueEn: "We're proud of the milestones we've achieved over the years, showcasing our commitment to excellence in every case we handle.", valueKa: null, group: "about" },
  { key: "about.mission.title", valueEn: "Our mission: Justice for all.", valueKa: null, group: "about" },
  { key: "about.mission.description", valueEn: "AG Legal Consulting - Your Trusted Legal Advisors in Georgia", valueKa: null, group: "about" },
  { key: "about.features.title", valueEn: "What set us apart.", valueKa: null, group: "about" },
  { key: "about.philosophy.title", valueEn: "A philosophy of integrity and dedication.", valueKa: null, group: "about" },
  { key: "about.philosophy.description", valueEn: "At the heart of our legal practice lies an unwavering commitment to justice, transparency, and exceptional client service.", valueKa: null, group: "about" },
];

const defaultPages = [
  { slug: "about", titleEn: "Your Trusted Legal Advisors in Georgia.", contentEn: "AG Legal Consulting has provided expert legal services since 2007, advising businesses and individuals in civil and administrative law. We deliver strategic solutions for complex legal challenges.", sortOrder: 0 },
  { slug: "services", titleEn: "Our services.", contentEn: "Navigating the complexities of business law is crucial to the success and longevity of your company. Whether you're starting a new business or looking to expand or protect an established one, our experienced legal team is here to provide expert support.\n\nWe offer comprehensive services to businesses of all sizes, from startups to established enterprises, ensuring that every aspect of your business operations remains legally sound and compliant.", sortOrder: 1 },
  { slug: "contact", titleEn: "Get in Touch", contentEn: "We're here to provide the legal support you need. Reach out today to discuss your case or ask any questions.", sortOrder: 2 },
];

const benefitsData = [
  { titleEn: "Expertise you can trust", descriptionEn: "Our seasoned attorneys bring years of experience across multiple legal areas to provide reliable, results-driven solutions." },
  { titleEn: "Personalized service", descriptionEn: "Every case is unique—our team tailors strategies to meet your needs, ensuring dedicated and individualized support." },
  { titleEn: "Clear communication", descriptionEn: "We keep you informed with transparent updates at every stage, so you always know where your case stands." },
  { titleEn: "Proven track record", descriptionEn: "With a history of successful settlements and court victories, we fight for outcomes that exceed your expectations." },
];

const processStepsData = [
  { tabTitleEn: "Consultation", titleEn: "Initial consultation", descriptionEn: "We start by understanding your case through a detailed consultation, answering your questions, and outlining the best approach.", image: "/images/process/consultation.jpg", stepNumber: "01" },
  { tabTitleEn: "Evaluation", titleEn: "Case evaluation", descriptionEn: "Our team evaluates the case in detail, identifying key issues, strengths, and areas requiring attention.", image: "/images/process/evaluation.jpg", stepNumber: "02" },
  { tabTitleEn: "Action", titleEn: "Taking action", descriptionEn: "We proceed with all necessary steps, from filing paperwork to representing you in court, ensuring no stone is left unturned.", image: "/images/process/action.jpg", stepNumber: "03" },
  { tabTitleEn: "Results", titleEn: "Achieving results", descriptionEn: "Our goal is to deliver the best possible outcome for you, ensuring satisfaction and resolution.", image: "/images/process/results.jpg", stepNumber: "04" },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  const now = new Date().toISOString();
  console.log("🌱 Seeding Turso database...\n");

  // Articles from markdown files
  const articlesDir = path.join(process.cwd(), "articles");
  const articleFiles = fs.existsSync(articlesDir)
    ? fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"))
    : [];

  const existingArticles = await db.select().from(schema.articles);
  if (existingArticles.length === 0 && articleFiles.length > 0) {
    console.log(`Seeding ${articleFiles.length} articles...`);
    for (let i = 0; i < articleFiles.length; i++) {
      const fileName = articleFiles[i];
      const slug = fileName.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(articlesDir, fileName), "utf-8");
      const { data, content } = matter(raw);
      await db.insert(schema.articles).values({
        slug,
        titleEn: data.title || slug,
        titleKa: null,
        descriptionEn: data.description || null,
        descriptionKa: null,
        contentEn: content.trim(),
        contentKa: null,
        image: data.image || null,
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : now.split("T")[0],
        time: data.time || null,
        tags: Array.isArray(data.tags) ? data.tags : [],
        type: data.type || null,
        sortOrder: i,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`  + article: ${slug}`);
    }
  } else {
    console.log(`~ articles: skipped (${existingArticles.length} already exist)`);
  }

  // Services
  const existingServices = await db.select().from(schema.services);
  if (existingServices.length === 0) {
    console.log(`\nSeeding ${servicesEn.length} services...`);
    for (let i = 0; i < servicesEn.length; i++) {
      const en = servicesEn[i];
      const ka = servicesKa[i];
      await db.insert(schema.services).values({
        slug: en.slug, titleEn: en.title, titleKa: ka.title,
        descriptionEn: en.description, descriptionKa: ka.description,
        text1En: en.text1, text1Ka: ka.text1,
        text2En: en.text2, text2Ka: ka.text2,
        quoteEn: en.quote, quoteKa: ka.quote,
        image: en.image, thumbnailImage: en.thumbnail_image,
        sortOrder: i, createdAt: now, updatedAt: now,
      });
      console.log(`  + service: ${en.slug}`);
    }
  } else {
    console.log(`\n~ services: skipped (${existingServices.length} already exist)`);
  }

  // Team members
  const existingMembers = await db.select().from(schema.teamMembers);
  if (existingMembers.length === 0) {
    console.log(`\nSeeding ${membersData.length} team members...`);
    for (let i = 0; i < membersData.length; i++) {
      const m = membersData[i];
      const result = await db.insert(schema.teamMembers).values({
        slug: m.slug, titleEn: m.titleEn, titleKa: m.titleKa,
        positionEn: m.positionEn, positionKa: m.positionKa,
        descriptionEn: m.descriptionEn, descriptionKa: m.descriptionKa,
        quoteEn: m.quoteEn, quoteKa: m.quoteKa,
        text1En: m.text1En, text1Ka: m.text1Ka,
        text2En: m.text2En, text2Ka: m.text2Ka,
        image: m.image, sortOrder: i, createdAt: now, updatedAt: now,
      });
      const memberId = Number(result.lastInsertRowid);
      for (const social of m.socials) {
        await db.insert(schema.teamMemberSocials).values({
          teamMemberId: memberId, platform: social.platform, link: social.link,
        });
      }
      console.log(`  + member: ${m.slug} (${m.socials.length} socials)`);
    }
  } else {
    console.log(`\n~ team members: skipped (${existingMembers.length} already exist)`);
  }

  // FAQs
  const existingFaqs = await db.select().from(schema.faqs);
  if (existingFaqs.length === 0) {
    console.log(`\nSeeding ${faqsEn.length} FAQs...`);
    for (let i = 0; i < faqsEn.length; i++) {
      await db.insert(schema.faqs).values({
        questionEn: faqsEn[i].question, questionKa: faqsKa[i]?.question || null,
        answerEn: faqsEn[i].answer, answerKa: faqsKa[i]?.answer || null,
        sortOrder: i, createdAt: now, updatedAt: now,
      });
      console.log(`  + faq: ${faqsEn[i].question.substring(0, 40)}...`);
    }
  } else {
    console.log(`\n~ FAQs: skipped (${existingFaqs.length} already exist)`);
  }

  // Testimonials
  const existingTestimonials = await db.select().from(schema.testimonials);
  if (existingTestimonials.length === 0) {
    console.log(`\nSeeding ${testimonialsData.length} testimonials...`);
    for (let i = 0; i < testimonialsData.length; i++) {
      const t = testimonialsData[i];
      await db.insert(schema.testimonials).values({
        quoteEn: t.quoteEn, quoteKa: t.quoteKa,
        authorName: t.authorName, authorPosition: t.authorPosition,
        authorImage: t.authorImage, row: t.row,
        sortOrder: i, createdAt: now, updatedAt: now,
      });
      console.log(`  + testimonial: ${t.authorName}`);
    }
  } else {
    console.log(`\n~ testimonials: skipped (${existingTestimonials.length} already exist)`);
  }

  // Site settings
  const existingSettings = await db.select().from(schema.siteSettings);
  const existingKeys = new Set(existingSettings.map((s) => s.key));
  const newSettings = uiSettings.filter((s) => !existingKeys.has(s.key));
  if (newSettings.length > 0) {
    console.log(`\nSeeding ${newSettings.length} site settings...`);
    for (const setting of newSettings) {
      await db.insert(schema.siteSettings).values({
        key: setting.key, valueEn: setting.valueEn,
        valueKa: setting.valueKa ?? null, group: setting.group,
        updatedAt: now,
      });
    }
    console.log(`  + ${newSettings.length} settings added`);
  } else {
    console.log(`\n~ site settings: all ${existingSettings.length} already exist`);
  }

  // Pages
  console.log("\nSeeding pages...");
  for (const p of defaultPages) {
    const existing = await db.select().from(schema.pages).where(eq(schema.pages.slug, p.slug));
    if (existing.length === 0) {
      await db.insert(schema.pages).values({
        slug: p.slug, titleEn: p.titleEn, titleKa: null,
        contentEn: p.contentEn, contentKa: null,
        metaDescriptionEn: null, metaDescriptionKa: null,
        sortOrder: p.sortOrder, createdAt: now, updatedAt: now,
      });
      console.log(`  + page: ${p.slug}`);
    } else {
      console.log(`  ~ page already exists: ${p.slug}`);
    }
  }

  // Home benefits
  const existingBenefits = await db.select().from(schema.homeBenefits);
  if (existingBenefits.length === 0) {
    console.log(`\nSeeding ${benefitsData.length} home benefits...`);
    for (let i = 0; i < benefitsData.length; i++) {
      await db.insert(schema.homeBenefits).values({
        titleEn: benefitsData[i].titleEn, titleKa: null,
        descriptionEn: benefitsData[i].descriptionEn, descriptionKa: null,
        iconPath: null, sortOrder: i, createdAt: now, updatedAt: now,
      });
      console.log(`  + benefit: ${benefitsData[i].titleEn}`);
    }
  } else {
    console.log(`\n~ home benefits: skipped (${existingBenefits.length} already exist)`);
  }

  // Home process steps
  const existingSteps = await db.select().from(schema.homeProcessSteps);
  if (existingSteps.length === 0) {
    console.log(`\nSeeding ${processStepsData.length} process steps...`);
    for (let i = 0; i < processStepsData.length; i++) {
      const s = processStepsData[i];
      await db.insert(schema.homeProcessSteps).values({
        tabTitleEn: s.tabTitleEn, tabTitleKa: null,
        titleEn: s.titleEn, titleKa: null,
        descriptionEn: s.descriptionEn, descriptionKa: null,
        image: s.image, stepNumber: s.stepNumber,
        sortOrder: i, createdAt: now, updatedAt: now,
      });
      console.log(`  + step: ${s.tabTitleEn}`);
    }
  } else {
    console.log(`\n~ process steps: skipped (${existingSteps.length} already exist)`);
  }

  console.log("\n✅ Seed complete!");
  await client.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
