
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
		this.Initiate = function( folder )
		{
			Base.Initiate.call( this, folder );
		};
		
		// new //
		
		this.FileKey_Date = function( date )
		{
			return date_format( "{YYYY}{MM}{DD}", date );
		};
		
		this.Add = function( date, data )
		{
			var fkey = this.FileKey_Date( date );
			return Base.Add.call( this, fkey, data );
		};
		
		this.CreateInputList = function( date )
		{
			return new MD.InputList( this, date );
		};
		
		this.GetDateRows = function( date )
		{
			var fkey = this.FileKey_Date( date );
			var cache = this.MakeCache( fkey );
			return cache.Value.Content;
		};
		
		// overrides //
		
		this.MakeKey = function( fkey, serial )
		{
			return "" + fkey + "-" + serial
		};
		
		this.MakeFileKey = function( key )
		{
			var m = key && key.match( /(\d{4})(\d{2})(\d{2})(.+)/ );
			return m && str_format( "{1}{2}{3}", m ) || null;
		};
		
		this.MakeFilePath = function( fkey )
		{
			var m = fkey && fkey.match( /(\d{4})(\d{2})(\d{2})/ );
			log( "MD.資材TL.MakeFilePath  " + str_format( "{1}/{2}/{3}.json", m, this ) );
			return m && str_format( "{1}/{2}/{3}.json", m, this ) || null;
		};
	}
);

MD.InputList = class_def
(
	List,
	function( base )
	{
		this.Initiate = function( record, date )
		{
			this.Date = date;
			base.Initiate.call( this, record );
		};
		
		this.Update = function()
		{
			var rows = this.Record.GetDateRows( this.Date );
			
			this.Rows = rows;
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

