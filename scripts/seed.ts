import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import * as schema from "../lib/db/schema";

const DB_PATH = path.join(process.cwd(), "data", "ag-legal.db");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite, { schema });

// ─── Mock data (EN) ──────────────────────────────────────────────────────────
const servicesEn = [
  { id: 1, slug: "corporate-business-law", title: "Corporate & business law", description: "Legal support for businesses, including company formation, contracts, mergers, and intellectual property.", text1: "Navigating the complexities of business law is crucial to the success and longevity of your company. Whether you're starting a new business or looking to expand or protect an established one, our experienced legal team is here to provide expert support.", text2: "We offer comprehensive services to businesses of all sizes, from startups to established enterprises, ensuring that every aspect of your business operations remains legally sound and compliant.", quote: "Choosing the right structure for your business is a critical decision that impacts everything from taxation to liability protection", image: "/images/services/corporate.jpg", thumbnail_image: "/images/ag-legal.jpg" },
  { id: 2, slug: "contract-law", title: "Contract Law", description: "Compassionate guidance for divorce, child custody, alimony, and adoption cases.", text1: "Family law matters are often emotionally charged and complex, requiring a delicate approach and expert legal guidance. Our team is dedicated to helping families navigate these challenges with compassion and care, ensuring that your rights and interests are protected.", text2: "We provide a range of family law services, from divorce and child custody to adoption and alimony, helping you find the best path forward for your family.", quote: "We understand the sensitive nature of family law cases and provide the support and guidance you need.", image: "/images/services/family-law.jpg", thumbnail_image: "/images/ag-legal.jpg" },
  { id: 3, slug: "criminal-defense", title: "Criminal Defense", description: "Strong representation for misdemeanors, felonies, and protecting your legal rights.", text1: "When facing criminal charges, having a skilled defense attorney on your side can make all the difference. Our team is dedicated to protecting your rights and providing a strong defense against a range of criminal charges.", text2: "We handle cases involving misdemeanors, felonies, and more, ensuring that you receive the best possible outcome.", quote: "We fight for your rights and work tirelessly to secure the best possible outcome for your case.", image: "/images/services/criminal-defense.jpg", thumbnail_image: "/images/ag-legal.jpg" },
  { id: 4, slug: "real-estate-law", title: "Real estate law", description: "We handle real estate transactions, leases, zoning issues, and property dispute resolutions efficiently.", text1: "Real estate transactions and disputes can be complex and challenging to navigate. Our team is here to provide expert guidance and support, ensuring that your real estate matters are handled with care and efficiency.", text2: "We offer a range of real estate law services, from property transactions to zoning issues, helping you achieve your real estate goals.", quote: "Our team has the experience and expertise to handle all your real estate law needs.", image: "/images/services/real-estate-law.jpg", thumbnail_image: "/images/ag-legal.jpg" },
  { id: 5, slug: "estate-planning-wills", title: "Estate planning & wills", description: "Help securing compensation for accidents, malpractice, and workplace injuries.", text1: "Estate planning is a critical step in securing your legacy and ensuring that your loved ones are provided for. Our team offers comprehensive estate planning services, including wills, trusts, and probate, to help you protect your assets and provide for your family's future.", text2: "We work closely with you to create a personalized estate plan that meets your unique needs and goals, ensuring that your wishes are carried out and your loved ones are taken care of.", quote: "We provide expert estate planning services to help you secure your legacy.", image: "/images/services/estate-plannings.jpg", thumbnail_image: "/images/ag-legal.jpg" },
  { id: 6, slug: "immigration-law", title: "Immigration law", description: "Wills, trusts, and probate services to secure your legacy and loved ones' future.", text1: "Immigration law can be challenging to navigate, but our experienced team is here to help you through every step of the process. Whether you need assistance with visas, residency, citizenship, or asylum applications, we are dedicated to achieving the best possible outcome for you and your family.", text2: "Our personalized approach ensures that we understand your unique situation and provide tailored legal solutions. We are committed to advocating for your rights and helping you realize your immigration goals with confidence.", quote: "Navigating immigration law can be overwhelming, but you don't have to do it alone. We're here to help.", image: "/images/services/immigration-law.jpg", thumbnail_image: "/images/ag-legal.jpg" },
];

const servicesKa = [
  { slug: "corporate-business-law", title: "კორპორატიული და საბიზნესო სამართალი", description: "სამართლებრივი მხარდაჭერა ბიზნესისთვის: კომპანიის დაარსება, კონტრაქტები, შერწყმები და ინტელექტუალური საკუთრება.", text1: "ბიზნეს სამართლის სირთულეების ნავიგაცია გადამწყვეტია თქვენი კომპანიის წარმატებისა და გრძელვადიანობისთვის. გაქვთ ახალი ბიზნესი თუ გსურთ განვითარება ან დაცვა უკვე არსებული ბიზნესის, ჩვენი გამოცდილი სამართლებრივი გუნდი მზადაა ექსპერტული მხარდაჭერისთვის.", text2: "ჩვენ ვთავაზობთ ყოვლისმომცველ მომსახურებას ყველა ზომის ბიზნესისთვის: სტარტაპებიდან დამკვიდრებული საწარმოებამდე, რათა უზრუნველვყოთ ბიზნესის ყველა ასპექტის სამართლებრივი სისწორე და შესაბამისობა.", quote: "თქვენი ბიზნესისთვის სწორი სტრუქტურის არჩევა გადამწყვეტი გადაწყვეტილებაა, რომელიც მოქმედებს ყველაფერზე: დაბეგვრებიდან პასუხისმგებლობის დაცვამდე." },
  { slug: "contract-law", title: "საკონტრაქტო სამართალი", description: "სამართლებრივი მხარდაჭერა განქორწინების, ბავშვის მოვლის, ალიმენტისა და საშვილებრივის საკითხებში.", text1: "ოჯახური სამართლის საკითხები ხშირად ემოციურად დატვირთული და რთულია, რაც მოითხოვს დელიკატურ მიდგომას და ექსპერტულ სამართლებრივ ხელმძღვანელობას. ჩვენი გუნდი ეძღვნება ოჯახების დახმარებას ამ გამოწვევების გადალახვაში თანაგრძნობითა და ზრუნვით.", text2: "ჩვენ ვთავაზობთ ოჯახური სამართლის მომსახურებების სპექტრს: განქორწინებიდან ბავშვის მოვლამდე, საშვილებრივიდან ალიმენტამდე, რათა დაგეხმაროთ საუკეთესო გზის პოვნაში თქვენი ოჯახისთვის.", quote: "ჩვენ გვესმის ოჯახური სამართლის საქმეების მგრძნობიარე ხასიათი და ვაწვდით საჭირო მხარდაჭერასა და ხელმძღვანელობას." },
  { slug: "criminal-defense", title: "სისხლის სამართლის დაცვა", description: "ძლიერი წარმომადგენლობა სისულელეებში, დანაშაულებში და თქვენი სამართლებრივი უფლებების დაცვაში.", text1: "სისხლის სამართლის ბრალდებების წინაშე ყოფნისას, უნარიანი დამცველი ადვოკატის ქონა ყველაფერს ცვლის. ჩვენი გუნდი ეძღვნება თქვენი უფლებების დაცვასა და ძლიერი დაცვის უზრუნველყოფას სისხლის სამართლის ბრალდებების სპექტრში.", text2: "ჩვენ ვმუშაობთ სისულელეების, დანაშაულებისა და სხვა საქმეებზე, რათა უზრუნველვყოთ საუკეთესო შესაძლო შედეგი.", quote: "ჩვენ ვიბრძვით თქვენი უფლებებისთვის და ვმუშაობთ დაუღალავად, რათა უზრუნველვყოთ საუკეთესო შესაძლო შედეგი თქვენი საქმისთვის." },
  { slug: "real-estate-law", title: "საუძრავი ქონების სამართალი", description: "ვმართავთ უძრავი ქონების ტრანზაქციებს, ლიზინგს, ზონირების საკითხებსა და უძრავი ქონების დავების მოგვარებას.", text1: "უძრავი ქონების ტრანზაქციები და დავები შეიძლება იყოს რთული და გამოწვევითი. ჩვენი გუნდი აქ არის ექსპერტული ხელმძღვანელობისა და მხარდაჭერისთვის, რათა უძრავი ქონების საკითხები მოხდეს ზრუნვით და ეფექტურად.", text2: "ჩვენ ვთავაზობთ უძრავი ქონების სამართლის მომსახურებების სპექტრს: ქონების ტრანზაქციებიდან ზონირების საკითხებამდე, რათა დაგეხმაროთ უძრავი ქონების მიზნების მიღწევაში.", quote: "ჩვენს გუნდს აქვს გამოცდილება და კომპეტენცია ყველა უძრავი ქონების სამართლის საჭიროების დასაკმაყოფილებლად." },
  { slug: "estate-planning-wills", title: "საკუთრების დაგეგმვა და ანდერძები", description: "დახმარება კომპენსაციის უზრუნველყოფაში ავარიების, სამედიცინო შეცდომებისა და სამუშაო ტრავმების შემთხვევაში.", text1: "საკუთრების დაგეგმვა გადამწყვეტი ნაბიჯია თქვენი მემკვიდრეობის დაცვისა და საყვარელი ადამიანების უზრუნველყოფისთვის. ჩვენი გუნდი ვთავაზობთ ყოვლისმომცველ მომსახურებას საკუთრების დაგეგმვაში: ანდერძები, ტრასტები და მემკვიდრეობა.", text2: "ჩვენ მჭიდროდ ვმუშაობთ თქვენთან პერსონალიზებული საკუთრების გეგმის შესაქმნელად, რომელიც შეესაბამება თქვენს უნიკალურ საჭიროებებსა და მიზნებს.", quote: "ჩვენ ვაწვდით ექსპერტულ მომსახურებას საკუთრების დაგეგმვაში, რათა დაგეხმაროთ თქვენი მემკვიდრეობის დაცვაში." },
  { slug: "immigration-law", title: "იმიგრაციის სამართალი", description: "ანდერძები, ტრასტები და მემკვიდრეობის მომსახურება თქვენი მემკვიდრეობისა და საყვარელი ადამიანების მომავლის დასაცავად.", text1: "იმიგრაციის სამართლის ნავიგაცია შეიძლება გამოწვევითი იყოს, მაგრამ ჩვენი გამოცდილი გუნდი აქ არის, რათა დაგეხმაროთ პროცესის ყოველ ეტაპზე. გჭირდებათ დახმარება ვიზებზე, საცხოვრებელზე, მოქალაქეობაზე თუ თავშესაფრის განაცხადებებზე — ჩვენ ეძღვნება საუკეთესო შესაძლო შედეგის მიღწევას თქვენთვის და თქვენი ოჯახისთვის.", text2: "ჩვენი პერსონალიზებული მიდგომა უზრუნველყოფს, რომ გვესმის თქვენი უნიკალური სიტუაცია და ვაწვდით მორგებულ სამართლებრივ გადაწყვეტილებებს.", quote: "იმიგრაციის სამართლის ნავიგაცია შეიძლება დამთრგუნველი იყოს, მაგრამ არ ხართ მარტო. ჩვენ აქ ვართ დასახმარებლად." },
];

const membersEn = [
  { id: 1, slug: "vladimer-gabrielashvili", title: "Vladimer Gabrielashvili", position: "Partner", description: "Vladimer, a partner at AG Legal Consulting since 2007, has held key legal and government roles, including at Georgian Railway and the National Security Council.", quote: "Strong legal foundations are the cornerstone of every successful business and lasting personal legacy.", text1: "Vladimer Gabrielashvili is a founding partner at AG Legal Consulting. He graduated from the Faculty of Law at Ivane Javakhishvili Tbilisi State University and has been practicing law since 2001. Over the course of his career, he has held senior legal positions at major Georgian institutions, including Georgian Railway and the National Security Council of Georgia.", text2: "Vladimer specializes in corporate and business law, mergers and acquisitions, government relations, and dispute resolution. He advises domestic and international clients on complex cross-border transactions and regulatory matters. He is a member of the Georgian Bar Association and is recognized as a leading practitioner in corporate law by major legal directories.", image: "/images/members/vladimer-gabrielashvili.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { id: 2, slug: "dimitri-aleksidze", title: "Dimitri Aleksidze", position: "Partner", description: "Dimitri Aleksidze, a partner at AG Legal Consulting, has held key legal and executive positions across leading Georgian enterprises and public institutions.", quote: "Effective legal counsel is not just about knowing the law — it is about understanding the business behind every decision.", text1: "Dimitri Aleksidze is a partner at AG Legal Consulting with over 15 years of legal practice across both the private and public sectors. He received his law degree from Tbilisi State University and completed advanced studies in European business law. Early in his career, Dimitri served as in-house counsel for several major Georgian corporations, gaining deep expertise in transactional and regulatory work.", text2: "At AG Legal Consulting, Dimitri focuses on mergers and acquisitions, corporate restructuring, contract law, and commercial dispute resolution. He represents clients in complex negotiations and court proceedings, providing practical, results-driven legal advice. Dimitri is a certified attorney and an active member of the Georgian Bar Association.", image: "/images/members/dimitri-aleksidze.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { id: 3, slug: "lika-galustashvili", title: "Lika Galustashvili", position: "Senior Associate", description: "Lika specializes in civil and administrative law, with additional expertise in corporate law, intellectual property, and contract law.", quote: "Choosing the right structure for your business is a critical decision that impacts everything from taxation to liability protection.", text1: "Lika Galustashvili graduated from the Faculty of Law at Ivane Javakhishvili Tbilisi State University, where she earned her LL.B. and LL.M. degrees in Private Law. She also completed part of her Master's studies at the University of La Coruña in Spain. Later, she pursued a Master's in European Studies at Ivane Javakhishvili Tbilisi State University, supported by a scholarship from the KONRAD ADENAUER Fund.", text2: "Lika began her career as a paralegal and gained valuable experience in both the private and public sectors, as well as with non-governmental organizations. Before joining AG Legal Consulting in 2020 as an associate, she worked at the National Bureau of Enforcement. At AG Legal Consulting, Lika specializes in civil and administrative law, with additional expertise in corporate law, intellectual property law, and contract law. She provides clients with comprehensive legal advice on corporate reorganization, restructuring, and employment matters. Lika is actively involved in M&A and real estate transactions, drafting and analyzing legal documents and representing clients in the courts of Georgia. She is a member of the Georgian Bar Association and speaks Georgian, English, Spanish, and Russian.", image: "/images/members/lika-galustashvili.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { id: 4, slug: "nikoloz-abutidze", title: "Nikoloz Abutidze", position: "Senior Associate", description: "Nikoloz Abutidze, a licensed insolvency practitioner and PhD candidate, specializes in insolvency, corporate, and real estate law.", quote: "Sound legal analysis and practical judgment are the pillars of every successful transaction and dispute resolution.", text1: "Nikoloz Abutidze holds a law degree from Ivane Javakhishvili Tbilisi State University and is currently a PhD candidate in civil law. He is a licensed insolvency practitioner and has completed specialized training in corporate governance and commercial arbitration. His academic background is complemented by broad practical experience in both advisory and litigation roles.", text2: "At AG Legal Consulting, Nikoloz advises clients on insolvency proceedings, corporate restructuring, real estate transactions, and commercial disputes. He has represented clients before Georgian courts at all levels and has been involved in several landmark insolvency cases. Nikoloz is a member of the Georgian Bar Association and the Chamber of Insolvency Practitioners of Georgia.", image: "/images/members/nikoloz-abutidze.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { id: 5, slug: "aleksandre-khasia", title: "Aleksandre Khasia", position: "Financial Manager", description: "Aleksandre Khasia, financial manager at AG Legal Consulting since 2008, oversees all financial operations, reporting, and corporate planning for the firm.", quote: "Financial clarity and disciplined management are essential to building a firm that clients and partners can always rely on.", text1: "Aleksandre Khasia holds a degree in Economics and Finance from Tbilisi State University and has completed additional professional development courses in corporate financial management and accounting. He joined AG Legal Consulting in 2008 and has since played a central role in shaping the financial infrastructure of the firm.", text2: "Aleksandre oversees all aspects of the firm's financial operations, including budgeting, financial reporting, payroll management, and tax compliance. He works closely with the partners to ensure fiscal soundness across all client-facing and internal operations. His expertise extends to advising clients on financial structuring in the context of corporate transactions and business formation.", image: "/images/members/aleksandre-khasia.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { id: 6, slug: "eka-arsenidze", title: "Eka Arsenidze", position: "Senior Administrative Manager", description: "Eka Arsenidze, Senior Administrative Manager at AG Legal Consulting since 2008, leads the firm's administrative operations with precision and dedication.", quote: "A well-run firm starts from the inside — the strength of our team is built on trust, discipline, and genuine care for every client.", text1: "Eka Arsenidze has been a cornerstone of AG Legal Consulting's administrative operations since joining the firm in 2008. She holds a degree in Business Administration and has accumulated extensive experience in law firm management, client relations, and organizational development. Her leadership has been instrumental in building the firm's internal culture and operational standards.", text2: "As Senior Administrative Manager, Eka coordinates the firm's day-to-day operations, oversees client intake and communications, manages the administrative team, and ensures that all internal processes run smoothly and efficiently. She works closely with attorneys and partners to support the delivery of high-quality legal services. Eka is known for her exceptional organizational skills and commitment to client service excellence.", image: "/images/members/eka-arsenidze.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
  { id: 7, slug: "kakhaber-kipiani", title: "Kakhaber Kipiani", position: "Of Counsel", description: "Kakha, counsel at AG Legal Consulting since 2024, was a senior lawyer and partner at leading Georgian law firms for over two decades.", quote: "Decades of practice have taught me that every legal challenge, no matter how complex, has a solution rooted in careful analysis and sound judgment.", text1: "Kakhaber Kipiani brings over 25 years of legal experience to AG Legal Consulting, where he serves as Of Counsel. He graduated from the Faculty of Law at Ivane Javakhishvili Tbilisi State University and subsequently earned advanced qualifications in commercial and constitutional law. Over his career, he has been a partner at two of Georgia's most respected law firms and has appeared before the Constitutional Court of Georgia on multiple occasions.", text2: "Kakhaber specializes in constitutional law, commercial litigation, arbitration, and regulatory affairs. He advises the firm and its clients on high-stakes disputes and complex legal strategy. His extensive courtroom experience and depth of legal knowledge make him a trusted advisor across a wide range of practice areas. Kakhaber is a member of the Georgian Bar Association and a recognized authority in Georgian commercial law.", image: "/images/members/kakhaber-kipiani.jpg", socials: [{ platform: "instagram", link: "https://www.instagram.com/" }, { platform: "facebook", link: "https://www.facebook.com/" }] },
];

const membersKa: Record<string, { title: string; position: string; description: string; quote: string; text1: string; text2: string }> = {
  "vladimer-gabrielashvili": { title: "ვლადიმერ გაბრიელაშვილი", position: "პარტნიორი", description: "ვლადიმერი AG ლეგალური კონსალტინგის პარტნიორია 2007 წლიდან. იგი ეკავა მნიშვნელოვანი სამართლებრივი და სახელმწიფო თანამდებობები საქართველოს რკინიგზაში და ეროვნულ უსაფრთხოების საბჭოში.", quote: "ძლიერი სამართლებრივი საფუძვლები არის ყოველი წარმატებული ბიზნესისა და მტკიცე პირადი მემკვიდრეობის საფუძველი.", text1: "ვლადიმერ გაბრიელაშვილი AG ლეგალური კონსალტინგის დამფუძნებელი პარტნიორია. დაამთავრა ივანე ჯავახიშვილის სახელობის თბილისის სახელმწიფო უნივერსიტეტის სამართლის ფაკულტეტი და სამართალს იკავებს 2001 წლიდან.", text2: "ვლადიმერი სპეციალიზირდება კორპორატიულ და საბიზნესო სამართალში, შერწყმებასა და შესყიდვებში, სახელმწიფო ურთიერთობებში და დავების მოგვარებაში. ის საქართველოს ადვოკატთა ასოციაციის წევრია." },
  "dimitri-aleksidze": { title: "დიმიტრი ალექსიძე", position: "პარტნიორი", description: "დიმიტრი ალექსიძე, AG ლეგალური კონსალტინგის პარტნიორი, ეკავა მნიშვნელოვანი სამართლებრივი და აღმასრულებელი თანამდებობები საქართველოს წამყვან საწარმოებსა და საჯარო ინსტიტუტებში.", quote: "ეფექტური სამართლებრივი რჩევა არ არის მხოლოდ სამართლის ცოდნა — ეს არის ბიზნესის გაგება ყოველი გადაწყვეტილების უკან.", text1: "დიმიტრი ალექსიძე AG ლეგალური კონსალტინგის პარტნიორია 15 წელზე მეტი სამართლებრივი პრაქტიკით როგორც კერძო, ისე საჯარო სექტორში.", text2: "AG ლეგალური კონსალტინგში დიმიტრი ფოკუსირდება შერწყმებასა და შესყიდვებზე, კორპორატიულ რესტრუქტურიზაციაზე, საკონტრაქტო სამართალზე და კომერციულ დავების მოგვარებაზე." },
  "lika-galustashvili": { title: "ლიკა გალუსტაშვილი", position: "უფროსი ასოციატი", description: "ლიკა სპეციალიზირდება სამოქალაქო და ადმინისტრაციულ სამართალში, დამატებითი ექსპერტიზით კორპორატიულ სამართალში, ინტელექტუალურ საკუთრებაში და საკონტრაქტო სამართალში.", quote: "თქვენი ბიზნესისთვის სწორი სტრუქტურის არჩევა გადამწყვეტი გადაწყვეტილებაა, რომელიც მოქმედებს ყველაფერზე: დაბეგვრებიდან პასუხისმგებლობის დაცვამდე.", text1: "ლიკა გალუსტაშვილი დაამთავრა ივანე ჯავახიშვილის სახელობის თბილისის სახელმწიფო უნივერსიტეტის სამართლის ფაკულტეტი, სადაც მიიღო ბაკალავრისა და მაგისტრის ხარისხი კერძო სამართალში.", text2: "AG ლეგალური კონსალტინგში ლიკა სპეციალიზირდება სამოქალაქო და ადმინისტრაციულ სამართალში. ის საქართველოს ადვოკატთა ასოციაციის წევრია და ლაპარაკობს ქართულ, ინგლისურ, ესპანურ და რუსულ ენებზე." },
  "nikoloz-abutidze": { title: "ნიკოლოზ აბუტიძე", position: "უფროსი ასოციატი", description: "ნიკოლოზ აბუტიძე, ლიცენზირებული გაკოტრების პრაქტიკოსი და სადოქტორო კანდიდატი, სპეციალიზირდება გაკოტრებაში, კორპორატიულ და უძრავი ქონების სამართალში.", quote: "საფუძვლიანი სამართლებრივი ანალიზი და პრაქტიკული განაჩენი არის ყოველი წარმატებული ტრანზაქციისა და დავის მოგვარების საყრდენი.", text1: "ნიკოლოზ აბუტიძეს აქვს სამართლის ხარისხი ივანე ჯავახიშვილის სახელობის თბილისის სახელმწიფო უნივერსიტეტიდან და ამჟამად სადოქტორო კანდიდატია სამოქალაქო სამართალში.", text2: "AG ლეგალური კონსალტინგში ნიკოლოზი აკონსულტირებს კლიენტებს გაკოტრების პროცედურებზე, კორპორატიულ რესტრუქტურიზაციაზე, უძრავი ქონების ტრანზაქციებზე და კომერციულ დავებზე." },
  "aleksandre-khasia": { title: "ალექსანდრე ხასია", position: "ფინანსური მენეჯერი", description: "ალექსანდრე ხასია, AG ლეგალური კონსალტინგის ფინანსური მენეჯერი 2008 წლიდან, ხელმძღვანელობს ფირმის ყველა ფინანსურ ოპერაციას, ანგარიშგებასა და კორპორატიულ დაგეგმვას.", quote: "ფინანსური სიცხადე და დისციპლინირებული მართვა აუცილებელია ფირმის ასაშენებლად, რომელზეც კლიენტები და პარტნიორები ყოველთვის შეუძლიათ დაეყრდნონ.", text1: "ალექსანდრე ხასიას აქვს ეკონომიკისა და ფინანსების ხარისხი თბილისის სახელმწიფო უნივერსიტეტიდან. იგი შეუერთდა AG ლეგალურ კონსალტინგს 2008 წელს.", text2: "ალექსანდრე ხელმძღვანელობს ფირმის ფინანსურ ოპერაციების ყველა ასპექტს: ბიუჯეტირება, ფინანსური ანგარიშგება, სახელფასო მართვა და საგადასახადო შესაბამისობა." },
  "eka-arsenidze": { title: "ეკა არსენიძე", position: "უფროსი ადმინისტრაციული მენეჯერი", description: "ეკა არსენიძე, AG ლეგალური კონსალტინგის უფროსი ადმინისტრაციული მენეჯერი 2008 წლიდან, ხელმძღვანელობს ფირმის ადმინისტრაციულ ოპერაციებს სიზუსტით და ერთგულებით.", quote: "კარგად მართული ფირმა იწყება შიგნიდან — ჩვენი გუნდის ძალა აგებულია ნდობაზე, დისციპლინაზე და ნამდვილ ზრუნვაზე ყოველი კლიენტის მიმართ.", text1: "ეკა არსენიძე AG ლეგალური კონსალტინგის ადმინისტრაციული ოპერაციების ძირითადი ფიგურაა 2008 წლიდან, როდესაც შეუერთდა ფირმას.", text2: "უფროს ადმინისტრაციულ მენეჯერად ეკა კოორდინირებს ფირმის ყოველდღიურ ოპერაციებს, ხელმძღვანელობს კლიენტების მიღებასა და კომუნიკაციებს." },
  "kakhaber-kipiani": { title: "კახაბერ ყიფიანი", position: "საკონსულტაციო ადვოკატი", description: "კახა, AG ლეგალური კონსალტინგის საკონსულტაციო ადვოკატი 2024 წლიდან, იყო უფროსი ადვოკატი და პარტნიორი საქართველოს წამყვან სამართლებრივ ფირმებში ორი ათეული წლის განმავლობაში.", quote: "ათწლეულების პრაქტიკამ მასწავლა, რომ ყოველ სამართლებრივ გამოწვევას, რაც არ უნდა იყოს რთული, აქვს გადაწყვეტილება, რომელიც ეფუძნება ფრთხილ ანალიზს და საფუძვლიან განაჩენს.", text1: "კახაბერ ყიფიანი მოაქვს 25 წელზე მეტი სამართლებრივი გამოცდილება AG ლეგალურ კონსალტინგში, სადაც მსახურობს საკონსულტაციო ადვოკატად.", text2: "კახაბერი სპეციალიზირდება კონსტიტუციურ სამართალში, კომერციულ ლიტიგაციაში, არბიტრაჟში და რეგულატორულ საკითხებში." },
};

const faqsEn = [
  { question: "What types of cases does your firm handle?", answer: "We specialize in a wide range of legal areas, including business law, family law, criminal defense, real estate, and personal injury. Explore our services to find the right solution for your legal needs." },
  { question: "How much do your services cost?", answer: "The cost of our services varies depending on the complexity of your case. We offer a free initial consultation to discuss your legal needs and provide you with a quote. Contact us to schedule an appointment." },
  { question: "How do I schedule a consultation?", answer: "To schedule a consultation, simply fill out our online contact form or give us a call. We will get back to you as soon as possible to discuss your legal needs and set up an appointment." },
  { question: "What should I bring to my initial consultation?", answer: "For your initial consultation, please bring any relevant documents related to your case, including contracts, court orders, and correspondence. This will help us better understand your situation and provide you with the best possible advice." },
  { question: "How long does it take to resolve a case?", answer: "The time it takes to resolve your case will depend on a variety of factors, including the complexity of the legal issues involved and the willingness of the parties to reach a settlement. We will work diligently to resolve your case as quickly and efficiently as possible." },
  { question: "Can I change attorneys if I'm not satisfied?", answer: "If you are not satisfied with your current attorney, you have the right to change representation at any time. We will work with you to ensure a smooth transition and provide you with the legal support you need." },
];

const faqsKa = [
  { question: "რა სახის საქმეებს მართავს თქვენი ფირმა?", answer: "ჩვენ სპეციალიზირდებით სამართლის ფართო სპექტრში: ბიზნეს სამართალი, ოჯახური სამართალი, სისხლის სამართლის დაცვა, უძრავი ქონება და პირადი ტრავმა. გაეცანით ჩვენს მომსახურებებს, რათა იპოვოთ სწორი გადაწყვეტილება თქვენი სამართლებრივი საჭიროებებისთვის." },
  { question: "რა ღირს თქვენი მომსახურება?", answer: "მომსახურების ღირებულება დამოკიდებულია თქვენი საქმის სირთულეზე. ჩვენ ვთავაზობთ უფასო საწყის კონსულტაციას თქვენი სამართლებრივი საჭიროებების გასაუბრებისთვის და ფასების შესახებ ინფორმაციის მისაღებად. დაგვიკავშირდით ჯავშნის გასაკეთებლად." },
  { question: "როგორ დავაჯავშნო კონსულტაცია?", answer: "კონსულტაციის დასაჯავშნად შეავსეთ ჩვენი ონლაინ საკონტაქტო ფორმა ან დაგვირეკეთ. ჩვენ მაქსიმალურად სწრაფად დაგიბრუნდებით, რათა განვიხილოთ თქვენი სამართლებრივი საჭიროებები და დავაჯავშნოთ შეხვედრა." },
  { question: "რა უნდა წამოვიღო საწყის კონსულტაციაზე?", answer: "საწყისი კონსულტაციისთვის გთხოვთ წამოიღოთ ყველა შესაბამისი დოკუმენტი თქვენი საქმის შესახებ: კონტრაქტები, სასამართლო გადაწყვეტილებები და მიმოწერა. ეს დაგვეხმარება უკეთ გავიგოთ თქვენი სიტუაცია და მივაწოდოთ საუკეთესო შესაძლო რჩევა." },
  { question: "რამდენი დრო სჭირდება საქმის მოგვარებას?", answer: "საქმის მოგვარების დრო დამოკიდებულია მრავალ ფაქტორზე: ჩართული სამართლებრივი საკითხების სირთულეზე და მხარეების მზადყოფნაზე შეთანხმებაზე. ჩვენ ვიმუშავებთ გულმოდგინედ, რათა თქვენი საქმე მოგვარდეს რაც შეიძლება სწრაფად და ეფექტურად." },
  { question: "შემიძლია ადვოკატის შეცვლა, თუ არ ვარ კმაყოფილი?", answer: "თუ არ ხართ კმაყოფილი თქვენი მიმდინარე ადვოკატით, გაქვთ უფლება ნებისმიერ დროს შეცვალოთ წარმომადგენლობა. ჩვენ ვიმუშავებთ თქვენთან ერთად, რათა უზრუნველვყოთ გლუვი გადასვლა და მივაწოდოთ საჭირო სამართლებრივი მხარდაჭერა." },
];

const testimonialsData = [
  { quoteEn: "I've worked with several law firms in the past, but none compare to the level of care and dedication I received here. I felt supported every step of the way.", quoteKa: "წარსულში მუშაობდი რამდენიმე სამართლებრივ ფირმასთან, მაგრამ არცერთი არ შეიძლება შევადარო იმ ზრუნვასა და ერთგულებას, რაც აქ მივიღე. ყოველ ნაბიჯზე ვგრძნობდი მხარდაჭერას.", authorName: "Rose Williams", authorPosition: "Williams Legal Advisors", authorImage: "/images/testimonials/rose-williams.jpg", row: "top" },
  { quoteEn: "I couldn't have asked for better representation. Their expertise and strategic approach resulted in a favorable outcome for my case. Highly recommend!", quoteKa: "უკეთესი წარმომადგენლობის ვერ მოვითხოვებდი. მათმა ექსპერტიზამ და სტრატეგიულმა მიდგომამ ხელსაყრელი შედეგი მოუტანა ჩემს საქმეს. ძალიან გირჩევთ!", authorName: "David Smith", authorPosition: "Smith Enterprises", authorImage: "/images/testimonials/david-smith.jpg", row: "top" },
  { quoteEn: "From start to finish, the service was exceptional. They made a stressful situation much easier to handle, and their dedication really showed in the results.", quoteKa: "დასაწყისიდან დასასრულამდე მომსახურება განსაკუთრებული იყო. მათ სტრესული სიტუაცია გაცილებით ადვილი გახადეს და მათი ერთგულება ნამდვილად გამოჩნდა შედეგებში.", authorName: "Michael Roberts", authorPosition: "Roberts Group", authorImage: "/images/testimonials/michael-roberts.jpg", row: "top" },
  { quoteEn: "This team went above and beyond. Their professionalism and attention to detail were unmatched. I'm extremely grateful for their support.", quoteKa: "ამ გუნდმა ზღვარს გადააჭარბა. მათი პროფესიონალიზმი და დეტალებზე ყურადღება შეუდარებელი იყო. ძალიან მადლობელი ვარ მათი მხარდაჭერისთვის.", authorName: "Sophia Turner", authorPosition: "Turner Consulting", authorImage: "/images/testimonials/sophia-turner.jpg", row: "bottom" },
  { quoteEn: "Working with this firm was an absolute pleasure. They handled my case with the utmost care and ensured a positive outcome. I'm highly impressed.", quoteKa: "ამ ფირმასთან მუშაობა ნამდვილი სიამოვნება იყო. ჩემს საქმეს უკიდურესი ზრუნვით მართავდნენ და დადებითი შედეგი უზრუნველყვეს. ძალიან შთაბეჭდილებული ვარ.", authorName: "James Mitchell", authorPosition: "Mitchell & Co.", authorImage: "/images/testimonials/james-mitchell.jpg", row: "bottom" },
  { quoteEn: "Exceptional service from start to finish. The team's expertise and personalized approach made all the difference in my case. Highly recommend them.", quoteKa: "განსაკუთრებული მომსახურება დასაწყისიდან დასასრულამდე. გუნდის ექსპერტიზამ და პერსონალიზებულმა მიდგომამ ყველაფერი შეცვალა ჩემს საქმეში. ძალიან გირჩევთ.", authorName: "Emily Davis", authorPosition: "Davis Law Group", authorImage: "/images/testimonials/emily-davis.jpg", row: "bottom" },
];

// ─── Seed function ───────────────────────────────────────────────────────────
async function seed() {
  const now = new Date().toISOString();
  console.log("Seeding database...\n");

  // --- Articles from markdown files ---
  const articlesDir = path.join(process.cwd(), "articles");
  const articleFiles = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  console.log(`Found ${articleFiles.length} article files`);

  for (let i = 0; i < articleFiles.length; i++) {
    const fileName = articleFiles[i];
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(articlesDir, fileName);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);

    db.insert(schema.articles).values({
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
      tags: JSON.stringify(data.tags || []),
      type: data.type || null,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    }).run();

    console.log(`  + article: ${slug}`);
  }

  // --- Services ---
  console.log(`\nSeeding ${servicesEn.length} services`);
  for (let i = 0; i < servicesEn.length; i++) {
    const en = servicesEn[i];
    const ka = servicesKa[i];

    db.insert(schema.services).values({
      slug: en.slug,
      titleEn: en.title,
      titleKa: ka.title,
      descriptionEn: en.description,
      descriptionKa: ka.description,
      text1En: en.text1,
      text1Ka: ka.text1,
      text2En: en.text2,
      text2Ka: ka.text2,
      quoteEn: en.quote,
      quoteKa: ka.quote,
      image: en.image,
      thumbnailImage: en.thumbnail_image,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    }).run();

    console.log(`  + service: ${en.slug}`);
  }

  // --- Team Members ---
  console.log(`\nSeeding ${membersEn.length} team members`);
  for (let i = 0; i < membersEn.length; i++) {
    const en = membersEn[i];
    const ka = membersKa[en.slug];

    const result = db.insert(schema.teamMembers).values({
      slug: en.slug,
      titleEn: en.title,
      titleKa: ka?.title || null,
      positionEn: en.position,
      positionKa: ka?.position || null,
      descriptionEn: en.description,
      descriptionKa: ka?.description || null,
      quoteEn: en.quote,
      quoteKa: ka?.quote || null,
      text1En: en.text1,
      text1Ka: ka?.text1 || null,
      text2En: en.text2,
      text2Ka: ka?.text2 || null,
      image: en.image,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    }).run();

    const memberId = Number(result.lastInsertRowid);

    for (const social of en.socials) {
      db.insert(schema.teamMemberSocials).values({
        teamMemberId: memberId,
        platform: social.platform,
        link: social.link,
      }).run();
    }

    console.log(`  + member: ${en.slug} (${en.socials.length} socials)`);
  }

  // --- FAQs ---
  console.log(`\nSeeding ${faqsEn.length} FAQs`);
  for (let i = 0; i < faqsEn.length; i++) {
    db.insert(schema.faqs).values({
      questionEn: faqsEn[i].question,
      questionKa: faqsKa[i]?.question || null,
      answerEn: faqsEn[i].answer,
      answerKa: faqsKa[i]?.answer || null,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    }).run();

    console.log(`  + faq: ${faqsEn[i].question.substring(0, 40)}...`);
  }

  // --- Testimonials ---
  console.log(`\nSeeding ${testimonialsData.length} testimonials`);
  for (let i = 0; i < testimonialsData.length; i++) {
    const t = testimonialsData[i];
    db.insert(schema.testimonials).values({
      quoteEn: t.quoteEn,
      quoteKa: t.quoteKa,
      authorName: t.authorName,
      authorPosition: t.authorPosition,
      authorImage: t.authorImage,
      row: t.row,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    }).run();

    console.log(`  + testimonial: ${t.authorName}`);
  }

  // --- Site Settings (UI strings) ---
  console.log("\nSeeding site settings (UI strings)");
  const uiSettings: { key: string; valueEn: string; valueKa: string; group: string }[] = [
    { key: "hero.brand", valueEn: "AG Legal Consulting", valueKa: "AG ლეგალური კონსალტინგი", group: "hero" },
    { key: "hero.title", valueEn: "Your Trusted Legal\nAdvisors in Georgia", valueKa: "თქვენი სანდო სამართლებრივი\nმრჩევლები საქართველოში", group: "hero" },
    { key: "hero.cta", valueEn: "CONSULT WITH US", valueKa: "დაგვიკავშირდით", group: "hero" },
    { key: "hero.description", valueEn: "Join our mission to create a better tomorrow through legal and social support.", valueKa: "შემოუერთდით ჩვენს მისიას — უკეთესი ხვალის შექმნა სამართლებრივი და სოციალური მხარდაჭერის მეშვეობით.", group: "hero" },
    { key: "about.title", valueEn: "Who we are", valueKa: "ვინ ვართ ჩვენ", group: "about" },
    { key: "about.description", valueEn: "AG Legal Consulting has been providing expert legal counsel to businesses and individuals since 2007. With years of experience and a strong reputation, our team is dedicated to being your trusted advisor, offering clear and effective guidance through any legal challenges", valueKa: "AG ლეგალური კონსალტინგი 2007 წლიდან უზრუნველყოფს ექსპერტულ სამართლებრივ რჩევას ბიზნესებისთვის და ინდივიდუალებს. წლების გამოცდილებით და ძლიერი რეპუტაციით, ჩვენი გუნდი ეძღვნება თქვენი სანდო მრჩევლის ყოფნას, გთავაზობთ ცხად და ეფექტურ ხელმძღვანელობას ნებისმიერ სამართლებრივ გამოწვევაში.", group: "about" },
    { key: "services.title", valueEn: "Our legal services", valueKa: "ჩვენი სამართლებრივი მომსახურება", group: "services" },
    { key: "services.description", valueEn: "At AG Legal Consulting, we believe that great legal advice is built on trust, transparency, and a strong dedication to delivering exceptional outcomes.", valueKa: "AG ლეგალური კონსალტინგში გვჯერა, რომ დიდი სამართლებრივი რჩევა აგებულია ნდობაზე, გამჭვირვალობაზე და განსაკუთრებული შედეგების მიწოდების ძლიერ ერთგულებაზე.", group: "services" },
    { key: "benefits.title", valueEn: "Why work with us?", valueKa: "რატომ ვმუშაობთ ჩვენთან?", group: "benefits" },
    { key: "process.title", valueEn: "Our working process", valueKa: "ჩვენი სამუშაო პროცესი", group: "process" },
    { key: "process.description", valueEn: "We follow a streamlined process to ensure your legal matters are handled efficiently and effectively, keeping you informed every step of the way.", valueKa: "ჩვენ მივყვებით ოპტიმიზებულ პროცესს, რათა უზრუნველვყოთ თქვენი სამართლებრივი საკითხების ეფექტური და ეფექტიანი მართვა, ინფორმირებული იყავით ყოველ ნაბიჯზე.", group: "process" },
    { key: "team.title", valueEn: "Meet our team", valueKa: "გაიცანით ჩვენი გუნდი", group: "team" },
    { key: "team.description", valueEn: "At AG Legal Consulting, our people are our most valuable asset. Our team consists of highly skilled associates and professionals with diverse expertise and backgrounds.", valueKa: "AG ლეგალური კონსალტინგში ჩვენი ადამიანები ჩვენი ყველაზე ძვირფასი აქტივია. ჩვენი გუნდი შედგება მაღალკვალიფიციური ასოციატებისა და პროფესიონალებისგან მრავალფეროვანი ექსპერტიზით და ფონით.", group: "team" },
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
  ];

  for (const setting of uiSettings) {
    db.insert(schema.siteSettings).values({
      key: setting.key,
      valueEn: setting.valueEn,
      valueKa: setting.valueKa,
      group: setting.group,
      updatedAt: now,
    }).run();
  }
  console.log(`  + ${uiSettings.length} UI settings`);

  console.log("\nSeed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
