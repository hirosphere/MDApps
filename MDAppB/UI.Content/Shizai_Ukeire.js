UI.Content.Types.受入れ = class_def
(
	UI.Content,
	function( Base )
	{
		this.BuildTitle = function() {};
		
		this.BuildTop = function()
		{
			this.Timeline = this.MD.資材TL;
			var timeline = this.MD.資材TL;
			
			var hr = enew( "div", this.e, null, { marginBottom: "1em" } );
			var contents = new UI.DateContents( this.e, new Date );
			
			contents.CreateContent = function( com, date )
			{
				return new UI.資材受入れリスト( com, timeline.CreateInputList( date ) );
			};
			
			contents.Update();
		};
	}
);


UI.資材受入れリスト = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, list )
		{
			this.List = list;
			
			this.e = enew( "div", com );
			//enew_t( "p", this.e, "資材受入れリスト " + list.Date );
			
			this.BuildInput();
			
			this.jmon = enew( "textarea", this.e, {}, { width: "900px", height: "270px" } );
			this.jmon.value = str_value( this.List.Rows );
		};
		
		this.BuildInput = function()
		{
			var hr = enew( "div", this.e, null, { marginBottom: "1em" } );
			
			var table = enew_c( "table", this.e, "InpField" );
			var tbody = enew( "tbody", table );
			var tr1 = enew( "tr", tbody );
			var tr2 = enew( "tr", tbody );
			
			var inps = {}, sels = {};
			
			enew_t( "td", tr1, "時刻" );
			inps.tim = enew( "input", enew( "td", tr2 ), null, { width: "3em" } );
			
			enew_t( "td", tr1, "コード" );
			inps.mid = enew( "input", enew( "td", tr2 ), null, { width: "4em" } );
			
			enew_t( "td", tr1, "包数" );
			inps.bag = enew( "input", enew( "td", tr2 ), null, { width: "2em" } );
			
			enew_t( "td", tr1, "賞味期限" );
			inps.end = enew( "input", enew( "td", tr2 ), null, { width: "5em" } );
			
			enew_t( "td", tr1, "ロット" );
			inps.lot = enew( "input", enew( "td", tr2 ), null, { width: "7em" } );
			
			enew_t( "td", tr1, "業者名" );
			inps.gyo = enew( "input", enew( "td", tr2 ), null, { width: "10em" } );
			
			enew_t( "td", tr1, "製品名" );
			inps.nam = enew( "input", enew( "td", tr2 ), null, { width: "18em" } );
			
			enew_t( "td", tr1, "重量" );
			inps.juu = enew( "input", enew( "td", tr2 ), null, { width: "4em" } );
			
			enew_t( "td", tr1, "状態" );
			sels.jou = enew( "select", enew( "td", tr2 ), null, { width: "3em" } );
			
			enew_t( "td", tr1, "対応" );
			sels.tai = enew( "select", enew( "td", tr2 ), null, { width: "3em" } );
			
			enew_t( "td", tr1, "記入者" );
			inps.kin = enew( "input", enew( "td", tr2 ), null, { width: "4em" } );
			
			var hr = enew( "div", this.e );
			var ent = enew_t( "button", hr, "確定" );
			
			var i = 0, smp = [ df( "{hh}:{mm}" ), "150002", "12", "2017/7", "607101A", "松尾化学", "スタビローズ700", "300", "h" ];
			for( var n in inps )  inps[ n ].value = smp[ i ++ ];
			
			var self = this;
			
			ent.onclick = function()
			{
				var d = self.List.Date;
				
				var row =
				[
					"受入れ",
					inps.tim.value,
					inps.mid.value,
					inps.juu.value,
					inps.end.value,
					inps.lot.value,
					inps.nam.value,
					inps.gyo.value,
					inps.kin.value
				];
				
				var timeline = self.List.Record;
				
				var fkey = date_format( "{YYYY}{MM}{DD}", d );
				//new_key.value = timeline.Add( fkey, row );
				
				timeline.Add( d, row );
				timeline.Save();
				
				
				var fkey = timeline.FileKey_Date( d );
				var cache = timeline.MakeCache( fkey );
				self.jmon.value = json_value( cache );
				
				
				//for( var n in inps )  inps[ n ].value = "";
			};
			
		};
		
		this.Build = function()
		{
		
		};
		
		this.Update = function()
		{
		
		};
		
		this.BuildItem = function( key )
		{
		
		};
	}
);








