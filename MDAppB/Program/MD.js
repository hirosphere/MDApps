var MD = {};

MD.App = class_def
(
	null,
	function()
	{
		this.Initiate = function( data_dir, demo_mode )
		{
			this.FS = demo_mode ? new HTTPFS( data_dir ) : new HTAFS( data_dir );
			
			this.ページ構成 = this.FS.LoadValue( "ページ構成.json" );
		};
	}
);

MD.Record = class_def
(
	Model,
	function()
	{
		this.Add = function( key, fileds )
		{
		};
		
		this.File_Key = function( key ) { return key + ".txt"; };
	}
);



MD.メッセージ = class_def
(
	MD.Record,
	function()
	{
	}
);


MD.資材 = class_def
(
	MD.Record,
	function()
	{
	}
);
