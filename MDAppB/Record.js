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
			
			this.Cache = {};
		};
		
		// 全体操作 //
		
		this.Save = function()
		{
			for( var fkey in this.Cache )
			{
				var cache = this.Cache[ fkey ];
				
				if( cache.Modified )
				{
					this.Folder.MakeFile( cache.FilePath ).SaveValue( cache.Value );
					cache.Modified = false;
				}
			}
		};
		
		this.Flush = function()
		{
			for( var path in this.Cache )  delete this.Cache[ path ];
		};
		
		
		// 不定数データ //
		
		this.Add = function( fkey, data )
		{
			var key = this.MakeKey( fkey, this.GetNextSerial( fkey ) );
			
			this.Set( key, data );
			
			return key;
		};
		
		this.GetNextSerial = function( fkey )
		{
			var cache = this.MakeCache( fkey );
			return cache && ( cache.Value.NextSerial ++ ) || null;
		};
		
		
		// キー決定データ //
		
		this.Get = function( key, initv )
		{
			var value = this.GetFileValue( key );
			
			if( value == null )  return null;
			
			if( value.Content[ key ] === undefined )
			{
				value.Content[ key ] = initv;
			}
			
			return value.Content[ key ];
		};
		
		this.Set = function( key, data )
		{
			var fkey = this.MakeFileKey( key );
			var cache = this.MakeCache( fkey );
			
			if( cache == null )  return false;
			
			cache.Value.Content[ key ] = data;
			cache.Modified = true;
			
			return true;
		};
		
		
		// ファイルヴァリュー //
		
		this.GetFileValue = function( key )
		{
			var fkey = this.MakeFileKey( key );
			var cache = this.MakeCache( fkey );
			return cache && cache.Value || null;
		};
		
		this.MakeCache = function( fkey )
		{
			if( fkey == null )  return null;
			
			var cache = this.Cache[ fkey ];
			var q = 1;
			
			if( cache == undefined )
			{
				var path = this.MakeFilePath( fkey );
				
				cache = this.Cache[ fkey ] =
				{
					FilePath: path,
					Modified : false,
					Value : this.Folder.MakeFile( path ).LoadValue()
				};
				
				if( cache.Value == null )
				{
					cache.Value =
					{
						Q1: path,
						NextSerial: 1,
						Content: {}
					};
				}
			}
			
			return cache;
		};
		
		// キー //
		
		this.MakeKey = function( filekey, serial )
		{
			return filekey + "-" + serial;
		};
		
		this.MakeFileKey = function( key )
		{
			return "Record";
		};
		
		this.MakeFilePath = function( fkey )
		{
			return fkey + ".json";
		};
	}
);

