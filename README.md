# Compounding Engineering

A practical starting point for transforming how software engineering is performed.

The ambition is an engineering system with greater capacity to discover, create, evolve and operate software. Constraint removal guides investment: eliminate unnecessary work, redesign dependencies and automate the remaining work wherever it can meet its purpose at a worthwhile total cost. Retained capabilities can make further transformation cheaper or more effective; later work has to establish whether they do.

Three collections develop the argument:

- [Software that improves with age](https://grove.github.io/software-that-improves-with-age/)
- [Engineering that compounds](https://grove.github.io/engineering-that-compounds/)
- [Patterns of compounding engineering](https://grove.github.io/patterns-of-compounding-engineering/)

The site lives at [grove.github.io/compounding-engineering](https://grove.github.io/compounding-engineering/). Its opening distinguishes acceleration, automation and transformation. The [adoption guide](https://grove.github.io/compounding-engineering/adoption/) helps teams redesign a constrained workflow, including decisions about investment, authority, funding, transfer and reinvestment.

[How organizations become more capable](https://grove.github.io/compounding-engineering/foundations.html) sets out the theory: transformation as the ambition, constraints as the investment guide, and compounding as a mechanism to investigate. It preserves the distinctions between accumulated capital, demonstrated capability, recurring returns and easier development of subsequent capabilities.

[Software farms and software factories](https://grove.github.io/compounding-engineering/#operating-models) illustrate different ways to organize engineering. Farms investigate and cultivate; factories implement and deliver. Their findings and operating results can also improve the engineering machinery itself. The source essays are [Continuous cultivation of software](https://grove.github.io/software-that-improves-with-age/essays/continuous-cultivation-of-software.html) and [Automating the work of engineering](https://grove.github.io/engineering-that-compounds/essays/automating-the-work-of-engineering.html).

The [investment worksheet](https://grove.github.io/compounding-engineering/adoption/investment-canvas.html) helps a team choose one bounded redesign. Its hypothetical environment-provisioning example examines work removed, human intervention, time to outcome, total cost and the next investment. It can copy a note into an existing issue. Entries stay in the browser page; there is no server, tracking or saved draft.

[Compounding learning](https://grove.github.io/engineering-that-compounds/essays/compounding-learning.html) examines how AI can help teams investigate recurring difficulties, test explanations and keep what helps later work. The [adoption exercise](https://grove.github.io/compounding-engineering/adoption/first-twelve-weeks.html#ai-assisted-investigation) gives a team a bounded way to try it.

The distant aim is to become ten times as effective as a software team with AI. It is an ambition that motivates redesign of the whole engineering system, not a measured result. [What would ten times look like?](https://grove.github.io/engineering-that-compounds/essays/what-would-ten-times-look-like.html) and the [tenfold exercise](https://grove.github.io/patterns-of-compounding-engineering/guide.html#use-the-tenfold-ambition-to-choose-the-next-investment) help a team find what limits useful outcomes and choose its next investment.

## Work on the site

Edit `index.html`, `foundations.html`, the pages in `adoption/` and the files in `assets/`. There is no package installation or JavaScript build step. Python 3.10 or later is enough:

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
