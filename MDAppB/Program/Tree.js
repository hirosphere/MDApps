
var Tree = class_def
(
	Model,
	function( Base )
	{
		this.Initiate = function()
		{
			Base.Initiate.call( this );
			
			this.Root = null;
		};
		
		this.SetSource = function( src )
		{
			this.Root = new Node( this, null, src, 0 );
			this.Notify( "Update", [] );
		};
		
		this.Node_Path = function( path )
		{
			var node = this.Root;
			var path = path.split( "/" );
			
			for( var n = 1; node != null && n < path.length; n ++ )
			{
				node = node.GetField( path[ n ] );
			}
			
			return node;
		};
		
		this.toString = function()
		{
			return "Tree\r\n" + ( this.Root ? this.Root : "" );
		};
	}
);

var Node = class_def
(
	null,
	function()
	{
		this.Initiate = function( tree, com, src, order )
		{
			RUId.Next( this );
			
			this.Tree = tree;
			this.Com = com;
			this.Src = src;
			this.Order = order;
			this.Fields = [];
			this.Names = {};
			if( src && src.Fields ) for( var i = 0; i < src.Fields.length; i ++ )
			{
				var f_src = src.Fields[ i ];
				
				var field = new Node( tree, this, f_src, i );
				this.Fields.push( field );
				
				var f_name = f_src.Name;
				if( f_name != null ) this.Names[ f_name ] = field;
			}
		};
		
		this.GetAttr = function( name, failv )
		{
			return this.Src && this.Src[ name ] !== undefined ? this.Src[ name ] : failv;
		};
		
		this.GetField = function( name )
		{
			return this.Names[ name ];
		};
		
		this.Next = function()
		{
			return this.Com ? this.Com.Fields[ this.Order + 1 ] : null;
		};
		
		this.HasFields = function()
		{
			return this.Fields.length > 0;
		};
		
		this.PathScan = function( callback, loop_ct )
		{
			var path = [];
			
			for( var node = this; node; node = node.Com )
			{
				path.push( node );
			}
			
			for( var n = 0, node; ( node = path.pop() ) != null || n < loop_ct; n ++ )
			{
				callback( n, node );
			}
		};
		
		this.toString = function( i )
		{
			return this.Src && this.Src.Name || "";
		};
	}
);
