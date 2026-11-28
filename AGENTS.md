# Working on this site

These repositories are publications: their purpose is to help readers understand and pursue ambitious engineering outcomes through prose. Keep code limited to helper utilities needed to publish, maintain or support the reading experience. Do not turn the publications into implementation projects or operational engineering laboratories. Use clearly identified illustrative examples, documented evidence and reader-facing experiments instead.

Read the README for build and publishing details. Keep the site small: plain HTML, CSS and browser JavaScript, with a Python standard-library build.

Write as an engineer talking to a colleague. Prefer a specific problem and a useful example to slogans, inflated promises or repeated summaries. Keep humor occasional. Do not invent the author's experiences, quotations, measurements or production results. Identify synthetic examples and state what their checks leave open.

The four companion collections are the source material. Check the relevant essay or pattern before describing it; link to published pages, or to the Markdown collection until a publication site is available. Preserve the distinction between storing something, reusing it, and making later investments easier.

Before finishing, run `python3 scripts/build.py --check`. Check changed interactive behavior in a browser when one is available. Keep reading and navigation usable without JavaScript, keyboard focus visible, and motion respectful of the reader's preferences. Do not commit `dist/` or local preview configuration.
