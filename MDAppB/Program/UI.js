﻿var UI = {};


UI.App = class_def
(
	null,
	function()
	{
		this.Initiate = function( com )
		{
			this.e = enew( "div", com );
			
			var page_tree = new Tree();
			page_tree.SetSource( MD.ページ構成 );
			
			var navi = new UI.NaviModel( page_tree );
			new UI.Navi( this.e, navi );
			new UI.Contents( this.e, navi, MD );
			
			new Labo.Tree( this.e );
			
			navi.SelectPath( page_tree.Node_Path( "MDApp/資材/受入れ" ) );
			
			// navi.SelectPath( "MDApp/資材/受入れ" );
		};
		
		this.Terminate = function()
		{
		};
	}
);

UI.NaviModel = class_def
(
	Model,
	function( Base )
	{
		this.Initiate = function( tree )
		{
			Base.Initiate.call( this );
			
			this.Tree = tree;
			this.CurPath = null;
			this.CurField = null;
			this.Current = null;
		};
		
		this.PathSelected = function( node )
		{
			return this.CurField == null && node == this.CurPath;
		};
		
		this.SelectPath = function( node )
		{
			if( node == this.Current && node == this.CurPath ) return;
			
			this.Current = node;
			this.CurPath = node;
			this.CurField = null;
			this.Notify( "PathSelect" );
		};
		
		this.SelectField = function( node )
		{
			if( node == this.Current ) return;
			
			this.Current = node;
			this.CurField = node;
			this.Notify( "FieldSelect" );
		};
	}
);


UI.Navi = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, navi )
		{
			this.e = enew_c( "div", com, "Navi" );
			new UI.Path( this.e, navi );
			new UI.Fields( this.e, navi );
		};
	}
);


UI.Path = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, navi )
		{
			this.Navi = navi;
			this.Tabs = [];
			navi.AddView( this, "Navi_" );
			
			this.e = enew_c( "span", com, "NaviPath" );
		};
		
		
		this.Navi_PathSelect =
		this.Navi_FieldSelect =
		
		this.Update = function()
		{
			var self = this;
			var node = this.Navi.CurPath;
			
			node && node.PathScan
			(
				function( n, node )
				{
					self.MakeTab( n, node );
				},
				this.Tabs.length
			);
		};
		
		this.MakeTab = function( n, node )
		{
			var tab = this.Tabs[ n ] = this.Tabs[ n ] || new Tab( this.e, this.Navi );
			tab.Update( node );
		};
		
		function Tab( com, navi )
		{
			var node = null;
			
			var e = enew_c( "span", com, "Tab" );
			var s = enew_ct( "span", com, "Tab_sep", ">", null, { display: "none" } );
			
			e.onmousedown = function()
			{
				node && navi.SelectPath( node );
			};
			
			this.Update = function( new_node )
			{
				node = new_node;
				
				e_plain( e, node == null ? ".." : node.GetAttr( "Name", "" ) );
				e_class_set( e, "Tab_sel", navi.PathSelected( node ) );
				e.style.display = node ? "inline" : "none";
				s.style.display = ( node && node.HasFields() ) ? "inline" : "none";
			};
		}
		
	}
);


UI.Fields = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, navi )
		{
			this.Navi = navi;
			this.Tabs = [];
			navi.AddView( this, "Navi_" );
			
			this.e = enew_c( "span", com, "NaviFields" );
			enew_ct( "span", this.e, "", "[" );
			this.c = enew_c( "span", this.e, "" );
			enew_ct( "span", this.e, "", "]" );
		};
		
		
		this.Navi_FieldSelect = function()
		{
			this.Update();
		};
		
		this.Navi_PathSelect =
		this.Update = function()
		{
			var node = this.Navi.CurPath;
			var ct = Math.max( this.Tabs.length, node ? node.Fields.length : 0 );
			
			for( var n = 0; n < ct; n ++ )
			{
				this.MakeTab( n, node ? node.Fields[ n ] : null );
			}
		};
		
		this.MakeTab = function( n, node )
		{
			var tab = this.Tabs[ n ] = this.Tabs[ n ] || new Tab( this.c, this.Navi );
			tab.Update( node );
		};
		
		function Tab( com, navi )
		{
			var node = null;
			
			var e = enew_c( "span", com, "Tab" );
			var cap = enew_c( "span", e, "Tab_cap" );
			var ent = enew_ct( "span", e, "Tab_ent", ">" );
			var s = enew_ct( "span", com, "Tab_sep", "|", null, { display: "none" } );
			
			e.onmousedown = function()
			{
				node && navi.SelectField( node );
			};
			
			ent.onclick = function()
			{
				node && navi.SelectPath( node );
			};
			
			this.Update = function( new_node )
			{
				node = new_node;
				
				e_plain( cap, node == null ? ".." : node.GetAttr( "Name", "" ) );
				e_class_set( e, "Tab_sel", node == navi.CurField );
				e.style.display = node ? "inline" : "none";
				ent.style.display = node ? "inline" : "none";
				s.style.display = ( node && node.Next() ) ? "inline" : "none";
			};
		}
		
	}
);


UI.Contents = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, navi, md )
		{
			this.Navi = navi;
			this.MD = md;
			this.Contents = {};
			this.CurrentContent = null;
			
			this.e = enew_c( "div", com, "Contents" );
			
			navi.AddView( this, "Navi_" );
		};
		
		this.Navi_PathSelect =
		this.Navi_FieldSelect = function()
		{
			var con = this.CurrentContent;
			con && con.Hide();
			
			var node = this.Navi.Current;
			
			con = this.CurrentContent = this.MakeContent( node );
			con && con.Show();
		};
		
		this.MakeContent = function( node )
		{
			if( node == null ) return;
			
			var content = this.Contents[ node.RUId ] =
			(
				this.Contents[ node.RUId ] ||	this.CreateContent( this.e, node )
			);
			
			return content;
		};
		
		this.CreateContent = function( com, node )
		{
			return new UI.Content( com, node, this.MD );
		}
	}
);


UI.Content = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, node, md )
		{
			this.e = enew_c( "div", com, "Content" );
			enew_t( "span", this.e, node, {}, { fontSize: "200px", color: "#dda", fontFamily: "メイリオ" } );
		};
		
		this.Show = function()
		{
			this.e.style.display = "block";
		};
		
		this.Hide = function()
		{
			this.e.style.display = "none";
		};
	}
);










