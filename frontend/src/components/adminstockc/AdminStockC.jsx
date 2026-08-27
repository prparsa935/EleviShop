import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerItem,
} from "../pagetransition/PageTransition";
import { findLowStockItems } from "../../api/stock";
import AdjustStockModal from "../adjuststockmodal/AdjustStockModal";
import StockHistoryModal from "../stockhistorymodal/StockHistoryModal";
import Button from "../Button/Button";
import Input from "../input/Input";
import Loading from "../icons/Loading";

const faNum = (n) => Number(n ?? 0).toLocaleString("fa-IR");

const AdminStockC = ({ setToastList }) => {
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [threshold, setThreshold] = useState("");
  const [manualInventoryId, setManualInventoryId] = useState("");
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [historyTarget, setHistoryTarget] = useState(null);

  const parsedThreshold = () => {
    const th = Number(threshold);
    if (threshold !== "" && !isNaN(th) && th >= 0) {
      return th;
    }
    return null;
  };

  const loadLowStockItems = (th) => {
    setLoading(true);
    findLowStockItems(th, setLowStockItems, setToastList, setLoading);
  };

  useEffect(() => {
    loadLowStockItems(null);
  }, []);

  const handleSearchByThreshold = () => {
    loadLowStockItems(parsedThreshold());
  };

  const handleOpenHistoryById = () => {
    const id = Number(manualInventoryId);
    if (manualInventoryId !== "" && !isNaN(id) && id > 0) {
      setHistoryTarget({ id: id });
    } else {
      setToastList((prev) => [
        ...prev,
        { type: "danger", message: "شناسه موجودی نامعتبر است" },
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="glass rounded-2xl p-4 flex flex-wrap justify-between items-center gap-y-3">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-[var(--color-white)]">
            مدیریت موجودی انبار
          </h2>
          <span className="text-sm sub-txt-color">
            کالاهای زیر حد هشدار موجودی نمایش داده می‌شوند
          </span>
        </div>
        <div className="flex items-stretch">
          <div className="h-[30px]">
            <Input
              type="number"
              width="150px"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeHolder="حد موجودی"
              height="30px"
            />
          </div>
          <Button
            onClick={handleSearchByThreshold}
            moreCss="h-[30px] border-r-0 rounded-r-none cursor-pointer"
            bgColor="bg-[var(--color-gold-light)]"
            txtColor="gold-text"
            size="sm"
          >
            جست و جو
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-y-3">
        <span className="text-sm font-semibold text-[var(--color-white)]">
          مشاهده تاریخچه با شناسه موجودی:
        </span>
        <div className="flex items-stretch">
          <div className="h-[30px]">
            <Input
              type="number"
              width="150px"
              value={manualInventoryId}
              onChange={(e) => setManualInventoryId(e.target.value)}
              placeHolder="شناسه موجودی"
              height="30px"
            />
          </div>
          <Button
            onClick={handleOpenHistoryById}
            moreCss="h-[30px] border-r-0 rounded-r-none cursor-pointer"
            bgColor="bg-bf-lighter-sky"
            txtColor="text-bf-sky"
            size="sm"
          >
            تاریخچه
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center w-full py-10">
          <Loading className="w-10 h-10"></Loading>
        </div>
      ) : lowStockItems?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-2xl p-10 flex flex-col items-center gap-y-4 text-center"
        >
          <i className="fa-solid fa-circle-check text-3xl text-bf-green"></i>
          <span className="font-semibold text-[var(--color-white)]">
            موجودی همه کالاها کافی است
          </span>
          <span className="text-sm sub-txt-color">
            هیچ کالایی زیر حد هشدار موجودی نیست
          </span>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-y-3"
        >
          {lowStockItems?.map((item) => (
            <motion.div
              key={item?.id}
              variants={staggerItem}
              className="glass glass-hover rounded-xl p-4 flex flex-wrap justify-between items-center gap-y-3"
            >
              <div className="flex items-center gap-x-4">
                <div
                  className={
                    "w-10 h-10 rounded-full flex items-center justify-center " +
                    (item?.quantity === 0
                      ? "bg-bf-lighter-red text-bf-red"
                      : "bg-[var(--color-gold-light)] gold-text")
                  }
                >
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-[var(--color-white)]">
                    {item?.product?.name ||
                      "شناسه موجودی " + faNum(item?.id)}
                  </h3>
                  <span className="text-sm sub-txt-color">
                    {"موجودی فعلی: "}
                    <span
                      className={
                        "font-bold " +
                        (item?.quantity === 0
                          ? "text-bf-red"
                          : "text-bf-orange")
                      }
                    >
                      {faNum(item?.quantity)}
                    </span>
                    {" · حد هشدار: " + faNum(item?.lowStockThreshold ?? 5)}
                    {" · قیمت: " + faNum(item?.price) + " تومان"}
                  </span>
                </div>
              </div>
              <div className="flex gap-x-2">
                <Button
                  size="xs"
                  moreCss="cursor-pointer"
                  onClick={() =>
                    setAdjustTarget({
                      id: item?.id,
                      productName: item?.product?.name,
                      quantity: item?.quantity,
                    })
                  }
                  bgColor="bg-bf-lighter-green"
                  txtColor="text-bf-green"
                >
                  <i className="fa-solid fa-sliders ml-1"></i>
                  اصلاح موجودی
                </Button>
                <Button
                  size="xs"
                  moreCss="cursor-pointer"
                  onClick={() =>
                    setHistoryTarget({
                      id: item?.id,
                      productName: item?.product?.name,
                    })
                  }
                  bgColor="bg-bf-lighter-sky"
                  txtColor="text-bf-sky"
                >
                  <i className="fa-solid fa-clock-rotate-left ml-1"></i>
                  تاریخچه
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AdjustStockModal
        target={adjustTarget}
        onClose={() => setAdjustTarget(null)}
        setToastList={setToastList}
        onAdjusted={() => loadLowStockItems(parsedThreshold())}
      />
      <StockHistoryModal
        target={historyTarget}
        onClose={() => setHistoryTarget(null)}
        setToastList={setToastList}
      />
    </div>
  );
};
export default AdminStockC;
