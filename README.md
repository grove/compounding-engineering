# Compounding Engineering

A shared starting point for three collections about making future engineering work easier:

- [Software that improves with age](https://grove.github.io/software-that-improves-with-age/)
- [Engineering that compounds](https://grove.github.io/engineering-that-compounds/)
- [Patterns of compounding engineering](https://grove.github.io/patterns-of-compounding-engineering/)

The site lives at [grove.github.io/compounding-engineering](https://grove.github.io/compounding-engineering/). The [adoption guide](https://grove.github.io/compounding-engineering/adoption/) connects the collections to decisions about investment, funding, ownership, transfer and review in existing engineering organizations.

[Compounding learning](https://grove.github.io/engineering-that-compounds/essays/compounding-learning.html) examines how AI can help teams investigate recurring difficulties, test explanations and keep what helps later work. The [adoption exercise](https://grove.github.io/compounding-engineering/adoption/first-twelve-weeks.html#ai-assisted-investigation) gives a team a bounded way to try it.

The distant aim is to become ten times as effective as a software team with AI. [What would ten times look like?](https://grove.github.io/engineering-that-compounds/essays/what-would-ten-times-look-like.html) gives that ambition a practical role: find what holds useful work up, choose an investment, and check whether later work benefits. The [tenfold exercise](https://grove.github.io/patterns-of-compounding-engineering/guide.html#use-the-tenfold-ambition-to-choose-the-next-investment) helps a team try this on a recent change.

## Work on the site

Edit `index.html`, the pages in `adoption/` and the files in `assets/`. There is no package installation or JavaScript build step. Python 3.10 or later is enough:

```sh
python3 scripts/build.py --check
python3 -m http.server --directory dist 8000
```

Open [localhost:8000](http://localhost:8000). The build copies the site into `dist/`; the check catches missing local pages and assets, broken fragment links, and duplicate HTML IDs. It does not check external websites. Keep generated files out of commits.

The essays and pattern catalogue remain in their own repositories. Link to them rather than keeping another copy here.

## Write like a colleague

Start with a problem an engineer might actually have. Use a concrete example, explain the decision, and include the cost of getting it wrong. A sentence should earn its place; a paragraph should add something the previous one did not.

Keep synthetic examples visibly synthetic. The billing demonstration illustrates a small, sequential, in-memory model. It is not a production payment processor or evidence of measured productivity gains. Separate an observed result from a plausible next step.

Give readers working links to the essays and patterns behind an idea. Avoid promises about compounding unless there is evidence from later work. A useful tool can pay for itself without transforming anyone's career.

## Publish

In the repository's **Settings → Pages**, choose **GitHub Actions** as the publishing source. This setting is separate from the workflow file.

Pull requests build and check the site, then upload a `site-preview` artifact for review. They do not deploy. A push to `main`, or a manual workflow run on `main`, deploys the checked `dist/` directory to GitHub Pages. Existing environment approvals still apply.

## License

[Apache License 2.0](LICENSE).
