import re
import os

# 1. Fix products.ts
pd_path = "src/data/products.ts"
with open(pd_path, "r") as f:
    pd = f.read()

pd = re.sub(
    r'imageUrls: \[\/images\/(.+?)\.png",',
    r'imageUrls: ["/images/\1.png", "/images/\1-2.png", "/images/\1-3.png"],',
    pd
)
with open(pd_path, "w") as f:
    f.write(pd)

# 2. Update components
files_to_update = [
    "src/components/ProductCard.tsx",
    "src/pages/CartPage.tsx",
]

for file_path in files_to_update:
    with open(file_path, "r") as f:
        content = f.read()
    content = content.replace("product.imageUrl", "product.imageUrls[0]")
    with open(file_path, "w") as f:
        f.write(content)

# 3. ProductDetailPage - Handle standard imageUrl and carousel
pd_detail = "src/pages/ProductDetailPage.tsx"
with open(pd_detail, "r") as f:
    detail_content = f.read()

# Fix the FlyingCart logic where it reads imageUrl
detail_content = detail_content.replace("src: product.imageUrl,", "src: product.imageUrls[0],")

# Fix the Carousel logic to map over imageUrls instead of the hardcoded views array
old_carousel = """        {[
          { scale: "1", pos: "center" },
          { scale: "1.25", pos: "top" },
          { scale: "1.25", pos: "bottom" },
        ].map((view, i) => (
          <div key={i} className="min-w-full h-full flex-shrink-0 snap-start relative overflow-hidden bg-black">
            <img
              src={product.imageUrl}
              alt={`${product.name} view ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700"
              style={{ transform: `scale(${view.scale})`, objectPosition: view.pos }}
            />"""

new_carousel = """        {product.imageUrls.map((imgUrl, i) => (
          <div key={i} className="min-w-full h-full shrink-0 snap-start relative overflow-hidden bg-black">
            <img
              src={imgUrl}
              alt={`${product.name} view ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            />"""

detail_content = detail_content.replace(old_carousel, new_carousel)
with open(pd_detail, "w") as f:
    f.write(detail_content)

print("Done")
