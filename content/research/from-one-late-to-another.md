---
title: "From One LATE to Another: Machine Learning and the External Validity of IV Estimates"
weight: 10
params:
  status: jmp
  link: "/kyungtae-lee-jmp.pdf"
  coauthors: ['<a href="https://sites.google.com/view/alexanderkwon/home">Alexander Kwon</a>']
  presentations:
    - "2027 ASSA Conference (poster)"
    - "2026 Africa Meeting of the Econometric Society (presented by coauthor)"
    - '2026 ASSA Conference (<a href="/from-one-late-to-another-poster.pdf">poster</a>)'
---

Instrumental variable (IV) estimates identify local average treatment effects (LATEs) for compliers, whose composition can differ across populations. We study when a LATE estimated in a sample population can predict the LATE in a target population. We decompose the prediction error of the benchmark model, interacted two-stage least squares (I2SLS), into four terms and study which terms a more flexible model, Double/Debiased Machine Learning (DML), can reduce. Among them, we show that terms related to nonlinearity in the instrument propensity and outcome equations are significantly reduced by DML, but two terms, one related to the nonlinearity of the Conditional Average Treatment Effect and the other related to compliance weights, are not. We find that this decomposition is important because the overall prediction error can be small even when the individual terms are large, as they can cancel each other out due to differences in their signs. We apply these results in two Monte Carlo simulations, including one calibrated to data, and find supporting evidence.
