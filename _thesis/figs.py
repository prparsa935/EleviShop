# -*- coding: utf-8 -*-
"""Generate academic figures for the EleviShop thesis (English in-figure labels)."""
import json, os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "figs")
os.makedirs(OUT, exist_ok=True)

INK = "#1a1a1a"
FILL = "#F5F7FA"
FILL2 = "#E8EDF3"
ACC = "#8B7E5A"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 10.5,
    "text.color": INK,
    "axes.edgecolor": INK,
})

manifest = {}


def new_fig(w, h):
    fig = plt.figure(figsize=(w, h), dpi=200)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis("off")
    return fig, ax


def box(ax, x, y, w, h, title, lines=None, fill=FILL, tsize=11, lsize=9.2, ec=INK, lw=1.1, tbold=True, dashed=False):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.4,rounding_size=1.2",
                                linewidth=lw, edgecolor=ec, facecolor=fill, mutation_aspect=0.6,
                                linestyle=(0, (4, 2.5)) if dashed else "solid"))
    cy = y + h / 2
    if lines:
        n = len(lines) + 1
        ax.text(x + w / 2, y + h - (h / (2 * n)), title, ha="center", va="center",
                fontsize=tsize, fontweight="bold" if tbold else "normal", color=INK)
        for i, ln in enumerate(lines):
            ax.text(x + w / 2, y + h - (h / (2 * n)) * (2 * (i + 1) + 1) + h / (2 * n), ln,
                    ha="center", va="center", fontsize=lsize, color="#333333")
    else:
        ax.text(x + w / 2, cy, title, ha="center", va="center",
                fontsize=tsize, fontweight="bold" if tbold else "normal", color=INK)


def arrow(ax, p1, p2, label=None, style="-|>", lw=1.2, color=INK, lsize=9, loff=(0, 1.2),
          connstyle=None, dashed=False):
    a = FancyArrowPatch(p1, p2, arrowstyle=style, mutation_scale=14, linewidth=lw,
                        color=color, linestyle=(0, (4, 2.5)) if dashed else "solid",
                        connectionstyle=connstyle or "arc3,rad=0", shrinkA=2, shrinkB=2)
    ax.add_patch(a)
    if label:
        mx, my = (p1[0] + p2[0]) / 2 + loff[0], (p1[1] + p2[1]) / 2 + loff[1]
        ax.text(mx, my, label, ha="center", va="center", fontsize=lsize, color="#333333",
                bbox=dict(boxstyle="round,pad=0.15", fc="white", ec="none"))


def save(fig, name):
    path = os.path.join(OUT, name + ".png")
    fig.savefig(path, dpi=200, facecolor="white")
    plt.close(fig)
    from PIL import Image
    im = Image.open(path)
    manifest[name] = {"w": im.width, "h": im.height}
    print("saved", name, im.width, "x", im.height)


# ---------------------------------------------------------------- fig2_1 three-tier
fig, ax = new_fig(9.2, 5.6)
ax.set_xlim(0, 100); ax.set_ylim(0, 100)
box(ax, 8, 74, 84, 20, "Presentation Tier", ["Web Browser / React Single-Page Application"], fill=FILL2)
box(ax, 8, 40, 84, 20, "Application Tier", ["Web Server  |  RESTful API  |  Business Logic"], fill=FILL2)
box(ax, 8, 6, 84, 20, "Data Tier", ["Relational Database Management System"], fill=FILL2)
arrow(ax, (50, 73), (50, 61), "HTTP Request / JSON Response", loff=(19, 0))
arrow(ax, (44, 39), (44, 27))
ax.text(54.5, 33, "SQL Queries", ha="center", va="center", fontsize=9, color="#333333")
ax.text(96, 87, "1", ha="center", va="center", fontsize=9.5, fontweight="bold", color=ACC)
ax.text(96, 53, "2", ha="center", va="center", fontsize=9.5, fontweight="bold", color=ACC)
ax.text(96, 19, "3", ha="center", va="center", fontsize=9.5, fontweight="bold", color=ACC)
save(fig, "fig2_1")

# ---------------------------------------------------------------- fig3_1 system architecture
fig, ax = new_fig(10.2, 7.4)
ax.set_xlim(0, 100); ax.set_ylim(0, 100)
box(ax, 14, 78, 72, 19, "React 18 SPA  (Vite, RTL)",
    ["18 lazy-loaded routes  |  AuthContext (JWT cookie + localStorage cart)",
     "Axios API client  |  Tailwind CSS + Liquid-Glass theming"], fill=FILL2)
box(ax, 14, 42, 72, 22, "Express 4 REST API  (Node.js + TypeScript)",
    ["13 route groups  |  Controllers  |  16 domain services",
     "Middlewares: JWT auth - class-validator - rate-limit - Helmet - CORS"],
    fill=FILL2)
box(ax, 14, 8, 44, 20, "PostgreSQL", ["21 mapped entities (TypeORM)", "ACID transactions  |  unique constraints"])
box(ax, 62, 8, 24, 20, "Static Files", ["public/ images", "compressed by sharp", "1-year cache headers"])
arrow(ax, (34, 77), (34, 65), "HTTPS  |  JSON", loff=(-8.5, 0))
arrow(ax, (66, 65), (66, 77), style="-|>")
arrow(ax, (30, 41), (30, 29), "TypeORM 0.3", loff=(-7.5, 0))
arrow(ax, (70, 29), (70, 41))
save(fig, "fig3_1")

# ---------------------------------------------------------------- fig3_2a ERD product domain
fig, ax = new_fig(10.4, 7.6)
ax.set_xlim(0, 112); ax.set_ylim(0, 80)

def ent(x, y, w, name, attrs, h=None, fill=FILL):
    hh = h if h else 3.8 + len(attrs) * 2.6
    ax.add_patch(FancyBboxPatch((x, y), w, hh, boxstyle="round,pad=0.25,rounding_size=0.8",
                                linewidth=1.15, edgecolor=INK, facecolor="white", mutation_aspect=0.6))
    ax.add_patch(FancyBboxPatch((x, y + hh - 3.2), w, 3.2, boxstyle="round,pad=0.25,rounding_size=0.8",
                                linewidth=1.15, edgecolor=INK, facecolor=fill, mutation_aspect=0.6))
    ax.text(x + w / 2, y + hh - 1.6, name, ha="center", va="center", fontsize=11.5, fontweight="bold")
    for i, a in enumerate(attrs):
        ax.text(x + w / 2, y + hh - 3.2 - (i + 0.55) * 2.55, a, ha="center", va="center", fontsize=9.2, color="#333333")

def seg(pts, dashed=False):
    for i in range(len(pts) - 1):
        arrow(ax, pts[i], pts[i + 1], style="-" if i < len(pts) - 2 else "-|>",
              dashed=dashed, lw=1.05, color="#555555")

def lab(x, y, t):
    ax.text(x, y, t, fontsize=9.5, fontweight="bold", color=ACC, ha="center", va="center")

ent(2, 64, 18, "Mold", ["id", "name"])
ent(30, 64, 18, "MoldSize", ["sizeLabel", "dims + weight"])
ent(58, 64, 18, "Pattern", ["id", "name"])
ent(86, 64, 18, "Color", ["name", "hexCode"], h=10)
ent(14, 44, 20, "MoldPattern", [])
ent(44, 42, 22, "Product", ["name, code", "offPercent", "type (TPC)"], h=14)
ent(78, 42, 22, "Inventory", ["price, quantity", "lowStockThreshold"], h=13)
ent(6, 12, 20, "Plate", ["child entity"], h=9)
ent(34, 12, 20, "ProductSet", ["calculatedPrice", "manualPriceOverride"], h=12)
ent(62, 12, 20, "ProductSetItem", ["quantity"], h=9)

seg([(20, 68), (30, 68)]); lab(23, 70, "1"); lab(27, 70, "N")
seg([(11, 64), (11, 58), (24, 58), (24, 53)]); lab(8.5, 61.5, "1"); lab(27, 58.6, "N")
seg([(58, 64), (58, 57.5), (30, 57.5), (30, 53)]); lab(55.5, 61, "1"); lab(44, 59.2, "N")
seg([(34, 48), (44, 48)]); lab(36, 49.8, "1"); lab(42, 49.8, "N")
seg([(66, 48), (78, 48)]); lab(68, 49.8, "1"); lab(76, 49.8, "N")
seg([(50, 42), (50, 26), (16, 26), (16, 21)], dashed=True); lab(47.5, 39, "1"); lab(19.5, 24, "0..1")
seg([(54, 17), (62, 17)]); lab(56, 19, "1"); lab(60, 19, "N")
seg([(72, 12), (72, 6), (16, 6), (16, 12)]); lab(69.5, 10, "N"); lab(19, 8.8, "1")
seg([(80, 55), (80, 60), (39, 60), (39, 64)], dashed=True); lab(77.5, 58.5, "N"); lab(42, 62.2, "0..1")
seg([(89, 55), (89, 64)]); lab(86.5, 58, "N"); lab(92, 61.5, "0..1")
ax.text(56, 1.6, "( dashed = optional / nullable association,  TPC = table-per-concrete-class inheritance )",
        ha="center", fontsize=9, color="#555555")
save(fig, "fig3_2a")

# ---------------------------------------------------------------- fig3_2b ERD order/user domain
fig, ax = new_fig(10.4, 5.8)
ax.set_xlim(0, 102); ax.set_ylim(0, 54)

def ent2(x, y, w, name, attrs, h=None, fill=FILL, dashed=False):
    hh = h if h else 3.8 + len(attrs) * 2.6
    ax.add_patch(FancyBboxPatch((x, y), w, hh, boxstyle="round,pad=0.25,rounding_size=0.8",
                                linewidth=1.15, edgecolor=INK, facecolor="white", mutation_aspect=0.6,
                                linestyle=(0, (4, 2.5)) if dashed else "solid"))
    ax.add_patch(FancyBboxPatch((x, y + hh - 3.2), w, 3.2, boxstyle="round,pad=0.25,rounding_size=0.8",
                                linewidth=1.15, edgecolor=INK, facecolor=fill, mutation_aspect=0.6,
                                linestyle=(0, (4, 2.5)) if dashed else "solid"))
    ax.text(x + w / 2, y + hh - 1.6, name, ha="center", va="center", fontsize=11.5, fontweight="bold")
    for i, a in enumerate(attrs):
        ax.text(x + w / 2, y + hh - 3.2 - (i + 0.55) * 2.55, a, ha="center", va="center", fontsize=9.2, color="#333333")

def seg(pts, dashed=False):
    for i in range(len(pts) - 1):
        arrow(ax, pts[i], pts[i + 1], style="-" if i < len(pts) - 2 else "-|>",
              dashed=dashed, lw=1.05, color="#555555")

def lab(x, y, t):
    ax.text(x, y, t, fontsize=9.5, fontweight="bold", color=ACC, ha="center", va="center")

ent2(4, 36, 20, "User", ["phoneNumber", "isSuperUser"], h=12)
ent2(40, 36, 20, "Order", ["trackingCode", "orderStatus"], h=12)
ent2(72, 36, 20, "Inventory", ["price, quantity", "lowStockThreshold"], h=12)
ent2(4, 12, 24, "ShoppingCartItem", ["count", "itemType"], h=12)
ent2(40, 12, 20, "OrderInventory", ["quantity", "price snapshot"], h=12)
ent2(72, 12, 20, "StockMovement", ["type, reason", "quantityChange"], h=12)
ent2(4, 1, 24, "ProductSet  (see fig. 3-2)", [], h=4.6, fill="white", dashed=True)

seg([(14, 36), (14, 24.2)]); lab(16.5, 34, "1"); lab(16.5, 26, "N")
seg([(24, 44), (40, 44)]); lab(27, 45.8, "1"); lab(37, 45.8, "N")
seg([(50, 36), (50, 24.2)]); lab(52.5, 34, "1"); lab(52.5, 26, "N")
seg([(55, 24), (55, 30), (74, 30), (74, 36)]); lab(58, 31.8, "N"); lab(76.5, 33.5, "1")
seg([(82, 36), (82, 24.2)]); lab(84.5, 34, "1"); lab(84.5, 26, "N")
seg([(12, 24), (12, 32), (72, 32), (72, 36)], dashed=True); lab(30, 33.8, "N : 0..1")
seg([(10, 12), (10, 5.8)], dashed=True); lab(14, 8.5, "N : 0..1")
ax.text(51, -1.5, "( dashed = optional / nullable association )", ha="center", fontsize=9, color="#555555", va="top")
save(fig, "fig3_2b")

# ---------------------------------------------------------------- fig3_3 mold/size/pattern model
fig, ax = new_fig(11.0, 5.2)
ax.set_xlim(0, 100); ax.set_ylim(0, 100)
box(ax, 3, 58, 16, 18, "Mold", ["plate shape", "(قالب)"])
box(ax, 3, 24, 16, 18, "Pattern", ["decoration", "design (طرح)"])
box(ax, 30, 42, 18, 16, "MoldPattern", ["combination", "of shape + design"])
box(ax, 58, 42, 17, 16, "Product / Plate", ["grouped by", "mold-pattern"])
box(ax, 84, 42, 13, 16, "Inventory", ["price, stock,", "color, size"])
box(ax, 30, 74, 18, 14, "MoldSize", ["S / M / L", "dims + weight"])
arrow(ax, (19.5, 71), (29.5, 79), "1 : N", loff=(0, 2.4))
arrow(ax, (19.5, 63), (29.5, 52), "N : 1", loff=(0, -2.2))
arrow(ax, (19.5, 33), (29.5, 47), "M : N", loff=(0, -3.4))
arrow(ax, (48.5, 50), (57.5, 50), "1 : N", loff=(0, 2.2))
arrow(ax, (75.5, 50), (83.5, 50), "1 : N", loff=(0, 2.2))
ax.text(50, 12, "Size migrated from product-level enum into per-inventory MoldSize reference\n(size-to-inventory refactor)", ha="center", fontsize=9, color="#555555")
save(fig, "fig3_3")

# ---------------------------------------------------------------- fig3_4 order flow
fig, ax = new_fig(8.6, 10.6)
ax.set_xlim(0, 100); ax.set_ylim(0, 100)

def fbox(x, y, w, h, t, lines=None, fill=FILL2):
    box(ax, x, y, w, h, t, lines, fill=fill, tsize=10.5, lsize=8.8)

def diamond(cx, cy, w, h, t):
    ax.add_patch(plt.Polygon([(cx, cy + h / 2), (cx + w / 2, cy), (cx, cy - h / 2), (cx - w / 2, cy)],
                             closed=True, facecolor=FILL, edgecolor=INK, linewidth=1.1))
    ax.text(cx, cy, t, ha="center", va="center", fontsize=10, fontweight="bold")

fbox(24, 93, 52, 6, "Checkout request (cart DTOs)")
fbox(24, 84, 52, 6, "Authorize user + identity check")
fbox(24, 75, 52, 6, "BEGIN database transaction")
diamond(50, 65.5, 34, 9.5, "item type?")
fbox(8, 48, 30, 8.5, "SIMPLE", ["snapshot price +", "offPercent of inventory"])
fbox(56, 41, 34, 16.5, "SET", ["load component plates;", "pick same-color inventory", "(max stock); validate qty"])
fbox(56, 29, 34, 8.5, "expand", ["one OrderInventory", "per component (BUNDLE_SALE)"])
fbox(24, 18.5, 52, 6.5, "Record StockMovements (SALE / BUNDLE_SALE)")
fbox(24, 9.5, 52, 6.5, "Create Order (waitingForPayment) + COMMIT")
fbox(24, 2, 52, 6, "Return tracking code  +  analytics event")
arrow(ax, (50, 93), (50, 90.4))
arrow(ax, (50, 84), (50, 81.4))
arrow(ax, (50, 75), (50, 70.6))
arrow(ax, (35, 63.5), (23, 57.5), "SIMPLE", loff=(-2.5, 1))
arrow(ax, (65, 63.5), (73, 58.5), "SET", loff=(2.5, 1))
arrow(ax, (73, 41), (73, 38))
arrow(ax, (23, 48), (23, 25.6), connstyle="arc3,rad=0.35")
arrow(ax, (73, 29), (55, 25.2))
arrow(ax, (50, 18.5), (50, 16.4))
arrow(ax, (50, 9.5), (50, 8.4))
ax.text(15.5, 36, "stock check per line", fontsize=8.6, color="#555555", rotation=90, ha="center", va="center")
save(fig, "fig3_4")

# ---------------------------------------------------------------- fig4_1 cart sync
fig, ax = new_fig(9.8, 6.0)
ax.set_xlim(0, 100); ax.set_ylim(0, 100)
box(ax, 6, 6, 38, 88, "Client (React)", None, fill=FILL2)
box(ax, 56, 6, 38, 88, "Server (Express)", None, fill=FILL2)
box(ax, 9, 72, 32, 15, "Cart state", ["AuthContext + localStorage"])
box(ax, 59, 72, 32, 15, "POST /cart/sync", ["replace = true | false"])
box(ax, 9, 48, 32, 15, "Actions", ["add / remove /", "quantity change (debounce 800 ms)"])
box(ax, 59, 48, 32, 15, "shoppingCartService", ["merge, clamp to stock,", "drop invalid / out-of-color sets"])
box(ax, 59, 24, 32, 15, "DB: ShoppingCartItem", ["unique keys:", "inv:{id} / set:{set}:{color}"])
box(ax, 9, 24, 32, 15, "Canonical cart", ["server response replaces", "local state"])
arrow(ax, (25, 47.5), (25, 41.5))
arrow(ax, (41, 79), (59, 79), "every change", loff=(0, 3))
arrow(ax, (59, 55.5), (41, 55.5), "canonical cart (JSON)", loff=(0, 2.8))
arrow(ax, (41, 31.5), (59, 31.5), "login: merge (max count)", loff=(0, 3))
save(fig, "fig4_1")

# ---------------------------------------------------------------- fig5_1 funnel
fig, ax = new_fig(9.4, 4.6)
ax.set_xlim(0, 100); ax.set_ylim(0, 100)
stages = [("PRODUCT_VIEW", 88), ("ADD_TO_CART", 66), ("CHECKOUT_START", 46), ("PURCHASE_COMPLETE", 28)]
y = 78
for i, (name, w) in enumerate(stages):
    x = (100 - w) / 2
    ax.add_patch(FancyBboxPatch((x, y - 12), w, 12, boxstyle="round,pad=0.3,rounding_size=1",
                                linewidth=1.1, edgecolor=INK, facecolor=FILL if i % 2 == 0 else FILL2,
                                mutation_aspect=0.6))
    ax.text(50, y - 6, name, ha="center", va="center", fontsize=10.5, fontweight="bold")
    if i < 3:
        arrow(ax, (50, y - 12.6), (50, y - 20.4), lw=1.0)
    y -= 20.4
ax.text(50, 4, "AnalyticsEvent funnel (conceptual view - no sample data)", ha="center", fontsize=9, color="#555555")
save(fig, "fig5_1")

with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=1)
print("manifest written")
