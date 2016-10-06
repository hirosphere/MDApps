UI.Content.Types.資材定義 = class_def
(
	UI.Content,
	function( Base )
	{
		this.BuildTop = function()
		{
			var mdef = this.MD.Files.資材定義.LoadValue();
			//var s = str_value( mdef );
			mk_table( this.e, mdef );
		};
		
		function mk_table( com, data )
		{
			var table = enew( "table", com );
			var tbody = enew( "tbody", table );
			
			for( var id in data )
			{
				var tr = enew( "tr", tbody );
				
				enew_t( "td", tr, id );
				
				var cols = data[ id ];
				for( var i = 0; i < 9; i ++ )
				{
					enew_t( "td", tr, i >= cols.length ? "" : cols[ i ] );
				}
			}
		}
	}
);

