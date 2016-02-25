var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var LoaderEvent = require("awayjs-core/lib/events/LoaderEvent");
var AssetLibrary = require("awayjs-core/lib/library/AssetLibrary");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var Debug = require("awayjs-core/lib/utils/Debug");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Graphics = require("awayjs-display/lib/graphics/Graphics");
var View = require("awayjs-display/lib/View");
var Mesh = require("awayjs-display/lib/display/Mesh");
var Skybox = require("awayjs-display/lib/display/Skybox");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var MethodMaterial = require("awayjs-methodmaterials/lib/MethodMaterial");
var AWDParser = require("awayjs-parsers/lib/AWDParser");
/**
 *
 */
var MaterialEnvMapTest = (function () {
    function MaterialEnvMapTest() {
        var _this = this;
        Debug.LOG_PI_ERRORS = true;
        Debug.THROW_ERRORS = false;
        AssetLibrary.enableParser(AWDParser);
        var session = AssetLibrary.getLoader();
        session.addEventListener(LoaderEvent.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        session.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) { return _this.onAssetComplete(event); });
        session.load(new URLRequest('assets/EnvMapTest.awd'));
        this._view = new View(new DefaultRenderer());
        this._timer = new RequestAnimationFrame(this.render, this);
        window.onresize = function () { return _this.resize(); };
        this._timer.start();
        this.resize();
    }
    MaterialEnvMapTest.prototype.resize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    MaterialEnvMapTest.prototype.render = function (dt) {
        if (this._torus)
            this._torus.rotationY += 1;
        this._view.render();
        this._view.camera.z = -2000;
    };
    MaterialEnvMapTest.prototype.onAssetComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('away.events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
        console.log('------------------------------------------------------------------------------');
    };
    MaterialEnvMapTest.prototype.onLoadComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', event);
        console.log('------------------------------------------------------------------------------');
        var loader = event.target;
        var numAssets = loader.baseDependency.assets.length;
        for (var i = 0; i < numAssets; ++i) {
            var asset = loader.baseDependency.assets[i];
            console.log(asset.assetType);
            switch (asset.assetType) {
                case Skybox.assetType:
                    var skybox = asset;
                    this._view.scene.addChild(skybox);
                    break;
                case Mesh.assetType:
                    this._torus = asset;
                    this._view.scene.addChild(this._torus);
                    break;
                case Graphics.assetType:
                    break;
                case MethodMaterial.assetType:
                    break;
            }
        }
    };
    return MaterialEnvMapTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9NYXRlcmlhbEVudk1hcFRlc3QudHMiXSwibmFtZXMiOlsiTWF0ZXJpYWxFbnZNYXBUZXN0IiwiTWF0ZXJpYWxFbnZNYXBUZXN0LmNvbnN0cnVjdG9yIiwiTWF0ZXJpYWxFbnZNYXBUZXN0LnJlc2l6ZSIsIk1hdGVyaWFsRW52TWFwVGVzdC5yZW5kZXIiLCJNYXRlcmlhbEVudk1hcFRlc3Qub25Bc3NldENvbXBsZXRlIiwiTWF0ZXJpYWxFbnZNYXBUZXN0Lm9uTG9hZENvbXBsZXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFVBQVUsV0FBZSxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3JFLElBQU8sV0FBVyxXQUFlLG9DQUFvQyxDQUFDLENBQUM7QUFFdkUsSUFBTyxZQUFZLFdBQWUsc0NBQXNDLENBQUMsQ0FBQztBQUcxRSxJQUFPLFVBQVUsV0FBZSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2xFLElBQU8sS0FBSyxXQUFnQiw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNELElBQU8scUJBQXFCLFdBQVksNkNBQTZDLENBQUMsQ0FBQztBQUV2RixJQUFPLFFBQVEsV0FBZ0Isc0NBQXNDLENBQUMsQ0FBQztBQUN2RSxJQUFPLElBQUksV0FBaUIseUJBQXlCLENBQUMsQ0FBQztBQUN2RCxJQUFPLElBQUksV0FBaUIsaUNBQWlDLENBQUMsQ0FBQztBQUMvRCxJQUFPLE1BQU0sV0FBZ0IsbUNBQW1DLENBQUMsQ0FBQztBQUVsRSxJQUFPLGVBQWUsV0FBYyx1Q0FBdUMsQ0FBQyxDQUFDO0FBRTdFLElBQU8sY0FBYyxXQUFjLDJDQUEyQyxDQUFDLENBQUM7QUFFaEYsSUFBTyxTQUFTLFdBQWUsOEJBQThCLENBQUMsQ0FBQztBQUUvRCxBQUdBOztHQURHO0lBQ0csa0JBQWtCO0lBTXZCQSxTQU5LQSxrQkFBa0JBO1FBQXhCQyxpQkF3RkNBO1FBaEZDQSxLQUFLQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUMzQkEsS0FBS0EsQ0FBQ0EsWUFBWUEsR0FB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QUN0QkEsS0FBS0EsQ0FBQ0E7Z0JBRVBBLEtBQUtBLGNBQWNBLENBQUNBLFNBQVNBO29CQUM1QkEsS0FBS0EsQ0FBQ0E7WUFDUkEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFDRkwseUJBQUNBO0FBQURBLENBeEZBLEFBd0ZDQSxJQUFBIiwiZmlsZSI6Im1hdGVyaWFscy9NYXRlcmlhbEVudk1hcFRlc3QuanMiLCJzb3VyY2VSb290IjoiLi90ZXN0cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldEV2ZW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvQXNzZXRFdmVudFwiKTtcbmltcG9ydCBMb2FkZXJFdmVudFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0xvYWRlckV2ZW50XCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgQXNzZXRMaWJyYXJ5XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TGlicmFyeVwiKTtcbmltcG9ydCBMb2FkZXJcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Mb2FkZXJcIik7XG5pbXBvcnQgSUFzc2V0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCIpO1xuaW1wb3J0IERlYnVnXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0RlYnVnXCIpO1xuaW1wb3J0IFJlcXVlc3RBbmltYXRpb25GcmFtZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIpO1xuXG5pbXBvcnQgR3JhcGhpY3NcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZ3JhcGhpY3MvR3JhcGhpY3NcIik7XG5pbXBvcnQgVmlld1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL1ZpZXdcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Rpc3BsYXkvTWVzaFwiKTtcbmltcG9ydCBTa3lib3hcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9Ta3lib3hcIik7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9EZWZhdWx0UmVuZGVyZXJcIik7XG5cbmltcG9ydCBNZXRob2RNYXRlcmlhbFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvTWV0aG9kTWF0ZXJpYWxcIik7XG5cbmltcG9ydCBBV0RQYXJzZXJcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXBhcnNlcnMvbGliL0FXRFBhcnNlclwiKTtcblxuLyoqXG4gKlxuICovXG5jbGFzcyBNYXRlcmlhbEVudk1hcFRlc3Rcbntcblx0cHJpdmF0ZSBfdmlldzpWaWV3O1xuXHRwcml2YXRlIF90aW1lcjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgX3RvcnVzOk1lc2g7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0RGVidWcuTE9HX1BJX0VSUk9SUyA9IHRydWU7XG5cdFx0RGVidWcuVEhST1dfRVJST1JTID0gZmFsc2U7XG5cblx0XHRBc3NldExpYnJhcnkuZW5hYmxlUGFyc2VyKEFXRFBhcnNlcikgO1xuXG5cdFx0dmFyIHNlc3Npb246TG9hZGVyID0gQXNzZXRMaWJyYXJ5LmdldExvYWRlcigpO1xuXHRcdHNlc3Npb24uYWRkRXZlbnRMaXN0ZW5lcihMb2FkZXJFdmVudC5MT0FEX0NPTVBMRVRFLCAoZXZlbnQ6TG9hZGVyRXZlbnQpID0+IHRoaXMub25Mb2FkQ29tcGxldGUoZXZlbnQpKTtcblx0XHRzZXNzaW9uLmFkZEV2ZW50TGlzdGVuZXIoQXNzZXRFdmVudC5BU1NFVF9DT01QTEVURSwgKGV2ZW50OkFzc2V0RXZlbnQpID0+IHRoaXMub25Bc3NldENvbXBsZXRlKGV2ZW50KSk7XG5cdFx0c2Vzc2lvbi5sb2FkKG5ldyBVUkxSZXF1ZXN0KCdhc3NldHMvRW52TWFwVGVzdC5hd2QnKSk7XG5cblx0XHR0aGlzLl92aWV3ID0gbmV3IFZpZXcobmV3IERlZmF1bHRSZW5kZXJlcigpKTtcblx0XHR0aGlzLl90aW1lciA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXIsIHRoaXMpO1xuXG5cdFx0d2luZG93Lm9ucmVzaXplID0gKCkgPT4gdGhpcy5yZXNpemUoKTtcblxuXHRcdHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG5cdFx0dGhpcy5yZXNpemUoKTtcblx0fVxuXG5cdHByaXZhdGUgcmVzaXplKGV2ZW50OlVJRXZlbnQgPSBudWxsKVxuXHR7XG5cdFx0dGhpcy5fdmlldy55ID0gMDtcblx0XHR0aGlzLl92aWV3LnggPSAwO1xuXHRcdHRoaXMuX3ZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLl92aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxuXG5cdHByaXZhdGUgcmVuZGVyKGR0Om51bWJlcikgLy9hbmltYXRlIGJhc2VkIG9uIGR0IGZvciBmaXJlZm94XG5cdHtcblx0XHRpZiAodGhpcy5fdG9ydXMpXG5cdFx0XHR0aGlzLl90b3J1cy5yb3RhdGlvblkgKz0gMTtcblxuXHRcdHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cdFx0dGhpcy5fdmlldy5jYW1lcmEueiA9IC0yMDAwO1xuXHR9XG5cblx0cHVibGljIG9uQXNzZXRDb21wbGV0ZShldmVudDpBc3NldEV2ZW50KVxuXHR7XG5cdFx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXHRcdGNvbnNvbGUubG9nKCdhd2F5LmV2ZW50cy5Bc3NldEV2ZW50LkFTU0VUX0NPTVBMRVRFJywgQXNzZXRMaWJyYXJ5LmdldEFzc2V0KGV2ZW50LmFzc2V0Lm5hbWUpKTtcblx0XHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdH1cblxuXHRwdWJsaWMgb25Mb2FkQ29tcGxldGUoZXZlbnQ6TG9hZGVyRXZlbnQpXG5cdHtcblxuXHRcdGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcblx0XHRjb25zb2xlLmxvZygnYXdheS5ldmVudHMuTG9hZGVyRXZlbnQuUkVTT1VSQ0VfQ09NUExFVEUnLCBldmVudCk7XG5cdFx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXG5cdFx0dmFyIGxvYWRlcjpMb2FkZXIgPSBldmVudC50YXJnZXQ7XG5cdFx0dmFyIG51bUFzc2V0czpudW1iZXIgPSBsb2FkZXIuYmFzZURlcGVuZGVuY3kuYXNzZXRzLmxlbmd0aDtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IG51bUFzc2V0czsgKytpKSB7XG5cdFx0XHR2YXIgYXNzZXQ6SUFzc2V0ID0gbG9hZGVyLmJhc2VEZXBlbmRlbmN5LmFzc2V0c1tpXTtcblxuXHRcdFx0Y29uc29sZS5sb2coYXNzZXQuYXNzZXRUeXBlKTtcblxuXHRcdFx0c3dpdGNoIChhc3NldC5hc3NldFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBTa3lib3guYXNzZXRUeXBlOlxuXG5cdFx0XHRcdFx0dmFyIHNreWJveDpTa3lib3ggPSA8U2t5Ym94PiBhc3NldDtcblx0XHRcdFx0XHR0aGlzLl92aWV3LnNjZW5lLmFkZENoaWxkKHNreWJveCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBNZXNoLmFzc2V0VHlwZTpcblxuXHRcdFx0XHRcdHRoaXMuX3RvcnVzID0gPE1lc2g+IGFzc2V0O1xuXHRcdFx0XHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQodGhpcy5fdG9ydXMpO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBHcmFwaGljcy5hc3NldFR5cGU6XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBNZXRob2RNYXRlcmlhbC5hc3NldFR5cGU6XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59Il19