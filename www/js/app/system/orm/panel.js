Ext.ns('app.crud.orm');

app.crud.orm.canEdit = false;
app.crud.orm.canDelete = false;
app.crud.orm.foreignKeys = false;

app.crud.orm.oList = [];

app.crud.orm.intTypes = ['tinyint','smallint','mediumint','int','bigint', 'boolean'];
app.crud.orm.floatTypes = ['decimal' ,'float' ,'double'];
app.crud.orm.charTypes = ['char','varchar'];
app.crud.orm.textTypes = ['tinytext','text','mediumtext','longtext'];
app.crud.orm.dateTypes = ['date','datetime','time','timestamp'];
app.crud.orm.blobTypes = ['tinyblob','blob','mediumblob','longblob'];
app.crud.orm.Actions = {};

app.crud.orm.getObjectsList = function(){
	return app.crud.orm.oList;
};

Ext.define('app.crud.orm.Field', {
	extend: 'Ext.data.Model',
	fields: [
		{name:'name' ,  type:'string'},
		{name:'title' , type:'string'},
		{name:'required', type:'boolean'},
		{name:'db_len', type:'integer'},
		{name:'db_isNull', type:'boolean'},
		{name:'db_default',type:'string'},
		{name:'is_search',type:'boolean'},
		{name:'system', type:'boolean'},
		{name:'type' , type:'string'},
		{name:'unique', type:'boolean'},
		{name:'link_type', type:'string'},
		{name:'object',type:'string'},
		{name:'broken', type:'boolean'}
	]
});


Ext.define('app.crud.orm.Index', {
	extend: 'Ext.data.Model',
	fields: [
		{name:'name' ,  type:'string'},
		{name:'fulltext' , type:'boolean'},
		{name:'unique', type:'boolean'},
		{name:'columns', type:'string'},
		{name:'primary', type:'boolean'}
	]
});

Ext.define('app.crud.orm.Main',{
	extend:'Ext.panel.Panel',
	dataStore:null,
	dataGrid:null,
	searchField:null,
	toolbarDataGrid:null,
	controllerUrl:'',
	layout:'fit',
	isSystemField:null,

	initComponent:function(){

        app.crud.orm.Actions = {
            addDictionary:		this.controllerUrl  + 'adddictionary',
            listDictionaries:	this.controllerUrl  + 'listdictionaries',
            updateDictionary:	this.controllerUrl  + 'updatedictionary',
            removeDictionary:	this.controllerUrl  + 'removedictionary',
            listObj: 			this.controllerUrl  + 'list',
            listObjFields: 		this.controllerUrl  + 'fields',
            listObjIndexes: 	this.controllerUrl  + 'indexes',
            listBackups: 		this.controllerUrl  + 'listbackups',
            listAcl:			this.controllerUrl  + 'listacl',
            loadObjCfg: 		this.controllerUrl  + 'load',
            loadObjField: 		this.controllerUrl  + 'loadfield',
            loadObjIndex: 		this.controllerUrl  + 'loadindex',
            makeBackUp: 		this.controllerUrl  + 'makebackup',
            removeBackUp:		this.controllerUrl  + 'removebackup',
            removeObject:		this.controllerUrl  + 'removeobject',
            restoreBackup: 		this.controllerUrl  + 'restorebackup',
            saveObjCfg: 		this.controllerUrl  + 'save',
            saveObjField: 		this.controllerUrl  + 'savefield',
            saveObjIndex:	 	this.controllerUrl  + 'saveindex',
            deleteIndex: 		this.controllerUrl  + 'deleteindex',
            deleteField:	 	this.controllerUrl  + 'deletefield',
            validateObject: 	this.controllerUrl  + 'validate',
            buildObject:		this.controllerUrl  + 'build',
            buildAllObjects:	this.controllerUrl  + 'buildall',
            builderLog:			app.createUrl([this.controllerUrl + 'log','']),
            dictionary:			app.createUrl([this.controllerUrl + 'dictionary','']),
            listValidators:		app.createUrl([this.controllerUrl + 'listvalidators','']),
            dataViewController: app.createUrl([this.controllerUrl + 'dataview','']),
            connectionsUrl:		app.createUrl([this.controllerUrl + 'connections','']),
            listConnections:	app.createUrl([this.controllerUrl + 'connectionslist','']),
            importUrl:			app.createUrl([this.controllerUrl + 'import','']),
            encryptData:		this.controllerUrl  + 'encryptdata',
            decryptData:		this.controllerUrl  + 'decryptdata',
            taskStat:			this.controllerUrl  + 'taskstat'
        };

		this.tbar = [];
		this.dataStore = Ext.create('Ext.data.Store', {
			model: 'app.crud.orm.ObjectsModel',
			proxy: {
				type: 'ajax',
				url:app.crud.orm.Actions.listObj,
				reader: {
					type: 'json',
					rootProperty: 'data',
					idProperty: 'name'
				},
				actionMethods : {
					create : 'POST',
					read   : 'POST',
					update : 'POST',
					destroy: 'POST'
				},
				simpleSortMode: true
			},
			autoLoad: true,
			sorters: [
				{
					property : 'name',
					direction: 'ASC'
				}
			],
			listeners:{
				scope:this,
				load:function(store, records){
					app.crud.orm.oList = [];
					Ext.each(records, function(record){
						var title = record.get('title');
						if(title.length)
							title=' ('+title+')';

						app.crud.orm.oList.push({id:record.get('name'),title:(record.get('name')+title)});
					},this);
				}
			}
		});

		if(app.crud.orm.canEdit){
			this.tbar=[{
				text:appLang.ADD_OBJECT,
				tooltip:appLang.ADD_OBJECT,
				listeners:{
					click:{
						fn:function(){
							this.showEdit(null);
						},
						scope:this
					}
				}
			},{
				text:appLang.DICTIONARIES,
				tooltip:appLang.TOOLTIP_DICTIONARIES,
				listeners:{
					click:{
						fn:function(){
							this.showDictionary(false);
						},
						scope:this
					}
				}
			},{
				text:appLang.SHOW_OBJECTS_MAP,
				tooltip:appLang.TOOLTIP_OBJECTS_MAP,
				handler:this.showObjectsMap,
				scope:this
			},{
				text:appLang.DB_CONNECTIONS,
				handler:this.showConnections,
				scope:this
			},{
				text: appLang.DB_CONNECT_EXTERNAL,
				handler:this.importToOrm,
				scope:this
			},{
				text:appLang.SHOW_LOG,
				tooltip:appLang.BUILDER_SHOW_LOG,
				handler:this.showLog,
				scope:this
			}
			];
		}

		this.isSystemField = Ext.create('Ext.form.Checkbox',{
			minWidth:10,
			listeners:{
				scope:this,
				change:function(field, value){
					if(value){
						this.dataStore.filter("system",false);
					}else{
						this.dataStore.clearFilter();
						this.searchField.startFilter();
					}
				}
			}
		});

		this.searchField = Ext.create('SearchPanel' , {
			store:this.dataStore,
			fieldNames:['title' , 'name' , 'table'],
			local:true,
			listeners:{
				reset:{
					fn:function(){
						if(this.isSystemField.getValue()){
							this.dataStore.filter("system",false);
						}
					},
					scope:this
				}
			}
		});

		this.toolbarDataGrid = Ext.create('Ext.toolbar.Toolbar', {
			items:[
				{
					iconCls:'refreshIcon',
					tooltip:appLang.REFRESH,
					listeners:{
						click:{
							fn:function(){
								this.dataStore.load();
							},
							scope:this
						}
					}
				},
				this.searchField,'-',
				{
					xtype:'button',
					text:appLang.BUILD_ALL,
					tooltip:appLang.BUILD_ALL,
					iconCls:'buildIcon',
					scope:this,
					handler:this.rebuildAllObjects
				}
			]
		});

		this.toolbarDataGrid.add('-', ' ', this.isSystemField,appLang.HIDE_SYSTEM_OBJ);

		this.dataGrid = Ext.create('app.crud.orm.dataGrid',{
			store: this.dataStore,
			tbar:this.toolbarDataGrid,
			loadMask:true,
			editable:true,
			viewConfig:{
				enableTextSelection: true
			},
			listeners:{
				'itemdblclick':{
					fn:function(view , record , number , event , options){
						this.showEdit(record);
					},
					scope:this
				},
				'editRecord':{
					fn:this.showEdit,
					scope:this
				},
				'rebuildTable':{
					fn:this.rebuildObject,
					scope:this
				},
				'removeItem':{
					fn:this.removeObject,
					scope:this
				},
				'viewData':{
					fn:this.showDataView,
					scope:this
				}
			}
		});
		this.items = [this.dataGrid];
		this.callParent();
	},
	removeObject:function(grid, rowIndex, colIndex){
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);

		if(rec.get('external')){
			Ext.Msg.alert(appLang.MESSAGE , appLang.MSG_CANT_DELETE_EXTERNAL_OBJECT);
			return;
		}

		var canDeleteTable = true;

		if(rec.get('locked') || rec.get('readonly')){
			canDeleteTable = false;
		}

		var confirmForm = Ext.create('Ext.form.Panel',{
			bodyPadding:5,
			bodyCls:'formBody',
			items:[
				{
					xtype:'checkbox',
					boxLabel:appLang.DELETE_RELATED_TABLE,
					labelWidth:100,
					disabled:!canDeleteTable,
					name:'delete_table',
					listeners:{
						change:{
							fn:function(box,value){
								if(value){
									box.up('form').getForm().findField('notice').show();
								}else{
									box.up('form').getForm().findField('notice').hide();
								}
							}
						}
					}
				},{
					xtype:'displayfield',
					hidden:true,
					name:'notice',
					value:appLang.DELETE_RELATED_TABLE_NOTE
				}
			]
		});

		Ext.create('Ext.Window',{
			width:300,
			autoHeight:true,
			layout:'fit',
			modal:true,
			title:appLang.DELETE_OBJECT + ' ' + rec.get('name') + ' "' +rec.get('title')+'"',
			items:[
				confirmForm
			],
			buttons:[
				{
					text:appLang.DELETE_OBJECT,
					handler:function(){
						var me = this;
						Ext.getBody().mask(appLang.MSG_OBJECT_REMOVING);
						Ext.Ajax.request({
							url: app.crud.orm.Actions.removeObject,
							method: 'post',
							params:{
								'objectName':store.getAt(rowIndex).get('name'),
								'delete_table':confirmForm.getForm().findField('delete_table').getValue()
							},
							success: function(response, request) {
								response =  Ext.JSON.decode(response.responseText);
								if(response.success){
									store.removeAt(rowIndex);
									store.load();
								} else {
									Ext.Msg.alert(appLang.MESSAGE , response.msg);
								}
								Ext.getBody().unmask();
								me.up('window').close();

							},
							failure:function() {
								Ext.Msg.alert(appLang.MESSAGE , appLang.MSG_LOST_CONNECTION);
								Ext.getBody().unmask();
							}
						});
					}
				},{
					text:appLang.CANCEL,
					handler:function(){
						this.up('window').close();
					}
				}
			]
		}).show();
	},
	rebuildAllObjects:function(){
		Ext.Msg.confirm(appLang.CONFIRMATION, appLang.MSG_CONFIRM_REBUILD, function(btn){
			if(btn != 'yes')
				return;

			var oNamesList = [];
			this.dataStore.each(function(record){
				oNamesList.push(record.get('name'));
			},this);

			this.dataGrid.getEl().mask(appLang.SAVING);
			Ext.Ajax.request({
				url: app.crud.orm.Actions.buildAllObjects,
				method: 'post',
				scope:this,
				timeout:3600000,
				params:{
					'names[]':oNamesList
				},
				success: function(response, request) {
					this.dataGrid.getEl().unmask();
					response =  Ext.JSON.decode(response.responseText);
					if(response.success){
						this.dataStore.load();
					}else{
						Ext.Msg.alert(appLang.MESSAGE , response.msg);
					}
				},
				failure:function() {
					this.dataGrid.getEl().unmask();
					Ext.Msg.alert(appLang.MESSAGE, appLang.MSG_LOST_CONNECTION);
				}
			});
		}, this);
	},
	showEdit:function(record){

		var oName = Ext.isEmpty(record) ? '' : record.get('name');

		var win = Ext.create('app.crud.orm.ObjectWindow',{
			objectName:oName,
			objectList:app.crud.orm.getObjectsList,
			isSystem:Ext.isEmpty(record) ? false : record.get('system'),
			isExternal:Ext.isEmpty(record) ? false : record.get('external')
		});
		win.setTitle(appLang.EDIT_OBJECT + ' &laquo;' + oName + '&raquo; ');
		win.on('dataSaved',function(){
			this.dataStore.load();
		},this);
		win.on('showdictionarywin',function(name){
			this.showDictionary(name);
		},this);
		win.on('fieldRemoved',function(){
			this.dataStore.load();
		},this);
		win.on('indexRemoved',function(){
			this.dataStore.load();
		},this);
		win.show();
	},
	/**
	 * Show Dictionary editor window
	 */
	showDictionary:function(name){
		Ext.create('app.crud.orm.DictionaryWindow', {
			curDictionary:name,
			controllerUrl:app.crud.orm.Actions.dictionary,
			canEdit:app.crud.orm.canEdit,
			canDelete:app.crud.orm.canDelete
		}).show();
	},
	/**
	 * Show Objects Uml
	 */
	showObjectsMap:function(){
		Ext.create('app.crud.orm.ObjectsMapWindow',{
			controllerUrl:this.controllerUrl,
			canEdit:app.crud.orm.canEdit
		}).show();
	},
	/**
	 * Rebuild all DB Objects
	 */
	rebuildObject:function(name)
	{
		var handle = this;
		this.win = Ext.create('Ext.Window',{
			width:400,
			height:500,
			modal:true,
			scrollable:true,
			layout:'fit',
			title:appLang.REBUILD_INFO,
			closeAction:'destroy',
			buttons:[
				{
					text:appLang.CANCEL,
					scope:handle,
					handler:function(){
						this.win.close();
					}
				},{
					text:appLang.APPLY,
					scope:handle,
					handler:function(){
						this.buildObject(name);
						this.win.close();
					}
				}
			]
		});
		this.win.show();
		this.win.setLoading(appLang.FETCHING_INFO);

		Ext.Ajax.request({
			url: app.crud.orm.Actions.validateObject,
			method: 'post',
			params:{
				'name':name
			},
			scope:this,
			timeout:3600000,
			success: function(response, request) {
				response =  Ext.JSON.decode(response.responseText);
				if(response.success){
					if(response.nothingToDo){
						Ext.Msg.alert(appLang.MESSAGE, appLang.NTD);
						handle.win.close();
					}else{
						handle.win.add({
							xtype:'panel',
							scrollable:true,
							html:response.text,
							bodyPadding:3
						});
					}
				}else{
					Ext.Msg.alert(appLang.MESSAGE , response.msg);
					handle.win.close();
				}
				handle.win.setLoading(false);
			},
			failure:function() {
				Ext.Msg.alert(appLang.MESSAGE, appLang.MSG_LOST_CONNECTION);
				handle.win.setLoading(false);
			}
		});
	},
	/**
	 * Build Db Object
	 * @param string name
	 */
	buildObject:function(name){
		var handle = this;
		Ext.Ajax.request({
			url: app.crud.orm.Actions.buildObject,
			method: 'post',
			params:{
				'name':name
			},
			timeout:3600000,
			success: function(response, request) {
				response =  Ext.JSON.decode(response.responseText);
				if(response.success){
					handle.dataStore.load();
				}else{
					Ext.Msg.alert('Error' , response.msg);
				}
			},
			failure:app.formFailure
		});
	},
	/**
	 * Show database building log
	 * for currentdevelopment version
	 */
	showLog:function(){
		Ext.create('app.crud.orm.logWindow',{
			controllerUrl: app.crud.orm.Actions.builderLog
		}).show();
	},
	/**
	 * Show data view window
	 * @param string objectName
	 * @param string objectTitle
	 */
	showDataView:function(record)
	{
		var win = Ext.create('app.crud.orm.DataViewWindow',{
			objectName:record.get('name'),
			title:record.get('title'),
			isVc:record.get('vc'),
			readOnly:record.get('readonly'),
			primaryKey:record.get('primary_key'),
			controllerUrl:app.crud.orm.Actions.dataViewController
		});

		win.show();
	},
	showConnections:function()
	{
		Ext.create('app.orm.connections.Window',{
			dbConfigs:app.crud.orm.dbConfigs,
			controllerUrl:app.crud.orm.Actions.connectionsUrl
		}).show();
	},
	/**
	 * Show Import window
	 */
	importToOrm:function(){
		Ext.create('app.orm.import.Window',{
			dbConfigs:app.crud.orm.dbConfigs,
			controllerUrl:app.crud.orm.Actions.importUrl,
			listeners:{
				'importComplete':{
					fn:function(){
						this.dataGrid.getStore().load();
					},
					scope:this
				}
			}
		}).show();
	}
});


