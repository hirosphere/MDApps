UI.資材在庫Node = class_def
(
	Node,
	function( Base )
	{
		this.CreateDynFields = function()
		{
		
		};
	}
);

UI.Content.Types.資材在庫 = class_def
(
	UI.Content,
	function( Base )
	{
		this.BuildTop = function()
		{
			var mdef = this.MD.Files.資材定義.LoadValue();
			var j = this.MD.Files.資材定義.Load();
			var s = str_value( mdef );
			enew_t( "p", this.e, "資材定義:\r\n" + s );
		};
	}
);

log( "UI.Content.資材在庫" );

UI.資材在庫;

