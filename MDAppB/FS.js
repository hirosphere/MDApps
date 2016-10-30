//  応用FS  //


var FS = class_def
(
	Tree,
	function( Base )
	{
		this.Initiate = function( root_dir, demo_mode )
		{
			Base.Initiate.call( this );
			this.RootDir = root_dir;
			this.Phy = demo_mode ? new FS.Phy.HTTP() : new FS.Phy.WSH();
			
			this.SetRoot( new FS.Folder( "" ) );
		};
	}
);


FS.Node = class_def
(
	Node,
	function( Base )
	{
		this.Initiate = function()
		{
			Base.Initiate.call( this );
		};
		
		this.GetFSPath = function()
		{
			return this.Tree.RootDir + this.GetPath();
		};
	}
);


FS.Folder = class_def
(
	FS.Node,
	function( Base )
	{
		this.Initiate = function()
		{
			Base.Initiate.call( this );
		};
		
		this.MakeFolder = function( path )
		{
			if( path.constructor == String )  path = path.split( "/" );
			var name = path.shift();
			var field = this.GetField( name ) || this.Add( new FS.Folder(), null, name );
			return path.length == 0 ? field : field && field.MakeFolder( path ) || null;
		};
		
		this.MakeFile = function( path )
		{
			if( path.constructor == String )  path = path.split( "/" );
			var filename = path.pop();
			var folder = path.length > 0 ? this.MakeFolder( path ) : this;
			var file = folder.GetField( filename ) || folder.Add( new FS.File(), null, filename );
			return file;
		};
		
		this.MakeReal = function()
		{
			var phy = this.Tree.Phy;
			if( phy.FolderExists( this.GetFSPath() ) )  return true;
			if( this.Com == null )  return false;
			return this.Com.MakeReal() ? phy.CreateFolder( this.GetFSPath() ) : false;
			
		};
	}
);


FS.File = class_def
(
	FS.Node,
	function( Base )
	{
		this.Initiate = function()
		{
			Base.Initiate.call( this );
			
			this.Value = undefined;
		};
		
		this.GetValue = function( failv )
		{
			if( this.Value !== undefined )  return this.Value;
			
			this.LoadValue( failv );
			return this.Value;
		};
		
		this.LoadValue = function( failv )
		{
			if( this.MakeReal() )
			{
				this.Value = this.Tree.Phy.LoadValue( this.GetFSPath(), true, failv );
				return this.Value;
			}
			
			return failv;
		};
		
		this.SaveValue = function( value )
		{
			this.Value = value;
			
			if( this.MakeReal() )
			{
				return this.Tree.Phy.SaveValue( this.GetFSPath(), value, true );
			}
			
			return false;
		};
		
		this.Load = function( failv )
		{
			if( this.MakeReal() )
			{
				return this.Tree.Phy.Load( this.GetFSPath(), true, failv );
			}
			
			return failv;
		};
		
		this.Save = function( text )
		{
			if( this.MakeReal() )
			{
				return this.Tree.Phy.Save( this.GetFSPath(), text, true );
			}
			
			return false;
		};
		
		this.MakeReal = function()
		{
			return this.Com && this.Com.MakeReal();
		};
		
		this.toString = function() { return this.Name; };
	}
);




//  物理FS  //


FS.Phy = {};

FS.Phy.Base = class_def
(
	null,
	function()
	{
		
		this.FolderExists = function( path )
		{
			return true;
		};
		
		this.CreateFolder = function( path )
		{
			return true;
		};
		
		this.MakeFile = function( path )
		{
		};
		
		
		//    //
		
		this.LoadValue = function( path, create, failv )
		{
			var json = this.Load( path, create, failv );
			
			return json === failv ? failv : value_json( json );
		};
		
		this.SaveValue = function( path, value, create )
		{
			var json = json_value( value );
			return this.Save( path, json, create );
		};
		
		
		//    //
		
		this.LoadReals = function( path_list )
		{
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
			FS = FS || new ActiveXObject( "Scripting.FileSystemObject" );
		};
		
		//  //
		
		this.FolderExists = function( path )
		{
			path = path.replace( /\//g, "\\" );
			
			// log( [ "FS.Phy.WSH.FolderExists  " + path, FS.FolderExists( path ) ] );
			return FS.FolderExists( path );
		}
		
		this.CreateFolder = function( path )
		{
			path = path.replace( /\//g, "\\" );
			
			var item = FS.CreateFolder( path );
			
			log( [ "FS.Phy.WSH.CreateFolder " + path, item ] );
			
			return null != item;
		};
		
		//    //
		
		this.Load = function( path, create, failv )
		{
			log( "FS.Phy.WSH.Load : " + path );
			
			path = path.replace( /\//g, "\\" );
			
			var text = "";
			
			try
			{
				var stream = FS.OpenTextFile( path, 1, create, -1 );
				return text = stream.AtEndOfLine ? "" : stream.ReadAll();
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
			log( "FS.Phy.WSH.Save : " + path );
			
			path = path.replace( /\//g, "\\" );
			
			try
			{
				var stream = FS.OpenTextFile( path, 2, create, -1 );
				stream.Write( text );
			}
			
			catch( exc )
			{
				return false;
			}
			
			finally
			{
				stream && stream.Close();
			}
			
			return true;
		};
	}
);


FS.Phy.HTTP = class_def
(
	FS.Phy.Base,
	function( Base )
	{
		this.Initiate = function()
		{
			Base.Initiate.call( this );
			
			this.Cache = {};
		};
		
		//  //
		
		
		this.LoadReals = function( path_list )
		{
			for( var i in path_list )
			{
				var path = path_list[ i ];
				
				this.Cache[ path ] = load( path );
			}
		};
		
		//  //
		
		
		this.Load = function( path, create, failv )
		{
			return this.Cache[ path ] || failv;
		};
		
		
		this.Save = function( path, text, create )
		{
			this.Cache[ path ] = text;
			return true;
		};
		
		
		//   //
		
		function new_req()
		{
			if( window.XMLHttpRequest ) return new XMLHttpRequest();
			if( window.ActiveXObject ) return new ActiveXObject( 'Msxml2.XMLHTTP' );
			return null;
		}
		
		function load( path, failv )
		{
			var req = new_req();
			req.open( "get", path, false );
			req.send( null );

			return req.status == 200 ? req.responseText : failv;
		};
		
	}
);
