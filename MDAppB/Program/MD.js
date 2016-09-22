var MD = {};

MD.App = class_def
(
	null,
	function()
	{
		this.Initiate = function( data_dir, demo_mode )
		{
			this.FS = new FS( data_dir, demo_mode );
			
			
			var pd = this.FS.Root.MakeFile( "/ページ構成.json", true );
			
			this.MemoRecord = new Labo.MemoRecord( this.FS.Root.MakeFolder( "Memo" ) );
			
			
			this.PhyFS = demo_mode ? new FS.Phy.HTTP( data_dir ) : new FS.Phy.WSH( data_dir );
			this.ページ構成 = this.PhyFS.LoadValue( data_dir + "/ページ構成.json" );
		};
	}
);

MD.資材 = class_def
(
	Record,
	function()
	{
	}
);
