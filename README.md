# Compounding Engineering

Our ambition is to become ten times more effective at delivering valuable software outcomes with AI. These publications explore what engineering would have to become for that to be plausible: which work could disappear, which decisions and procedures could be delegated, and what one improvement could make possible next.

The site is at [grove.github.io/compounding-engineering](https://grove.github.io/compounding-engineering/). It is a publication, developed through essays, practical guidance and clearly identified examples.

## Where to start

- [Where could 10× come from?](https://grove.github.io/engineering-that-compounds/essays/where-could-10x-come-from.html) develops the six mechanisms of transformation and their interactions.
- [Paths towards 10×](https://grove.github.io/compounding-engineering/paths/) compares possible routes from recurring work to different ways of organizing engineering.
- [When every customer needs an integration](https://grove.github.io/compounding-engineering/paths/customer-integrations.html) follows a hypothetical team through rejected designs, product decisions, independent delivery and a later capability.
- [How organizations become more capable](https://grove.github.io/compounding-engineering/foundations.html) explains engineering capital, learning, constraints and what distinguishes compounding from repeatedly using a tool.
- [The team guide](https://grove.github.io/compounding-engineering/adoption/) covers investment, ownership and learning. Its [worksheet](https://grove.github.io/compounding-engineering/adoption/investment-canvas.html) helps frame one attempt.
- [What the evidence supports](https://grove.github.io/compounding-engineering/evidence.html) explains the sources and their limits. The companion [open questions](https://grove.github.io/engineering-that-compounds/research/open-questions.html) describe investigations that could change the argument.

The [billing demonstration](https://grove.github.io/compounding-engineering/examples/two-deliveries-one-payment.html) has its own page. It illustrates how a retained case can help with later changes; it does not measure a team's effectiveness.

## The companion collections

- [Software that improves with age](https://grove.github.io/software-that-improves-with-age/) examines understanding, maintenance, operation and replaceability.
- [Engineering that compounds](https://grove.github.io/engineering-that-compounds/) examines human judgment, organizational capability and different ways of organizing engineering.
- [Patterns of compounding engineering](https://grove.github.io/patterns-of-compounding-engineering/) provides specific interventions with examples, costs and reasons to stop.

Essays and patterns remain in their own repositories. Link to them rather than keeping another copy here.

## Work on the site

Edit the root HTML pages and the files in `adoption/`, `paths/`, `examples/` and `assets/`. The build uses Python's standard library; there is no package installation or JavaScript build step. Python 3.10 or later is enough:

```sh
python3 scripts/build.py --check
python3 -m http.server --directory dist 8000
```

Open [localhost:8000](http://localhost:8000). The build copies the site into `dist/` and checks local pages, assets, fragment links and duplicate HTML IDs. It does not contact external websites. Keep generated files out of commits.

The worksheet keeps entries in the browser page, with no server, tracking or saved draft. Reading and navigation must remain usable without JavaScript. Check interactive changes in a browser, including keyboard operation and narrow screens.

## Write like a colleague

Start with a problem an engineer might recognize. Follow an example far enough to explain the choices, their consequences and when a different answer would be better. Cut sentences that repeat the ambition without advancing the argument.

Keep research findings, published accounts, illustrative examples and hypotheses distinguishable. Link factual claims to the sources that support them. Do not invent the author's experiences, customer results or measurements. The billing demonstration is a sequential, in-memory model, not a production payment processor.

An article should add something the neighboring pieces need. Before adding another explanation of a familiar idea, improve the route to the existing one. When proposing a capability that compounds, identify the later investment it could help and what would count as evidence. A useful tool can justify its upkeep without supporting that stronger claim.

## Publish

In the repository's **Settings → Pages**, choose **GitHub Actions** as the publishing source. This setting is separate from the workflow file.

Pull requests build and check the site, then upload a `site-preview` artifact. A push to `main`, or a manual workflow run on `main`, deploys the checked `dist/` directory to GitHub Pages. Existing environment approvals still apply.

## License

[Apache License 2.0](LICENSE).
