var UI = {};


UI.App = class_def
(
	null,
	function()
	{
		this.Initiate = function( com )
		{
			this.e = enew( "div", com );
			enew_t( "span", this.e, "MDApp" );
			
			new Labo.Tree( this.e );
		};
		
		this.Terminate = function()
		{
		};
	}
);

