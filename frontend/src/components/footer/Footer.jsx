import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { staggerContainer, staggerItem, fadeUp } from "../pagetransition/PageTransition";

const footerLinks = [
  {
    title: "خرید",
    links: [
      { label: "همه محصولات", path: "/search" },
      { label: "تخفیف‌ها", path: "/search?enableOff=true" },
      { label: "پرفروش‌ترین‌ها", path: "/search" },
      { label: "سبد خرید", path: "/cart" },
    ],
  },
  {
    title: "حساب کاربری",
    links: [
      { label: "ورود / ثبت‌نام", path: "/login" },
      { label: "پروفایل", path: "/profile" },
      { label: "سفارش‌های من", path: "/profile/orders" },
    ],
  },
  {
    title: "پشتیبانی",
    links: [
      { label: "شرایط بازگشت کالا", path: "/search" },
      { label: "گارانتی و اصالت", path: "/search" },
      { label: "تماس با ما", path: "/search" },
      { label: "سؤالات متداول", path: "/search" },
    ],
  },
];

const socials = [
  { icon: "fa-brands fa-instagram", label: "اینستاگرام" },
  { icon: "fa-brands fa-telegram", label: "تلگرام" },
  { icon: "fa-brands fa-whatsapp", label: "واتساپ" },
  { icon: "fa-brands fa-x-twitter", label: "ایکس" },
];

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="hidden lg:block px-4 mt-16 pb-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="glass-strong mx-auto max-w-screen-2xl rounded-3xl overflow-hidden relative"
      >
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--color-gold-glow)" }}
        />

        <div className="relative z-10 grid grid-cols-12 gap-8 p-10">
          <div className="col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-solid fa-kitchen-set text-2xl gold-text"></i>
              <span className="text-xl font-bold text-[var(--color-white)]">
                EleVi Shop
              </span>
            </div>
            <p className="text-[var(--sub-text-color)] text-sm leading-relaxed max-w-xs">
              فروشگاه آنلاین لوازم آشپزخانه با کیفیت‌ترین محصولات و طراحی روز
              دنیا. تحویل سریع به سراسر کشور با ضمانت اصالت.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  whileHover={{ y: -3 }}
                  className="glass w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors"
                >
                  <i className={`${s.icon} text-lg`}></i>
                </motion.a>
              ))}
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="col-span-6 grid grid-cols-3 gap-6"
          >
            {footerLinks.map((section) => (
              <motion.div key={section.title} variants={staggerItem}>
                <h4 className="text-[var(--color-white)] font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full gold-bg"></span>
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-[var(--sub-text-color)] text-xs hover:text-[var(--color-gold)] transition-colors cursor-pointer"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <div className="col-span-2 flex flex-col items-center justify-center">
            <div className="glass rounded-2xl p-5 w-full text-center">
              <i className="fa-solid fa-headset text-3xl gold-text mb-2"></i>
              <p className="text-[var(--color-white)] text-sm font-semibold">
                پشتیبانی ۲۴/۷
              </p>
              <p className="text-[var(--sub-text-color)] text-xs mt-1">
                همیشه پاسخگوی شما هستیم
              </p>
              <a
                href="tel:02100000000"
                className="gold-text text-sm font-bold mt-2 block"
              >
                ۰۲۱-۰۰۰۰۰۰۰۰
              </a>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-[var(--glass-border)] px-10 py-5 flex items-center justify-between">
          <p className="text-[var(--sub-text-color)] text-xs">
            © {year} EleVi Shop — تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-[var(--color-gold)] text-sm"></i>
            <span className="text-[var(--sub-text-color)] text-xs">
              پرداخت امن و رمزنگاری‌شده
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
