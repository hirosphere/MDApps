
Labo.EkiNode = class_def
(
	Node,
	function( Base )
	{
		this.MakeFields = function()
		{
			if( this.Fields.length > 0 )  return this.Fields;
			
			var self = this;
			setTimeout( function() { make_fields( self ) }, 1000 );
			
			//make_fields( this );
			
			return this.Fields;
		};
		
		function make_fields( node )
		{
			var list =
			[
				{ "Name": "1130212",  "Label": "池袋"  },
				{ "Name": "1130208",  "Label": "新宿"  },
				{ "Name": "1131903",  "Label": "赤羽"  },
				{ "Name": "1130220",  "Label": "上野"  },
				{ "Name": "1132005",  "Label": "北千住"  }
			];
			
			for( var i in list )
			{
				var field = node.CreateField( list[ i ] );
				log( field );
			}
			
			node.Tree.Notify( "FieldChanged", [ node ] );
		}
	}
);


xml = {};

var Eki = new
(
	class_def
	(
		Model,
		function()
		{
			var Rosen = {};
			var Eki = {};
			
			this.LoadRosen = function()
			{
			
			}
			
			function LoadRosen( id, onload )
			{
				var self = this;
				
				if( this.Lines[ id ] )
				{
					onload( this.Lines[ id ] );
				}
				else
				{
					xml.onload = function( data )
					{
						self.Lines[ id ] = data;
						onload( data );
					};
					
					var src = "http://ekidata.jp/api/l/" + id +".json";
					var script = document.createElement( "script" );
					script.src = src;
					document.body.appendChild( script );
				}
			}
			
			function LoadEki( id, onload )
			{
				var self = this;
				
				if( this.Stations[ id ] )
				{
					onload( this.Stations[ id ] );
				}
				else
				{
					xml.onload = function( data )
					{
						self.Stations[ id ] = data;
						onload( data );
					}
					
					var src = "http://ekidata.jp/api/g/" + id +".json";
					var script = document.createElement( "script" );
					script.src = src;
					document.body.appendChild( script );
				}
			}
			
			
		}   // function
		
	)   // class_def
)






