UI.Content.Types.資材定義 = class_def
(
	UI.Content,
	function( Base )
	{
		this.BuildTop = function()
		{
			this.File = this.MD.Files.資材定義;
			var mdef = this.File.GetValue();
			//var s = str_value( mdef );

			var table = enew( "table", this.e, {}, { marginBottom: "20px" } );
			this.tbody = enew( "tbody", table );
			
			
			this.make_textarea();
			this.update();
		};
		
		this.make_textarea = function()
		{
			var hr = enew( "div", this.e, {}, { marginBottom: "2px" } );
			var bu_out = enew_t( "button", hr, "TSV作成" );
			var bu_in = enew_t( "button", hr, "TSVを反映・保存" );
			
			var hr = enew( "div", this.e );
			var text_io = enew( "textarea", hr, {}, { width: "800px", height: "300px" } );
			
			
			var self = this;
			
			bu_out.onclick = function()
			{
				text_io.value = tsv_rfs( self.File.GetValue() );
			};
			
			bu_in.onclick = function()
			{
				var rfs = rfs_tsv( text_io.value );
				log( json_value( rfs ) );
				self.File.SaveValue( rfs );
				self.update();
			};
		};
		
		this.update = function()
		{
			e_clear( this.tbody );
			
			var data = this.File.GetValue();
			for( var id in data )
			{
				var tr = enew( "tr", this.tbody );
				
				enew_t( "td", tr, id );
				
				var cols = data[ id ];
				for( var i = 0; i < 9; i ++ )
				{
					enew_t( "td", tr, i >= cols.length ? "" : cols[ i ] );
				}
			}
		};
		
		function mk_table( com, data )
		{
		}
	}
);

