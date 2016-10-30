
var List = class_def
(
	Model,
	function( base )
	{
		this.Initiate = function( record )
		{
			base.Initiate.call( this );
			
			this.Rows = {};
			this.Record = record;
			this.Update();
		};
		
		this.Update = function()
		{
			this.Rows = {};
		};
	}
);
