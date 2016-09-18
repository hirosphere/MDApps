var MD = {};

MD.App = class_def
(
	null,
	function()
	{
		this.Initiate = function( data_dir, demo_mode )
		{
			this.FS = new FS( data_dir, demo_mode );
			
			
			var pd = this.FS.Node_Path( "/ページ構成.json" );
			
			this.MemoRecord = new Labo.MemoRecord( this.FS.MakeByPath( "/Memo" ) );
			
			
			this.PhyFS = demo_mode ? new FS.Phy.HTTP( data_dir ) : new FS.Phy.WSH( data_dir );
			this.ページ構成 = this.PhyFS.LoadValue( "ページ構成.json" );
		};
	}
);

MD.Record = class_def
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
		
		this.Write = function( key, data )
		{
			log( [ "MD.Recored.Write", this.Folder.GetPath(), key ] );
			//var folder = this.Folder.MakeByPath( key );
			//log( folder );
		};
		
		this.MakeStorgeNode = function( key )
		{
			
		};
		
		this.MakeStoragePath = function( key )
		{
			
		};
	}
);


MD.資材 = class_def
(
	MD.Record,
	function()
	{
	}
);
