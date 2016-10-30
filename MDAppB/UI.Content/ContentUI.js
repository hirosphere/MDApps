
UI.Selector = class_def
(
	Model,
	function()
	{
		
	}
);


UI.TableList = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, data, selector )
		{
			this.Data = data;
			this.Selector = selector;
			
			this.Selector.AddView( this, "Sel_" );
		};
		
		this.UpdateItem = function( key )
		{
			
		};
		
		this.CreateCol = function( row, col )
		{
			
		};
	}
);


UI.DateContents = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, date )
		{
			this.Contents = {};
			this.Current = null;
			
			this.e = enew_c( "div", com, "DateContents" );
			
			var hr = enew( "div", this.e );
			this.DateSel = new UI.Date( hr, date );
			
			this.Frame = enew( "div", this.e );
			
			this.DateSel.AddView( this, "" );
		};
		
		this.Update = function()
		{
			var datekey = df( "{YYYY}/{MM}/{DD}", this.DateSel.Date );
			
			if( this.Current )  this.Current.e.style.display = "none";
			
			var content = this.Contents[ datekey ];
			if( ! content )
			{
				var date = new Date( datekey );
				content = this.Contents[ datekey ] = this.CreateContent( this.Frame, date );
			}
			
			this.Current = content;
			if( this.Current )  this.Current.e.style.display = "block";
		};
		
		this.CreateContent = function( com, date )
		{
			return { e: enew_t( "div", com, date ) };
		};
	}
);


UI.Date = class_def
(
	Model,
	function( base )
	{
		this.Initiate = function( com, date )
		{
			base.Initiate.call( this );
			
			this.Date = date;
			
			this.e = enew_c( "a", com, "DateSel", { href: "javascript: void(0)" } );
			
			this.Y = new sel( this, "Y", 1, "/" );
			this.M = new sel( this, "M", 1, "/" );
			this.D = new sel( this, "D", 1, " " );
			this.B = new sel( this, "D", 7, "" );
			
			this.mon = enew( "span", this.e );
			
			var self = this;
			
			this.e.onclick = function() { return false; }
			
			this.e.onkeydown = function( ev )
			{
				switch( ( ev || event ).keyCode )
				{
					case 37:  self.Shift( "D", - 1 );  break;
					case 39:  self.Shift( "D", + 1 );  break;
					
					case 81:  self.Shift( "D", - 7 );  break;
					case 87:  self.Shift( "D", + 7 );  break;
					
					case 78:  self.Shift( "M", - 1 );  break;
					case 77:  self.Shift( "M", + 1 );  break;
					
					case 84:  self.Shift( "Y", - 1 );  break;
					case 89:  self.Shift( "Y", + 1 );  break;
					
					default: return true;
				}
				ev && ev.stopPropagation();
				return false;
			};
			
			date && this.Update();
		};
		
		function sel( land, shc, shv, label )
		{
			var e = enew( "span", land.e );
			enew_t( "span", land.e, label );
			
			e.onmousedown = function( ev )
			{
				var mx = ( ev == undefined ? event.offsetX - e.offsetLeft : ev.offsetX );
				var f = mx > ( e.offsetWidth / 2 );
				land.Shift( shc, f ? shv : - shv ) ;
			};
			
			e.ondblclick = function( ev )
			{
				ev == null && this.onmousedown();
			}
			
			this.set = function( value )
			{
				e_plain( e, value );
			};
		};
		
		this.Shift = function( c, value )
		{
			c == "D" && this.Date.setDate( this.Date.getDate() + value );
			c == "M" && this.Date.setMonth( this.Date.getMonth() + value );
			c == "Y" && this.Date.setFullYear( this.Date.getFullYear() + value );
			this.Update();
			this.Notify( "Update", [] );
		};
		
		this.Update = function()
		{
			this.Y.set( df( "{YYYY}", this.Date ) );
			this.M.set( df( "{MM}", this.Date ) );
			this.D.set( df( "{DD}", this.Date ) );
			this.B.set( df( "({B})", this.Date ) );
		};
	}
);

