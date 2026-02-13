#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["frida-tools"]
# ///

import re
import sys
import signal
import subprocess
from pathlib import Path

# Frida REPL prompt prefix, e.g. "[iPhone::PID::15360 ]-> "
REPL_PROMPT = re.compile(r"\[.+?::.+?\]->\s?")

SCRIPT_PATH = Path(__file__).parent / "network-request-capture.js"
LOG_PATH = Path(__file__).parent / "capture.log"


def main():
    target = None
    mode = "frontmost"

    for i, arg in enumerate(sys.argv[1:], 1):
        if arg in ("-p", "--pid"):
            mode = "pid"
            target = sys.argv[i + 1]
        elif arg in ("-n", "--name"):
            mode = "name"
            target = sys.argv[i + 1]

    # Build frida command — use -l (load file) to avoid echoed script noise from -e
    cmd = ["frida", "-U"]

    if mode == "pid":
        cmd += ["-p", target]
    elif mode == "name":
        cmd += ["-n", target]
    else:
        cmd += ["-F"]

    cmd += ["-l", str(SCRIPT_PATH)]

    # Clear log file
    open(LOG_PATH, "w").close()

    print(f"Logging to {LOG_PATH}\n")

    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        stdin=subprocess.PIPE,
        text=True,
    )

    def shutdown(*_):
        proc.terminate()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)

    # Suppress all Frida output (echoed script + REPL chrome) until the script
    # prints "Listening for network requests", then show everything after that.
    ready = False
    with open(LOG_PATH, "a") as log:
        for line in proc.stdout:
            line = line.rstrip("\n")

            # Strip REPL prompt prefix from all lines
            line = REPL_PROMPT.sub("", line)

            if not ready:
                if "Listening for network requests" in line:
                    ready = True
                    print("Listening for network requests...\n", flush=True)
                continue

            print(line, flush=True)

            # Only log request lines and body previews
            if not any(t in line for t in ("[NSURLSession]", "\u21b3")):
                continue
            log.write(line + "\n")
            log.flush()

    proc.wait()


if __name__ == "__main__":
    main()
