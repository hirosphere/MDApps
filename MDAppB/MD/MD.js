var MD = {};

MD.App = class_def
(
	null,
	function()
	{
		this.Initiate = function( data_dir, demo_mode )
		{
			this.FS = new FS( data_dir, demo_mode );
			demo_mode && this.MakeDemo();
			
			var root = this.FS.Root;
			
			this.ページ構成 = root.MakeFile( "App/Book.json", true ).LoadValue();
			
			
			this.Files = {};
			
			// 定義データ //
			
			this.Files.資材定義 = root.MakeFile( "Defs/Shizai.json", true );
			
			
			
			
			// 記録 //
			
			this.資材TL = new MD.資材TL( root.MakeFolder( "資材/TL" ) );
			
			this.MemoRecord = new Labo.MemoRecord( this.FS.Root.MakeFolder( "Memo" ) );
		};
		
		this.MakeDemo = function()
		{
			var root = this.FS.Root.GetFSPath() + "/";
			var list =
			[
				root + "Defs/Shizai.json",
				root + "App/Book.json"
			];
			
			this.FS.Phy.LoadReals( list );
		};
	}
);



function tsv_rfs( rfs )
{
	var rt = "";
	for( var key in rfs )
	{
		rt += key + "\t";
		rt += rfs[ key ].join( "\t" ) + "\r\n";
	}
	return rt;
};

function rfs_tsv( tsv )
{
	var rt = {};
	
	for( var lines = tsv.split( /\r?\n/g ), i = 0; i < lines.length; i ++ )
	{
		var line = lines[ i ].split( "\t" );
		if( line.length == 0 )  continue;
		
		var key = line.shift();
		rt[ key ] = line;
	}
	return rt;
}

