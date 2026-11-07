# Article dates

- Article `datePublished` and `dateModified` are fixed editorial dates, never build dates.
- Change `dateModified` only when the article text changes. Shared footer, layout, image presentation, metadata-only changes, or a new build do not refresh it.
- Derive any visible "Updated" label from that article's fixed `dateModified`.
- Keep React and static JSON-LD on the same metadata source.
- Service cards and category pages may continue using the build date.
