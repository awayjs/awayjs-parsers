import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import LoaderEvent					= require("awayjs-core/lib/events/LoaderEvent");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AssetLibrary					= require("awayjs-core/lib/library/AssetLibrary");
import AssetLoader					= require("awayjs-core/lib/library/AssetLoader");
import AssetLoaderToken				= require("awayjs-core/lib/library/AssetLoaderToken");
import AssetType					= require("awayjs-core/lib/library/AssetType");
import IAsset						= require("awayjs-core/lib/library/IAsset");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import Debug						= require("awayjs-core/lib/utils/Debug");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");

import View							= require("awayjs-display/lib/containers/View");
import DirectionalLight				= require("awayjs-display/lib/entities/DirectionalLight");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import StaticLightPicker			= require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");

import DefaultRenderer				= require("awayjs-renderergl/lib/DefaultRenderer");

import MethodMaterial				= require("awayjs-methodmaterials/lib/MethodMaterial");
import MethodRendererPool			= require("awayjs-methodmaterials/lib/pool/MethodRendererPool");

import AWDParser					= require("awayjs-parsers/lib/AWDParser");

class AWDSuzanne
{
	private _view:View;
	private _token:AssetLoaderToken;
	private _timer:RequestAnimationFrame;
	private _suzanne:Mesh;
	private _light:DirectionalLight;
	private _lightPicker:StaticLightPicker;
	private lookAtPosition:Vector3D = new Vector3D();
	private _cameraIncrement:number = 0;

	constructor()
	{
		Debug.LOG_PI_ERRORS = true;
		Debug.THROW_ERRORS = false;

		AssetLibrary.enableParser(AWDParser) ;

		this._token = AssetLibrary.load(new URLRequest('assets/suzanne.awd'));
		this._token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));
		this._token.addEventListener(AssetEvent.ASSET_COMPLETE, (event:AssetEvent) => this.onAssetComplete(event));

		this._view = new View(new DefaultRenderer(MethodRendererPool));
		this._view.camera.projection.far  = 6000;
		this._timer = new RequestAnimationFrame(this.render, this);

		this._light = new DirectionalLight();
		this._light.color = 0x683019;//683019;
		this._light.direction = new Vector3D( 1 , 0 ,0 );
		this._light.ambient = 0.1;//0.05;//.4;
		this._light.ambientColor = 0x85b2cd;//4F6877;//313D51;
		this._light.diffuse = 2.8;
		this._light.specular = 1.8;
		this._view.scene.addChild(this._light);

		this._lightPicker = new StaticLightPicker([this._light]);

		window.onresize = (event:UIEvent) => this.resize(event);

		this._timer.start();
		this.resize();
	}

	private resize(event:UIEvent = null)
	{
		this._view.y = 0;
		this._view.x = 0;
		this._view.width = window.innerWidth;
		this._view.height = window.innerHeight;
	}

	private render(dt:number) //animate based on dt for firefox
	{
		if (this._view.camera) {
			this._view.camera.lookAt(this.lookAtPosition) ;
			this._cameraIncrement += 0.01;
			this._view.camera.x = Math.cos(this._cameraIncrement)*1400;
			this._view.camera.z = Math.sin(this._cameraIncrement)*1400;

			this._light.x = Math.cos(this._cameraIncrement)*1400;
			this._light.y = Math.sin(this._cameraIncrement)*1400;
		}

		this._view.render();
	}

	public onAssetComplete(event:AssetEvent)
	{
		console.log('------------------------------------------------------------------------------');
		console.log('away.events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
		console.log('------------------------------------------------------------------------------');
	}

	public onResourceComplete(event:LoaderEvent)
	{
		console.log('------------------------------------------------------------------------------');
		console.log('away.events.LoaderEvent.RESOURCE_COMPLETE' , event);
		console.log('------------------------------------------------------------------------------');

		var loader:AssetLoader = <AssetLoader> event.target;
		var numAssets:number = loader.baseDependency.assets.length;

		for(var i:number = 0; i < numAssets; ++i) {
			var asset:IAsset = loader.baseDependency.assets[i];

			switch (asset.assetType) {
				case AssetType.MESH:

					this._suzanne = <Mesh> asset;

					(<MethodMaterial> this._suzanne.material).lightPicker = this._lightPicker;
					this._suzanne.y = -100;


					for ( var c : number = 0 ; c < 80 ; c ++ )
					{
						var scale:number = this.getRandom( 50 , 200 );
						var clone:Mesh = <Mesh> this._suzanne.clone();
							clone.x = this.getRandom(-2000 , 2000);
							clone.y = this.getRandom(-2000 , 2000);
							clone.z = this.getRandom(-2000 , 2000);
							clone.transform.scale = new Vector3D(scale, scale, scale);
							clone.rotationY = this.getRandom(0 , 360);
						this._view.scene.addChild( clone );

					}

					this._suzanne.transform.scale = new Vector3D(500, 500, 500);

					this._view.scene.addChild(this._suzanne);

					break;

				case AssetType.GEOMETRY:
					break;

				case AssetType.MATERIAL:

					break;
			}
		}
	}

	private getRandom(min:number, max:number):number
	{
		return Math.random()*(max - min) + min;
	}
}