UI.Content.Types.資材定義 = class_def
(
	UI.Content,
	function( Base )
	{
		
	}
);

UI.Content.Types.受入れ = class_def
(
	UI.Content,
	function( Base )
	{
		this.BuildTop = function()
		{
			var form = enew( "form", this.e, { action: "javascript: void(0)" } );
			var table = enew( "table", form );
			var tbody = enew( "tbody", table );
			var tr1 = enew( "tr", tbody );
			var tr2 = enew( "tr", tbody );
			
			var inps = {}, sels = {};
			
			enew_t( "td", tr1, "コード" );
			inps.a = enew( "input", enew( "td", tr2 ), null, { width: "4em" } );
			
			enew_t( "td", tr1, "包数" );
			inps.b = enew( "input", enew( "td", tr2 ), null, { width: "2em" } );
			
			enew_t( "td", tr1, "賞味期限" );
			inps.c = enew( "input", enew( "td", tr2 ), null, { width: "5em" } );
			
			enew_t( "td", tr1, "ロット" );
			inps.d = enew( "input", enew( "td", tr2 ), null, { width: "7em" } );
			
			enew_t( "td", tr1, "業者名" );
			inps.e = enew( "input", enew( "td", tr2 ), null, { width: "6em" } );
			
			enew_t( "td", tr1, "製品名" );
			inps.f = enew( "input", enew( "td", tr2 ), null, { width: "12em" } );
			
			enew_t( "td", tr1, "重量" );
			inps.g = enew( "input", enew( "td", tr2 ), null, { width: "4em" } );
			
			enew_t( "td", tr1, "状態" );
			sels.h = enew( "select", enew( "td", tr2 ), null, { width: "2em" } );
			
			enew_t( "td", tr1, "対応" );
			sels.i = enew( "select", enew( "td", tr2 ), null, { width: "2em" } );
			
			enew_t( "td", tr1, "記入者" );
			inps.j = enew( "input", enew( "td", tr2 ), null, { width: "3em" } );
			
			enew( "br", form );
			var ent = enew_t( "button", form, "確定" );
			
			ent.onclick = function()
			{
				for( var n in inps )  inps[ n ].value = "";
			};
			
		};
		
	}
);
