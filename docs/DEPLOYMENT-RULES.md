# LINAWORKS deployment rules

## Source of truth

GitHub is the only source of truth for production. Do not deploy a locally generated one-off build directly over production.

## Branching

- `main` = approved production.
- Every requested change starts on a new feature branch.
- A Vercel Preview deployment is created from that branch.
- Production changes only after visual QA and an approved merge to `main`.

## Visual QA before merge

Check all of these on every preview:

- Desktop 1440px: header/logo, hero, section hierarchy, screenshots, CTA and footer.
- Tablet around 768–1024px: no overlap, no clipped text, no horizontal scroll.
- Mobile around 390px: menu, hero, cards, screenshot frames and footer.
- Portfolio screenshots must use `object-fit: contain`; never crop dashboards by default.
- Brand logo proportions must never be changed by CSS cropping.
- All image requests return successfully; no broken assets.
- Navigation and CTA links work.
- No console errors.

## Change isolation

Do not redesign unrelated sections while implementing a requested change. For example, adding a chatbot must not alter portfolio images, logo sizing or desktop layout unless explicitly requested.

## Locked brand assets

Approved logo and portfolio source files are treated as immutable master assets. Create derivatives when optimization is needed; do not overwrite masters.

Tagline: **Smart by nature. Loyal by design.**
