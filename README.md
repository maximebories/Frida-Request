# Frida-Request
Work In progress to capture all sorts of data transactions using the Frida framework.

### Example usage:

    frida --usb --attach-frontmost --load NSURL.js --output=$(echo NSURL-"`date +%s`.json") --no-pause
    
In this exemple the script capture POST/GET requests avec attaching to the frontmost app. Epoch time of the start of the capture is appended to the filename of the log.     
    

**It should be noted that spawning migth be a smarter choice here as it is more likely that more requests ared fired at app launch.**

<img width="1344" alt="NSURL" src="https://user-images.githubusercontent.com/30550722/125180674-09a95580-e1fd-11eb-8e70-70294064d2b1.png">

### ToDo:
* Swift Bridging
* Capture URLResponse
* Handle from top level Request or Session
* SQLite Transactions captures
* Statistical Analysis Framework for recurent Requests/Sessions
