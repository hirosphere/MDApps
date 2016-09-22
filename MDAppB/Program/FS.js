﻿//  レコード  //


var Record = class_def
(
	Model,
	function( Base )
	{
		var next_id = 1000;
		
		this.Initiate = function( folder )
		{
			Base.Initiate.call( this );
			this.Folder = folder;
		};
		
		this.NewKey = function( base )
		{
			return base + ".A" + next_id ++;
		};
		
		this.Read = function( key, initv )
		{
			var record = this.Load( key );
			if( record != Err )
			{
				var item = record[ key ];
				return item === undefined ? initv : item;
			}
			return Err;
		};
		
		this.Write = function( key, data )
		{
			var record = this.Load( key );
			if( record != Err )
			{
				record[ key ] = key;
				return this.Save( key, record );
			}
			return false;
		};
		
		this.Load = function( key )
		{
			var path = this.MakeFilePath( key );
			if( path != null )
			{
				var file = this.Folder.MakeFile( path );
				if( file != null )
				{
					var json = file.Read( Err )
					if( json != Err )
					{
						var record = value_json( json, Err );
						if( record != Err )
						{
							return record || {};
						}
					}
				}
			}
			return Err;
		};
		
		this.Save = function( key, record )
		{
			var path = this.MakeFilePath( key );
			if( path != null )
			{
				var file = this.Folder.MakeFile( path );
				if( file != null )
				{
					var json = json_value( record );
					return file.Write( json );
				}
			}
			return false;
		};
		
		this.MakeFilePath = function( key )
		{
			return key + ".json";
		};
	}
);






//  応用FS  //


var FS = class_def
(
	Tree,
	function( Base )
	{
		this.Initiate = function( root_dir, demo_mode )
		{
			Base.Initiate.call( this );
			this.RootDir = root_dir.replace( /\\/g, "/" );
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
		};
		
		this.Read = function( failv )
		{
			if( this.MakeReal() )
			{
				return this.Tree.Phy.Load( this.GetFSPath(), true, failv );
			}
			else
			{
				return failv;
			}
		};
		
		this.Write = function( value )
		{
			if( this.MakeReal() )
			{
				return this.Tree.Phy.Save( this.GetFSPath(), value, true );
			}
			else
			{
				log( "File.Write " );
			}
			return false;
		};
		
		this.MakeReal = function()
		{
			log( "FS.File.MakeReal " + this.GetFSPath() + " Com: " + this.Com.GetFSPath() );
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
		this.Initiate = function()
		{
		};
		
		//    //
		
		this.FolderExists = function( path ) { return true; }
		this.CreateFolder = function( path ) { return true; }
		this.MakeFile = function( path ) {};
		
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
			FS = FS || new ActiveXObject( "Scripting.FileSystemObject" );
		};
		
		//  //
		
		this.FolderExists = function( path )
		{
			log( [ "FS.Phy.WSH.FolderExists  " + path, FS.FolderExists( path ) ] );
			return FS.FolderExists( path );
		}
		
		this.CreateFolder = function( path )
		{
			var item = FS.CreateFolder( path );
			log( [ "FS.Phy.WSH.CreateFolder " + path, item ] );
			return null != item;
		};
		
		//    //
		
		this.Load = function( path, create, failv )
		{
			var text = "";
			try
			{
				log( "FS.Phy.WSH.Load try " + path );
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
			log( [ "Phy.Save", path, text ] )
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
			return load( path, failv );
		};
		
		
		this.Save = function( path, text, create )
		{
			
			return true;
		};
	}
);
