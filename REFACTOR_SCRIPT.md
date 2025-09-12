# Stratus Dark Terminal Palette Refactor Script

## Instructions for Cursor AI

**Refactor to Stratus dark terminal palette.**

1. **Ensure `src/styles/stratus-theme.css` is imported in the root App.**

2. **Replace any light backgrounds with tokens:**
   - `bg-white|bg-gray-50|bg-slate-50|bg-yellow.*|#fff(fff)?` → `bg-surface` or `bg-elev` as appropriate.

3. **Replace any dark text hacks:**
   - `text-black|text-slate-900|#000000` → `text-body`.

4. **Borders:** `border-gray-200|border-gray-300` → `border-default`.

5. **Page shells:** wrap each page with `<div className="min-h-screen bg-app text-body">`.

6. **Panels and cards:** use `.card` or `.panel`.

7. **Buttons:** replace ad-hoc buttons with `<Brand.Primary>` or `<Brand.Secondary>`.

8. **Inputs:** ensure `bg-elev text-body border-default`.

9. **Tables:** table uses `bg-surface`, headers use `bg-elev text-muted`.

10. **Apply to ALL components:** Broker, Operator, Pilot, Crew, Marketplace, Status, DSAR, Billing, Evidence, RFQs. No component may ship with a light background.

## Color Token Reference

### Backgrounds
- `bg-app` - Main page background (darkest)
- `bg-surface` - Card backgrounds 
- `bg-elev` - Elevated elements, inputs

### Text
- `text-body` - Primary text (near-white)
- `text-muted` - Secondary text (gray)
- `text-accent` - Accent text (orange)

### Borders
- `border-default` - Standard borders

### Status Colors
- `text-success` / `bg-success` - Green for success
- `text-warn` / `bg-warn` - Yellow for warnings  
- `text-danger` / `bg-danger` - Red for errors
- `text-info` / `bg-info` - Blue for info

### Brand Components
- `<Brand.Primary>` - Orange action button
- `<Brand.Secondary>` - Dark secondary button
- `<Brand.Card>` - Dark card container
- `<Brand.Panel>` - Elevated panel container
- `<Brand.StatusChip status="success|warn|danger|info">` - Status chips

## Before/After Examples

### Before
```tsx
<div className="bg-white rounded-lg p-4">
  <h3 className="text-black">Live Alerts</h3>
  <input className="bg-white border-gray-200" />
  <button className="bg-blue-500 text-white">Submit</button>
</div>
```

### After
```tsx
<div className="card p-4">
  <h3 className="text-body">Live Alerts</h3>
  <input className="bg-elev text-body border-default" />
  <Brand.Primary>Submit</Brand.Primary>
</div>
```

## Guardrail Rules

**NEVER use these classes:**
- `bg-white`, `bg-gray-50`, `bg-slate-50`
- `text-black`, `text-slate-900`
- `#ffffff`, `#fff`, `#000000`
- Any hardcoded light colors

**ALWAYS use these tokens:**
- `bg-app`, `bg-surface`, `bg-elev`
- `text-body`, `text-muted`, `text-accent`
- `border-default`
- `Brand.*` components for consistency
