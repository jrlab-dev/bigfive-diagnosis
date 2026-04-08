"""
ビッグファイブ アイコン生成スクリプト
各因子のアイコンをPillow(PIL)で生成する

改善版：
- 開放性（O）: 放射線を長く、中心を白丸に
- 誠実性（C）: チェックマーク系
- 外向性（E）: 太陽/発散系
- 協調性（A）: ハート/繋がり系
- 神経症傾向（N）: 波/揺れ系
"""

from PIL import Image, ImageDraw
import math
import os

SIZE = 200
CENTER = SIZE // 2
os.makedirs("images/icons", exist_ok=True)

def new_img():
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    return img, draw

# ===========================
# O: 開放性 - 無限大（∞）マーク
# ===========================
img, draw = new_img()
color = (139, 92, 246)  # 紫

# ∞マーク：2つの円をベジェ風に描く（楕円で近似）
lw = 10  # 線の太さ
# 左の楕円
lx, ly = CENTER - 32, CENTER
lr_x, lr_y = 38, 30
draw.ellipse([lx-lr_x, ly-lr_y, lx+lr_x, ly+lr_y],
             outline=color, width=lw)
# 右の楕円
rx, ry = CENTER + 32, CENTER
draw.ellipse([rx-lr_x, ry-lr_y, rx+lr_x, ry+lr_y],
             outline=color, width=lw)

img.save("images/icons/icon_O.png")
print("icon_O.png done")

# ===========================
# C: 誠実性 - 六角形＋内側の六角形枠
# ===========================
img, draw = new_img()
color = (234, 179, 8)  # 黄

def hexagon_points(cx, cy, r, offset=0):
    points = []
    for i in range(6):
        angle = math.pi / 180 * (60 * i + offset)
        points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    return points

# 外側六角形
pts_outer = hexagon_points(CENTER, CENTER, 80, offset=30)
draw.polygon(pts_outer, outline=color, width=8)

# 内側六角形
pts_inner = hexagon_points(CENTER, CENTER, 50, offset=30)
draw.polygon(pts_inner, outline=color, width=5)

# 中心点（白丸）
dot_r = 14
draw.ellipse([CENTER-dot_r, CENTER-dot_r, CENTER+dot_r, CENTER+dot_r],
             fill=(255, 255, 255, 255), outline=color, width=4)

# 各頂点にドット
for pt in pts_outer:
    r = 7
    draw.ellipse([pt[0]-r, pt[1]-r, pt[0]+r, pt[1]+r], fill=color)

img.save("images/icons/icon_C.png")
print("icon_C.png done")

# ===========================
# E: 外向性 - 太陽（大きめリング＋長い光芒）
# ===========================
img, draw = new_img()
color = (249, 115, 22)  # オレンジ

# 中心円（大きめ）
circle_r = 42
draw.ellipse([CENTER-circle_r, CENTER-circle_r, CENTER+circle_r, CENTER+circle_r],
             fill=color, outline=color, width=2)

# 光芒（8本・長い）
ray_count = 8
for i in range(ray_count):
    angle = 2 * math.pi * i / ray_count
    # 太い線
    x1 = CENTER + (circle_r + 8) * math.cos(angle)
    y1 = CENTER + (circle_r + 8) * math.sin(angle)
    x2 = CENTER + 90 * math.cos(angle)
    y2 = CENTER + 90 * math.sin(angle)
    draw.line([x1, y1, x2, y2], fill=color, width=7)

# 斜め方向（細め）
for i in range(8):
    angle = 2 * math.pi * i / 8 + math.pi / 8
    x1 = CENTER + (circle_r + 6) * math.cos(angle)
    y1 = CENTER + (circle_r + 6) * math.sin(angle)
    x2 = CENTER + 72 * math.cos(angle)
    y2 = CENTER + 72 * math.sin(angle)
    draw.line([x1, y1, x2, y2], fill=color, width=4)

img.save("images/icons/icon_E.png")
print("icon_E.png done")

# ===========================
# A: 協調性 - 二重円＋接続線（繋がりイメージ）
# ===========================
img, draw = new_img()
color = (34, 197, 94)  # 緑

# 中心の大きな円
circle_r = 35
draw.ellipse([CENTER-circle_r, CENTER-circle_r, CENTER+circle_r, CENTER+circle_r],
             outline=color, width=7)

# 外側に6つの小円を配置（繋がり）
orbit_r = 65
small_r = 18
node_count = 6
for i in range(node_count):
    angle = 2 * math.pi * i / node_count
    nx = CENTER + orbit_r * math.cos(angle)
    ny = CENTER + orbit_r * math.sin(angle)
    # 接続線
    lx1 = CENTER + (circle_r + 2) * math.cos(angle)
    ly1 = CENTER + (circle_r + 2) * math.sin(angle)
    lx2 = nx - small_r * math.cos(angle)
    ly2 = ny - small_r * math.sin(angle)
    draw.line([lx1, ly1, lx2, ly2], fill=color, width=4)
    # 小円
    draw.ellipse([nx-small_r, ny-small_r, nx+small_r, ny+small_r],
                 outline=color, width=5)

# 中心白丸
dot_r = 14
draw.ellipse([CENTER-dot_r, CENTER-dot_r, CENTER+dot_r, CENTER+dot_r],
             fill=(255, 255, 255, 255), outline=color, width=4)

img.save("images/icons/icon_A.png")
print("icon_A.png done")

# ===========================
# N: 神経症傾向 - 稲妻・ジグザグ
# ===========================
img, draw = new_img()
color = (239, 68, 68)  # 赤

# メインの稲妻（幅を広げて太く）
bolt = [
    (CENTER + 28, CENTER - 80),
    (CENTER - 10, CENTER - 8),
    (CENTER + 28, CENTER - 8),
    (CENTER - 28, CENTER + 80),
    (CENTER + 10, CENTER + 8),
    (CENTER - 28, CENTER + 8),
]
# 太い外枠
draw.polygon(bolt, outline=(255,255,255,200), fill=color, width=3)

# 外側に小さな稲妻（左）太め
bolt_s_left = [
    (CENTER - 32, CENTER - 55),
    (CENTER - 48, CENTER - 15),
    (CENTER - 35, CENTER - 15),
    (CENTER - 52, CENTER + 25),
    (CENTER - 38, CENTER + 8),
    (CENTER - 50, CENTER + 8),
]
draw.polygon(bolt_s_left, outline=color, fill=(color[0], color[1], color[2], 160), width=3)

# 外側に小さな稲妻（右）太め
bolt_s_right = [
    (CENTER + 52, CENTER - 55),
    (CENTER + 38, CENTER - 15),
    (CENTER + 50, CENTER - 15),
    (CENTER + 32, CENTER + 25),
    (CENTER + 48, CENTER + 8),
    (CENTER + 35, CENTER + 8),
]
draw.polygon(bolt_s_right, outline=color, fill=(color[0], color[1], color[2], 160), width=3)

img.save("images/icons/icon_N.png")
print("icon_N.png done")

print("all icons generated!")
