var UI = {};


UI.App = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, data_dir, demo_mode )
		{
			var md = new MD.App( data_dir, demo_mode );
			
			this.e = enew( "div", com );
			
			var page_tree = new Tree();
			
			page_tree.Types.Memo = Labo.MemoNode;
			
			page_tree.SetSource( md.ページ構成 );
			
			var navi = new UI.NaviModel( page_tree );
			new UI.Navi( this.e, navi );
			new UI.Contents( this.e, navi, md );
			
			//navi.Select( page_tree.Root );
			//navi.Select( page_tree.MakeNodeByPath( "MDApp", 1 ) );
			navi.Select( page_tree.MakeNodeByPath( "MDApp/資材/受入れ", 1 ) );
			//navi.Select( page_tree.MakeNodeByPath( "MDApp/Labo/Eval", 1 ) );
			//navi.Select( page_tree.MakeNodeByPath( "MDApp/Labo/Memo/2016/11/15", 2 ) );
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
		this.Initiate = function()
		{
			Base.Initiate.call( this );
			this.Current = undefined;
		};
		
		this.Select = function( node )
		{
			if( node == this.Current ) return;
			
			var old = this.Current;
			this.Current = node;
			var path_changed = ( node && node.Com ) !== ( old && old.Com );
			this.Notify( "Changed", [ this.Current, old, path_changed ] );
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
			this.Current = null;
			
			this.e = enew_c( "div", com, "Navi" );
			new UI.Navi.Path( this.e, navi );
			new UI.Navi.Coll( this.e, navi );
		};
	}
);


UI.Navi.Path = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, navi )
		{
			this.Navi = navi;
			this.Tabs = [];
			
			this.e = enew_c( "div", com, "Navi_Path" );
			
			navi.AddView( this, "Navi_" );
		};
		
		this.Navi_Changed = function( node, old_node, path_changed )
		{
			var self = this;
			
			node && node.PathScan
			(
				function( n, iter )
				{
					self.MakeTab( n, iter == node ? null : iter );
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
			
			var e = enew_c( "span", com, "Navi_Path_Tab" );
			var s = enew_ct( "span", com, "Navi_Path_Tab_Sep", ">" );
			
			e.onmousedown = function()
			{
				node && navi.Select( node );
			};
			
			this.Update = function( new_node )
			{
				node = new_node;
				
				e_plain( e, node == null ? ".." : node.GetLabel() );
				e_class_set( e, "Navi_Path_Tab_Sel",  node == navi.Current );
				e_class_set( e, "Navi_Path_Tab_Vis",  node != null );
				s.style.display = ( node != null && node != navi.Current ) ? "inline" : "none";
			};
		}
		
	}
);


UI.Navi.Coll = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, navi )
		{
			this.Navi = navi;
			this.Tabs = [];
			navi.AddView( this, "Navi_" );
			
			this.e = enew_c( "div", com, "Navi_Coll" );
		};
		
		this.Navi_Changed = function( node, old_node, path_changed )
		{
			var n = 0;
			var iter = node && node.First() || null;
			
			while( n < this.Tabs.length || iter )
			{
				this.MakeTab( n, iter );
				n ++;
				iter = iter && iter.Next();
			}
		};
		
		this.MakeTab = function( n, node )
		{
			var tab = this.Tabs[ n ] = this.Tabs[ n ] || new Tab( this.e, this.Navi );
			tab.Update( node );
		};
		
		function Tab( com, navi )
		{
			var node = null;
			
			var e = enew_c( "span", com, "Navi_Coll_Tab" );
			var s = enew_ct( "span", com, "Navi_Coll_Tab_sep", "|", null, { display: "none" } );
			
			e.onmousedown = function()
			{
				node && navi.Select( node );
			};
			
			this.Update = function( new_node )
			{
				node = new_node;
				
				e_plain( e, node == null ? ".." : node.GetLabel() );
				e_class_set( e, "Navi_Coll_Tab_Sel", node == navi.Current );
				e.style.display = node ? "inline" : "none";
				//s.style.display = ( node && node.Next() ) ? "inline" : "none";
			};
		}
		
	}
);


UI.Navi.Enter = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, node, navi )
		{
			this.e = enew_c( "div", com, "Navi_Enter" );
			this.p = enew_c( "div", this.e, "_Path" );
			this.fs = enew_c( "div", this.e, "_Fields" );
			
			if( node )  for( var n in node.MakeFields() )
			{
				new Tab( this.fs, "Navi_Ent_Item", node.Fields[ n ], navi );
			}
		};
		
		function Tab( com, css_class, node, navi )
		{
			var e = enew_ct( "div", com, css_class, node.GetTitle( "----" ) );
			
			e.onmousedown = function()
			{
				node && navi.Select( node );
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
		
		this.Navi_Changed = function()
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
			var typename = node && node.Type || "";
			var ctor = UI.Content.Types[ typename ] || UI.Content;
			var content = new ctor( com, node, this.Navi, this.MD );
			return content;
		}
	}
);


UI.Content = class_def
(
	null,
	function()
	{
		this.CssClass = "Content";
		
		this.Initiate = function( com, node, navi, md )
		{
			this.Node = node;
			this.Navi = navi;
			this.MD = md;
			
			this.e = enew_c( "div", com, this.CssClass );
			
			this.BuildTitle( this.e, node && node.GetTitle() );
			this.BuildTop( this.e, node, navi, md );
			this.BuildMiddle( this.e, node, navi, md );
			this.BuildBottom( this.e, node, navi, md );
		};
		
		this.BuildTitle = function( e, title ) { enew_t( "h2", e, title ); };
		this.BuildTop = function( e, node, navi, md ) {};
		this.BuildMiddle = function( e, node, navi, md ) { new UI.Navi.Enter( e, node, navi ); };
		this.BuildBottom = function( e, node, navi, md ) {};
		
		this.Show = function()
		{
			this.e.style.display = "block";
		};
		
		this.Hide = function()
		{
			this.e.style.display = "none";
		};
		
		this.toString = function()
		{
			return "UI.Content " + ( this.Node && this.Node.GetAttr( "Type" ) );
		};
	}
);


UI.Content.Types = {};


//  End  //
