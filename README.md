# Frida-Request

Capture network requests and responses using the Frida framework in Objective-C and Swift.

## Example usage:

    frida --usb --attach-frontmost --load network-request-capture.js --no-pause

This command will attach the script to the frontmost app and begin capturing network requests and responses.

**It should be noted that spawning migth be a smarter choice here as it is more likely that more requests are fired at app launch.**

## Customization:

To customize which network request methods are captured, you can set the following flags in the main function:

- `captureVolley`: Set to `true` to capture network requests using Volley (Android only).
- `captureAFNetworking`: Set to `true` to capture network requests using AFHTTPSessionManager (Objective-C and Swift).
- `captureAlamoFire`: Set to `true` to capture network requests using AlamoFire (Objective-C and Swift).

You can also modify the main function to specify which app to attach to by using the `--pid` flag and the PID of the app, or by using the `--spawn` flag and the app's package name.

## To-do:

- [x] Capture network requests and responses using NSURL (Objective-C and Swift)
- [x] Capture network requests and responses using NSURLConnection (Objective-C and Swift)
- [x] Capture network requests and responses using AFHTTPSessionManager (Objective-C and Swift)
- [x] Capture network requests and responses using AlamoFire (Objective-C and Swift)
- [x] Capture network requests using Volley (Android only)
- [x] Capture URLResponse (Objective-C and Swift)
- [ ] Capture SQLite local transactions
- [ ] Perform statistical analysis for recurrent Requests/Sessions
