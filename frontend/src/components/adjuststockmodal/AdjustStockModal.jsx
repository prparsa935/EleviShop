import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button/Button";
import Input from "../input/Input";
import Loading from "../icons/Loading";
import { adjustStock } from "../../api/stock";

const faNum = (n) => Number(n ?? 0).toLocaleString("fa-IR");

const AdjustStockModal = ({ target, onClose, setToastList, onAdjusted }) => {
  const [quantityChange, setQuantityChange] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (target) {
      setQuantityChange("");
      setReason("");
      setErrorMsg(null);
      setSubmitting(false);
      document.body.classList.add("overflow-hidden");
      return () => document.body.classList.remove("overflow-hidden");
    }
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, onClose]);

  const handleSubmit = async () => {
    const qty = Number(quantityChange);
    if (quantityChange === "" || isNaN(qty) || qty === 0) {
      setErrorMsg("یک عدد مثبت یا منفی غیرصفر وارد کنید");
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);
    const success = await adjustStock(target.id, qty, reason, setToastList);
    setSubmitting(false);
    if (success) {
      onAdjusted();
      onClose();
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
            className="glass-strong rounded-2xl w-full max-w-md p-6 flex flex-col gap-y-5"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[var(--color-white)]">
                اصلاح دستی موجودی
              </h3>
              <i
                onClick={onClose}
                className="fa fa-times cursor-pointer text-[var(--sub-text-color)]"
                aria-hidden="true"
              ></i>
            </div>

            <div className="flex flex-col gap-y-1">
              <span className="font-semibold text-[var(--color-white)]">
                {target?.productName ||
                  "شناسه موجودی " + faNum(target?.id)}
              </span>
              <span className="text-sm sub-txt-color">
                {"موجودی فعلی: " + faNum(target?.quantity)}
              </span>
            </div>

            <div className="flex flex-col gap-y-1">
              <Input
                type="number"
                value={quantityChange}
                onChange={(e) => setQuantityChange(e.target.value)}
                placeHolder="تغییر موجودی (مثبت یا منفی)"
                iMessage={errorMsg}
              />
              <span className="text-xs sub-txt-color">
                عدد مثبت موجودی را افزایش و عدد منفی کاهش می‌دهد
              </span>
            </div>

            <Input
              type="textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeHolder="دلیل اصلاح (اختیاری)"
            />

            <div className="flex gap-x-2 justify-end">
              <Button
                onClick={onClose}
                size="sm"
                moreCss="cursor-pointer"
                bgColor="bg-[var(--color-gray353030)]"
                txtColor="text-[var(--color-white)]"
              >
                لغو
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                size="sm"
                moreCss="cursor-pointer"
                bgColor="bg-bf-lighter-green"
                txtColor="text-bf-green"
              >
                {submitting ? (
                  <Loading className="w-4 h-4"></Loading>
                ) : (
                  "ثبت اصلاح"
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default AdjustStockModal;
