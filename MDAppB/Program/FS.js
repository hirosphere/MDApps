
var FS = class_def
(
	Tree,
	function( Base )
	{
		this.Initiate = function( root_dir, demo_mode )
		{
			Base.Initiate.call( this );
			this.RootDir = root_dir.replace( /\\/g, "/" );
			this.Phy = demo_mode ? new FS.Phy.HTTP( root_dir ) : new FS.Phy.WSH( root_dir );
			
			this.SetRoot( new FS.Folder( "" ) );
		};
		
		this.MakeByPath = function( path )
		{
			var iter = this.Root;
			var path = path.split( "/" );
			
			for( var n = 1; n < path.length; n ++ )
			{
				var name = path[ n ];
				var field = iter.GetField( name );
				if( field == null )
				{
					var leaf = n == path.length - 1;
					field = ( leaf ? new FS.File( name ) : new FS.Folder( name ) );
					iter.Add( field, null, name );
				}
				iter = field;
			}
			
			return iter;
		};
	}
);


FS.Node = class_def
(
	Node,
	function( Base )
	{
		this.Initiate = function( name )
		{
			Base.Initiate.call( this );
			this.Name = name;
		};
	}
);


FS.Folder = class_def
(
	FS.Node,
	function( Base )
	{
		this.Initiate = function( name )
		{
			Base.Initiate.call( this, name );
			log( "FS.Folder.Initiate : " + this.Name );
		};
	}
);


FS.File = class_def
(
	FS.Node,
	function( Base )
	{
		this.Initiate = function( name )
		{
			Base.Initiate.call( this, name );
			log( "FS.File.Initiate : " + this.Name );
		};
		
		this.toString = function() { return this.Name; };
	}
);



FS.Phy = {};

FS.Phy.Base = class_def
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


FS.Phy.WSH = class_def
(
	FS.Phy.Base,
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


FS.Phy.HTTP = class_def
(
	FS.Phy.Base,
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
