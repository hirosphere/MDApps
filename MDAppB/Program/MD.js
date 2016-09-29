var MD = {};

MD.App = class_def
(
	null,
	function()
	{
		this.Initiate = function( data_dir, demo_mode )
		{
			this.FS = new FS( data_dir, demo_mode );
			this.MakeDemo();
			var root = this.FS.Root;
			
			this.ページ構成 = this.FS.Root.MakeFile( "ページ構成.json", true ).LoadValue();
			
			this.MemoRecord = new Labo.MemoRecord( this.FS.Root.MakeFolder( "Memo" ) );
			
			
			this.資材定義作成();
			this.資材TL = new MD.資材TL( root.MakeFolder( "資材" ), "In" );
		};
		
		this.MakeDemo = function()
		{
			var root = this.FS.RootDir;
			
			var list =
			[
				root + "/ページ構成.json"
			];
			
			this.FS.Phy.LoadReals( list );
		};
		
		this.資材定義作成 = function()
		{
			this.資材定義 =
			{
			};
		};
	}
);



MD.資材 = class_def
(
	null,
	function()
	{
		this.Initiate = function( 資材Id, 製品名, 業者名, 重量, 賞味期限, ロット, 記録日時 )
		{
			this.資材Id = 資材Id;
			this.重量 = 重量;
			this.賞味期限 = 賞味期限;
			this.ロット = ロット;
			this.製品名 = 製品名;
			this.業者名 = 業者名;
			this.記録日時 = 記録日時;
		};
	}
);


MD.資材TL = class_def
(
	Record,
	function( Base )
	{
		this.Initiate = function( folder, prefix )
		{
			Base.Initiate.call( this, folder );
			this.Prefix = prefix;
		};
		
		this.MakeKey = function( fkey, serial )
		{
			return fkey + "-T-" + serial
		};
		
		this.MakeFileKey = function( key )
		{
			var m = key && key.match( /(\d{4})(\d{2})(\d{2})(.+)/ );
			return m && str_format( "{1}{2}{3}", m ) || null;
		};
		
		this.MakeFilePath = function( fkey )
		{
			var m = fkey && fkey.match( /(\d{4})(\d{2})(\d{2})/ );
			log( "MD.資材TL.MakeFilePath  " + str_format( "{1}/{2}/{Prefix}{1}{2}{3}.json", m, this ) );
			return m && str_format( "{1}/{2}/{Prefix}{3}.json", m, this ) || null;
		};
	}
);

MD.資材庫 = class_def
(
	Model,
	function( Base )
	{
		this.Initiate = function()
		{
			Base.Initiate.call( this );
			
			this.Racks = {};
		};
		
		this.Add = function( mat_id, record )
		{
			var rack = this.Racks[ mat_id ];
			
			if( rack == null )
			{
				rack = this.Racks[ mat_id ] = new Rack();
			}
			
			rack.Add( record );
		};
		
		var Rack = class_def
		{
			null,
			function()
			{
				this.Initiate = function()
				{
					this.Items = [];
				};
				
				this.Add = function( record )
				{
					this.Items.push( record );
				};
			}
		};
	}
);

