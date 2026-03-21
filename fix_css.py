import re
import os

css_path = 'src/index.css'
with open(css_path, 'r') as f:
    css = f.read()

# Replace Neon Blue
css = css.replace('#00d4ff', '#bec3c8')
css = css.replace('0, 212, 255', '190, 195, 200')

# Replace Neon Red 
css = css.replace('#ff2d55', '#731313')
css = css.replace('255, 45, 85', '115, 19, 19')

# Replace Neon Purple with something muted or just leave it
css = css.replace('#a855f7', '#6c757d')
css = css.replace('168, 85, 247', '108, 117, 125')

with open(css_path, 'w') as f:
    f.write(css)

# Product Detail Page fixes
pdp_path = 'src/pages/ProductDetailPage.tsx'
with open(pdp_path, 'r') as f:
    pdp = f.read()

# Add useEffect for window.scrollTo
if 'window.scrollTo(0, 0)' not in pdp:
    pdp = pdp.replace('const [activeImage, setActiveImage] = useState(0);',
                      'const [activeImage, setActiveImage] = useState(0);\n  useEffect(() => {\n    window.scrollTo(0, 0);\n  }, [id]);')

# Ensure badges and dots have extremely high z-index to guarantee visibility
pdp = pdp.replace('className="absolute bottom-16 left-5 flex flex-wrap gap-2 z-10 pointer-events-none"',
                  'className="absolute bottom-12 left-5 flex flex-wrap gap-2 z-50 pointer-events-none"')

pdp = pdp.replace('className="absolute bottom-16 right-5 flex gap-2 z-10 pointer-events-none"',
                  'className="absolute bottom-12 right-5 flex gap-2 z-50 pointer-events-none"')

with open(pdp_path, 'w') as f:
    f.write(pdp)

