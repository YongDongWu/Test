/*global location */
sap.ui.define([
	"com/mindray/managerselfv1/hr/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/mindray/managerselfv1/hr/model/formatter",
	"sap/ui/core/routing/History"
], function(BaseController, JSONModel, formatter, History) {
	"use strict";

	return BaseController.extend("com.mindray.managerselfv1.hr.controller.Detail2", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});

			this.getRouter().getRoute("odetail").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView2");

			// this.getOwnerComponent().oWhenMetadataIsLoaded.then(this._onMetadataLoaded.bind(this));
			this.byId("SimpleFormDisplay354").bindElement("EmployeeBasicInfo");
			this.byId("sf01").bindElement("EmployeeBasicInfo");
			this.byId("office1").bindElement("EmployeeOfficeSet");
			this.byId("office2").bindElement("EmployeeOfficeSet");
			// this.byId("phone1").bindElement("EmployeeBasicInfo");
			// this.byId("phone2").bindElement("EmployeeBasicInfo");
			// this.byId("phone3").bindElement("EmployeeBasicInfo");
		},
		onDownload: function(oEvent) {
			// var pernr = this.getView().byId("Pernr").getText().substr(3,8);//截取工号
			var pernr = this.getView().byId("Pernr").getText();
			var sRead = "/EmployeeCVSet('" + pernr + "')";

			this.getView().getModel().read(
				sRead, {
					success: function(oData, response) {

						var pdfURL = oData.Pdfurl;
						window.location.href = pdfURL;
					},
					error: function(oError) {

					}
				}
			);
		},
		/**
		 * Event handler  for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function() {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					// The history contains a previous entry
					history.go(-1);
				} else {
					// Otherwise we go backwards with a forward history
					var bReplace = true;
					// this.getRouter().navTo("odetail", {}, bReplace);
					this.getRouter().navTo("object", {}, bReplace);
					
				}
			},
			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
			_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").oPernr;
			this.getOwnerComponent().oWhenMetadataIsLoaded.then(function() {
				var sObjectPath = this.getModel().createKey("EmployeeListSet", {
					Pernr: sObjectId
				});
				console.log(sObjectPath);
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},
		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView2");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			// var sPath = oElementBinding.getPath(),
			// 	oResourceBundle = this.getResourceBundle(),
			// 	oObject = oView.getModel().getObject(sPath),
			// 	sObjectId = oObject.Zwid,
			// 	sObjectName = oObject.Name,
			// 	oViewModel = this.getModel("detailView2");

			// this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			// oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			// oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			// oViewModel.setProperty("/shareSendEmailSubject",
			// 	oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			// oViewModel.setProperty("/shareSendEmailMessage",
			// 	oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		}

	});

});
