# Working on this site

Read the README for build and publishing details. Keep the site small: plain HTML, CSS and browser JavaScript, with a Python standard-library build.

Write as an engineer talking to a colleague. Prefer a specific problem and a useful example to slogans, inflated promises or repeated summaries. Keep humor occasional. Do not invent the author's experiences, quotations, measurements or production results. Identify synthetic examples and state what their checks leave open.

The three collections are the source material. Check the relevant essay or pattern before describing it; keep links to the published pages. Preserve the distinction between storing something, reusing it, and making later investments easier.

Before finishing, run `python3 scripts/build.py --check`. Check changed interactive behavior in a browser when one is available. Keep reading and navigation usable without JavaScript, keyboard focus visible, and motion respectful of the reader's preferences. Do not commit `dist/` or local preview configuration.
