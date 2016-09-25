var MD = {};

MD.App = class_def
(
	null,
	function()
	{
		this.Initiate = function( data_dir, demo_mode )
		{
			this.FS = new FS( data_dir, demo_mode );
			var root = this.FS.Root;
			
			this.ページ構成 = this.FS.Root.MakeFile( "ページ構成.json", true ).LoadValue();
			
			this.MemoRecord = new Labo.MemoRecord( this.FS.Root.MakeFolder( "Memo" ) );
			
			
			this.資材定義作成();
			this.資材TL = new MD.資材TL( root.MakeFolder( "資材/受入れ記録" ) );
		};
		
		this.資材定義作成 = function()
		{
			this.資材定義 =
			{
				"601": { "名称": "上白糖", "業者名": "JMしがひ", "重量": "20", "内包重量": "" },
				"602": { "名称": "天日塩", "業者名": "JMしがひ", "重量": "20", "内包重量": "" },
				"603": { "名称": "珪藻土 M-7", "業者名": "JMしがひ", "重量": "20", "内包重量": "1" },
				"604": { "名称": "寒天701", "業者名": "浦島食品", "重量": "10", "内包重量": "" },
				"605": { "名称": "", "業者名": "", "重量": "", "内包重量": "" },
				"701": { "名称": "魚介フレーク #11", "業者名": "山海化成", "重量": "10", "内包重量": "1" },
				"702": { "名称": "桜梅フレーク #35", "業者名": "山海化成", "重量": "10", "内包重量": "1" },
				"703": { "名称": "", "業者名": "山海化成", "重量": "", "内包重量": "" },
				"704": { "名称": "", "業者名": "山海化成", "重量": "", "内包重量": "" },
				"801": { "名称": "", "業者名": "", "重量": "", "内包重量": "" },
				"802": { "名称": "", "業者名": "", "重量": "", "内包重量": "" },
				"901": { "名称": "", "業者名": "", "重量": "", "内包重量": "" }
			};
		};
	}
);


MD.Rec = {};


MD.Rec.資材 = class_def
(
	null,
	function()
	{
		this.Initiate = function( レコードId, 資材Id, 製品名, 業者名, 重量, 賞味期限, ロット, 記録日時, 受入れId )
		{
			this.レコードId = レコードId;
			this.資材Id = 資材Id;
			this.製品名 = 製品名;
			this.業者名 = 業者名;
			this.重量 = 重量;
			this.賞味期限 = 賞味期限;
			this.ロット = ロット;
			this.記録日時 = 記録日時;
			this.受入れId = 受入れId;
		};
	}
);


MD.資材TL = class_def
(
	Record,
	function()
	{
	}
);

MD.資材庫 = class_def
(
	Model,
	function( Base )
	{
		this.Initiate = function()
		{
			Base.Initiate.call( this );
			
			this.Racks = {};
		};
		
		this.Add = function( mat_id, record )
		{
			var rack = this.Racks[ mat_id ];
			
			if( rack == null )
			{
				rack = this.Racks[ mat_id ] = new Rack();
			}
			
			rack.Add( record );
		};
		
		var Rack = class_def
		{
			null,
			function()
			{
				this.Initiate = function()
				{
					this.Items = [];
				};
				
				this.Add = function( record )
				{
					this.Items.push( record );
				};
			}
		};
	}
);

