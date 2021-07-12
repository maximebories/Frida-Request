if (ObjC.available)
{
	try
	{
		var className = "NSURLSession";
		var funcName = "- dataTaskWithRequest:completionHandler:";
		var hook = eval('ObjC.classes.' + className + '["' + funcName + '"]');

		Interceptor.attach(hook.implementation,
		{
			onEnter: function(args)
			{
				var httpBodyNSdata = ObjC.Object(args[2]).HTTPBody();
				var httpBodyNSstring = ObjC.classes.NSString.alloc().initWithData_encoding_(httpBodyNSdata, 4);

				console.log('{\n\t"requestType" : "' + ObjC.Object(args[2]).HTTPMethod() + '",');
				console.log('\t"url" : "' + ObjC.Object(args[2]).URL() + '",');
				console.log('\t"string" : [' + httpBodyNSstring + '],');
				console.log('\t"body" : "' + httpBodyNSdata + '"\n\},');
			},
		});
	}
	catch (error)
	{
		console.log(err);
	}
}