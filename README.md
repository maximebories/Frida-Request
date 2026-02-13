# Frida-Request

Capture HTTP/HTTPS network requests from iOS apps using the Frida framework.

## Usage

Attach to the frontmost app on a USB-connected device:

    uv run capture.py

Attach by process name or PID:

    uv run capture.py -n RedditApp
    uv run capture.py -p 1234

The script hooks `NSURLSession` in the running process and logs every HTTP request to the terminal (color-coded, with body preview) and to `capture.log`.

> **Note:** Only attach mode is supported. Spawn mode is unreliable because most apps detect Frida at launch and terminate immediately.

## To-do

- [x] Capture requests (GET, POST, PUT, PATCH, DELETE)
- [x] Decode and preview request bodies (JSON, UTF-8)
- [ ] Capture URLResponse
- [ ] Capture SQLite local transactions
- [ ] Perform statistical analysis for recurrent requests/sessions
