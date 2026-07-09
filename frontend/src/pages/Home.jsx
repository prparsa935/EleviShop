import { motion } from "framer-motion";
import MainLayout from "../components/mainlayout/MainLayout";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";
import {
  staggerContainer,
  staggerItem,
  fadeUp,
} from "../components/pagetransition/PageTransition";

const features = [
  {
    icon: "fa-solid fa-truck-fast",
    title: "ارسال سریع",
    desc: "تحویل سریع به سراسر کشور در کمترین زمان",
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "ضمانت اصالت",
    desc: "تمامی محصولات با گارانتی معتبر و کیفیت تضمین‌شده",
  },
  {
    icon: "fa-solid fa-rotate-left",
    title: "۷ روز بازگشت",
    desc: "امکان مرجوعی کالا بدون پرسش در ۷ روز اول",
  },
  {
    icon: "fa-solid fa-headset",
    title: "پشتیبانی ۲۴/۷",
    desc: "تیم پشتیبانی ما همیشه پاسخگوی شماست",
  },
];

const Home = () => {
  return (
    <div className="home-page app-bg min-h-screen">
      <NavBar />
      <MobileFooter />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-6 lg:pt-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="glass-strong mx-auto max-w-screen-2xl rounded-3xl px-6 py-12 lg:py-20 lg:px-16 relative overflow-hidden"
        >
          {/* decorative gold glow */}
          <div
            className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "var(--color-gold-glow)" }}
          />
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="gold-text text-sm font-semibold tracking-wide">
                فروشگاه آنلاین لوازم آشپزخانه
              </span>
              <h1 className="mt-3 text-4xl lg:text-6xl font-bold text-[var(--color-white)] leading-tight">
                آشپزخانه‌ای
                <br />
                <span className="gold-text">مدرن</span> و دلنشین
              </h1>
              <p className="mt-4 max-w-md text-[var(--sub-text-color)] leading-relaxed">
                بهترین سرویس‌ها و ظروف آشپزخانه با کیفیت‌ترین مواد و طراحی روز
                دنیا. از تک‌ظروف تا سرویس‌های کامل، همه در یک جا.
              </p>
              <div className="mt-7 flex gap-x-3">
                <a
                  href="/search"
                  className="gold-bg text-white px-7 py-3 rounded-xl font-semibold hover:brightness-105 transition cursor-pointer shadow-lg"
                  style={{ boxShadow: "var(--glass-shadow-hover)" }}
                >
                  خرید را شروع کنید
                </a>
                <a
                  href="/search?enableOff=true"
                  className="glass px-7 py-3 rounded-xl font-semibold text-[var(--color-white)] hover:brightness-100 transition cursor-pointer"
                >
                  تخفیف‌های ویژه
                </a>
              </div>
            </div>
            <motion.div
              className="hidden lg:flex justify-center"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="glass rounded-3xl p-6 w-80 h-80 flex items-center justify-center">
                <i className="fa-solid fa-kitchen-set text-9xl gold-text"></i>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 mt-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-screen-2xl grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="glass glass-hover rounded-2xl p-5 flex flex-col items-center text-center"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ background: "var(--color-gold-light)" }}
              >
                <i className={`${f.icon} gold-text text-xl`}></i>
              </div>
              <h3 className="text-[var(--color-white)] font-semibold text-sm">
                {f.title}
              </h3>
              <p className="text-[var(--sub-text-color)] text-xs mt-1 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Existing sliders (offers, products) */}
      <section className="mt-10 pb-24">
        <MainLayout />
      </section>
    </div>
  );
};
export default Home;
