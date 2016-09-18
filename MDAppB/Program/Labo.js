
var Labo = {};

Labo.MemoNode = class_def
(
	Node,
	function( Base )
	{
		this.Initiate = function( tree, src )
		{
			Base.Initiate.call( this, tree, src );
		};
		
		this.GetFields = function()
		{
			if( this.Maked )  return this.Fields;
			
			
			for( var i = 0; i < 10; i ++ )
			{
				this.Add( new Labo.YearMemo( 2010 + i ) );
			}
			
			this.Maked = true;
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
			this.Type = "Memo"
			this.Name = year;
			this.Label = year + "年";
			this.Year = year;
		};
		
		this.GetTitle = function()
		{
			return this.Year + "年";
		};
		
		this.GetFields = function()
		{
			if( this.Fields.length > 0 )  return this.Fields;
			
			for( var i = 1; i <= 12; i ++ )
			{
				this.Add( new Labo.MonthMemo( this.Year, i ) );
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
			this.Name = month;
			this.Label = month + "月";
			this.Year = year;
			this.Month = month;
			
		};
		
		this.GetTitle = function()
		{
			return this.Year + "年" + this.Name + "月";
		};
		
		this.GetFields = function()
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
			this.Name = date.getDate();
			this.Label = date.getDate() + "";
			this.Date = new Date( date.getTime() );
		};
		
		this.GetTitle = function()
		{
			return date_format( "{YYYY}年{M}月{D}日 ({B})", this.Date );
		};
	}
);

UI.Content_Type.Memo = class_def
(
	UI.Content,
	function( Base )
	{
		this.BuildBottom = function( e )
		{
			var hr = enew( "div", e );
			enew_t( "button", hr, "保存" );
			enew( "textarea", e, null, { display: "block", width: "600px", height: "90px" } );
		};
	}
);

UI.Content_Type.Eval = class_def
(
	UI.Content,
	function()
	{
		this.BuildTop = function( e )
		{
			var w = "600px";
			var hrz = enew( "div", e );
			var ex = enew_t( "button", hrz, "実行" );
			var code = enew( "textarea", hrz, {  }, { display: "block", width: w, height: "100px" } );
			var output = enew( "textarea", hrz, {  }, { display: "block", width: w, height: "70px" } );
			var input = enew( "textarea", hrz, {  }, { display: "block", width: w, height: "70px" } );
			
			ex.onclick = function()
			{
				output.value = UI.eval( code.value, input.value );
			};
		};
		
		this.toString = function()
		{
			return "Eval";
		};
	}
);

UI.eval = function( code, input, e )
{
	try { return eval( code ); }
	catch( exc ) { return exc.message; }
};

