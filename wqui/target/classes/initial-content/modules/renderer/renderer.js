require(
	[
		"dojo/store/Memory",
		"dijit/tree/ObjectStoreModel",
		"dijit/Tree",
		"dojo/ready"
	],
	function(Memory,ObjectStoreModel,Tree,Ready){
		var store = new Memory({
			data : [
				{id : "pc", name : "Preview Configuration", parent : ""},
					{id : "mnc", name : "Macro node contents", parent : "pc"},
						{id : "mprt", name : "Mesh Preview RenderTarget", parent : "mnc"},
						{id : "mpc", name : "Mesh Preview Camera", parent : "mnc"},
						{id : "mpe", name : "Mesh Preview Environment", parent : "mnc"},
						{id : "mpi", name : "Mesh Preview Imager", parent : "mnc"},
						{id : "mpk", name : "Mesh Preview Kernel", parent : "mnc"},
						{id : "mprs", name : "Mesh Preview Resolution", parent : "mnc"},
			],
			getChildren : function(object)
			{
				return this.query({parent: object.id});
			}
		});
		
		var model = new ObjectStoreModel({
			store : store,
			query : {id : "pc"}
		});
		
		Ready(function(){
			var tree = new Tree({
				model : model
			});
			tree.placeAt("preConfigTree");
			tree.startup();
		});
	}
);