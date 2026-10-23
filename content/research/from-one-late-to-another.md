---
title: "From One LATE to Another: Machine Learning and the External Validity of IV Estimates"
weight: 10
params:
  status: jmp
  link: "/kyungtae-lee-jmp.pdf"
  coauthors: ['<a href="https://sites.google.com/view/alexanderkwon/home">Alexander Kwon</a>']
  presentations:
    - "2027 ASSA Conference (poster)"
    - "2026 Africa Meeting of the Econometric Society"
    - '2026 ASSA Conference (<a href="/from-one-late-to-another-poster.pdf">poster</a>)'
---

Instrumental variable (IV) estimates identify local average treatment effects (LATEs) for compliers, whose composition can differ across populations. We study when a LATE estimated in a sample population can predict the LATE in a target population where only covariates are observed. We decompose prediction error into errors in estimating the LATE in the sample population, predicting treatment-effect heterogeneity across populations, and accounting for the composition of target compliers. We compare interacted two-stage least squares (I2SLS) and Double/Debiased Machine Learning (DML), both using linear treatment-effect models. In controlled Monte Carlo simulations, DML has lower root mean squared prediction error than I2SLS in 26 of 30 settings where the outcome equation contains a linear additive covariate term and in 19 of 30 settings where that term is a step function. In the baseline Card-calibrated simulation, DML has lower root mean squared prediction error than I2SLS, although bias remains when conditional treatment effects are nonlinear. Together, these results show that flexible nuisance estimation can improve LATE prediction, but its benefits depend on which functional forms are misspecified and how treatment-effect heterogeneity is modeled.
