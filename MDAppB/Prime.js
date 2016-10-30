
var Err = {};

function class_def( base, dec )
{
	var ctor = function()
	{
		this.Initiate.apply( this, arguments );
	}
	
	ctor.prototype.Initiate = function(){};
	
	if( base )  for( var fn in base.prototype )
	{
		if( base.prototype.hasOwnProperty( fn ) )  ctor.prototype[ fn ] = base.prototype[ fn ];
	}
	
	dec.call( ctor.prototype, base && base.prototype, ctor );
	
	ctor.toString = function()
	{
		return ctor.prototype.Initiate.toString();
	};
	
	return ctor;
}


var Model = class_def
(
	null,
	function()
	{
		this.Initiate = function()
		{
			this.Views = [];
		};
		
		this.AddView = function( view, prefix )
		{
			this.Views.push( [ view, prefix == undefined ? "" : prefix ] );
		};
		
		this.Notify = function( message, args )
		{
			for( var i in this.Views )
			{
				var view = this.Views[ i ];
				var method = view && view[ 0 ][ view[ 1 ] + message ];
				if( method )  method.apply( view[ 0 ], args || [] );
			}
		};
	}
);


var RUId = new function()
{
	var next = 1;
	
	this.Next = function( obj )
	{
		return obj.RUId = next ++;
	};
};


function str_right( ct, str )
{
	return str.substring( str.length - ct, str.length );
}


function str_format( format, a, b, c, d, e, f, g )
{
	var args = arguments;
	
	return format.replace
	(
		/(`.)|{((`.|[^}])*)}/g, 
		function( all, a, b )
		{
			if( a ) return a.replace( "`", "" );
			var name = b.replace( /`/g, "" );
			
			for( var i = 1; i < args.length; i ++ )
			{
				var fs = args[ i ];
				if( fs && fs[ name ] !== undefined )  return fs[ name ];
			}
			return "";
		}
	 );
}

var sf = str_format;


function ht_plain( plain )
{
	var ht = plain + "";
	
	ht = ht.replace( /&/g, "&amp;" );
	ht = ht.replace( /</g, "&lt;" );
	ht = ht.replace( />/g, "&gt;" );
	ht = ht.replace( /   /g, "&nbsp; &nbsp;" );
	ht = ht.replace( /  /g, "&nbsp; " );
	ht = ht.replace( /\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;" );
	ht = ht.replace( /\r?\n/g, "<br/>\n" );
	
	return ht;
}

function enew( type, com, attrs, style, class_name, text )
{
	var e = document.createElement( type );
	if( attrs )  for( var fn in attrs )  e[ fn ] = attrs[ fn ];
	if( style )  for( var fn in style )  e.style[ fn ] = style[ fn ];
	if( class_name != null )  e.className = class_name;
	if( text !== undefined )  e.innerHTML = ht_plain( text );
	if( com )  com.appendChild( e );
	return e;
}


function enew_c( type, com, class_name, attrs, style, text )
{
	return enew( type, com, attrs, style, class_name, text );
}


function enew_ct( type, com, class_name, text, attrs, style )
{
	return enew( type, com, attrs, style, class_name, text );
}


function enew_t( type, com, text, attrs, style, class_name )
{
	return enew( type, com, attrs, style, class_name, text );
}


function e_clear( e )
{
	while( e.lastChild )  e.removeChild( e.lastChild );
}


function e_id( id )
{
	return document.getElementById( id );
}


function e_plain( e, text )
{
	e.innerHTML = ht_plain( text );
}


function e_class_set( e, class_name, value )
{
	var re = new RegExp( "(^| )" + class_name + "( |$)" );
	var match = e.className.match( re );
	if( match )
	{
		if( value == false ) e.className = e.className.replace( re, match[ 2 ] );
	}
	else
	{
		if( value == true ) e.className += " " + class_name;
	}
}

function log( m )
{
	e_id( "Log" ).innerHTML += ht_plain( m + "\n" );
}


var date_youbi = [ "日", "月", "火", "水", "木", "金", "土" ];

var date_fns =
{
	"YMDB": function( date )   { return date_format( "{YYYY}/{MM}/{DD} ({B})", date ) },
	"YMD": function( date )   { return date_format( "{YYYY}/{MM}/{DD}", date ) },
	
	"YYYY": function( date )  { return str_right( 4, "000" + date.getFullYear() ); },
	"YY"  : function( date )  { return str_right( 2, "0" + date.getFullYear() ); },
	"Y"  : function( date )  { return "" + date.getFullYear(); },
	"MM"  : function( date )  { return str_right( 2, "0" + ( date.getMonth() + 1 ) ); },
	"M"   : function( date )  { return "" + ( date.getMonth() + 1 ); },
	"DD"  : function( date )  { return str_right( 2, "0" + date.getDate() ); },
	"D"   : function( date )  { return "" + date.getDate(); },
	"B"   : function( date )  { return date_youbi[ date.getDay() ]; },
	
	"hms"  : function( date )  { return date_format( "{hh}:{mm}:{ss}", date ); },
	"hh"  : function( date )  { return str_right( 2, "0" + date.getHours() ); },
	"mm"  : function( date )  { return str_right( 2, "0" + date.getMinutes() ); },
	"ss"  : function( date )  { return str_right( 2, "0" + date.getSeconds() ); },
	
	"h"  : function( date )  { return "" + date.getHours(); },
	"m"  : function( date )  { return "" + date.getMinutes(); },
	"s"  : function( date )  { return "" + date.getSeconds(); },
	
	"" : ""
};

function date_format( format, date, values )
{
	var date = date || new Date();
	
	return format.replace
	(
		/(`.)|{((`.|[^}])*)}/g, 
		function( all, a, b )
		{
			if( a ) return a.replace( "`", "" );
			var name = b.replace( /`/g, "" );
			var func = date_fns[ name ];
			if( func ) return func( date );
		}
	 );
}

var df = date_format;

function str_value( value, ichar )
{
	return str_value_( value, "", ichar || "    " );
}

function str_value_( value, indent, ichar )
{
	if( value === undefined )  return "undefined";
	if( value === null )  return "null";
	if( value.constructor == String )  return value;
	if( value.constructor == Number )  return value.toString();
	if( value.constructor == Boolean )  return value.toString();
	
	var part_i = indent + ichar;
	
	if( value.constructor == Array )
	{
		var rt = "Ar\r\n";
		for( var i = 0; i < value.length; i ++ )
		{
			rt += part_i + str_value_( value[ i ], part_i, ichar ) + "\r\n";
		}
		return rt;
	}
	
	if( value.constructor == Object )
	{
		var rt = "Obj\r\n";
		for( var fn in value )
		{
			rt += part_i + fn + ": " + str_value_( value[ fn ], part_i, ichar ) + "\r\n";
		}
		return rt;
	}
	
	return value.toString();
}

function json_value( value, indent_ch )
{
	return json_value_( value, indent_ch || "", "" );
}

function json_value_( value, indent_ch, indent )
{
	if( value === undefined )  return "undefined";
	if( value === null )  return "null";
	if( value.constructor == String )  return json_str( value );
	if( value.constructor == Number )  return value.toString();
	if( value.constructor == Boolean )  return value.toString();
	if( value.constructor == Array )  return json_array( value, indent_ch, indent );
	if( value.constructor == Object )  return json_obj( value, indent_ch, indent );
}

function json_str( value )
{
	return '"' + value.replace( /\r|\n|\\|"/g, json_str_conv ) + '"';
}


function json_array( value, work )
{
	var json = [];
	
	for( var i in value )
	{
		json.push( json_value_( value[ i ], work ) );
	}
	
	return "[" + json.join( "," ) + "]";
}


function json_obj( value, work )
{
	var json = [];
	
	for( var fn in value )
	{
		json.push( json_str( fn ) + ":" + json_value_( value[ fn ], work ) )
	}
	
	return "{" + json.join( ",\r\n" ) + "}";
}


var json_str_table = { "\r": "\\r", "\n": "\\n", "\\": "\\\\", "\"": "\\\"" };


function json_str_conv( m )
{
	return json_str_table[ m ];
}


function value_json( json, failv )
{
	try { return eval( "(" + json + "\r\n)" ); }
	catch( exc ) { return failv; }
}













