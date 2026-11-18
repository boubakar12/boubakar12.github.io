# ECE 3140 Occupancy Counter

Team coursework by **bd453 & jlp378** for the FRDM-KL46Z.

## Source layout

- `firmware/` contains the MCUXpresso project metadata, board support files,
  device drivers, and the supplied `source/main.c`.
- `experiments/laser.c` contains a separate two-light-sensor experiment. It is
  not the active board `main.c` and references LCD support files that were not
  present in the supplied archive.
- `usb_bridge.py` reconnects to a USB serial device and appends parsed
  colon-delimited messages to `occupancy_log.csv` when run.

## Implementation notes

The supplied board `main.c` handles manual entry/exit button inputs, updates
capacity-threshold LEDs, and emits UART events. Its VL53L0X initialization is
commented out. The separate `laser.c` polls two light-dependent sensors on a
10 ms timer and infers crossing direction from beam-break order, but the
archive does not include its LCD implementation or show this experiment
integrated into the board project. The Python bridge currently accepts
colon-delimited debug messages as well as entry/exit events.

This is a coursework source snapshot; the hardware paths and a combined build
were not independently verified. Generated IDE support caches, compiled
`Debug/` output, and the sample occupancy log from the archive are omitted.
The firmware retains the provided NXP SDK source files and may still require a
matching MCUXpresso device package to build in the IDE.
