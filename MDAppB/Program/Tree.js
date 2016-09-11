
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
			this.Root = new Node( src );
			this.Notify( "Update", [] );
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
		this.Initiate = function( src )
		{
			log( "", src && src.Name );
			this.Src = src;
			this.Fields = [];
			this.Names = {};
			if( src && src.Fields ) for( var i = 0; i < src.Fields.length; i ++ )
			{
				var psrc = src.Fields[ i ];
				var part = this.Fields.push( new Node( psrc ) );
				var name = psrc.Name;
				if( name != null ) this.Names[ name ] = part;
			}
		};
		
		this.toString = function( i )
		{
			i = i || "";
			var pi = i + "    ";
			var rt = this.Src && ( i + this.Src.Name + "\r\n" );
			
			for( var i in this.Fields )  rt += this.Fields[ i ].toString( pi );
			
			return rt;;
		};
	}
);
