
var Labo = {};

Labo.MemoNode = class_def
(
	Node,
	function( Base )
	{
		this.Initiate = function( tree, com, src, order )
		{
			Base.Initiate.call( this, tree, com, src, order );
		};
		
		this.GetFields = function()
		{
			var frac = this.GetAttr( "Frac", "" );
			
			if( this.Fields.length == 0 )  for( var n = 0; n < 10; n ++ )
			{
				this.Add( { Type: "Memo", Name: "M" + frac + n, Frac: frac + n } );
			}
			
			return this.Fields;
		}
	}
);

UI.Content_Type.Memo = class_def
(
	UI.Content,
	function( Base )
	{
		this.Title = "Mew";
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

