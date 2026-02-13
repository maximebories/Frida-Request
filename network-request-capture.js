// Copyright (C) 2023 Maxime Bories
//
// This file is part of Frida-Request.
//
// Frida-Request is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Frida-Request is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Frida-Request.  If not, see <http://www.gnu.org/licenses/>.

var requestCount = 0;

function timestamp() {
	var d = new Date();
	var h = ("0" + d.getHours()).slice(-2);
	var m = ("0" + d.getMinutes()).slice(-2);
	var s = ("0" + d.getSeconds()).slice(-2);
	var ms = ("00" + d.getMilliseconds()).slice(-3);
	return h + ":" + m + ":" + s + "." + ms;
}

// ANSI color codes
var RESET = "\x1b[0m";
var DIM = "\x1b[2m";
var BOLD = "\x1b[1m";
var GREEN = "\x1b[32m";
var YELLOW = "\x1b[33m";
var BLUE = "\x1b[34m";
var RED = "\x1b[31m";
var CYAN = "\x1b[36m";
var MAGENTA = "\x1b[35m";

function methodColor(method) {
	switch (method) {
		case "GET":    return GREEN;
		case "POST":   return YELLOW;
		case "PUT":    return BLUE;
		case "PATCH":  return MAGENTA;
		case "DELETE": return RED;
		default:       return RESET;
	}
}

function decodeBody(body) {
	try {
		var bodyStr = "" + body;
		if (bodyStr === "nil" || bodyStr === "null" || bodyStr === "undefined") return null;

		// NSData object — convert to UTF-8 string
		if (bodyStr.match(/length = \d+/)) {
			var nsString = ObjC.classes.NSString.alloc().initWithData_encoding_(body, 4);
			if (nsString) return nsString.toString();
			return null;
		}

		if (bodyStr.length > 0) return bodyStr;
	} catch (e) {}
	return null;
}

function logRequest(interceptor, method, url, body) {
	requestCount++;
	var count = requestCount;
	var time = timestamp();
	var urlStr = "" + url;
	var bodyStr = "" + body;

	// Parse body size
	var bodySize = "";
	var sizeMatch = bodyStr.match(/length = (\d+)/);
	if (sizeMatch) {
		bodySize = sizeMatch[1] + "B";
	} else if (bodyStr !== "nil" && bodyStr !== "null" && bodyStr !== "undefined") {
		bodySize = bodyStr.length + "B";
	}

	var mc = methodColor(method);
	var pad = count < 10 ? "  " : count < 100 ? " " : "";

	var out = DIM + "#" + count + pad + " " + time + RESET
		+ "  " + mc + BOLD + method + RESET
		+ "  " + urlStr
		+ DIM + "  [" + interceptor + "]" + RESET;

	if (bodySize) {
		out += "  " + DIM + bodySize + RESET;
	}

	console.log(out);

	// Decode and print body preview
	var decoded = decodeBody(body);
	if (decoded) {
		var preview = decoded.replace(/[\r\n]+/g, " ");
		if (preview.length > 200) preview = preview.substring(0, 200) + "...";
		console.log(DIM + "    \u21b3 " + CYAN + preview + RESET);
	}
}

// Capture network requests using NSURLSession (request + completionHandler)
function captureNetworkUsingNSURL() {
	try {
		var hook = ObjC.classes.NSURLSession["- dataTaskWithRequest:completionHandler:"];
		if (!hook) throw new Error("NSURLSession dataTaskWithRequest:completionHandler: not found");

		Interceptor.attach(hook.implementation, {
			onEnter: function (args) {
				try {
					var request = new ObjC.Object(args[2]);
					logRequest(
						"NSURLSession",
						"" + request.HTTPMethod(),
						request.URL(),
						request.HTTPBody()
					);
				} catch (e) {
					console.log("NSURLSession onEnter error: " + e);
				}
			},
		});
	} catch (error) {
		console.log("NSURLSession (request) hook failed: " + error);
	}
}

function main() {
	console.log("\n==========================================================");
	console.log("  Frida-Request  --  Network Capture Started");
	console.log("  " + new Date().toString());
	console.log("==========================================================\n");

	if (ObjC.available) {
		captureNetworkUsingNSURL();
	} else {
		console.log("Unsupported platform");
	}

	console.log("Listening for network requests...\n");
}

main();

