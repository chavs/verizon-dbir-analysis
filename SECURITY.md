# Security Notes

## Dependency Override: sharp >=0.35.0

**Date:** July 2026
**File:** `package.json` → `"overrides"`

### Why This Exists

`wrangler@4.97.0` → `miniflare` depends on `sharp@<0.35.0` which contains **high-severity libvips CVEs**:
- CVE-2026-33327
- CVE-2026-33328
- CVE-2026-35590
- CVE-2026-35591

These are memory corruption vulnerabilities in image processing via crafted image files. While our production Workers code does **not** use image processing (Cloudflare Workers runtime doesn't load native modules like `sharp`), the dev dependency chain (`wrangler dev`) includes it.

### When to Remove

Remove `"sharp": ">=0.35.0"` from `package.json` → `"overrides"` once **wrangler releases a version** that upgrades `miniflare` to use `sharp@>=0.35.0` natively.

**How to check:**
```bash
# If this returns no audit errors, the override can be removed:
npm audit
```

### Impact Assessment

| Factor | Assessment |
|--------|-----------|
| Production risk | **None** — Workers runtime does not load sharp/libvips |
| Local dev risk | **Low** — patched via override |
| Breakage risk | **Low** — we don't use image processing APIs |

---

## Reporting Security Issues

If you discover a security vulnerability in this project:
1. Check if it affects the Workers runtime (production) vs local dev dependencies
2. For runtime issues, report to Cloudflare: https://hackerone.com/cloudflare
3. For this codebase, open a private security advisory on GitHub
