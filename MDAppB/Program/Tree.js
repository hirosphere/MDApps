
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
			this.Root = this.CreateNode( src );
			this.Notify( "Update", [] );
		};
		
		this.CreateNode = function( src )
		{
			var type = this.Types[ src && src.Type ] || Node;
			return new type( src, this );
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
		this.Type = "";
		this.Name = "";
		this.Label = "";
		
		this.Initiate = function( src, tree )
		{
			RUId.Next( this );
			
			this.Tree = tree;
			this.Com = null;
			this.Src = src;
			this.Type = this.GetAttr( "Type", this.Type );
			this.Name = this.GetAttr( "Name", this.Name );
			this.Label = this.GetAttr( "Label", this.Label );
			this.Order = 0;
			this.Fields = [];
			this.Names = {};
			if( src && src.Fields ) for( var i = 0; i < src.Fields.length; i ++ )
			{
				this.CreateField( src.Fields[ i ] );
			}
		};
		
		this.GetLabel = function( failv )
		{
			return this.Label || this.Name || failv;
		};
		
		this.GetTitle = function( failv )
		{
			return this.GetAttr( "Title", this.GetLabel( failv ) );
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
		
		this.CreateField = function( src, order )
		{
			var name = ( src && src.Name != null ? src.Name : null );
			var field = ( this.Tree ? this.Tree.CreateNode( src ) : new Node( src ) );
			this.Add( field, order, name );
		};
		
		this.Add = function( field, order, name )
		{
			if( field == null )  return;
			
			field.Tree = this.Tree;
			field.Com = this;
			
			if( order == null )  order = this.Fields.length;
			
			this.Fields.splice( order, 0, field );
			field.Order = order;
			
			for( var n = order + 1; n < this.Fields.length; n ++ )
			{
				this.Fields[ n ].Order = n;
			}
			
			if( name != null )
			{
				this.Names[ name ] = field;
				field.Name = name + "";
			}
			
			return order;
		};
		
		this.toString = function( i )
		{
			return this.Src && this.Src.Name || "";
		};
	}
);
