var File = class_def
(
	null,
	function()
	{
		
	}
);


var FSBase = class_def
(
	null,
	function()
	{
		this.Initiate = function( data_dir )
		{
			this.DataDir = data_dir;
		};
		
		//    //
		
		this.GetFile = function( filepath ){}
		
		//    //
		
		this.LoadValue = function( path, create, failv )
		{
			var json = this.Load( path, create );
			return json === undefined ? failv : value_json( json );
		};
	}
);


var HTAFS = class_def
(
	FSBase,
	function( Base )	
	{
		var FS;
		
		this.Initiate = function( data_dir )
		{
			Base.Initiate.call( this, data_dir );
			FS = new ActiveXObject( "Scripting.FileSystemObject" );
		};
		
		//    //
		
		this.GetFile = function( filepath )
		{
			
		};
		
		//    //
		
		this.Load = function( path, create, failv )
		{
			try
			{
				var stream = FS.OpenTextFile( this.DataDir + path, 1, create, -1 );
				return stream.AtEndOfLine ? "" : stream.ReadAll();
			}
			catch( exc )
			{
				return failv;
			}
			finally
			{
				stream && stream.Close();
			}
		};
		
		this.Save = function( path, text, create )
		{
		
		};

	}
);

var HTTPFS = class_def
(
	FSBase,
	function()
	{
		
		function new_req()
		{
			if( window.XMLHttpRequest ) return new XMLHttpRequest();
			if( window.ActiveXObject ) return new ActiveXObject( 'Msxml2.XMLHTTP' );
			return null;
		}
		
		
		function load( path, failv )
		{
			var req = new_req();
			path = path.replace( /\\/, "/" );
			req.open( "get", path, false );
			req.send( null );

			return req.status == 200 ? req.responseText : failv;
		};
		
		
		this.Load = function( path, create, failv )
		{
			return load( this.DataDir + path, failv );
		};
		
		
		this.Save = function( path, text, create )
		{
		
		};
	}
);
