# Frida-Request
Work In progress to capture all sorts of data transactions.

Example usage:

    frida --usb --attach-frontmost --load NSURL.js --output=$(echo NSURL-"`date +%s`.json") --no-pause

It should be noted that spawning migth be a smarter choice here as it is more likely that more requests ared fired at app launch.

<img width="1344" alt="NSURL" src="https://user-images.githubusercontent.com/30550722/125180674-09a95580-e1fd-11eb-8e70-70294064d2b1.png">

TODO:
- Swift equivalence
- SQLite Transactions captures
- Statistical Analysis for recurent requests
