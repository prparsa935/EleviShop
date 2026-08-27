import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findMovementHistory } from "../../api/stock";
import {
  staggerContainer,
  staggerItem,
} from "../pagetransition/PageTransition";
import Loading from "../icons/Loading";

const faNum = (n) => Number(n ?? 0).toLocaleString("fa-IR");

const movementTypeMeta = {
  SALE: {
    label: "فروش",
    css: "bg-bf-lighter-red text-bf-red",
    icon: "fa-solid fa-cart-shopping",
  },
  RETURN: {
    label: "مرجوعی",
    css: "bg-bf-lighter-sky text-bf-sky",
    icon: "fa-solid fa-rotate-left",
  },
  MANUAL_ADJUSTMENT: {
    label: "اصلاح دستی",
    css: "bg-[var(--color-gold-light)] gold-text",
    icon: "fa-solid fa-sliders",
  },
  RESTOCK: {
    label: "شارژ موجودی",
    css: "bg-bf-lighter-green text-bf-green",
    icon: "fa-solid fa-boxes-stacked",
  },
  RESERVATION: {
    label: "رزرو",
    css: "bg-bf-lighter-orange text-bf-orange",
    icon: "fa-solid fa-lock",
  },
  RESERVATION_RELEASE: {
    label: "آزادسازی رزرو",
    css: "bg-bf-lighter-orange text-bf-orange",
    icon: "fa-solid fa-lock-open",
  },
};

const StockHistoryModal = ({ target, onClose, setToastList }) => {
  const [loading, setLoading] = useState(false);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    if (target) {
      document.body.classList.add("overflow-hidden");
      setMovements([]);
      setLoading(true);
      findMovementHistory(target.id, setMovements, setToastList, setLoading);
      return () => document.body.classList.remove("overflow-hidden");
    }
  }, [target, setToastList]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, onClose]);

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed top-0 w-100 h-100vh flex justify-center items-center bg-[var(--color-lightblack)] z-40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="glass-strong rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 flex flex-col gap-y-5"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-[var(--color-white)]">
                  تاریخچه موجودی
                </h3>
                <span className="text-sm sub-txt-color">
                  {target?.productName ||
                    "شناسه موجودی " + faNum(target?.id)}
                </span>
              </div>
              <i
                onClick={onClose}
                className="fa fa-times cursor-pointer text-[var(--sub-text-color)]"
                aria-hidden="true"
              ></i>
            </div>

            {loading ? (
              <div className="flex justify-center w-full py-10">
                <Loading className="w-10 h-10"></Loading>
              </div>
            ) : movements?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="py-10 flex flex-col items-center gap-y-3 text-center"
              >
                <i className="fa-solid fa-scroll text-3xl sub-txt-color"></i>
                <span className="font-semibold text-[var(--color-white)]">
                  هنوز تغییری برای این کالا ثبت نشده است
                </span>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex flex-col"
              >
                {movements?.map((m) => {
                  const meta = movementTypeMeta[m?.type] || {
                    label: m?.type,
                    css: "bg-[var(--color-gray353030)] sub-txt-color",
                    icon: "fa-solid fa-circle-question",
                  };
                  const isIncrease = m?.quantityChange >= 0;
                  return (
                    <motion.div
                      key={m?.id}
                      variants={staggerItem}
                      className="relative pr-6 pb-6 border-r border-[var(--glass-border-strong)] last:border-transparent last:pb-0"
                    >
                      <span className="absolute top-1 right-[-4.5px] w-2 h-2 rounded-full bg-[var(--color-gold)]"></span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span
                          className={
                            "text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-x-1 " +
                            meta.css
                          }
                        >
                          <i className={meta.icon}></i>
                          {meta.label}
                        </span>
                        <span
                          className={
                            "font-bold " +
                            (isIncrease ? "text-bf-green" : "text-bf-red")
                          }
                        >
                          {isIncrease ? "+" : ""}
                          {faNum(m?.quantityChange)}
                        </span>
                        <span className="text-sm sub-txt-color">
                          {"موجودی بعد از تغییر: " + faNum(m?.quantityAfter)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-y-1 mt-2">
                        {m?.reason ? (
                          <span className="text-sm text-[var(--color-white)]">
                            {"دلیل: " + m?.reason}
                          </span>
                        ) : null}
                        <span className="text-xs sub-txt-color">
                          {formatDate(m?.dateCreated)}
                          {m?.performedBy
                            ? " · توسط: " + m?.performedBy?.phoneNumber
                            : ""}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default StockHistoryModal;
