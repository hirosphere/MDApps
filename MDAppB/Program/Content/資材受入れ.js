UI.Content.Types.受入れ = class_def
(
	UI.Content,
	function( Base )
	{
		this.BuildTop = function()
		{
			var hr = enew( "div", this.e );
			var date = enew( "input", hr, { value: date_format( "{Y}/{M}/{D} {hh}:{mm}" ) } );
			var new_key = enew( "input", hr, {} );
			
			var table = enew( "table", this.e );
			var tbody = enew( "tbody", table );
			var tr1 = enew( "tr", tbody );
			var tr2 = enew( "tr", tbody );
			
			var inps = {}, sels = {};
			
			enew_t( "td", tr1, "コード" );
			inps.mid = enew( "input", enew( "td", tr2 ), null, { width: "4em" } );
			
			enew_t( "td", tr1, "包数" );
			inps.bag = enew( "input", enew( "td", tr2 ), null, { width: "2em" } );
			
			enew_t( "td", tr1, "賞味期限" );
			inps.end = enew( "input", enew( "td", tr2 ), null, { width: "5em" } );
			
			enew_t( "td", tr1, "ロット" );
			inps.lot = enew( "input", enew( "td", tr2 ), null, { width: "7em" } );
			
			enew_t( "td", tr1, "業者名" );
			inps.gyo = enew( "input", enew( "td", tr2 ), null, { width: "6em" } );
			
			enew_t( "td", tr1, "製品名" );
			inps.nam = enew( "input", enew( "td", tr2 ), null, { width: "12em" } );
			
			enew_t( "td", tr1, "重量" );
			inps.juu = enew( "input", enew( "td", tr2 ), null, { width: "4em" } );
			
			enew_t( "td", tr1, "状態" );
			sels.jou = enew( "select", enew( "td", tr2 ), null, { width: "2em" } );
			
			enew_t( "td", tr1, "対応" );
			sels.tai = enew( "select", enew( "td", tr2 ), null, { width: "2em" } );
			
			enew_t( "td", tr1, "記入者" );
			inps.kin = enew( "input", enew( "td", tr2 ), null, { width: "3em" } );
			
			var hr = enew( "div", this.e );
			var ent = enew_t( "button", hr, "確定" );
			
			var jmon = enew( "textarea", this.e, {}, { width: "900px", height: "270px" } );
			
			var md = this.MD;
			
			var i = 0, smp = [ "150021", "10", "17/6/26", "70115A", "みちくさ酵素化学", "VegeFat 7727", "100", "a" ];
			for( var n in inps )  inps[ n ].value = smp[ i ++ ];
			
			ent.onclick = function()
			{
				var d = new Date( date.value );
				
				var sizai =
				[
					"受入れ",
					date_format( "{YYYY}/{MM}/{DD} {hh}:{mm}:{ss}", d ),
					inps.mid.value,
					inps.juu.value,
					inps.end.value,
					inps.lot.value,
					inps.nam.value,
					inps.gyo.value,
					inps.kin.value
				];
				
				var fkey = date_format( "{YYYY}{MM}{DD}", d );
				new_key.value = md.資材TL.Add( fkey, sizai );
				
				md.資材TL.Save();
				
				var cache = md.資材TL.MakeCache( fkey );
				jmon.value = json_value( cache );
				
				//for( var n in inps )  inps[ n ].value = "";
			};
			
		};
		
	}
);
