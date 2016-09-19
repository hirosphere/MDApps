﻿
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
			this.SetRoot( this.CreateNode( src ) );
		};
		
		this.SetRoot = function( node )
		{
			this.Root = node;
			if( node )  node.Tree = this;
			this.Notify( "Update", [] );
		};
		
		this.CreateNode = function( src )
		{
			var type = this.Types[ src && src.Type ] || Node;
			return new type( src, this );
		};
		
		this.MakeNodeByPath_ = function( path, level )
		{
			var path_array = path.split( "/" );
			level = level || 0;
			
			if( path.length <= 1 )  return this.Root;
			
			path_array.shift();
			return this.Root && this.Root.MakeMicroByPathArray( path_array, level ) || null;
		};
		
		this.MakeNodeByPath = function( path, level )
		{
			var path = path.split( "/" );
			level = level || 0;
			
			var field = null, iter = this.Root;
			
			for( var n = 1; n < path.length; n ++ )
			{
				var name = path[ n ];
				
				field = iter.GetField( name );
				if( field == null )
				{
					if( level == 0 )  return null;
					if( level == 1 )  return iter;
					
					filed = iter.MakeField( name );
				}
				iter = field;
			}
			
			return field;
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
		
		
		//*  Attritute *//
		
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
		
		
		//*  Coll  *//
		
		this.First = function()
		{
			return this.Com && this.Com.Fields[ 0 ] || this;
		}
		
		this.Next = function()
		{
			return this.Com ? this.Com.Fields[ this.Order + 1 ] : null;
		};
		
		
		//*  Path  *//
		
		
		this.MakeMicro = function( path )
		{
			if( path.constructor == String )  path = path.split( "/" );
			
			var field = this.MakeField( path.shift() );
			
			if( path.length > 0 )
			{
				return field.MakeMicro( path );
			}
			
			return field;
		};
		
		this.GetPath = function()
		{
			var path = [];
			for( var node = this; node; node = node.Com )  path.unshift( node.Name );
			return path.join( "/" );
		};
		
		this.PathScan = function( callback, loop_ct )
		{
			var path = [];
			
			for( var node = this; node; node = node.Com )
			{
				path.push( node );
			}
			
			loop_ct = Math.max( loop_ct || 0, path.length );
			
			for( var n = 0; n < loop_ct; n ++ )
			{
				callback( n, path.pop() );
			}
		};
		
		
		//*  Fields  *//
		
		this.MakeFields =
		this.GetFields = function()
		{
			return this.Fields;
		};
		
		this.GetField = function( name )
		{
			return this.Names[ name ];
		};
		
		this.HasDynFields = function()
		{
			return false;
		};
		
		this.HasFields = function()
		{
			return this.Fields.length > 0;
		};
		
		
		//*  Field  *//
		
		this.MakeField = function( name, src )
		{
			var field = this.GetField( name );
			if( field == null )
			{
				field = this.Tree.CreateNode( src );
				this.Add( field, null, name );
			}
			return field;
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
		
		
		//*    *//
		
		this.toString = function( i )
		{
			return this.Name;
		};
	}
);
