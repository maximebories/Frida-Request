// Capture network requests using NSURL
function captureNetworkRequestUsingNSURL() {
	try {
		var className = "NSURLSession";
		var funcName = "- dataTaskWithRequest:completionHandler:";
		var requestMethodHook = eval('ObjC.classes.' + className + '["' + funcName + '"]');

		Interceptor.attach(requestMethodHook.implementation, {
			onEnter: function (args) {
				// Get the request object
				var request = new ObjC.Object(args[2]);

				// Get the request method (e.g., GET, POST)
				var requestMethod = request.HTTPMethod;

				// Get the request URL
				var requestURL = request.URL;

				// Get the request body
				var requestBody = request.HTTPBody;

				// Print the captured data to the console
				console.log('{\n\t"requestType" : "' + requestMethod + '",');
				console.log('\t"url" : "' + requestURL + '",');
				console.log('\t"body" : "' + requestBody + '",');
			},
			onLeave: function (retVal) {
				// Get the response object
				var response = new ObjC.Object(retVal).response();

				// Get the response status code
				var responseStatusCode = response.statusCode;

				// Get the response body
				var responseBody = response.body;

				// Print the captured data to the console
				console.log('\t"responseStatusCode" : "' + responseStatusCode + '",');
				console.log('\t"responseBody" : "' + responseBody + '"\n\},');
			},
		});
	} catch (error) {
		console.log(error);
	}
}

function captureNetworkRequestUsingNSURLConnection() {
	if (ObjC.available) {
		try {
			var className = "NSURLConnection";
			var funcName = "+ sendSynchronousRequest:returningResponse:error:";
			var hook = eval('ObjC.classes.' + className + '["' + funcName + '"]');

			Interceptor.attach(hook.implementation, {
				onEnter: function (args) {
					var request = new ObjC.Object(args[2]);
					var url = request.URL().toString();
					var method = request.HTTPMethod().toString();
					var body = request.HTTPBody().toString();

					console.log(
						"NSURLConnection request: " +
						method +
						" " +
						url +
						"\nRequest body: " +
						body +
						"\n"
					);
				},
			});
		} catch (error) {
			console.log(error);
		}
	}
}

// Capture network requests using AFHTTPSessionManager
function captureNetworkRequestUsingAFHTTPSessionManager() {
	try {
		var className = "AFHTTPSessionManager";
		var funcName = "- POST:parameters:success:failure:";
		var requestMethodHook = eval('ObjC.classes.' + className + '["' + funcName + '"]');

		Interceptor.attach(requestMethodHook.implementation, {
			onEnter: function (args) {
				// Get the request URL
				var requestURL = new ObjC.Object(args[4]).URL;

				// Get the request body
				var requestBody = new ObjC.Object(args[2]);

				// Print the captured data to the console
				console.log('{\n\t"requestType" : "POST",');
				console.log('\t"url" : "' + requestURL + '",');
				console.log('\t"body" : "' + requestBody + '",');
			},
			onLeave: function (retVal) {
				// Get the response object
				var response = new ObjC.Object(retVal).response();

				// Get the response status code
				var responseStatusCode = response.statusCode;

				// Get the response body
				var responseBody = response.body;

				// Print the captured data to the console
				console.log('\t"responseStatusCode" : "' + responseStatusCode + '",');
				console.log('\t"responseBody" : "' + responseBody + '"\n\},');
			},
		});
	} catch (error) {
		console.log(error);
	}
}

// Capture network requests using Alamofire
function captureNetworkRequestUsingAlamofire() {
	try {
		var className = "Alamofire.SessionManager";
		var funcName = "- request:";
		var requestMethodHook = eval('ObjC.classes.' + className + '["' + funcName + '"]');

		Interceptor.attach(requestMethodHook.implementation, {
			onEnter: function (args) {
				// Get the request object
				var request = new ObjC.Object(args[2]);

				// Get the request method (e.g., GET, POST)
				var requestMethod = request.method;

				// Get the request URL
				var requestURL = request.URL;

				// Get the request body
				var requestBody = request.HTTPBody;

				// Print the captured data to the console
				console.log('{\n\t"requestType" : "' + requestMethod + '",');
				console.log('\t"url" : "' + requestURL + '",');


				// Main function to execute all the capturing functions
				function main(captureVolley, captureAFNetworking, captureAlamoFire) {
					// Check if ObjC is available
					if (ObjC.available) {
						// Capture network requests using NSURL
						captureNetworkRequestUsingNSURL();

						// Capture network requests using NSURLConnection
						captureNetworkRequestUsingNSURLConnection();
					}

					// Check if AFNetworking is available and captureAFNetworking flag is set
					if (Module.findExportByName("AFNetworking") && captureAFNetworking) {
						// Capture network requests using AFHTTPSessionManager
						captureNetworkRequestUsingAFHTTPSessionManager();
					}

					// Check if AlamoFire is available and captureAlamoFire flag is set
					if (Module.findExportByName("Alamofire") && captureAlamoFire) {
						// Capture network requests using AlamoFire
						captureNetworkRequestUsingAlamoFire();
					}

					// Check if Volley is available and captureVolley flag is set
					if (Module.findExportByName("com.android.volley.Request") && captureVolley) {
						// Capture network requests using Volley
						captureNetworkRequestUsingVolley();
					}
				}

				// Set the flags to specify which network request methods to capture
				var captureVolley = false;
				var captureAFNetworking = true;
				var captureAlamoFire = true;

				// Execute the main function
				main(captureVolley, captureAFNetworking, captureAlamoFire);