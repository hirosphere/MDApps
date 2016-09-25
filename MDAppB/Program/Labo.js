
var Labo = {};


Labo.MemoRecord = class_def
(
	Record,
	function( Base )
	{
		this.MakeFilePath = function( key )
		{
			var m = key.match( /(\d{4})(\d{2})(\d{2})/ );
			
			return m && sf( "{1}/{1}_{2}.json", m ) || null;
		};
	}
);


Labo.MemoNode = class_def
(
	Node,
	function( Base )
	{
		this.Initiate = function( tree, src )
		{
			Base.Initiate.call( this, tree, src );
		};
		
		this.MakeFields = function()
		{
			if( this.Fields.length > 0 )  return this.Fields;
			
			for( var i = 0; i < 10; i ++ )
			{
				var year = 2010 + i;
				this.Add( new Labo.YearMemo( year ), null, year );
			}
			
			return this.Fields;
		};
	}
);

Labo.YearMemo = class_def
(
	Node,
	function( Base )
	{
		this.Initiate = function( year )
		{
			Base.Initiate.call( this );
			this.Type = "Memo";
			this.Label = year + "年";
			this.Year = year;
		};
		
		this.GetTitle = function()
		{
			return this.Year + "年";
		};
		
		this.MakeFields = function()
		{
			if( this.Fields.length > 0 )  return this.Fields;
			
			for( var i = 1; i <= 12; i ++ )
			{
				this.Add( new Labo.MonthMemo( this.Year, i ), null, i );
			}
			
			return this.Fields;
		};
	}
);

Labo.MonthMemo = class_def
(
	Node,
	function( Base )
	{
		this.Initiate = function( year, month )
		{
			Base.Initiate.call( this );
			this.Type = "Memo"
			this.Label = month + "月";
			this.Year = year;
			this.Month = month;
			
		};
		
		this.GetTitle = function()
		{
			return this.Year + "年" + this.Name + "月";
		};
		
		this.MakeFields = function()
		{
			if( this.Fields.length > 0 )  return this.Fields;
			
			var date = new Date( [ this.Year, this.Month, 1 ].join( "/" ) );
			for( var month = date.getMonth(); month == date.getMonth(); )
			{
				var field = new Labo.DateMemo( date );
				this.Add( field, null, date.getDate() );
				date.setDate( date.getDate() + 1 );
			}
			return this.Fields;
		};
	}
);

Labo.DateMemo = class_def
(
	Node,
	function( Base )
	{
		this.Initiate = function( date )
		{
			Base.Initiate.call( this );
			this.Type = "Memo";
			this.Label = date.getDate() + "";
			this.Date = new Date( date.getTime() );
		};
		
		this.GetTitle = function()
		{
			return date_format( "{YYYY}年{M}月{D}日 ({B})", this.Date );
		};
	}
);

UI.Content.Types.Memo = class_def
(
	UI.Content,
	function( Base )
	{
		this.BuildBottom = function( e )
		{
			var rec = this.MD.MemoRecord;
			
			var hr = enew( "div", e );
			var wr = enew_t( "button", hr, "保存", { onclick: save } );
			var text = enew( "textarea", e, null, { display: "block", width: "600px", height: "90px" } );
			var output = enew( "textarea", e, null, { display: "block", width: "600px", height: "90px" } );
			
			var self = this;
			var key = date_format( "{YYYY}{MM}{DD}", self.Node.Date )
			
			function load()
			{
				if( self.Node.Date )
				{
					var d = date_format( "{Y}年{M}月{D}日 {B}曜日", self.Node.Date );
					var item = rec.Get( key, { Text: d + "のできごと:\r\n" } );
					
					text.value = item == null ? "[[ null ]]" : item.Text ;
				}
			}
			
			function save()
			{
				if( self.Node.Date )
				{
					rec.Set( key, { Text: text.value } );
					rec.Save();
					
					var fvalue = rec.GetFileValue( key );
					output.value = json_value( fvalue );
				}
			}
			
			load();
		};
	}
);




UI.Content.Types.Eval = class_def
(
	UI.Content,
	function()
	{
		this.BuildTop = function( e )
		{
			var w = "600px";
			var hrz = enew( "div", e );
			var ex = enew_t( "button", hrz, "実行" );
			var code = enew( "textarea", hrz, {  }, { display: "block", width: w, height: "150px" } );
			var output = enew( "textarea", hrz, {  }, { display: "block", width: w, height: "70px" } );
			var input = enew( "textarea", hrz, {  }, { display: "block", width: w, height: "70px" } );
			
			var self = this;
			
			ex.onclick = function()
			{
				output.value = UI.eval
				(
					code.value, input.value,
					self.MD,
					self.Node
				);
			};
		};
		
		this.toString = function()
		{
			return "Eval";
		};
	}
);

UI.eval = function( code, input, md, node )
{
	try { return eval( code ); }
	catch( exc ) { return exc.message; }
};


UI.Content.Types.FS_Labo = class_def
(
	UI.Content,
	function()
	{
		this.BuildTop = function( e )
		{
			this.FS;
		};
	}
);

