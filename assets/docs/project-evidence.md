# Project evidence and figure notes

Reviewed October 18, 2026. These notes describe the evidence behind the
repository additions and the figures used on the portfolio.

## Bird-call classification

[Feature extraction](https://github.com/boubakar12/bird-call-classification/blob/main/step_2_build_rich_features.py)
and [ensemble implementation](https://github.com/boubakar12/bird-call-classification/blob/main/hgb_1.py).
The supplied archive contains 20,000 labeled training clips across eight classes
and 4,000 test clips. Its duplicate ZIP contains the same files.

The spectrogram illustrates `train/train_0.wav`. It is a signal visualization,
not a classification result. No accuracy claim was added without a stored
evaluation result.

## Hexagonian digit classification

[Implementation and embedded training logs](https://github.com/boubakar12/hexagonian-digit-classification/blob/main/code_beyond_baseline.py)
and the [authored report](Hexagonian_Digit_Classification_Report.pdf).
The 97.66% figure is the best validation accuracy in the logged 80-epoch run.
The diagram is a conceptual view of the residual CNN, not a dataset sample.

## Audio prediction

[Prediction implementation](https://github.com/boubakar12/audio-signal-prediction/blob/main/predict.py).
The portfolio figure was independently reproduced from `bach_8820hz.wav`:

1. Read the 8,820 Hz recording and split it into chronological halves.
2. Build four-observation history windows separately within each half.
3. Fit ordinary least squares with an intercept on the first half.
4. Predict the next sample from the preceding observed samples in the second half.
5. Evaluate R² across the test half: approximately 0.957059.

The trace shows the first 700 test predictions. This is one-step prediction on
one recording, not recursive generation of future audio. The archive's existing
PDFs show gradient-descent experiments, so they were not used as audio-result
figures.

## SAT-4 classification

[Experiment implementation](https://github.com/boubakar12/sat4-knn-svm-classification/blob/main/classify.py)
and [repository overview](https://github.com/boubakar12/sat4-knn-svm-classification).
Inputs have 28 × 28 × 4 = 3,136 values. The engineered representation has eight
features: means and standard deviations of HSV and NIR channels. The models are
k-NN and RBF SVMs. Parameter selection uses the supplied split's scores; the
portfolio does not claim an independent final test result.

The RGB/NIR figure uses the repository's `samples/sample_1` through `sample_4`
images. The SVM plot is rendered from the original `figure4.pdf`.

## African Marble Game and WholeStory Health

The [marble game's public demo](https://boubakar12.github.io/african-marble-game/)
was verified and captured on the review date. Its source is linked separately
from the portfolio case study.

WholeStory's supplied GitHub URL returned a public 404 during review. The
portfolio instead links the supplied [concept presentation](WholeStory_Health_Concept.pdf).
The eight-language web demo and the offline Jetson prototype remain described
separately. The presentation includes proposed capabilities and is labeled as
a concept presentation.

## CS 4750 mobile-robot coursework

Reviewed November 13, 2026, from the supplied `cs4750-hw1-main.zip`,
`cs4750-hw2-main (1).zip`, and `cs4750-hw3-main.zip` archives. The entry is
identified as team coursework. Individual ownership of every component has
not been established, so the description summarizes the coursework sequence.

- HW1 contains ROS-node exercises and submitted screenshots of robot setup,
  teleoperation topic messages, and live LiDAR visualization.
- HW2 contains forward/inverse differential-drive kinematics, wheel odometry,
  transform broadcasting, and measured-versus-predicted wheel-speed plots.
- HW3 contains a LiDAR likelihood model, particle-filter integration,
  low-variance resampling, gyroscope-tuning screenshots, and a team writeup
  with qualitative localization comparisons.

The three portfolio figures come from submitted `writeup/` folders:
`hw1/.../writeup/lidar-foxglove.png`, `hw2/writeup/Q2.1_plot.png`, and
`hw3/writeup/tuned_gyro.png`. Their bytes are preserved in the portfolio.
Starter/example images in the archives' `images/` folders were not used as
student results. The system overview is an explanatory HTML diagram.

This is localization in a supplied map. The case study does not attribute
later motion-planning or feedback-control assignments to these archives.
The pasted syllabus is for Fall 2022; it is not evidence of the student's
course semester, and no semester is assigned to this entry.

Independent review reproduced an in-place resampling defect in the supplied
HW3 implementation: with four particles and weights `[0.5, 0.5, 0, 0]`, selected
ancestors `[0, 0, 1, 1]` are overwritten during sequential copying. The supplied
coursework archives remain unchanged. Full ROS/hardware execution and
quantitative localization validation have not been performed. No accuracy,
recovery-time, or verified-correctness claim is made for this implementation.
