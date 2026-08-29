import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import Axios from "axios";
import { serverAddress } from "../../App";
import { formatNumber } from "../../utils/helperMehods";

const rangeOptions = [
  { label: "۷ روز", value: 7 },
  { label: "۳۰ روز", value: 30 },
  { label: "۹۰ روز", value: 90 },
];

const chartColors = {
  gold: "#d4af37",
  blue: "#6366f1",
  green: "#22c55e",
  red: "#ef4444",
};

const StatCard = ({ title, value }) => (
  <div className="glass rounded-2xl p-4 flex flex-col gap-y-1">
    <span className="text-xs text-[var(--sub-text-color)] font-medium">{title}</span>
    <span className="text-xl font-bold text-[var(--color-white)]">{value}</span>
  </div>
);

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Axios.get(serverAddress + "analytics/dashboard", { params: { days } })
      .then((res) => {
        if (!cancelled) setData(res.data?.data || null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-10 flex justify-center text-[var(--sub-text-color)]">
        در حال بارگذاری آنالیتیکس...
      </div>
    );
  }

  const funnel = data?.funnel || [];
  const funnelMax = Math.max(...funnel.map((f) => f.count), 1);
  const salesData = (data?.salesOverTime || []).map((row) => ({
    ...row,
    totalSales: Number(row.totalSales),
  }));

  return (
    <div className="flex flex-col gap-y-5">
      {/* range selector */}
      <div className="flex items-center gap-x-2">
        {rangeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDays(opt.value)}
            className={
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all border " +
              (days === opt.value
                ? "bg-[var(--color-gold-light)] border-[var(--color-gold)] text-[var(--color-white)]"
                : "glass border-[var(--glass-border)] text-[var(--sub-text-color)] hover:text-[var(--color-white)]")
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="بازدید محصول" value={formatNumber(data?.totals?.productViews || 0)} />
        <StatCard title="افزودن به سبد" value={formatNumber(data?.totals?.addToCarts || 0)} />
        <StatCard title="خرید نهایی" value={formatNumber(data?.totals?.purchases || 0)} />
        <StatCard title="نرخ تبدیل" value={(data?.totals?.conversionRate || 0) + "%"} />
      </div>

      {/* sales over time */}
      <div className="glass rounded-2xl p-4">
        <span className="font-semibold text-[var(--color-white)]">فروش در طول زمان</span>
        {salesData.length === 0 ? (
          <div className="p-6 text-sm text-[var(--sub-text-color)]">داده‌ای برای نمایش وجود ندارد</div>
        ) : (
          <div className="mt-4 w-full h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8884" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip formatter={(v) => formatNumber(v) + " تومان"} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  name="فروش"
                  stroke={chartColors.gold}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* conversion funnel */}
      <div className="glass rounded-2xl p-4">
        <span className="font-semibold text-[var(--color-white)]">قیف تبدیل</span>
        <div className="mt-4 flex flex-col gap-y-3">
          {funnel.map((stage, index) => (
            <div key={stage.stage} className="flex flex-col gap-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--sub-text-color)]">{stage.label}</span>
                <span className="font-bold text-[var(--color-white)]">{formatNumber(stage.count)}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[var(--glass-border)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: Math.max((stage.count / funnelMax) * 100, 2) + "%",
                    background: [chartColors.blue, chartColors.gold, chartColors.green][index],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* most viewed products */}
      <div className="glass rounded-2xl p-4">
        <span className="font-semibold text-[var(--color-white)]">پربازدیدترین محصولات</span>
        {(data?.mostViewedProducts || []).length === 0 ? (
          <div className="p-6 text-sm text-[var(--sub-text-color)]">داده‌ای برای نمایش وجود ندارد</div>
        ) : (
          <div className="mt-4 w-full h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.mostViewedProducts.map((p) => ({
                  name: p.productName || p.productId,
                  viewCount: p.viewCount,
                }))}
                layout="vertical"
                margin={{ top: 5, right: 20, bottom: 5, left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#8884" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => (String(v).length > 18 ? String(v).slice(0, 18) + "…" : v)}
                />
                <Tooltip />
                <Bar dataKey="viewCount" name="بازدید" fill={chartColors.blue} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* abandoned cart products */}
      <div className="glass rounded-2xl p-4 overflow-x-auto">
        <span className="font-semibold text-[var(--color-white)]">
          محصولات پرترک‌شده در سبد (افزوده‌شده ولی کم‌خریده)
        </span>
        {(data?.abandonedCartProducts || []).length === 0 ? (
          <div className="p-6 text-sm text-[var(--sub-text-color)]">داده‌ای برای نمایش وجود ندارد</div>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-[var(--sub-text-color)] border-b border-[var(--glass-border)]">
                <th className="p-2 text-right font-medium">محصول</th>
                <th className="p-2 text-center font-medium">افزودن به سبد</th>
                <th className="p-2 text-center font-medium">خرید واقعی</th>
                <th className="p-2 text-center font-medium">نرخ رها شدن</th>
              </tr>
            </thead>
            <tbody>
              {data.abandonedCartProducts.map((row) => (
                <tr key={row.productId} className="border-b border-[var(--glass-border)] text-[var(--color-white)]">
                  <td className="p-2 text-right">{row.productName}</td>
                  <td className="p-2 text-center">{formatNumber(row.addCount)}</td>
                  <td className="p-2 text-center">{formatNumber(row.purchasedCount)}</td>
                  <td className="p-2 text-center">
                    <span
                      className={
                        "px-2 py-1 rounded-lg text-xs font-bold " +
                        (row.abandonmentRate >= 70
                          ? "bg-[var(--bf-red)] text-white"
                          : row.abandonmentRate >= 40
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-green-500/20 text-green-500")
                      }
                    >
                      {row.abandonmentRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* top search queries */}
      <div className="glass rounded-2xl p-4">
        <span className="font-semibold text-[var(--color-white)]">پرجستجوترین عبارات</span>
        {(data?.topSearchQueries || []).length === 0 ? (
          <div className="p-6 text-sm text-[var(--sub-text-color)]">داده‌ای برای نمایش وجود ندارد</div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.topSearchQueries.map((item) => (
              <span
                key={item.searchQuery}
                className="glass border border-[var(--glass-border)] rounded-xl px-3 py-2 text-sm text-[var(--color-white)]"
              >
                {item.searchQuery}
                <span className="mr-2 text-xs text-[var(--sub-text-color)]">
                  ({formatNumber(item.count)})
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
