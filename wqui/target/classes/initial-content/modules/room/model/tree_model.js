/**
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 **/
 
  /** 
     处理模型列表Tree，主要用来处理数据store和model 
     #2384
  */
define("room/model/tree_model",
[
	"dojo/_base/declare",
    "dojo/data/ItemFileWriteStore",
    "widgets/room/cbtree/models/ForestStoreModel",
    "widgets/room/cbtree/models/StoreModel-API"
],
function(declare,ItemFileWriteStore,ForestStoreModel){
  
    var EmptyData = { identifier: 'name', label:'name', items:[] };
    var store = new ItemFileWriteStore( { data: EmptyData }) ;
    
    var  model = new ForestStoreModel( {
      store: store,
      query: {type: 'parent'},
      rootLabel: 'Scene',
      checkedAll: true,
      checkedRoot: true,
      checkedState: true,
      checkedStrict: false
    }); 
    var modelParent = model.newItem( { name: 'model', type: 'parent',  checked: true, parentNode : model.root } );
    // model.newItem( { name: 'model1', type: 'child',  checked: false, parentNode : modelParent }, modelParent );
    var cameraParent = model.newItem( { name: 'camera', type: 'parent', checked: true, parentNode : model.root } );
    model.newItem( { name: 'camera1', type: 'child',  checked: false, parentNode : cameraParent }, cameraParent );
    var tree_model = dojo.declare([], {
        constructor : function(){
        
        },
        getModel : function(){
            return model ;
        },
        getStore : function(){
            return store;
        }
    }) ;
    return tree_model ;

});
