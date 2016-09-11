
var Labo = {};

Labo.Tree = class_def
(
	null,
	function( com )
	{
		this.Initiate = function( com )
		{
			this.e = enew( "div", com );
			
			var str = FS.Load( MD_Data_Dir + "ページ構成.json", true, "damedesita" );
			
			var src = value_json( str );
			
			var tree = new Tree();
			tree.SetSource( src );
			
			//e_plain( this.e, tree );
		}
	}
);
