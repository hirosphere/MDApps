
var Tree = class_def
(
	Model,
	function( Base )
	{
		this.Initiate = function()
		{
			Base.Initiate.call( this );
			
			this.Types = {};
			this.Root = null;
		};
		
		this.SetSource = function( src )
		{
			this.Root = this.CreateNode( null, src, 0 );
			this.Notify( "Update", [] );
		};
		
		this.CreateNode = function( com, src, order )
		{
			var type = this.Types[ src && src.Type ] || Node;
			return new type( this, com, src, order );
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
				
				var field = tree.CreateNode( this, f_src, i );
				this.Fields.push( field );
				
				var f_name = f_src.Name;
				if( f_name != null ) this.Names[ f_name ] = field;
			}
		};
		
		this.Caption = function( failv )
		{
			return this.GetAttr( "Title", this.GetAttr( "Name", failv ) );
		};
		
		this.GetAttr = function( name, failv )
		{
			return this.Src && this.Src[ name ] !== undefined ? this.Src[ name ] : failv;
		};
		
		this.GetFields = function()
		{
			return this.Fields;
		};
		
		this.GetField = function( name )
		{
			return this.Names[ name ];
		};
		
		this.First = function()
		{
			return this.Com && this.Com.Fields[ 0 ] || this;
		}
		
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
			
			loop_ct = Math.max( loop_ct, path.length );
			
			for( var n = 0; n < loop_ct; n ++ )
			{
				callback( n, path.pop() );
			}
		};
		
		this.Add = function( src )
		{
			if( this.Tree != null )
			{
				var order = this.Fields.length;
				var node = this.Tree.CreateNode( this, src, order );
				this.Fields.push( node );
				var name = src && src.Name;
				if( name != null )  this.Names[ name ] = node;
				log( node );
			}
		}
		
		this.toString = function( i )
		{
			return this.Src && this.Src.Name || "";
		};
	}
);
